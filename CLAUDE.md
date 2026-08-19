# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm run dev        # start Vite dev server with HMR
npm run build       # type-check (tsc -b, project references) then production build via Vite
npm run lint         # run oxlint
npm run preview      # serve the production build locally
```

There is no test suite/framework configured in this project (no test runner in `package.json`).

## Architecture

This is a single-page marketing/showcase site for a whey protein brand ("PROTEIN3D"), built with React 19 + TypeScript + Vite, routed client-side via `react-router-dom`, and animated with GSAP. UI copy and content is in Turkish.

- **Entry / shell**: `src/main.tsx` mounts `<App>` inside `<BrowserRouter>`. `src/App.tsx` renders the sticky navbar (with active-route highlighting via `useLocation`), a `<Routes>` block wiring three pages: `/` → `HomePage`, `/nutrition` → `NutritionPage`, `/contact` → `ContactPage`, and a shared `src/components/Footer.tsx` rendered below `<Routes>` on every page.
- **Styling**: Almost all styling is inline `style={{...}}` objects directly on JSX elements rather than CSS classes/modules — `src/App.css`/`src/index.css` only carry minimal base styles. When editing UI, follow this inline-style convention rather than introducing a new styling system.
- **Content/data-driven product carousel** (`src/pages/HomePage.tsx` + `src/data/flavors.ts`): The `FLAVORS` array in `flavors.ts` is the single source of truth for each product flavor (id, title, description, color/rgba theme, image path, badge, nutrition stats). `HomePage` renders a horizontally-scrollable carousel driven off `activeIdx` into this array; adding/editing a flavor is normally a `flavors.ts`-only change, and per-flavor accent colors (`color`/`rgba`) cascade through cursor, particles, glows, and modal styling automatically.
- **Interaction layer in `HomePage`**: This component is the most complex file in the app and combines several independent GSAP-driven systems, coordinated through refs (not state, to avoid re-render churn) rather than component composition:
  - A custom mouse-follower cursor (`gsap.quickTo` on `cursorRef`) that replaces the native cursor (`cursor: 'none'` is set throughout).
  - Pointer-based drag/swipe carousel logic (`handlePointerDown/Move`, `endDrag`) with its own threshold/velocity handling, decoupled from click handling so a drag release doesn't fire a click on the card underneath.
  - Keyboard (arrow keys) and wheel (horizontal scroll) navigation, both funneling into `triggerExplosiveTransition`.
  - A responsive step-distance measurement (`stepRef`) recalculated on resize since card size is `clamp()`-based rather than fixed.
  - A "product details" modal opened via GSAP timeline that scatters/reassembles content cards (`.modal-ing-1..4`) around a centered product bottle image; modal z-index (2000+) must stay above the sticky navbar (1000).
- **Effects components**: `src/components/ParticleBackground.tsx` (raw `<canvas>` + `requestAnimationFrame` particle field, colored per active flavor) and `src/components/BurstCanvas.tsx` (imperative-handle component exposing `triggerBurst(x, y, color, rgba, emoji)` — spawns transient DOM nodes animated with GSAP for the "burst" effect on product click, including flavor-specific emoji particles via `FLAVOR_EMOJI` in `HomePage.tsx`). Both manage their own animation loops/cleanup in `useEffect`.
- **Other pages** (`NutritionPage.tsx`, `ContactPage.tsx`) are simpler, mostly-static content pages using a shared "reveal on mount" GSAP fade/stagger pattern (`gsap.fromTo` targeting a `.reveal`/`.anim-item` class in a `useEffect`).
- **Icons**: `lucide-react` is used throughout for iconography (not custom SVGs, except `public/icons.svg`/`public/favicon.svg`).
- **Product images**: Flavor images are referenced from `flavors.ts` as `/images/*.webp` (public-relative paths), not imported as modules — new flavor images should be dropped in `public/images/` as `.png` and run through `npm run optimize:images` (uses `sharp`, `scripts/optimize-images.mjs`) to produce compressed `.webp` output before referencing them; the original PNGs from this product photoshoot were ~1.1MB each and are not committed.

## TypeScript/lint config notes

- `tsconfig.app.json` enables `noUnusedLocals`, `noUnusedParameters`, and `verbatimModuleSyntax` — type-only imports must use `import type`.
- `oxlint` is configured with `react`, `typescript`, and `oxc` plugins (`.oxlintrc.json`); `react/rules-of-hooks` is an error.
