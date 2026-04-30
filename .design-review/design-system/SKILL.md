---
name: club-esg-design
description: Use this skill to generate well-branded interfaces and assets for Club ESG, a private ESG professionals community portal by Fletchr. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping or production.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

Key reference files:
- `README.md` — full brand context, content tone, visual foundations, iconography
- `colors_and_type.css` — all CSS custom properties (colors, type, spacing, radius, shadows)
- `assets/logos/logo-c.svg` — recommended logo (network nodes + "club esg.")
- `ui_kits/club-esg/index.html` — full interactive prototype (landing → dashboard → annuaire → agenda)
- `ui_kits/club-esg/Sidebar.jsx` — shared tokens (T, S) + Avatar + Tag + LogoC components

Core brand rules:
- Primary: teal `#00B4B4`, sidebar `#ebebe6`, bg `#f5f6f8`, text `#111827`
- Font: Inter (UI) + DM Sans (display/logo)
- Cards: white, `1px solid #e5e7eb`, `border-radius: 8px`, no left-border accent
- Buttons: `border-radius: 6px` (not pill), teal primary, outline secondary
- Tags: `border-radius: 20px` pills — teal for active/primary, neutral gray for secondary
- Language: French throughout; sentence case; gender-neutral dot notation (Prêt·e)
- No emoji decoration — only as contextual micro-icons

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
