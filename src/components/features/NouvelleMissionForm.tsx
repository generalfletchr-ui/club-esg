"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  SECTORS,
  EXPERTISES,
  MISSION_DOMAINES,
  MISSION_PRESTATIONS,
  MISSION_MODALITES,
} from "@/lib/constants";
import { createMission, type MissionFormData } from "@/app/missions/actions";

interface FormState {
  type_mission: string;
  titre: string;
  description: string;
  domaine: string;
  secteur_client: string;
  expertises_requises: string[];
  type_prestation: string;
  duree_estimee: string;
  modalite: string;
  localisation: string;
  budget: string;
  expire_le: string;
}

interface Errors {
  type_mission?: string;
  titre?: string;
  description?: string;
  domaine?: string;
}

const DEFAULT_EXPIRE = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
};

export default function NouvelleMissionForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted]  = useState(false);
  const [errors, setErrors]        = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    type_mission:        "",
    titre:               "",
    description:         "",
    domaine:             "",
    secteur_client:      "",
    expertises_requises: [],
    type_prestation:     "",
    duree_estimee:       "",
    modalite:            "",
    localisation:        "",
    budget:              "",
    expire_le:           DEFAULT_EXPIRE(),
  });

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function toggleExpertise(exp: string) {
    setForm((prev) => ({
      ...prev,
      expertises_requises: prev.expertises_requises.includes(exp)
        ? prev.expertises_requises.filter((e) => e !== exp)
        : [...prev.expertises_requises, exp],
    }));
  }

  function validate(): boolean {
    const errs: Errors = {};
    if (!form.type_mission) errs.type_mission = "Champ obligatoire";
    if (!form.titre.trim()) errs.titre = "Champ obligatoire";
    if (!form.description.trim()) errs.description = "Champ obligatoire";
    if (!form.domaine) errs.domaine = "Champ obligatoire";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setServerError(null);

    const data: MissionFormData = {
      type_mission:        form.type_mission,
      titre:               form.titre,
      description:         form.description,
      domaine:             form.domaine,
      secteur_client:      form.secteur_client || undefined,
      expertises_requises: form.expertises_requises,
      type_prestation:     form.type_prestation || undefined,
      duree_estimee:       form.duree_estimee || undefined,
      modalite:            form.modalite || undefined,
      localisation:        form.localisation || undefined,
      budget:              form.budget || undefined,
      expire_le:           form.expire_le || undefined,
    };

    startTransition(async () => {
      try {
        await createMission(data);
        setSubmitted(true);
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    });
  }

  if (submitted) {
    return (
      <div className="max-w-[600px] mx-auto py-16 text-center">
        <p className="text-4xl mb-4">🎉</p>
        <h2 className="text-[20px] font-bold text-[#111827] mb-2">
          Fiche envoyée avec succès !
        </h2>
        <p className="text-[13px] text-[#6b7280] mb-6">
          Votre fiche est en attente de validation par l'équipe Club ESG.
          Vous recevrez un email dès qu'elle sera publiée.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/mes-missions">
            <Button variant="outline" size="md">Voir mes missions</Button>
          </Link>
          <Link href="/missions">
            <Button variant="primary" size="md">Retour au job board</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[680px]">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 text-[11px] text-[#9ca3af] mb-5">
        <Link href="/missions" className="hover:text-[#374151] transition-colors">
          Missions
        </Link>
        <span>›</span>
        <span className="text-[#374151]">Publier une mission</span>
      </div>

      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#111827]">Publier une opportunité</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          Votre fiche sera soumise à validation avant d'être publiée sur le job board.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Type de mission */}
        <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-5">
          <p className="text-[13px] font-semibold text-[#111827] mb-3">
            Type de mission <span className="text-[#ef4444]">*</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                value: "binome",
                label: "Binôme recherché",
                desc:  "J'ai une mission client et cherche un partenaire pour la réaliser ensemble.",
                icon:  "🤝",
              },
              {
                value: "cession",
                label: "Mission à céder",
                desc:  "Je ne peux pas prendre cette mission et souhaite la proposer à un autre membre.",
                icon:  "🎁",
              },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("type_mission", opt.value)}
                className={[
                  "text-left p-4 rounded-[8px] border-2 transition-all",
                  form.type_mission === opt.value
                    ? "border-[#016050] bg-[#f0fdf9]"
                    : "border-[#e5e7eb] hover:border-[#016050]/40",
                ].join(" ")}
              >
                <p className="text-xl mb-1">{opt.icon}</p>
                <p className="text-[13px] font-semibold text-[#111827] mb-0.5">{opt.label}</p>
                <p className="text-[11px] text-[#6b7280]">{opt.desc}</p>
              </button>
            ))}
          </div>
          {errors.type_mission && (
            <p className="text-[11px] text-[#ef4444] mt-2">{errors.type_mission}</p>
          )}
        </div>

        {/* Informations principales */}
        <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-5 flex flex-col gap-4">
          <p className="text-[13px] font-semibold text-[#111827]">Informations principales</p>

          {/* Titre */}
          <div>
            <label className="label-caps mb-1 block">
              Titre de la mission <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              value={form.titre}
              onChange={(e) => set("titre", e.target.value)}
              placeholder="Ex : Bilan carbone Scope 3 — PME industrie"
              maxLength={120}
              className={[
                "w-full border rounded-[6px] px-3 py-2 text-[13px] text-[#111827] placeholder:text-[#9ca3af]",
                "focus:outline-none focus:ring-1 focus:ring-[#016050]",
                errors.titre ? "border-[#ef4444]" : "border-[#e5e7eb]",
              ].join(" ")}
            />
            {errors.titre && <p className="text-[11px] text-[#ef4444] mt-1">{errors.titre}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label-caps mb-1 block">
              Description <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Contexte du client, périmètre de la mission, livrables attendus..."
              rows={5}
              className={[
                "w-full border rounded-[6px] px-3 py-2 text-[13px] text-[#111827] placeholder:text-[#9ca3af] resize-none",
                "focus:outline-none focus:ring-1 focus:ring-[#016050]",
                errors.description ? "border-[#ef4444]" : "border-[#e5e7eb]",
              ].join(" ")}
            />
            {errors.description && (
              <p className="text-[11px] text-[#ef4444] mt-1">{errors.description}</p>
            )}
          </div>

          {/* Domaine ESG */}
          <div>
            <label className="label-caps mb-1 block">
              Domaine ESG <span className="text-[#ef4444]">*</span>
            </label>
            <select
              value={form.domaine}
              onChange={(e) => set("domaine", e.target.value)}
              className={[
                "w-full border rounded-[6px] px-3 py-2 text-[13px] text-[#374151] bg-white",
                "focus:outline-none focus:ring-1 focus:ring-[#016050]",
                errors.domaine ? "border-[#ef4444]" : "border-[#e5e7eb]",
              ].join(" ")}
            >
              <option value="">Sélectionner un domaine</option>
              {MISSION_DOMAINES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.domaine && <p className="text-[11px] text-[#ef4444] mt-1">{errors.domaine}</p>}
          </div>

          {/* Secteur client */}
          <div>
            <label className="label-caps mb-1 block">Secteur du client</label>
            <select
              value={form.secteur_client}
              onChange={(e) => set("secteur_client", e.target.value)}
              className="w-full border border-[#e5e7eb] rounded-[6px] px-3 py-2 text-[13px] text-[#374151] bg-white focus:outline-none focus:ring-1 focus:ring-[#016050]"
            >
              <option value="">Sélectionner un secteur</option>
              {SECTORS.filter((s) => s !== "Tous Secteurs").map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Expertises requises */}
        <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-5">
          <p className="text-[13px] font-semibold text-[#111827] mb-1">Expertises recherchées</p>
          <p className="text-[11px] text-[#6b7280] mb-3">
            Sélectionnez les expertises dont vous avez besoin ({form.expertises_requises.length} sélectionnée{form.expertises_requises.length > 1 ? "s" : ""})
          </p>
          <div className="flex flex-wrap gap-2">
            {EXPERTISES.map((exp) => {
              const active = form.expertises_requises.includes(exp);
              return (
                <button
                  key={exp}
                  type="button"
                  onClick={() => toggleExpertise(exp)}
                  className={[
                    "px-3 py-1.5 rounded-[20px] text-[11px] font-semibold transition-colors border",
                    active
                      ? "bg-[#016050] text-white border-[#016050]"
                      : "bg-white text-[#374151] border-[#e5e7eb] hover:border-[#016050]/40 hover:text-[#016050]",
                  ].join(" ")}
                >
                  {exp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Détails logistiques */}
        <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-5 flex flex-col gap-4">
          <p className="text-[13px] font-semibold text-[#111827]">Détails logistiques</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type de prestation */}
            <div>
              <label className="label-caps mb-1 block">Type de prestation</label>
              <select
                value={form.type_prestation}
                onChange={(e) => set("type_prestation", e.target.value)}
                className="w-full border border-[#e5e7eb] rounded-[6px] px-3 py-2 text-[13px] text-[#374151] bg-white focus:outline-none focus:ring-1 focus:ring-[#016050]"
              >
                <option value="">Sélectionner</option>
                {MISSION_PRESTATIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Durée estimée */}
            <div>
              <label className="label-caps mb-1 block">Durée estimée</label>
              <input
                type="text"
                value={form.duree_estimee}
                onChange={(e) => set("duree_estimee", e.target.value)}
                placeholder="Ex : 3 jours, 2 semaines, 1 mois"
                className="w-full border border-[#e5e7eb] rounded-[6px] px-3 py-2 text-[13px] placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#016050]"
              />
            </div>

            {/* Modalité */}
            <div>
              <label className="label-caps mb-1 block">Modalité</label>
              <select
                value={form.modalite}
                onChange={(e) => set("modalite", e.target.value)}
                className="w-full border border-[#e5e7eb] rounded-[6px] px-3 py-2 text-[13px] text-[#374151] bg-white focus:outline-none focus:ring-1 focus:ring-[#016050]"
              >
                <option value="">Sélectionner</option>
                {MISSION_MODALITES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Localisation */}
            <div>
              <label className="label-caps mb-1 block">Localisation</label>
              <input
                type="text"
                value={form.localisation}
                onChange={(e) => set("localisation", e.target.value)}
                placeholder="Ex : Paris, Lyon, Île-de-France"
                className="w-full border border-[#e5e7eb] rounded-[6px] px-3 py-2 text-[13px] placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#016050]"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="label-caps mb-1 block">Budget indicatif</label>
              <input
                type="text"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
                placeholder="Ex : 5 000 €, 3–5 k€, À définir"
                className="w-full border border-[#e5e7eb] rounded-[6px] px-3 py-2 text-[13px] placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#016050]"
              />
            </div>

            {/* Date d'expiration */}
            <div>
              <label className="label-caps mb-1 block">Date d'expiration</label>
              <input
                type="date"
                value={form.expire_le}
                onChange={(e) => set("expire_le", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-[#e5e7eb] rounded-[6px] px-3 py-2 text-[13px] text-[#374151] focus:outline-none focus:ring-1 focus:ring-[#016050]"
              />
            </div>
          </div>
        </div>

        {/* Erreur serveur */}
        {serverError && (
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-[8px] px-4 py-3">
            <p className="text-[12px] text-[#ef4444]">{serverError}</p>
          </div>
        )}

        {/* Soumission */}
        <div className="flex items-center gap-3 justify-end">
          <Link href="/missions">
            <Button variant="outline" size="md" type="button">Annuler</Button>
          </Link>
          <Button variant="primary" size="md" type="submit" loading={pending}>
            Soumettre la fiche
          </Button>
        </div>
      </form>
    </div>
  );
}
