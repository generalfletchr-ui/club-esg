import Link from "next/link";
import Image from "next/image";

/* Page de confirmation après soumission du formulaire d'inscription */
export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-5">
      <div
        className="w-full max-w-[480px] bg-white rounded-[8px] overflow-hidden text-center"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
      >
        {/* En-tête */}
        <div className="bg-white px-7 py-4 border-b border-[#e5e7eb]">
          <Link href="https://club.fletchr.fr/dashboard">
            <Image src="/logo.svg" alt="Club ESG" width={120} height={40} />
          </Link>
        </div>

        <div className="px-8 py-10">
          {/* Icône succès */}
          <div className="w-16 h-16 rounded-full bg-[#e6f2ef] flex items-center justify-center mx-auto mb-5 text-2xl">
            🎉
          </div>

          <h2 className="text-[22px] font-bold text-[#111827] mb-3">
            Demande envoyée !
          </h2>

          <p className="text-[13px] text-[#6b7280] leading-relaxed mb-2">
            Bienvenue ! Ta demande d&apos;adhésion au Club ESG a bien été reçue.
          </p>
          <p className="text-[13px] text-[#6b7280] leading-relaxed mb-6">
            Notre équipe va l&apos;examiner sous{" "}
            <span className="font-semibold text-[#374151]">48h</span> et tu recevras
            un email de confirmation dès validation.
          </p>

          {/* Encart WhatsApp */}
          <div className="rounded-[8px] bg-[#f0fdf4] border border-[#bbf7d0] px-5 py-4 mb-6">
            <p className="text-[13px] font-semibold text-[#166534] mb-1">
              💬 En attendant, rejoins le groupe WhatsApp
            </p>
            <p className="text-[12px] text-[#16a34a] mb-3">
              Échangez dès maintenant avec les membres de la communauté
            </p>
            <a
              href="https://chat.whatsapp.com/DxE8kxJSu2KJegWwPBGoXs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded-[6px] text-[12px] font-semibold text-white bg-[#16a34a] hover:bg-[#15803d] transition-colors"
            >
              Rejoindre le groupe →
            </a>
          </div>

          <Link
            href="/"
            className="text-[12px] text-[#6b7280] hover:text-[#374151] hover:underline"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
