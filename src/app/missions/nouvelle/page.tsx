/* Nouvelle mission — formulaire */
import { redirect } from "next/navigation";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import NouvelleMissionForm from "@/components/features/NouvelleMissionForm";

export default async function NouvelleMissionPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.statut !== "approved") redirect("/en-attente");

  const isAdmin = member.role === "admin";

  return (
    <AppLayout isAdmin={isAdmin}>
      <NouvelleMissionForm />
    </AppLayout>
  );
}
