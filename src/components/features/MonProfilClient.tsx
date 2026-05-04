"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Tag from "@/components/ui/Tag";
import Card from "@/components/ui/Card";
import {
  MEMBER_TYPES,
  SECTORS,
  EXPERTISES,
  COMPANY_SIZES,
  EVENT_TYPES,
} from "@/lib/constants";
import type { Member, MemberType, CompanySize } from "@/types";

/* ── Textarea réutilisable ───────────────────────────────────── */
function Textarea({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 4,
  required,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-[#374151]">
        {label}
        {required && <span className="text-[#ef4444] ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className="w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] py-[8px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#016050] resize-none"
      />
      {hint && (
        <p className="text-[11px] text-[#6b7280]">{hint}</p>
      )}
    </div>
  );
}

/* ── Select réutilisable ─────────────────────────────────────── */
function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-[#374151]">
        {label}
        {required && <span className="text-[#ef4444] ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[34px] w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#374151] outline-none focus:border-[#016050] transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Section titre ───────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[13px] font-semibold text-[#374151] pb-2 border-b border-[#e5e7eb] mb-4">
      {children}
    </h2>
  );
}

/* ── Composant principal ─────────────────────────────────────── */
export default function MonProfilClient({ member }: { member: Member }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  /* ── État du formulaire ──────────────────────────────────── */
  const [prenom, setPrenom] = useState(member.prenom);
  const [nom, setNom] = useState(member.nom);
  const [typeMembre, setTypeMembre] = useState<MemberType>(member.type_membre);
  const [fonction, setFonction] = useState(member.fonction);
  const [entreprise, setEntreprise] = useState(member.entreprise);
  const [secteur, setSecteur] = useState(member.secteur);
  const [tailleEntreprise, setTailleEntreprise] = useState<CompanySize>(
    member.taille_entreprise
  );
  const [zoneGeo, setZoneGeo] = useState(member.zone_geo);
  const [ville, setVille] = useState(member.ville);
  const [siteWeb, setSiteWeb] = useState(member.site_web ?? "");
  const [biographie, setBiographie] = useState(member.biographie);
  const [expertises, setExpertises] = useState<string[]>(member.expertises);
  const [linkedin, setLinkedin] = useState(member.linkedin ?? "");
  const [telephone, setTelephone] = useState(member.telephone ?? "");

  /* ── Photo ───────────────────────────────────────────────── */
  const [photoUrl, setPhotoUrl] = useState<string | null>(member.photo_url);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  /* ── Feedback ────────────────────────────────────────────── */
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ── Suppression ─────────────────────────────────────────── */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ── Gestion de la photo ─────────────────────────────────── */
  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("La photo doit faire moins de 5 Mo.");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  /* ── Toggle expertise ────────────────────────────────────── */
  function toggleExpertise(exp: string) {
    setExpertises((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
    );
  }

  /* ── Sauvegarde ──────────────────────────────────────────── */
  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const supabase = createClient();
      let finalPhotoUrl = photoUrl;

      /* Upload photo si changée */
      if (photoFile) {
        setUploadingPhoto(true);
        const ext = photoFile.name.split(".").pop();
        const path = `${member.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, photoFile, { upsert: true });

        if (uploadError) throw new Error("Erreur lors de l'upload de la photo.");

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);
        finalPhotoUrl = urlData.publicUrl + `?t=${Date.now()}`;
        setUploadingPhoto(false);
      } else if (photoUrl === null && member.photo_url) {
        /* Photo supprimée */
        const ext = member.photo_url.split(".").pop()?.split("?")[0];
        await supabase.storage
          .from("avatars")
          .remove([`${member.id}/avatar.${ext}`]);
        finalPhotoUrl = null;
      }

      /* Mise à jour du profil */
      const { error } = await supabase
        .from("members")
        .update({
          prenom,
          nom,
          type_membre: typeMembre,
          fonction,
          entreprise,
          secteur,
          taille_entreprise: tailleEntreprise,
          zone_geo: zoneGeo,
          ville,
          site_web: siteWeb || null,
          photo_url: finalPhotoUrl,
          biographie,
          expertises,
          linkedin: linkedin || null,
          telephone: telephone || null,
        })
        .eq("id", member.id);

      if (error) throw new Error("Erreur lors de la sauvegarde.");

      setPhotoUrl(finalPhotoUrl);
      setPhotoFile(null);
      setPhotoPreview(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      router.refresh();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSaving(false);
      setUploadingPhoto(false);
    }
  }

  /* ── Suppression de compte ───────────────────────────────── */
  async function handleDelete() {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      await supabase.from("members").delete().eq("id", member.id);
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setIsDeleting(false);
      alert("Erreur lors de la suppression. Contacte un administrateur.");
    }
  }

  const displayPhoto = photoPreview ?? photoUrl;
  const bioLength = biographie.length;

  return (
    <div className="max-w-[720px] space-y-5">
      {/* ── En-tête ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-[22px] font-bold text-[#111827]">Mon profil</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          Modifie tes informations et sauvegarde.
        </p>
      </div>

      {/* ── Feedback sauvegarde ───────────────────────────────── */}
      {saveSuccess && (
        <div className="rounded-[8px] bg-[#f0fdf4] border border-[#bbf7d0] px-4 py-3 text-[13px] font-medium text-[#166534]">
          ✓ Profil mis à jour avec succès.
        </div>
      )}
      {saveError && (
        <div className="rounded-[8px] bg-[#fef2f2] border border-[#fecaca] px-4 py-3 text-[13px] font-medium text-[#991b1b]">
          {saveError}
        </div>
      )}

      {/* ══ SECTION : Photo de profil ════════════════════════════ */}
      <Card>
        <SectionTitle>Photo de profil</SectionTitle>
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {displayPhoto ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={displayPhoto}
                alt="Photo de profil"
                className="w-[72px] h-[72px] rounded-full object-cover border-2 border-[#e5e7eb]"
              />
            ) : (
              <Avatar
                prenom={prenom}
                nom={nom}
                photoUrl={null}
                size={72}
              />
            )}
            {displayPhoto && (
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ef4444] text-white text-[10px] flex items-center justify-center hover:bg-[#dc2626] transition-colors"
                title="Supprimer la photo"
              >
                ×
              </button>
            )}
          </div>
          <div>
            <p className="text-[12px] font-medium text-[#374151] mb-2">
              {displayPhoto ? "Changer la photo" : "Ajouter une photo"}
            </p>
            <p className="text-[11px] text-[#6b7280] mb-2">
              JPEG ou PNG, max 5 Mo. Recommandé : 400×400 px.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onPhotoChange}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => fileRef.current?.click()}
            >
              {displayPhoto ? "Changer la photo" : "Choisir une photo"}
            </Button>
          </div>
        </div>
      </Card>

      {/* ══ SECTION : Identité ═══════════════════════════════════ */}
      <Card>
        <SectionTitle>Identité</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
          <Input
            label="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <div className="sm:col-span-2">
            <Input
              label="Adresse email"
              value={member.email}
              disabled
              hint="L'email ne peut pas être modifié."
            />
          </div>
        </div>
      </Card>

      {/* ══ SECTION : Cadre professionnel ════════════════════════ */}
      <Card>
        <SectionTitle>Cadre professionnel</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            label="Type de membre"
            value={typeMembre}
            onChange={(v) => setTypeMembre(v as MemberType)}
            options={MEMBER_TYPES}
            required
          />
          <Input
            label="Fonction / Poste"
            value={fonction}
            onChange={(e) => setFonction(e.target.value)}
            required
          />
          <Input
            label="Entreprise"
            value={entreprise}
            onChange={(e) => setEntreprise(e.target.value)}
            required
          />
          <SelectField
            label="Secteur d'activité"
            value={secteur}
            onChange={setSecteur}
            options={SECTORS}
            required
          />
          <SelectField
            label="Taille d'entreprise"
            value={tailleEntreprise}
            onChange={(v) => setTailleEntreprise(v as CompanySize)}
            options={COMPANY_SIZES}
            required
          />
          <Input
            label="Zone géographique"
            value={zoneGeo}
            onChange={(e) => setZoneGeo(e.target.value)}
            placeholder="ex : Île-de-France, Grand Est…"
            required
          />
          <Input
            label="Ville"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            required
          />
          <Input
            label="Site internet entreprise"
            value={siteWeb}
            onChange={(e) => setSiteWeb(e.target.value)}
            placeholder="https://…"
            type="url"
          />
        </div>
      </Card>

      {/* ══ SECTION : Profil communautaire ═══════════════════════ */}
      <Card>
        <SectionTitle>Profil communautaire</SectionTitle>
        <div className="space-y-3">
          <Textarea
            label="Biographie"
            value={biographie}
            onChange={setBiographie}
            placeholder="Présente-toi en quelques mots : ton parcours, tes missions RSE, ce qui te motive…"
            maxLength={500}
            rows={4}
            required
            hint={`${bioLength}/500 caractères`}
          />

          {/* Expertises */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#374151]">
              Expertises <span className="text-[#ef4444]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPERTISES.map((exp) => {
                const selected = expertises.includes(exp);
                return (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => toggleExpertise(exp)}
                    className={[
                      "px-[10px] py-[5px] rounded-[20px] text-[11px] font-semibold transition-colors cursor-pointer",
                      selected
                        ? "bg-[#016050] text-white"
                        : "bg-[#f5f6f8] text-[#6b7280] hover:bg-[#e4f7f3] hover:text-[#016050]",
                    ].join(" ")}
                  >
                    {selected && <span className="mr-1">✓</span>}
                    {exp}
                  </button>
                );
              })}
            </div>
            {expertises.length > 0 && (
              <p className="text-[11px] text-[#6b7280]">
                {expertises.length} expertise{expertises.length > 1 ? "s" : ""} sélectionnée{expertises.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="LinkedIn"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/…"
              type="url"
            />
            <Input
              label="Téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+33 6 …"
              type="tel"
            />
          </div>
        </div>
      </Card>

      {/* ── Bouton sauvegarder ────────────────────────────────── */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          loading={saving}
          disabled={saving}
          size="lg"
        >
          {saving
            ? uploadingPhoto
              ? "Upload en cours…"
              : "Sauvegarde en cours…"
            : "Sauvegarder les modifications"}
        </Button>
      </div>

      {/* ══ ZONE DANGER ══════════════════════════════════════════ */}
      <Card className="border-[#fecaca]">
        <h2 className="text-[13px] font-semibold text-[#991b1b] pb-2 border-b border-[#fecaca] mb-4">
          Zone de danger
        </h2>

        {!showDeleteConfirm && !isDeleting && (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium text-[#374151]">
                Supprimer mon compte
              </p>
              <p className="text-[11px] text-[#6b7280] mt-0.5">
                Cette action est irréversible. Toutes tes données seront supprimées.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Supprimer mon compte
            </Button>
          </div>
        )}

        {showDeleteConfirm && !isDeleting && (
          <div className="rounded-[8px] bg-[#fef2f2] border border-[#fecaca] p-4">
            <p className="text-[13px] font-semibold text-[#991b1b] mb-1">
              Es-tu sûr(e) de vouloir supprimer ton compte ?
            </p>
            <p className="text-[12px] text-[#6b7280] mb-4">
              Toutes tes données (profil, expertises, historique) seront définitivement
              supprimées. Cette action ne peut pas être annulée.
            </p>
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                loading={isDeleting}
              >
                Oui, supprimer définitivement
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {isDeleting && (
          <p className="text-[13px] text-[#6b7280] text-center py-2">
            Suppression en cours…
          </p>
        )}
      </Card>
    </div>
  );
}
