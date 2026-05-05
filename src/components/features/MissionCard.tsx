import Link from "next/link";
import Tag from "@/components/ui/Tag";
import Avatar from "@/components/ui/Avatar";
import type { Mission } from "@/types";

/* Couleur par domaine */
const DOMAINE_VARIANT: Record<string, "teal" | "green" | "purple" | "orange"> = {
  Environnement: "teal",
  Social:        "green",
  Gouvernance:   "purple",
  Multi:         "orange",
};

/* Libellé badge type mission */
const TYPE_LABEL: Record<string, string> = {
  binome:  "Binôme recherché",
  cession: "Mission à céder",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface MissionCardProps {
  mission: Mission;
  isNew?: boolean;
}

export default function MissionCard({ mission, isNew = false }: MissionCardProps) {
  const domaineVariant = DOMAINE_VARIANT[mission.domaine] ?? "teal";

  return (
    <Link
      href={`/missions/${mission.id}`}
      className="block bg-white border border-[#e5e7eb] rounded-[10px] p-4 hover:border-[#016050] hover:shadow-sm transition-all duration-150 group"
    >
      {/* En-tête : type + domaine + badge new */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <Tag variant={mission.type_mission === "binome" ? "teal" : "orange"}>
          {TYPE_LABEL[mission.type_mission]}
        </Tag>
        <Tag variant={domaineVariant}>{mission.domaine}</Tag>
        {isNew && (
          <Tag variant="green">Nouveau</Tag>
        )}
      </div>

      {/* Titre */}
      <h3 className="text-[14px] font-semibold text-[#111827] mb-1 group-hover:text-[#016050] transition-colors line-clamp-2">
        {mission.titre}
      </h3>

      {/* Description courte */}
      <p className="text-[12px] text-[#6b7280] mb-3 line-clamp-2 leading-relaxed">
        {mission.description}
      </p>

      {/* Expertises requises */}
      {mission.expertises_requises.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {mission.expertises_requises.slice(0, 3).map((e) => (
            <span
              key={e}
              className="px-2 py-0.5 bg-[#f5f6f8] text-[#374151] rounded-[4px] text-[10px] font-medium"
            >
              {e}
            </span>
          ))}
          {mission.expertises_requises.length > 3 && (
            <span className="px-2 py-0.5 bg-[#f5f6f8] text-[#9ca3af] rounded-[4px] text-[10px]">
              +{mission.expertises_requises.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Méta : modalité, budget, date */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#9ca3af] mb-3">
        {mission.modalite && (
          <span>📍 {mission.modalite}{mission.localisation ? ` · ${mission.localisation}` : ""}</span>
        )}
        {mission.budget && (
          <span>💶 {mission.budget}</span>
        )}
        {mission.type_prestation && (
          <span>🔧 {mission.type_prestation}</span>
        )}
      </div>

      {/* Posteur */}
      {mission.membre && (
        <div className="flex items-center gap-2 pt-3 border-t border-[#f5f6f8]">
          <Avatar
            prenom={mission.membre.prenom}
            nom={mission.membre.nom}
            photoUrl={mission.membre.photo_url ?? null}
            size={24}
          />
          <span className="text-[11px] text-[#6b7280]">
            {mission.membre.prenom} {mission.membre.nom}
            {mission.membre.entreprise && ` · ${mission.membre.entreprise}`}
          </span>
          <span className="ml-auto text-[10px] text-[#9ca3af]">
            {formatDate(mission.created_at)}
          </span>
        </div>
      )}
    </Link>
  );
}
