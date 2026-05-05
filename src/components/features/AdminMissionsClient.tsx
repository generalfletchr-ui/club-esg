"use client";

import { useState, useTransition } from "react";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { publishMission, rejectMissionAdmin } from "@/app/admin/actions";
import type { Mission } from "@/types";

type Tab = "pending" | "published" | "rejected";

const TAB_LABELS: Record<Tab, string> = {
  pending:   "En attente",
  published: "Publiées",
  rejected:  "Refusées",
};

const TYPE_LABEL: Record<string, string> = {
  binome:  "Binôme recherché",
  cession: "Mission à céder",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Ligne d'une mission ────────────────────────────────────── */
function MissionRow({
  mission,
  showActions,
}: {
  mission: Mission;
  showActions: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<"publish" | "reject" | null>(null);

  const membre = mission.membre as { prenom: string; nom: string; photo_url: string | null; entreprise: string } | undefined;

  function handlePublish() {
    if (confirmAction !== "publish") { setConfirmAction("publish"); return; }
    startTransition(() => {
      publishMission(mission.id).then(() => setConfirmAction(null));
    });
  }

  function handleReject() {
    if (confirmAction !== "reject") { setConfirmAction("reject"); return; }
    startTransition(() => {
      rejectMissionAdmin(mission.id).then(() => setConfirmAction(null));
    });
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-4 flex gap-4 items-start">
      {/* Avatar du posteur */}
      {membre && (
        <Avatar
          prenom={membre.prenom}
          nom={membre.nom}
          photoUrl={membre.photo_url}
          size={42}
        />
      )}

      {/* Infos mission */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="text-[13px] font-semibold text-[#111827] truncate max-w-[320px]">
            {mission.titre}
          </p>
          <Tag variant={mission.type_mission === "binome" ? "teal" : "orange"} className="text-[10px]">
            {TYPE_LABEL[mission.type_mission]}
          </Tag>
          <Tag variant="neutral" className="text-[10px]">{mission.domaine}</Tag>
        </div>

        {membre && (
          <p className="text-[12px] text-[#6b7280] mb-1">
            {membre.prenom} {membre.nom} · {membre.entreprise}
          </p>
        )}

        <p className="text-[11px] text-[#9ca3af] mb-2 line-clamp-2">
          {mission.description}
        </p>

        <div className="flex flex-wrap gap-2 text-[10px] text-[#9ca3af]">
          {mission.type_prestation && <span>🔧 {mission.type_prestation}</span>}
          {mission.modalite && <span>📍 {mission.modalite}{mission.localisation ? ` · ${mission.localisation}` : ""}</span>}
          {mission.budget && <span>💶 {mission.budget}</span>}
          <span>📅 Soumise le {formatDate(mission.created_at)}</span>
          <span>⏱ Expire le {formatDate(mission.expire_le)}</span>
        </div>

        {mission.expertises_requises.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {mission.expertises_requises.slice(0, 4).map((e) => (
              <span
                key={e}
                className="px-2 py-0.5 bg-[#e4f7f3] text-[#016050] rounded-[4px] text-[10px] font-medium"
              >
                {e}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex-shrink-0 flex flex-col gap-2 items-end">
          {confirmAction === "publish" && (
            <p className="text-[11px] text-[#374151] font-medium text-right">
              Confirmer la publication ?
            </p>
          )}
          {confirmAction === "reject" && (
            <p className="text-[11px] text-[#ef4444] font-medium text-right">
              Confirmer le refus ?
            </p>
          )}
          <div className="flex gap-2">
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
            <Button
              variant="danger"
              size="sm"
              loading={pending && confirmAction === "reject"}
              onClick={handleReject}
              disabled={pending}
            >
              {confirmAction === "reject" ? "Oui, refuser" : "Refuser"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={pending && confirmAction === "publish"}
              onClick={handlePublish}
              disabled={pending}
            >
              {confirmAction === "publish" ? "Oui, publier" : "Publier"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Composant principal ────────────────────────────────────── */
export default function AdminMissionsClient({ missions }: { missions: Mission[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const counts: Record<Tab, number> = {
    pending:   missions.filter((m) => m.statut === "pending").length,
    published: missions.filter((m) => m.statut === "published").length,
    rejected:  missions.filter((m) => m.statut === "rejected").length,
  };

  const displayed = missions.filter((m) => m.statut === activeTab);

  return (
    <div>
      {/* En-tête */}
      <div className="mb-4">
        <h1 className="text-[22px] font-bold text-[#111827]">Modération des missions</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          {missions.length} fiche{missions.length > 1 ? "s" : ""} au total
        </p>
      </div>

      {/* Onglets */}
      <div className="flex gap-1.5 mb-5">
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
            <span
              className={[
                "inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-bold",
                activeTab === tab ? "bg-white/20 text-white" : "bg-[#f5f6f8] text-[#6b7280]",
              ].join(" ")}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Liste */}
      {displayed.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-2xl mb-2">
            {activeTab === "pending" ? "✅" : activeTab === "published" ? "🚀" : "🚫"}
          </p>
          <p className="text-[13px] text-[#6b7280]">
            {activeTab === "pending"
              ? "Aucune fiche en attente de validation."
              : activeTab === "published"
              ? "Aucune mission publiée."
              : "Aucune fiche refusée."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {displayed.map((m) => (
            <MissionRow
              key={m.id}
              mission={m}
              showActions={activeTab === "pending"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
