"use server";

/* Server Actions pour le back-office admin */
import { revalidatePath } from "next/cache";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import {
  sendApprovalEmail,
  sendRejectionEmail,
  sendMissionPublishedEmail,
  sendMissionRejectedEmail,
} from "@/lib/resend";

/** Vérifie que l'appelant est admin — lève une erreur sinon */
async function requireAdmin() {
  const user = await getAuthUser();
  const member = await getMemberProfile(user.id);
  if (member.role !== "admin") {
    throw new Error("Accès refusé");
  }
  return { supabase: await createClient(), adminId: user.id };
}

/* ── Demandes ──────────────────────────────────────────────── */

export async function approveMember(memberId: string) {
  const { supabase, adminId } = await requireAdmin();

  /* Récupérer email + prénom avant la mise à jour */
  const { data: m } = await supabase
    .from("members")
    .select("email, prenom")
    .eq("id", memberId)
    .single();

  await supabase
    .from("members")
    .update({
      statut: "approved",
      role: "member",
      approuve_par: adminId,
      approuve_le: new Date().toISOString(),
    })
    .eq("id", memberId);

  if (m?.email && m?.prenom) {
    await sendApprovalEmail(m.email, m.prenom).catch(() => {});
  }

  revalidatePath("/admin/demandes");
  revalidatePath("/admin/membres");
}

export async function rejectMember(memberId: string) {
  const { supabase } = await requireAdmin();

  const { data: m } = await supabase
    .from("members")
    .select("email, prenom")
    .eq("id", memberId)
    .single();

  await supabase
    .from("members")
    .update({ statut: "rejected", role: "pending" })
    .eq("id", memberId);

  if (m?.email && m?.prenom) {
    await sendRejectionEmail(m.email, m.prenom).catch(() => {});
  }

  revalidatePath("/admin/demandes");
  revalidatePath("/admin/membres");
}

/** Passe un membre en admin */
export async function promoteToAdmin(memberId: string) {
  const { supabase } = await requireAdmin();

  await supabase
    .from("members")
    .update({ role: "admin" })
    .eq("id", memberId);

  revalidatePath("/admin/membres");
}

/** Suspend un membre (statut rejected) */
export async function suspendMember(memberId: string) {
  const { supabase } = await requireAdmin();

  await supabase
    .from("members")
    .update({ statut: "rejected" })
    .eq("id", memberId);

  revalidatePath("/admin/membres");
}

/**
 * Retire définitivement un membre du club : compte, profil et photo.
 * Irréversible. Le profil (et ses missions) part en cascade avec le compte.
 * Les admins ne sont pas retirables : leur compte est référencé par
 * les événements, replays et validations qu'ils ont créés.
 */
export async function removeMember(memberId: string): Promise<{ error?: string }> {
  const { supabase, adminId } = await requireAdmin();

  if (memberId === adminId) {
    return { error: "Tu ne peux pas te retirer toi-même du club." };
  }

  const { data: m } = await supabase
    .from("members")
    .select("role")
    .eq("id", memberId)
    .single();

  if (m?.role === "admin") {
    return { error: "Un admin ne peut pas être retiré du club." };
  }

  /* La suppression d'un compte demande la clé service (côté serveur uniquement) */
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  /* Photo de profil : tout le dossier du membre dans le bucket avatars */
  const { data: files } = await service.storage.from("avatars").list(memberId);
  if (files && files.length > 0) {
    await service.storage
      .from("avatars")
      .remove(files.map((f) => `${memberId}/${f.name}`));
  }

  const { error } = await service.auth.admin.deleteUser(memberId);
  if (error) {
    return { error: "La suppression a échoué. Réessaie ou contacte le support technique." };
  }

  revalidatePath("/admin/membres");
  revalidatePath("/admin/demandes");
  revalidatePath("/annuaire");
  return {};
}

/* ── Événements ────────────────────────────────────────────── */

/** Interprète une chaîne datetime-local comme heure Europe/Paris et retourne l'ISO UTC */
function parisLocalToISO(localStr: string): string {
  const tempUTC = new Date(localStr + ':00.000Z');
  const utcStr   = tempUTC.toLocaleString('sv-SE', { timeZone: 'UTC' });
  const parisStr = tempUTC.toLocaleString('sv-SE', { timeZone: 'Europe/Paris' });
  const offsetMs = new Date(parisStr.replace(' ', 'T') + 'Z').getTime()
                 - new Date(utcStr.replace(' ', 'T') + 'Z').getTime();
  return new Date(tempUTC.getTime() - offsetMs).toISOString();
}

export async function createEvent(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();

  await supabase.from("events").insert({
    titre: formData.get("titre") as string,
    date_heure: parisLocalToISO(formData.get("date_heure") as string),
    description: formData.get("description") as string,
    type_event: formData.get("type_event") as string,
    lien_inscription: formData.get("lien_inscription") as string,
    image_url: (formData.get("image_url") as string) || null,
    intervenants: JSON.parse((formData.get("intervenants") as string) || "[]"),
    adresse: (formData.get("adresse") as string) || null,
    cree_par: adminId,
  });

  revalidatePath("/admin/evenements");
  revalidatePath("/agenda");
  revalidatePath("/dashboard");
}

export async function updateEvent(eventId: string, formData: FormData) {
  await requireAdmin();
  const { supabase } = await requireAdmin();

  await supabase
    .from("events")
    .update({
      titre: formData.get("titre") as string,
      date_heure: parisLocalToISO(formData.get("date_heure") as string),
      description: formData.get("description") as string,
      type_event: formData.get("type_event") as string,
      lien_inscription: formData.get("lien_inscription") as string,
      image_url: (formData.get("image_url") as string) || null,
      intervenants: JSON.parse((formData.get("intervenants") as string) || "[]"),
      adresse: (formData.get("adresse") as string) || null,
    })
    .eq("id", eventId);

  revalidatePath("/admin/evenements");
  revalidatePath("/agenda");
  revalidatePath("/dashboard");
}

export async function deleteEvent(eventId: string) {
  const { supabase } = await requireAdmin();

  await supabase.from("events").delete().eq("id", eventId);

  revalidatePath("/admin/evenements");
  revalidatePath("/agenda");
  revalidatePath("/dashboard");
}

/* ── Replays ───────────────────────────────────────────────── */

export async function createReplay(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();

  await supabase.from("replays").insert({
    titre: formData.get("titre") as string,
    date_event: formData.get("date_event") as string,
    description: formData.get("description") as string,
    type_event: formData.get("type_event") as string,
    lien_replay: formData.get("lien_replay") as string,
    intervenants: (formData.get("intervenants") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    support_path: (formData.get("support_path") as string) || null,
    cree_par: adminId,
  });

  revalidatePath("/admin/replays");
  revalidatePath("/replays");
}

export async function updateReplay(replayId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { data: before } = await supabase
    .from("replays")
    .select("support_path")
    .eq("id", replayId)
    .single();

  const supportPath = (formData.get("support_path") as string) || null;

  await supabase
    .from("replays")
    .update({
      titre: formData.get("titre") as string,
      date_event: formData.get("date_event") as string,
      description: formData.get("description") as string,
      type_event: formData.get("type_event") as string,
      lien_replay: formData.get("lien_replay") as string,
      intervenants: (formData.get("intervenants") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      support_path: supportPath,
    })
    .eq("id", replayId);

  /* PDF remplacé ou retiré : supprimer l'ancien fichier */
  if (before?.support_path && before.support_path !== supportPath) {
    await supabase.storage.from("replay-supports").remove([before.support_path]);
  }

  revalidatePath("/admin/replays");
  revalidatePath("/replays");
}

export async function deleteReplay(replayId: string) {
  const { supabase } = await requireAdmin();

  const { data: replay } = await supabase
    .from("replays")
    .select("support_path")
    .eq("id", replayId)
    .single();

  await supabase.from("replays").delete().eq("id", replayId);

  if (replay?.support_path) {
    await supabase.storage.from("replay-supports").remove([replay.support_path]);
  }

  revalidatePath("/admin/replays");
  revalidatePath("/replays");
}

/* ── Missions ──────────────────────────────────────────────── */

export async function publishMission(missionId: string) {
  const { supabase, adminId } = await requireAdmin();

  const { data: mission } = await supabase
    .from("missions")
    .select("titre, poste_par")
    .eq("id", missionId)
    .single();

  await supabase
    .from("missions")
    .update({
      statut:    "published",
      valide_par: adminId,
      valide_le:  new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", missionId);

  if (mission) {
    const { data: posteur } = await supabase
      .from("members")
      .select("email, prenom")
      .eq("id", mission.poste_par)
      .single();

    if (posteur?.email && posteur?.prenom) {
      await sendMissionPublishedEmail(posteur.email, posteur.prenom, mission.titre).catch(() => {});
    }
  }

  revalidatePath("/admin/missions");
  revalidatePath("/missions");
}

export async function rejectMissionAdmin(missionId: string) {
  const { supabase } = await requireAdmin();

  const { data: mission } = await supabase
    .from("missions")
    .select("titre, poste_par")
    .eq("id", missionId)
    .single();

  await supabase
    .from("missions")
    .update({ statut: "rejected", updated_at: new Date().toISOString() })
    .eq("id", missionId);

  if (mission) {
    const { data: posteur } = await supabase
      .from("members")
      .select("email, prenom")
      .eq("id", mission.poste_par)
      .single();

    if (posteur?.email && posteur?.prenom) {
      await sendMissionRejectedEmail(posteur.email, posteur.prenom, mission.titre).catch(() => {});
    }
  }

  revalidatePath("/admin/missions");
}
