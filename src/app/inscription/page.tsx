"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  MEMBER_TYPES,
  SECTORS,
  EXPERTISES,
  COMPANY_SIZES,
  CHARTER_URL,
} from "@/lib/constants";

/* ── Étapes ─────────────────────────────────────────────────── */
const STEPS = [
  "Infos personnelles",
  "Profil professionnel",
  "Charte & validation",
];

/* ── Formulaire complet ──────────────────────────────────────── */
interface FormData {
  /* Étape 1 */
  prenom:    string;
  nom:       string;
  email:     string;
  password:  string;
  telephone: string;
  photo:     File | null;
  /* Étape 2 */
  type_membre:       string;
  fonction:          string;
  entreprise:        string;
  siret:             string;
  secteur:           string;
  taille_entreprise: string;
  zone_geo:          string;
  ville:             string;
  site_web:          string;
  biographie:        string;
  expertises:        string[];
  linkedin:          string;
  /* Étape 3 */
  charte_acceptee: boolean;
}

/* Type séparé pour les erreurs (toutes sont des strings) */
type FormErrors = Partial<{
  prenom:            string;
  nom:               string;
  email:             string;
  password:          string;
  telephone:         string;
  type_membre:       string;
  fonction:          string;
  entreprise:        string;
  siret:             string;
  secteur:           string;
  taille_entreprise: string;
  zone_geo:          string;
  ville:             string;
  biographie:        string;
  expertises:        string;
}>;

const INITIAL_FORM: FormData = {
  prenom: "", nom: "", email: "", password: "", telephone: "", photo: null,
  type_membre: "", fonction: "", entreprise: "", siret: "",
  secteur: "", taille_entreprise: "", zone_geo: "", ville: "",
  site_web: "", biographie: "", expertises: [], linkedin: "",
  charte_acceptee: false,
};

/* ── Composant barre de progression ─────────────────────────── */
function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-start gap-1">
      {STEPS.map((label, i) => {
        const done   = i + 1 < currentStep;
        const active = i + 1 === currentStep;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className="w-[26px] h-[26px] rounded-full flex items-center justify-center"
                style={{ background: done || active ? "#00B4B4" : "#e5e7eb" }}
              >
                {done ? (
                  <span className="text-white text-[12px]">✓</span>
                ) : (
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: active ? "#fff" : "#6b7280" }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] text-center w-[90px]"
                style={{ color: active ? "#00B4B4" : "#6b7280", fontWeight: active ? 600 : 400 }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-[2px] mx-1 rounded-[1px]"
                style={{ background: done ? "#00B4B4" : "#e5e7eb", marginBottom: 14 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Chip expertise cliquable ────────────────────────────────── */
function ExpertiseChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="px-[10px] py-[3px] rounded-[20px] text-[11px] transition-colors cursor-pointer"
      style={{
        border:     `1px solid ${selected ? "#00B4B4" : "#e5e7eb"}`,
        background: selected ? "#e6f7f7" : "#fff",
        color:      selected ? "#00B4B4" : "#374151",
        fontWeight: selected ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}

/* ── Page principale ─────────────────────────────────────────── */
export default function InscriptionPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState<FormData>(INITIAL_FORM);
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  /* Mise à jour d'un champ */
  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  /* Bascule une expertise */
  function toggleExpertise(expertise: string) {
    setForm((prev) => {
      const already = prev.expertises.includes(expertise);
      return {
        ...prev,
        expertises: already
          ? prev.expertises.filter((e) => e !== expertise)
          : [...prev.expertises, expertise],
      };
    });
  }

  /* Validation étape 1 */
  function validateStep1(): boolean {
    const e: FormErrors = {};
    if (!form.prenom.trim())   e.prenom   = "Ce champ est obligatoire";
    if (!form.nom.trim())      e.nom      = "Ce champ est obligatoire";
    if (!form.email.trim())    e.email    = "Ce champ est obligatoire";
    if (!form.password || form.password.length < 8)
      e.password = "Minimum 8 caractères";
    if (!form.telephone.trim()) e.telephone = "Ce champ est obligatoire";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* Validation étape 2 */
  function validateStep2(): boolean {
    const e: FormErrors = {};
    if (!form.type_membre)         e.type_membre        = "Ce champ est obligatoire";
    if (!form.fonction.trim())     e.fonction           = "Ce champ est obligatoire";
    if (!form.entreprise.trim())   e.entreprise         = "Ce champ est obligatoire";
    if (!form.secteur)             e.secteur            = "Ce champ est obligatoire";
    if (!form.taille_entreprise)   e.taille_entreprise  = "Ce champ est obligatoire";
    if (!form.zone_geo.trim())     e.zone_geo           = "Ce champ est obligatoire";
    if (!form.ville.trim())        e.ville              = "Ce champ est obligatoire";
    if (form.expertises.length === 0)
      e.expertises = "Sélectionne au moins une expertise";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* Navigation entre étapes */
  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) setStep((s) => s + 1);
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  /* Soumission finale */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.charte_acceptee) {
      setSubmitError("Tu dois accepter la charte d'engagement pour continuer.");
      return;
    }

    setLoading(true);
    setSubmitError("");

    /* 1. Création du compte Supabase Auth */
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email:    form.email,
      password: form.password,
      options: {
        data: { prenom: form.prenom, nom: form.nom },
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setSubmitError("Cette adresse email est déjà associée à un compte.");
      } else {
        setSubmitError("Une erreur est survenue lors de l'inscription. Réessaie.");
      }
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      setSubmitError("Une erreur inattendue s'est produite. Réessaie.");
      setLoading(false);
      return;
    }

    /* 2. Upload photo de profil si fournie */
    let photoUrl: string | null = null;
    if (form.photo) {
      const ext  = form.photo.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, form.photo, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }
    }

    /* 3. Insertion dans la table members */
    const { error: insertError } = await supabase.from("members").insert({
      id:                userId,
      email:             form.email,
      prenom:            form.prenom,
      nom:               form.nom,
      type_membre:       form.type_membre,
      fonction:          form.fonction,
      entreprise:        form.entreprise,
      siret:             form.siret,
      secteur:           form.secteur,
      taille_entreprise: form.taille_entreprise,
      zone_geo:          form.zone_geo,
      ville:             form.ville,
      site_web:          form.site_web || null,
      photo_url:         photoUrl,
      biographie:        form.biographie,
      expertises:        form.expertises,
      linkedin:          form.linkedin || null,
      telephone:         form.telephone,
      charte_acceptee:   true,
      statut:            "pending",
      role:              "pending",
    });

    if (insertError) {
      setSubmitError("Erreur lors de la sauvegarde de ton profil. Réessaie.");
      setLoading(false);
      return;
    }

    /* 4. Redirection vers page de confirmation */
    router.push("/inscription/confirmation");
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-5">
      <div
        className="w-full max-w-[520px] bg-white rounded-[8px] overflow-hidden"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
      >
        {/* En-tête */}
        <div className="bg-white px-7 py-4 border-b border-[#e5e7eb]">
          <Link href="/">
            <Image src="/logo.svg" alt="Club ESG" width={120} height={40} priority />
          </Link>
        </div>

        <div className="px-7 py-6">
          <h2 className="text-[18px] font-bold text-[#111827] mb-1">
            Rejoindre le Club ESG
          </h2>
          <p className="text-[12px] text-[#6b7280] mb-5">
            Votre demande sera examinée par notre équipe avant validation.
          </p>

          {/* Barre de progression */}
          <div className="mb-6">
            <Stepper currentStep={step} />
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── Étape 1 : Infos personnelles ─────────────── */}
            {step === 1 && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Prénom"
                    placeholder="Thomas"
                    value={form.prenom}
                    onChange={(e) => update("prenom", e.target.value)}
                    error={errors.prenom}
                    required
                  />
                  <Input
                    label="Nom"
                    placeholder="Perrien"
                    value={form.nom}
                    onChange={(e) => update("nom", e.target.value)}
                    error={errors.nom}
                    required
                  />
                </div>
                <Input
                  label="Adresse email"
                  type="email"
                  placeholder="prenom@entreprise.fr"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  error={errors.email}
                  required
                />
                <Input
                  label="Mot de passe"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  error={errors.password}
                  hint="Au moins 8 caractères"
                  required
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  placeholder="+33 6 00 00 00 00"
                  value={form.telephone}
                  onChange={(e) => update("telephone", e.target.value)}
                  error={errors.telephone}
                  required
                />

                {/* Upload photo */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#374151]">
                    Photo de profil
                  </label>
                  <div
                    className="h-14 border border-dashed border-[#e5e7eb] rounded-[6px] bg-[#f5f6f8] flex items-center justify-center gap-2 cursor-pointer hover:border-[#00B4B4] transition-colors"
                    onClick={() => fileRef.current?.click()}
                  >
                    <span className="text-base">📷</span>
                    <span className="text-[11px] text-[#6b7280]">
                      {form.photo
                        ? form.photo.name
                        : "Glisser-déposer ou cliquer · JPEG/PNG · max 5Mo"}
                    </span>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size <= 5 * 1024 * 1024) {
                        update("photo", file);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* ── Étape 2 : Profil professionnel ───────────── */}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                {/* Type de membre */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#374151]">
                    Type de membre <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={form.type_membre}
                    onChange={(e) => update("type_membre", e.target.value)}
                    className="h-[34px] w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#111827] outline-none focus:border-[#00B4B4] transition-colors"
                  >
                    <option value="">Sélectionner...</option>
                    {MEMBER_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.type_membre && (
                    <p className="text-[11px] text-[#ef4444]">{errors.type_membre}</p>
                  )}
                </div>

                <Input
                  label="Fonction / Poste"
                  placeholder="Responsable RSE, Consultant..."
                  value={form.fonction}
                  onChange={(e) => update("fonction", e.target.value)}
                  error={errors.fonction}
                  required
                />
                <Input
                  label="Entreprise"
                  placeholder="Nom de l'entreprise"
                  value={form.entreprise}
                  onChange={(e) => update("entreprise", e.target.value)}
                  error={errors.entreprise}
                  required
                />
                <Input
                  label="SIRET"
                  placeholder="00000000000000"
                  value={form.siret}
                  onChange={(e) => update("siret", e.target.value)}
                  hint="Optionnel · Non visible par les autres membres"
                />

                <div className="grid grid-cols-2 gap-3">
                  {/* Secteur */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-medium text-[#374151]">
                      Secteur d&apos;activité <span className="text-[#ef4444]">*</span>
                    </label>
                    <select
                      value={form.secteur}
                      onChange={(e) => update("secteur", e.target.value)}
                      className="h-[34px] w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#111827] outline-none focus:border-[#00B4B4]"
                    >
                      <option value="">Secteur...</option>
                      {SECTORS.filter((s) => s !== "Tous Secteurs").map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.secteur && (
                      <p className="text-[11px] text-[#ef4444]">{errors.secteur}</p>
                    )}
                  </div>

                  {/* Taille */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-medium text-[#374151]">
                      Taille entreprise <span className="text-[#ef4444]">*</span>
                    </label>
                    <select
                      value={form.taille_entreprise}
                      onChange={(e) => update("taille_entreprise", e.target.value)}
                      className="h-[34px] w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#111827] outline-none focus:border-[#00B4B4]"
                    >
                      <option value="">Taille...</option>
                      {COMPANY_SIZES.map((s) => (
                        <option key={s} value={s}>{s} salariés</option>
                      ))}
                    </select>
                    {errors.taille_entreprise && (
                      <p className="text-[11px] text-[#ef4444]">{errors.taille_entreprise}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Zone géographique"
                    placeholder="Île-de-France"
                    value={form.zone_geo}
                    onChange={(e) => update("zone_geo", e.target.value)}
                    error={errors.zone_geo}
                    required
                  />
                  <Input
                    label="Ville"
                    placeholder="Paris"
                    value={form.ville}
                    onChange={(e) => update("ville", e.target.value)}
                    error={errors.ville}
                    required
                  />
                </div>

                <Input
                  label="Site internet"
                  type="url"
                  placeholder="https://monentreprise.fr"
                  value={form.site_web}
                  onChange={(e) => update("site_web", e.target.value)}
                />
                <Input
                  label="LinkedIn"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedin}
                  onChange={(e) => update("linkedin", e.target.value)}
                />

                {/* Biographie */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <label className="text-[12px] font-medium text-[#374151]">
                      Biographie{" "}
                      <span className="text-[#6b7280] font-normal">(optionnelle)</span>
                    </label>
                    <span className="text-[11px] text-[#6b7280]">
                      {form.biographie.length}/500
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    placeholder="Décris ton parcours, tes missions et ta vision de la RSE… (facultatif)"
                    value={form.biographie}
                    onChange={(e) => update("biographie", e.target.value)}
                    className="w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] py-2 text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none focus:border-[#00B4B4] resize-none transition-colors"
                  />
                  {errors.biographie && (
                    <p className="text-[11px] text-[#ef4444]">{errors.biographie}</p>
                  )}
                </div>

                {/* Expertises multi-select */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#374151]">
                    Expertises <span className="text-[#ef4444]">*</span>{" "}
                    <span className="text-[#6b7280] font-normal">(multi-sélection)</span>
                  </label>
                  <div className="border border-[#e5e7eb] rounded-[6px] p-2 bg-[#f5f6f8] flex flex-wrap gap-1.5">
                    {EXPERTISES.map((exp) => (
                      <ExpertiseChip
                        key={exp}
                        label={exp}
                        selected={form.expertises.includes(exp)}
                        onToggle={() => toggleExpertise(exp)}
                      />
                    ))}
                  </div>
                  {errors.expertises && (
                    <p className="text-[11px] text-[#ef4444]">{errors.expertises}</p>
                  )}
                </div>
              </div>
            )}

            {/* ── Étape 3 : Charte & validation ────────────── */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                {/* Charte */}
                <div className="border border-[#e5e7eb] rounded-[8px] overflow-hidden">
                  <div className="bg-[#f5f6f8] px-4 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#374151]">
                      📄 Charte d&apos;engagement du Club ESG
                    </span>
                    <a
                      href={CHARTER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#00B4B4] font-medium hover:underline"
                    >
                      Télécharger ↓
                    </a>
                  </div>
                  <div className="h-[110px] px-4 py-3 overflow-y-auto">
                    <p className="text-[11px] text-[#6b7280] leading-relaxed">
                      La présente charte définit les engagements des membres du Club ESG…
                    </p>
                    <ul className="mt-2 flex flex-col gap-1">
                      {[
                        "Respect des autres membres et de la confidentialité des échanges",
                        "Contribution active à la vie de la communauté",
                        "Partage d'informations de bonne foi et dans un esprit constructif",
                        "Valorisation de la diversité des profils et des expertises",
                      ].map((item) => (
                        <li key={item} className="text-[11px] text-[#6b7280] leading-relaxed">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Case à cocher */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <div
                    className="w-4 h-4 rounded-[4px] flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors"
                    style={{
                      border:     `1.5px solid ${form.charte_acceptee ? "#00B4B4" : "#d1d5db"}`,
                      background: form.charte_acceptee ? "#00B4B4" : "#fff",
                    }}
                    onClick={() => update("charte_acceptee", !form.charte_acceptee)}
                  >
                    {form.charte_acceptee && (
                      <span className="text-white text-[10px]">✓</span>
                    )}
                  </div>
                  <span className="text-[12px] text-[#374151] leading-relaxed">
                    J&apos;ai lu et j&apos;accepte la charte d&apos;engagement du Club ESG.
                  </span>
                </label>

                {/* Notice délai */}
                <div className="px-3 py-2.5 rounded-[6px] bg-[#f5f6f8] border border-[#e5e7eb]">
                  <p className="text-[11px] text-[#6b7280] leading-relaxed">
                    ⏳ Votre demande sera examinée sous 48h.
                    Vous recevrez un email de confirmation à{" "}
                    <span className="font-semibold text-[#374151]">{form.email}</span>.
                  </p>
                </div>

                {submitError && (
                  <div className="px-3 py-2.5 rounded-[6px] bg-[#fef2f2] border border-[#fecaca]">
                    <p className="text-[12px] text-[#ef4444]">{submitError}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Navigation ────────────────────────────────── */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#e5e7eb]">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack} size="md">
                  ← Retour
                </Button>
              ) : (
                <p className="text-[12px] text-[#6b7280]">
                  Déjà membre ?{" "}
                  <Link href="/connexion" className="text-[#00B4B4] font-semibold hover:underline">
                    Se connecter
                  </Link>
                </p>
              )}

              {step < 3 ? (
                <Button type="button" onClick={handleNext}>
                  Continuer →
                </Button>
              ) : (
                <Button type="submit" loading={loading}>
                  Envoyer ma demande ✓
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
