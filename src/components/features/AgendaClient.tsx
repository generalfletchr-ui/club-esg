"use client";

import { useState, useMemo } from "react";
import Tag from "@/components/ui/Tag";
import { EVENT_TYPES } from "@/lib/constants";
import type { Event, EventType, Intervenant } from "@/types";

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

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleDateString("fr-FR", { month: "long" });
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} · ${hours}h${mins}`;
}

function getMonthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleDateString("fr-FR", { month: "long" });
  const year = d.getFullYear();
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

function groupByMonth(events: Event[]): { key: string; label: string; items: Event[] }[] {
  const map = new Map<string, { label: string; items: Event[] }>();
  for (const ev of events) {
    const key = getMonthKey(ev.date_heure);
    if (!map.has(key)) {
      map.set(key, { label: getMonthLabel(ev.date_heure), items: [] });
    }
    map.get(key)!.items.push(ev);
  }
  return Array.from(map.entries()).map(([key, val]) => ({ key, ...val }));
}

type TabValue = "Tout" | EventType;

export default function AgendaClient({ events }: { events: Event[] }) {
  const [activeTab, setActiveTab] = useState<TabValue>("Tout");

  const filtered = useMemo(() => {
    if (activeTab === "Tout") return events;
    return events.filter((ev) => ev.type_event === activeTab);
  }, [events, activeTab]);

  const groups = useMemo(() => groupByMonth(filtered), [filtered]);

  const tabs: TabValue[] = ["Tout", ...EVENT_TYPES];

  /* Comptes par tab */
  const counts = useMemo(() => {
    const result: Record<string, number> = { Tout: events.length };
    for (const t of EVENT_TYPES) {
      result[t] = events.filter((ev) => ev.type_event === t).length;
    }
    return result;
  }, [events]);

  return (
    <div className="max-w-[70%]">
      {/* ── En-tête ──────────────────────────────────────────── */}
      <div className="mb-4">
        <h1 className="text-[22px] font-bold text-[#111827]">Agenda</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          {events.length} événement{events.length !== 1 ? "s" : ""} à venir
        </p>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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

      {/* ── Contenu ───────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-2xl mb-2">📅</p>
          <p className="text-[13px] text-[#6b7280]">
            Aucun événement de ce type pour l&apos;instant.
          </p>
          <button
            onClick={() => setActiveTab("Tout")}
            className="mt-2 text-[12px] text-[#016050] font-medium hover:underline"
          >
            Voir tous les événements
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(({ key, label, items }) => (
            <div key={key}>
              {/* Label mois */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                  {label}
                </span>
                <div className="flex-1 h-px bg-[#e5e7eb]" />
              </div>
              <div className="space-y-2.5">
                {items.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event: ev }: { event: Event }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-4 flex gap-4 hover:border-[#016050] transition-colors group">
      {/* Icône ou image */}
      {ev.image_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={ev.image_url}
          alt=""
          className="w-[72px] h-[56px] rounded-[6px] object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-[56px] h-[56px] rounded-[8px] bg-[#e4f7f3] flex items-center justify-center flex-shrink-0 text-2xl">
          {EVENT_ICONS[ev.type_event] ?? "📅"}
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Tag variant={EVENT_TAG_VARIANTS[ev.type_event] ?? "teal"}>
                {ev.type_event}
              </Tag>
              <span className="text-[11px] text-[#6b7280]">
                {formatEventDate(ev.date_heure)}
              </span>
            </div>
            <p className="text-[14px] font-semibold text-[#111827] mb-1 truncate">
              {ev.titre}
            </p>
            <p className="text-[12px] text-[#6b7280] line-clamp-2 leading-relaxed">
              {ev.description}
            </p>
            {ev.intervenants && ev.intervenants.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                {(ev.intervenants as Intervenant[]).map((it, idx) => (
                  <span key={idx} className="text-[11px] text-[#6b7280]">
                    👤{" "}
                    {it.url ? (
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#016050] hover:underline"
                      >
                        {it.nom}
                      </a>
                    ) : (
                      it.nom
                    )}
                  </span>
                ))}
              </div>
            )}
            {ev.type_event === "Afterwork" && ev.adresse && (
              <p className="text-[11px] text-[#6b7280] mt-1">
                📍 {ev.adresse}
              </p>
            )}
          </div>
          <a
            href={ev.lien_inscription}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 self-start px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors whitespace-nowrap"
          >
            S&apos;inscrire →
          </a>
        </div>
      </div>
    </div>
  );
}
