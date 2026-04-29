/* Admin — Liste complète des membres */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import AdminMembresClient from "@/components/features/AdminMembresClient";
import type { Member } from "@/types";

export default async function AdminMembresPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("date_inscription", { ascending: false });

  return (
    <AppLayout isAdmin>
      <AdminMembresClient members={(members as Member[]) ?? []} />
    </AppLayout>
  );
}
