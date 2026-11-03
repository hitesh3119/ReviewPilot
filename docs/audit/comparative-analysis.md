# Comparative Engineering Matrix & Upstream Analysis

- **Audited Repositories**:
  - `ozhehkovski/geoleadscraper` (TypeScript / React / Extension / NestJS)
  - `gosom/google-maps-scraper` (Go / Scrapemate / SQLite / PostgreSQL)
  - `sonagara-vashram/google-maps-scraper` (Python / Direct HTTP / Unlicensed)
- **Document**: Comparative Analysis & Engineering Evaluation
- **Date**: November 2026

---

## 1. Executive Summary

A comprehensive, evidence-based technical audit was conducted across the three upstream repositories. Each project approaches Google Maps data acquisition and processing from a distinct technical paradigm:
1. **GeoLeadScraper** (`ozhehkovski`): Client-side browser extension utilizing DOM mutation and injected content scripts.
2. **Google Maps Scraper** (`gosom`): High-concurrency compiled backend service leveraging Go channels, pure Go SQLite, and optional PostgreSQL SaaS orchestration.
3. **Google Maps Scraper** (`sonagara-vashram`): Procedural Python scripts reverse-engineering internal Google HTTP/protobuf RPC calls.

---

## 2. Comparative Scoring Matrix

All scores are on a 1–10 scale based on audited source files, verified commits, and structural evidence:

| Engineering Dimension | GeoLeadScraper (`ozhehkovski`) | Gosom Scraper (`gosom`) | Sonagara Scraper (`sonagara-vashram`) | ReviewPilot Phase 1 Target |
|:---|:---:|:---:|:---:|:---:|
| **Architecture Quality** | 7/10 | **9/10** | 4/10 | **9.5/10** (Clean separation, typed contracts) |
| **Maintainability** | 6/10 | **8/10** | 3/10 | **9.5/10** (Karpathy simplicity, zero brittle hacks) |
| **Data Model** | 8/10 | **9/10** | 4/10 | **9.5/10** (Strongly typed TypeScript schemas) |
| **Review Handling** | 7/10 | **8/10** | 5/10 | **9.0/10** (Full metadata, sentiment, replies) |
| **Pagination** | 5/10 | **7/10** | 6/10 | **9.0/10** (Cursor-based, token-aware) |
| **Persistence** | 5/10 | **9/10** | 3/10 | **9.5/10** (Local-first SQLite + future Postgres) |
| **Recovery** | 4/10 | **8/10** | 5/10 | **9.0/10** (ACID transactions, job states) |
| **Export Engine** | 8/10 | **8/10** | 4/10 | **9.5/10** (Streaming CSV, XLSX, JSON) |
| **API Design** | 6/10 | **8/10** | 1/10 | **9.0/10** (Typed provider adapters) |
| **UI/UX & Design** | 8/10 | 5/10 | 1/10 | **10/10** (Linear/Vercel/Stripe premium SaaS) |
| **Performance** | 6/10 | **9/10** | 7/10 | **9.5/10** (Vite + React fast bundle, Go backend) |
| **Security & Compliance** | 6/10 | 7/10 | 3/10 | **10/10** (Authorized APIs, local data safety) |
| **Testability & QA** | 5/10 | **7/10** | 1/10 | **9.5/10** (Full automated unit, component & e2e) |
| **Portability** | 6/10 | **9/10** | 5/10 | **9.5/10** (Windows desktop Tauri + web SaaS) |
| **Composite Average** | **6.2 / 10** | **7.9 / 10** | **3.7 / 10** | **9.5 / 10** |

---

## 3. Detailed Comparative Breakdown

### A. Data Acquisition Paradigms
- **In-Browser Extension (`ozhehkovski`)**:
  - *Pros*: Operates within the user's authentic browsing context; handles dynamic JavaScript rendering without headless browser overhead; low setup friction.
  - *Cons*: Highly sensitive to Google Maps DOM class name changes; limited by browser memory and extension sandbox boundaries; cannot run headless background cron jobs.
- **Compiled Go Engine (`gosom`)**:
  - *Pros*: Extreme concurrency with low memory overhead; compiles to a single native binary; clean dual-database architecture; robust background worker queue.
  - *Cons*: In headless mode, requires residential proxy rotation to avoid rapid IP bans; Playwright fallback adds 200MB+ binary dependencies.
- **Direct HTTP RPC (`sonagara-vashram`)**:
  - *Pros*: Extremely lightweight network requests without browser rendering.
  - *Cons*: Brittle protobuf schema decoding; lack of license makes it legally unusable; violates platform terms; high maintenance risk.

### B. Persistence and Data Modeling
- `gosom` provides the gold standard for backend persistence:
  - Local-first embedded SQLite via `modernc.org/sqlite` (CGO-free).
  - Production cloud PostgreSQL via `pgx` and River queue.
- `ozhehkovski` provides the gold standard for frontend domain modeling:
  - Strongly typed TypeScript contracts for `BusinessLocation`, `Review`, `Reviewer`, `Response`, and `EnrichmentData`.
- `sonagara-vashram` uses ad-hoc Python dictionaries and flat CSVs, lacking relational modeling.

### C. UI/UX Quality
- `ozhehkovski` features a responsive React extension UI, but it is confined to a browser extension sidepanel.
- `gosom` includes a utilitarian administrative dashboard for monitoring scraping jobs, lacking modern SaaS polish.
- `sonagara-vashram` has no graphical interface.
- **ReviewPilot Target**: High-end commercial SaaS desktop experience matching Linear, Vercel, and Stripe aesthetics with dark/light themes, keyboard shortcuts, dense interactive data tables, and refined typography.

---

## 4. Key Takeaways for ReviewPilot Architecture

1. **Adopt Gosom's Dual-Database Pattern**: Local SQLite for portable desktop execution, designed with PostgreSQL schema compatibility for future cloud sync.
2. **Adopt GeoLeadScraper's TypeScript Domain Contracts**: Standardize on comprehensive TypeScript schemas for businesses and reviews.
3. **Reject All Unlicensed & Evasion Code**: Discard all code from `sonagara-vashram`. Strictly reject proxy rotation, anti-detection, and scraping of undocumented endpoints across all upstreams.
4. **Build a Unified, Premium React + Vite Desktop Interface**: Provide a commercial-grade user experience with full automated test coverage.

