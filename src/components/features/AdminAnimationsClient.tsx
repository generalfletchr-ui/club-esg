"use client";

/* Composant client — propositions d'animation (admin) : filtre, fiche, décisions */
import { useMemo, useState, useTransition } from "react";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { decideAnimationProposal, setPresentationTemplate } from "@/app/admin/actions";
import {
  ANIMATION_FORMATS,
  STATUT_LABELS,
  STATUT_VARIANTS,
  canTransition,
  formatDateLongue,
  formatHeure,
  type AnimationStatut,
} from "@/lib/animations";
import type { AnimationProposal } from "@/types";

export interface AdminProposal extends AnimationProposal {
  auteur: { prenom: string; nom: string; email: string; entreprise: string };
}

type Filter = "" | AnimationStatut;

const FILTERS: Filter[] = ["", "en_attente", "a_ajuster", "validee", "refusee"];

const inputCls =
  "w-full h-[34px] rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none focus:border-[#016050] transition-colors";
const textareaCls =
  "w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] py-[8px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none focus:border-[#016050] transition-colors resize-none";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-1.5 border-b border-[#f3f4f6] last:border-0">
      <span className="text-[11px] font-semibold text-[#6b7280]">{label}</span>
      <span className="text-[12px] text-[#111827] whitespace-pre-line break-words">{children}</span>
    </div>
  );
}

/* ── Modèle de présentation joint aux mails de validation ─────── */
function TemplateCard({ templateName }: { templateName: string | null }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { setError("Le fichier dépasse 20 Mo."); return; }
    setError(null);

    startTransition(async () => {
      const safeName = file.name.replace(/[^\w.\- ]+/g, "_");
      const path = `modele-presentation/${Date.now()}/${safeName}`;
      const { error: uploadError } = await createClient()
        .storage.from("club-ressources")
        .upload(path, file, { contentType: file.type || undefined });
      if (uploadError) { setError("L'envoi du fichier a échoué."); return; }
      const result = await setPresentationTemplate(path);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[8px] px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-[12px] font-semibold text-[#111827]">Modèle de présentation du Club</p>
        <p className="text-[11px] text-[#6b7280]">
          {templateName
            ? <>Joint au mail de validation : 📎 {templateName}</>
            : "Aucun modèle déposé : le mail de validation partira sans pièce jointe."}
        </p>
        {error && <p className="text-[11px] text-[#ef4444] mt-0.5">{error}</p>}
      </div>
      <label className={`inline-flex items-center px-3 py-1.5 rounded-[6px] text-[11px] font-semibold border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f5f6f8] cursor-pointer transition-colors ${pending ? "opacity-50 pointer-events-none" : ""}`}>
        {pending ? "Envoi…" : templateName ? "Remplacer le modèle" : "Déposer le modèle"}
        <input type="file" accept=".pptx,.potx,.ppt,.pdf" onChange={upload} className="hidden" />
      </label>
    </div>
  );
}

/* ── Fiche détaillée + décisions ──────────────────────────────── */
function ProposalModal({ p, onClose }: { p: AdminProposal; onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [lien, setLien] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<{ type: "error" | "warning" | "ok"; text: string } | null>(null);

  const canDecide = canTransition(p.statut, "validee", "admin");

  function decide(type: "valider" | "ajuster" | "refuser") {
    setFeedback(null);
    startTransition(async () => {
      const result = await decideAnimationProposal(
        p.id,
        type === "valider" ? { type, lienInscription: lien } : { type, message }
      );
      if (result.error) { setFeedback({ type: "error", text: result.error }); return; }
      if (result.warning) { setFeedback({ type: "warning", text: result.warning }); return; }
      onClose();
    });
  }

  const feedbackCls = {
    error:   "text-[#ef4444] bg-[#fef2f2] border-[#fecaca]",
    warning: "text-[#ca8a04] bg-[#fefce8] border-[#fde68a]",
    ok:      "text-[#16a34a] bg-[#f0fdf4] border-[#bbf7d0]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-[10px] shadow-xl w-full max-w-[620px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-2 min-w-0">
            <Tag variant={STATUT_VARIANTS[p.statut]}>{STATUT_LABELS[p.statut]}</Tag>
            <h2 className="text-[15px] font-bold text-[#111827] truncate">{p.titre}</h2>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-[#374151] text-[22px] leading-none">×</button>
        </div>

        <div className="px-5 py-4">
          <Row label="Intervenant">{p.auteur.prenom} {p.auteur.nom}{p.auteur.entreprise ? ` · ${p.auteur.entreprise}` : ""}</Row>
          <Row label="E-mail">{p.auteur.email}</Row>
          <Row label="Format">{ANIMATION_FORMATS[p.format].label}</Row>
          <Row label="Thème">{p.theme === "Autre" && p.theme_autre ? `Autre : ${p.theme_autre}` : p.theme}</Row>
          <Row label="Date souhaitée">{formatDateLongue(p.date_souhaitee)} à {formatHeure(p.heure)}</Row>
          {p.resume && <Row label="Résumé">{p.resume}</Row>}
          {p.coanimateur_nom && (
            <Row label="Co-animateur">{p.coanimateur_nom}{p.coanimateur_email ? ` (${p.coanimateur_email})` : ""}</Row>
          )}
          <Row label="Engagement">Pas de présentation commerciale : accepté</Row>
          <Row label="Reçue le">{new Date(p.created_at).toLocaleDateString("fr-FR")}</Row>
          {p.message_admin && <Row label="Dernier message">{p.message_admin}</Row>}

          {feedback && (
            <p className={`text-[12px] border rounded-[6px] px-3 py-2 mt-4 ${feedbackCls[feedback.type]}`}>{feedback.text}</p>
          )}

          {canDecide ? (
            <div className="mt-5 flex flex-col gap-4">
              {/* Valider */}
              <div className="rounded-[8px] border border-[#e5e7eb] p-3">
                <p className="text-[12px] font-semibold text-[#111827] mb-1">Valider</p>
                <p className="text-[11px] text-[#6b7280] mb-2">
                  Crée l&apos;événement dans l&apos;agenda et envoie le mail de validation avec le modèle de présentation.
                </p>
                <div className="flex gap-2">
                  <input
                    value={lien}
                    onChange={(e) => setLien(e.target.value)}
                    placeholder="Lien d'inscription (Teams, HubSpot…) : https://…"
                    className={inputCls}
                  />
                  <Button variant="primary" size="sm" loading={pending} disabled={pending || !lien.trim()} onClick={() => decide("valider")}>
                    Valider
                  </Button>
                </div>
              </div>

              {/* Ajuster / refuser : même message au membre */}
              <div className="rounded-[8px] border border-[#e5e7eb] p-3">
                <p className="text-[12px] font-semibold text-[#111827] mb-1">Demander un ajustement ou refuser</p>
                <p className="text-[11px] text-[#6b7280] mb-2">Ce message est envoyé tel quel au membre.</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="ex. Pourriez-vous préciser les cas pratiques abordés ?"
                  className={textareaCls}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" size="sm" disabled={pending || !message.trim()} onClick={() => decide("ajuster")}>
                    Demander un ajustement
                  </Button>
                  <Button variant="danger" size="sm" disabled={pending || !message.trim()} onClick={() => decide("refuser")}>
                    Refuser
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-[#6b7280] mt-4">
              Cette proposition est {STATUT_LABELS[p.statut].toLowerCase()} : aucune action n&apos;est possible.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Composant principal ─────────────────────────────────────── */
export default function AdminAnimationsClient({
  proposals,
  templateName,
}: {
  proposals: AdminProposal[];
  templateName: string | null;
}) {
  const [filter, setFilter] = useState<Filter>("en_attente");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { "": proposals.length };
    for (const p of proposals) c[p.statut] = (c[p.statut] ?? 0) + 1;
    return c;
  }, [proposals]);

  const filtered = filter ? proposals.filter((p) => p.statut === filter) : proposals;
  const open = proposals.find((p) => p.id === openId) ?? null;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[22px] font-bold text-[#111827]">Animations</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          Propositions de webinaires et d&apos;ateliers envoyées par les membres
        </p>
      </div>

      <TemplateCard templateName={templateName} />

      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f || "toutes"}
            onClick={() => setFilter(f)}
            className={[
              "px-[14px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-colors",
              filter === f
                ? "bg-[#016050] text-white"
                : "bg-white border border-[#e5e7eb] text-[#374151] hover:bg-[#f5f6f8]",
            ].join(" ")}
          >
            {f ? STATUT_LABELS[f] : "Toutes"}
            <span className="ml-1.5 text-[10px] opacity-70">{counts[f] ?? 0}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-2xl mb-2">🎙</p>
          <p className="text-[13px] text-[#6b7280]">Aucune proposition dans cette catégorie.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpenId(p.id)}
              className="text-left bg-white border border-[#e5e7eb] rounded-[8px] p-4 hover:border-[#016050] transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Tag variant={STATUT_VARIANTS[p.statut]}>{STATUT_LABELS[p.statut]}</Tag>
                <span className="text-[11px] text-[#6b7280]">
                  {ANIMATION_FORMATS[p.format].label} · {formatDateLongue(p.date_souhaitee)} à {formatHeure(p.heure)}
                </span>
              </div>
              <p className="text-[13px] font-semibold text-[#111827] truncate">{p.titre}</p>
              <p className="text-[11px] text-[#9ca3af] mt-0.5">
                👤 {p.auteur.prenom} {p.auteur.nom} · {p.theme === "Autre" && p.theme_autre ? p.theme_autre : p.theme}
              </p>
            </button>
          ))}
        </div>
      )}

      {open && <ProposalModal p={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
