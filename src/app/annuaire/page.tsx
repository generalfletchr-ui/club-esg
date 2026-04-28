import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import AnnuaireClient from "@/components/features/AnnuaireClient";
import type { Member } from "@/types";

export default async function AnnuairePage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.statut !== "approved") redirect("/en-attente");

  const isAdmin  = member.role === "admin";
  const supabase = await createClient();

  /* Récupère tous les membres approuvés */
  const { data: members } = await supabase
    .from("members")
    .select(
      "id, prenom, nom, photo_url, type_membre, fonction, entreprise, secteur, ville, expertises, date_inscription"
    )
    .eq("statut", "approved")
    .order("date_inscription", { ascending: false });

  return (
    <AppLayout isAdmin={isAdmin}>
      <AnnuaireClient members={(members ?? []) as Member[]} />
    </AppLayout>
  );
}
