"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { respondToMission } from "@/app/missions/actions";
import type { Mission } from "@/types";

/* Couleur par domaine */
const DOMAINE_VARIANT: Record<string, "teal" | "green" | "purple" | "orange"> = {
  Environnement: "teal",
  Social:        "green",
  Gouvernance:   "purple",
  Multi:         "orange",
};

const TYPE_LABEL: Record<string, string> = {
  binome:  "Binôme recherché",
  cession: "Mission à céder",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface Props {
  mission: Mission;
  currentUserId: string;
  isOwner: boolean;
}

export default function MissionDetailClient({ mission, currentUserId, isOwner }: Props) {
  const [pending, startTransition] = useTransition();
  const [responded, setResponded]  = useState(false);
  const [error, setError]          = useState<string | null>(null);

  const domaineVariant = DOMAINE_VARIANT[mission.domaine] ?? "teal";
  const membre         = mission.membre as (typeof mission.membre & { linkedin?: string | null }) | undefined;

  function handleRespond() {
    setError(null);
    startTransition(async () => {
      try {
        await respondToMission(mission.id);
        setResponded(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Une erreur est survenue");
      }
    });
  }

  const isExpired = new Date(mission.expire_le) < new Date();

  return (
    <div className="max-w-[760px]">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 text-[11px] text-[#9ca3af] mb-5">
        <Link href="/missions" className="hover:text-[#374151] transition-colors">
          Missions
        </Link>
        <span>›</span>
        <span className="text-[#374151] truncate">{mission.titre}</span>
      </div>

      {/* Carte principale */}
      <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-6 mb-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Tag variant={mission.type_mission === "binome" ? "teal" : "orange"}>
            {TYPE_LABEL[mission.type_mission]}
          </Tag>
          <Tag variant={domaineVariant}>{mission.domaine}</Tag>
          {mission.statut === "pourvue" && <Tag variant="neutral">Mission pourvue</Tag>}
          {isExpired && mission.statut === "published" && <Tag variant="neutral">Expirée</Tag>}
        </div>

        {/* Titre */}
        <h1 className="text-[20px] font-bold text-[#111827] mb-4">{mission.titre}</h1>

        {/* Description */}
        <p className="text-[14px] text-[#374151] leading-relaxed whitespace-pre-line mb-6">
          {mission.description}
        </p>

        {/* Grille de méta-données */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[#f5f6f8] pt-5">
          {mission.secteur_client && (
            <div>
              <p className="label-caps mb-0.5">Secteur client</p>
              <p className="text-[13px] text-[#374151] font-medium">{mission.secteur_client}</p>
            </div>
          )}
          {mission.type_prestation && (
            <div>
              <p className="label-caps mb-0.5">Type de prestation</p>
              <p className="text-[13px] text-[#374151] font-medium">{mission.type_prestation}</p>
            </div>
          )}
          {mission.duree_estimee && (
            <div>
              <p className="label-caps mb-0.5">Durée estimée</p>
              <p className="text-[13px] text-[#374151] font-medium">{mission.duree_estimee}</p>
            </div>
          )}
          {mission.modalite && (
            <div>
              <p className="label-caps mb-0.5">Modalité</p>
              <p className="text-[13px] text-[#374151] font-medium">
                {mission.modalite}
                {mission.localisation && ` · ${mission.localisation}`}
              </p>
            </div>
          )}
          {mission.budget && (
            <div>
              <p className="label-caps mb-0.5">Budget indicatif</p>
              <p className="text-[13px] text-[#374151] font-medium">{mission.budget}</p>
            </div>
          )}
          <div>
            <p className="label-caps mb-0.5">Publiée le</p>
            <p className="text-[13px] text-[#374151] font-medium">{formatDate(mission.created_at)}</p>
          </div>
          <div>
            <p className="label-caps mb-0.5">Expire le</p>
            <p className="text-[13px] text-[#374151] font-medium">{formatDate(mission.expire_le)}</p>
          </div>
        </div>

        {/* Expertises requises */}
        {mission.expertises_requises.length > 0 && (
          <div className="mt-5 pt-5 border-t border-[#f5f6f8]">
            <p className="label-caps mb-2">Expertises recherchées</p>
            <div className="flex flex-wrap gap-1.5">
              {mission.expertises_requises.map((e) => (
                <span
                  key={e}
                  className="px-2.5 py-1 bg-[#e4f7f3] text-[#016050] rounded-[20px] text-[11px] font-semibold"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Posteur */}
      {membre && (
        <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-5 mb-5">
          <p className="label-caps mb-3">Publié par</p>
          <div className="flex items-start gap-3">
            <Avatar
              prenom={membre.prenom}
              nom={membre.nom}
              photoUrl={membre.photo_url ?? null}
              size={44}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#111827]">
                {membre.prenom} {membre.nom}
              </p>
              <p className="text-[12px] text-[#6b7280] mb-2">{membre.entreprise}</p>
              {membre.expertises && membre.expertises.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {membre.expertises.slice(0, 4).map((e: string) => (
                    <Tag key={e} variant="neutral" className="text-[10px]">{e}</Tag>
                  ))}
                </div>
              )}
              <Link
                href="/annuaire"
                className="text-[11px] text-[#016050] hover:underline"
              >
                Voir dans l'annuaire →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Action : répondre */}
      {!isOwner && mission.statut === "published" && !isExpired && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[12px] p-5">
          {responded ? (
            <div className="text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-[14px] font-semibold text-[#16a34a] mb-1">
                Votre intérêt a été transmis !
              </p>
              <p className="text-[12px] text-[#374151]">
                {membre?.prenom} recevra un email avec votre profil et vous contactera directement.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[#111827] mb-0.5">
                  Cette mission vous intéresse ?
                </p>
                <p className="text-[12px] text-[#374151]">
                  En cliquant, votre profil sera envoyé par email au posteur.
                </p>
                {error && (
                  <p className="text-[11px] text-[#ef4444] mt-1">{error}</p>
                )}
              </div>
              <Button
                variant="primary"
                size="md"
                loading={pending}
                onClick={handleRespond}
              >
                Je suis intéressé(e)
              </Button>
            </div>
          )}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-2">
          <Link href="/mes-missions">
            <Button variant="outline" size="sm">
              ← Gérer mes missions
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
