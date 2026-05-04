"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import { MEMBER_TYPES, SECTORS, EXPERTISES } from "@/lib/constants";
import type { Member } from "@/types";

const PAGE_SIZE = 12; /* 2 colonnes × 6 lignes */

/* ── Filtre select réutilisable ──────────────────────────────── */
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-[34px] rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#374151] outline-none focus:border-[#016050] transition-colors cursor-pointer"
    >
      <option value="">{label} ▾</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

/* ── Composant carte membre ──────────────────────────────────── */
function MemberCard({ member }: { member: Member }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-3 flex gap-3">
      <Avatar
        prenom={member.prenom}
        nom={member.nom}
        photoUrl={member.photo_url}
        size={40}
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-0.5">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#111827] truncate">
              {member.prenom} {member.nom}
            </p>
            <p className="text-[11px] text-[#6b7280] truncate">
              {member.fonction} · {member.entreprise}
            </p>
          </div>
          <Tag variant="teal" className="flex-shrink-0 text-[10px]">
            {member.type_membre.split(" ")[0]}
          </Tag>
        </div>
        <p className="text-[11px] text-[#6b7280] my-1">
          📍 {member.ville} · {member.secteur}
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          {member.expertises.slice(0, 3).map((exp) => (
            <Tag key={exp} variant="neutral" className="text-[10px]">
              {exp}
            </Tag>
          ))}
          {member.expertises.length > 3 && (
            <Tag variant="neutral" className="text-[10px]">
              +{member.expertises.length - 3}
            </Tag>
          )}
        </div>
        <div className="flex justify-end">
          <Link
            href={`/annuaire/${member.id}`}
            className="inline-flex px-3 py-1 rounded-[6px] text-[11px] font-medium text-[#374151] border border-[#e5e7eb] hover:bg-[#f5f6f8] transition-colors"
          >
            Voir le profil →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Pagination ──────────────────────────────────────────────── */
function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;

  const pages: (number | "...")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return (
    <div className="flex justify-center gap-1 mt-5">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-7 h-7 rounded-[6px] text-[12px] border border-[#e5e7eb] bg-white text-[#374151] disabled:opacity-40 hover:border-[#016050] transition-colors"
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="w-7 h-7 flex items-center justify-center text-[12px] text-[#6b7280]">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className="w-7 h-7 rounded-[6px] text-[12px] font-medium transition-colors"
            style={{
              background: p === current ? "#016050" : "#fff",
              border:     `1px solid ${p === current ? "#016050" : "#e5e7eb"}`,
              color:      p === current ? "#fff" : "#374151",
            }}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-7 h-7 rounded-[6px] text-[12px] border border-[#e5e7eb] bg-white text-[#374151] disabled:opacity-40 hover:border-[#016050] transition-colors"
      >
        ›
      </button>
    </div>
  );
}

/* ── Composant principal ─────────────────────────────────────── */
export default function AnnuaireClient({ members }: { members: Member[] }) {
  const [search,    setSearch]    = useState("");
  const [typeFilter,    setTypeFilter]    = useState("");
  const [secteurFilter, setSecteurFilter] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("");
  const [page, setPage] = useState(1);

  /* Filtrage côté client */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return members.filter((m) => {
      if (typeFilter && m.type_membre !== typeFilter) return false;
      if (secteurFilter && m.secteur !== secteurFilter) return false;
      if (expertiseFilter && !m.expertises.includes(expertiseFilter)) return false;
      if (q) {
        const haystack = [m.prenom, m.nom, m.entreprise, m.fonction, m.ville].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [members, search, typeFilter, secteurFilter, expertiseFilter]);

  /* Remise à zéro de la page à chaque changement de filtre */
  function applyFilter<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters = typeFilter || secteurFilter || expertiseFilter || search;

  return (
    <div>
      {/* ── En-tête ────────────────────────────────────────── */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827]">Annuaire des membres</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            {members.length} membre{members.length > 1 ? "s" : ""}
            {filtered.length !== members.length && (
              <> · <span className="text-[#016050] font-medium">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span></>
            )}
          </p>
        </div>
      </div>

      {/* ── Filtres ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Recherche libre */}
        <div className="flex-1 min-w-[200px] h-[34px] border border-[#e5e7eb] rounded-[6px] bg-white flex items-center px-2.5 gap-2">
          <span className="text-[#6b7280] text-[14px]">🔍</span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un membre, une entreprise..."
            className="border-none outline-none text-[12px] text-[#111827] flex-1 bg-transparent placeholder:text-[#9ca3af]"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="text-[#9ca3af] hover:text-[#6b7280] text-[14px]">×</button>
          )}
        </div>

        {/* Selects */}
        <FilterSelect
          label="Type de membre"
          value={typeFilter}
          onChange={applyFilter(setTypeFilter)}
          options={MEMBER_TYPES}
        />
        <FilterSelect
          label="Secteur"
          value={secteurFilter}
          onChange={applyFilter(setSecteurFilter)}
          options={SECTORS.filter((s) => s !== "Tous Secteurs")}
        />
        <FilterSelect
          label="Expertise"
          value={expertiseFilter}
          onChange={applyFilter(setExpertiseFilter)}
          options={EXPERTISES}
        />
      </div>

      {/* ── Filtres actifs ─────────────────────────────────── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 mb-3 items-center">
          {typeFilter && (
            <Tag variant="teal" onRemove={() => { setTypeFilter(""); setPage(1); }}>
              {typeFilter}
            </Tag>
          )}
          {secteurFilter && (
            <Tag variant="teal" onRemove={() => { setSecteurFilter(""); setPage(1); }}>
              {secteurFilter}
            </Tag>
          )}
          {expertiseFilter && (
            <Tag variant="teal" onRemove={() => { setExpertiseFilter(""); setPage(1); }}>
              {expertiseFilter}
            </Tag>
          )}
          <button
            onClick={() => { setSearch(""); setTypeFilter(""); setSecteurFilter(""); setExpertiseFilter(""); setPage(1); }}
            className="text-[11px] text-[#6b7280] hover:text-[#374151] hover:underline ml-1"
          >
            Effacer les filtres
          </button>
        </div>
      )}

      {/* ── Grille membres ─────────────────────────────────── */}
      {pageItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {pageItems.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-[13px] text-[#6b7280]">
            Aucun membre ne correspond à ta recherche.
          </p>
          <button
            onClick={() => { setSearch(""); setTypeFilter(""); setSecteurFilter(""); setExpertiseFilter(""); setPage(1); }}
            className="mt-2 text-[12px] text-[#016050] font-medium hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────── */}
      <Pagination current={page} total={totalPages} onChange={setPage} />
    </div>
  );
}
