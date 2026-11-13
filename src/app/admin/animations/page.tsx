/* Admin — Propositions d'animation des membres */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import AdminAnimationsClient, { type AdminProposal } from "@/components/features/AdminAnimationsClient";
import { TEMPLATE_SETTING_KEY } from "@/lib/animation-workflow";

export default async function AdminAnimationsPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const { data } = await supabase
    .from("animation_proposals")
    .select("*, auteur:members!animation_proposals_member_id_fkey(prenom, nom, email, entreprise)")
    .order("created_at", { ascending: false });

  /* Aplatir le join Supabase (objet ou tableau selon le client) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proposals: AdminProposal[] = (data ?? []).map((p: any) => {
    const a = Array.isArray(p.auteur) ? p.auteur[0] : p.auteur;
    return {
      ...p,
      auteur: {
        prenom:     a?.prenom ?? "",
        nom:        a?.nom ?? "",
        email:      a?.email ?? "",
        entreprise: a?.entreprise ?? "",
      },
    };
  });

  const { data: template } = await supabase
    .from("app_settings")
    .select("value, updated_at")
    .eq("key", TEMPLATE_SETTING_KEY)
    .maybeSingle();

  return (
    <AppLayout isAdmin>
      <AdminAnimationsClient
        proposals={proposals}
        templateName={template?.value ? (template.value as string).split("/").pop() ?? null : null}
      />
    </AppLayout>
  );
}
