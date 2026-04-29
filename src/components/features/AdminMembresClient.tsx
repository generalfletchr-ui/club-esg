"use client";

/* Composant client — liste complète des membres (admin) */
import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { promoteToAdmin, suspendMember, approveMember } from "@/app/admin/actions";
import type { Member, MemberStatus, MemberRole } from "@/types";

type StatusFilter = "" | MemberStatus;
type RoleFilter = "" | MemberRole;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUT_TAG: Record<MemberStatus, { variant: "green" | "yellow" | "red"; label: string }> = {
  approved: { variant: "green",  label: "Approuvé" },
  pending:  { variant: "yellow", label: "En attente" },
  rejected: { variant: "red",    label: "Refusé" },
};

const ROLE_TAG: Record<MemberRole, { variant: "teal" | "neutral" | "purple"; label: string }> = {
  admin:   { variant: "purple",  label: "Admin" },
  member:  { variant: "teal",    label: "Membre" },
  pending: { variant: "neutral", label: "Pending" },
};

/* ── Ligne membre ─────────────────────────────────────────── */
function MemberRow({ member }: { member: Member }) {
  const [pending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<"promote" | "suspend" | "approve" | null>(null);

  function doAction(action: "promote" | "suspend" | "approve") {
    if (confirmAction !== action) { setConfirmAction(action); return; }
    startTransition(async () => {
      if (action === "promote") await promoteToAdmin(member.id);
      if (action === "suspend") await suspendMember(member.id);
      if (action === "approve") await approveMember(member.id);
      setConfirmAction(null);
    });
  }

  const s = STATUT_TAG[member.statut];
  const r = ROLE_TAG[member.role];

  return (
    <tr className="border-b border-[#f3f4f6] hover:bg-[#fafafa] transition-colors">
      {/* Identité */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <Avatar prenom={member.prenom} nom={member.nom} photoUrl={member.photo_url} size={32} />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-[#111827] truncate">
              {member.prenom} {member.nom}
            </p>
            <p className="text-[11px] text-[#6b7280] truncate">{member.email}</p>
          </div>
        </div>
      </td>
      {/* Entreprise */}
      <td className="py-3 px-4">
        <p className="text-[12px] text-[#374151] truncate max-w-[160px]">{member.entreprise}</p>
        <p className="text-[11px] text-[#9ca3af] truncate">{member.fonction}</p>
      </td>
      {/* Type */}
      <td className="py-3 px-4">
        <Tag variant="teal" className="text-[10px]">{member.type_membre}</Tag>
      </td>
      {/* Statut */}
      <td className="py-3 px-4">
        <Tag variant={s.variant} className="text-[10px]">{s.label}</Tag>
      </td>
      {/* Rôle */}
      <td className="py-3 px-4">
        <Tag variant={r.variant} className="text-[10px]">{r.label}</Tag>
      </td>
      {/* Date */}
      <td className="py-3 px-4">
        <span className="text-[11px] text-[#9ca3af]">{formatDate(member.date_inscription)}</span>
      </td>
      {/* Actions */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Confirmation */}
          {confirmAction && (
            <Button variant="outline" size="sm" onClick={() => setConfirmAction(null)} disabled={pending}>
              Annuler
            </Button>
          )}

          {/* Voir fiche */}
          <Link
            href={`/annuaire/${member.id}`}
            className="inline-flex items-center px-3 py-1.5 rounded-[6px] text-[11px] font-semibold border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f5f6f8] transition-colors whitespace-nowrap"
          >
            Voir
          </Link>

          {/* Approuver si pending */}
          {member.statut === "pending" && (
            <Button
              variant="primary"
              size="sm"
              loading={pending && confirmAction === "approve"}
              onClick={() => doAction("approve")}
              disabled={pending}
            >
              {confirmAction === "approve" ? "Confirmer ?" : "Approuver"}
            </Button>
          )}

          {/* Promouvoir admin si membre non-admin */}
          {member.statut === "approved" && member.role !== "admin" && (
            <Button
              variant="outline"
              size="sm"
              loading={pending && confirmAction === "promote"}
              onClick={() => doAction("promote")}
              disabled={pending}
            >
              {confirmAction === "promote" ? "Confirmer ?" : "→ Admin"}
            </Button>
          )}

          {/* Suspendre si approuvé */}
          {member.statut === "approved" && (
            <Button
              variant="danger"
              size="sm"
              loading={pending && confirmAction === "suspend"}
              onClick={() => doAction("suspend")}
              disabled={pending}
            >
              {confirmAction === "suspend" ? "Confirmer ?" : "Suspendre"}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ── Composant principal ─────────────────────────────────── */
export default function AdminMembresClient({ members }: { members: Member[] }) {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [roleFilter,   setRoleFilter]   = useState<RoleFilter>("");

  const totals = {
    total:    members.length,
    approved: members.filter((m) => m.statut === "approved").length,
    pending:  members.filter((m) => m.statut === "pending").length,
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return members.filter((m) => {
      if (statusFilter && m.statut !== statusFilter) return false;
      if (roleFilter && m.role !== roleFilter) return false;
      if (q) {
        const hay = [m.prenom, m.nom, m.email, m.entreprise].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [members, search, statusFilter, roleFilter]);

  return (
    <div>
      {/* ── En-tête ──────────────────────────────────────────── */}
      <div className="mb-4">
        <h1 className="text-[22px] font-bold text-[#111827]">Membres</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          {totals.total} membres · {totals.approved} approuvés · {totals.pending} en attente
        </p>
      </div>

      {/* ── Compteurs ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total",       value: totals.total,    color: "#374151" },
          { label: "Approuvés",   value: totals.approved, color: "#16a34a" },
          { label: "En attente",  value: totals.pending,  color: "#ca8a04" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-[#e5e7eb] rounded-[8px] px-4 py-3">
            <p className="text-[11px] text-[#6b7280] font-medium">{label}</p>
            <p className="text-[22px] font-bold mt-0.5" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Filtres ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1 min-w-[200px] h-[34px] border border-[#e5e7eb] rounded-[6px] bg-white flex items-center px-2.5 gap-2">
          <span className="text-[#6b7280] text-[14px]">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre..."
            className="border-none outline-none text-[12px] text-[#111827] flex-1 bg-transparent placeholder:text-[#9ca3af]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[#9ca3af] hover:text-[#6b7280] text-[14px]">×</button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="h-[34px] rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#374151] outline-none focus:border-[#00B4B4] cursor-pointer"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvé</option>
          <option value="rejected">Refusé</option>
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="h-[34px] rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#374151] outline-none focus:border-[#00B4B4] cursor-pointer"
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="member">Membre</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* ── Tableau ───────────────────────────────────────────── */}
      <div className="bg-white border border-[#e5e7eb] rounded-[8px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#fafafa]">
                {["Membre", "Entreprise", "Type", "Statut", "Rôle", "Inscrit le", "Actions"].map((h) => (
                  <th key={h} className="text-left py-2.5 px-4 text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((m) => <MemberRow key={m.id} member={m} />)
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[13px] text-[#9ca3af]">
                    Aucun membre ne correspond aux filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-[#f3f4f6] bg-[#fafafa]">
          <p className="text-[11px] text-[#9ca3af]">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            {filtered.length !== members.length && ` sur ${members.length}`}
          </p>
        </div>
      </div>
    </div>
  );
}
