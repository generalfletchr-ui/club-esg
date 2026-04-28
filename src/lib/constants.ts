/* Constantes et enums du Club ESG */

/** Types de membre */
export const MEMBER_TYPES = [
  "Expert-comptable",
  "Consultant RSE",
  "Responsable RSE",
  "Autre",
] as const;

/** Secteurs d'activité (20 options) */
export const SECTORS = [
  "Tous Secteurs",
  "Agroalimentaire",
  "Industrie & Manufacturing",
  "BTP & Construction",
  "Énergie & Utilities",
  "Transport & Logistique",
  "Commerce & Distribution",
  "Hôtellerie & Restauration",
  "Santé & Médico-social",
  "Pharmacie & Cosmétique",
  "Services aux entreprises",
  "Finance & Assurance",
  "Immobilier",
  "Tech & Numérique",
  "Télécommunications",
  "Éducation & Formation",
  "Culture & Médias",
  "Associations & ESS",
  "Secteur public",
  "Autre",
] as const;

/** Expertises (15 options) */
export const EXPERTISES = [
  "Bilan carbone",
  "CSRD / Reporting extra-financier",
  "Stratégie RSE",
  "Audit & Certification",
  "Formation RSE",
  "Achats responsables",
  "Économie circulaire",
  "Biodiversité",
  "Mobilité durable",
  "Efficacité énergétique",
  "QVT & RH responsables",
  "Finance durable",
  "Communication RSE",
  "Conformité réglementaire",
  "Autre",
] as const;

/** Tailles d'entreprise */
export const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
] as const;

/** Types d'événement */
export const EVENT_TYPES = [
  "Webinaire",
  "Afterwork",
  "Workshop",
] as const;

/** Lien WhatsApp communautaire */
export const WHATSAPP_LINK =
  "https://chat.whatsapp.com/DxE8kxJSu2KJegWwPBGoXs";

/** URL du logo Club ESG */
export const LOGO_URL =
  "https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/Logo%20Club%20ESG.png";

/** URL de la charte d'engagement */
export const CHARTER_URL =
  "https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/CHARTE%20D%E2%80%99ENGAGEMENT%20DES%20MEMBRES%20DU%20CLUB%20ESG.pdf";
