/* Types TypeScript pour le Club ESG */

export type MemberStatus = "pending" | "approved" | "rejected";
export type MemberRole = "pending" | "member" | "admin";
export type MemberType =
  | "Expert-comptable"
  | "Consultant RSE"
  | "Responsable RSE"
  | "Autre";
export type EventType = "Webinaire" | "Afterwork" | "Workshop";
export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1000+";

export interface Member {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  type_membre: MemberType;
  fonction: string;
  entreprise: string;
  siret: string;
  secteur: string;
  taille_entreprise: CompanySize;
  zone_geo: string;
  ville: string;
  site_web: string | null;
  photo_url: string | null;
  biographie: string;
  expertises: string[];
  linkedin: string | null;
  telephone: string | null;
  charte_acceptee: boolean;
  statut: MemberStatus;
  role: MemberRole;
  date_inscription: string;
  premiere_connexion: string | null;
  derniere_connexion: string | null;
  approuve_par: string | null;
  approuve_le: string | null;
  disponible_mission?: boolean;
}

export interface Intervenant {
  nom: string;
  url: string;
}

export interface Event {
  id: string;
  titre: string;
  date_heure: string;
  description: string;
  type_event: EventType;
  lien_inscription: string;
  image_url: string | null;
  intervenants: Intervenant[] | null;
  adresse: string | null;
  cree_par: string;
  created_at: string;
}

export interface Replay {
  id: string;
  titre: string;
  date_event: string;
  description: string;
  type_event: EventType;
  lien_replay: string;
  image_url: string | null;
  intervenants: string | null;
  cree_par: string;
  created_at: string;
}

/* ── Missions (Job Board) ──────────────────────────────────── */

export type MissionStatut = "pending" | "published" | "rejected" | "pourvue" | "expired";
export type MissionType   = "binome" | "cession";
export type MissionDomaine = "Environnement" | "Social" | "Gouvernance" | "Multi";

export interface Mission {
  id: string;
  poste_par: string;
  type_mission: MissionType;
  titre: string;
  description: string;
  domaine: MissionDomaine;
  secteur_client: string | null;
  expertises_requises: string[];
  type_prestation: string | null;
  duree_estimee: string | null;
  modalite: string | null;
  localisation: string | null;
  budget: string | null;
  statut: MissionStatut;
  expire_le: string;
  valide_par: string | null;
  valide_le: string | null;
  created_at: string;
  updated_at: string;
  /** Champ joint — profil du posteur */
  membre?: Pick<Member, "id" | "prenom" | "nom" | "photo_url" | "entreprise" | "expertises">;
}
