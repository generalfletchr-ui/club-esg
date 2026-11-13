"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import Tag from "@/components/ui/Tag";
import { EVENT_TYPES } from "@/lib/constants";
import { registerForEvent, unregisterFromEvent } from "@/app/agenda/actions";
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
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? '';
  return `${get('day')} ${get('month')} ${get('year')} · ${get('hour')}h${get('minute')}`;
}

function getMonthKey(iso: string): string {
  const fmt = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Paris',
    year: 'numeric', month: '2-digit',
  });
  return fmt.format(new Date(iso)).slice(0, 7);
}

function getMonthLabel(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleDateString("fr-FR", { month: "long", timeZone: "Europe/Paris" });
  const year = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', year: 'numeric' }).format(d);
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

export default function AgendaClient({
  events,
  myRegistrations = [],
}: {
  events: Event[];
  myRegistrations?: string[];
}) {
  const [activeTab, setActiveTab]       = useState<TabValue>("Tout");
  const [showPast, setShowPast]         = useState(false);

  const now = new Date();

  const upcoming = useMemo(() => events.filter((ev) => new Date(ev.date_heure) >= now), [events]);
  const past     = useMemo(() => events.filter((ev) => new Date(ev.date_heure) <  now)
    .sort((a, b) => new Date(b.date_heure).getTime() - new Date(a.date_heure).getTime()), [events]);

  const filteredUpcoming = useMemo(() => {
    if (activeTab === "Tout") return upcoming;
    return upcoming.filter((ev) => ev.type_event === activeTab);
  }, [upcoming, activeTab]);

  const filteredPast = useMemo(() => {
    if (activeTab === "Tout") return past;
    return past.filter((ev) => ev.type_event === activeTab);
  }, [past, activeTab]);

  const groups     = useMemo(() => groupByMonth(filteredUpcoming), [filteredUpcoming]);
  const pastGroups = useMemo(() => groupByMonth(filteredPast),     [filteredPast]);

  const tabs: TabValue[] = ["Tout", ...EVENT_TYPES];

  /* Comptes par tab (à venir uniquement) */
  const counts = useMemo(() => {
    const result: Record<string, number> = { Tout: upcoming.length };
    for (const t of EVENT_TYPES) {
      result[t] = upcoming.filter((ev) => ev.type_event === t).length;
    }
    return result;
  }, [upcoming]);

  return (
    <div className="max-w-[70%]">
      {/* ── En-tête ──────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827]">Agenda</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            {upcoming.length} à venir · {past.length} passé{past.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/proposer-animation"
          className="flex-shrink-0 px-[14px] py-[9px] rounded-[6px] text-[13px] font-semibold text-[#016050] bg-[#e4f7f3] hover:bg-[#c8f0e8] transition-colors"
        >
          + Proposer une animation
        </Link>
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

      {/* ── Événements à venir ────────────────────────────────── */}
      {filteredUpcoming.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-2xl mb-2">📅</p>
          <p className="text-[13px] text-[#6b7280]">
            Aucun événement à venir de ce type.
          </p>
          {activeTab !== "Tout" && (
            <button
              onClick={() => setActiveTab("Tout")}
              className="mt-2 text-[12px] text-[#016050] font-medium hover:underline"
            >
              Voir tous les événements
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(({ key, label, items }) => (
            <div key={key}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                  {label}
                </span>
                <div className="flex-1 h-px bg-[#e5e7eb]" />
              </div>
              <div className="space-y-2.5">
                {items.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    isRegistered={myRegistrations.includes(ev.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Événements passés ─────────────────────────────────── */}
      {filteredPast.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowPast((v) => !v)}
            className="flex items-center gap-2 text-[12px] font-semibold text-[#6b7280] hover:text-[#374151] transition-colors mb-3"
          >
            <span className={`transition-transform ${showPast ? "rotate-90" : ""}`}>▶</span>
            Événements passés ({filteredPast.length})
          </button>

          {showPast && (
            <div className="space-y-6 opacity-60">
              {pastGroups.map(({ key, label, items }) => (
                <div key={key}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                      {label}
                    </span>
                    <div className="flex-1 h-px bg-[#e5e7eb]" />
                  </div>
                  <div className="space-y-2.5">
                    {items.map((ev) => (
                      <EventCard
                        key={ev.id}
                        event={ev}
                        isRegistered={myRegistrations.includes(ev.id)}
                        isPast
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EventCard({ event: ev, isRegistered, isPast = false }: { event: Event; isRegistered: boolean; isPast?: boolean }) {
  const [registered, setRegistered] = useState(isRegistered);
  const [pending, startTransition]  = useTransition();

  function handleRegister() {
    /* Ouvre le lien externe immédiatement */
    window.open(ev.lien_inscription, "_blank", "noopener,noreferrer");
    /* Enregistre le clic en base */
    setRegistered(true);
    startTransition(() => registerForEvent(ev.id));
  }

  function handleUnregister() {
    setRegistered(false);
    startTransition(() => unregisterFromEvent(ev.id));
  }

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

          {/* Bouton inscription */}
          <div className="flex-shrink-0 self-start flex flex-col items-end gap-1">
            {isPast ? (
              <span className="inline-flex items-center px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-[#9ca3af] bg-[#f5f6f8] border border-[#e5e7eb] whitespace-nowrap">
                Terminé
              </span>
            ) : registered ? (
              <>
                <span className="inline-flex items-center gap-1 px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] whitespace-nowrap">
                  ✓ Inscrit
                </span>
                <button
                  onClick={handleUnregister}
                  disabled={pending}
                  className="text-[10px] text-[#9ca3af] hover:text-[#ef4444] transition-colors disabled:opacity-50"
                >
                  Se désinscrire
                </button>
              </>
            ) : (
              <button
                onClick={handleRegister}
                disabled={pending}
                className="px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors whitespace-nowrap disabled:opacity-60"
              >
                {pending ? "…" : "S'inscrire →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
