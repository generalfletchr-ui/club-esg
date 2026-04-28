import Link from "next/link";
import Image from "next/image";
import { WHATSAPP_LINK } from "@/lib/constants";

/* Icône type événement */
const EVENT_ICONS: Record<string, string> = {
  Webinaire: "🎙",
  Afterwork: "🤝",
  Workshop:  "📋",
};

/* Statistiques héro */
const HERO_STATS = [
  ["40+",  "Membres"],
  ["12",   "Webinaires"],
  ["8",    "Replays"],
  ["3",    "Events / mois"],
];

/* Membres de preview */
const PREVIEW_MEMBERS = [
  { initials: "SL", name: "Sophie L.",  role: "Consultante RSE",  tags: ["CSRD", "Stratégie RSE"] },
  { initials: "MK", name: "Marc K.",    role: "Responsable RSE",  tags: ["Bilan carbone"] },
  { initials: "AB", name: "Aïcha B.",   role: "Expert-comptable", tags: ["Finance durable"] },
  { initials: "RP", name: "Rémi P.",    role: "Consultant RSE",   tags: ["Audit & Certif."] },
];

/* Événements de preview */
const PREVIEW_EVENTS = [
  { type: "Webinaire", title: "CSRD : comment se préparer ?",          date: "12 mai 2026 · 12h00" },
  { type: "Afterwork", title: "Networking ESG Paris",                   date: "20 mai 2026 · 18h30" },
  { type: "Workshop",  title: "Bilan carbone pratique",                 date: "3 juin 2026 · 14h00" },
];

/* Couleurs avatars déterministes */
const AVATAR_COLORS = ["#00B4B4", "#1A365D", "#7c6ea0", "#e07040"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-[Inter,sans-serif]">

      {/* ── Barre de navigation ──────────────────────────────── */}
      <nav className="sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-10 py-3 flex items-center justify-between">
        <Image src="/logo.svg" alt="Club ESG" width={140} height={46} priority />
        <div className="flex gap-2">
          <Link
            href="/connexion"
            className="px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-[#374151] bg-white border border-[#e5e7eb] hover:bg-[#f5f6f8] transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/inscription"
            className="px-[14px] py-[7px] rounded-[6px] text-[12px] font-semibold text-white bg-[#00B4B4] hover:bg-[#009898] transition-colors"
          >
            Rejoindre le Club
          </Link>
        </div>
      </nav>

      {/* ── Section héro ─────────────────────────────────────── */}
      <section
        className="px-10 pt-14 pb-11 text-center"
        style={{ background: "linear-gradient(135deg,#0a2a4a 0%,#1a4a6a 60%,#0a3a3a 100%)" }}
      >
        {/* Badge communauté privée */}
        <div className="inline-flex items-center gap-1.5 bg-[rgba(0,180,180,0.15)] border border-[rgba(0,180,180,0.3)] rounded-[20px] px-[14px] py-1 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B4B4] inline-block" />
          <span className="text-[#00B4B4] text-[12px] font-semibold">
            Communauté privée · 40+ professionnels
          </span>
        </div>

        {/* Titre */}
        <h1
          className="text-[32px] font-bold text-white leading-tight max-w-[560px] mx-auto mb-4"
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        >
          La communauté des{" "}
          <span className="text-[#00B4B4]">professionnels ESG</span> engagés
        </h1>

        <p className="text-[14px] text-white/65 max-w-[440px] mx-auto mb-7 leading-relaxed">
          Échangez, formez-vous et développez votre réseau avec des experts-comptables,
          consultants RSE et responsables ESG.
        </p>

        <div className="flex gap-2.5 justify-center">
          <Link
            href="/inscription"
            className="px-[20px] py-[9px] rounded-[6px] text-[13px] font-semibold text-white bg-[#00B4B4] hover:bg-[#009898] transition-colors"
          >
            Demander l&apos;accès
          </Link>
          <Link
            href="/connexion"
            className="px-[20px] py-[9px] rounded-[6px] text-[13px] font-semibold border border-white/25 text-white/70 bg-transparent hover:bg-white/10 transition-colors"
          >
            Déjà membre ?
          </Link>
        </div>

        {/* Statistiques */}
        <div className="flex justify-center gap-10 mt-9 pt-7 border-t border-white/10">
          {HERO_STATS.map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-[22px] font-bold text-[#00B4B4]">{num}</div>
              <div className="text-[11px] text-white/45 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Membres en avant-première ─────────────────────────── */}
      <section className="px-10 py-7 bg-[#f5f6f8]">
        <h3 className="text-[15px] font-bold text-[#111827] mb-4 text-center">
          Quelques membres de la communauté
        </h3>
        <div className="flex gap-2.5 justify-center flex-wrap">
          {PREVIEW_MEMBERS.map((m, i) => (
            <div
              key={m.name}
              className="bg-white border border-[#e5e7eb] rounded-[8px] p-4 w-[190px] text-center"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto text-white text-[14px] font-semibold"
                style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
              >
                {m.initials}
              </div>
              <p className="text-[13px] font-semibold text-[#111827] mt-2 mb-0.5">{m.name}</p>
              <p className="text-[11px] text-[#6b7280] mb-2">{m.role}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {m.tags.map((t) => (
                  <span
                    key={t}
                    className="px-[8px] py-[2px] rounded-[20px] bg-[#f5f6f8] text-[#6b7280] text-[10px] font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Prochains événements ──────────────────────────────── */}
      <section className="px-10 py-7 bg-white">
        <h3 className="text-[15px] font-bold text-[#111827] mb-4 text-center">
          Prochains événements
        </h3>
        <div className="flex gap-2.5 justify-center flex-wrap">
          {PREVIEW_EVENTS.map((ev) => (
            <div
              key={ev.title}
              className="bg-white border border-[#e5e7eb] rounded-[8px] p-4 flex-1 min-w-[220px] max-w-[280px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{EVENT_ICONS[ev.type]}</span>
                <span className="px-[10px] py-[2px] rounded-[20px] bg-[#e6f7f7] text-[#00B4B4] text-[11px] font-semibold">
                  {ev.type}
                </span>
              </div>
              <p className="text-[13px] font-semibold text-[#111827] mb-1">{ev.title}</p>
              <p className="text-[11px] text-[#6b7280] mb-3">{ev.date}</p>
              <Link
                href="/inscription"
                className="inline-flex px-3 py-1.5 rounded-[6px] text-[11px] font-semibold text-white bg-[#00B4B4] hover:bg-[#009898] transition-colors"
              >
                S&apos;inscrire
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section className="px-10 py-8 bg-[#00B4B4] text-center">
        <p className="text-[16px] font-bold text-white mb-3">
          Prêt·e à rejoindre la communauté ?
        </p>
        <Link
          href="/inscription"
          className="inline-block px-6 py-[9px] bg-white rounded-[6px] text-[13px] font-bold text-[#00B4B4] hover:opacity-90 transition-opacity"
        >
          Demander l&apos;accès gratuit →
        </Link>
      </section>

      {/* ── Pied de page ─────────────────────────────────────── */}
      <footer className="px-10 py-5 bg-white border-t border-[#e5e7eb] flex items-center justify-between">
        <Image src="/logo.svg" alt="Club ESG" width={110} height={36} />
        <p className="text-[11px] text-[#9ca3af]">
          © {new Date().getFullYear()} Fletchr · Ensemble, accélérons la transition RSE
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-[#16a34a] font-medium hover:underline"
        >
          💬 Rejoindre WhatsApp
        </a>
      </footer>
    </div>
  );
}
