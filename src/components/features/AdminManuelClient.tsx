"use client";

const TOC = [
  { id: "apercu",      label: "1. Vue d'ensemble" },
  { id: "demandes",    label: "2. Demandes d'adhésion" },
  { id: "membres",     label: "3. Gestion des membres" },
  { id: "missions",    label: "4. Modération des missions" },
  { id: "evenements",  label: "5. Gestion des événements" },
  { id: "replays",     label: "6. Gestion des replays" },
  { id: "export",      label: "7. Export CSV / HubSpot" },
  { id: "experience",  label: "8. Expérience des membres" },
  { id: "emails",      label: "9. Emails automatiques" },
  { id: "faq",         label: "10. Questions fréquentes" },
];

function H2({ id, icon, children }: { id: string; icon: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-2 text-[22px] font-bold text-[#0f2830] mt-12 mb-5 scroll-mt-8">
      <span className="text-[20px]">{icon}</span>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[16px] font-semibold text-[#1a3a44] mt-6 mb-2">{children}</h3>;
}

function Note({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "green" | "orange" | "red" }) {
  const styles: Record<string, string> = {
    blue:   "bg-[#eff8ff] border-[#93c5fd] text-[#1e40af]",
    green:  "bg-[#f0fdf4] border-[#86efac] text-[#166534]",
    orange: "bg-[#fff7ed] border-[#fdba74] text-[#9a3412]",
    red:    "bg-[#fef2f2] border-[#fca5a5] text-[#991b1b]",
  };
  return (
    <div className={`border-l-4 rounded-r-lg px-4 py-3 my-4 text-[14px] leading-relaxed ${styles[color]}`}>
      {children}
    </div>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="list-none space-y-2 my-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[14px] text-[#374151]">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00b4b4] text-white text-[12px] font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Bullet({ items }: { items: string[] }) {
  return (
    <ul className="list-none space-y-1.5 my-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-[14px] text-[#374151]">
          <span className="text-[#00b4b4] mt-0.5 flex-shrink-0">▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="bg-[#f1f5f9]">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-3 py-2.5 font-semibold text-[#374151] border border-[#e2e8f0]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2.5 border border-[#e2e8f0] text-[#4b5563] leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[12px] font-semibold ${color}`}>
      {children}
    </span>
  );
}

export default function AdminManuelClient() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* En-tête */}
      <div className="bg-white border-b border-[#e2e8f0] px-8 py-6">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-[12px] font-semibold text-[#00b4b4] uppercase tracking-wider mb-1">
            Réservé aux administrateurs
          </p>
          <h1 className="text-[28px] font-bold text-[#0f2830]">
            Manuel d&apos;utilisation — Club ESG
          </h1>
          <p className="text-[15px] text-[#6b7280] mt-1">
            Guide complet de la plateforme à l&apos;usage des administrateurs. Toutes les fonctionnalités, étape par étape.
          </p>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-8 py-8 flex gap-10">

        {/* Sommaire latéral sticky */}
        <aside className="hidden lg:block flex-shrink-0 w-[210px]">
          <div className="sticky top-8 bg-white border border-[#e2e8f0] rounded-xl p-4">
            <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-3">
              Sommaire
            </p>
            <nav className="space-y-0.5">
              {TOC.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-[13px] text-[#4b5563] hover:text-[#00b4b4] hover:bg-[#f0fdf9] px-2 py-1.5 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Corps du manuel */}
        <main className="flex-1 min-w-0">

          {/* ─────────────────────────────────────────────
              1. VUE D'ENSEMBLE
          ───────────────────────────────────────────── */}
          <section id="apercu">
            <H2 id="apercu" icon="◈">1. Vue d&apos;ensemble de la plateforme</H2>

            <p className="text-[14px] text-[#374151] leading-relaxed mb-4">
              Club ESG est une plateforme communautaire privée réservée aux professionnels de la RSE et de la comptabilité engagée. Elle permet aux membres de se retrouver, de partager des opportunités (missions), de suivre des webinaires et de construire un réseau de confiance.
            </p>

            <p className="text-[14px] text-[#374151] leading-relaxed mb-4">
              En tant qu&apos;administrateur, vous êtes le garant de la qualité de la communauté. Vous validez les nouvelles adhésions, modérez le contenu publié, et gérez les événements et ressources disponibles aux membres.
            </p>

            <H3>Les deux espaces de navigation</H3>
            <p className="text-[14px] text-[#374151] mb-3">Dans la barre latérale gauche, vous voyez deux sections :</p>
            <Bullet items={[
              "Section « Admin » (en haut) : accès aux outils d'administration — visibles uniquement par vous.",
              "Section « Membre » (en bas) : accès aux mêmes pages que tous les membres — pour voir la plateforme comme ils la voient.",
            ]} />

            <H3>Les 6 outils d&apos;administration</H3>
            <Table
              headers={["Outil", "Accès rapide", "À quoi ça sert ?"]}
              rows={[
                ["Demandes", "/admin/demandes", "Valider ou refuser les nouvelles inscriptions"],
                ["Membres", "/admin/membres", "Consulter et gérer tous les membres actifs"],
                ["Missions", "/admin/missions", "Approuver ou refuser les missions publiées"],
                ["Événements", "/admin/evenements", "Créer et gérer les webinaires, afterworks, workshops"],
                ["Replays", "/admin/replays", "Gérer la bibliothèque de sessions enregistrées"],
                ["Export CSV", "/admin/export-csv", "Télécharger la liste des membres (pour HubSpot)"],
              ]}
            />

            <Note color="blue">
              <strong>Accès réservé :</strong> si quelqu&apos;un qui n&apos;est pas admin essaie d&apos;accéder à une page d&apos;administration, il est automatiquement redirigé vers son tableau de bord. Aucune donnée sensible n&apos;est accessible aux membres ordinaires.
            </Note>
          </section>

          {/* ─────────────────────────────────────────────
              2. DEMANDES D'ADHÉSION
          ───────────────────────────────────────────── */}
          <section id="demandes">
            <H2 id="demandes" icon="⏳">2. Demandes d&apos;adhésion</H2>

            <p className="text-[14px] text-[#374151] leading-relaxed mb-4">
              Quand une personne s&apos;inscrit sur la plateforme, elle passe d&apos;abord par une phase de validation. Elle voit une page d&apos;attente et ne peut rien faire tant que vous n&apos;avez pas statué sur sa demande. Vous recevez un email automatique à chaque nouvelle inscription.
            </p>

            <H3>Accéder aux demandes</H3>
            <Steps items={[
              "Cliquez sur « Demandes » dans la section Admin de la sidebar.",
              "La page s'ouvre sur trois onglets : « En attente », « Validés », « Refusés ».",
              "Commencez par l'onglet « En attente » pour traiter les nouvelles inscriptions.",
            ]} />

            <H3>Informations disponibles sur chaque candidat</H3>
            <Bullet items={[
              "Nom, prénom, email et téléphone",
              "Type de profil : Expert-comptable, Consultant RSE, Responsable RSE, ou Autre",
              "Fonction et entreprise",
              "Secteur d'activité et taille d'entreprise",
              "Ville et zone géographique",
              "Biographie (présentation libre, max 500 caractères)",
              "Expertises sélectionnées (jusqu'à 15 domaines)",
              "Date d'inscription",
            ]} />

            <H3>Valider une demande</H3>
            <Steps items={[
              "Lisez attentivement le profil du candidat.",
              "Cliquez sur le bouton vert « Valider ».",
              "La plateforme envoie automatiquement un email de bienvenue au nouveau membre avec un lien de connexion.",
              "Le membre apparaît désormais dans l'annuaire et a accès à toutes les fonctionnalités.",
            ]} />
            <Note color="green">
              <strong>Email envoyé automatiquement :</strong> le nouveau membre reçoit un email l&apos;informant que sa demande a été acceptée, avec un lien pour se connecter. Vous n&apos;avez rien à faire manuellement.
            </Note>

            <H3>Refuser une demande</H3>
            <Steps items={[
              "Cliquez sur le bouton rouge « Refuser ».",
              "Un email de refus est envoyé automatiquement au candidat.",
              "La demande est archivée dans l'onglet « Refusés ».",
            ]} />
            <Note color="orange">
              <strong>Délai recommandé :</strong> traitez les demandes dans les 48 heures. Les candidats voient une page d&apos;attente qui leur indique que leur dossier est en cours d&apos;examen et qu&apos;ils seront contactés rapidement.
            </Note>
          </section>

          {/* ─────────────────────────────────────────────
              3. GESTION DES MEMBRES
          ───────────────────────────────────────────── */}
          <section id="membres">
            <H2 id="membres" icon="≡">3. Gestion des membres</H2>

            <p className="text-[14px] text-[#374151] leading-relaxed mb-4">
              Cette page liste tous les comptes existants sur la plateforme, quel que soit leur statut. Vous pouvez rechercher un membre, consulter ses informations complètes, et modifier son accès.
            </p>

            <H3>Rechercher et filtrer</H3>
            <Bullet items={[
              "Utilisez la barre de recherche pour trouver un membre par nom, email ou entreprise.",
              "Filtrez par statut : Actif (approved) / En attente (pending) / Suspendu (rejected).",
              "Filtrez par rôle : Membre / Admin.",
            ]} />

            <H3>Statuts et rôles expliqués</H3>
            <div className="my-4 space-y-2 text-[14px] text-[#374151]">
              <p className="font-semibold text-[#0f2830]">Statuts (détermine l&apos;accès à la plateforme) :</p>
              <div className="flex items-start gap-2"><Badge color="bg-amber-100 text-amber-800">En attente</Badge><span className="mt-0.5"> — inscription reçue, pas encore traitée. Le membre ne peut pas accéder au contenu.</span></div>
              <div className="flex items-start gap-2"><Badge color="bg-green-100 text-green-800">Actif</Badge><span className="mt-0.5"> — membre validé, accès complet à la plateforme.</span></div>
              <div className="flex items-start gap-2"><Badge color="bg-red-100 text-red-800">Suspendu</Badge><span className="mt-0.5"> — accès retiré (refus initial ou suspension ultérieure). Le compte existe mais ne peut pas se connecter.</span></div>
            </div>
            <div className="my-4 space-y-2 text-[14px] text-[#374151]">
              <p className="font-semibold text-[#0f2830]">Rôles (détermine les permissions) :</p>
              <div className="flex items-start gap-2"><Badge color="bg-blue-100 text-blue-800">Membre</Badge><span className="mt-0.5"> — accès standard aux fonctionnalités communautaires.</span></div>
              <div className="flex items-start gap-2"><Badge color="bg-purple-100 text-purple-800">Admin</Badge><span className="mt-0.5"> — accès à toutes les pages d&apos;administration en plus des fonctionnalités membres.</span></div>
            </div>

            <H3>Promouvoir un membre en administrateur</H3>
            <Steps items={[
              "Trouvez le membre dans la liste.",
              "Cliquez sur le bouton « Promouvoir en admin ».",
              "Une confirmation est demandée — validez pour confirmer.",
              "Le membre voit désormais la section Admin dans sa barre latérale.",
            ]} />
            <Note color="red">
              <strong>Action sensible :</strong> un administrateur a accès à toutes les données de la plateforme (profils complets, SIRET, emails, etc.) et peut modifier ou supprimer n&apos;importe quel contenu. Ne promouvez que des personnes de confiance.
            </Note>

            <H3>Suspendre un membre</H3>
            <Steps items={[
              "Cliquez sur le bouton « Suspendre » à côté du membre concerné.",
              "Confirmez l'action dans la fenêtre de confirmation.",
              "Le membre perd immédiatement l'accès à la plateforme.",
              "Son compte et ses données restent conservés — l'action est réversible.",
            ]} />
            <Note color="orange">
              La suspension n&apos;efface pas les données du membre ni ses missions publiées. Elle bloque uniquement l&apos;accès à la plateforme. Vous pouvez réactiver le compte ultérieurement depuis cette même page.
            </Note>

            <H3>Consulter la fiche d&apos;un membre</H3>
            <p className="text-[14px] text-[#374151]">
              Cliquez sur le nom d&apos;un membre pour accéder à sa fiche complète dans l&apos;annuaire. Vous y voyez toutes ses informations, y compris son SIRET et ses coordonnées, qui sont masquées pour les autres membres.
            </p>
          </section>

          {/* ─────────────────────────────────────────────
              4. MODÉRATION DES MISSIONS
          ───────────────────────────────────────────── */}
          <section id="missions">
            <H2 id="missions" icon="◈">4. Modération des missions</H2>

            <p className="text-[14px] text-[#374151] leading-relaxed mb-4">
              Les membres peuvent publier des annonces de missions sur la plateforme. Avant d&apos;être visibles par tous, ces annonces passent par une validation administrative. Vous recevez un email à chaque nouvelle mission soumise.
            </p>

            <H3>Les deux types de missions</H3>
            <Bullet items={[
              "Binôme (◈) : le membre cherche un partenaire pour travailler ensemble sur une mission client.",
              "Cession (▸) : le membre souhaite céder une mission à un autre professionnel (il ne peut pas la prendre).",
            ]} />

            <H3>Cycle de vie d&apos;une mission</H3>
            <div className="flex items-center gap-2 flex-wrap my-4 text-[13px]">
              <Badge color="bg-amber-100 text-amber-800">En attente</Badge>
              <span className="text-[#9ca3af]">→</span>
              <Badge color="bg-green-100 text-green-800">Publiée</Badge>
              <span className="text-[#9ca3af]">ou</span>
              <Badge color="bg-red-100 text-red-800">Refusée</Badge>
              <span className="text-[#9ca3af]">→</span>
              <Badge color="bg-blue-100 text-blue-800">Pourvue</Badge>
              <span className="text-[#9ca3af]">ou</span>
              <Badge color="bg-gray-100 text-gray-600">Expirée</Badge>
            </div>
            <Bullet items={[
              "En attente : soumise par le membre, non encore visible.",
              "Publiée : approuvée par l'admin, visible dans le tableau des missions.",
              "Refusée : non approuvée, le membre peut corriger et resoumettre.",
              "Pourvue : le membre a marqué la mission comme trouvée/complétée.",
              "Expirée : 30 jours après publication sans action — masquée automatiquement.",
            ]} />

            <H3>Valider une mission</H3>
            <Steps items={[
              "Rendez-vous dans Admin > Missions, onglet « En attente ».",
              "Lisez le titre, la description, le type et les informations pratiques.",
              "Vérifiez que la mission est professionnelle et pertinente pour la communauté ESG.",
              "Cliquez sur « Publier ».",
              "La mission est immédiatement visible pour tous les membres.",
              "Le membre reçoit un email de confirmation.",
            ]} />
            <Note color="green">
              La validation ne prend que quelques secondes. L&apos;idéal est de traiter les missions dans les 24h pour maintenir la dynamique de la communauté.
            </Note>

            <H3>Refuser une mission</H3>
            <Steps items={[
              "Cliquez sur « Refuser ».",
              "Le membre reçoit un email lui indiquant que sa mission n'a pas été acceptée, avec une invitation à corriger et resoumettre.",
              "La mission passe dans l'onglet « Refusées ».",
            ]} />
            <Note color="orange">
              <strong>Pourquoi refuser ?</strong> Description trop vague, mission hors sujet RSE/comptabilité, coordonnées directes dans le texte (mettant en court-circuit la plateforme), ou contenu inapproprié.
            </Note>

            <H3>Informations visibles sur une mission</H3>
            <Bullet items={[
              "Type (binôme ou cession) et titre",
              "Description détaillée",
              "Domaine ESG : Environnement, Social, Gouvernance ou Multi",
              "Secteur du client, type de prestation, durée estimée",
              "Modalité (présentiel / distanciel / hybride) et localisation",
              "Budget indicatif",
              "Expertises requises",
              "Date d'expiration",
              "Profil du membre posteur (nom, entreprise, expertises)",
            ]} />
          </section>

          {/* ─────────────────────────────────────────────
              5. GESTION DES ÉVÉNEMENTS
          ───────────────────────────────────────────── */}
          <section id="evenements">
            <H2 id="evenements" icon="✦">5. Gestion des événements</H2>

            <p className="text-[14px] text-[#374151] leading-relaxed mb-4">
              Vous gérez le calendrier des événements de la communauté. Tout événement créé ici apparaît instantanément dans la page Agenda des membres. Les membres reçoivent un lien d&apos;inscription directement depuis la plateforme.
            </p>

            <H3>Les trois types d&apos;événements</H3>
            <Bullet items={[
              "🎙 Webinaire : session en ligne avec un ou plusieurs intervenants, enregistrée et ajoutée aux Replays ensuite.",
              "🤝 Afterwork : rencontre informelle, généralement en présentiel.",
              "📋 Workshop : atelier pratique, en ligne ou en présentiel.",
            ]} />

            <H3>Créer un nouvel événement</H3>
            <Steps items={[
              "Rendez-vous dans Admin > Événements.",
              "Cliquez sur le bouton « + Créer un événement ».",
              "Remplissez les champs obligatoires : titre, date et heure, type, description.",
              "Ajoutez le lien d'inscription externe (StreamYard, Eventbrite, Zoom, etc.).",
              "Optionnel : ajoutez une image de couverture, les noms des intervenants, et l'adresse si événement présentiel.",
              "Cliquez sur « Enregistrer ».",
              "L'événement apparaît immédiatement dans la page Agenda des membres.",
            ]} />
            <Note color="blue">
              <strong>Format de la date :</strong> saisissez la date ET l&apos;heure. Les événements passés sont automatiquement masqués de l&apos;agenda des membres, mais restent visibles dans votre interface admin.
            </Note>

            <H3>Modifier un événement</H3>
            <Steps items={[
              "Cliquez sur l'événement dans la liste.",
              "Modifiez les informations directement dans le formulaire inline.",
              "Cliquez sur « Enregistrer » pour appliquer les modifications.",
            ]} />

            <H3>Supprimer un événement</H3>
            <Steps items={[
              "Cliquez sur l'icône de suppression à côté de l'événement.",
              "Confirmez la suppression dans la fenêtre de confirmation.",
            ]} />
            <Note color="red">
              <strong>Action irréversible :</strong> la suppression d&apos;un événement est définitive. Si des membres avaient ce lien en favori, ils ne retrouveront plus la page. Préférez modifier les informations plutôt que de supprimer.
            </Note>

            <H3>Champs disponibles pour un événement</H3>
            <Table
              headers={["Champ", "Obligatoire", "Description"]}
              rows={[
                ["Titre", "Oui", "Nom de l'événement affiché aux membres"],
                ["Date et heure", "Oui", "Date + heure de début de l'événement"],
                ["Type", "Oui", "Webinaire, Afterwork ou Workshop"],
                ["Description", "Oui", "Présentation de l'événement (contenu, objectifs, public visé)"],
                ["Lien d'inscription", "Oui", "URL vers la page d'inscription externe"],
                ["Image", "Non", "Visuel de couverture (JPG/PNG)"],
                ["Intervenants", "Non", "Noms des speakers ou animateurs"],
                ["Adresse", "Non", "Lieu pour les événements en présentiel"],
              ]}
            />
          </section>

          {/* ─────────────────────────────────────────────
              6. GESTION DES REPLAYS
          ───────────────────────────────────────────── */}
          <section id="replays">
            <H2 id="replays" icon="▤">6. Gestion des replays</H2>

            <p className="text-[14px] text-[#374151] leading-relaxed mb-4">
              Après chaque webinaire ou atelier enregistré, vous pouvez ajouter le replay dans la bibliothèque. Les membres accèdent aux enregistrements depuis la page Replays, à tout moment.
            </p>

            <H3>Ajouter un nouveau replay</H3>
            <Steps items={[
              "Rendez-vous dans Admin > Replays.",
              "Cliquez sur « + Ajouter un replay ».",
              "Renseignez le titre, la date de l'événement original, le type (Webinaire / Afterwork / Workshop).",
              "Collez le lien vers l'enregistrement (lien HubSpot, Vimeo, YouTube, etc.).",
              "Ajoutez une description et, si disponible, le nom des intervenants.",
              "Optionnel : ajoutez une image de couverture.",
              "Cliquez sur « Enregistrer ».",
            ]} />
            <Note color="blue">
              Le lien replay pointe généralement vers la page HubSpot où l&apos;enregistrement est hébergé. Assurez-vous que le lien est bien accessible avant de le publier.
            </Note>

            <H3>Modifier ou supprimer un replay</H3>
            <Bullet items={[
              "Cliquez sur le replay dans la liste pour l'éditer.",
              "Modifiez les champs souhaités et enregistrez.",
              "Pour supprimer, cliquez sur l'icône de suppression et confirmez.",
            ]} />

            <H3>Champs disponibles pour un replay</H3>
            <Table
              headers={["Champ", "Obligatoire", "Description"]}
              rows={[
                ["Titre", "Oui", "Nom du replay affiché dans la bibliothèque"],
                ["Date de l'événement", "Oui", "Date à laquelle l'événement a eu lieu (pas la date d'ajout du replay)"],
                ["Type", "Oui", "Webinaire, Afterwork ou Workshop"],
                ["Description", "Oui", "Résumé du contenu et des points clés abordés"],
                ["Lien replay", "Oui", "URL vers l'enregistrement complet"],
                ["Intervenants", "Non", "Nom(s) du ou des speakers"],
                ["Image", "Non", "Visuel de couverture (JPG/PNG)"],
              ]}
            />
          </section>

          {/* ─────────────────────────────────────────────
              7. EXPORT CSV / HUBSPOT
          ───────────────────────────────────────────── */}
          <section id="export">
            <H2 id="export" icon="↓">7. Export CSV / HubSpot</H2>

            <p className="text-[14px] text-[#374151] leading-relaxed mb-4">
              Cette fonctionnalité vous permet de télécharger en un clic la liste complète de tous les membres actifs, au format CSV. Le fichier est conçu pour être importé directement dans HubSpot.
            </p>

            <H3>Exporter les membres</H3>
            <Steps items={[
              "Rendez-vous dans Admin > Export CSV.",
              "La page affiche le nombre total de membres approuvés disponibles.",
              "Cliquez sur le bouton « Exporter en CSV ».",
              "Un fichier .csv se télécharge automatiquement sur votre ordinateur.",
            ]} />

            <H3>Données incluses dans le fichier</H3>
            <Bullet items={[
              "Identifiant unique, email, prénom, nom",
              "Type de membre, fonction, entreprise, SIRET",
              "Secteur d'activité, taille d'entreprise, zone géographique, ville",
              "Site internet (si renseigné)",
              "Biographie",
              "Expertises (liste séparée par des virgules)",
              "LinkedIn (si renseigné)",
              "Téléphone (si renseigné)",
              "Disponible pour une mission (oui/non)",
              "Date d'inscription",
            ]} />
            <Note color="blue">
              <strong>Usage HubSpot :</strong> importez ce fichier dans HubSpot via Contacts → Importer → Fichier. Les colonnes correspondent aux propriétés standard HubSpot. Seuls les membres au statut « Actif » sont inclus dans l&apos;export.
            </Note>
            <Note color="orange">
              <strong>Données personnelles :</strong> ce fichier contient des informations sensibles (emails, SIRET, téléphones). Manipulez-le avec soin et ne le partagez qu&apos;avec les personnes habilitées à accéder à ces données.
            </Note>
          </section>

          {/* ─────────────────────────────────────────────
              8. EXPÉRIENCE DES MEMBRES
          ───────────────────────────────────────────── */}
          <section id="experience">
            <H2 id="experience" icon="◫">8. Ce que voient les membres</H2>

            <p className="text-[14px] text-[#374151] leading-relaxed mb-4">
              Pour comprendre les questions des membres et les aider efficacement, voici une description de chaque espace auquel ils ont accès.
            </p>

            <H3>Tableau de bord</H3>
            <p className="text-[14px] text-[#374151] mb-2">
              La page d&apos;accueil après connexion. Elle affiche :
            </p>
            <Bullet items={[
              "Les 3 prochains événements (webinaires, afterworks, workshops) avec bouton d'inscription.",
              "Les 3 derniers membres inscrits (pour faciliter les nouvelles rencontres).",
              "Les 3 dernières missions publiées.",
              "Un widget de complétion de profil (encourage à remplir les champs manquants : photo, LinkedIn, téléphone).",
              "Un lien vers le groupe WhatsApp de la communauté.",
            ]} />

            <H3>Annuaire des membres</H3>
            <Bullet items={[
              "Répertoire de tous les membres actifs, avec photo, nom, entreprise, secteur et ville.",
              "Filtres disponibles : par type de membre, par secteur d'activité, par expertise.",
              "Recherche par nom ou entreprise.",
              "Badge vert « Disponible mission » visible sur les membres qui ont activé cette option dans leur profil.",
              "Clic sur un membre → fiche complète avec biographie, expertises, LinkedIn, et bouton de contact.",
            ]} />

            <H3>Agenda</H3>
            <Bullet items={[
              "Liste des événements à venir (les événements passés disparaissent automatiquement).",
              "Chaque événement affiche le type, la date, la description et un bouton « S'inscrire ».",
              "Le bouton d'inscription renvoie vers la page d'inscription externe que vous avez renseignée.",
            ]} />

            <H3>Replays</H3>
            <Bullet items={[
              "Bibliothèque de tous les enregistrements disponibles.",
              "Filtre par type d'événement.",
              "Clic sur un replay → lien direct vers l'enregistrement complet.",
            ]} />

            <H3>Missions</H3>
            <Bullet items={[
              "Tableau de toutes les missions publiées et non expirées.",
              "Chaque annonce affiche le type, le domaine ESG, les expertises requises et le budget si renseigné.",
              "Bouton « Je suis intéressé(e) » : envoie un email automatique au posteur avec le profil complet de l'intéressé(e).",
              "Un membre ne peut pas répondre à sa propre mission.",
            ]} />

            <H3>Mes missions</H3>
            <Bullet items={[
              "Liste des missions que le membre a lui-même publiées.",
              "Statut visible (en attente, publiée, refusée, pourvue, expirée).",
              "Possibilité de modifier ou supprimer une mission en attente ou refusée.",
              "Possibilité de marquer une mission comme « Pourvue » quand elle est trouvée.",
            ]} />

            <H3>Mon profil</H3>
            <Bullet items={[
              "Modification de toutes les informations personnelles et professionnelles.",
              "Upload d'une photo de profil (JPEG/PNG/WebP, max 5 Mo).",
              "Activation/désactivation du badge « Disponible pour une mission ».",
              "Suppression définitive du compte (avec confirmation).",
            ]} />
          </section>

          {/* ─────────────────────────────────────────────
              9. EMAILS AUTOMATIQUES
          ───────────────────────────────────────────── */}
          <section id="emails">
            <H2 id="emails" icon="✉">9. Emails automatiques</H2>

            <p className="text-[14px] text-[#374151] leading-relaxed mb-4">
              La plateforme envoie des emails transactionnels automatiques depuis l&apos;adresse <strong>noreply@club.fletchr.fr</strong>. Ces emails sont déclenchés par des actions spécifiques et vous n&apos;avez rien à faire manuellement.
            </p>

            <Table
              headers={["Déclencheur", "Destinataire(s)", "Contenu"]}
              rows={[
                [
                  "Nouvelle inscription",
                  "Tous les administrateurs",
                  "Nom, email, type, entreprise du candidat — avec lien vers la page des demandes",
                ],
                [
                  "Demande approuvée",
                  "Le nouveau membre",
                  "Message de bienvenue + lien de connexion à la plateforme",
                ],
                [
                  "Demande refusée",
                  "Le candidat refusé",
                  "Message indiquant que la demande n'a pas abouti",
                ],
                [
                  "Mission validée",
                  "Le membre posteur",
                  "Confirmation que sa mission est désormais publiée et visible",
                ],
                [
                  "Mission refusée",
                  "Le membre posteur",
                  "Information que la mission n'a pas été acceptée + invitation à corriger",
                ],
                [
                  "Intérêt pour une mission",
                  "Le membre posteur de la mission",
                  "Profil complet du membre intéressé : nom, entreprise, expertises, LinkedIn, lien vers sa fiche",
                ],
                [
                  "Proposition d'animation",
                  "Tous les administrateurs",
                  "Détails complets de la proposition de webinaire ou d'atelier soumise par un membre",
                ],
              ]}
            />

            <Note color="blue">
              <strong>Proposition d&apos;animation :</strong> les membres peuvent proposer de l&apos;animation (webinaire, atelier...) via un formulaire interne. Vous recevez le détail de leur proposition par email pour décider de la suite.
            </Note>
          </section>

          {/* ─────────────────────────────────────────────
              10. FAQ
          ───────────────────────────────────────────── */}
          <section id="faq">
            <H2 id="faq" icon="?">10. Questions fréquentes</H2>

            <div className="space-y-6">

              <div>
                <H3>Un membre dit ne plus pouvoir se connecter. Que faire ?</H3>
                <Bullet items={[
                  "Vérifiez son statut dans Admin > Membres. S'il est « Suspendu », réactivez-le.",
                  "S'il a oublié son mot de passe, demandez-lui d'utiliser « Mot de passe oublié » sur la page de connexion — la réinitialisation est automatique.",
                  "S'il n'a pas encore été validé, approuvez sa demande dans Admin > Demandes.",
                ]} />
              </div>

              <div>
                <H3>Comment changer l&apos;adresse email d&apos;un membre ?</H3>
                <p className="text-[14px] text-[#374151]">
                  L&apos;email est lié au système d&apos;authentification et ne peut pas être modifié depuis l&apos;interface admin. Le membre doit contacter l&apos;équipe technique pour effectuer ce changement.
                </p>
              </div>

              <div>
                <H3>Une mission est restée publiée mais n&apos;est plus visible dans l&apos;espace membres. Pourquoi ?</H3>
                <p className="text-[14px] text-[#374151]">
                  Les missions expirent automatiquement 30 jours après leur publication. Elles disparaissent de l&apos;espace membres mais restent visibles dans votre interface admin avec le statut « Expirée ». Le membre peut republier une nouvelle mission si le besoin est toujours d&apos;actualité.
                </p>
              </div>

              <div>
                <H3>Comment savoir combien de membres la plateforme compte actuellement ?</H3>
                <p className="text-[14px] text-[#374151]">
                  Rendez-vous dans Admin > Export CSV : la page affiche le nombre de membres actifs avant de télécharger le fichier. Pour voir le total tous statuts confondus, consultez Admin > Membres.
                </p>
              </div>

              <div>
                <H3>Peut-on avoir plusieurs administrateurs ?</H3>
                <p className="text-[14px] text-[#374151]">
                  Oui. Vous pouvez promouvoir autant de membres que nécessaire au rôle d&apos;admin via Admin > Membres > Promouvoir en admin. Tous les admins reçoivent les notifications d&apos;inscription et de proposition d&apos;animation.
                </p>
              </div>

              <div>
                <H3>Où se trouve le groupe WhatsApp de la communauté ?</H3>
                <p className="text-[14px] text-[#374151]">
                  Le lien du groupe WhatsApp est accessible depuis la barre latérale (en bas), depuis le tableau de bord des membres, et depuis la page d&apos;attente des candidats. Il est configuré dans les paramètres techniques de la plateforme.
                </p>
              </div>

              <div>
                <H3>Que se passe-t-il si je supprime un événement que les membres ont mis en favori ?</H3>
                <p className="text-[14px] text-[#374151]">
                  La suppression est immédiate et définitive. L&apos;événement disparaît de l&apos;agenda de tous les membres. Préférez modifier l&apos;événement (ex. changer la date ou le lien) plutôt que de le supprimer.
                </p>
              </div>

              <div>
                <H3>Un membre a publié des informations inappropriées dans son profil. Comment intervenir ?</H3>
                <p className="text-[14px] text-[#374151]">
                  Vous pouvez suspendre son compte via Admin > Membres pour lui couper l&apos;accès dans l&apos;immédiat. Pour modifier directement le contenu de son profil, contactez l&apos;équipe technique qui peut intervenir directement en base de données.
                </p>
              </div>

            </div>
          </section>

          {/* Pied de page */}
          <div className="mt-16 pt-8 border-t border-[#e2e8f0] text-center">
            <p className="text-[13px] text-[#9ca3af]">
              Manuel Club ESG — Réservé aux administrateurs · Mis à jour en 2025
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
