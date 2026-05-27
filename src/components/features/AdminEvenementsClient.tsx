"use client";

/* Composant client — CRUD des événements (admin) */
import { useState, useTransition } from "react";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { createEvent, updateEvent, deleteEvent } from "@/app/admin/actions";
import { EVENT_TYPES } from "@/lib/constants";
import type { Event, EventType, Intervenant, EventRegistrant } from "@/types";

/* ── Helpers ─────────────────────────────────────────────────── */

const EVENT_TAG_VARIANTS: Record<string, "teal" | "purple" | "orange"> = {
  Webinaire: "teal",
  Afterwork: "purple",
  Workshop:  "orange",
};

const EVENT_ICONS: Record<string, string> = {
  Webinaire: "🎙",
  Afterwork: "🤝",
  Workshop:  "📋",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
  return `${date} · ${time}`;
}

/* Convertit un ISO en valeur datetime-local (YYYY-MM-DDTHH:mm) en heure Paris */
function toDateTimeLocal(iso: string): string {
  const fmt = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Paris',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
    hour12: false,
  });
  return fmt.format(new Date(iso)).replace(' ', 'T');
}

/* ── Styles partagés ─────────────────────────────────────────── */
const inputCls =
  "w-full h-[34px] rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none focus:border-[#016050] transition-colors";
const selectCls =
  "w-full h-[34px] rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#374151] outline-none focus:border-[#016050] transition-colors cursor-pointer";
const textareaCls =
  "w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] py-[8px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none focus:border-[#016050] transition-colors resize-none";

/* ── Champ de formulaire ─────────────────────────────────────── */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-[#374151]">
        {label}
        {required && <span className="text-[#ef4444] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Modale création / édition ───────────────────────────────── */
const EMPTY: {
  titre: string;
  date_heure: string;
  description: string;
  type_event: EventType;
  lien_inscription: string;
  image_url: string;
  intervenants: Intervenant[];
  adresse: string;
} = {
  titre: "",
  date_heure: "",
  description: "",
  type_event: "Webinaire",
  lien_inscription: "",
  image_url: "",
  intervenants: [],
  adresse: "",
};

function EventModal({
  event,
  onClose,
}: {
  event: Event | null;
  onClose: () => void;
}) {
  const isEditing = event !== null;
  const [form, setForm] = useState(
    isEditing
      ? {
          titre:            event.titre,
          date_heure:       toDateTimeLocal(event.date_heure),
          description:      event.description,
          type_event:       event.type_event as EventType,
          lien_inscription: event.lien_inscription,
          image_url:        event.image_url ?? "",
          intervenants:     event.intervenants ?? [],
          adresse:          event.adresse ?? "",
        }
      : { ...EMPTY }
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function set<K extends Exclude<keyof typeof form, "intervenants">>(field: K) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
      ...(field === "type_event" && e.target.value !== "Afterwork" ? { adresse: "" } : {}),
    }));
  }

  function addIntervenant() {
    setForm((prev) => ({ ...prev, intervenants: [...prev.intervenants, { nom: "", url: "" }] }));
  }

  function removeIntervenant(idx: number) {
    setForm((prev) => ({ ...prev, intervenants: prev.intervenants.filter((_, i) => i !== idx) }));
  }

  function setIntervenant(idx: number, field: keyof Intervenant, value: string) {
    setForm((prev) => {
      const updated = prev.intervenants.map((it, i) => i === idx ? { ...it, [field]: value } : it);
      return { ...prev, intervenants: updated };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titre || !form.date_heure || !form.description || !form.lien_inscription) {
      setError("Remplis tous les champs obligatoires.");
      return;
    }
    setError(null);
    const fd = new FormData();
    fd.set("titre", form.titre);
    fd.set("date_heure", form.date_heure);
    fd.set("description", form.description);
    fd.set("type_event", form.type_event);
    fd.set("lien_inscription", form.lien_inscription);
    fd.set("image_url", form.image_url);
    fd.set("intervenants", JSON.stringify(form.intervenants.filter((i) => i.nom.trim())));
    fd.set("adresse", form.type_event === "Afterwork" ? form.adresse : "");

    startTransition(async () => {
      if (isEditing) {
        await updateEvent(event.id, fd);
      } else {
        await createEvent(fd);
      }
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-[10px] shadow-xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto">

        {/* En-tête modale */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <h2 className="text-[15px] font-bold text-[#111827]">
            {isEditing ? "Modifier l'événement" : "Nouvel événement"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#374151] text-[22px] leading-none"
          >
            ×
          </button>
        </div>

        {/* Corps formulaire */}
        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-3.5">
          {error && (
            <p className="text-[12px] text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] rounded-[6px] px-3 py-2">
              {error}
            </p>
          )}

          <Field label="Titre" required>
            <input
              value={form.titre}
              onChange={set("titre")}
              placeholder="Titre de l'événement"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date et heure" required>
              <input
                type="datetime-local"
                value={form.date_heure}
                onChange={set("date_heure")}
                className={inputCls}
              />
            </Field>
            <Field label="Type" required>
              <select
                value={form.type_event}
                onChange={set("type_event")}
                className={selectCls}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description" required>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Description de l'événement…"
              rows={3}
              className={textareaCls}
            />
          </Field>

          <Field label="Lien d'inscription" required>
            <input
              value={form.lien_inscription}
              onChange={set("lien_inscription")}
              placeholder="https://…"
              className={inputCls}
            />
          </Field>

          <Field label="URL de l'image (optionnel)">
            <input
              value={form.image_url}
              onChange={set("image_url")}
              placeholder="https://…"
              className={inputCls}
            />
          </Field>

          {/* Intervenants */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-medium text-[#374151]">
                Intervenant(s) <span className="text-[#9ca3af] font-normal">(optionnel)</span>
              </label>
              <button
                type="button"
                onClick={addIntervenant}
                className="text-[11px] font-semibold text-[#016050] hover:text-[#014d40] transition-colors"
              >
                + Ajouter
              </button>
            </div>
            {form.intervenants.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                {form.intervenants.map((it, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      value={it.nom}
                      onChange={(e) => setIntervenant(idx, "nom", e.target.value)}
                      placeholder="Nom"
                      className={inputCls + " flex-1"}
                    />
                    <input
                      value={it.url}
                      onChange={(e) => setIntervenant(idx, "url", e.target.value)}
                      placeholder="URL LinkedIn ou profil"
                      className={inputCls + " flex-[2]"}
                    />
                    <button
                      type="button"
                      onClick={() => removeIntervenant(idx)}
                      className="text-[#9ca3af] hover:text-[#ef4444] text-[18px] leading-none flex-shrink-0 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adresse (Afterwork uniquement) */}
          {form.type_event === "Afterwork" && (
            <Field label="Adresse">
              <input
                value={form.adresse}
                onChange={set("adresse")}
                placeholder="ex. 15 rue de Rivoli, 75001 Paris"
                className={inputCls}
              />
            </Field>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f3f4f6]">
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={pending}>
              {isEditing ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Modale liste des inscrits ───────────────────────────────── */
function InscritsModal({
  event,
  registrants,
  onClose,
}: {
  event: Event;
  registrants: EventRegistrant[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[10px] shadow-xl w-full max-w-[520px] max-h-[80vh] flex flex-col">
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb] flex-shrink-0">
          <div>
            <h2 className="text-[15px] font-bold text-[#111827]">Inscrits</h2>
            <p className="text-[12px] text-[#6b7280] mt-0.5 truncate max-w-[340px]">{event.titre}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-semibold text-[#016050] bg-[#e4f7f3] px-2.5 py-1 rounded-full">
              {registrants.length} inscrit{registrants.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={onClose}
              className="text-[#9ca3af] hover:text-[#374151] text-[22px] leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="overflow-y-auto flex-1 px-4 py-3">
          {registrants.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-2xl mb-2">👥</p>
              <p className="text-[13px] text-[#6b7280]">Aucun inscrit pour le moment.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {registrants.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] bg-[#fafafa] border border-[#f3f4f6]"
                >
                  <Avatar prenom={r.prenom} nom={r.nom} photoUrl={r.photo_url} size={32} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#111827] truncate">
                      {r.prenom} {r.nom}
                    </p>
                    <p className="text-[11px] text-[#6b7280] truncate">{r.entreprise} · {r.email}</p>
                  </div>
                  <span className="text-[10px] text-[#9ca3af] flex-shrink-0">
                    {new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Carte événement ─────────────────────────────────────────── */
function EventCard({
  event,
  registrants,
  onEdit,
}: {
  event: Event;
  registrants: EventRegistrant[];
  onEdit: (ev: Event) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showInscrits, setShowInscrits]   = useState(false);
  const isPast = new Date(event.date_heure) < new Date();

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    startTransition(() => deleteEvent(event.id));
  }

  return (
    <>
      {showInscrits && (
        <InscritsModal
          event={event}
          registrants={registrants}
          onClose={() => setShowInscrits(false)}
        />
      )}

      <div
        className={[
          "bg-white border rounded-[8px] p-4 flex gap-4",
          isPast ? "border-[#f3f4f6] opacity-60" : "border-[#e5e7eb] hover:border-[#016050]",
          "transition-colors",
        ].join(" ")}
      >
        {/* Vignette */}
        {event.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url}
            alt=""
            className="w-[64px] h-[48px] rounded-[6px] object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-[48px] h-[48px] rounded-[8px] bg-[#e4f7f3] flex items-center justify-center flex-shrink-0 text-xl">
            {EVENT_ICONS[event.type_event] ?? "📅"}
          </div>
        )}

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Tag variant={EVENT_TAG_VARIANTS[event.type_event] ?? "teal"}>
              {event.type_event}
            </Tag>
            {isPast && <Tag variant="neutral">Passé</Tag>}
            <span className="text-[11px] text-[#6b7280]">{formatDate(event.date_heure)}</span>
          </div>
          <p className="text-[13px] font-semibold text-[#111827] truncate">{event.titre}</p>
          <p className="text-[12px] text-[#6b7280] line-clamp-1 mt-0.5">{event.description}</p>
        </div>

        {/* Boutons action */}
        <div className="flex-shrink-0 flex items-center gap-1.5">
          {/* Badge + bouton inscrits */}
          <button
            onClick={() => setShowInscrits(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[11px] font-semibold border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f5f6f8] transition-colors whitespace-nowrap"
          >
            👥
            <span
              className={[
                "inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1",
                registrants.length > 0
                  ? "bg-[#016050] text-white"
                  : "bg-[#f5f6f8] text-[#6b7280]",
              ].join(" ")}
            >
              {registrants.length}
            </span>
          </button>

          {confirmDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDelete(false)}
              disabled={pending}
            >
              Annuler
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setConfirmDelete(false); onEdit(event); }}
            disabled={pending}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={pending}
            onClick={handleDelete}
            disabled={pending}
          >
            {confirmDelete ? "Confirmer ?" : "Supprimer"}
          </Button>
        </div>
      </div>
    </>
  );
}

/* ── Composant principal ─────────────────────────────────────── */
export default function AdminEvenementsClient({
  events,
  registrations = [],
}: {
  events: Event[];
  registrations?: EventRegistrant[];
}) {
  const [modalEvent, setModalEvent] = useState<Event | null | "new">(null);

  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date_heure) >= now)
    .sort((a, b) => new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime());
  const past = events
    .filter((e) => new Date(e.date_heure) < now)
    .sort((a, b) => new Date(b.date_heure).getTime() - new Date(a.date_heure).getTime());

  const ordered = [...upcoming, ...past];

  /* Grouper les inscrits par event_id */
  const registrantsByEvent = registrations.reduce<Record<string, EventRegistrant[]>>(
    (acc, r) => {
      if (!acc[r.event_id]) acc[r.event_id] = [];
      acc[r.event_id].push(r);
      return acc;
    },
    {}
  );

  /* Total inscrits tous events confondus */
  const totalInscrits = registrations.length;

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827]">Événements</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            {upcoming.length} à venir · {past.length} passé{past.length > 1 ? "s" : ""} · {totalInscrits} inscription{totalInscrits > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalEvent("new")}>
          + Nouvel événement
        </Button>
      </div>

      {/* Liste */}
      {ordered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-2xl mb-2">📅</p>
          <p className="text-[13px] text-[#6b7280]">Aucun événement pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {ordered.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              registrants={registrantsByEvent[ev.id] ?? []}
              onEdit={(e) => setModalEvent(e)}
            />
          ))}
        </div>
      )}

      {/* Modale create / edit */}
      {modalEvent !== null && (
        <EventModal
          event={modalEvent === "new" ? null : modalEvent}
          onClose={() => setModalEvent(null)}
        />
      )}
    </div>
  );
}
