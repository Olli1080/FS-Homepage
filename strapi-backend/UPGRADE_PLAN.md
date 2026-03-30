# Strapi Upgrade Plan & Migration Record

This document records the safe upgrade path from Strapi v4.8.2 to v5.x for the `strapi-backend` project.

## 📋 Status Overview
- **Current Version:** v4.26.1 (Intermediate Baseline reached)
- **Target Version:** v5.x
- **Build Environment:** Node.js v20.20.1 (Required for Phase 1)

---

## 🔍 Discoveries & Decisions
1. **Node.js Compatibility:** 
   - *Discovery:* Strapi 4.26.1 fails to build on Node 22 due to `ajv` resolution errors.
   - *Decision:* Installed Node 20 via Winget (`OpenJS.NodeJS.20`) and used it for the intermediate build.
2. **Middleware Order:** 
   - *Discovery:* Versions 4.15.5+ require `strapi::logger` at the top of the array to prevent boot crashes.
   - *Decision:* Refactored `config/middlewares.ts` to move logger to position `[0]`.
3. **Database Integrity:** 
   - *Discovery:* A known bug in the 4.7->4.11 path causes `NULL` folder paths for root images.
   - *Decision:* Created a manual migration script: `database/migrations/2023.06.14T00.00.00.update-file-paths.js`.
4. **Peer Dependencies:** 
   - *Discovery:* Late v4 builds require explicit React 18+ and Styled-Components 5+ dependencies.
   - *Decision:* Manually installed `react`, `react-dom`, `react-router-dom`, and `styled-components`.
5. **Patch Deprecation:** 
   - *Discovery:* The legacy GraphQL patch for 4.4.5 is incompatible with the 4.26.1 compiled plugin structure.
   - *Decision:* Removed the patch. Playground may now require authentication.
6. **i18n Core Integration (Strapi 5):**
   - *Discovery:* `@strapi/plugin-i18n` is no longer a standalone package in v5; it is now a core feature.
   - *Decision:* Maintain for Phase 1 (v4.26.1). Remove during Phase 2 (v5) to avoid dependency conflicts.

---

## ⚠️ Uncertainties & Risks
- **v5 Plugin Support:** `strapi-plugin-translate` lacks a stable v5 release. 
  - *Mitigation:* Evaluate "LLM Translator" as a replacement if no update is available at Phase 2.
- **GraphQL Playground Access:** The impact of removing the authentication patch is untested.
  - *Mitigation:* Re-implement via Strapi 5 Middleware if unauthenticated dev access is mandatory.
- **Document Service Mapping:** The custom image processing in `lifecycles.ts` uses deep Entity Service calls. 
  - *Mitigation:* Requires a complete rewrite using `strapi.documents` in Phase 2.

---

## 🚀 Execution Roadmap

### Phase 1: Docker Baseline (COMPLETED LOCALLY)
- [x] Update `package.json` to 4.26.1.
- [x] Apply middleware reordering.
- [x] Create mandatory DB migration script.
- [x] Successful build on Node 20.
- [ ] **Next Step:** Update `Dockerfile` to `FROM node:20-bullseye-slim` and redeploy to stabilize the v4 database.

### Phase 2: Major Migration (v4 -> v5)
- [ ] **Backup:** Create a full SQL dump of the PostgreSQL database.
- [ ] **Automated Tool:** Run `npx @strapi/upgrade major`.
- [ ] **Cleanup:** Ensure `@strapi/plugin-i18n` is removed from `package.json` (now in core).
- [ ] **Manual Refactoring:**
    - [ ] `src/index.ts`: Update GraphQL extensions.
    - [ ] `lifecycles.ts`: Refactor image processing for the Document Service API.
- [ ] **Docker Update:** Change to `FROM node:22-bullseye-slim`.
- [ ] **First Boot:** Run `npm run develop` to trigger the irreversible v5 data migration.

---

## 🛠️ Verification Checklist
- [ ] Media Library displays all files (verify `folder_path` migration).
- [ ] GraphQL API handles network-token validation in `src/index.ts`.
- [ ] Automated image resizing in `NW-2-Party` lifecycles triggers correctly.
- [ ] All 44+ existing tests pass on the new version.
