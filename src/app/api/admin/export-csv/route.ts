/* Route Handler — Export CSV des membres approuvés */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getMemberProfile } from "@/lib/auth";

/* Échappe une valeur pour CSV (entoure de guillemets si nécessaire) */
function escapeCSV(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  /* Vérification admin */
  const user   = await getAuthUser();
  const member = await getMemberProfile(user.id);

  if (member.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("members")
    .select(
      "prenom, nom, email, type_membre, fonction, entreprise, secteur, taille_entreprise, ville, date_inscription"
    )
    .eq("statut", "approved")
    .order("date_inscription", { ascending: false });

  if (error || !members) {
    return NextResponse.json({ error: "Erreur base de données" }, { status: 500 });
  }

  /* En-têtes CSV */
  const headers = [
    "Prénom",
    "Nom",
    "Email",
    "Type de membre",
    "Fonction",
    "Entreprise",
    "Secteur",
    "Taille",
    "Ville",
    "Date inscription",
  ];

  /* Lignes CSV */
  const rows = members.map((m) => [
    escapeCSV(m.prenom),
    escapeCSV(m.nom),
    escapeCSV(m.email),
    escapeCSV(m.type_membre),
    escapeCSV(m.fonction),
    escapeCSV(m.entreprise),
    escapeCSV(m.secteur),
    escapeCSV(m.taille_entreprise),
    escapeCSV(m.ville),
    escapeCSV(m.date_inscription ? new Date(m.date_inscription).toLocaleDateString("fr-FR") : ""),
  ].join(","));

  const csv = [headers.join(","), ...rows].join("\n");

  /* BOM UTF-8 pour compatibilité Excel */
  const BOM = "﻿";
  const filename = `membres-club-esg-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(BOM + csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
