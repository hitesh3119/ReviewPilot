# Upstream Repository Technical Audit: GeoLeadScraper

- **Repository**: `ozhehkovski/geoleadscraper`
- **URL**: [https://github.com/ozhehkovski/geoleadscraper](https://github.com/ozhehkovski/geoleadscraper)
- **Primary Language**: TypeScript / JavaScript
- **Ecosystem**: Node.js, pnpm workspaces, Turborepo, React, Vite, Manifest V3 Chrome Extension, NestJS
- **Declared License**: MIT License
- **Auditor**: Principal Software Architect & Security Reviewer
- **Date**: November 2026
- **Audit Methodology**: Based on remote GitHub repository tree inspection, source code analysis, dependency manifests (`package.json`, `pnpm-workspace.yaml`, `manifest.json`), commit histories, and public documentation rather than a local clone.

---

## 1. Repository Inventory & Structure

The repository is structured as a TypeScript monorepo using `pnpm` workspaces and `Turborepo`:

```text
ozhehkovski/geoleadscraper/
├── .github/
│   └── workflows/
│       ├── build.yml
│       └── release.yml
├── apps/
│   ├── api/                           # NestJS backend + MCP server
│   │   ├── src/
│   │   │   ├── mcp/                   # Model Context Protocol tools & server
│   │   │   ├── scraper/               # Puppeteer-based scraper engine
│   │   │   ├── enrichment/            # Contact enrichment service
│   │   │   └── main.ts                # Backend bootstrap entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── extension/                     # Chrome Manifest V3 Extension
│       ├── chrome-extension/          # Extension manifest & background workers
│       │   ├── manifest.json          # MV3 configuration
│       │   └── service-worker.ts      # Background event dispatcher
│       ├── pages/                     # UI panels (Popup, Options, Side Panel)
│       │   ├── popup/
│       │   └── sidepanel/
│       ├── packages/
│       │   ├── shared/                # Shared utilities & config
│       │   │   └── config.ts
│       │   └── storage/               # Browser chrome.storage abstractions
│       ├── src/                       # Injected content scripts & scrapers
│       │   ├── content/
│       │   │   ├── gmaps.ts           # Google Maps DOM observer & selector parser
│       │   │   ├── yandex.ts          # Yandex Maps parser
│       │   │   └── dgis.ts            # 2GIS parser
│       │   └── exporters/             # File export utilities (CSV, XLSX, JSON)
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
├── package.json                       # Monorepo root package.json
├── pnpm-workspace.yaml                # pnpm workspace definition
├── turbo.json                         # Turborepo task pipeline configuration
├── LICENSE                            # MIT License file
└── README.md                          # Documentation and build instructions
```

### Manifest & Build Configurations
- **Extension Manifest**: Chrome Manifest V3 (`manifest.json`), requesting permissions: `activeTab`, `storage`, `unlimitedStorage`, `scripting`, and host permissions for `*://*.google.com/maps/*`, `*://*.yandex.ru/maps/*`, `*://*.2gis.ru/*`.
- **Package Manager**: `pnpm` workspace with scripts:
  - `pnpm dev:extension`
  - `pnpm dev:api`
  - `pnpm build:extension`
  - `pnpm type-check`
- **Lockfile**: `pnpm-lock.yaml`.

---

## 2. Source-Code & Architectural Analysis

### A. Data Acquisition Architecture
- **DOM Traversal & Content Script Injection**: Operates client-side within the user's browser session. Injects `gmaps.ts` content script into Google Maps tabs.
- **Scroll & Render Triggering**: Simulates user scrolling on the maps results pane (`div[role="feed"]`) to force Google Maps virtualized list items to render into the DOM.
- **Review Scraping Mechanism**: Opens the place's reviews tab, iteratively triggering scroll events on the reviews container.
- **Extracted Fields**:
  - **Business Profile**: Place name, category, address, phone number, website URL, coordinates (latitude, longitude), opening hours, claimed status.
  - **Review Attributes**: Author name, author profile URL, star rating (1–5), review text, publication timestamp, owner response text, response date, review photos, review language, and translated review content.
  - **Enrichment**: Secondary client-side or backend HTTP fetch of the business website to parse email addresses and social links (Facebook, LinkedIn, Instagram, X/Twitter).

### B. Persistence, Storage, and Recovery
- **Chrome Storage API**: Uses `chrome.storage.local` to store ongoing scrape jobs and accumulated lead records.
- **State Checkpointing**: Minimal checkpointing. If the tab crashes or reloads, scraping progress can be lost unless intermediate records were serialized to `chrome.storage`.
- **Deduplication**: Deduplicates based on Place ID or Place Title + Address matching in an in-memory Set before appending to state.

### C. Export Implementation
- **Formats Supported**: CSV, XLSX (via SheetJS `xlsx`), and raw JSON.
- **Download Dispatch**: Triggers browser downloads via `URL.createObjectURL(new Blob(...))` or `chrome.downloads.download`.

---

## 3. Security & Vulnerability Analysis

1. **DOM Selector Fragility**:
   - Google Maps obfuscates class names and updates its DOM layout continuously. Any change to DOM attributes triggers null pointer errors (`Cannot read properties of null`).
2. **CORS & CSP Restrictions**:
   - Client-side website enrichment (fetching external business websites to scrape email addresses) is blocked by browser Content Security Policy (CSP) and Cross-Origin Resource Sharing (CORS) unless routed through a background worker or proxy.
3. **Session Interception Risk**:
   - Because deep review scraping requires the user to be logged in to Google Maps in their browser, the content script runs inside an authenticated session. Injecting untrusted scripts or having vulnerabilities in the extension could expose session tokens.
4. **Supply Chain Risks**:
   - Monorepo pulls dependencies across React, Vite, Turborepo, NestJS, Puppeteer, and SheetJS. SheetJS has known security advisories regarding prototype pollution in older versions.

---

## 4. Legal & Licensing Analysis

- **License**: MIT License (`LICENSE` file present).
- **Legally Reusable Patterns**:
  - UI layout structures for review listings.
  - TypeScript interface definitions for Review and Business records.
  - Client-side export formatting logic (CSV/JSON/XLSX generation).
- **Platform Terms Boundary**:
  - Scraping Google Maps through DOM injection violates Google Maps Terms of Service (Section 3.2.3: restrictions on scraping, bulk downloading, and creating independent databases of Google content).
  - For ReviewPilot, we must NOT replicate automated DOM scraping. ReviewPilot must prioritize authorized Google Business Profile APIs, Places API within allowable terms, and user-provided data imports (Google Takeout / CSV / JSON).

---

## 5. Architectural Evaluation & Scoring

| Dimension | Score (1-10) | Evidence / File Path | Rationale |
|:---|:---:|:---|:---|
| **Architecture Quality** | 7/10 | `apps/extension`, `apps/api` | Clean monorepo structure with Turborepo; good separation of UI and content script. |
| **Maintainability** | 6/10 | `src/content/gmaps.ts` | High maintenance burden due to Google Maps DOM selector drift. |
| **Data Model** | 8/10 | `packages/shared/config.ts` | Well-defined TypeScript interfaces for places, reviews, and enrichment. |
| **Review Handling** | 7/10 | `src/content/gmaps.ts` | Captures author, stars, text, owner reply, dates, and photos cleanly. |
| **Pagination** | 5/10 | Injected scroll handlers | DOM scrolling is prone to rate-limiting and browser freeze. |
| **Persistence** | 5/10 | `packages/storage/` | Relies on `chrome.storage.local` with no relational queries or ACID properties. |
| **Recovery** | 4/10 | In-memory queue | Browser tab reload aborts active job; partial recovery only. |
| **Export** | 8/10 | `src/exporters/` | Clean multi-format export (CSV, XLSX, JSON). |
| **API Design** | 6/10 | `apps/api/src/` | Basic NestJS controller; MCP server is a nice modern addition. |
| **UI/UX** | 8/10 | `pages/popup`, `pages/sidepanel` | Clean React/Vite UI with intuitive sidepanel and progress counters. |
| **Performance** | 6/10 | Chrome extension sandbox | Heavy DOM manipulation causes UI stutter on large datasets. |
| **Security** | 6/10 | `manifest.json` | Broad host permissions required; potential authenticated session exposure. |
| **Testability** | 5/10 | `package.json` | Lacks end-to-end integration tests; relies primarily on static `type-check`. |
| **Portability** | 6/10 | MV3 extension | Restricted to Chromium browsers. |

**Overall Score**: 6.2 / 10

---

## 6. Component Reuse Decision

- **TypeScript Data Contracts**: `REUSE` / `ADAPT`. The `Review` and `BusinessLocation` data shapes are well-modeled and license-compatible under MIT.
- **Export Utilities (CSV/JSON/XLSX)**: `ADAPT`. Pure data transformation logic can be adopted for our local export engine.
- **DOM Scraping Scripts (`gmaps.ts`)**: `REJECT`. Brittle, violates platform terms, and breaks architectural principle of authorized APIs / local-first imports.
- **MCP Server Pattern**: `ADAPT` for future integration phases.

