import Link from "next/link";
import Image from "next/image";

const EVENT_ICONS: Record<string, string> = {
  Webinaire: "🎙",
  Afterwork: "🤝",
  Workshop:  "📋",
};

const HERO_STATS = [
  ["40+",  "Membres actifs"],
  ["12",   "Webinaires / an"],
  ["8",    "Replays disponibles"],
  ["3",    "Événements / mois"],
];

const BENEFITS = [
  {
    icon: "🎓",
    title: "Formez-vous en continu",
    desc: "12 webinaires experts par an sur CSRD, bilan carbone, stratégie RSE — animés par des praticiens.",
  },
  {
    icon: "🤝",
    title: "Développez votre réseau",
    desc: "Échangez avec 40+ professionnels ESG triés sur le volet : consultants, responsables RSE, experts-comptables.",
  },
  {
    icon: "📋",
    title: "Accédez aux replays",
    desc: "Retrouvez toutes les sessions passées en vidéo et restez à jour même si vous ne pouvez pas assister en direct.",
  },
  {
    icon: "🌿",
    title: "Partagez en confiance",
    desc: "Une communauté privée avec charte d'engagement : échanges bienveillants, confidentialité respectée.",
  },
];

const PREVIEW_MEMBERS = [
  { photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEs3F0Aw5nYmYFrvk03O3GQdFR2a5GOR-5zg&s", name: "Sophie L.",  role: "Consultante RSE",  tags: ["CSRD", "Stratégie RSE"] },
  { photo: "https://images.generated.photos/A7p_Zekk5uUp-tuD-6vrPEwse0z_cNHDzqbmOnZNVBU/g:no/rs:fill:256:384/czM6Ly9yMi1ncGhvdG9zLXByb2QtaHVtYW4tZ2FsbGVyeS80OTU1LzU0N2U1MGYxLTg0ZjQtNGNhYS1iZTk4LTU2YzIwMjVkMDY1MC0xLmpwZw.jpg", name: "Marc K.",    role: "Responsable RSE",  tags: ["Bilan carbone"] },
  { photo: "https://images.generated.photos/8NOXTi9siuCx9xwsGkurQ-QPloebtZkZ9imYD35znbc/g:no/rs:fill:256:384/czM6Ly9ncGhvdG9zLXByb2QtaHVtYW4tZ2FsbGVyeS80NzY4LzhkZTI3ZjA2LWEzMjUtNDQyOC04MWY3LThlM2EzMGY5ZjAyYy0xLmpwZw.jpg", name: "Aïcha B.",   role: "Expert-comptable", tags: ["Finance durable"] },
  { photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJuv-hx6x9XGmis-zfl5VcLE6jfb1e99k5iw&s", name: "Rémi P.",    role: "Consultant RSE",   tags: ["Audit & Certif."] },
];

const PREVIEW_EVENTS = [
  { type: "Webinaire", title: "CSRD : comment se préparer ?",  date: "3 juin 2026 · 12h00" },
  { type: "Afterwork", title: "Networking ESG Paris",           date: "10 septembre 2026 · 18h30" },
  { type: "Workshop",  title: "Bilan carbone pratique",         date: "24 septembre 2026 · 14h00" },
];


const PRIMARY_CTA_HREF = "/inscription";
const PRIMARY_CTA_TEXT = "Rejoindre gratuitement →";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-[Inter,sans-serif]">

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-4 sm:px-10 py-3 flex items-center justify-between gap-3">
        <a href="https://club.fletchr.fr/dashboard">
          <Image src="/logo.svg" alt="Club ESG" width={130} height={43} priority />
        </a>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href="/connexion"
            className="hidden sm:inline-flex px-[14px] py-[9px] rounded-[6px] text-[13px] font-semibold text-[#374151] bg-white border border-[#e5e7eb] hover:bg-[#f5f6f8] transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href={PRIMARY_CTA_HREF}
            className="inline-flex px-[14px] py-[9px] rounded-[6px] text-[13px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors whitespace-nowrap"
          >
            Rejoindre le Club
          </Link>
        </div>
      </nav>

      {/* ── Héro ────────────────────────────────────────────── */}
      <section
        className="px-4 sm:px-10 pt-20 pb-16 text-center"
        style={{ background: "linear-gradient(135deg,#0a2a4a 0%,#1a4a6a 60%,#0a3a3a 100%)" }}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[rgba(0,180,180,0.15)] border border-[rgba(0,180,180,0.3)] rounded-[20px] px-[14px] py-1 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#016050] inline-block" />
          <span className="text-[#016050] text-[12px] font-semibold">
            Communauté privée · Accès 100% gratuit
          </span>
        </div>

        {/* Titre */}
        <h1
          className="text-[28px] sm:text-[36px] font-bold text-white leading-tight max-w-[600px] mx-auto mb-4"
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        >
          Le réseau privé des{" "}
          <span className="text-[#016050]">experts ESG</span>{" "}
          qui font avancer la transition RSE
        </h1>

        <p className="text-[15px] text-white/80 max-w-[460px] mx-auto mb-8 leading-relaxed">
          Webinaires experts, replays, networking et entraide — rejoignez les
          professionnels ESG les plus engagés de France.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href={PRIMARY_CTA_HREF}
            className="inline-flex px-6 py-[11px] rounded-[6px] text-[14px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors"
          >
            {PRIMARY_CTA_TEXT}
          </Link>
          <Link
            href="/connexion"
            className="inline-flex px-6 py-[11px] rounded-[6px] text-[14px] font-semibold border border-white/30 text-white/80 bg-transparent hover:bg-white/10 transition-colors"
          >
            Déjà membre ? Se connecter
          </Link>
        </div>

        {/* Statistiques */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-10 mt-12 pt-8 border-t border-white/10">
          {HERO_STATS.map(([num, label]) => (
            <div key={label} className="text-center min-w-[80px]">
              <div className="text-[24px] font-bold text-[#016050]">{num}</div>
              <div className="text-[12px] text-white/70 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bénéfices ────────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-14 bg-white">
        <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.08em] text-center mb-2">
          Ce que vous obtenez
        </p>
        <h2
          className="text-[22px] font-bold text-[#111827] text-center mb-10"
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        >
          Tout ce dont vous avez besoin pour progresser en ESG
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[960px] mx-auto">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-[#f5f6f8] border border-[#e5e7eb] rounded-[8px] p-5"
            >
              <span className="text-[24px] mb-3 block">{b.icon}</span>
              <p className="text-[14px] font-semibold text-[#111827] mb-1.5">{b.title}</p>
              <p className="text-[13px] text-[#6b7280] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Membres ──────────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-14 bg-[#f5f6f8]">
        <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.08em] text-center mb-2">
          La communauté
        </p>
        <h2
          className="text-[20px] font-bold text-[#111827] mb-8 text-center"
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        >
          Quelques membres de la communauté
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[840px] mx-auto">
          {PREVIEW_MEMBERS.map((m) => (
            <div
              key={m.name}
              className="bg-white border border-[#e5e7eb] rounded-[8px] p-4 text-center"
            >
              <Image
                src={m.photo}
                alt={m.name}
                width={44}
                height={44}
                className="rounded-full object-cover mx-auto"
                unoptimized
              />
              <p className="text-[13px] font-semibold text-[#111827] mt-2 mb-0.5">{m.name}</p>
              <p className="text-[12px] text-[#6b7280] mb-2">{m.role}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {m.tags.map((t) => (
                  <span
                    key={t}
                    className="px-[8px] py-[2px] rounded-[20px] bg-[#f5f6f8] text-[#6b7280] text-[11px] font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Événements ───────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-14 bg-white">
        <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.08em] text-center mb-2">
          Agenda
        </p>
        <h2
          className="text-[20px] font-bold text-[#111827] mb-8 text-center"
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        >
          Prochains événements
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-[900px] mx-auto">
          {PREVIEW_EVENTS.map((ev) => (
            <div
              key={ev.title}
              className="bg-white border border-[#e5e7eb] rounded-[8px] p-5 flex-1 min-w-0"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{EVENT_ICONS[ev.type]}</span>
                <span className="px-[10px] py-[2px] rounded-[20px] bg-[#e6f2ef] text-[#016050] text-[11px] font-semibold">
                  {ev.type}
                </span>
              </div>
              <p className="text-[14px] font-semibold text-[#111827] mb-1">{ev.title}</p>
              <p className="text-[12px] text-[#6b7280] mb-4">{ev.date}</p>
              <Link
                href={PRIMARY_CTA_HREF}
                className="inline-flex px-4 py-2 rounded-[6px] text-[12px] font-semibold text-white bg-[#016050] hover:bg-[#014d40] transition-colors"
              >
                S&apos;inscrire →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-14 bg-[#0a2a4a] text-center">
        <p
          className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.08em] mb-3"
        >
          Accès gratuit · Sur invitation
        </p>
        <h2
          className="text-[24px] font-bold text-white mb-3"
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        >
          Prêt·e à rejoindre la communauté ?
        </h2>
        <p className="text-[14px] text-white/70 mb-6 max-w-[400px] mx-auto">
          Votre demande est examinée sous 48h. L&apos;accès est entièrement gratuit.
        </p>
        <Link
          href={PRIMARY_CTA_HREF}
          className="inline-flex px-8 py-[12px] bg-[#016050] rounded-[6px] text-[14px] font-bold text-white hover:bg-[#014d40] transition-colors"
        >
          {PRIMARY_CTA_TEXT}
        </Link>
      </section>

      {/* ── Pied de page ─────────────────────────────────────── */}
      <footer className="px-4 sm:px-10 py-5 bg-white border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3">
        <a href="https://club.fletchr.fr/dashboard">
          <Image src="/logo.svg" alt="Club ESG" width={110} height={36} />
        </a>
        <p className="text-[12px] text-[#6b7280]">
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
