# SPEC Club ESG - MVP

**Document de référence pour le build**
**Dernière mise à jour : 23 mars 2026**

---

## 1. Contexte & Objectifs

**Porteur du projet :** Thomas Perrien, Responsable Partenariats chez Fletchr (plateforme de pilotage RSE)

**Le Club ESG** est un portail communautaire privé pour les professionnels engagés dans la transition ESG. Il sert deux objectifs à parts égales :

1. **Générer des leads qualifiés** pour la plateforme Fletchr (prospects directs : responsables RSE en entreprise)
2. **Fidéliser les partenaires existants et potentiels** (experts-comptables, consultants RSE)

**Volume cible :** 50-100 membres à 6 mois (démarrage avec ~40 membres du groupe WhatsApp existant)

**Baseline :** "Ensemble, accélérons la transition RSE"

**URL :** club.fletchr.fr

---

## 2. Stack technique

| Composant | Choix | Raison |
|-----------|-------|--------|
| Framework | Next.js 14 (App Router) | SSR, routing natif, React |
| UI | Tailwind CSS | Cohérent avec design épuré Notion/Linear |
| Backend / Auth / DB | Supabase (PostgreSQL) | Auth + DB + Storage + RLS dans un seul service |
| Hébergement | Vercel (free tier Hobby) | Deploy auto depuis GitHub, SSL auto |
| Repo | GitHub (à créer) | Versionning, deploy hooks Vercel |
| SMTP | Resend (free tier 3000 emails/mois) | Envoi depuis noreply@club.fletchr.fr |
| Intégration CRM | Webhook Supabase → HubSpot API | Création de contact automatique à l'inscription |
| Export | CSV depuis le back-office admin | Import HubSpot en complément |

**Budget mensuel : 0€** (free tiers Vercel + Supabase + Resend couvrent largement 100 membres)

**Maintenance :** Thomas seul via Claude Code. Le code sera structuré pour être modifiable par un non-dev assisté par IA (composants isolés, commentaires en français, README détaillé, architecture plate).

---

## 3. Plateforme de marque

### 3.1 Couleurs

| Élément | Code | Usage |
|---------|------|-------|
| Principale (turquoise) | #00B4B4 | Boutons, liens, accents, bordure active sidebar |
| Secondaire (bleu foncé) | #1A365D | Headers, sidebar, textes importants |
| Fond | #FFFFFF | Arrière-plan principal |
| Texte principal | #2D3748 | Corps de texte |
| Texte secondaire | #718096 | Texte grisé, labels |

### 3.2 Typographie

**Police :** Work Sans (Google Fonts)
Variantes : 400, 500, 600, 700

### 3.3 Logo

URL : https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/Logo%20Club%20ESG.png

### 3.4 Design

Style épuré type Notion/Linear avec les couleurs Fletchr. Beaucoup d'air, peu de décorations, focus sur le contenu et la lisibilité.

### 3.5 Ton éditorial

- **Tutoiement partout** (landing page incluse)
- Ton amical, professionnel sans être formel
- Esprit club : entraide, partage, bienveillance, intelligence collective
- Messages courts, chaleureux, orientés action
- Pas de jargon corporate
- Promesse de valeur : "On compte sur l'intelligence collective pour progresser ensemble sur un spectre large qu'est la RSE, avec des compétences complémentaires, pour aider la RSE à s'implanter et favoriser son adoption sur le territoire."

### 3.6 Wording des CTA

| Action | Wording |
|--------|---------|
| Inscription | "Rejoindre le Club" |
| Connexion | "Accéder au Club" |
| Dashboard 1ère connexion | "Bienvenue dans le Club !" |
| Dashboard connexions suivantes | "Bienvenue [Prénom] !" |

### 3.7 Charte d'engagement

PDF externe : https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/CHARTE%20D%E2%80%99ENGAGEMENT%20DES%20MEMBRES%20DU%20CLUB%20ESG.pdf

---

## 4. Architecture des données

### 4.1 Table members (25 champs)

**Étape 1 - Identité (4 champs, tous obligatoires) :**

| Champ | Type | Note |
|-------|------|------|
| Prénom | text | |
| Nom | text | |
| Email | email | Unique, lié à Supabase Auth |
| Mot de passe | password | Hashé via Supabase Auth |

**Étape 2 - Cadre professionnel (9 champs) :**

| Champ | Type | Obligatoire | Note |
|-------|------|-------------|------|
| Type de membre | enum | Oui | 4 options |
| Fonction / Poste | text | Oui | |
| Entreprise | text | Oui | |
| SIRET | text | Oui | Non visible par les membres |
| Secteur d'activité | enum | Oui | 20 options |
| Taille d'entreprise | enum | Oui | 6 tranches |
| Zone géographique | text | Oui | |
| Ville | text | Oui | |
| Site Internet entreprise | url | Non | |

**Étape 3 - Profil communautaire (5 champs) :**

| Champ | Type | Obligatoire | Note |
|-------|------|-------------|------|
| Photo de profil | upload | Non | JPEG/PNG max 5Mo, avatar par défaut si absent |
| Biographie | textarea | Oui | Max 500 caractères |
| Expertises | multi-select | Oui | 15 options |
| LinkedIn | url | Non | |
| Téléphone | tel | Non | |

+ Case à cocher acceptation charte d'engagement (obligatoire)

**Métadonnées système (7 champs) :**

date_inscription, statut (pending/approved/rejected), role (pending/member/admin), premiere_connexion, derniere_connexion, approuve_par, approuve_le

### 4.2 Enums

**Types de membre (4) :** Expert-comptable, Consultant RSE, Responsable RSE, Autre

**Secteurs d'activité (20) :** Tous Secteurs, Agroalimentaire, Industrie & Manufacturing, BTP & Construction, Énergie & Utilities, Transport & Logistique, Commerce & Distribution, Hôtellerie & Restauration, Santé & Médico-social, Pharmacie & Cosmétique, Services aux entreprises, Finance & Assurance, Immobilier, Tech & Numérique, Télécommunications, Éducation & Formation, Culture & Médias, Associations & ESS, Secteur public, Autre

**Expertises (15) :** Bilan carbone, CSRD / Reporting extra-financier, Stratégie RSE, Audit & Certification, Formation RSE, Achats responsables, Économie circulaire, Biodiversité, Mobilité durable, Efficacité énergétique, QVT & RH responsables, Finance durable, Communication RSE, Conformité réglementaire, Autre

**Tailles d'entreprise (6) :** 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+

### 4.3 Table events (7 champs)

| Champ | Type | Obligatoire |
|-------|------|-------------|
| Titre | text | Oui |
| Date + heure | timestamp | Oui |
| Description | textarea | Oui |
| Type | enum | Oui (Webinaire / Afterwork / Workshop) |
| Lien inscription | url | Oui |
| Image | upload | Non |
| Créé par | ref (admin) | Auto |

Règle : événements passés masqués automatiquement de l'agenda.

### 4.4 Table replays (8 champs)

| Champ | Type | Obligatoire |
|-------|------|-------------|
| Titre | text | Oui |
| Date événement | date | Oui |
| Description | textarea | Oui |
| Type | enum | Oui (Webinaire / Afterwork / Workshop) |
| Lien replay | url | Oui (HubSpot) |
| Image | upload | Non |
| Intervenant(s) | text | Non |
| Créé par | ref (admin) | Auto |

Note : 0-2 replays disponibles au lancement.

---

## 5. Rôles et permissions

| Rôle | Accès | RLS |
|------|-------|-----|
| Candidat (pending) | Formulaire inscription uniquement | Aucun accès aux tables |
| Membre (approved) | Dashboard, Annuaire, Agenda, Replays, Mon profil | Lecture annuaire, lecture événements/replays, écriture propre profil |
| Admin | Tout + back-office | CRUD total |

**Admins initiaux :**

| Email | Rôle |
|-------|------|
| thomas@fletchr.fr | Admin |
| marie@fletchr.fr | Admin |
| oumaima@fletchr.fr | Admin |

---

## 6. Pages (16 écrans)

### 6.1 Pages publiques (4)

1. **/** - Landing page (présentation du Club, baseline, CTA "Rejoindre le Club")
2. **/inscription** - Formulaire en 3 étapes avec barre de progression
3. **/connexion** - Email + mot de passe, lien "Mot de passe oublié"
4. **/mot-de-passe-oublie** - Reset par email

### 6.2 Pages membres (6)

5. **/dashboard** - Message bienvenue (personnalisé 1ère connexion), 2 prochains événements, 3 derniers membres inscrits, lien WhatsApp
6. **/annuaire** - Grille 2 colonnes, pagination, filtres (type, secteur, expertise)
7. **/annuaire/[id]** - Fiche membre détaillée (SIRET masqué)
8. **/agenda** - Liste des événements à venir
9. **/replays** - Liste des replays, filtres par type, pagination
10. **/mon-profil** - Édition de tous les champs + suppression de compte

### 6.3 Pages admin (6)

11. **/admin/demandes** - Onglets En attente / Validés / Refusés
12. **/admin/membres** - Liste complète, recherche, actions
13. **/admin/evenements** - Liste + formulaire création/édition
14. **/admin/replays** - Liste + formulaire création/édition
15. **/admin/export-csv** - Export des membres pour import HubSpot
16. **/admin/evenements/[id]** et **/admin/replays/[id]** - Formulaires d'édition

### 6.4 Navigation

Sidebar latérale gauche fixe :
- Fond : #1A365D (bleu foncé)
- Texte : blanc
- Élément actif : bordure gauche turquoise #00B4B4
- Sections : ADMIN (si admin) puis MEMBRE
- Bas de sidebar : lien WhatsApp + bouton déconnexion

Lien WhatsApp communautaire : https://chat.whatsapp.com/DxE8kxJSu2KJegWwPBGoXs

---

## 7. Intégrations

### 7.1 Webhook Supabase → HubSpot

À chaque passage de statut "pending" → "approved" :
- Création ou mise à jour d'un contact HubSpot
- Champs mappés : email, prénom, nom, entreprise, fonction, type de membre, secteur

### 7.2 Resend (SMTP)

- Domaine d'envoi : club.fletchr.fr
- Emails transactionnels : vérification email, reset mot de passe, notification approbation/refus
- Langue : français

### 7.3 Liens externes

- Événements → StreamYard (lien inscription)
- Replays → HubSpot (lien replay)
- Communauté → WhatsApp

---

## 8. DNS

- Sous-domaine : club.fletchr.fr
- Type : CNAME → cname.vercel-dns.com
- Gestion : Thomas a accès au DNS
- SSL : automatique via Vercel

---

## 9. Localisation (Français)

Tous les messages, labels, erreurs et emails en français :
- "Cette adresse email est déjà associée à un compte"
- "Ce champ est obligatoire"
- Objet email vérification : "Club ESG : vérifie ton adresse email"
- Objet email approbation : "Club ESG : bienvenue dans le Club !"

---

## 10. Calendrier de build (5 jours)

| Jour | Focus | Livrables |
|------|-------|-----------|
| J1 | Infra + fondations | Repo GitHub, projet Supabase (schéma DB, auth, RLS, storage), projet Vercel, scaffolding Next.js, config Resend |
| J2 | Pages publiques | Landing page, inscription 3 étapes, connexion, mot de passe oublié |
| J3 | Espace membre | Dashboard, annuaire + filtres, fiche membre, sidebar navigation |
| J4 | Contenu + profil | Agenda, replays + filtres, édition profil, suppression compte |
| J5 | Admin + deploy | Back-office complet, export CSV, webhook HubSpot, config DNS, tests, mise en ligne |

---

## 11. Structure du repo (prévisionnelle)

```
club-esg/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── .env.local.example
├── supabase/
│   └── migrations/         # Schéma DB versionné
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout racine
│   │   ├── page.tsx         # Landing page
│   │   ├── connexion/
│   │   ├── inscription/
│   │   ├── mot-de-passe-oublie/
│   │   ├── dashboard/
│   │   ├── annuaire/
│   │   ├── agenda/
│   │   ├── replays/
│   │   ├── mon-profil/
│   │   └── admin/
│   ├── components/
│   │   ├── ui/              # Boutons, inputs, cards...
│   │   ├── layout/          # Sidebar, header
│   │   └── forms/           # Formulaires inscription, événements...
│   ├── lib/
│   │   ├── supabase.ts      # Client Supabase
│   │   ├── hubspot.ts       # Webhook HubSpot
│   │   └── resend.ts        # Config email
│   └── types/
│       └── index.ts         # Types TypeScript
```
