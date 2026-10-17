# Post-Migration Optimization & Feature Plan

This plan outlines high-impact improvements to be implemented following the successful dependency upgrade and SEO enhancement phase.

## 1. Build Performance Optimization
**Goal:** Reduce build times by streamlining the CSS pipeline.
- [x] **Action:** Evaluate if `postcss-purgecss` is still necessary. Tailwind v4's native engine often replaces the need for external purging tools.
- [x] **Task:** Temporarily disable PurgeCSS, run a production build, and compare bundle sizes. (Result: PurgeCSS is still significantly reducing bundle size, build time impact is manageable).

## 2. Progressive Web App (PWA) Support
**Goal:** Improve mobile user experience and gain an SEO boost.
- [x] **Action:** Create a `src/static/manifest.json` file.
- [x] **Task:** 
    - [x] Define app name, theme colors (using your primary orange `#ff6600`), and icons.
    - [x] Reference the manifest in the HTML head via `src/server/ssrBase.ts`.
    - [x] Ensure manifest is served at root via `src/server/entryBase.ts`.
    - [x] Update build script in `src/server/build.ts` to copy manifest to dist.

## 3. Sitemap Localization
**Goal:** Ensure Google discovers all translated content.
- [x] **Action:** Audit `src/server/sitemapF.ts`.
- [x] **Task:** Verify that the sitemap generator iterates through all `localizedRoutes` (both `de` and `en`) and includes them in the final `sitemap.xml` with appropriate alternate links.

## 4. Address Technical Debt (@todo)
**Goal:** Complete pending features and refine logic.
- [x] **Uni Kino:** Finalize the "Sommerspecial" integration logic in `uniKino.vue`. (Added detection for 'NW2' location and fixed date formatting).
- [x] **Consultation Hours:** Refine the filtering logic for "initialTime" in `feriensprechstunden.vue` to prevent edge-case filtering errors on the same day. (Used store's initialTime and added 'bis' time check).
- [x] **Graphql Middleware:** Review and polish the network middleware in `graphql.ts` for better robustness. (Improved polling logic and error logging).

## 5. Automated Testing Framework
**Goal:** Prevent regressions during future updates.
- [ ] **Action:** Set up **Vitest** for unit testing shared utilities and **Playwright** for E2E testing critical user paths.
- [ ] **Key Tests:** 
    - Language switcher functionality.
    - Dynamic event schema generation.
    - Route localization logic.

---

## Progress Tracking
- [x] Build Optimization (PurgeCSS check) - *PurgeCSS kept for now due to significant size reduction*
- [x] PWA Manifest implementation
- [x] Sitemap localization verification
- [x] Address @todo in `uniKino.vue`
- [x] Address @todo in `feriensprechstunden.vue`
- [x] Polish Graphql middleware
- [ ] Initialize testing framework
