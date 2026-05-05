"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import MissionCard from "@/components/features/MissionCard";
import { MISSION_DOMAINES, MISSION_MODALITES, EXPERTISES } from "@/lib/constants";
import type { Mission } from "@/types";

const PAGE_SIZE = 12;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

interface MissionsClientProps {
  missions: Mission[];
}

export default function MissionsClient({ missions }: MissionsClientProps) {
  const [typeMission, setTypeMission] = useState<string>("all");
  const [domaine,     setDomaine]     = useState<string>("all");
  const [expertise,   setExpertise]   = useState<string>("all");
  const [modalite,    setModalite]    = useState<string>("all");
  const [page,        setPage]        = useState(1);

  const now = Date.now();

  const filtered = useMemo(() => {
    return missions.filter((m) => {
      if (typeMission !== "all" && m.type_mission !== typeMission) return false;
      if (domaine     !== "all" && m.domaine       !== domaine)     return false;
      if (modalite    !== "all" && m.modalite       !== modalite)    return false;
      if (expertise   !== "all" && !m.expertises_requises.includes(expertise)) return false;
      return true;
    });
  }, [missions, typeMission, domaine, expertise, modalite]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const displayed  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setTypeMission("all");
    setDomaine("all");
    setExpertise("all");
    setModalite("all");
    setPage(1);
  }

  const hasFilters = typeMission !== "all" || domaine !== "all" || expertise !== "all" || modalite !== "all";

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827]">Opportunités de missions</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            {missions.length} mission{missions.length > 1 ? "s" : ""} disponible{missions.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/missions/nouvelle">
          <Button variant="primary" size="md">
            + Publier une mission
          </Button>
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-4 mb-5 flex flex-wrap gap-3 items-end">
        {/* Type */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="label-caps">Type</label>
          <select
            value={typeMission}
            onChange={(e) => { setTypeMission(e.target.value); setPage(1); }}
            className="border border-[#e5e7eb] rounded-[6px] px-2.5 py-1.5 text-[12px] text-[#374151] bg-white focus:outline-none focus:ring-1 focus:ring-[#016050]"
          >
            <option value="all">Tous les types</option>
            <option value="binome">Binôme recherché</option>
            <option value="cession">Mission à céder</option>
          </select>
        </div>

        {/* Domaine */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="label-caps">Domaine ESG</label>
          <select
            value={domaine}
            onChange={(e) => { setDomaine(e.target.value); setPage(1); }}
            className="border border-[#e5e7eb] rounded-[6px] px-2.5 py-1.5 text-[12px] text-[#374151] bg-white focus:outline-none focus:ring-1 focus:ring-[#016050]"
          >
            <option value="all">Tous les domaines</option>
            {MISSION_DOMAINES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Expertise */}
        <div className="flex flex-col gap-1 min-w-[200px]">
          <label className="label-caps">Expertise requise</label>
          <select
            value={expertise}
            onChange={(e) => { setExpertise(e.target.value); setPage(1); }}
            className="border border-[#e5e7eb] rounded-[6px] px-2.5 py-1.5 text-[12px] text-[#374151] bg-white focus:outline-none focus:ring-1 focus:ring-[#016050]"
          >
            <option value="all">Toutes les expertises</option>
            {EXPERTISES.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Modalité */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="label-caps">Modalité</label>
          <select
            value={modalite}
            onChange={(e) => { setModalite(e.target.value); setPage(1); }}
            className="border border-[#e5e7eb] rounded-[6px] px-2.5 py-1.5 text-[12px] text-[#374151] bg-white focus:outline-none focus:ring-1 focus:ring-[#016050]"
          >
            <option value="all">Toutes les modalités</option>
            {MISSION_MODALITES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={resetFilters}
            className="text-[11px] text-[#6b7280] hover:text-[#374151] underline self-end pb-1.5"
          >
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Grille */}
      {displayed.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-[14px] font-semibold text-[#374151] mb-1">
            Aucune mission ne correspond à vos critères
          </p>
          <p className="text-[12px] text-[#6b7280]">
            Essayez de modifier les filtres ou publiez la vôtre.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {displayed.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                isNew={now - new Date(m.created_at).getTime() < SEVEN_DAYS}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Précédent
              </Button>
              <span className="text-[12px] text-[#6b7280]">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Suivant →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
