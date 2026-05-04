"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function MotDePasseOublieForm() {
  const searchParams = useSearchParams();
  const lienExpire = searchParams.get("lien") === "expire";
  const supabase = createClient();

  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nouvelle-session`,
    });

    if (resetError) {
      setError("Une erreur est survenue. Vérifie ton adresse email.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-5">
      <div
        className="w-full max-w-[440px] bg-white rounded-[8px] overflow-hidden"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
      >
        {/* En-tête */}
        <div className="bg-white px-7 py-5 border-b border-[#e5e7eb]">
          <Link href="https://club.fletchr.fr/dashboard">
            <Image src="/logo.svg" alt="Club ESG" width={130} height={43} priority />
          </Link>
        </div>

        <div className="px-7 py-6">
          {lienExpire && !sent && (
            <div className="mb-5 px-3 py-3 rounded-[6px] bg-[#fffbeb] border border-[#fde68a]">
              <p className="text-[12px] text-[#92400e] font-semibold mb-0.5">Ton lien a expiré</p>
              <p className="text-[12px] text-[#92400e]">
                Les liens de réinitialisation sont à usage unique et peuvent être consommés par les filtres anti-spam. Saisis ton email ci-dessous pour en recevoir un nouveau.
              </p>
            </div>
          )}

          {sent ? (
            /* ── Confirmation envoi ── */
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center mx-auto mb-4 text-xl">
                ✉️
              </div>
              <h2 className="text-[18px] font-bold text-[#111827] mb-2">
                Email envoyé !
              </h2>
              <p className="text-[13px] text-[#6b7280] leading-relaxed mb-6">
                On a envoyé un lien de réinitialisation à{" "}
                <span className="font-semibold text-[#374151]">{email}</span>.
                Vérifie ta boîte de réception (et les spams).
              </p>
              <Link
                href="/connexion"
                className="text-[12px] text-[#016050] font-semibold hover:underline"
              >
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            /* ── Formulaire ── */
            <>
              <h2 className="text-[18px] font-bold text-[#111827] mb-1">
                Mot de passe oublié ?
              </h2>
              <p className="text-[12px] text-[#6b7280] mb-6">
                Saisis ton adresse email et on t&apos;envoie un lien pour réinitialiser
                ton mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Adresse email"
                  type="email"
                  placeholder="prenom@entreprise.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />

                {error && (
                  <div className="px-3 py-2.5 rounded-[6px] bg-[#fef2f2] border border-[#fecaca]">
                    <p className="text-[12px] text-[#ef4444]">{error}</p>
                  </div>
                )}

                <Button type="submit" fullWidth loading={loading}>
                  Envoyer le lien →
                </Button>
              </form>

              <div className="mt-5 pt-5 border-t border-[#e5e7eb] text-center">
                <Link
                  href="/connexion"
                  className="text-[12px] text-[#6b7280] hover:text-[#374151] hover:underline"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MotDePasseOubliePage() {
  return (
    <Suspense>
      <MotDePasseOublieForm />
    </Suspense>
  );
}
