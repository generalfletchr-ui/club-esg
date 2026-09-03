import Link from "next/link";
import Image from "next/image";

const PRIMARY_CTA_HREF = "/inscription";

/**
 * Navigation des pages publiques (accueil, à propos).
 * `active` met en avant l'onglet de la page courante.
 */
export default function PublicNav({ active }: { active?: "a-propos" }) {
  return (
    <nav className="sticky top-0 z-20 bg-white border-b border-[#e5e7eb] px-4 sm:px-10 py-3 flex items-center justify-between gap-3">
      <a href="https://club.fletchr.fr/dashboard">
        <Image src="/logo.svg" alt="Club ESG" width={130} height={43} priority />
      </a>
      <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
        <Link
          href="/a-propos"
          className={
            active === "a-propos"
              ? "hidden sm:block text-[13px] font-semibold text-[#016050] transition-colors"
              : "hidden sm:block text-[13px] font-medium text-[#6b7280] hover:text-[#142832] transition-colors"
          }
        >
          À propos du Club ESG
        </Link>
        <Link
          href="/connexion"
          className="hidden sm:block text-[13px] font-medium text-[#6b7280] hover:text-[#142832] transition-colors"
        >
          Se connecter
        </Link>
        <Link
          href={PRIMARY_CTA_HREF}
          className="inline-flex px-[16px] py-[9px] rounded-[6px] text-[13px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors whitespace-nowrap"
        >
          Rejoindre le Club
        </Link>
      </div>
    </nav>
  );
}
