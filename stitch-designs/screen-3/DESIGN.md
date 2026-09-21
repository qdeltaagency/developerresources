---
name: Curated Index
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#41485e'
  on-tertiary: '#ffffff'
  tertiary-container: '#586076'
  on-tertiary-container: '#d4dbf5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.015em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies an ultra-refined, editorial utility aesthetic tailored for high-signal digital discovery. Designed specifically for discerning software engineers, UI/UX architects, and product builders, the interface acts as an invisible, high-precision gallery frame around curated content. 

The style merges **Hyper-Minimalism** with **Modern Functional Engineering**:
- **Clarity over Decor:** Content takes precedence. Visual interest is derived entirely from exquisite typographic hierarchy, surgical alignment, and pristine contrast rather than ornamental illustrations.
- **Architectural Rhythm:** Generous, predictable whitespace and geometric rigor echo modern editorial indexes such as Mobbin and 21st.dev.
- **Micro-tactile Precision:** Tactile satisfaction is achieved via crisp hairline borders (`1px`), subtle ambient lifts, and decisive micro-interactions rather than heavy dimensionality.

## Colors

The color palette prioritizes optical balance, clinical cleanliness, and uncompromising legibility through controlled warm/cool slate neutrals punctuated by focused electric indigo accents.

### Palette Roles
- **Canvas Base (`#F8F9FA` / `#FAFAFA`):** Ground level foundation providing soft ambient contrast against pure white cards without feeling gray or dull.
- **Card & Surface Layers (`#FFFFFF`):** High-reflectance foreground surfaces reserved for interactive cards, dialogs, floating panels, and elevated toolbars.
- **Borders & Dividers (`#E2E8F0` / `#E4E4E7`):** Hairline structure defining containment boundaries cleanly without visual clutter.
- **Typography Tiers:**
  - `Slate-900` (`#0F172A`): Maximum punch for headlines, prominent labels, active item states, and primary metrics.
  - `Slate-700` (`#334155`): Sustained reading comfort for descriptions, body copy, and secondary headers.
  - `Slate-500` (`#64748B`): Crisp utility for metadata, timestamps, shortcuts, and de-emphasized iconography.
- **Primary Interactive (`#4F46E5` Indigo):** Applied intentionally for primary CTAs, active filter segments, highlighted tags, and focus rings.
- **Secondary Accent (`#2563EB` Electric Blue):** Reserved for hyperlinks, code highlights, and verified credential indicators.

## Typography

Typography relies on **Geist** for natural, neutral modernism paired with **JetBrains Mono** for technical data density, shortcuts, and code metadata.

- **Tracking Strategy:** Headings employ tight negative letter-spacing (`-0.015em` to `-0.03em`) to produce an authoritative, magazine-grade layout feel. Body sizes utilize neutral tracking to ensure effortless scanning across large catalog inventories.
- **Optical Hierarchies:** Headings rely on weight differentiation (`600`) and optical slate color shifts rather than excessive scale leaps.
- **Code Tokens:** All directory metadata, keyboard triggers, component version numbers, and file sizes are styled via JetBrains Mono to ground the directory in engineering craft.

## Layout & Spacing

The layout is built on a responsive 12-column grid container capped at `1440px` maximum width, centered with dynamic auto-margins.

### Breakpoints and Behavior
- **Desktop (≥ 1200px):** 12 columns, `1.5rem` (`24px`) gutters, `2rem` (`32px`) margins. Resource cards display in 3 or 4-column configurations.
- **Tablet (768px – 1199px):** 8 columns, `1rem` (`16px`) gutters, `1.5rem` (`24px`) margins. Cards reflow to 2-column configurations; filter navigation transitions to horizontal overflowing tabs.
- **Mobile (< 768px):** 4 columns, `1rem` (`16px`) gutters, `1rem` (`16px`) margins. Resource cards stack to single-column spanning. Navigation collapses into a sticky bottom or top sheet filter panel.

### Spatial Discipline
All spacing strictly honors standard 4px multiples. Component interiors follow tight horizontal packing with generous structural vertical flow to keep visual scanning seamless.

## Elevation & Depth

This design system abandons heavy drop shadows in favor of **Crisp Hairline Boundaries with Micro-Lifts**. Depth is communicated through pure surface contrast and surgical ambient light.

- **Level 0 (Flat Canvas):** `#F8F9FA` or `#FAFAFA`. Raw ground level, zero elevation, no shadow.
- **Level 1 (Card & Container Resting):** Background `#FFFFFF`, bordered by an exact `1px solid #E2E8F0`. Shadow: `0px 1px 2px rgba(15, 23, 42, 0.04)`.
- **Level 2 (Hovered Card / Active Trigger):** Background `#FFFFFF`, border shifts to `#CBD5E1`. Shadow lifts smoothly to: `0px 4px 12px -2px rgba(15, 23, 42, 0.08), 0px 2px 6px -1px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Popovers, Modals & Floating Menus):** Background `#FFFFFF`, `1px solid #E2E8F0`. Shadow: `0px 12px 24px -4px rgba(15, 23, 42, 0.1), 0px 4px 8px -2px rgba(15, 23, 42, 0.05)`.

## Shapes

The shape system leverages subtle, structured rounding (`roundedness: 1`) to preserve an architectural feel while preventing the UI from feeling harsh or unapproachable.

- **Default UI (Inputs, Small Badges, Buttons):** `0.25rem` (`4px`) to `0.375rem` (`6px`).
- **Cards & Resource Containers (`rounded-lg`):** `0.5rem` (`8px`) for preview frames and list panels.
- **Pill Badges & Filter Capsules:** Fully pill-shaped (`9999px`) used exclusively for category tags, status pills, and interactive filter toggles to distinguish functional tags from content cards.

## Components

### Buttons
- **Primary Button:** Deep Slate (`#0F172A`) or Indigo (`#4F46E5`) fill with `#FFFFFF` text. Height `36px`, horizontal padding `14px`, `roundedness: 1`. Hover transitions fill subtly with zero outline expansion.
- **Secondary/Outline Button:** `#FFFFFF` background, `1px solid #E2E8F0`, text `#0F172A`. Hover transitions border to `#CBD5E1` and background to `#F8F9FA`.
- **Ghost/Tertiary Button:** Transparent background, text `#64748B`. Hover shifts to `#0F172A` with `#F1F5F9` surface fill.

### Filter Capsules & Badges
- **Category Capsule (Resting):** Background `#FFFFFF`, `1px solid #E2E8F0`, text `#334155`, fully pill-shaped. Height `28px`.
- **Category Capsule (Active):** Background `#0F172A` or `#4F46E5`, border color matches fill, text `#FFFFFF`.
- **Tech Stack Badge:** Background `#F1F5F9`, text `#475569`, borderless, font `JetBrains Mono` at `11px`, `roundedness: 1`.

### Resource Cards
- Built on `#FFFFFF` surface with `1px solid #E2E8F0` and `rounded-lg` (`8px`).
- **Media Header:** Inner media container with a bottom border dividing preview asset from card body.
- **Interactive State:** Hover lifts via Level 2 elevation, border darkens to `#CBD5E1`, and the preview image scales slightly (`1.01x`) with a crisp ease-out curve.

### Input Fields & Search
- **Search Bar:** Height `40px` (or `48px` for hero discovery search), `#FFFFFF` fill, `1px solid #E2E8F0`, placeholder `#94A3B8`. Left-aligned search icon in `#64748B`.
- **Focus State:** Solid `1px solid #4F46E5` border accompanied by an ambient `0 0 0 3px rgba(79, 70, 229, 0.1)` focus ring.
- **Shortcut Affordance:** Right-aligned inline badge `⌘K` rendered in JetBrains Mono (`#94A3B8`, `11px`).

### Checkboxes & Radios
- Size `16px × 16px`, `roundedness: 1` (checkboxes) or circular (radios).
- Resting: `1px solid #CBD5E1`, `#FFFFFF` background.
- Selected: Background `#4F46E5`, border `#4F46E5`, crisp white `#FFFFFF` inner checkmark.

### Resource Lists & Directory Rows
- Row-based alternatives to grid cards: divided by `1px solid #F1F5F9`, zero side borders.
- Hover changes entire row background to `#F8F9FA` with instant cursor transition.