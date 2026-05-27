import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import AgendaClient from "@/components/features/AgendaClient";
import type { Event } from "@/types";

export default async function AgendaPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.statut !== "approved") redirect("/en-attente");

  const isAdmin  = member.role === "admin";
  const supabase = await createClient();

  /* Événements à venir uniquement */
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte("date_heure", new Date().toISOString())
    .order("date_heure", { ascending: true });

  /* Inscriptions de ce membre */
  const { data: myRegs } = await supabase
    .from("event_registrations")
    .select("event_id")
    .eq("member_id", member.id);

  const myRegistrations = (myRegs ?? []).map((r: { event_id: string }) => r.event_id);

  return (
    <AppLayout isAdmin={isAdmin}>
      <AgendaClient
        events={(events ?? []) as Event[]}
        myRegistrations={myRegistrations}
      />
    </AppLayout>
  );
}
