import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import ReplaysClient from "@/components/features/ReplaysClient";
import type { Replay } from "@/types";

export default async function ReplaysPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.statut !== "approved") redirect("/en-attente");

  const isAdmin  = member.role === "admin";
  const supabase = await createClient();

  /* Tous les replays, du plus récent au plus ancien */
  const { data: replays } = await supabase
    .from("replays")
    .select("*")
    .order("date_event", { ascending: false });

  return (
    <AppLayout isAdmin={isAdmin}>
      <ReplaysClient replays={(replays ?? []) as Replay[]} />
    </AppLayout>
  );
}
