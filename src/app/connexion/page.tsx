"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ConnexionPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect. Vérifie tes identifiants.");
      setLoading(false);
      return;
    }

    if (data.session) {
      /* Met à jour la dernière connexion */
      await supabase
        .from("members")
        .update({ derniere_connexion: new Date().toISOString() })
        .eq("id", data.user.id);

      router.push("/dashboard");
      router.refresh();
    }
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
            Accéder au Club
          </h2>
          <p className="text-[12px] text-[#6b7280] mb-6">
            Bon retour parmi nous 👋
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

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[12px] font-medium text-[#374151]">
                  Mot de passe <span className="text-[#ef4444]">*</span>
                </label>
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-[11px] text-[#016050] font-medium hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-[34px] w-full rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] text-[12px] text-[#111827] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#016050]"
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="px-3 py-2.5 rounded-[6px] bg-[#fef2f2] border border-[#fecaca]">
                <p className="text-[12px] text-[#ef4444]">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth loading={loading} className="mt-1">
              Se connecter →
            </Button>
          </form>

          {/* Bas de formulaire */}
          <div className="mt-5 pt-5 border-t border-[#e5e7eb] text-center">
            <p className="text-[12px] text-[#6b7280]">
              Pas encore membre ?{" "}
              <Link
                href="/inscription"
                className="text-[#016050] font-semibold hover:underline"
              >
                Rejoindre le Club
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
