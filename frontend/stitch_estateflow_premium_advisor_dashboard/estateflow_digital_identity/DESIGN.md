---
name: EstateFlow Digital Identity
colors:
  surface: '#fcf9f1'
  surface-dim: '#dcdad2'
  surface-bright: '#fcf9f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3eb'
  surface-container: '#f1eee6'
  surface-container-high: '#ebe8e0'
  surface-container-highest: '#e5e2da'
  on-surface: '#1c1c17'
  on-surface-variant: '#414849'
  inverse-surface: '#31312b'
  inverse-on-surface: '#f3f1e9'
  outline: '#727879'
  outline-variant: '#c1c8c8'
  surface-tint: '#486366'
  primary: '#072427'
  on-primary: '#ffffff'
  primary-container: '#1f3a3d'
  on-primary-container: '#88a4a7'
  inverse-primary: '#afcccf'
  secondary: '#775a1a'
  on-secondary: '#ffffff'
  secondary-container: '#fdd589'
  on-secondary-container: '#775b1b'
  tertiary: '#371800'
  on-tertiary: '#ffffff'
  tertiary-container: '#522c0d'
  on-tertiary-container: '#ca926b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cbe8eb'
  primary-fixed-dim: '#afcccf'
  on-primary-fixed: '#021f22'
  on-primary-fixed-variant: '#304b4e'
  secondary-fixed: '#ffdea3'
  secondary-fixed-dim: '#e8c177'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5c4202'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#f7ba90'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#663d1d'
  background: '#fcf9f1'
  on-background: '#1c1c17'
  surface-variant: '#e5e2da'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-padding-mobile: 1rem
  container-padding-desktop: 2.5rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style
The design system is engineered for high-net-worth real estate advisory, blending the heritage of traditional luxury with the efficiency of a modern SaaS dashboard. The aesthetic is **Modern Minimalist with a Tactile Edge**, prioritizing high-quality visual hierarchy and spaciousness to reduce cognitive load for advisors managing complex portfolios. 

The emotional response should be one of quiet confidence, precision, and exclusivity. By leaning into "Warm Parchment" and "Deep Teal" instead of standard corporate blues, the system establishes a unique, boutique presence that feels bespoke rather than mass-produced. The style utilizes subtle depth and refined materiality to convey a "practical luxury" narrative.

## Colors
This palette departs from digital norms to embrace an architectural sensibility. 

- **Primary (Deep Teal):** Used for the primary navigation (sidebar), heavy-duty brand components, and primary action buttons. It provides the "anchor" for the dashboard.
- **Secondary (Luxury Gold):** Reserved for highlights, active states, and focus indicators. It should be used sparingly to maintain its value as a visual reward.
- **Background (Warm Parchment):** Replaces harsh whites to provide a softer, more sophisticated canvas that reduces eye strain during long-form data analysis.
- **Surface (Pure White):** Used exclusively for cards and modal containers to create a clear "lifted" distinction from the parchment background.

## Typography
The typography strategy pairings high-impact geometric headers with ultra-readable functional body text.

- **Montserrat** is used for all display and headline roles to evoke a sense of modern architectural strength. Use "Bold" or "SemiBold" weights to establish clear content sections.
- **Inter** handles all data-heavy and functional roles. Its neutral, systematic nature ensures that property metrics and client details remain the primary focus.
- **Tracking:** Use slightly tighter tracking on large headlines for a premium editorial look, and wider tracking (0.05em) on uppercase labels to improve legibility at small sizes.

## Layout & Spacing
The layout follows a **Fluid Grid with Fixed Constraints**. The main dashboard content should be contained within a max-width of 1440px for optimal readability.

- **The Sidebar:** Fixed at 280px, utilizing the Primary Deep Teal color for full-height impact.
- **Spacing Rhythm:** Based on a 4px baseline, but favoring "loose" vertical spacing (2rem+) between major card components to maintain the premium feel.
- **Grid:** Use a 12-column grid for the main content area. On mobile, this collapses to a single column with cards stacking vertically.
- **Margins:** Generous outer margins (40px on desktop) ensure the content feels framed and intentional, not cramped.

## Elevation & Depth
This design system uses **Ambient Shadows** to create a sophisticated layered effect. Depth is used to communicate hierarchy, not just decoration.

- **Level 0 (Base):** The #F5F2EA parchment background. No shadow.
- **Level 1 (Cards):** Surface white. Soft, multi-layered shadow (0px 4px 20px rgba(31, 58, 61, 0.05)). The shadow uses a tiny hint of the primary teal to feel integrated.
- **Level 2 (Hover/Active):** Slightly deeper shadow (0px 10px 30px rgba(31, 58, 61, 0.08)) and a 1px border of #E5E7EB.
- **Level 3 (Modals/Popovers):** High-diffusion shadow (0px 20px 50px rgba(0, 0, 0, 0.1)).
- **Tactile Details:** Use a 1px inner light stroke on primary buttons to give them a subtle "pressed" or "milled" look.

## Shapes
The shape language is purposefully soft to contrast with the sharp, professional nature of the finance/real estate industry.

- **Cards:** Use `rounded-2xl` (1.5rem) to create a friendly, modern container for data.
- **Buttons & Inputs:** Use `rounded-lg` (0.5rem) for a more precise, functional appearance.
- **Avatar/Icons:** Use `rounded-full` for user-related elements to distinguish them from structural property data.

## Components

### Buttons
- **Primary:** Deep Teal background, white text. Semi-bold. `rounded-lg`.
- **Secondary (Luxury):** Gold background or Gold 1px border. Used for "Premium" actions or upgrades.
- **Ghost:** No background, Primary text. High contrast on hover with a light teal tint.

### Cards
- **Structure:** Always white background. Padding should be generous (min 24px). Headers within cards should use the Gold accent for small labels or icons.
- **Interaction:** Cards should have a subtle scale effect (1.01x) on hover to indicate interactivity.

### Inputs & Selects
- **Styling:** Minimalist. 1px border using #D1D5DB. On focus, the border transitions to Gold (#C8A45D) with a 2px soft outer glow.
- **Labels:** Always use `label-md` (uppercase) positioned above the field.

### Lists & Data Tables
- **Rows:** Alternate between Pure White and a very faint Parchment tint (#FAF9F6) for readability. 
- **Dividers:** Use thin (1px) lines in #E5E7EB. Avoid heavy borders between rows.

### Chips & Badges
- **Status Badges:** Use a "Light Fill" style. For example, Success uses a light green background with the #2E7D32 text. Shape should be `rounded-full`.
- **Property Tags:** Small, subtle chips using the Bronze (#8E5E3B) color for categorization like "Penthouse" or "Commercial."