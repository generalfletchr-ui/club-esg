import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PublicNav from "@/components/layout/PublicNav";
import PublicFooter from "@/components/layout/PublicFooter";
import { CHARTER_URL } from "@/lib/constants";

const PRIMARY_CTA_HREF = "/inscription";

export const metadata: Metadata = {
  title: "À propos du Club ESG",
  description:
    "Le concept, les formats et les engagements du Club ESG : webinaires, workshops, afterworks, replays, annuaire et missions entre praticiens. Accès gratuit, sur candidature.",
  openGraph: {
    title: "À propos du Club ESG",
    description:
      "Le concept, les formats et les engagements du Club ESG : webinaires, workshops, afterworks, replays, annuaire et missions entre praticiens.",
    url: "https://club.fletchr.fr/a-propos",
    siteName: "Club ESG",
    locale: "fr_FR",
    type: "website",
  },
};

const FACTS = [
  ["Gratuit", "Aucune cotisation, aucune offre payante"],
  ["Sur candidature", "Chaque profil est examiné sous 48h"],
  ["Entre praticiens", "Consultants, responsables RSE, experts-comptables"],
  ["Fletchr by Imagine Human", "À l'initiative et à l'animation du Club"],
];

const FORMATS = [
  {
    icon: "🎙",
    tag: "Webinaires",
    title: "Douze sessions par an, animées par des praticiens",
    desc: "Une heure, un sujet, un intervenant qui le pratique au quotidien : CSRD, bilan carbone, stratégie RSE, achats responsables, finance durable. Questions en direct, aucun discours commercial.",
    detail: "1h · en visio · questions en direct",
  },
  {
    icon: "🛠",
    tag: "Workshops",
    title: "Des ateliers en petit comité pour passer à la pratique",
    desc: "Format court et participatif : un cas concret, une méthode ou un outil que l'on décortique ensemble. Chacun repart avec quelque chose d'applicable dès le lendemain.",
    detail: "Groupe restreint · format participatif",
  },
  {
    icon: "🥂",
    tag: "Afterworks",
    title: "Se rencontrer pour de vrai, sans badge ni pitch",
    desc: "Des rendez-vous informels pour mettre un visage sur les profils de l'annuaire et prolonger les échanges hors écran.",
    detail: "En présentiel · sur inscription",
  },
  {
    icon: "🎞",
    tag: "Replays",
    title: "Toute la bibliothèque, disponible quand vous voulez",
    desc: "Chaque session est enregistrée et publiée sous 24h. Un webinaire manqué se rattrape à votre rythme, quand votre agenda le permet enfin.",
    detail: "Publié sous 24h · accessible 24/7",
  },
  {
    icon: "📇",
    tag: "Annuaire",
    title: "Trouver le bon interlocuteur en deux clics",
    desc: "Chaque membre dispose d'un profil détaillé : expertises, secteurs couverts, zone géographique, références. Un spécialiste biodiversité en région lyonnaise ? Il est probablement dans l'annuaire.",
    detail: "Filtres par expertise, secteur et zone",
  },
  {
    icon: "🤝",
    tag: "Missions",
    title: "Un espace pour partager et se passer des missions",
    desc: "Deux usages : chercher un binôme pour réaliser une mission à plusieurs, ou céder une mission que vous ne pouvez pas prendre à un autre membre du Club.",
    detail: "Binôme recherché · mission à céder",
  },
  {
    icon: "💬",
    tag: "Échanges",
    title: "Un fil de discussion entre membres",
    desc: "Une question réglementaire, un retour d'expérience, un coup de main sur un dossier : l'espace d'échange permet de solliciter la communauté au quotidien.",
    detail: "Réservé aux membres validés",
  },
  {
    icon: "🎤",
    tag: "Prise de parole",
    title: "Vous pouvez aussi animer une session",
    desc: "Chaque membre peut proposer d'animer un webinaire ou un atelier sur son domaine d'expertise. C'est le meilleur moyen de faire connaître votre pratique auprès de vos pairs.",
    detail: "Proposition ouverte à tous les membres",
  },
];

const PROFILES = [
  {
    title: "Consultants RSE",
    desc: "Indépendants ou en cabinet : rester à jour, comparer les méthodes, trouver des binômes et des missions.",
  },
  {
    title: "Responsables RSE",
    desc: "En entreprise : confronter vos arbitrages à ceux de pairs qui affrontent exactement les mêmes contraintes.",
  },
  {
    title: "Experts-comptables",
    desc: "Intégrer le reporting extra-financier et la CSRD à votre offre, et accompagner vos clients avec les bons réflexes.",
  },
  {
    title: "Et les métiers connexes",
    desc: "Juristes, financiers, formateurs, acheteurs : tout professionnel dont la transition ESG est le quotidien.",
  },
];

const PRINCIPLES = [
  {
    title: "Zéro démarchage",
    desc: "L'annuaire n'est pas un fichier de prospection. Aucun pitch commercial, ni pendant les sessions ni en message privé.",
  },
  {
    title: "Des profils vérifiés",
    desc: "Chaque candidature est examinée manuellement sous 48h. On regarde la réalité du profil, pas la taille du carnet d'adresses.",
  },
  {
    title: "Réciprocité",
    desc: "On vient chercher, mais on vient aussi donner : un retour d'expérience, une réponse, une mise en relation.",
  },
  {
    title: "Confidentialité",
    desc: "Ce qui se dit dans le Club reste dans le Club. Les cas et chiffres partagés ne sortent pas de la communauté.",
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
    desc: "Une équipe vérifie votre profil sous 48h pour garantir la qualité de la communauté.",
  },
  {
    num: "03",
    title: "Vous accédez à tout",
    desc: "Annuaire, replays, agenda des événements, missions et espace d'échange : accès immédiat et complet.",
  },
];

const FAQ = [
  {
    q: "Le Club est-il vraiment gratuit ?",
    a: "Oui. Webinaires, replays, annuaire, événements et espace missions sont inclus, sans cotisation ni offre payante cachée.",
  },
  {
    q: "Qui peut rejoindre le Club ?",
    a: "Tout professionnel dont l'ESG est le métier ou une part significative de l'activité : consultant RSE, responsable RSE en entreprise, expert-comptable, juriste, formateur. La communauté est réservée aux praticiens.",
  },
  {
    q: "Pourquoi faut-il candidater ?",
    a: "Pour garantir la qualité des échanges. Chaque demande est examinée manuellement sous 48h : c'est ce qui permet de maintenir une communauté entre pairs, sans démarchage.",
  },
  {
    q: "Combien de temps faut-il y consacrer ?",
    a: "Ce que vous voulez. Certains membres viennent à un webinaire par mois, d'autres passent uniquement pour les replays ou l'annuaire. Rien n'est obligatoire.",
  },
  {
    q: "Puis-je animer une session ?",
    a: "Oui. Chaque membre peut proposer d'animer un webinaire ou un atelier sur son domaine d'expertise, via un formulaire dans l'espace membre.",
  },
  {
    q: "Qui a pris l'initiative du Club ESG ?",
    a: "Le Club ESG est une initiative de Fletchr by Imagine Human, qui anime la communauté et en assure la modération.",
  },
];

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav active="a-propos" />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate bg-[#016050] px-4 sm:px-10 pt-20 pb-20">
        <Image
          src="/hero-a-propos.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover -z-10"
        />
        {/* Voile vert : garde le texte lisible et l'identité Fletchr par-dessus la photo */}
        <div className="absolute inset-0 -z-10 bg-[#016050]/75" />

        <div className="max-w-[720px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e4f7f3] inline-block opacity-70" />
            <span className="text-white/65 text-[12px] font-medium">
              À propos du Club ESG
            </span>
          </div>

          <h1
            className="text-[34px] sm:text-[48px] font-bold text-white leading-[1.1] mb-5"
            style={{ letterSpacing: "-0.025em" }}
          >
            Un club de praticiens,
            <br />
            <span style={{ color: "#e4f7f3" }}>pas une newsletter de plus</span>
          </h1>

          <p className="text-[16px] sm:text-[17px] text-white/75 max-w-[520px] mx-auto leading-relaxed">
            {
              "Le Club ESG réunit les professionnels de la transition environnementale et sociale pour se former, comparer leurs pratiques et travailler ensemble. Voici comment il fonctionne."
            }
          </p>
        </div>

        <div className="max-w-[880px] mx-auto mt-16 pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-8">
          {FACTS.map(([title, label]) => (
            <div key={title} className="text-center">
              <div
                className="text-[17px] font-bold text-white leading-none mb-2"
                style={{ letterSpacing: "-0.02em" }}
              >
                {title}
              </div>
              <div className="text-[12px] text-white/55 font-medium leading-relaxed">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Le concept ───────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-20 bg-white">
        <div className="max-w-[880px] mx-auto grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-10 sm:gap-14">
          <div>
            <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.12em] mb-4">
              Le concept
            </p>
            <h2
              className="text-[26px] sm:text-[30px] font-bold text-[#142832] leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Pourquoi le Club existe
            </h2>
          </div>

          <div className="flex flex-col gap-5">
            <p className="text-[15px] leading-relaxed" style={{ color: "#374151" }}>
              {
                "La transition ESG avance vite : la réglementation change, les méthodes se stabilisent à peine, et chacun progresse le plus souvent seul dans son coin. Les consultants réinventent des approches que d'autres ont déjà éprouvées. Les responsables RSE arbitrent sans point de comparaison. Les experts-comptables absorbent le reporting extra-financier en plus du reste."
              }
            </p>
            <p className="text-[15px] leading-relaxed" style={{ color: "#374151" }}>
              {
                "Le Club ESG a été créé pour combler ce manque : un endroit où les professionnels de la transition se forment, confrontent leurs pratiques et se rendent service. Ni un salon, ni une place de marché : un club de pairs."
              }
            </p>
            <div className="border-l-2 border-[#016050] pl-5 py-1">
              <p
                className="text-[15px] font-medium leading-relaxed"
                style={{ color: "#142832" }}
              >
                {
                  "On se retrouve chaque mois autour de sujets concrets, tout est enregistré pour ceux qui n'ont pas pu venir, et entre deux sessions l'annuaire et l'espace missions permettent de se trouver et de travailler ensemble."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bandeau ──────────────────────────────────────────── */}
      <div className="bg-[#142832] px-4 py-3.5">
        <div className="max-w-[800px] mx-auto flex flex-wrap justify-center gap-x-10 gap-y-2">
          {[
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

      {/* ── Les formats ──────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-20 bg-[#ebebe6]">
        <div className="max-w-[880px] mx-auto">
          <div className="max-w-[560px] mb-12">
            <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.12em] mb-4">
              Les formats
            </p>
            <h2
              className="text-[26px] sm:text-[32px] font-bold text-[#142832] leading-tight mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              Ce que vous trouvez dans le Club
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "#6b7280" }}>
              {
                "Huit façons d'utiliser le Club, selon le temps dont vous disposez et ce que vous cherchez : monter en compétence, trouver un pair, ou faire avancer une mission."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORMATS.map((f) => (
              <div
                key={f.tag}
                className="bg-white border border-[#e5e7eb] rounded-[10px] p-6 hover:border-[#016050] hover:shadow-[0_4px_20px_rgba(1,96,80,0.08)] transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-[8px] bg-[#e4f7f3] flex items-center justify-center text-[18px] flex-shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.08em]">
                    {f.tag}
                  </span>
                </div>
                <h3
                  className="text-[15px] font-bold text-[#142832] mb-2 leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {f.title}
                </h3>
                <p className="text-[13px] leading-relaxed mb-3" style={{ color: "#6b7280" }}>
                  {f.desc}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#008254] inline-block" />
                  <p className="text-[11px] font-medium" style={{ color: "#008254" }}>
                    {f.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pour qui ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-20 bg-white">
        <div className="max-w-[880px] mx-auto">
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.12em] mb-4">
              Pour qui
            </p>
            <h2
              className="text-[26px] sm:text-[32px] font-bold text-[#142832] leading-tight mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              {"Un club réservé à celles et ceux qui pratiquent"}
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "#6b7280" }}>
              {
                "Le Club rassemble des professionnels en activité sur les sujets ESG, tous secteurs confondus, partout en France."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROFILES.map((p) => (
              <div key={p.title} className="border border-[#e5e7eb] rounded-[10px] p-6">
                <h3
                  className="text-[15px] font-bold text-[#142832] mb-2"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {p.title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#6b7280" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Les engagements ──────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-20 bg-[#142832]">
        <div className="max-w-[880px] mx-auto">
          <div className="max-w-[560px] mb-12">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4"
              style={{ color: "#e4f7f3", opacity: 0.6 }}
            >
              Nos engagements
            </p>
            <h2
              className="text-[26px] sm:text-[32px] font-bold text-white leading-tight mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              {"Les règles qui rendent le Club utile"}
            </h2>
            <p
              className="text-[15px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {
                "Chaque membre signe une charte d'engagement à son arrivée. Elle tient en quatre principes simples, et c'est ce qui protège la qualité des échanges."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mb-12">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="border-t border-white/10 pt-5">
                <h3 className="text-[15px] font-bold text-white mb-2">{p.title}</h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <a
            href={CHARTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[13px] font-medium hover:underline"
            style={{ color: "#e4f7f3" }}
          >
            {"Lire la charte d'engagement des membres (PDF) →"}
          </a>
        </div>
      </section>

      {/* ── Comment rejoindre ────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-20 bg-[#ebebe6]">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.12em] mb-4">
              {"Processus d'adhésion"}
            </p>
            <h2
              className="text-[26px] sm:text-[30px] font-bold text-[#142832]"
              style={{ letterSpacing: "-0.02em" }}
            >
              Rejoindre le Club en 3 étapes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+24px)] right-[-50%] h-px bg-[#bdccd4]" />
                )}
                <div className="w-10 h-10 rounded-full bg-[#016050] flex items-center justify-center mb-4 flex-shrink-0 relative z-10">
                  <span className="text-[11px] font-bold text-white">{step.num}</span>
                </div>
                <h3 className="text-[14px] font-bold text-[#142832] mb-2">{step.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#6b7280" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-20 bg-white">
        <div className="max-w-[720px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold text-[#016050] uppercase tracking-[0.12em] mb-4">
              Questions fréquentes
            </p>
            <h2
              className="text-[26px] sm:text-[30px] font-bold text-[#142832]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {"Ce qu'on nous demande le plus souvent"}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group border border-[#e5e7eb] rounded-[10px] px-6 py-5 hover:border-[#016050] transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-[14px] font-bold text-[#142832]">
                  {item.q}
                  <span className="text-[#016050] text-[16px] font-normal flex-shrink-0 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-[13px] leading-relaxed mt-3" style={{ color: "#6b7280" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section className="px-4 sm:px-10 py-20 bg-[#016050]">
        <div className="max-w-[500px] mx-auto text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-5"
            style={{ color: "#e4f7f3", opacity: 0.7 }}
          >
            Accès gratuit · Sur candidature
          </p>
          <h2
            className="text-[26px] sm:text-[32px] font-bold text-white mb-4 leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            {"Le Club vous ressemble ?"}
          </h2>
          <p
            className="text-[14px] mb-8 leading-relaxed max-w-[380px] mx-auto"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {
              "Candidatez en 5 minutes. L'accès est entièrement gratuit et votre demande est examinée sous 48h."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={PRIMARY_CTA_HREF}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[6px] text-[14px] font-semibold text-[#016050] bg-white hover:bg-[#e4f7f3] transition-colors"
            >
              Rejoindre gratuitement →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[6px] text-[14px] font-medium border border-white/20 text-white/70 hover:bg-white/10 transition-colors"
            >
              {"Retour à l'accueil"}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
