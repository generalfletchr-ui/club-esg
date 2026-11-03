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

  /* Liens temporaires (1 h) vers les supports PDF, bucket privé */
  const supportPaths = (replays ?? [])
    .map((r) => r.support_path as string | null)
    .filter((p): p is string => !!p);

  const supportUrls: Record<string, string> = {};
  if (supportPaths.length > 0) {
    const { data: signed } = await supabase.storage
      .from("replay-supports")
      .createSignedUrls(supportPaths, 3600);
    for (const s of signed ?? []) {
      if (s.path && s.signedUrl) supportUrls[s.path] = s.signedUrl;
    }
  }

  return (
    <AppLayout isAdmin={isAdmin}>
      <ReplaysClient replays={(replays ?? []) as Replay[]} supportUrls={supportUrls} />
    </AppLayout>
  );
}
