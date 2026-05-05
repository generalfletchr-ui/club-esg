/* Job Board — Opportunités de missions */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import MissionsClient from "@/components/features/MissionsClient";
import type { Mission } from "@/types";

export default async function MissionsPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.statut !== "approved") redirect("/en-attente");

  const isAdmin  = member.role === "admin";
  const supabase = await createClient();

  const { data: missions } = await supabase
    .from("missions")
    .select(`
      id, poste_par, type_mission, titre, description, domaine,
      secteur_client, expertises_requises, type_prestation,
      duree_estimee, modalite, localisation, budget,
      statut, expire_le, created_at,
      membre:poste_par (id, prenom, nom, photo_url, entreprise, expertises)
    `)
    .eq("statut", "published")
    .gt("expire_le", new Date().toISOString())
    .order("created_at", { ascending: false });

  return (
    <AppLayout isAdmin={isAdmin}>
      <MissionsClient missions={(missions ?? []) as Mission[]} />
    </AppLayout>
  );
}
