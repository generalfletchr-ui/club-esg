"use client";

import { useState, useMemo } from "react";
import Tag from "@/components/ui/Tag";
import { EVENT_TYPES } from "@/lib/constants";
import type { Replay, EventType } from "@/types";

const EVENT_ICONS: Record<string, string> = {
  Webinaire: "🎙",
  Afterwork: "🤝",
  Workshop: "📋",
};

const EVENT_TAG_VARIANTS: Record<string, "teal" | "purple" | "orange"> = {
  Webinaire: "teal",
  Afterwork: "purple",
  Workshop: "orange",
};

const PAGE_SIZE = 6;

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleDateString("fr-FR", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

type TabValue = "Tout" | EventType;

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
    <div className="flex justify-center gap-1 mt-6">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-7 h-7 rounded-[6px] text-[12px] border border-[#e5e7eb] bg-white text-[#374151] disabled:opacity-40 hover:border-[#016050] transition-colors"
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-7 h-7 flex items-center justify-center text-[12px] text-[#6b7280]"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className="w-7 h-7 rounded-[6px] text-[12px] font-medium transition-colors"
            style={{
              background: p === current ? "#016050" : "#fff",
              border: `1px solid ${p === current ? "#016050" : "#e5e7eb"}`,
              color: p === current ? "#fff" : "#374151",
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

/* ── Carte replay ────────────────────────────────────────────── */
function ReplayCard({ replay: r }: { replay: Replay }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[8px] overflow-hidden hover:border-[#016050] transition-colors">
      {/* Image ou bannière icône */}
      {r.image_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={r.image_url}
          alt=""
          className="w-full h-[140px] object-cover"
        />
      ) : (
        <div className="w-full h-[100px] bg-gradient-to-br from-[#e4f7f3] to-[#f0fdf4] flex items-center justify-center text-4xl">
          {EVENT_ICONS[r.type_event] ?? "🎬"}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag variant={EVENT_TAG_VARIANTS[r.type_event] ?? "teal"}>
            {r.type_event}
          </Tag>
          <span className="text-[11px] text-[#9ca3af]">
            {formatEventDate(r.date_event)}
          </span>
        </div>

        <p className="text-[14px] font-semibold text-[#111827] mb-1 line-clamp-2">
          {r.titre}
        </p>

        {r.intervenants && (
          <p className="text-[11px] text-[#6b7280] mb-1.5">
            👤 {r.intervenants}
          </p>
        )}

        <p className="text-[12px] text-[#6b7280] line-clamp-2 leading-relaxed mb-3">
          {r.description}
        </p>

        <a
          href={r.lien_replay}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors"
        >
          ▶ Voir le replay
        </a>
      </div>
    </div>
  );
}

/* ── Composant principal ─────────────────────────────────────── */
export default function ReplaysClient({ replays }: { replays: Replay[] }) {
  const [activeTab, setActiveTab] = useState<TabValue>("Tout");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list =
      activeTab === "Tout"
        ? replays
        : replays.filter((r) => r.type_event === activeTab);
    return list;
  }, [replays, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabs: TabValue[] = ["Tout", ...EVENT_TYPES];

  const counts = useMemo(() => {
    const result: Record<string, number> = { Tout: replays.length };
    for (const t of EVENT_TYPES) {
      result[t] = replays.filter((r) => r.type_event === t).length;
    }
    return result;
  }, [replays]);

  function switchTab(tab: TabValue) {
    setActiveTab(tab);
    setPage(1);
  }

  return (
    <div>
      {/* ── En-tête ──────────────────────────────────────────── */}
      <div className="mb-4">
        <h1 className="text-[22px] font-bold text-[#111827]">Replays</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          {replays.length} replay{replays.length !== 1 ? "s" : ""} disponible
          {replays.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={[
              "px-[14px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-colors",
              activeTab === tab
                ? "bg-[#016050] text-white"
                : "bg-white border border-[#e5e7eb] text-[#374151] hover:bg-[#f5f6f8]",
            ].join(" ")}
          >
            {tab}
            {counts[tab] > 0 && (
              <span
                className={[
                  "ml-1.5 inline-flex items-center justify-center",
                  "w-[18px] h-[18px] rounded-full text-[10px] font-bold",
                  activeTab === tab
                    ? "bg-white/20 text-white"
                    : "bg-[#f5f6f8] text-[#6b7280]",
                ].join(" ")}
              >
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Grille ───────────────────────────────────────────── */}
      {replays.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-[14px] font-semibold text-[#374151] mb-1">
            Aucun replay disponible pour l&apos;instant
          </p>
          <p className="text-[12px] text-[#6b7280]">
            Les replays de nos événements seront disponibles ici après chaque session.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[13px] text-[#6b7280]">
            Aucun replay de ce type pour l&apos;instant.
          </p>
          <button
            onClick={() => switchTab("Tout")}
            className="mt-2 text-[12px] text-[#016050] font-medium hover:underline"
          >
            Voir tous les replays
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pageItems.map((r) => (
              <ReplayCard key={r.id} replay={r} />
            ))}
          </div>
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
