"use server";

/* Server Actions — inscription / désinscription aux événements */
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";

export async function registerForEvent(eventId: string) {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);
  if (member.statut !== "approved") throw new Error("Accès refusé");

  const supabase = await createClient();
  await supabase
    .from("event_registrations")
    .upsert(
      { event_id: eventId, member_id: member.id },
      { onConflict: "event_id,member_id" }
    );

  revalidatePath("/agenda");
  revalidatePath("/admin/evenements");
}

export async function unregisterFromEvent(eventId: string) {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  const supabase = await createClient();
  await supabase
    .from("event_registrations")
    .delete()
    .eq("event_id", eventId)
    .eq("member_id", member.id);

  revalidatePath("/agenda");
  revalidatePath("/admin/evenements");
}
