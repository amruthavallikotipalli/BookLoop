---
name: Literary Boutique Marketplace
colors:
  surface: '#fbf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fbf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ed'
  surface-container: '#f0eee8'
  surface-container-high: '#eae8e2'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c18'
  on-surface-variant: '#414844'
  inverse-surface: '#30312d'
  inverse-on-surface: '#f3f1eb'
  outline: '#727974'
  outline-variant: '#c1c8c2'
  surface-tint: '#456556'
  primary: '#022318'
  on-primary: '#ffffff'
  primary-container: '#19392c'
  on-primary-container: '#81a392'
  inverse-primary: '#abcebc'
  secondary: '#885117'
  on-secondary: '#ffffff'
  secondary-container: '#fdb471'
  on-secondary-container: '#784408'
  tertiary: '#002317'
  on-tertiary: '#ffffff'
  tertiary-container: '#103a2a'
  on-tertiary-container: '#7aa48f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c7ebd8'
  primary-fixed-dim: '#abcebc'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#2d4d3f'
  secondary-fixed: '#ffdcc0'
  secondary-fixed-dim: '#ffb876'
  on-secondary-fixed: '#2d1600'
  on-secondary-fixed-variant: '#6b3b00'
  tertiary-fixed: '#c0ecd5'
  tertiary-fixed-dim: '#a5d0ba'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#264e3d'
  background: '#fbf9f3'
  on-background: '#1b1c18'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 38px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 34px
    letterSpacing: 0em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: 0em
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-tablet: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system establishes a balance between classic bibliophile warmth and modern circular commerce. It conveys the tactile, unhurried atmosphere of an independent Parisian or Bloomsbury antiquarian bookshop, while maintaining the frictionless clarity of high-end digital retail. 

Targeted at avid readers, collectors, and mindful consumers engaging in book rental and resale, the aesthetic evokes intellectual poise, material permanence, and craftsmanship. Visual cues lean into an editorial style: generous margins, delicate typographic cadence, restrained paper-toned neutrals, and refined botanical depths. High contrast is reserved strictly for focal points, allowing secondary elements to exist in calm, readable harmony.

## Colors
The palette is rooted in classical publishing pigments, deep archival botanical dyes, and unbleached rag paper:

- **Primary (`#19392C`)**: Deep archival forest green. Used for authoritative typography, primary CTA backgrounds, brand anchors, and high-emphasis visual landmarks.
- **Secondary (`#D99555`)**: Burnished amber accent. Applied sparingly to highlight circular commerce actions (resale indicators, rental badges, rating stars, and subtle promotional tags).
- **Tertiary (`#244C3B`)**: Mid-tone forest green. Applied for secondary interactive states, category indicators, and rich supportive surfaces.
- **Neutral Base (`#F8F6F0`)**: Unbleached warm paper background. Imparts warmth without the optical fatigue of pure white.
- **Surface Elevation (`#FFFFFF`)**: Pure parchment white. Used exclusively for container cards and interactive floating panels to achieve gentle separation against the neutral ground.
- **Muted Structure & Lines (`#E5E1D8` / `#E9E2D5`)**: Ghosted paper edges and book spine dividers that structure space without visual clutter.
- **Text Hierarchies**: `#24241F` for ink-deep body legibility and `#77766F` for secondary archival metadata (ISBNs, edition years, seller notes).

## Typography
The system juxtaposes classical literary serif styling with utilitarian modern legibility.

- **EB Garamond** acts as the narrative voice. Used for all major headlines, collection titles, literary quotes, and author names. It embodies the heritage of classical typesetting, proportion, and quiet distinction.
- **Plus Jakarta Sans** provides functional balance. Its subtle geometric rounding complements the serif without cold mechanical rigidity. Employed across navigation, search mechanics, transactional flows, filter bars, pricing tags, and dense technical edition details.
- **Editorial Microcopy**: Category tags, inventory identifiers, and resale grading states are set in small caps or slightly tracked uppercase weights using `label-sm` or `label-md` for effortless scannability.

## Layout & Spacing
The layout reflects the rhythm of a well-typeset book spread: deliberate pacing, uncrowded columns, and generous exterior gutters.

- **Grid Architecture**: A 12-column responsive fluid grid across desktop breakpoints (max container width: 1320px). Collapses to 6 columns on tablet devices (640px to 1024px) and 2 or 4 columns on mobile viewports (<640px).
- **Rhythm & Safe Margins**: Outer margins scale proportionally from 3rem on desktop down to 1.25rem on mobile devices.
- **Content Hierarchy**: High-density product tables (rental durations, edition conditions) maintain snug internal padding (`space-xs` to `space-sm`), while promotional editorial storytelling, featured curations, and author highlights breathe with expansive section padding (`space-xl` and above).

## Elevation & Depth
Elevation is achieved through the physical metaphor of stacked archival paper and bound books rather than artificial digital dropshadows.

- **Flat Layering**: Primary hierarchy is articulated through color shifts: the neutral canvas (`#F8F6F0`) supports pure white (`#FFFFFF`) book cards framed by whisper-thin borders (`1px solid #E5E1D8`).
- **Tactile Book Shadows**: When elements require genuine elevation (such as elevated book jackets, floating filter trays, or hover-state cards), shadows must be soft, directional, and tinted with the deep forest tone rather than pure charcoal:
  - *Standard Card Rest*: `0 2px 4px rgba(25, 57, 44, 0.03), 0 1px 2px rgba(25, 57, 44, 0.02)`
  - *Jacket Elevation / Card Hover*: `0 8px 20px -4px rgba(25, 57, 44, 0.08), 0 4px 8px -2px rgba(25, 57, 44, 0.04)`
  - *Modal & Drawer Elevation*: `0 16px 36px -6px rgba(25, 57, 44, 0.12), 0 6px 12px -3px rgba(25, 57, 44, 0.05)`
- **Atmospheric Dividers**: Subtle borders simulate debossed lines on linen-bound covers, always rendered in `#E5E1D8`.

## Shapes
A roundedness factor of 2 provides tailored corners that soften structural components without feeling overtly playful or novelty-driven.

- **Base Corner Radius (0.5rem / 8px)**: Applied to book product cards, modal dialogs, search inputs, and content panels. This mimics the subtly rounded edge of a vintage clothbound hardback.
- **Buttons and Chips (0.375rem to 0.5rem / 6px to 8px)**: Buttons possess a tailored radius that feels engineered yet tactile.
- **Containers & Large Panels (`rounded-lg` / 1rem)**: Used on expansive surface backdrops, shopping basket drawers, and curated hero modules.
- **Book Cover Media**: Cover thumbnails maintain a subtle 4px to 6px outer radius with an inset 1px spine shadow overlay on the left edge to simulate natural bound book thickness.

## Components

### Buttons
- **Primary CTA**: Background in `#19392C`, text in `#FFFFFF`, corner radius of 8px. Hover shifts to `#244C3B` with subtle translateY(-1px). Padding: 12px 24px for `body-md` bold.
- **Secondary / Resale CTA**: Amber accent `#D99555` background with dark ink text `#24241F` for specific buy-back or rental actions.
- **Tertiary / Outline**: 1px solid border `#E5E1D8`, text in `#19392C`, background `#FFFFFF`. On hover, subtle tint with `#E9E2D5`.

### Chips & Badges
- **Condition Tags (Like New, Good, Archival)**: 6px corner radius, muted warm background (`#E9E2D5`), text `#24241F`, set in `label-sm`.
- **Status Chips (Rented, Available, Sold)**: Subtle tinted backgrounds with solid indicator dots (e.g., deep amber for pending return, forest green for active stock).

### Cards (Book & Listing)
- **Structure**: Surface `#FFFFFF`, border `1px solid #E5E1D8`, radius 8px. Internal padding of 16px.
- **Cover Display**: Centered or left-aligned with paper spine shadow. Title set in `headline-sm` (EB Garamond) with author metadata below in `body-sm` muted text (`#77766F`).
- **Interactive State**: Elevates on hover using tactile book shadow and an imperceptible border warm-up to `#D99555`.

### Form Inputs & Search Fields
- **Search Bar**: Generous 48px height, 8px radius, `#FFFFFF` fill, bordered with `#E5E1D8`. Left icon rendered in deep green; placeholder text set in muted `#77766F`. Focus state shifts the border to 1.5px `#19392C` without harsh blue default rings.
- **Select & Filter Dropdowns**: Clean rectangular inputs with subtle chevron indicators, supporting faceted browsing (Genre, Rental Period, Binding Type, Condition).

### Checkboxes & Radios
- **Checkboxes**: Custom 18x18px square with 4px border radius. Unchecked state: `#FFFFFF` with `#E5E1D8` outline. Checked state: `#19392C` fill with crisp white geometric check.
- **Radio Buttons**: Dual concentric circles; selected state displays a `#19392C` outer border with a centered `#D99555` dot.

### Lists & Book Inventories
- **Ledger-style Rows**: Alternating subtle lines (`#E5E1D8`), monospace-styled price & rental terms via `Plus Jakarta Sans`, with title and author in classical serif.