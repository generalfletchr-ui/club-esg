import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/types";

/**
 * Récupère l'utilisateur Auth connecté.
 * Redirige vers /connexion si non authentifié.
 */
export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  return user;
}

/**
 * Récupère le profil complet du membre depuis la table members.
 * Redirige vers /connexion si le profil n'existe pas.
 */
export async function getMemberProfile(userId: string): Promise<Member> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    redirect("/connexion");
  }

  return data as Member;
}

/**
 * Calcule le pourcentage de complétion d'un profil membre.
 * Les champs obligatoires valent 70%, les champs optionnels 30%.
 */
export function calcProfileCompletion(member: Member): number {
  let score = 70; // champs obligatoires toujours remplis à l'inscription

  if (member.photo_url)              score += 15;
  if (member.linkedin)               score += 10;
  if (member.telephone)              score += 5;

  return Math.min(score, 100);
}
