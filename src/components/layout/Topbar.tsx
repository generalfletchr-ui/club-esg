"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard":         "Tableau de bord",
  "/annuaire":          "Annuaire",
  "/missions":          "Missions",
  "/mes-missions":      "Mes missions",
  "/agenda":            "Agenda",
  "/replays":           "Replays",
  "/mon-profil":        "Mon profil",
  "/admin/demandes":    "Demandes",
  "/admin/membres":     "Membres",
  "/admin/missions":    "Missions",
  "/admin/evenements":  "Événements",
  "/admin/replays":     "Replays",
  "/admin/export-csv":  "Export CSV",
};

interface TopbarProps {
  userName: string;
}

export default function Topbar({ userName }: TopbarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  const pageLabel = Object.entries(ROUTE_LABELS).find(
    ([route]) => pathname === route || pathname.startsWith(route + "/")
  )?.[1] ?? "";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/connexion");
    router.refresh();
  }

  return (
    <header
      className="flex items-center justify-between px-6 flex-shrink-0"
      style={{
        height: "var(--topbar-height, 48px)",
        background: "#ebebe6",
      }}
    >
      {/* Titre de page */}
      <span className="text-[13px] font-semibold text-[#142832]">
        {pageLabel}
      </span>

      {/* Droite : nom utilisateur + déconnexion */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-medium text-[#142832]">
          {userName}
        </span>
        <button
          onClick={handleLogout}
          title="Déconnexion"
          className="flex items-center justify-center w-7 h-7 rounded-[6px] text-[#142832] hover:bg-[#d8d8d3] transition-colors"
        >
          <span className="text-[16px]">⏻</span>
        </button>
      </div>
    </header>
  );
}
