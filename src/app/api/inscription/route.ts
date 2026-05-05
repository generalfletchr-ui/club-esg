import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAdminNewMemberEmail } from "@/lib/resend";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    id, email, prenom, nom, type_membre, fonction, entreprise, siret,
    secteur, taille_entreprise, zone_geo, ville, site_web, photo_url,
    biographie, expertises, linkedin, telephone,
  } = body;

  if (!id || !email || !prenom || !nom) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const supabase = serviceClient();

  const { error } = await supabase.from("members").insert({
    id, email, prenom, nom, type_membre, fonction, entreprise, siret,
    secteur, taille_entreprise, zone_geo, ville,
    site_web:       site_web       || null,
    photo_url:      photo_url      || null,
    biographie,
    expertises:     expertises     ?? [],
    linkedin:       linkedin       || null,
    telephone,
    charte_acceptee: true,
    statut:          "pending",
    role:            "pending",
  });

  if (error) {
    console.error("[api/inscription] insertError:", error.message, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  /* Notification email aux admins */
  const { data: admins } = await supabase
    .from("members")
    .select("email")
    .eq("role", "admin")
    .eq("statut", "approved");

  const adminEmails = (admins ?? []).map((a: { email: string }) => a.email).filter(Boolean);
  await sendAdminNewMemberEmail(adminEmails, prenom, nom, email, entreprise, fonction).catch(
    (err) => console.error("[api/inscription] emailError:", err)
  );

  return NextResponse.json({ ok: true });
}
