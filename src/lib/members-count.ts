import { createClient } from "@supabase/supabase-js";

/* Valeur affichée si la base ne répond pas */
const FALLBACK_LABEL = "80+";

/**
 * Nombre de membres validés, pour la page d'accueil publique.
 * Arrondi à la dizaine inférieure : 87 membres → "80+".
 *
 * S'appuie sur la fonction SQL count_active_members() (migration 006),
 * qui ne renvoie qu'un nombre, jamais de données personnelles.
 * Client sans session : la page reste statique et accessible aux visiteurs.
 */
export async function getActiveMembersLabel(): Promise<string> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data, error } = await supabase.rpc("count_active_members");
    if (error || typeof data !== "number") return FALLBACK_LABEL;

    if (data < 10) return String(data);
    return `${Math.floor(data / 10) * 10}+`;
  } catch {
    return FALLBACK_LABEL;
  }
}
