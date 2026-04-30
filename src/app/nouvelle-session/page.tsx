"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function NouvelleSessionForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const supabase    = createClient();

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [ready,     setReady]     = useState(false);

  /* Échange le code PKCE contre une session active */
  useEffect(() => {
    const code = params.get("code");
    if (!code) {
      setError("Lien invalide ou expiré. Demande un nouveau lien.");
      return;
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error: e }) => {
      if (e) {
        setError("Lien invalide ou expiré. Demande un nouveau lien.");
      } else {
        setReady(true);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Une erreur est survenue. Réessaie.");
      setLoading(false);
      return;
    }

    router.push("/connexion?reset=ok");
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-5">
      <div
        className="w-full max-w-[440px] bg-white rounded-[8px] overflow-hidden"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
      >
        {/* En-tête */}
        <div className="bg-white px-7 py-5 border-b border-[#e5e7eb]">
          <Link href="/">
            <Image src="/logo.svg" alt="Club ESG" width={130} height={43} priority />
          </Link>
        </div>

        <div className="px-7 py-6">
          <h2 className="text-[18px] font-bold text-[#111827] mb-1">
            Nouveau mot de passe
          </h2>
          <p className="text-[12px] text-[#6b7280] mb-6">
            Choisis un nouveau mot de passe pour ton compte.
          </p>

          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-[6px] bg-[#fef2f2] border border-[#fecaca]">
              <p className="text-[12px] text-[#ef4444]">{error}</p>
              {!ready && (
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-[12px] text-[#00B4B4] font-semibold hover:underline mt-1 block"
                >
                  Demander un nouveau lien →
                </Link>
              )}
            </div>
          )}

          {ready && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Nouveau mot de passe"
                type="password"
                placeholder="Minimum 8 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint="Au moins 8 caractères"
                required
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                placeholder="Répète ton mot de passe"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <Button type="submit" fullWidth loading={loading}>
                Enregistrer le mot de passe →
              </Button>
            </form>
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

export default function NouvelleSessionPage() {
  return (
    <Suspense>
      <NouvelleSessionForm />
    </Suspense>
  );
}
