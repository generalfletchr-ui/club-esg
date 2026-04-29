/* Admin — Gestion des événements */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import AdminEvenementsClient from "@/components/features/AdminEvenementsClient";
import type { Event } from "@/types";

export default async function AdminEvenementsPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date_heure", { ascending: false });

  return (
    <AppLayout isAdmin>
      <AdminEvenementsClient events={(events as Event[]) ?? []} />
    </AppLayout>
  );
}
