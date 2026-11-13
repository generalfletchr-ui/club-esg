"use client";

/* Composant client — calendrier des propositions d'animation :
 * seuls les mardis et jeudis à 21 jours minimum sont sélectionnables,
 * et les événements de l'agenda du Club y apparaissent (jour alors indisponible) */
import { useState } from "react";
import { isAllowedAnimationDate, type AgendaEntry } from "@/lib/animations";

const JOURS = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];

/* Mêmes couleurs que les badges de l'agenda */
const TYPE_STYLES: Record<string, { dot: string; label: string }> = {
  Webinaire: { dot: "bg-[#016050]", label: "Webinaire" },
  Afterwork: { dot: "bg-[#7c3aed]", label: "Afterwork" },
  Workshop:  { dot: "bg-[#f97316]", label: "Atelier" },
};

/** Premier jour du mois (AAAA-MM-01) d'une date AAAA-MM-JJ */
function monthOf(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

function shiftMonth(month: string, delta: number): string {
  const d = new Date(`${month}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + delta);
  return d.toISOString().slice(0, 10);
}

/** Cases du mois, semaines commençant le lundi (null = case vide) */
function monthCells(month: string): (string | null)[] {
  const first = new Date(`${month}T00:00:00Z`);
  const offset = (first.getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array(offset).fill(null);
  const d = new Date(first);
  while (d.getUTCMonth() === first.getUTCMonth()) {
    cells.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return cells;
}

export default function AnimationDatePicker({
  value,
  onChange,
  today,
  agenda,
}: {
  value: string;
  onChange: (date: string) => void;
  /* Date du jour à Paris (AAAA-MM-JJ), fournie par le serveur */
  today: string;
  /* Événements à venir de l'agenda du Club */
  agenda: AgendaEntry[];
}) {
  /* Premier mois affiché : le mois en cours, pour voir aussi le programme du Club à venir */
  const firstMonth = monthOf(today);
  const [month, setMonth] = useState(value ? monthOf(value) : firstMonth);

  const byDate = new Map<string, AgendaEntry[]>();
  for (const e of agenda) byDate.set(e.date, [...(byDate.get(e.date) ?? []), e]);

  const cells = monthCells(month);
  const monthEvents = cells.flatMap((d) => (d ? byDate.get(d) ?? [] : []));
  const typesShown = [...new Set(monthEvents.map((e) => e.type))].filter((t) => TYPE_STYLES[t]);

  const label = new Date(`${month}T00:00:00Z`).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="w-full max-w-[320px] rounded-[8px] border border-[#e5e7eb] bg-white p-3">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setMonth(shiftMonth(month, -1))}
          disabled={month <= firstMonth}
          aria-label="Mois précédent"
          className="w-7 h-7 rounded-[6px] text-[13px] text-[#374151] hover:bg-[#f5f6f8] disabled:opacity-30 disabled:hover:bg-transparent"
        >
          ‹
        </button>
        <span className="text-[13px] font-semibold text-[#111827] capitalize">{label}</span>
        <button
          type="button"
          onClick={() => setMonth(shiftMonth(month, 1))}
          aria-label="Mois suivant"
          className="w-7 h-7 rounded-[6px] text-[13px] text-[#374151] hover:bg-[#f5f6f8]"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {JOURS.map((j) => (
          <span key={j} className="text-[10px] font-semibold text-[#9ca3af] py-1">{j}</span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={`vide-${i}`} />;
          const events   = byDate.get(date) ?? [];
          const open     = isAllowedAnimationDate(date, today);
          const isTaken  = open && events.length > 0;
          const allowed  = open && !isTaken;
          const selected = date === value;
          return (
            <button
              key={date}
              type="button"
              disabled={!allowed}
              onClick={() => onChange(date)}
              aria-pressed={selected}
              title={
                events.length > 0
                  ? events.map((e) => `${TYPE_STYLES[e.type]?.label ?? e.type} : ${e.titre}`).join("\n") +
                    (isTaken ? "\nDate déjà prise" : "")
                  : undefined
              }
              className={[
                "relative h-8 rounded-[6px] text-[12px] transition-colors",
                selected
                  ? "bg-[#016050] text-white font-semibold"
                  : allowed
                  ? "bg-[#e4f7f3] text-[#016050] font-semibold hover:bg-[#c8f0e8]"
                  : isTaken
                  ? "bg-[#f5f6f8] text-[#9ca3af] line-through cursor-not-allowed"
                  : events.length > 0
                  ? "text-[#6b7280] cursor-not-allowed"
                  : "text-[#d1d5db] cursor-not-allowed",
              ].join(" ")}
            >
              {Number(date.slice(8))}
              {events.length > 0 && (
                <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 flex gap-[2px]">
                  {events.slice(0, 3).map((e, k) => (
                    <span key={k} className={`w-1 h-1 rounded-full ${TYPE_STYLES[e.type]?.dot ?? "bg-[#9ca3af]"}`} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[#6b7280] mt-2">
        Les animations ont lieu le mardi ou le jeudi, au moins 3 semaines à l&apos;avance.
        Les jours ayant déjà un événement au programme du Club ne sont pas disponibles.
      </p>

      {/* Événements du Club ce mois-ci */}
      {monthEvents.length > 0 && (
        <div className="mt-2 pt-2 border-t border-[#f3f4f6] flex flex-col gap-1">
          <p className="text-[11px] font-semibold text-[#374151]">Au programme du Club ce mois-ci</p>
          {cells
            .filter((d): d is string => !!d && byDate.has(d))
            .flatMap((d) =>
              byDate.get(d)!.map((e, k) => (
                <p key={`${d}-${k}`} className="flex items-start gap-1.5 text-[11px] text-[#6b7280]">
                  <span className={`mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0 ${TYPE_STYLES[e.type]?.dot ?? "bg-[#9ca3af]"}`} />
                  <span>
                    <span className="font-semibold text-[#374151]">{Number(d.slice(8))}</span>{" "}
                    {TYPE_STYLES[e.type]?.label ?? e.type} · {e.titre}
                    {d < today && <span className="text-[#9ca3af]"> (passé)</span>}
                  </span>
                </p>
              ))
            )}
          {typesShown.length > 1 && (
            <p className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#9ca3af] mt-0.5">
              {typesShown.map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${TYPE_STYLES[t].dot}`} />
                  {TYPE_STYLES[t].label}
                </span>
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
