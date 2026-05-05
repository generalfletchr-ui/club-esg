"use client";

import { useState, useMemo } from "react";
import Tag from "@/components/ui/Tag";
import { EVENT_TYPES } from "@/lib/constants";
import type { Event, EventType, Intervenant } from "@/types";

/* ── Modale Proposer une Animation ──────────────────────────── */
function ProposeAnimationModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState("Webinaire");
  const [sujet, setSujet] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sujet.trim() || !description.trim()) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/proposer-animation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, sujet, description }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[10px] w-full max-w-[480px] shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <h2 className="text-[15px] font-semibold text-[#111827]">Proposer une animation</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-[#374151] text-xl leading-none">×</button>
        </div>

        {success ? (
          <div className="px-5 py-8 text-center">
            <p className="text-2xl mb-3">🎉</p>
            <p className="text-[14px] font-semibold text-[#111827] mb-1">Proposition envoyée !</p>
            <p className="text-[12px] text-[#6b7280] mb-4">L'équipe du Club ESG reviendra vers toi rapidement.</p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-[6px] text-[12px] font-semibold bg-[#016050] text-white hover:bg-[#014d40] transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
            {/* Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-[#374151]">Type d'animation <span className="text-[#ef4444]">*</span></label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-[34px] w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#374151] outline-none focus:border-[#016050] transition-colors"
              >
                <option>Webinaire</option>
                <option>Workshop</option>
              </select>
            </div>

            {/* Sujet */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-[#374151]">Sujet proposé <span className="text-[#ef4444]">*</span></label>
              <input
                type="text"
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
                placeholder="Ex : Stratégie net-zéro pour les PME"
                maxLength={120}
                className="h-[34px] w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none focus:border-[#016050] transition-colors"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-[#374151]">Description & angle <span className="text-[#ef4444]">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décris l'angle, les points clés que tu souhaites aborder, ton niveau d'expertise sur le sujet…"
                rows={4}
                maxLength={600}
                className="w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] py-[8px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none focus:border-[#016050] resize-none transition-colors"
              />
            </div>

            {error && <p className="text-[11px] text-[#ef4444]">{error}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-[6px] text-[12px] font-medium text-[#374151] border border-[#e5e7eb] hover:bg-[#f5f6f8] transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-[6px] text-[12px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors disabled:opacity-60"
              >
                {loading ? "Envoi…" : "Envoyer la proposition →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

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
  const [showProposeModal, setShowProposeModal] = useState(false);

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
      {showProposeModal && <ProposeAnimationModal onClose={() => setShowProposeModal(false)} />}

      {/* ── En-tête ──────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827]">Agenda</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            {events.length} événement{events.length !== 1 ? "s" : ""} à venir
          </p>
        </div>
        <button
          onClick={() => setShowProposeModal(true)}
          className="flex-shrink-0 px-[14px] py-[9px] rounded-[6px] text-[13px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors"
        >
          + Proposer une animation
        </button>
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
