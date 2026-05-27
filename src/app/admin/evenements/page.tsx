/* Admin — Gestion des événements */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import AdminEvenementsClient from "@/components/features/AdminEvenementsClient";
import type { Event, EventRegistrant } from "@/types";

export default async function AdminEvenementsPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date_heure", { ascending: false });

  /* Inscriptions avec infos membres */
  const { data: regsRaw } = await supabase
    .from("event_registrations")
    .select("event_id, created_at, members(prenom, nom, email, entreprise, photo_url)")
    .order("created_at", { ascending: true });

  /* Aplatir le join Supabase (members peut être objet ou tableau selon le client) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registrations: EventRegistrant[] = (regsRaw ?? []).map((r: any) => {
    const m = Array.isArray(r.members) ? r.members[0] : r.members;
    return {
      event_id:   r.event_id   as string,
      created_at: r.created_at as string,
      prenom:     m?.prenom    ?? "",
      nom:        m?.nom       ?? "",
      email:      m?.email     ?? "",
      entreprise: m?.entreprise ?? "",
      photo_url:  m?.photo_url  ?? null,
    };
  });

  return (
    <AppLayout isAdmin>
      <AdminEvenementsClient
        events={(events as Event[]) ?? []}
        registrations={registrations}
      />
    </AppLayout>
  );
}
