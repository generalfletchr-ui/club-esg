/* Admin — Manuel d'utilisation */
import { redirect } from "next/navigation";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import AdminManuelClient from "@/components/features/AdminManuelClient";

export default async function AdminManuelPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.role !== "admin") redirect("/dashboard");

  return (
    <AppLayout isAdmin>
      <AdminManuelClient />
    </AppLayout>
  );
}
