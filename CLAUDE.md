# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm run dev            # start Vite dev server with HMR
npm run build           # type-check (tsc -b, project references) then production build via Vite
npm run lint             # run oxlint
npm run preview          # serve the production build locally
npm run typecheck:api     # type-check api/ (Vercel serverless functions) against tsconfig.api.json — NOT run by `build`
npm run optimize:images   # compress public/images/*.png to .webp via sharp (scripts/optimize-images.mjs)
```

There is no test suite/framework configured in this project (no test runner in `package.json`). `npm run build` does not type-check `api/` — run `npm run typecheck:api` separately when editing `api/chat.ts`.

## Architecture

This is a single-page marketing/showcase site for a whey protein brand ("PROTEIN3D"), built with React 19 + TypeScript + Vite, routed client-side via `react-router-dom`, and animated with GSAP. UI copy and content is in Turkish. It deploys to Vercel (`vercel.json`), combining a static SPA build with one serverless function.

- **Entry / shell**: `src/main.tsx` mounts `<App>` inside `<BrowserRouter>`. `src/App.tsx` wraps everything in `<CartProvider>` and renders the sticky navbar (with active-route highlighting via `useLocation`, and a cart button showing item count), a `<Routes>` block wiring three route-level-code-split pages (`lazy()` + `Suspense`): `/` → `HomePage`, `/nutrition` → `NutritionPage`, `/contact` → `ContactPage`, then `Footer`, `AiAssistant`, `CartDrawer`, and `CheckoutModal` rendered outside `<Routes>` so they persist across page navigation.
- **Styling**: Almost all styling is inline `style={{...}}` objects directly on JSX elements rather than CSS classes/modules — `src/App.css`/`src/index.css` only carry minimal base styles (plus a few animation keyframes referenced by className, e.g. `ai-bounce`, `ai-pulse-ring`, `ai-border-shimmer`). When editing UI, follow this inline-style convention rather than introducing a new styling system.
- **Content/data-driven product carousel** (`src/pages/HomePage.tsx` + `src/data/flavors.ts`): The `FLAVORS` array in `flavors.ts` is the single source of truth for each product flavor (id, title, description, price, color/rgba theme, image path, badge, nutrition stats) — it's also imported server-side by `api/chat.ts` to ground the AI assistant's answers. `HomePage` renders a horizontally-scrollable carousel driven off `activeIdx` into this array; adding/editing a flavor is normally a `flavors.ts`-only change, and per-flavor accent colors (`color`/`rgba`) cascade through cursor, particles, glows, and modal styling automatically.
- **Interaction layer in `HomePage`**: This component is the most complex file in the app and combines several independent GSAP-driven systems, coordinated through refs (not state, to avoid re-render churn) rather than component composition:
  - A custom mouse-follower cursor (`gsap.quickTo` on `cursorRef`) that replaces the native cursor (`cursor: 'none'` is set throughout).
  - Pointer-based drag/swipe carousel logic (`handlePointerDown/Move`, `endDrag`) with its own threshold/velocity handling, decoupled from click handling so a drag release doesn't fire a click on the card underneath.
  - Keyboard (arrow keys) and wheel (horizontal scroll) navigation, both funneling into `triggerExplosiveTransition`.
  - A responsive step-distance measurement (`stepRef`) recalculated on resize since card size is `clamp()`-based rather than fixed.
  - A "product details" modal opened via GSAP timeline that scatters/reassembles content cards (`.modal-ing-1..4`) around a centered product bottle image; modal z-index (2000+) must stay above the sticky navbar (1000).
- **Cart + checkout (frontend-only demo)**: `src/context/cartStore.ts` defines `CartContext`/`CartItem` types; `src/context/CartContext.tsx` (`CartProvider`) holds cart items and open/closed UI state (`isCartOpen`, `isCheckoutOpen`) in plain `useState` — nothing persists across a page reload and nothing is sent to a server. `src/hooks/useCart.ts` is the consumer hook (throws if used outside `CartProvider`). `src/components/CartDrawer.tsx` lists items/quantities and opens `CheckoutModal`; `src/components/CheckoutModal.tsx` drives a multi-step checkout UI paired with `src/components/AnimatedCreditCard.tsx` (a GSAP-animated interactive card that flips/updates as the user types) — this never talks to a real payment processor, it's a visual demo.
- **AI nutrition assistant**: `src/components/AiAssistant.tsx` is a fixed bottom-right chat widget (Turkish, "AI Beslenme Asistanı") rendered on every page, mounted outside `<Routes>` in `App.tsx`. It POSTs to `/api/chat` (a Vercel serverless function, `api/chat.ts`) which calls the Anthropic API via `@anthropic-ai/sdk` using `FLAVORS` data to build its system prompt; `ANTHROPIC_API_KEY` (see `.env.example`) is read server-side only and never exposed to the client. If the key is unset, `api/chat.ts` falls back to a keyword-matched mock reply (`mockReply`) so the widget still works without a key. The panel header embeds `src/components/SplineRobot.tsx`, a lazy-loaded (`lazy(() => import('@splinetool/react-spline'))`) interactive 3D robot scene that's skipped in favor of a static icon badge when `src/utils/deviceCapability.ts`'s `shouldLoadHeavy3D()` detects save-data mode, a slow connection, or low device memory.
- **Effects components**: `src/components/ParticleBackground.tsx` (raw `<canvas>` + `requestAnimationFrame` particle field, colored per active flavor), `src/components/BurstCanvas.tsx` (imperative-handle component exposing `triggerBurst(x, y, color, rgba, emoji)` — spawns transient DOM nodes animated with GSAP for the "burst" effect on product click, including flavor-specific emoji particles via `FLAVOR_EMOJI` in `HomePage.tsx`), and `src/components/LiquidDripCanvas.tsx` (a canvas-based liquid drip effect used in checkout). All manage their own animation loops/cleanup in `useEffect`.
- **Other pages** (`NutritionPage.tsx`, `ContactPage.tsx`) are simpler, mostly-static content pages using a shared "reveal on mount" GSAP fade/stagger pattern (`gsap.fromTo` targeting a `.reveal`/`.anim-item` class in a `useEffect`, see `src/utils/scrollReveal.ts`).
- **Icons**: `lucide-react` is used throughout for iconography (not custom SVGs, except `public/icons.svg`/`public/favicon.svg`).
- **Product images**: Flavor images are referenced from `flavors.ts` as `/images/*.webp` (public-relative paths), not imported as modules — new flavor images should be dropped in `public/images/` as `.png` and run through `npm run optimize:images` (uses `sharp`, `scripts/optimize-images.mjs`) to produce compressed `.webp` output before referencing them; the original PNGs from this product photoshoot were ~1.1MB each and are not committed.

## TypeScript/lint config notes

- `tsconfig.app.json` (the frontend, checked by `npm run build`) enables `noUnusedLocals`, `noUnusedParameters`, and `verbatimModuleSyntax` — type-only imports must use `import type`.
- `tsconfig.api.json` covers `api/` + `src/data/flavors.ts` separately (checked only by `npm run typecheck:api`, targets Node/`es2023`) with the same `verbatimModuleSyntax`/`noUnusedLocals`/`noUnusedParameters` strictness.
- `oxlint` is configured with `react`, `typescript`, and `oxc` plugins (`.oxlintrc.json`); `react/rules-of-hooks` is an error.
