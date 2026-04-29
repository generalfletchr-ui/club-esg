"use client";

/* Composant client — CRUD des replays (admin) */
import { useState, useTransition } from "react";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { createReplay, updateReplay, deleteReplay } from "@/app/admin/actions";
import { EVENT_TYPES } from "@/lib/constants";
import type { Replay, EventType } from "@/types";

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
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Styles partagés ─────────────────────────────────────────── */
const inputCls =
  "w-full h-[34px] rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none focus:border-[#00B4B4] transition-colors";
const selectCls =
  "w-full h-[34px] rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#374151] outline-none focus:border-[#00B4B4] transition-colors cursor-pointer";
const textareaCls =
  "w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] py-[8px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none focus:border-[#00B4B4] transition-colors resize-none";

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
  date_event: string;
  description: string;
  type_event: EventType;
  lien_replay: string;
  intervenants: string;
  image_url: string;
} = {
  titre:        "",
  date_event:   "",
  description:  "",
  type_event:   "Webinaire",
  lien_replay:  "",
  intervenants: "",
  image_url:    "",
};

function ReplayModal({
  replay,
  onClose,
}: {
  replay: Replay | null;
  onClose: () => void;
}) {
  const isEditing = replay !== null;
  const [form, setForm] = useState(
    isEditing
      ? {
          titre:        replay.titre,
          date_event:   replay.date_event.slice(0, 10),
          description:  replay.description,
          type_event:   replay.type_event as EventType,
          lien_replay:  replay.lien_replay,
          intervenants: replay.intervenants ?? "",
          image_url:    replay.image_url ?? "",
        }
      : { ...EMPTY }
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(field: K) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titre || !form.date_event || !form.description || !form.lien_replay) {
      setError("Remplis tous les champs obligatoires.");
      return;
    }
    setError(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));

    startTransition(async () => {
      if (isEditing) {
        await updateReplay(replay.id, fd);
      } else {
        await createReplay(fd);
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
            {isEditing ? "Modifier le replay" : "Nouveau replay"}
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
              placeholder="Titre du replay"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date de l'événement" required>
              <input
                type="date"
                value={form.date_event}
                onChange={set("date_event")}
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
              placeholder="Description du replay…"
              rows={3}
              className={textareaCls}
            />
          </Field>

          <Field label="Lien replay (HubSpot)" required>
            <input
              value={form.lien_replay}
              onChange={set("lien_replay")}
              placeholder="https://…"
              className={inputCls}
            />
          </Field>

          <Field label="Intervenant(s) (optionnel)">
            <input
              value={form.intervenants}
              onChange={set("intervenants")}
              placeholder="ex. Marie Dupont, Jean Martin"
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

/* ── Carte replay ────────────────────────────────────────────── */
function ReplayCard({
  replay,
  onEdit,
}: {
  replay: Replay;
  onEdit: (r: Replay) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    startTransition(() => deleteReplay(replay.id));
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-4 flex gap-4 hover:border-[#00B4B4] transition-colors">
      {/* Vignette */}
      {replay.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={replay.image_url}
          alt=""
          className="w-[64px] h-[48px] rounded-[6px] object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-[48px] h-[48px] rounded-[8px] bg-[#f5f3ff] flex items-center justify-center flex-shrink-0 text-xl">
          {EVENT_ICONS[replay.type_event] ?? "▶"}
        </div>
      )}

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Tag variant={EVENT_TAG_VARIANTS[replay.type_event] ?? "teal"}>
            {replay.type_event}
          </Tag>
          <span className="text-[11px] text-[#6b7280]">{formatDate(replay.date_event)}</span>
        </div>
        <p className="text-[13px] font-semibold text-[#111827] truncate">{replay.titre}</p>
        {replay.intervenants && (
          <p className="text-[11px] text-[#9ca3af] mt-0.5 truncate">
            👤 {replay.intervenants}
          </p>
        )}
        <p className="text-[12px] text-[#6b7280] line-clamp-1 mt-0.5">{replay.description}</p>
      </div>

      {/* Boutons action */}
      <div className="flex-shrink-0 flex items-center gap-1.5">
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
          onClick={() => { setConfirmDelete(false); onEdit(replay); }}
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
  );
}

/* ── Composant principal ─────────────────────────────────────── */
export default function AdminReplaysClient({ replays }: { replays: Replay[] }) {
  const [modalReplay, setModalReplay] = useState<Replay | null | "new">(null);

  const sorted = [...replays].sort(
    (a, b) => new Date(b.date_event).getTime() - new Date(a.date_event).getTime()
  );

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#111827]">Replays</h1>
          <p className="text-[12px] text-[#6b7280] mt-0.5">
            {replays.length} replay{replays.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalReplay("new")}>
          + Nouveau replay
        </Button>
      </div>

      {/* Liste */}
      {sorted.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-2xl mb-2">▶</p>
          <p className="text-[13px] text-[#6b7280]">Aucun replay pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sorted.map((r) => (
            <ReplayCard
              key={r.id}
              replay={r}
              onEdit={(rep) => setModalReplay(rep)}
            />
          ))}
        </div>
      )}

      {/* Modale create / edit */}
      {modalReplay !== null && (
        <ReplayModal
          replay={modalReplay === "new" ? null : modalReplay}
          onClose={() => setModalReplay(null)}
        />
      )}
    </div>
  );
}
