"use client";

/* Composant client — export CSV membres (admin) */
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ExportCsvClient({
  totalApproved,
}: {
  totalApproved: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleExport() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/export-csv");

      if (!res.ok) {
        setError("Une erreur est survenue lors de l'export.");
        return;
      }

      /* Déclenche le téléchargement */
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");

      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match       = disposition.match(/filename="?([^"]+)"?/);
      a.download        = match?.[1] ?? "membres-club-esg.csv";
      a.href            = url;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Impossible de récupérer le fichier.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#111827]">Export CSV</h1>
        <p className="text-[12px] text-[#6b7280] mt-0.5">
          Export des membres approuvés pour import HubSpot
        </p>
      </div>

      {/* Carte d'export */}
      <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-6 max-w-[480px]">

        {/* Icône + infos */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-[48px] h-[48px] rounded-[10px] bg-[#e6f2ef] flex items-center justify-center text-2xl flex-shrink-0">
            ↓
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#111827] mb-1">
              Membres approuvés
            </p>
            <p className="text-[12px] text-[#6b7280] leading-relaxed">
              {totalApproved} membre{totalApproved > 1 ? "s" : ""} à exporter.
              <br />
              Le fichier CSV inclut : prénom, nom, email, type de membre, fonction,
              entreprise, secteur, taille, ville et date d&apos;inscription.
              <br />
              <span className="text-[#9ca3af]">Le SIRET n&apos;est pas inclus dans l&apos;export.</span>
            </p>
          </div>
        </div>

        {/* Colonnes exportées */}
        <div className="bg-[#f5f6f8] rounded-[6px] px-4 py-3 mb-5">
          <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
            Colonnes exportées
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Prénom", "Nom", "Email", "Type de membre",
              "Fonction", "Entreprise", "Secteur", "Taille", "Ville", "Date inscription",
            ].map((col) => (
              <span
                key={col}
                className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-white border border-[#e5e7eb] text-[11px] text-[#374151]"
              >
                {col}
              </span>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-[12px] text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] rounded-[6px] px-3 py-2 mb-3">
            {error}
          </p>
        )}

        <Button
          variant="primary"
          size="lg"
          loading={loading}
          onClick={handleExport}
          disabled={totalApproved === 0}
          fullWidth
        >
          {loading ? "Génération en cours…" : "Télécharger le CSV"}
        </Button>

        {totalApproved === 0 && (
          <p className="text-[11px] text-[#9ca3af] text-center mt-2">
            Aucun membre approuvé à exporter.
          </p>
        )}
      </div>
    </div>
  );
}
