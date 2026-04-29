"use server";

/* Server Actions pour le back-office admin */
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/resend";

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

/* ── Événements ────────────────────────────────────────────── */

export async function createEvent(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();

  await supabase.from("events").insert({
    titre: formData.get("titre") as string,
    date_heure: formData.get("date_heure") as string,
    description: formData.get("description") as string,
    type_event: formData.get("type_event") as string,
    lien_inscription: formData.get("lien_inscription") as string,
    image_url: (formData.get("image_url") as string) || null,
    cree_par: adminId,
  });

  revalidatePath("/admin/evenements");
  revalidatePath("/agenda");
}

export async function updateEvent(eventId: string, formData: FormData) {
  await requireAdmin();
  const { supabase } = await requireAdmin();

  await supabase
    .from("events")
    .update({
      titre: formData.get("titre") as string,
      date_heure: formData.get("date_heure") as string,
      description: formData.get("description") as string,
      type_event: formData.get("type_event") as string,
      lien_inscription: formData.get("lien_inscription") as string,
      image_url: (formData.get("image_url") as string) || null,
    })
    .eq("id", eventId);

  revalidatePath("/admin/evenements");
  revalidatePath("/agenda");
}

export async function deleteEvent(eventId: string) {
  const { supabase } = await requireAdmin();

  await supabase.from("events").delete().eq("id", eventId);

  revalidatePath("/admin/evenements");
  revalidatePath("/agenda");
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
    cree_par: adminId,
  });

  revalidatePath("/admin/replays");
  revalidatePath("/replays");
}

export async function updateReplay(replayId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

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
    })
    .eq("id", replayId);

  revalidatePath("/admin/replays");
  revalidatePath("/replays");
}

export async function deleteReplay(replayId: string) {
  const { supabase } = await requireAdmin();

  await supabase.from("replays").delete().eq("id", replayId);

  revalidatePath("/admin/replays");
  revalidatePath("/replays");
}
