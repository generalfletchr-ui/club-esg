/* Admin — Gestion des replays */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import AdminReplaysClient from "@/components/features/AdminReplaysClient";
import type { Replay } from "@/types";

export default async function AdminReplaysPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const { data: replays } = await supabase
    .from("replays")
    .select("*")
    .order("date_event", { ascending: false });

  return (
    <AppLayout isAdmin>
      <AdminReplaysClient replays={(replays as Replay[]) ?? []} />
    </AppLayout>
  );
}
