"use client";

/* Composant client — formulaire de proposition d'animation (création / ajustement) */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import AnimationDatePicker from "@/components/features/AnimationDatePicker";
import { proposeAnimation, updateAnimationProposal } from "@/app/proposer-animation/actions";
import {
  ANIMATION_FORMATS,
  ANIMATION_THEMES,
  HEURE_WEBINAIRE,
  TITRE_MAX,
  atelierHeures,
  takenDates,
  formatDateLongue,
  formatHeure,
  validateProposal,
  type AgendaEntry,
  type ProposalInput,
} from "@/lib/animations";
import type { AnimationProposal } from "@/types";

/* ── Styles partagés ─────────────────────────────────────────── */
const inputCls =
  "w-full h-[34px] rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none focus:border-[#016050] transition-colors";
const selectCls =
  "w-full h-[34px] rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#374151] outline-none focus:border-[#016050] transition-colors cursor-pointer";

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-[#374151]">
        {label}
        {required && <span className="text-[#ef4444] ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-[#9ca3af]">{hint}</p>}
      {error && <p className="text-[11px] text-[#ef4444]">{error}</p>}
    </div>
  );
}

export default function ProposerAnimationForm({
  prenom,
  nom,
  today,
  agenda,
  proposal,
}: {
  prenom: string;
  nom: string;
  /* Date du jour à Paris (AAAA-MM-JJ) */
  today: string;
  /* Événements à venir de l'agenda du Club, affichés dans le calendrier */
  agenda: AgendaEntry[];
  /* Proposition « À ajuster » à modifier ; absente pour une nouvelle proposition */
  proposal?: AnimationProposal;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [sentTitle, setSentTitle] = useState<string | null>(null);

  const empty: ProposalInput = {
    format: "webinaire",
    theme: "",
    theme_autre: "",
    titre: "",
    date_souhaitee: "",
    heure: HEURE_WEBINAIRE,
    coanimateur_nom: "",
    coanimateur_email: "",
    engagement: false,
  };

  const [form, setForm] = useState<ProposalInput>(
    proposal
      ? {
          format: proposal.format,
          theme: proposal.theme,
          theme_autre: proposal.theme_autre ?? "",
          titre: proposal.titre,
          /* Date déjà passée sous le délai : à choisir de nouveau */
          date_souhaitee: proposal.date_souhaitee,
          heure: proposal.heure.slice(0, 5),
          coanimateur_nom: proposal.coanimateur_nom ?? "",
          coanimateur_email: proposal.coanimateur_email ?? "",
          engagement: false,
        }
      : empty
  );

  function set<K extends keyof ProposalInput>(field: K, value: ProposalInput[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setFormat(format: string) {
    setForm((prev) => ({
      ...prev,
      format,
      heure: format === "webinaire" ? HEURE_WEBINAIRE : prev.heure === HEURE_WEBINAIRE ? "14:00" : prev.heure,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);

    /* Même contrôle que le serveur, pour un retour immédiat */
    const check = validateProposal(form, today, takenDates(agenda));
    if ("errors" in check) {
      setErrors(check.errors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const result = proposal
        ? await updateAnimationProposal(proposal.id, form)
        : await proposeAnimation(form);

      if (result.errors) { setErrors(result.errors); return; }
      if (result.error) { setGlobalError(result.error); return; }

      if (proposal) {
        router.push("/proposer-animation");
        return;
      }
      setSentTitle(form.titre.trim());
      setForm(empty);
      router.refresh();
    });
  }

  if (sentTitle) {
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-[8px] px-6 py-10 text-center">
        <p className="text-2xl mb-3">🎉</p>
        <p className="text-[15px] font-semibold text-[#111827] mb-1">Proposition envoyée !</p>
        <p className="text-[12px] text-[#6b7280] mb-5">
          Merci pour « {sentTitle} ». Un e-mail de confirmation vient de vous être envoyé :
          l&apos;équipe du Club ESG revient vers vous sous une semaine.
        </p>
        <Button variant="outline" onClick={() => setSentTitle(null)}>
          Proposer une autre animation
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e5e7eb] rounded-[8px] px-5 py-5 flex flex-col gap-4"
      noValidate
    >
      {proposal?.message_admin && (
        <div className="rounded-[6px] border border-[#fde68a] bg-[#fefce8] px-3 py-2.5">
          <p className="text-[11px] font-semibold text-[#ca8a04] mb-0.5">Ajustement demandé par l&apos;équipe</p>
          <p className="text-[12px] text-[#374151] whitespace-pre-line">{proposal.message_admin}</p>
        </div>
      )}

      {globalError && (
        <p className="text-[12px] text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] rounded-[6px] px-3 py-2">
          {globalError}
        </p>
      )}

      <Field label="Prénom et nom">
        <input value={`${prenom} ${nom}`} readOnly className={`${inputCls} bg-[#f5f6f8] text-[#6b7280]`} />
      </Field>

      <Field label="Format" required error={errors.format}>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ANIMATION_FORMATS) as (keyof typeof ANIMATION_FORMATS)[]).map((f) => (
            <label
              key={f}
              className={[
                "flex items-center gap-2 px-3 h-[34px] rounded-[6px] border text-[12px] cursor-pointer transition-colors",
                form.format === f
                  ? "border-[#016050] bg-[#e4f7f3] text-[#016050] font-semibold"
                  : "border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f5f6f8]",
              ].join(" ")}
            >
              <input
                type="radio"
                name="format"
                value={f}
                checked={form.format === f}
                onChange={() => setFormat(f)}
                className="accent-[#016050]"
              />
              {ANIMATION_FORMATS[f].label}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Thème" required error={errors.theme}>
        <select value={form.theme} onChange={(e) => set("theme", e.target.value)} className={selectCls}>
          <option value="">Choisir un thème…</option>
          {ANIMATION_THEMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </Field>

      {form.theme === "Autre" && (
        <Field label="Précisez le thème" required error={errors.theme_autre}>
          <input
            value={form.theme_autre}
            onChange={(e) => set("theme_autre", e.target.value)}
            placeholder="ex. Biodiversité"
            className={inputCls}
          />
        </Field>
      )}

      <Field
        label="Titre de l'animation"
        required
        error={errors.titre}
        hint={`${form.titre.length} / ${TITRE_MAX} caractères`}
      >
        <input
          value={form.titre}
          maxLength={TITRE_MAX}
          onChange={(e) => set("titre", e.target.value)}
          placeholder="ex. CSRD : réussir sa première double matérialité"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Date souhaitée"
          required
          error={errors.date_souhaitee}
          hint={form.date_souhaitee ? `Sélectionnée : ${formatDateLongue(form.date_souhaitee)}` : undefined}
        >
          <AnimationDatePicker
            value={form.date_souhaitee}
            onChange={(d) => set("date_souhaitee", d)}
            today={today}
            agenda={agenda}
          />
        </Field>

        <Field label="Heure" required error={errors.heure}>
          {form.format === "webinaire" ? (
            <>
              <input value={formatHeure(HEURE_WEBINAIRE)} readOnly className={`${inputCls} bg-[#f5f6f8] text-[#6b7280]`} />
              <p className="text-[11px] text-[#9ca3af]">Les webinaires ont lieu à 11h00.</p>
            </>
          ) : (
            <select value={form.heure} onChange={(e) => set("heure", e.target.value)} className={selectCls}>
              {atelierHeures().map((h) => (
                <option key={h} value={h}>{formatHeure(h)}</option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Co-animateur : nom (facultatif)" error={errors.coanimateur_nom}>
          <input
            value={form.coanimateur_nom}
            onChange={(e) => set("coanimateur_nom", e.target.value)}
            placeholder="Prénom Nom"
            className={inputCls}
          />
        </Field>
        <Field label="Co-animateur : e-mail (facultatif)" error={errors.coanimateur_email}>
          <input
            type="email"
            value={form.coanimateur_email}
            onChange={(e) => set("coanimateur_email", e.target.value)}
            placeholder="prenom.nom@exemple.fr"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2 text-[12px] text-[#374151] cursor-pointer">
          <input
            type="checkbox"
            checked={form.engagement}
            onChange={(e) => set("engagement", e.target.checked)}
            className="mt-0.5 accent-[#016050]"
          />
          <span>
            Je m&apos;engage à ne pas faire de présentation commerciale pendant l&apos;animation,
            conformément à la règle du Club.<span className="text-[#ef4444] ml-0.5">*</span>
          </span>
        </label>
        {errors.engagement && <p className="text-[11px] text-[#ef4444]">{errors.engagement}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-3 border-t border-[#f3f4f6]">
        {proposal && (
          <Button type="button" variant="outline" onClick={() => router.push("/proposer-animation")} disabled={pending}>
            Annuler
          </Button>
        )}
        <Button type="submit" variant="primary" loading={pending}>
          {proposal ? "Renvoyer ma proposition" : "Envoyer ma proposition"}
        </Button>
      </div>
    </form>
  );
}
