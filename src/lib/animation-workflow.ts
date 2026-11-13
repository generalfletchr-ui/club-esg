/* Circuit des propositions d'animation : envoi, ajustement, décisions admin.
 * Reçoit le client Supabase de l'appelant (droits RLS de la personne connectée)
 * pour rester testable sans base réelle. */
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ANIMATION_FORMATS,
  canTransition,
  formatDateLongue,
  formatHeure,
  parisDateTimeToISO,
  agendaEntries,
  takenDates,
  type AgendaEntry,
  validateProposal,
  type AnimationStatut,
  type ProposalInput,
} from "@/lib/animations";
import {
  buildAdminAnimationNotification,
  buildAnimationAdjustEmail,
  buildAnimationReceivedEmail,
  buildAnimationRefusedEmail,
  buildAnimationValidatedEmail,
  sendAnimationEmail,
} from "@/lib/resend";

/* Réglage app_settings qui pointe vers le modèle PowerPoint du Club */
export const TEMPLATE_SETTING_KEY = "modele_presentation";
export const RESSOURCES_BUCKET = "club-ressources";

interface Person {
  id: string;
  prenom: string;
  nom: string;
  email: string;
}

/** Événements à venir de l'agenda du Club (webinaires, afterworks, ateliers) */
export async function fetchAgenda(db: SupabaseClient): Promise<AgendaEntry[]> {
  const { data } = await db
    .from("events")
    .select("date_heure, titre, type_event")
    .gte("date_heure", new Date().toISOString());
  return agendaEntries(data ?? []);
}

/** Dates déjà prises : tout jour ayant un événement à venir dans l'agenda */
export async function fetchTakenDates(db: SupabaseClient): Promise<string[]> {
  return takenDates(await fetchAgenda(db));
}

type Result = { error?: string; errors?: Record<string, string>; warning?: string; id?: string };

async function adminEmails(db: SupabaseClient): Promise<string[]> {
  const { data } = await db
    .from("members")
    .select("email")
    .eq("role", "admin")
    .eq("statut", "approved");
  return (data ?? []).map((a: { email: string }) => a.email).filter(Boolean);
}

function notifyAdmins(
  emails: string[],
  member: Person,
  p: { titre: string; format: keyof typeof ANIMATION_FORMATS; theme: string; theme_autre: string | null; date_souhaitee: string; heure: string },
  ajustee: boolean
) {
  return sendAnimationEmail(
    buildAdminAnimationNotification(emails, {
      prenom: member.prenom,
      nom: member.nom,
      titre: p.titre,
      formatLabel: ANIMATION_FORMATS[p.format].label,
      theme: p.theme === "Autre" && p.theme_autre ? `Autre : ${p.theme_autre}` : p.theme,
      dateLongue: formatDateLongue(p.date_souhaitee),
      heure: formatHeure(p.heure),
      ajustee,
    })
  ).catch(() => {});
}

/** Nouvelle proposition d'un membre : statut « En attente » + mails */
export async function submitProposal(
  db: SupabaseClient,
  member: Person,
  input: ProposalInput,
  today: string
): Promise<Result> {
  const check = validateProposal(input, today, await fetchTakenDates(db));
  if ("errors" in check) return { errors: check.errors };

  const { data: created, error } = await db
    .from("animation_proposals")
    .insert({
      ...check.data,
      member_id: member.id,
      statut: "en_attente",
      engagement_le: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !created) return { error: "L'envoi a échoué. Réessaie dans quelques instants." };

  await sendAnimationEmail(
    buildAnimationReceivedEmail({ email: member.email, prenom: member.prenom, titre: check.data.titre })
  ).catch(() => {});
  await notifyAdmins(await adminEmails(db), member, check.data, false);

  return { id: created.id };
}

/** Proposition « À ajuster » modifiée par son auteur : retour « En attente » */
export async function resubmitProposal(
  db: SupabaseClient,
  member: Person,
  proposalId: string,
  input: ProposalInput,
  today: string
): Promise<Result> {
  const { data: current } = await db
    .from("animation_proposals")
    .select("member_id, statut")
    .eq("id", proposalId)
    .single();

  if (!current || current.member_id !== member.id) return { error: "Proposition introuvable." };
  if (!canTransition(current.statut as AnimationStatut, "en_attente", "membre")) {
    return { error: "Cette proposition ne peut plus être modifiée." };
  }

  const check = validateProposal(input, today, await fetchTakenDates(db));
  if ("errors" in check) return { errors: check.errors };

  const { error } = await db
    .from("animation_proposals")
    .update({
      ...check.data,
      statut: "en_attente",
      engagement_le: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", proposalId);

  if (error) return { error: "L'enregistrement a échoué. Réessaie dans quelques instants." };

  await notifyAdmins(await adminEmails(db), member, check.data, true);
  return { id: proposalId };
}

export type AdminDecision =
  | { type: "valider"; lienInscription: string }
  | { type: "ajuster"; message: string }
  | { type: "refuser"; message: string };

const DECISION_STATUT: Record<AdminDecision["type"], AnimationStatut> = {
  valider: "validee",
  ajuster: "a_ajuster",
  refuser: "refusee",
};

/** Modèle PowerPoint du Club, s'il a été déposé par un admin */
async function loadTemplate(db: SupabaseClient): Promise<{ filename: string; content: Buffer } | null> {
  const { data: setting } = await db
    .from("app_settings")
    .select("value")
    .eq("key", TEMPLATE_SETTING_KEY)
    .maybeSingle();
  const path = setting?.value as string | undefined;
  if (!path) return null;

  const { data: file } = await db.storage.from(RESSOURCES_BUCKET).download(path);
  if (!file) return null;
  return {
    filename: path.split("/").pop() ?? "modele-presentation.pptx",
    content: Buffer.from(await file.arrayBuffer()),
  };
}

/** Valider, demander un ajustement ou refuser une proposition (admin) */
export async function decideProposal(
  db: SupabaseClient,
  adminId: string,
  proposalId: string,
  decision: AdminDecision
): Promise<Result> {
  const { data: p } = await db
    .from("animation_proposals")
    .select("*")
    .eq("id", proposalId)
    .single();
  if (!p) return { error: "Proposition introuvable." };

  const target = DECISION_STATUT[decision.type];
  if (!canTransition(p.statut as AnimationStatut, target, "admin")) {
    return { error: "Cette proposition a déjà été traitée." };
  }

  const { data: author } = await db
    .from("members")
    .select("prenom, nom, email")
    .eq("id", p.member_id)
    .single();
  if (!author) return { error: "L'auteur de la proposition est introuvable." };

  const traitement = { traite_par: adminId, traite_le: new Date().toISOString(), updated_at: new Date().toISOString() };

  /* Ajustement ou refus : message obligatoire, pas d'événement d'agenda */
  if (decision.type !== "valider") {
    const message = decision.message.trim();
    if (!message) return { error: "Le message au membre est obligatoire." };

    const { error } = await db
      .from("animation_proposals")
      .update({ statut: target, message_admin: message, ...traitement })
      .eq("id", proposalId);
    if (error) return { error: "L'enregistrement a échoué." };

    const info = { email: author.email, prenom: author.prenom, titre: p.titre, message };
    await sendAnimationEmail(
      decision.type === "ajuster"
        ? buildAnimationAdjustEmail({ ...info, proposalId })
        : buildAnimationRefusedEmail(info)
    ).catch(() => {});
    return {};
  }

  /* Validation */
  const lien = decision.lienInscription.trim();
  if (!/^https?:\/\/\S+$/.test(lien)) return { error: "Indique un lien d'inscription valide (https://…)." };

  const heure = String(p.heure).slice(0, 5);
  const dateHeure = parisDateTimeToISO(p.date_souhaitee, heure);
  const creneau = `${formatDateLongue(p.date_souhaitee)} à ${formatHeure(heure)}`;

  /* Conflit de créneau : autre animation validée ou événement déjà à l'agenda */
  const { data: autres } = await db
    .from("animation_proposals")
    .select("id")
    .eq("statut", "validee")
    .eq("date_souhaitee", p.date_souhaitee)
    .eq("heure", heure)
    .neq("id", proposalId);
  if (autres && autres.length > 0) {
    return { error: `Conflit : une autre animation est déjà validée le ${creneau}.` };
  }

  const { data: events } = await db.from("events").select("titre").eq("date_heure", dateHeure);
  if (events && events.length > 0) {
    return { error: `Conflit : l'événement « ${events[0].titre} » est déjà prévu le ${creneau}.` };
  }

  /* Seuls le nom de l'intervenant, le titre, le thème et la date sont rendus visibles */
  const intervenants = [{ nom: `${author.prenom} ${author.nom}`, url: "" }];
  if (p.coanimateur_nom) intervenants.push({ nom: p.coanimateur_nom, url: "" });

  const format = p.format as keyof typeof ANIMATION_FORMATS;
  const { data: event, error: eventError } = await db
    .from("events")
    .insert({
      titre: p.titre,
      date_heure: dateHeure,
      description: `${format === "webinaire" ? "Webinaire" : "Atelier"} animé par ${author.prenom} ${author.nom}. Thème : ${p.theme === "Autre" && p.theme_autre ? p.theme_autre : p.theme}.`,
      type_event: ANIMATION_FORMATS[format].eventType,
      lien_inscription: lien,
      intervenants,
      cree_par: adminId,
    })
    .select("id")
    .single();
  if (eventError || !event) return { error: "La création de l'événement dans l'agenda a échoué." };

  const { error } = await db
    .from("animation_proposals")
    .update({ statut: "validee", event_id: event.id, message_admin: null, ...traitement })
    .eq("id", proposalId);
  if (error) {
    /* Créneau pris entre-temps (index unique) : on annule l'événement créé */
    await db.from("events").delete().eq("id", event.id);
    return { error: `Conflit : ce créneau (${creneau}) vient d'être validé pour une autre animation.` };
  }

  const template = await loadTemplate(db);
  await sendAnimationEmail(
    buildAnimationValidatedEmail(
      {
        email: author.email,
        prenom: author.prenom,
        titre: p.titre,
        format,
        dateLongue: formatDateLongue(p.date_souhaitee),
        heure: formatHeure(heure),
      },
      template ?? undefined
    )
  ).catch(() => {});

  return template
    ? {}
    : { warning: "Animation validée, mais aucun modèle de présentation n'est déposé : le mail est parti sans pièce jointe." };
}
