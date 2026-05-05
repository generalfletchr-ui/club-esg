/* Admin — Modération des missions */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import AdminMissionsClient from "@/components/features/AdminMissionsClient";
import type { Mission } from "@/types";

export default async function AdminMissionsPage() {
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.role !== "admin") redirect("/dashboard");

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
    .in("statut", ["pending", "published", "rejected"])
    .order("created_at", { ascending: false });

  return (
    <AppLayout isAdmin>
      <AdminMissionsClient missions={(missions ?? []) as unknown as Mission[]} />
    </AppLayout>
  );
}
