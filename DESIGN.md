---
name: Enterprise Velocity
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
  on-surface-variant: '#424656'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#00655c'
  on-tertiary: '#ffffff'
  tertiary-container: '#008075'
  on-tertiary-container: '#ddfff9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  mono-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

The design system is engineered for high-performance URL management, prioritizing technical authority and operational efficiency. The brand personality is **Precise, Reliable, and Progressive**, designed to instill confidence in enterprise DevOps and marketing teams handling high-volume traffic.

The visual style follows a **Corporate / Modern** aesthetic, heavily influenced by the refined utility of industry leaders like Stripe and Vercel. It utilizes a rigorous information hierarchy, ample white space to reduce cognitive load during complex bulk operations, and a sophisticated layering system. The UI avoids unnecessary ornamentation, ensuring that the user's focus remains entirely on data accuracy and management workflows.

## Colors

The palette is anchored by a **Deep Navy** (Secondary) and **Slate Grays** (Neutral) to establish a foundation of stability and professional "dark-mode-adjacent" depth within a light-themed environment. 

- **Primary (Electric Blue):** Used for primary actions, active states, and critical paths. It provides high contrast against the navy and white backgrounds.
- **Secondary (Deep Navy):** Utilized for sidebars, headers, and primary text to ground the interface.
- **Tertiary (Teal):** Reserved for success states, analytics growth indicators, and "Active" status badges.
- **Neutrals (Slate):** A range of cool grays used for borders, secondary text, and subtle surface backgrounds to maintain a clean, organized look.

## Typography

This design system utilizes **Inter** exclusively to leverage its exceptional legibility in data-dense environments. 

The type scale is strictly mathematical to ensure vertical rhythm. **Display** styles are used for dashboard overviews. **Body-sm** is the workhorse for data tables and form labels, ensuring high information density without sacrificing readability. A specialized **Mono** variant (or Inter with tabular num features enabled) is used for URL strings and analytics metrics to ensure characters align perfectly for easy scanning.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** with a maximum container width of 1440px. The system is built on a **4px baseline grid**, where all padding, margins, and heights are multiples of 4.

- **Dashboard Layout:** A fixed left navigation sidebar (240px) with a fluid main content area.
- **Section Spacing:** 40px (xl) between major sections; 24px (lg) between cards; 16px (md) for internal card padding.
- **Density:** High-density layouts are preferred for URL management tables, using 8px (sm) vertical padding for table rows to allow more data visibility per screen.

## Elevation & Depth

Visual hierarchy is managed through **Tonal Layers** and **Low-Contrast Outlines**.

1.  **Level 0 (Background):** A very light cool gray (#F8FAFC) used as the canvas.
2.  **Level 1 (Cards/Containers):** Pure white surfaces with a 1px solid border (#E2E8F0). 
3.  **Level 2 (Dropdowns/Popovers):** Pure white with a 1px border and a subtle, highly-diffused ambient shadow (Offset: 0, 4px; Blur: 12px; Opacity: 0.05) to separate from the background.
4.  **Interactive States:** Elements slightly lift or change border color to Electric Blue on hover to provide immediate feedback.

## Shapes

The shape language is **Soft and Precise**, utilizing a 0.25rem (4px) base radius. This minimal rounding maintains a serious, enterprise feel while softening the "edge" of the data-heavy interface.

- **Buttons/Inputs:** 4px radius (Soft).
- **Cards/Modals:** 8px radius (Rounded-lg).
- **Status Chips:** 100px (Pill-shaped) to clearly distinguish them from actionable buttons.

## Components

### Buttons & Actions
- **Primary:** Electric Blue background with white text. High-contrast, used for "Create URL" or "Save."
- **Secondary:** White background with Slate-900 text and 1px border. Used for bulk operations (Export, Archive).
- **Ghost:** No background or border, Slate-600 text. Used for less frequent actions in table rows.

### Data Tables
- Header cells use **Label-md** with a subtle Slate-50 background.
- Row heights are compact.
- Include a "Bulk Selection" checkbox column on the far left.
- Interactive URLs should be truncated with an ellipsis and feature a "Copy to Clipboard" icon on hover.

### Card-Based Metrics
- High-level analytics (Clicks, CTR, Unique Visitors) are housed in Level 1 cards.
- Metrics are displayed in **Headline-sm** with a mono-spaced feel for digits.
- Use Sparklines (Teal) for 7-day trend visualization within the card.

### URL Management Forms
- Input fields use a 1px border that shifts to 2px Electric Blue on focus.
- Inline validation is required for URL syntax and slug availability.
- Use "Input Groups" for domain selection (dropdown) prepended to the slug text input.

### Additional Components
- **Status Badges:** Small pill-shaped chips (e.g., "Active", "Expired", "Broken") using low-saturation background tints of Teal, Slate, and Red.
- **Activity Feed:** A vertical timeline for tracking URL edits and redirects.