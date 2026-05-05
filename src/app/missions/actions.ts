"use server";

/* Server Actions — Job Board missions */
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import {
  sendMissionInterestEmail,
  type MissionRepondant,
} from "@/lib/resend";

/** Données du formulaire de création / édition */
export interface MissionFormData {
  type_mission: string;
  titre: string;
  description: string;
  domaine: string;
  secteur_client?: string;
  expertises_requises: string[];
  type_prestation?: string;
  duree_estimee?: string;
  modalite?: string;
  localisation?: string;
  budget?: string;
  expire_le?: string; // ISO date string
}

/** Vérifie que l'appelant est un membre approuvé */
async function requireApproved() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);
  if (member.statut !== "approved") {
    throw new Error("Accès réservé aux membres approuvés");
  }
  return { supabase: await createClient(), userId: user.id, member };
}

/* ── Création ───────────────────────────────────────────────── */

export async function createMission(data: MissionFormData) {
  const { supabase, userId } = await requireApproved();

  const expireAt = data.expire_le
    ? new Date(data.expire_le).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("missions").insert({
    poste_par:           userId,
    type_mission:        data.type_mission,
    titre:               data.titre.trim(),
    description:         data.description.trim(),
    domaine:             data.domaine,
    secteur_client:      data.secteur_client || null,
    expertises_requises: data.expertises_requises,
    type_prestation:     data.type_prestation || null,
    duree_estimee:       data.duree_estimee?.trim() || null,
    modalite:            data.modalite || null,
    localisation:        data.localisation?.trim() || null,
    budget:              data.budget?.trim() || null,
    statut:              "pending",
    expire_le:           expireAt,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/mes-missions");
  return { success: true };
}

/* ── Modification ───────────────────────────────────────────── */

export async function updateMission(missionId: string, data: MissionFormData) {
  const { supabase, userId } = await requireApproved();

  /* Vérifier que la fiche appartient au membre et est encore pending */
  const { data: existing } = await supabase
    .from("missions")
    .select("poste_par, statut")
    .eq("id", missionId)
    .single();

  if (!existing || existing.poste_par !== userId) {
    throw new Error("Fiche introuvable");
  }
  if (!["pending", "rejected"].includes(existing.statut)) {
    throw new Error("Cette fiche ne peut plus être modifiée");
  }

  const expireAt = data.expire_le
    ? new Date(data.expire_le).toISOString()
    : undefined;

  await supabase
    .from("missions")
    .update({
      type_mission:        data.type_mission,
      titre:               data.titre.trim(),
      description:         data.description.trim(),
      domaine:             data.domaine,
      secteur_client:      data.secteur_client || null,
      expertises_requises: data.expertises_requises,
      type_prestation:     data.type_prestation || null,
      duree_estimee:       data.duree_estimee?.trim() || null,
      modalite:            data.modalite || null,
      localisation:        data.localisation?.trim() || null,
      budget:              data.budget?.trim() || null,
      statut:              "pending", // repasse en attente de validation
      updated_at:          new Date().toISOString(),
      ...(expireAt ? { expire_le: expireAt } : {}),
    })
    .eq("id", missionId);

  revalidatePath("/mes-missions");
  return { success: true };
}

/* ── Marquer pourvue ────────────────────────────────────────── */

export async function closeMission(missionId: string) {
  const { supabase, userId } = await requireApproved();

  const { data: existing } = await supabase
    .from("missions")
    .select("poste_par")
    .eq("id", missionId)
    .single();

  if (!existing || existing.poste_par !== userId) {
    throw new Error("Fiche introuvable");
  }

  await supabase
    .from("missions")
    .update({ statut: "pourvue", updated_at: new Date().toISOString() })
    .eq("id", missionId);

  revalidatePath("/mes-missions");
  revalidatePath("/missions");
}

/* ── Suppression ────────────────────────────────────────────── */

export async function deleteMission(missionId: string) {
  const { supabase, userId } = await requireApproved();

  const { data: existing } = await supabase
    .from("missions")
    .select("poste_par, statut")
    .eq("id", missionId)
    .single();

  if (!existing || existing.poste_par !== userId) {
    throw new Error("Fiche introuvable");
  }
  if (!["pending", "rejected"].includes(existing.statut)) {
    throw new Error("Seules les fiches en attente ou refusées peuvent être supprimées");
  }

  await supabase.from("missions").delete().eq("id", missionId);

  revalidatePath("/mes-missions");
}

/* ── Répondre à une mission ─────────────────────────────────── */

export async function respondToMission(missionId: string) {
  const { supabase, member: repondantMember } = await requireApproved();

  /* Récupérer la mission + le profil du posteur */
  const { data: mission } = await supabase
    .from("missions")
    .select("titre, poste_par, statut")
    .eq("id", missionId)
    .single();

  if (!mission || mission.statut !== "published") {
    throw new Error("Mission introuvable");
  }

  /* Empêcher de répondre à sa propre fiche */
  if (mission.poste_par === repondantMember.id) {
    throw new Error("Vous ne pouvez pas répondre à votre propre fiche");
  }

  const { data: posteur } = await supabase
    .from("members")
    .select("email, prenom")
    .eq("id", mission.poste_par)
    .single();

  if (!posteur?.email || !posteur?.prenom) {
    throw new Error("Posteur introuvable");
  }

  const repondant: MissionRepondant = {
    prenom:     repondantMember.prenom,
    nom:        repondantMember.nom,
    entreprise: repondantMember.entreprise,
    expertises: repondantMember.expertises,
    linkedin:   repondantMember.linkedin,
    profil_url: `https://club.fletchr.fr/annuaire`,
  };

  await sendMissionInterestEmail(
    posteur.email,
    posteur.prenom,
    mission.titre,
    repondant
  ).catch(() => {});

  return { success: true };
}
