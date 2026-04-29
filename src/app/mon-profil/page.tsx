import { redirect } from "next/navigation";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import MonProfilClient from "@/components/features/MonProfilClient";

export default async function MonProfilPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.statut !== "approved") redirect("/en-attente");

  const isAdmin = member.role === "admin";

  return (
    <AppLayout isAdmin={isAdmin}>
      <MonProfilClient member={member} />
    </AppLayout>
  );
}
