import Link from "next/link";
import Image from "next/image";

/** Pied de page des pages publiques (accueil, à propos). */
export default function PublicFooter() {
  return (
    <footer className="px-4 sm:px-10 py-5 bg-[#142832] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <a href="https://club.fletchr.fr/dashboard">
        <Image src="/logo.svg" alt="Club ESG" width={110} height={36} />
      </a>
      <p className="text-[12px] text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
        © {new Date().getFullYear()} Fletchr · Ensemble, accélérons la transition RSE
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/a-propos"
          className="text-[12px] font-medium hover:underline"
          style={{ color: "#e4f7f3", opacity: 0.65 }}
        >
          À propos du Club ESG
        </Link>
        <Link
          href="/connexion"
          className="text-[12px] font-medium hover:underline"
          style={{ color: "#e4f7f3", opacity: 0.65 }}
        >
          {"Déjà membre ? Se connecter"}
        </Link>
      </div>
    </footer>
  );
}
