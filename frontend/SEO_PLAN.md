# SEO and Metadata Improvement Plan

This plan outlines the steps to further optimize the FSMPI website for search engines (Google) and social media platforms.

## Objectives
- Improve multilingual indexing using `hreflang`.
- Enhance search result appearance with JSON-LD Structured Data.
- Prevent duplicate content issues with Canonical URLs.
- Improve social media linking.

## Proposed Tasks

### 1. Multilingual Optimization (`hreflang`)
Add `<link rel="alternate" hreflang="..." href="..." />` tags to the HTML head. This helps Google serve the correct language version to users based on their region.
- **Location:** `src/indexHtml.ts` (or wherever the base template is generated).
- **Target Languages:** `de`, `en`, and `x-default`.

### 2. Canonical URLs
Add a `<link rel="canonical" href="..." />` tag to ensure Google treats one URL as the primary version, preventing SEO dilution from duplicate URLs.
- **Location:** `src/indexHtml.ts` or handled via SSR context in `src/server/entryProduction.ts`.

### 3. JSON-LD Structured Data (Organization)
Implement a `<script type="application/ld+json">` block on the homepage to define the Fachschaft as an Organization.
- **Fields:** Name, Logo, URL, and Social Media profiles.
- **Social Profiles:** Instagram, Facebook (based on files found in `src/static`).

### 4. Dynamic Event Schema
Ensure that events like **Uni Kino** and **NW2-Party** generate JSON-LD `Event` blocks dynamically.
- **Check:** `src/shared/tags/registration.ts` and `src/components/main/nw2_party.vue`.

### 5. Social Media Integration
Update the meta tags to explicitly link to official social profiles if available.

---

## Execution Steps

1. **Research:** Examine `src/indexHtml.ts` and `src/server/entryProduction.ts` to see how the HTML head is constructed.
2. **Implementation (Tags):** Add Canonical and Hreflang logic.
3. **Implementation (JSON-LD):** Create a utility or component to inject the Organization schema.
4. **Verification:** Validate the generated HTML using local `curl` or by inspecting the SSR output.
