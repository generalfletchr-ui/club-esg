/* Règles des propositions d'animation — partagées entre formulaire et serveur */

export const ANIMATION_FORMATS = {
  webinaire: { label: "Webinaire (45 min)", court: "webinaire", eventType: "Webinaire" },
  atelier:   { label: "Atelier (1h30)",     court: "atelier",   eventType: "Workshop" },
} as const;

export type AnimationFormat = keyof typeof ANIMATION_FORMATS;

export const ANIMATION_THEMES = [
  "CSRD et VSME",
  "Bilan carbone et décarbonation",
  "Achats responsables",
  "Communication responsable et EmpCo",
  "Économie circulaire",
  "Finance durable et ESG",
  "Social et gouvernance",
  "Autre",
] as const;

export type AnimationStatut = "en_attente" | "validee" | "a_ajuster" | "refusee";

export const STATUT_LABELS: Record<AnimationStatut, string> = {
  en_attente: "En attente",
  validee:    "Validée",
  a_ajuster:  "À ajuster",
  refusee:    "Refusée",
};

/* Couleur du badge de statut (variants du composant Tag) */
export const STATUT_VARIANTS = {
  en_attente: "yellow",
  validee:    "green",
  a_ajuster:  "orange",
  refusee:    "red",
} as const;

export const TITRE_MAX  = 100;

/* Délai minimum entre aujourd'hui et la date de l'animation */
export const DELAI_MIN_JOURS = 21;

/* Heure imposée pour un webinaire, plage autorisée pour un atelier */
export const HEURE_WEBINAIRE = "11:00";
export const HEURE_ATELIER_MIN = "08:00";
export const HEURE_ATELIER_MAX = "19:00";

/* ── Dates (chaînes AAAA-MM-JJ, calendrier de Paris) ──────────── */

/** Date du jour à Paris, au format AAAA-MM-JJ */
export function parisToday(now: Date = new Date()): string {
  return now.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
}

/** Ajoute des jours à une date AAAA-MM-JJ */
export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Jour de la semaine d'une date AAAA-MM-JJ (0 = dimanche, 2 = mardi, 4 = jeudi) */
export function weekday(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** Première date sélectionnable (sans tenir compte du jour de la semaine) */
export function earliestDate(today: string): string {
  return addDays(today, DELAI_MIN_JOURS);
}

/* Dates ouvertes exceptionnellement, même à moins de 21 jours */
export const DATES_EXCEPTIONNELLES = ["2026-12-01", "2026-12-03"];

/** Mardi ou jeudi, au moins 21 jours après aujourd'hui (sauf dates exceptionnelles) */
export function isAllowedAnimationDate(date: string, today: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  if (Number.isNaN(new Date(`${date}T00:00:00Z`).getTime())) return false;
  const day = weekday(date);
  if (day !== 2 && day !== 4) return false;
  return date >= earliestDate(today) || (DATES_EXCEPTIONNELLES.includes(date) && date > today);
}

/** Jour (AAAA-MM-JJ, Paris) d'un horodatage ISO */
export function parisDateOf(iso: string): string {
  return new Date(iso).toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
}

/** Événement de l'agenda du Club, tel qu'affiché dans le calendrier des propositions */
export interface AgendaEntry {
  date: string;
  titre: string;
  type: string;
}

/** Événements de l'agenda → entrées du calendrier (jour de Paris) */
export function agendaEntries(
  events: { date_heure: string; titre: string; type_event: string }[]
): AgendaEntry[] {
  return events.map((e) => ({ date: parisDateOf(e.date_heure), titre: e.titre, type: e.type_event }));
}

/** Dates indisponibles : tout jour ayant déjà un événement dans l'agenda du Club */
export function takenDates(agenda: AgendaEntry[]): string[] {
  return [...new Set(agenda.map((e) => e.date))];
}

/** Heure autorisée pour un atelier : 8h00–19h00, au quart d'heure */
export function isAllowedAtelierHeure(heure: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(heure)) return false;
  const minutes = Number(heure.slice(3));
  return heure >= HEURE_ATELIER_MIN && heure <= HEURE_ATELIER_MAX && minutes % 15 === 0;
}

/** Créneaux proposés pour un atelier */
export function atelierHeures(): string[] {
  const out: string[] = [];
  for (let h = 8; h <= 19; h++) {
    for (const m of [0, 15, 30, 45]) {
      const v = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      if (isAllowedAtelierHeure(v)) out.push(v);
    }
  }
  return out;
}

/** « 11:00 » → « 11h00 » */
export function formatHeure(heure: string): string {
  return heure.slice(0, 5).replace(":", "h");
}

/** « 2026-12-15 » → « mardi 15 décembre 2026 » */
export function formatDateLongue(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Date + heure de Paris → ISO UTC (pour l'événement d'agenda) */
export function parisDateTimeToISO(date: string, heure: string): string {
  const tempUTC  = new Date(`${date}T${heure.slice(0, 5)}:00.000Z`);
  const utcStr   = tempUTC.toLocaleString("sv-SE", { timeZone: "UTC" });
  const parisStr = tempUTC.toLocaleString("sv-SE", { timeZone: "Europe/Paris" });
  const offsetMs = new Date(parisStr.replace(" ", "T") + "Z").getTime()
                 - new Date(utcStr.replace(" ", "T") + "Z").getTime();
  return new Date(tempUTC.getTime() - offsetMs).toISOString();
}

/* ── Statuts ──────────────────────────────────────────────────── */

type Acteur = "membre" | "admin";

/* Changements de statut autorisés, par acteur */
const TRANSITIONS: Record<Acteur, Partial<Record<AnimationStatut, AnimationStatut[]>>> = {
  admin: {
    en_attente: ["validee", "a_ajuster", "refusee"],
    a_ajuster:  ["validee", "refusee"],
  },
  membre: {
    a_ajuster: ["en_attente"],
  },
};

export function canTransition(from: AnimationStatut, to: AnimationStatut, acteur: Acteur): boolean {
  return TRANSITIONS[acteur][from]?.includes(to) ?? false;
}

/* ── Contrôle du formulaire (client et serveur) ──────────────── */

export interface ProposalInput {
  format: string;
  theme: string;
  theme_autre: string;
  titre: string;
  date_souhaitee: string;
  heure: string;
  coanimateur_nom: string;
  coanimateur_email: string;
  engagement: boolean;
}

export interface CleanProposal {
  format: AnimationFormat;
  theme: string;
  theme_autre: string | null;
  titre: string;
  date_souhaitee: string;
  heure: string;
  coanimateur_nom: string | null;
  coanimateur_email: string | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Vérifie une proposition ; renvoie les erreurs par champ ou la proposition nettoyée */
export function validateProposal(
  input: ProposalInput,
  today: string,
  /* Dates déjà prises (voir takenDates) */
  taken: string[] = []
): { errors: Record<string, string> } | { data: CleanProposal } {
  const errors: Record<string, string> = {};
  const titre  = input.titre.trim();
  const themeAutre = input.theme_autre.trim();
  const coNom   = input.coanimateur_nom.trim();
  const coEmail = input.coanimateur_email.trim();

  if (!(input.format in ANIMATION_FORMATS)) errors.format = "Choisis un format.";

  if (!(ANIMATION_THEMES as readonly string[]).includes(input.theme)) {
    errors.theme = "Choisis un thème.";
  } else if (input.theme === "Autre" && !themeAutre) {
    errors.theme_autre = "Précise le thème.";
  }

  if (!titre) errors.titre = "Le titre est obligatoire.";
  else if (titre.length > TITRE_MAX) errors.titre = `${TITRE_MAX} caractères maximum.`;

  if (!isAllowedAnimationDate(input.date_souhaitee, today)) {
    errors.date_souhaitee = `Choisis un mardi ou un jeudi, au moins ${DELAI_MIN_JOURS} jours à l'avance.`;
  } else if (taken.includes(input.date_souhaitee)) {
    errors.date_souhaitee = "Cette date est déjà prise : choisis-en une autre.";
  }

  const heure = input.format === "webinaire" ? HEURE_WEBINAIRE : input.heure;
  if (input.format === "atelier" && !isAllowedAtelierHeure(heure)) {
    errors.heure = "Choisis une heure entre 8h00 et 19h00.";
  }

  if (coEmail && !EMAIL_RE.test(coEmail)) errors.coanimateur_email = "E-mail invalide.";
  if (coEmail && !coNom) errors.coanimateur_nom = "Indique le nom du co-animateur.";

  if (!input.engagement) errors.engagement = "Cet engagement est obligatoire.";

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: {
      format: input.format as AnimationFormat,
      theme: input.theme,
      theme_autre: input.theme === "Autre" ? themeAutre : null,
      titre,
      date_souhaitee: input.date_souhaitee,
      heure,
      coanimateur_nom: coNom || null,
      coanimateur_email: coEmail || null,
    },
  };
}
