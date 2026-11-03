# AGENTS.md — Permanent Engineering & Architectural Rules

Welcome to **ReviewPilot**. This document defines the non-negotiable architectural standards, design principles, security constraints, and quality gates for all AI agents and engineers working on this repository.

---

## 1. Core Engineering Principles (Andrej Karpathy Inspired)

1. **Think Before Coding**:
   - Understand the problem completely before writing or modifying code.
   - Surface hidden assumptions, evaluate trade-offs, and design for simplicity.
   - Inspect upstream constraints and existing signatures before introducing new abstractions.
2. **Simplicity Over Abstraction**:
   - Prefer small, readable, explicit logic over speculative generalized frameworks.
   - If a solution can be implemented cleanly in 50 lines, avoid building a 200-line multi-layer abstraction.
   - Never implement speculative features ("YAGNI" — You Aren't Gonna Need It).
3. **Surgical, Scoped Changes**:
   - Confine modifications strictly to the task at hand.
   - Never refactor unrelated code, reformat arbitrary files, or silently delete comments.
4. **Goal-Driven & Verifiable Execution**:
   - Every feature, bug fix, or refactor must be backed by verifiable automated tests.
   - Never declare a task complete without empirical verification (linting, type-checking, automated tests, and build checks).

---

## 2. Hard Security & Compliance Boundaries

> [!CAUTION]
> **STRICT COMPLIANCE MANDATE**:
> ReviewPilot is an enterprise-grade, privacy-respecting intelligence product. The following practices are **STRICTLY FORBIDDEN**:

1. **No Bot Evasion or Scraping Hacks**:
   - NEVER implement proxy rotation, user-agent spoofing, CAPTCHA bypasses, or anti-detection mechanisms.
   - NEVER query undocumented Google internal endpoints (e.g. `/maps/rpc/*` or raw `APP_INITIALIZATION_STATE` scraping).
2. **Authorized Data Ingestion Only**:
   - Ingest data exclusively through authorized Google Business Profile APIs, Places API within documented terms, or user-provided data imports (Takeout, CSV, JSON).
3. **Zero Secrets in Git**:
   - Never commit API keys, OAuth client secrets, session cookies, database credentials, or private review datasets.
   - All credentials must be stored in environment variables or OS native credential vaults.
4. **Honest Data Representation**:
   - Never fabricate mock data as real Google data. Clearly label mock data fixtures with explicit `MOCK DATA` indicators in the UI.

---

## 3. Technology Stack & Architecture Standards

```
+-------------------------------------------------------------------+
|                        ReviewPilot Stack                          |
+-------------------------------------------------------------------+
| Desktop Host:     Tauri 2 (Rust / Native WebView2)                |
| Frontend Engine:  React 18/19 + TypeScript + Vite + Tailwind CSS  |
| Design Aesthetic: Linear / Stripe / Vercel-inspired SaaS          |
| Icons:            Lucide React                                    |
| State Management: Lightweight React Context / Custom Hooks        |
| Local Database:   SQLite (Local-first, portable `%APPDATA%`)       |
| Cloud Database:   PostgreSQL (Future multi-tenant sync)           |
| Export Pipeline:  RFC 4180 CSV, Formatted JSON, XLSX             |
+-------------------------------------------------------------------+
```

### Module Structure
```text
src/
├── components/          # Reusable UI primitives (atoms, molecules, organisms)
│   ├── ui/              # Buttons, inputs, badges, modals, drawers, tables
│   ├── layout/          # Sidebar, header, navigation, shell
│   └── charts/          # Rating distribution, trend sparklines
├── features/            # Feature-based domain modules
│   ├── overview/        # Dashboard KPIs, quick actions, sync status
│   ├── businesses/      # Business directory, location cards, add business
│   ├── reviews/         # Review table, star filters, detail drawer
│   ├── analytics/       # Sentiment analysis, rating trends, keyword topics
│   ├── exports/         # Export configuration, history, file generation
│   └── settings/        # Preferences, theme toggling, storage info
├── types/               # TypeScript domain contracts and interfaces
├── lib/                 # Core utilities, formatters, and export helpers
└── mock/                # Typed, realistic mock fixtures (clearly labeled)
```

---

## 4. Mandatory Quality Gates

Before declaring any phase or pull request complete, the following gates must be verified:

1. **TypeScript Verification**: Zero type errors (`npm run type-check` or `tsc --noEmit`).
2. **Lint & Code Formatting**: Zero lint errors or unescaped JSX issues.
3. **Automated Unit & Component Tests**: Comprehensive tests covering all views, calculations, and data exporters.
4. **Production Build**: Zero build errors (`npm run build`).
5. **UI & Responsive Verification**: Layout must be verified across desktop (1440x900) and laptop (1024x768) viewports.
6. **Clean Git Hygiene**: No leftover scratch files, no untracked binaries, no secrets.

