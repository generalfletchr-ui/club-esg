"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

/**
 * Page intermédiaire anti-scanner d'emails.
 *
 * L'email de réinitialisation pointe vers cette page avec :
 *   /auth/reset?token_hash=XXX&type=recovery
 *
 * Les scanners de sécurité (Microsoft Safe Links, etc.) chargent la page
 * mais ne peuvent pas cliquer sur le bouton — le token OTP n'est donc pas
 * consommé avant que l'utilisateur réel agisse.
 *
 * À la confirmation, on appelle verifyOtp() puis on redirige vers
 * /nouvelle-session où l'utilisateur choisit son nouveau mot de passe.
 */
function ResetConfirmForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const supabase    = createClient();

  const tokenHash   = params.get("token_hash");
  const type        = params.get("type") ?? "recovery";

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [invalid, setInvalid] = useState(false);

  // Vérification basique de la présence des params
  useEffect(() => {
    if (!tokenHash) setInvalid(true);
  }, [tokenHash]);

  async function handleConfirm() {
    if (!tokenHash) return;
    setLoading(true);
    setError("");

    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "recovery",
    });

    if (verifyError) {
      setError("Lien invalide ou expiré. Demande un nouveau lien.");
      setLoading(false);
      return;
    }

    router.replace("/nouvelle-session");
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
          <h2 className="text-[18px] font-bold text-[#111827] mb-1">
            Réinitialisation du mot de passe
          </h2>

          {invalid ? (
            /* Lien mal formé */
            <div className="mt-4">
              <div className="px-3 py-2.5 rounded-[6px] bg-[#fef2f2] border border-[#fecaca] mb-4">
                <p className="text-[12px] text-[#ef4444]">
                  Lien invalide. Merci de redemander un lien de réinitialisation.
                </p>
              </div>
              <Link
                href="/mot-de-passe-oublie"
                className="text-[13px] text-[#016050] font-semibold hover:underline"
              >
                Demander un nouveau lien →
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[13px] text-[#6b7280] mb-6 leading-relaxed">
                Clique sur le bouton ci-dessous pour confirmer la réinitialisation
                et choisir un nouveau mot de passe.
              </p>

              {error && (
                <div className="mb-4 px-3 py-2.5 rounded-[6px] bg-[#fef2f2] border border-[#fecaca]">
                  <p className="text-[12px] text-[#ef4444]">{error}</p>
                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-[12px] text-[#016050] font-semibold hover:underline mt-1 block"
                  >
                    Demander un nouveau lien →
                  </Link>
                </div>
              )}

              <Button fullWidth loading={loading} onClick={handleConfirm}>
                Confirmer la réinitialisation →
              </Button>
            </>
          )}

          <div className="mt-5 pt-5 border-t border-[#e5e7eb] text-center">
            <Link
              href="/connexion"
              className="text-[12px] text-[#6b7280] hover:text-[#374151] hover:underline"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthResetPage() {
  return (
    <Suspense>
      <ResetConfirmForm />
    </Suspense>
  );
}
