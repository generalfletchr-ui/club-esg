import { describe, expect, it } from "vitest";
import {
  atelierHeures,
  canTransition,
  earliestDate,
  formatDateLongue,
  isAllowedAnimationDate,
  isAllowedAtelierHeure,
  parisDateTimeToISO,
  parisToday,
  agendaEntries,
  takenDates,
  validateProposal,
  type ProposalInput,
} from "./animations";

/* Vendredi 13 novembre 2026 : J+21 = vendredi 4 décembre 2026 */
const TODAY = "2026-11-13";

const valid: ProposalInput = {
  format: "webinaire",
  theme: "CSRD et VSME",
  theme_autre: "",
  titre: "Réussir sa double matérialité",
  date_souhaitee: "2026-12-08",
  heure: "11:00",
  coanimateur_nom: "",
  coanimateur_email: "",
  engagement: true,
};

describe("dates autorisées : mardi / jeudi à 21 jours minimum", () => {
  it("calcule la première date possible à J+21", () => {
    expect(earliestDate(TODAY)).toBe("2026-12-04");
  });

  it("refuse un mardi ou un jeudi avant le délai de 21 jours", () => {
    expect(isAllowedAnimationDate("2026-11-17", TODAY)).toBe(false); // mardi J+4
    expect(isAllowedAnimationDate("2026-11-19", TODAY)).toBe(false); // jeudi J+6
  });

  it("ouvre exceptionnellement les 24 et 26 novembre et les 1er et 3 décembre 2026, malgré le délai", () => {
    expect(isAllowedAnimationDate("2026-11-24", TODAY)).toBe(true); // mardi J+11
    expect(isAllowedAnimationDate("2026-11-26", TODAY)).toBe(true); // jeudi J+13
    expect(isAllowedAnimationDate("2026-12-01", TODAY)).toBe(true); // mardi J+18
    expect(isAllowedAnimationDate("2026-12-03", TODAY)).toBe(true); // jeudi J+20
    /* Une fois la date passée, l'exception ne joue plus */
    expect(isAllowedAnimationDate("2026-12-01", "2026-12-02")).toBe(false);
  });

  it("accepte les mardis et jeudis à partir de J+21", () => {
    expect(isAllowedAnimationDate("2026-12-08", TODAY)).toBe(true); // mardi
    expect(isAllowedAnimationDate("2026-12-10", TODAY)).toBe(true); // jeudi
  });

  it("accepte un mardi ou un jeudi tombant exactement à J+21", () => {
    /* Mardi 17 novembre 2026 : J+21 = mardi 8 décembre */
    expect(isAllowedAnimationDate("2026-12-08", "2026-11-17")).toBe(true);
    expect(isAllowedAnimationDate("2026-12-03", "2026-11-12")).toBe(true); // jeudi
  });

  it("refuse tous les autres jours de la semaine", () => {
    for (const date of ["2026-12-07", "2026-12-09", "2026-12-11", "2026-12-12", "2026-12-13"]) {
      expect(isAllowedAnimationDate(date, TODAY)).toBe(false);
    }
  });

  it("refuse une date mal formée", () => {
    expect(isAllowedAnimationDate("", TODAY)).toBe(false);
    expect(isAllowedAnimationDate("08/12/2026", TODAY)).toBe(false);
    expect(isAllowedAnimationDate("2026-13-45", TODAY)).toBe(false);
  });

  it("prend la date du jour à Paris, pas en UTC", () => {
    /* 23h30 UTC le 13 = 0h30 le 14 à Paris */
    expect(parisToday(new Date("2026-11-13T23:30:00Z"))).toBe("2026-11-14");
  });
});

describe("heures", () => {
  it("limite l'atelier de 8h00 à 19h00 au quart d'heure", () => {
    expect(isAllowedAtelierHeure("08:00")).toBe(true);
    expect(isAllowedAtelierHeure("14:45")).toBe(true);
    expect(isAllowedAtelierHeure("19:00")).toBe(true);
    expect(isAllowedAtelierHeure("07:45")).toBe(false);
    expect(isAllowedAtelierHeure("19:15")).toBe(false);
    expect(isAllowedAtelierHeure("10:10")).toBe(false);
    expect(atelierHeures()[0]).toBe("08:00");
    expect(atelierHeures().at(-1)).toBe("19:00");
  });

  it("convertit l'heure de Paris en UTC (hiver et été)", () => {
    expect(parisDateTimeToISO("2026-12-08", "11:00")).toBe("2026-12-08T10:00:00.000Z");
    expect(parisDateTimeToISO("2027-06-08", "11:00")).toBe("2027-06-08T09:00:00.000Z");
  });

  it("écrit la date en toutes lettres", () => {
    expect(formatDateLongue("2026-12-08")).toBe("mardi 8 décembre 2026");
  });
});

describe("contrôle du formulaire (même règle côté navigateur et serveur)", () => {
  it("accepte une proposition complète", () => {
    expect("data" in validateProposal(valid, TODAY)).toBe(true);
  });

  it("impose 11h00 pour un webinaire, quelle que soit l'heure envoyée", () => {
    const r = validateProposal({ ...valid, heure: "16:30" }, TODAY);
    expect("data" in r && r.data.heure).toBe("11:00");
  });

  it("refuse le 1er décembre, déjà pris par un webinaire de l'agenda, et accepte le 3", () => {
    /* 10h UTC = 11h à Paris le 1er décembre */
    const agenda = agendaEntries([
      { date_heure: "2026-12-01T10:00:00Z", titre: "J-30 : Vague 2", type_event: "Webinaire" },
    ]);
    const taken = takenDates(agenda);
    const premier = validateProposal({ ...valid, date_souhaitee: "2026-12-01" }, TODAY, taken);
    const trois = validateProposal({ ...valid, date_souhaitee: "2026-12-03" }, TODAY, taken);
    expect("errors" in premier && premier.errors.date_souhaitee).toContain("déjà prise");
    expect("data" in trois).toBe(true);
  });

  it("relie le calendrier à l'agenda : tout type d'événement rend le jour indisponible", () => {
    const agenda = agendaEntries([
      { date_heure: "2026-12-10T17:00:00Z", titre: "Afterwork de Noël", type_event: "Afterwork" },
      { date_heure: "2026-12-15T13:00:00Z", titre: "Atelier VSME", type_event: "Workshop" },
    ]);
    expect(agenda[0]).toEqual({ date: "2026-12-10", titre: "Afterwork de Noël", type: "Afterwork" });
    for (const date of ["2026-12-10", "2026-12-15"]) {
      const r = validateProposal({ ...valid, date_souhaitee: date }, TODAY, takenDates(agenda));
      expect("errors" in r && r.errors.date_souhaitee).toBeTruthy();
    }
  });

  it("utilise le jour de Paris pour un événement tard le soir", () => {
    /* 23h30 UTC le 9 = 0h30 le 10 décembre à Paris */
    const agenda = agendaEntries([{ date_heure: "2026-12-09T23:30:00Z", titre: "x", type_event: "Afterwork" }]);
    expect(takenDates(agenda)).toEqual(["2026-12-10"]);
  });

  it("refuse une date hors mardi / jeudi ou trop proche", () => {
    const lundi = validateProposal({ ...valid, date_souhaitee: "2026-12-07" }, TODAY);
    const tropTot = validateProposal({ ...valid, date_souhaitee: "2026-11-17" }, TODAY);
    expect("errors" in lundi && lundi.errors.date_souhaitee).toBeTruthy();
    expect("errors" in tropTot && tropTot.errors.date_souhaitee).toBeTruthy();
  });

  it("vérifie les champs obligatoires, les longueurs et l'engagement", () => {
    const r = validateProposal(
      { ...valid, titre: "x".repeat(101), theme: "Autre", engagement: false },
      TODAY
    );
    expect("errors" in r && Object.keys(r.errors).sort()).toEqual(
      ["engagement", "theme_autre", "titre"]
    );
  });

  it("vérifie l'e-mail du co-animateur et l'heure d'un atelier", () => {
    const r = validateProposal(
      { ...valid, format: "atelier", heure: "21:00", coanimateur_nom: "Léa", coanimateur_email: "pas-un-mail" },
      TODAY
    );
    expect("errors" in r && Object.keys(r.errors).sort()).toEqual(["coanimateur_email", "heure"]);
  });
});

describe("changements de statut", () => {
  it("l'admin traite une proposition en attente ou à ajuster", () => {
    expect(canTransition("en_attente", "validee", "admin")).toBe(true);
    expect(canTransition("en_attente", "a_ajuster", "admin")).toBe(true);
    expect(canTransition("en_attente", "refusee", "admin")).toBe(true);
    expect(canTransition("a_ajuster", "validee", "admin")).toBe(true);
  });

  it("une proposition validée ou refusée est définitive", () => {
    expect(canTransition("validee", "refusee", "admin")).toBe(false);
    expect(canTransition("refusee", "validee", "admin")).toBe(false);
  });

  it("le membre ne peut que renvoyer une proposition à ajuster", () => {
    expect(canTransition("a_ajuster", "en_attente", "membre")).toBe(true);
    expect(canTransition("en_attente", "validee", "membre")).toBe(false);
    expect(canTransition("refusee", "en_attente", "membre")).toBe(false);
  });
});
