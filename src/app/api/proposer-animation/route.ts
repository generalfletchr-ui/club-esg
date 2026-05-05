import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { sendAdminAnimationProposal } from "@/lib/resend";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  const supabaseUser = await createServerClient();
  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { type, sujet, description } = await req.json();
  if (!type || !sujet || !description) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const supabase = serviceClient();

  const { data: member } = await supabase
    .from("members")
    .select("prenom, nom, email")
    .eq("id", user.id)
    .single();

  if (!member) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });

  const { data: admins } = await supabase
    .from("members")
    .select("email")
    .eq("role", "admin")
    .eq("statut", "approved");

  const adminEmails = (admins ?? []).map((a: { email: string }) => a.email).filter(Boolean);

  await sendAdminAnimationProposal(
    adminEmails,
    member.prenom,
    member.nom,
    member.email,
    type,
    sujet,
    description,
  );

  return NextResponse.json({ ok: true });
}
