"use client";

/* Composant client — gestion des demandes d'inscription */
import { useState, useTransition } from "react";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { approveMember, rejectMember } from "@/app/admin/actions";
import type { Member } from "@/types";

type Tab = "pending" | "approved" | "rejected";

const TAB_LABELS: Record<Tab, string> = {
  pending: "En attente",
  approved: "Validés",
  rejected: "Refusés",
};

/* Formate une date ISO en "12 mai 2026" */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Ligne d'une demande ─────────────────────────────────── */
function DemandRow({
  member,
  showActions,
}: {
  member: Member;
  showActions: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

  function handleApprove() {
    if (confirmAction !== "approve") {
      setConfirmAction("approve");
      return;
    }
    startTransition(() => {
      approveMember(member.id).then(() => setConfirmAction(null));
    });
  }

  function handleReject() {
    if (confirmAction !== "reject") {
      setConfirmAction("reject");
      return;
    }
    startTransition(() => {
      rejectMember(member.id).then(() => setConfirmAction(null));
    });
  }

  const statutTag =
    member.statut === "approved"
      ? <Tag variant="green">Validé</Tag>
      : member.statut === "rejected"
      ? <Tag variant="red">Refusé</Tag>
      : <Tag variant="yellow">En attente</Tag>;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-4 flex gap-4 items-start">
      {/* Avatar */}
      <Avatar
        prenom={member.prenom}
        nom={member.nom}
        photoUrl={member.photo_url}
        size={42}
      />

      {/* Infos membre */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <p className="text-[13px] font-semibold text-[#111827]">
            {member.prenom} {member.nom}
          </p>
          {statutTag}
        </div>
        <p className="text-[12px] text-[#6b7280] mb-0.5">
          {member.fonction} · {member.entreprise}
        </p>
        <p className="text-[11px] text-[#9ca3af] mb-1">
          {member.email} · {member.ville} · SIRET : {member.siret || "—"}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          <Tag variant="teal" className="text-[10px]">{member.type_membre}</Tag>
          <Tag variant="neutral" className="text-[10px]">{member.secteur}</Tag>
          <span className="text-[11px] text-[#9ca3af]">
            Inscrit le {formatDate(member.date_inscription)}
          </span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex-shrink-0 flex flex-col gap-2 items-end">
          {confirmAction === "approve" && (
            <p className="text-[11px] text-[#374151] font-medium text-right">
              Confirmer l&apos;approbation ?
            </p>
          )}
          {confirmAction === "reject" && (
            <p className="text-[11px] text-[#374151] font-medium text-right">
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
              loading={pending && confirmAction === "approve"}
              onClick={handleApprove}
              disabled={pending}
            >
              {confirmAction === "approve" ? "Oui, approuver" : "Approuver"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Composant principal ─────────────────────────────────── */
export default function AdminDemandesClient({ members }: { members: Member[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const counts: Record<Tab, number> = {
    pending:  members.filter((m) => m.statut === "pending").length,
    approved: members.filter((m) => m.statut === "approved").length,
    rejected: members.filter((m) => m.statut === "rejected").length,
  };

  const displayed = members.filter((m) => m.statut === activeTab);

  return (
    <div>
      {/* ── En-tête ─────────────────────────────────────────── */}
      <div className="mb-4">
        <h1 className="text-[22px] font-bold text-[#111827]">Demandes d&apos;inscription</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          {members.length} demande{members.length > 1 ? "s" : ""} au total
        </p>
      </div>

      {/* ── Onglets ──────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-5">
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "px-[14px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-colors flex items-center gap-1.5",
              activeTab === tab
                ? "bg-[#00B4B4] text-white"
                : "bg-white border border-[#e5e7eb] text-[#374151] hover:bg-[#f5f6f8]",
            ].join(" ")}
          >
            {TAB_LABELS[tab]}
            <span
              className={[
                "inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-bold",
                activeTab === tab
                  ? "bg-white/20 text-white"
                  : "bg-[#f5f6f8] text-[#6b7280]",
              ].join(" ")}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Liste ────────────────────────────────────────────── */}
      {displayed.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-2xl mb-2">
            {activeTab === "pending" ? "✅" : activeTab === "approved" ? "👥" : "🚫"}
          </p>
          <p className="text-[13px] text-[#6b7280]">
            {activeTab === "pending"
              ? "Aucune demande en attente."
              : activeTab === "approved"
              ? "Aucun membre validé."
              : "Aucune demande refusée."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {displayed.map((m) => (
            <DemandRow
              key={m.id}
              member={m}
              showActions={activeTab === "pending"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
