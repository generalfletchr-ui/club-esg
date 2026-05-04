import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import HashErrorRedirect from "./_hash-error-redirect";

const PRIMARY_CTA_HREF = "/inscription";

const STATS = [
  ["40+", "Membres actifs"],
  ["12",  "Webinaires / an"],
  ["8+",  "Replays disponibles"],
  ["3",   "Événements / mois"],
];

const FEATURES = [
  {
    icon: "🎙",
    tag: "Formation",
    title: "Webinaires mensuels animés par des praticiens",
    desc: "CSRD, bilan carbone, stratégie RSE, due diligence ESG — des sessions opérationnelles sur les sujets qui comptent vraiment pour votre métier.",
    detail: "12 sessions / an · replay disponible sous 24h",
  },
  {
    icon: "🎞",
    tag: "Bibliothèque",
    title: "Toutes les sessions en replay, à tout moment",
    desc: "Accédez à la bibliothèque complète des sessions passées. Restez à jour à votre rythme, même quand votre agenda ne le permet pas.",
    detail: "Sessions indexées · accessible 24/7",
  },
  {
    icon: "🤝",
    tag: "Réseau",
    title: "Des professionnels ESG triés sur le volet",
    desc: "Consultants, responsables RSE, experts-comptables, juristes — tous sélectionnés et engagés. Des pairs qui comprennent vraiment vos enjeux.",
    detail: "Annuaire · DMs directs · Afterworks",
  },
  {
    icon: "🌿",
    tag: "Confiance",
    title: "Une communauté privée avec charte d'engagement",
    desc: "Pas de démarchage, pas de vente. Chaque membre signe une charte de bienveillance. Les échanges restent entre professionnels.",
    detail: "Accès modéré · charte signée",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Vous candidatez",
    desc: "Formulaire rapide : profil professionnel, secteur, expertises. Moins de 5 minutes.",
  },
  {
    num: "02",
    title: "Votre demande est examinée",
    desc: "L'équipe Fletchr vérifie votre profil sous 48h pour garantir la qualité de la communauté.",
  },
  {
    num: "03",
    title: "Vous accédez à tout",
    desc: "Annuaire, replays, agenda des événements, espace d'échange — accès immédiat et complet.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense><HashErrorRedirect /></Suspense>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 bg-white border-b border-[#e5e7eb] px-4 sm:px-10 py-3 flex items-center justify-between gap-3">
        <a href="https://club.fletchr.fr/dashboard">
          <Image src="/logo.svg" alt="Club ESG" width={130} height={43} priority />
        </a>
        <div className="flex items-center gap-3 flex-shrink-0">
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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-[#016050] px-4 sm:px-10 pt-20 pb-20">
        <div className="max-w-[720px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e4f7f3] inline-block opacity-70" />
            <span className="text-white/65 text-[12px] font-medium">
              Communauté privée · Accès 100% gratuit
            </span>
          </div>

          <h1 className="text-[34px] sm:text-[48px] font-bold text-white leading-[1.1] mb-5" style={{ letterSpacing: "-0.025em" }}>
            Le réseau privé des
            <br />
            <span style={{ color: "#e4f7f3" }}>professionnels ESG</span>
          </h1>

          <p className="text-[16px] sm:text-[17px] text-white/60 max-w-[480px] mx-auto mb-10 leading-relaxed">
            Webinaires experts, bibliothèque de replays et networking — pour les praticiens
            ESG les plus engagés de France.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={PRIMARY_CTA_HREF}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[6px] text-[14px] font-semibold text-[#016050] bg-white hover:bg-[#e4f7f3] transition-colors"
            >
              Rejoindre gratuitement →
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[6px] text-[14px] font-medium border border-white/20 text-white/70 hover:bg-white/10 transition-colors"
            >
              Déjà membre ? Se connecter
            </Link>
          </div>
        </div>

        <div className="max-w-[560px] mx-auto mt-16 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-[32px] font-bold text-white leading-none mb-1" style={{ letterSpacing: "-0.02em" }}>
                {num}
              </div>
              <div className="text-[12px] text-white/40 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bandeau Fletchr ──────────────────────────────────── */}
      <div className="bg-[#142832] px-4 py-3.5">
        <div className="max-w-[800px] mx-auto flex flex-wrap justify-center gap-x-10 gap-y-2">
          {[
            "✦  Par Fletchr, spécialiste ESG",
            "✦  Accès 100% gratuit",
            "✦  Demande examinée sous 48h",
            "✦  Communauté modérée",
          ].map((item) => (
            <span key={item} className="text-[12px] font-medium" style={{ color: "#bdccd4" }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Valeur de proposition ────────────────────────────── */}
      <section className="px-4 sm:px-10 py-20 bg-white">
        <div className="max-w-[580px] mx-auto text-center">
          <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.12em] mb-4">
            Pourquoi rejoindre le Club ESG
          </p>
          <h2 className="text-[26px] sm:text-[32px] font-bold text-[#142832] leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>
            Le lieu où les praticiens ESG
            progressent ensemble
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "#6b7280" }}>
            Le Club ESG rassemble des professionnels engagés — consultants, responsables RSE,
            experts-comptables — pour apprendre, partager et collaborer sur les enjeux concrets
            de la transition environnementale et sociale.
          </p>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-10 pb-20 bg-white">
        <div className="max-w-[880px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="border border-[#e5e7eb] rounded-[10px] p-6 hover:border-[#016050] hover:shadow-[0_4px_20px_rgba(1,96,80,0.08)] transition-all duration-200"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-[8px] bg-[#e4f7f3] flex items-center justify-center text-[18px] flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.08em]">
                  {f.tag}
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-[#142832] mb-2 leading-snug" style={{ letterSpacing: "-0.01em" }}>
                {f.title}
              </h3>
              <p className="text-[13px] leading-relaxed mb-3" style={{ color: "#6b7280" }}>{f.desc}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#008254] inline-block" />
                <p className="text-[11px] font-medium" style={{ color: "#008254" }}>{f.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-20 bg-[#ebebe6]">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.12em] mb-4">
              {"Processus d'adhésion"}
            </p>
            <h2 className="text-[26px] sm:text-[30px] font-bold text-[#142832]" style={{ letterSpacing: "-0.02em" }}>
              Rejoindre le Club en 3 étapes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center sm:items-start text-center sm:text-left">
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+24px)] right-[-50%] h-px bg-[#bdccd4]" />
                )}
                <div className="w-10 h-10 rounded-full bg-[#016050] flex items-center justify-center mb-4 flex-shrink-0 relative z-10">
                  <span className="text-[11px] font-bold text-white">{step.num}</span>
                </div>
                <h3 className="text-[14px] font-bold text-[#142832] mb-2">{step.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#6b7280" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-20 bg-[#142832]">
        <div className="max-w-[500px] mx-auto text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-5" style={{ color: "#e4f7f3", opacity: 0.6 }}>
            Accès gratuit · Sur candidature
          </p>
          <h2 className="text-[26px] sm:text-[32px] font-bold text-white mb-4 leading-tight" style={{ letterSpacing: "-0.02em" }}>
            {"Prêt·e à rejoindre la communauté ?"}
          </h2>
          <p className="text-[14px] mb-8 leading-relaxed max-w-[380px] mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            {"Candidatez en 5 minutes. L'accès est entièrement gratuit et votre demande est examinée sous 48h."}
          </p>
          <Link
            href={PRIMARY_CTA_HREF}
            className="inline-flex items-center px-10 py-3.5 rounded-[6px] text-[14px] font-semibold text-[#016050] bg-white hover:bg-[#e4f7f3] transition-colors"
          >
            Rejoindre gratuitement →
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="px-4 sm:px-10 py-5 bg-[#142832] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <a href="https://club.fletchr.fr/dashboard">
          <Image src="/logo.svg" alt="Club ESG" width={110} height={36} />
        </a>
        <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} Fletchr · Ensemble, accélérons la transition RSE
        </p>
        <Link
          href="/connexion"
          className="text-[12px] font-medium hover:underline"
          style={{ color: "#e4f7f3", opacity: 0.65 }}
        >
          {"Déjà membre ? Se connecter"}
        </Link>
      </footer>
    </div>
  );
}