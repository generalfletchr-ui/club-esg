/* Admin — Gestion des demandes d'inscription */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import AdminDemandesClient from "@/components/features/AdminDemandesClient";
import type { Member } from "@/types";

export default async function AdminDemandesPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  /* Toutes les demandes triées : en attente d'abord, puis par date */
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("date_inscription", { ascending: false });

  return (
    <AppLayout isAdmin>
      <AdminDemandesClient members={(members as Member[]) ?? []} />
    </AppLayout>
  );
}
