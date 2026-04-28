import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { WHATSAPP_LINK } from "@/lib/constants";

/* Page affichée aux membres pending en attente de validation */
export default async function EnAttentePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  /* Si le membre est déjà approved, le renvoyer au dashboard */
  const { data: member } = await supabase
    .from("members")
    .select("prenom, statut")
    .eq("id", user.id)
    .single();

  if (member?.statut === "approved") redirect("/dashboard");

  async function handleLogout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/connexion");
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-5">
      <div
        className="w-full max-w-[480px] bg-white rounded-[8px] overflow-hidden text-center"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
      >
        {/* En-tête */}
        <div className="px-7 py-4 border-b border-[#e5e7eb]">
          <Image src="/logo.svg" alt="Club ESG" width={120} height={40} />
        </div>

        <div className="px-8 py-10">
          <div className="w-14 h-14 rounded-full bg-[#fefce8] border border-[#fde68a] flex items-center justify-center mx-auto mb-5 text-2xl">
            ⏳
          </div>

          <h2 className="text-[20px] font-bold text-[#111827] mb-3">
            Demande en cours d&apos;examen
          </h2>

          <p className="text-[13px] text-[#6b7280] leading-relaxed mb-2">
            Bonjour {member?.prenom} ! Ta demande d&apos;adhésion est en cours de traitement.
          </p>
          <p className="text-[13px] text-[#6b7280] leading-relaxed mb-7">
            Notre équipe va valider ton profil sous{" "}
            <span className="font-semibold text-[#374151]">48h</span>.
            Tu recevras un email dès que ton accès est activé.
          </p>

          {/* WhatsApp */}
          <div className="rounded-[8px] bg-[#f0fdf4] border border-[#bbf7d0] px-5 py-4 mb-6">
            <p className="text-[13px] font-semibold text-[#166534] mb-1">
              💬 En attendant, rejoins le groupe WhatsApp
            </p>
            <p className="text-[12px] text-[#16a34a] mb-3">
              Retrouve-y déjà les membres de la communauté
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded-[6px] text-[12px] font-semibold text-white bg-[#16a34a] hover:bg-[#15803d] transition-colors"
            >
              Rejoindre le groupe →
            </a>
          </div>

          <form action={handleLogout}>
            <button
              type="submit"
              className="text-[11px] text-[#9ca3af] hover:text-[#6b7280] hover:underline"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
