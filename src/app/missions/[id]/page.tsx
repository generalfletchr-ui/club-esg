/* Fiche détail d'une mission */
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import MissionDetailClient from "@/components/features/MissionDetailClient";
import type { Mission } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MissionDetailPage({ params }: Props) {
  const { id } = await params;

  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.statut !== "approved") redirect("/en-attente");

  const isAdmin  = member.role === "admin";
  const supabase = await createClient();

  const { data: mission } = await supabase
    .from("missions")
    .select(`
      id, poste_par, type_mission, titre, description, domaine,
      secteur_client, expertises_requises, type_prestation,
      duree_estimee, modalite, localisation, budget,
      statut, expire_le, created_at,
      membre:poste_par (id, prenom, nom, photo_url, entreprise, expertises, linkedin)
    `)
    .eq("id", id)
    .single();

  if (!mission) notFound();

  /* Un non-admin ne peut voir que les missions publiées (ou ses propres fiches) */
  if (
    !isAdmin &&
    mission.statut !== "published" &&
    mission.poste_par !== user.id
  ) {
    notFound();
  }

  const isOwner = mission.poste_par === user.id;

  return (
    <AppLayout isAdmin={isAdmin}>
      <MissionDetailClient
        mission={mission as unknown as Mission}
        currentUserId={user.id}
        isOwner={isOwner}
      />
    </AppLayout>
  );
}
