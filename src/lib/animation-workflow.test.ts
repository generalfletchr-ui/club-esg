import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

/* Resend simulé : aucun mail réel n'est envoyé */
const sent = vi.hoisted(() => [] as Record<string, unknown>[]);
vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: async (payload: Record<string, unknown>) => {
        sent.push(payload);
        return { data: { id: "mail" }, error: null };
      },
    };
  },
}));

import { decideProposal, resubmitProposal, submitProposal } from "./animation-workflow";
import type { ProposalInput } from "./animations";

/* ── Base Supabase simulée ───────────────────────────────────── */

type Op = { table: string; action: string; payload?: unknown; filters: [string, string, unknown][] };
type Responder = (op: Op) => { data: unknown; error: unknown };

function fakeDb(respond: Responder) {
  const ops: Op[] = [];
  function builder(table: string) {
    const op: Op = { table, action: "select", filters: [] };
    const run = () => { ops.push(op); return Promise.resolve(respond(op)); };
    const b = {
      select() { return b; },
      insert(payload: unknown) { op.action = "insert"; op.payload = payload; return b; },
      update(payload: unknown) { op.action = "update"; op.payload = payload; return b; },
      delete() { op.action = "delete"; return b; },
      eq(col: string, v: unknown) { op.filters.push(["eq", col, v]); return b; },
      neq(col: string, v: unknown) { op.filters.push(["neq", col, v]); return b; },
      in(col: string, v: unknown) { op.filters.push(["in", col, v]); return b; },
      gte(col: string, v: unknown) { op.filters.push(["gte", col, v]); return b; },
      single: run,
      maybeSingle: run,
      then(ok: (v: unknown) => unknown, ko?: (e: unknown) => unknown) { return run().then(ok, ko); },
    };
    return b;
  }
  const db = {
    from: builder,
    storage: {
      from: () => ({
        download: async () => ({ data: new Blob(["pptx"]), error: null }),
      }),
    },
  };
  return { db: db as unknown as SupabaseClient, ops };
}

const filter = (op: Op, col: string) => op.filters.find(([, c]) => c === col)?.[2];

const TODAY = "2026-11-13";
const member = { id: "m1", prenom: "Léa", nom: "Martin", email: "lea@exemple.fr" };
const input: ProposalInput = {
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

const proposal = {
  id: "p1",
  member_id: "m1",
  format: "webinaire",
  theme: "CSRD et VSME",
  theme_autre: null,
  titre: "Réussir sa double matérialité",
  resume: null,
  date_souhaitee: "2026-12-08",
  heure: "11:00:00",
  coanimateur_nom: "Paul Durand",
  coanimateur_email: "paul@exemple.fr",
  statut: "en_attente",
};

/* Réponses par défaut d'une base « normale » */
function defaultResponder(overrides: Partial<Record<string, Responder>> = {}): Responder {
  return (op) => {
    const custom = overrides[`${op.table}:${op.action}`];
    if (custom) return custom(op);
    if (op.table === "members" && op.action === "select") {
      return filter(op, "role")
        ? { data: [{ email: "admin@club.fr" }], error: null }
        : { data: { prenom: "Léa", nom: "Martin", email: "lea@exemple.fr" }, error: null };
    }
    if (op.table === "animation_proposals" && op.action === "select") {
      return filter(op, "statut") ? { data: [], error: null } : { data: proposal, error: null };
    }
    if (op.table === "animation_proposals" && op.action === "insert") return { data: { id: "p1" }, error: null };
    if (op.table === "events" && op.action === "select") return { data: [], error: null };
    if (op.table === "events" && op.action === "insert") return { data: { id: "e1" }, error: null };
    if (op.table === "app_settings") return { data: { value: "modele-presentation/1/Modele Club ESG.pptx" }, error: null };
    return { data: null, error: null };
  };
}

beforeEach(() => { sent.length = 0; });

/* ── Envoi d'une proposition ─────────────────────────────────── */

describe("envoi d'une proposition", () => {
  it("enregistre la proposition « En attente » sans créer d'événement", async () => {
    const { db, ops } = fakeDb(defaultResponder());
    const result = await submitProposal(db, member, input, TODAY);

    expect(result).toEqual({ id: "p1" });
    const insert = ops.find((o) => o.table === "animation_proposals" && o.action === "insert");
    expect(insert?.payload).toMatchObject({ member_id: "m1", statut: "en_attente", heure: "11:00" });
    expect(ops.some((o) => o.table === "events" && o.action === "insert")).toBe(false);
  });

  it("envoie l'accusé de réception au membre et la notification aux admins", async () => {
    const { db } = fakeDb(defaultResponder());
    await submitProposal(db, member, input, TODAY);

    expect(sent).toHaveLength(2);
    expect(sent[0]).toMatchObject({
      to: "lea@exemple.fr",
      from: "L'équipe du Club ESG <noreply@club.fletchr.fr>",
      subject: "Nous avons bien reçu votre proposition d'animation",
    });
    expect(sent[0].html).toContain("Bonjour Léa,");
    expect(sent[0].html).toContain("« Réussir sa double matérialité »");
    expect(sent[0].html).toContain("sous une semaine");
    expect(sent[1]).toMatchObject({ to: ["admin@club.fr"] });
  });

  it("refuse côté serveur une date hors mardi / jeudi, trop proche ou déjà prise, sans rien enregistrer", async () => {
    for (const date of ["2026-12-07", "2026-11-26", "2026-12-01"]) {
      /* L'agenda du Club contient déjà un webinaire le 1er décembre à 11h */
      const { db, ops } = fakeDb(defaultResponder({
        "events:select": () => ({
          data: [{ date_heure: "2026-12-01T10:00:00Z", titre: "J-30 : Vague 2", type_event: "Webinaire" }],
          error: null,
        }),
      }));
      const result = await submitProposal(db, member, { ...input, date_souhaitee: date }, TODAY);
      expect(result.errors?.date_souhaitee).toBeTruthy();
      expect(ops.some((o) => o.action === "insert")).toBe(false);
    }
    expect(sent).toHaveLength(0);
  });

  it("le membre renvoie une proposition à ajuster : elle repasse « En attente »", async () => {
    const { db, ops } = fakeDb(defaultResponder({
      "animation_proposals:select": () => ({ data: { member_id: "m1", statut: "a_ajuster" }, error: null }),
    }));
    const result = await resubmitProposal(db, member, "p1", input, TODAY);

    expect(result.error).toBeUndefined();
    const update = ops.find((o) => o.table === "animation_proposals" && o.action === "update");
    expect(update?.payload).toMatchObject({ statut: "en_attente" });
    expect(sent[0]).toMatchObject({ to: ["admin@club.fr"] });
  });

  it("le membre ne peut pas modifier une proposition déjà traitée", async () => {
    const { db, ops } = fakeDb(defaultResponder({
      "animation_proposals:select": () => ({ data: { member_id: "m1", statut: "validee" }, error: null }),
    }));
    const result = await resubmitProposal(db, member, "p1", input, TODAY);
    expect(result.error).toBeTruthy();
    expect(ops.some((o) => o.action === "update")).toBe(false);
  });
});

/* ── Décisions de l'admin ────────────────────────────────────── */

describe("décisions de l'admin", () => {
  it("Valider : crée l'événement d'agenda, passe « Validée » et envoie le mail avec le modèle", async () => {
    const { db, ops } = fakeDb(defaultResponder());
    const result = await decideProposal(db, "admin1", "p1", { type: "valider", lienInscription: "https://teams.example/abc" });

    expect(result).toEqual({});
    const event = ops.find((o) => o.table === "events" && o.action === "insert");
    expect(event?.payload).toMatchObject({
      titre: "Réussir sa double matérialité",
      description: "Webinaire animé par Léa Martin. Thème : CSRD et VSME.",
      type_event: "Webinaire",
      date_heure: "2026-12-08T10:00:00.000Z",
      lien_inscription: "https://teams.example/abc",
      cree_par: "admin1",
      intervenants: [{ nom: "Léa Martin", url: "" }, { nom: "Paul Durand", url: "" }],
    });
    /* Seuls nom, titre, thème et date sont publiés : pas d'e-mail dans l'événement */
    expect(JSON.stringify(event?.payload)).not.toContain("@");

    const update = ops.find((o) => o.table === "animation_proposals" && o.action === "update");
    expect(update?.payload).toMatchObject({ statut: "validee", event_id: "e1", traite_par: "admin1" });

    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ to: "lea@exemple.fr", subject: "Votre animation pour le Club ESG est validée !" });
    expect(sent[0].html).toContain("votre webinaire « Réussir sa double matérialité » est validé");
    expect(sent[0].html).toContain("le mardi 8 décembre 2026 à 11h00, en ligne sur Teams");
    expect(sent[0].attachments).toEqual([
      expect.objectContaining({ filename: "Modele Club ESG.pptx" }),
    ]);
  });

  it("Valider sans modèle déposé : validation faite, mail sans pièce jointe et avertissement", async () => {
    const { db } = fakeDb(defaultResponder({ "app_settings:select": () => ({ data: null, error: null }) }));
    const result = await decideProposal(db, "admin1", "p1", { type: "valider", lienInscription: "https://x.fr" });
    expect(result.warning).toBeTruthy();
    expect(sent[0].attachments).toBeUndefined();
  });

  it("Valider : bloque un créneau déjà validé pour une autre animation", async () => {
    const { db, ops } = fakeDb(defaultResponder({
      "animation_proposals:select": (op) =>
        filter(op, "statut") ? { data: [{ id: "p2" }], error: null } : { data: proposal, error: null },
    }));
    const result = await decideProposal(db, "admin1", "p1", { type: "valider", lienInscription: "https://x.fr" });
    expect(result.error).toContain("Conflit");
    expect(ops.some((o) => o.table === "events" && o.action === "insert")).toBe(false);
    expect(sent).toHaveLength(0);
  });

  it("Valider : bloque un créneau déjà occupé par un événement de l'agenda", async () => {
    const { db, ops } = fakeDb(defaultResponder({
      "events:select": () => ({ data: [{ titre: "Afterwork de Noël" }], error: null }),
    }));
    const result = await decideProposal(db, "admin1", "p1", { type: "valider", lienInscription: "https://x.fr" });
    expect(result.error).toContain("Afterwork de Noël");
    expect(ops.some((o) => o.table === "events" && o.action === "insert")).toBe(false);
  });

  it("Valider : exige un lien d'inscription valide", async () => {
    const { db, ops } = fakeDb(defaultResponder());
    const result = await decideProposal(db, "admin1", "p1", { type: "valider", lienInscription: "pas un lien" });
    expect(result.error).toBeTruthy();
    expect(ops.some((o) => o.action === "insert")).toBe(false);
  });

  it("Demander un ajustement : statut « À ajuster », mail avec message et lien, pas d'agenda", async () => {
    const { db, ops } = fakeDb(defaultResponder());
    const result = await decideProposal(db, "admin1", "p1", { type: "ajuster", message: "Pouvez-vous préciser le public visé ?" });

    expect(result).toEqual({});
    const update = ops.find((o) => o.action === "update");
    expect(update?.payload).toMatchObject({ statut: "a_ajuster", message_admin: "Pouvez-vous préciser le public visé ?" });
    expect(ops.some((o) => o.table === "events")).toBe(false);
    expect(sent[0]).toMatchObject({ subject: "Votre proposition d'animation : un petit ajustement" });
    expect(sent[0].html).toContain("Pouvez-vous préciser le public visé ?");
    expect(sent[0].html).toContain("https://club.fletchr.fr/proposer-animation/p1");
  });

  it("Refuser : statut « Refusée », mail avec le message, pas d'agenda", async () => {
    const { db, ops } = fakeDb(defaultResponder());
    const result = await decideProposal(db, "admin1", "p1", { type: "refuser", message: "Sujet déjà traité ce trimestre." });

    expect(result).toEqual({});
    expect(ops.find((o) => o.action === "update")?.payload).toMatchObject({ statut: "refusee" });
    expect(ops.some((o) => o.table === "events")).toBe(false);
    expect(sent[0]).toMatchObject({ subject: "Votre proposition d'animation" });
    expect(sent[0].html).toContain("Sujet déjà traité ce trimestre.");
    expect(sent[0].html).toContain("N'hésitez pas à nous proposer un autre sujet.");
  });

  it("Ajuster ou refuser exige un message", async () => {
    const { db, ops } = fakeDb(defaultResponder());
    const result = await decideProposal(db, "admin1", "p1", { type: "refuser", message: "   " });
    expect(result.error).toBeTruthy();
    expect(ops.some((o) => o.action === "update")).toBe(false);
  });

  it("une proposition déjà validée ne peut plus être traitée", async () => {
    const { db, ops } = fakeDb(defaultResponder({
      "animation_proposals:select": () => ({ data: { ...proposal, statut: "validee" }, error: null }),
    }));
    const result = await decideProposal(db, "admin1", "p1", { type: "refuser", message: "Non" });
    expect(result.error).toBeTruthy();
    expect(ops.some((o) => o.action === "update" || o.action === "insert")).toBe(false);
  });

  it("le texte saisi est neutralisé dans les mails (pas de HTML injecté)", async () => {
    const { db } = fakeDb(defaultResponder());
    await decideProposal(db, "admin1", "p1", { type: "ajuster", message: "<script>alert(1)</script>" });
    expect(sent[0].html).not.toContain("<script>");
    expect(sent[0].html).toContain("&lt;script&gt;");
  });
});
