# Club ESG — Design System

## Overview

**Club ESG** is a private community portal for ESG (Environmental, Social, Governance) professionals in France. It is a standalone product operated by [Fletchr](https://fletchr.fr) (a RSE/ESG piloting SaaS by Imagine Human), positioned as a pre-sales community and networking hub.

- **Target URL:** club.fletchr.fr
- **Manager:** Thomas Perrien
- **Business model:** Free with commitment charter
- **Initial volume:** ~40 members
- **Complementary channel:** WhatsApp group (https://chat.whatsapp.com/DxE8kxJSu2KJegWwPBGoXs)

### Target audience (B2B)
- Experts-comptables (potential partners)
- Consultants RSE (potential partners)
- Responsables RSE en entreprise (direct prospects/clients)

### MVP Scope
- Member directory with search & filters (type, sector, expertise)
- Manual admin-validated registration
- Email + password auth
- Personalized member dashboard
- Events calendar (external StreamYard links)
- Webinar replays (HubSpot links)
- Full admin back-office
- Community WhatsApp link

## Sources

The following materials were provided and used to build this design system:
- `uploads/Club ESG Wireframes.html` — v1 mid-fidelity wireframes (Work Sans, dark navy sidebar)
- `uploads/Club ESG Wireframes v2.html` — v2 high-fidelity wireframes (Inter/DM Sans, light sidebar, Fletchr visual DNA)
- `uploads/pasted-1777366584139-0.png` — Screenshot of the parent Fletchr app dashboard

**V2 wireframes are the canonical design reference.** V1 is an earlier exploration with a different sidebar treatment.

---

## CONTENT FUNDAMENTALS

### Language & Locale
- French-language interface throughout (UI labels, copy, placeholder text)
- French date/time format: "12 mai · 12h00", "Mardi 28 avril 2026"
- French punctuation: space before ":" and "?" (French typographic convention implied)

### Tone of Voice
- **Professional but warm** — the platform is B2B, but community-oriented
- **First person plural / inclusive** — "Rejoignez la communauté", "Prêt·e à rejoindre" (gender-neutral dot notation)
- **Action-forward** — CTAs use verbs and arrows: "Demander l'accès →", "Voir tout →", "Continuer →"
- **Encouraging, not pushy** — onboarding copy explains the "why": "Votre demande sera examinée par notre équipe avant validation"
- **Time-aware** — personalized greetings: "Bonjour, Thomas," followed by bold welcome: "Bienvenue au Club ESG !"

### Casing
- Section titles: Sentence case — "Annuaire des membres", "Prochains événements"
- CTA buttons: Sentence case — "Rejoindre le Club", "Demander l'accès gratuit"
- Navigation items: Title/sentence case — "Tableau de bord", "Mon profil"
- Filter labels: Sentence case — "Type de membre", "Secteur d'activité"
- Tags/badges: Short noun phrases — "CSRD", "Bilan carbone", "Responsable RSE"
- Upper-case labels: Only for meta-labels — "Admin", "BY FLETCHR"

### Emoji Usage
- **Emoji are used sparingly in UI** for contextual icons where no icon font is available:
  - 💬 WhatsApp link in sidebar and dashboard
  - 🎙 Webinaire, 🤝 Afterwork, 📋 Workshop — event type icons
  - 📍 Location, 🏢 Company sector, 👥 Company size — profile details
  - 📷 Photo upload, 📄 Document
  - ⏳ Waiting status notice
  - ✓ Checkmark (sometimes as text, sometimes emoji)
- Emoji are **not used for decoration** — only as micro-icons in tight contexts
- The greeting "Bonjour, Thomas 👋" (v1) uses 👋 but this is dropped in v2 for cleaner aesthetics

### Copy Examples
- "La communauté des **professionnels ESG** engagés"
- "Échangez, formez-vous et développez votre réseau"
- "Votre demande sera examinée sous 48h. Vous recevrez un email de confirmation."
- "Ajoutez votre photo de profil et votre biographie pour compléter votre profil."
- "42 membres · 3 nouveaux cette semaine"

---

## VISUAL FOUNDATIONS

### Color System
- **Primary teal:** `#00B4B4` — all primary CTAs, active nav states, tags, progress bars, accent text
- **Teal hover:** `#009898`
- **Teal light:** `#e6f7f7` — tag backgrounds, event date blocks, card highlights
- **Background:** `#f5f6f8` — page/app background (slightly warm, not pure white)
- **Sidebar bg:** `#ebebe6` — warm greige (v2), distinct from page bg
- **Card/surface:** `#ffffff`
- **Border:** `#e5e7eb` (mid: `#d1d5db`)
- **Text dark:** `#111827`, mid: `#374151`, muted: `#6b7280`, light: `#9ca3af`
- **Status colors:** orange `#f97316`, yellow `#eab308`, red `#ef4444`, green `#22c55e`
- **Green (WhatsApp/success):** `#16a34a` / bg `#f0fdf4` / border `#bbf7d0`
- **Workshop accent:** `#7c3aed` (purple — used contextually for workshops)
- **Dark hero background:** gradient `135deg, #0a2a4a → #1a4a6a → #0a3a3a` (deep navy-teal)
- **Avatar palette:** teal, `#1A365D`, `#7c6ea0`, `#e07040`, `#2563eb`, `#16a34a`

### Typography
- **Primary font:** Inter (weights 400/500/600/700) — UI, body, all components
- **Display font:** DM Sans (weights 400/500/600/700) — logo wordmark, larger headings
- **Fallback:** system-ui, sans-serif
- Both fonts available via Google Fonts CDN

#### Type Scale
| Role | Size | Weight | Color |
|---|---|---|---|
| Page H1 | 24px | 700 | `#111827` |
| Section H2 | 22px | 700 | `#111827` |
| Card title | 13–14px | 600 | `#111827` |
| Body | 13px | 400–500 | `#374151` |
| Small/meta | 11–12px | 400–500 | `#6b7280` |
| Label/caps | 10–11px | 600 | `#6b7280`, uppercase, letter-spacing 0.05em |
| Teal accent | 13px | 500 | `#00B4B4` |

### Backgrounds & Surfaces
- **App shell:** `#f5f6f8` warm near-white
- **Sidebar:** `#ebebe6` warm greige
- **Cards:** white with `1px solid #e5e7eb` border
- **Hero sections:** deep navy gradient (landing page)
- **WhatsApp CTA:** `#f0fdf4` green tint (subtle, not gradient)
- **No full-bleed images**, no textures, no patterns — clean flat surfaces
- **No aggressive gradients** in UI (only the hero landing uses gradient; app interior is flat)

### Cards
- `background: #ffffff`
- `border: 1px solid #e5e7eb`
- `border-radius: 8px`
- `padding: 16px`
- Subtle shadow (landing/modal contexts): `0 2px 16px rgba(0,0,0,0.08)`
- No colored left-border accent pattern

### Buttons
- **Primary:** `background: #00B4B4`, `color: #fff`, `border-radius: 6px`, `padding: 7px 14px`, `font-size: 12–13px`, `font-weight: 600`
- **Outline:** `background: #fff`, `border: 1px solid #e5e7eb`, `color: #374151`, same radius/padding
- **Hover:** slightly darker teal `#009898`; outline button may use `#f5f6f8` bg
- **No pill/rounded-full buttons** except filter tabs (agenda filter uses `border-radius: 20px`)

### Badges & Tags
- Teal tag: `background: #e6f7f7`, `color: #00B4B4`, `border-radius: 20px`, `padding: 2px 10px`, `font-size: 11px`, `font-weight: 600`
- Neutral tag: `background: #f5f6f8`, `color: #6b7280` — for expertise tags in annuaire
- Status pills: matching semantic colors with light bg

### Form Inputs
- `height: 34px`, `border: 1px solid #e5e7eb`, `border-radius: 6px`, `padding: 0 10px`, `font-size: 12px`
- Focus: border turns `#00B4B4`
- Multi-select chip area: `border: 1px solid #e5e7eb`, `border-radius: 6px`, `padding: 8px`, `background: #f5f6f8`

### Sidebar Navigation
- Active item: `background: #e6f7f7`, `border-left: 2px solid #00B4B4`, icon + text in `#00B4B4`
- Inactive item: transparent bg, `color: #111827`, `font-weight: 500`
- Admin items: muted (`#9ca3af` icons), same structure
- Footer has WhatsApp green card + logout link

### Spacing & Radius
- Spacing scale: 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40px
- Border radius: `6px` (inputs, buttons), `8px` (cards, sidebar items), `20px` (tags/pills), `50%` (avatars)
- Sidebar width: 220px (full), 60px (collapsed)
- Topbar height: 48px
- Page content padding: 20–24px

### Animations & Interactions
- No custom animations visible in wireframes
- Implied: subtle hover transitions (color change on buttons/nav items)
- Progress bar uses gradient: `linear-gradient(90deg, #00B4B4, #00d4d4)`
- No bounces, no fades — clean, professional, minimal motion

### Shadows
- App cards: no shadow (border only)
- Modal/sheet contexts: `0 2px 16px rgba(0,0,0,0.08)` — very subtle
- No layered or heavy drop shadows

### Iconography
See ICONOGRAPHY section below.

---

## ICONOGRAPHY

### Approach
- **No dedicated icon font or SVG sprite is present** in the provided wireframes
- Unicode characters are used as inline icon proxies throughout the UI:
  - `⊞` Dashboard, `◫` Directory, `◷` Agenda, `▶` Replays, `◉` Profile
  - `⚙` Settings, `≡` List, `✦` Events, `▤` Replays (admin)
  - `⏻` Logout, `🔍` Search
- Emoji used as contextual icons (see Content Fundamentals above)
- **Recommended icon set:** [Lucide Icons](https://lucide.dev/) — matches stroke weight, clean style, available via CDN
  - CDN: `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`
  - This is a **substitution** — no native icon set was provided. Flag to client.

### Logos
Three logo directions were proposed in v2 wireframes (see `assets/logos/`):
- **Option A:** Organic leaf icon + lowercase "club esg." wordmark (closest to Fletchr parent)
- **Option B:** Square teal badge "CE" monogram + "Club ESG" title case
- **Option C:** Network node icon + "club esg." — best metaphor for community (recommended)

All logos include "by Fletchr" sub-label in muted gray.

---

## FILE INDEX

```
README.md                    ← This file
SKILL.md                     ← Agent skill definition
colors_and_type.css          ← CSS custom properties for all tokens
assets/
  logos/
    logo-a.svg               ← Leaf wordmark logo
    logo-b.svg               ← Badge monogram logo
    logo-c.svg               ← Network node logo (recommended)
preview/
  colors-primary.html        ← Primary & teal palette card
  colors-neutral.html        ← Neutral grays card
  colors-status.html         ← Status & semantic colors card
  colors-avatars.html        ← Avatar color palette
  type-scale.html            ← Typography scale card
  type-labels.html           ← Label/caps/meta type specimens
  spacing-tokens.html        ← Spacing & border radius tokens
  shadows-borders.html       ← Shadow & border system
  comp-buttons.html          ← Button variants
  comp-inputs.html           ← Form inputs & selects
  comp-tags-badges.html      ← Tags, badges, status pills
  comp-cards.html            ← Card variants
  comp-sidebar.html          ← Sidebar navigation
  comp-avatar.html           ← Avatar components
  comp-pagination.html       ← Pagination component
  brand-logos.html           ← Logo showcase
  brand-hero.html            ← Landing hero section
ui_kits/
  club-esg/
    README.md
    index.html               ← Full interactive prototype
    Sidebar.jsx
    TopBar.jsx
    Dashboard.jsx
    Annuaire.jsx
    FicheMembre.jsx
    Agenda.jsx
    Landing.jsx
    Inscription.jsx
```
