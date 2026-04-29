/* Admin — Export CSV des membres pour import HubSpot */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import ExportCsvClient from "@/components/features/ExportCsvClient";

export default async function AdminExportCsvPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  /* Compteurs pour l'affichage */
  const { count: totalApproved } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("statut", "approved");

  return (
    <AppLayout isAdmin>
      <ExportCsvClient totalApproved={totalApproved ?? 0} />
    </AppLayout>
  );
}
