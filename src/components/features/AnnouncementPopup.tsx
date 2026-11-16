"use client";

/* Composant client — message temporaire affiché aux membres connectés
 * sur chaque page de la plateforme (via AppLayout), en bas à droite,
 * jusqu'à ce qu'ils cliquent sur le lien ; « Plus tard » ne ferme que
 * pour la page en cours */
import { useState, useSyncExternalStore } from "react";

/* Annonce en cours : changer l'id pour qu'une nouvelle annonce réapparaisse */
const ANNONCE = {
  id: "questionnaire-csrd-vague2-2026-11",
  surtitre: "Questionnaire CSRD",
  titre: "Exercice CSRD 2027 J-30 : où en sont les entreprises de la Vague 2 ?",
  texte:
    "Vous êtes directement concerné ? Vous accompagnez des entreprises dites de « Vague 2 » qui le sont ? Livrez-nous votre retour d'expérience et/ou partagez ce questionnaire, quelques minutes suffisent pour y répondre. Les retours nous aideront à dresser un état des lieux du niveau de préparation des entreprises à l'approche de l'échéance.",
  bouton: "Répondre au questionnaire",
  /* Lien du questionnaire : vide = annonce non affichée */
  lien: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=vlMUAWFuf02H4RCpUmPw3Tto0tFGw_lLkp3z2ZZ-3JBUNVNaVFlJRDJTQTlIOE5aMDZENDhBTjVRNi4u",
  /* Dernier jour d'affichage (inclus), heure de Paris */
  finLe: "2026-11-29",
};

/* Mémorise, dans le navigateur du membre, qu'il a ouvert le lien */
const STORAGE_KEY = `annonce-repondu:${ANNONCE.id}`;

/** L'annonce doit-elle s'afficher dans ce navigateur ? */
function shouldShow(): boolean {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  if (!ANNONCE.lien || today > ANNONCE.finLe) return false;
  try {
    return !window.localStorage.getItem(STORAGE_KEY);
  } catch {
    /* Stockage indisponible (navigation privée) : on affiche quand même */
    return true;
  }
}

const noSubscribe = () => () => {};

export default function AnnouncementPopup() {
  /* Calculé côté navigateur uniquement (jamais affiché au rendu serveur) */
  const eligible = useSyncExternalStore(noSubscribe, shouldShow, () => false);
  const [closed, setClosed] = useState(false);

  /* « Plus tard » / croix : fermée pour cette page seulement */
  function close() {
    setClosed(true);
  }

  /* Clic sur le lien : l'annonce ne réapparaît plus pour ce membre */
  function answered() {
    setClosed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* Rien à faire : l'annonce réapparaîtra à la prochaine page */
    }
  }

  if (!eligible || closed) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="annonce-titre"
      className="annonce-entree fixed z-50 bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 sm:w-[360px] overflow-hidden rounded-[10px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-[#e5e7eb]"
    >
      <div className="relative bg-gradient-to-br from-[#016050] to-[#014d40] px-5 pt-4 pb-4">
        <div className="pointer-events-none absolute -right-8 -top-10 w-[120px] h-[120px] rounded-full bg-white/[0.06]" />
        <button
          onClick={close}
          aria-label="Fermer"
          className="absolute top-2 right-2 w-7 h-7 rounded-full text-white/70 hover:text-white hover:bg-white/10 text-[18px] leading-none"
        >
          ×
        </button>
        <p className="relative text-[10px] font-semibold uppercase tracking-wide text-[#e4f7f3]/80 mb-1">
          {ANNONCE.surtitre}
        </p>
        <h2 id="annonce-titre" className="relative text-[15px] font-bold text-white leading-snug pr-6">
          {ANNONCE.titre}
        </h2>
      </div>
      <div className="px-5 py-4">
        <p className="text-[12px] text-[#374151] leading-relaxed mb-4">{ANNONCE.texte}</p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={close}
            className="px-3 py-2 rounded-[6px] text-[12px] font-medium text-[#6b7280] hover:bg-[#f5f6f8] transition-colors"
          >
            Plus tard
          </button>
          <a
            href={ANNONCE.lien}
            target="_blank"
            rel="noopener noreferrer"
            onClick={answered}
            className="px-4 py-2 rounded-[6px] text-[12px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors"
          >
            {ANNONCE.bouton} →
          </a>
        </div>
      </div>
    </div>
  );
}
