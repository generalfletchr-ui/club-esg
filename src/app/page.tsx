import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import HashErrorRedirect from "./_hash-error-redirect";

const PRIMARY_CTA_HREF = "/inscription";
const PRIMARY_CTA_TEXT = "Rejoindre gratuitement →";

const STATS = [
  ["40+",  "Membres actifs"],
  ["12",   "Webinaires / an"],
  ["8+",   "Replays disponibles"],
  ["3",    "Événements / mois"],
];

const FEATURES = [
  {
    icon: "🎙",
    tag: "Savoir",
    title: "Webinaires mensuels animés par des praticiens",
    desc: "CSRD, bilan carbone, stratégie RSE, due diligence ESG — des sessions opérationnelles sur les sujets qui comptent vraiment pour votre métier.",
    detail: "12 webinaires par an · replay disponible sous 24h",
  },
  {
    icon: "🎞",
    tag: "Bibliothèque",
    title: "Accès à toutes les sessions en replay",
    desc: "Toute la bibliothèque vidéo des sessions passées, accessible à tout moment. Restez à jour à votre rythme, même quand votre agenda ne le permet pas.",
    detail: "Sessions indexées et searchables",
  },
  {
    icon: "🤝",
    tag: "Réseau",
    title: "Un réseau de professionnels ESG triés sur le volet",
    desc: "Consultants, responsables RSE, experts-comptables, juristes — tous engagés et sélectionnés. Échangez avec des pairs qui comprennent vos enjeux.",
    detail: "Annuaire membres · DMs directs · Afterworks",
  },
  {
    icon: "🌿",
    tag: "Confiance",
    title: "Une communauté privée avec charte d'engagement",
    desc: "Pas de démarchage, pas de vente. Chaque membre signe une charte de bienveillance et de confidentialité. Les échanges restent entre professionnels.",
    detail: "Accès modéré · Charte signée",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Vous candidatez",
    desc: "Remplissez le formulaire d'inscription en moins de 5 minutes. Profil professionnel, secteur, expertises.",
  },
  {
    num: "02",
    title: "Votre demande est examinée",
    desc: "L'équipe Fletchr vérifie votre profil sous 48h pour garantir la qualité de la communauté.",
  },
  {
    num: "03",
    title: "Vous accédez à tout",
    desc: "Annuaire, replays, agenda des événements à venir, et espace d'échange — tout est accessible immédiatement.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Suspense><HashErrorRedirect /></Suspense>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 bg-white border-b border-[#e5e7eb] px-4 sm:px-10 py-3 flex items-center justify-between gap-3">
        <a href="https://club.fletchr.fr/dashboard">
          <Image src="/logo.svg" alt="Club ESG" width={130} height={43} priority />
        </a>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/connexion"
            className="hidden sm:inline-flex px-[14px] py-[8px] rounded-[6px] text-[13px] font-medium text-[#374151] hover:text-[#111827] transition-colors"
          >
            Déjà membre
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
      <section className="bg-[#016050] px-4 sm:px-10 pt-20 pb-16">
        <div className="max-w-[760px] mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e4f7f3] inline-block" />
            <span className="text-white/80 text-[12px] font-medium tracking-wide">
              Communauté privée · Accès 100% gratuit
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[32px] sm:text-[44px] font-bold text-white leading-[1.15] mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
          >
            Le réseau des professionnels ESG
            <br />
            <span className="text-[#e4f7f3]">qui font avancer la transition RSE</span>
          </h1>

          <p className="text-[16px] text-white/75 max-w-[500px] mx-auto mb-9 leading-relaxed">
            Webinaires experts, bibliothèque de replays, networking — une communauté privée
            pour les praticiens ESG les plus engagés.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href={PRIMARY_CTA_HREF}
              className="inline-flex items-center px-7 py-3 rounded-[6px] text-[14px] font-semibold text-[#016050] bg-white hover:bg-[#f0faf7] transition-colors"
            >
              {PRIMARY_CTA_TEXT}
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center px-7 py-3 rounded-[6px] text-[14px] font-medium border border-white/25 text-white/80 hover:bg-white/10 transition-colors"
            >
              Se connecter
            </Link>
          </div>

        </div>

        {/* Stats strip */}
        <div className="max-w-[640px] mx-auto mt-14 pt-10 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(([num, label]) => (
            <div key={label} className="text-center">
              <div
                className="text-[30px] font-bold text-white mb-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {num}
              </div>
              <div className="text-[12px] text-white/55 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust bar ───────────────────────────────────────── */}
      <div className="bg-[#f5f6f8] border-b border-[#e5e7eb] px-4 py-3">
        <div className="max-w-[760px] mx-auto flex flex-wrap justify-center gap-x-8 gap-y-1.5">
          {[
            "✓  Par Fletchr, spécialiste ESG",
            "✓  Accès gratuit, sans engagement",
            "✓  Demande examinée sous 48h",
            "✓  Communauté modérée",
          ].map((item) => (
            <span key={item} className="text-[12px] text-[#6b7280] font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Valeur de proposition ────────────────────────────── */}
      <section className="px-4 sm:px-10 py-16 bg-white">
        <div className="max-w-[640px] mx-auto text-center">
          <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.1em] mb-3">
            Pourquoi le Club ESG
          </p>
          <h2
            className="text-[26px] sm:text-[30px] font-bold text-[#111827] mb-4 leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.01em" }}
          >
            Le lieu où les praticiens ESG progressent ensemble
          </h2>
          <p className="text-[15px] text-[#6b7280] leading-relaxed">
            Le Club ESG rassemble des professionnels — consultants, responsables RSE,
            experts-comptables — pour apprendre, partager et collaborer autour des enjeux
            de la transition environnementale et sociale.
          </p>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-10 pb-16 bg-white">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group border border-[#e5e7eb] rounded-[10px] p-6 hover:border-[#016050] hover:shadow-[0_2px_16px_rgba(1,96,80,0.08)] transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[22px]">{f.icon}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e4f7f3] text-[#016050] text-[11px] font-semibold">
                  {f.tag}
                </span>
              </div>
              <h3
                className="text-[15px] font-bold text-[#111827] mb-2 leading-snug"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {f.title}
              </h3>
              <p className="text-[13px] text-[#6b7280] leading-relaxed mb-3">{f.desc}</p>
              <p className="text-[11px] text-[#016050] font-medium">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-16 bg-[#f5f6f8]">
        <div className="max-w-[760px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.1em] mb-3">
              Comment ça marche
            </p>
            <h2
              className="text-[24px] font-bold text-[#111827]"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.01em" }}
            >
              Rejoindre le Club en 3 étapes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+28px)] right-[-50%] h-[1px] bg-[#d1d5db]" />
                )}
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div
                    className="w-10 h-10 rounded-full bg-[#016050] flex items-center justify-center mb-4 flex-shrink-0"
                  >
                    <span className="text-[12px] font-bold text-white">{step.num}</span>
                  </div>
                  <h3
                    className="text-[14px] font-bold text-[#111827] mb-1.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[#6b7280] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-16 bg-white">
        <div
          className="max-w-[640px] mx-auto text-center rounded-[12px] px-8 py-12"
          style={{ background: "#016050" }}
        >
          <h2
            className="text-[24px] sm:text-[28px] font-bold text-white mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.01em" }}
          >
            Prêt·e à rejoindre la communauté ?
          </h2>
          <p className="text-[14px] text-white/70 mb-7 max-w-[360px] mx-auto leading-relaxed">
            Candidatez en 5 minutes. Accès gratuit, examiné sous 48h.
          </p>
          <Link
            href={PRIMARY_CTA_HREF}
            className="inline-flex items-center px-8 py-3 rounded-[6px] text-[14px] font-semibold text-[#016050] bg-white hover:bg-[#f0faf7] transition-colors"
          >
            {PRIMARY_CTA_TEXT}
          </Link>
        </div>
      </section>

      {/* ── Pied de page ─────────────────────────────────────── */}
      <footer className="px-4 sm:px-10 py-5 bg-[#f5f6f8] border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3">
        <a href="https://club.fletchr.fr/dashboard">
          <Image src="/logo.svg" alt="Club ESG" width={110} height={36} />
        </a>
        <p className="text-[12px] text-[#9ca3af]">
          © {new Date().getFullYear()} Fletchr · Ensemble, accélérons la transition RSE
        </p>
        <Link
          href="/connexion"
          className="text-[12px] text-[#016050] font-medium hover:underline"
        >
          Déjà membre ? Se connecter
        </Link>
      </footer>
    </div>
  );
}
