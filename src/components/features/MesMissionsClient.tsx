"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { closeMission, deleteMission } from "@/app/missions/actions";
import type { Mission, MissionStatut } from "@/types";

type Tab = "pending" | "published" | "pourvue" | "expired" | "rejected";

const TAB_LABELS: Record<Tab, string> = {
  pending:   "En attente",
  published: "Publiées",
  pourvue:   "Pourvues",
  expired:   "Expirées",
  rejected:  "Refusées",
};

const STATUT_TAG: Record<MissionStatut, React.ReactNode> = {
  pending:   <Tag variant="yellow">En attente</Tag>,
  published: <Tag variant="green">Publiée</Tag>,
  rejected:  <Tag variant="red">Refusée</Tag>,
  pourvue:   <Tag variant="neutral">Pourvue</Tag>,
  expired:   <Tag variant="neutral">Expirée</Tag>,
};

const TYPE_LABEL: Record<string, string> = {
  binome:  "Binôme recherché",
  cession: "Mission à céder",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ── Ligne d'une mission ────────────────────────────────────── */
function MissionRow({ mission }: { mission: Mission }) {
  const [pending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<"close" | "delete" | null>(null);

  const isExpiredByDate = new Date(mission.expire_le) < new Date();
  const effectiveStatut: MissionStatut =
    mission.statut === "published" && isExpiredByDate ? "expired" : mission.statut;

  function handleClose() {
    if (confirmAction !== "close") { setConfirmAction("close"); return; }
    startTransition(async () => {
      await closeMission(mission.id);
      setConfirmAction(null);
    });
  }

  function handleDelete() {
    if (confirmAction !== "delete") { setConfirmAction("delete"); return; }
    startTransition(async () => {
      await deleteMission(mission.id);
      setConfirmAction(null);
    });
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-4 flex gap-4 items-start">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="text-[13px] font-semibold text-[#111827] truncate">{mission.titre}</p>
          {STATUT_TAG[effectiveStatut]}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-1">
          <Tag variant={mission.type_mission === "binome" ? "teal" : "orange"} className="text-[10px]">
            {TYPE_LABEL[mission.type_mission]}
          </Tag>
          <Tag variant="neutral" className="text-[10px]">{mission.domaine}</Tag>
        </div>
        <p className="text-[11px] text-[#9ca3af]">
          Créée le {formatDate(mission.created_at)} · Expire le {formatDate(mission.expire_le)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex flex-col gap-2 items-end">
        {confirmAction === "close" && (
          <p className="text-[11px] text-[#374151] font-medium text-right">Confirmer ?</p>
        )}
        {confirmAction === "delete" && (
          <p className="text-[11px] text-[#ef4444] font-medium text-right">Supprimer définitivement ?</p>
        )}
        <div className="flex gap-2 flex-wrap justify-end">
          {confirmAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmAction(null)}
              disabled={pending}
            >
              Annuler
            </Button>
          )}

          {/* Voir */}
          {effectiveStatut === "published" && (
            <Link href={`/missions/${mission.id}`}>
              <Button variant="outline" size="sm">Voir</Button>
            </Link>
          )}

          {/* Modifier */}
          {(mission.statut === "pending" || mission.statut === "rejected") && (
            <Link href={`/missions/${mission.id}/modifier`}>
              <Button variant="outline" size="sm">Modifier</Button>
            </Link>
          )}

          {/* Marquer pourvue */}
          {effectiveStatut === "published" && (
            <Button
              variant="outline"
              size="sm"
              loading={pending && confirmAction === "close"}
              onClick={handleClose}
              disabled={pending}
            >
              {confirmAction === "close" ? "Oui, marquer pourvue" : "Marquer pourvue"}
            </Button>
          )}

          {/* Supprimer */}
          {(mission.statut === "pending" || mission.statut === "rejected") && (
            <Button
              variant="danger"
              size="sm"
              loading={pending && confirmAction === "delete"}
              onClick={handleDelete}
              disabled={pending}
            >
              {confirmAction === "delete" ? "Oui, supprimer" : "Supprimer"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Composant principal ────────────────────────────────────── */
export default function MesMissionsClient({ missions }: { missions: Mission[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  /* Calcul des onglets avec expiration */
  function getEffectiveStatut(m: Mission): Tab {
    if (m.statut === "published" && new Date(m.expire_le) < new Date()) return "expired";
    return m.statut as Tab;
  }

  const counts: Record<Tab, number> = {
    pending:   missions.filter((m) => getEffectiveStatut(m) === "pending").length,
    published: missions.filter((m) => getEffectiveStatut(m) === "published").length,
    pourvue:   missions.filter((m) => getEffectiveStatut(m) === "pourvue").length,
    expired:   missions.filter((m) => getEffectiveStatut(m) === "expired").length,
    rejected:  missions.filter((m) => getEffectiveStatut(m) === "rejected").length,
  };

  const displayed = missions.filter((m) => getEffectiveStatut(m) === activeTab);

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827]">Mes missions</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            {missions.length} fiche{missions.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Link href="/missions/nouvelle">
          <Button variant="primary" size="md">+ Nouvelle mission</Button>
        </Link>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "px-[14px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-colors flex items-center gap-1.5",
              activeTab === tab
                ? "bg-[#016050] text-white"
                : "bg-white border border-[#e5e7eb] text-[#374151] hover:bg-[#f5f6f8]",
            ].join(" ")}
          >
            {TAB_LABELS[tab]}
            {counts[tab] > 0 && (
              <span
                className={[
                  "inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-bold",
                  activeTab === tab ? "bg-white/20 text-white" : "bg-[#f5f6f8] text-[#6b7280]",
                ].join(" ")}
              >
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Liste */}
      {displayed.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-2xl mb-2">
            {activeTab === "pending" ? "⏳" : activeTab === "published" ? "🚀" : activeTab === "pourvue" ? "✅" : activeTab === "rejected" ? "🚫" : "⌛"}
          </p>
          <p className="text-[13px] text-[#6b7280]">
            {activeTab === "pending"
              ? "Aucune fiche en attente de validation."
              : activeTab === "published"
              ? "Aucune fiche publiée en ce moment."
              : activeTab === "pourvue"
              ? "Aucune mission marquée comme pourvue."
              : activeTab === "rejected"
              ? "Aucune fiche refusée."
              : "Aucune fiche expirée."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {displayed.map((m) => (
            <MissionRow key={m.id} mission={m} />
          ))}
        </div>
      )}
    </div>
  );
}
