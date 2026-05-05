import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import type { Member } from "@/types";

/* Formate une date ISO en "Février 2026" */
function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    month: "long",
    year:  "numeric",
  });
}

/* Capitalise la première lettre */
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default async function FicheMembrePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user       = await getAuthUser();
  const viewer     = await getMemberProfile(user.id);

  if (viewer.statut !== "approved") redirect("/en-attente");

  const isAdmin  = viewer.role === "admin";
  const isOwn    = viewer.id === id;
  const supabase = await createClient();

  /* Récupère le profil demandé — siret exclu pour les non-admins */
  const fields = isAdmin
    ? "*"
    : "id,prenom,nom,photo_url,type_membre,fonction,entreprise,secteur,taille_entreprise,zone_geo,ville,site_web,linkedin,telephone,biographie,expertises,date_inscription,statut,disponible_mission";

  const { data: profileData } = await supabase
    .from("members")
    .select(fields)
    .eq("id", id)
    .eq("statut", "approved")
    .single();

  if (!profileData) notFound();

  const profile = profileData as unknown as Member;

  /* Construit le lien WhatsApp avec préfill si téléphone dispo */
  const whatsappMsg = encodeURIComponent(
    `Bonjour ${profile.prenom}, je t'ai trouvé·e sur le Club ESG. Je souhaitais échanger avec toi !`
  );
  const whatsappUrl = profile.telephone
    ? `https://wa.me/${profile.telephone.replace(/\D/g, "")}?text=${whatsappMsg}`
    : `https://wa.me/?text=${whatsappMsg}`;

  return (
    <AppLayout isAdmin={isAdmin}>
      <div>
        {/* ── Fil d'Ariane ───────────────────────────────── */}
        <div className="flex items-center gap-1.5 mb-5 text-[12px]">
          <Link href="/annuaire" className="text-[#016050] hover:underline">
            Annuaire
          </Link>
          <span className="text-[#9ca3af]">›</span>
          <span className="text-[#374151] font-medium">
            {profile.prenom} {profile.nom}
          </span>
        </div>

        {/* ── Grille 2 colonnes ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">

          {/* ── Colonne gauche ─────────────────────────── */}
          <div className="flex flex-col gap-3">

            {/* Carte identité */}
            <Card className="text-center py-6 px-4">
              <Avatar
                prenom={profile.prenom}
                nom={profile.nom}
                photoUrl={profile.photo_url}
                size={72}
                className="mx-auto"
              />
              <h2 className="text-[16px] font-bold text-[#111827] mt-3 mb-0.5">
                {profile.prenom} {profile.nom}
              </h2>
              <p className="text-[12px] text-[#6b7280] mb-2.5">
                {profile.fonction} · {profile.entreprise}
              </p>
              <Tag variant="teal">{profile.type_membre}</Tag>
              {profile.disponible_mission && (
                <Tag variant="green" className="mt-1.5">Disponible pour une mission</Tag>
              )}

              {/* Infos compactes */}
              <div className="mt-4 flex flex-col gap-1.5">
                {[
                  ["📍", `${profile.ville}, ${profile.zone_geo}`],
                  ["🏢", profile.secteur],
                  ["👥", `${profile.taille_entreprise} salariés`],
                  ...(profile.linkedin
                    ? [["🔗", profile.linkedin, true]]
                    : []),
                ].map(([icon, val, isLink], i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2.5 py-1.5 bg-[#f5f6f8] rounded-[6px]"
                  >
                    <span className="text-[13px]">{icon}</span>
                    {isLink ? (
                      <a
                        href={val as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-[#016050] truncate hover:underline"
                      >
                        {(val as string).replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    ) : (
                      <span className="text-[12px] text-[#374151] truncate">
                        {val as string}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Bouton WhatsApp — masqué si c'est son propre profil */}
              {!isOwn && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 rounded-[6px] text-[12px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors"
                >
                  💬 Contacter
                </a>
              )}

              {/* Lien vers mon profil si c'est le sien */}
              {isOwn && (
                <Link
                  href="/mon-profil"
                  className="mt-4 flex items-center justify-center w-full px-4 py-2 rounded-[6px] text-[12px] font-semibold text-[#374151] border border-[#e5e7eb] hover:bg-[#f5f6f8] transition-colors"
                >
                  Modifier mon profil →
                </Link>
              )}
            </Card>

            {/* Membre depuis */}
            <Card padding="sm">
              <p className="label-caps mb-1.5">Membre depuis</p>
              <p className="text-[13px] font-semibold text-[#111827]">
                {capitalize(formatMonth(profile.date_inscription))}
              </p>
            </Card>
          </div>

          {/* ── Colonne droite ─────────────────────────── */}
          <div className="flex flex-col gap-3">

            {/* Biographie */}
            <Card>
              <p className="label-caps mb-2">Biographie</p>
              <p className="text-[13px] text-[#374151] leading-relaxed whitespace-pre-line">
                {profile.biographie}
              </p>
            </Card>

            {/* Expertises */}
            <Card>
              <p className="label-caps mb-2.5">Expertises</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.expertises.map((exp) => (
                  <Tag key={exp} variant="teal">
                    {exp}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Infos entreprise — SIRET masqué pour les non-admins */}
            <Card>
              <p className="label-caps mb-2.5">Entreprise</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Entreprise",         profile.entreprise,         false],
                  ["Site web",           profile.site_web ?? "—",    !!profile.site_web],
                  ["Secteur d'activité", profile.secteur,            false],
                  ["Taille",             `${profile.taille_entreprise} salariés`, false],
                  ...(isAdmin
                    ? [["SIRET", profile.siret, false] as [string, string, boolean]]
                    : []),
                ].map(([label, value, isLink]) => (
                  <div key={label as string}>
                    <p className="text-[11px] text-[#6b7280] mb-0.5">{label as string}</p>
                    {isLink ? (
                      <a
                        href={value as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] font-medium text-[#016050] hover:underline break-all"
                      >
                        {(value as string).replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    ) : (
                      <p className="text-[13px] font-medium text-[#111827]">
                        {value as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
