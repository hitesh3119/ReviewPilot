# ReviewPilot — Google Business Reviews Intelligence

> **ReviewPilot** is a premium, local-first Google Business Reviews Intelligence desktop application, designed as a portable Windows product with optional SaaS synchronization.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Phase](https://img.shields.io/badge/Phase-1%20Complete-emerald.svg)]()
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Tailwind-indigo.svg)]()

---

## 🌟 Key Features (Phase 1)

- **Local-First Architecture**: Your review data stays on your device in embedded SQLite, with zero unwanted cloud tracking.
- **Strict Compliance Boundary**: No fragile web scraping, no proxy rotation, and no bot evasion. Operates via authorized Google Business Profile APIs, Places API within documented terms, and user data imports.
- **Premium SaaS Aesthetic**: Commercial-grade interface inspired by Linear, Stripe, and Vercel. Light theme by default with optional Dark mode.
- **Interactive Review Explorer**: Star rating tabs, sentiment filters, instant keyword search, and detailed slide-in review inspection drawer.
- **Multi-Format Export Engine**: Client-side streaming generation for RFC 4180 CSV (with UTF-8 BOM), Microsoft Excel XML, and structured JSON.
- **Analytics & Trends**: Rating stability trajectories, review acquisition velocity, and semantic topic clusters.

---

## 🏗️ Architecture & Technology Stack

```
+-------------------------------------------------------------------+
|                        ReviewPilot Stack                          |
+-------------------------------------------------------------------+
| Desktop Host:     Tauri 2 (Rust / Native Windows WebView2)        |
| Frontend Engine:  React 18 + TypeScript + Vite + Tailwind CSS      |
| Design Aesthetic: Linear / Stripe / Vercel-inspired SaaS          |
| Icons:            Lucide React                                    |
| Local Database:   SQLite 3 (Local-first, portable %APPDATA%)       |
| Cloud Database:   PostgreSQL (Future multi-tenant synchronization)|
| Export Pipeline:  RFC 4180 CSV, Formatted JSON, Excel XML         |
+-------------------------------------------------------------------+
```

---

## 📚 Technical Audit & Architecture Documentation

Full technical audits of three upstream repositories, comparative analysis, and architecture decisions are available in `docs/`:

- [Phase 1 Execution Report](docs/PHASE_1_REPORT.md)
- [Permanent Engineering Rules (AGENTS.md)](AGENTS.md)
- [Audit: ozhehkovski/geoleadscraper](docs/audit/geoleadscraper-audit.md)
- [Audit: gosom/google-maps-scraper](docs/audit/gosom-audit.md)
- [Audit: sonagara-vashram/google-maps-scraper](docs/audit/sonagara-audit.md)
- [Comparative Engineering Analysis](docs/audit/comparative-analysis.md)
- [Component Reuse Decision Matrix](docs/audit/component-reuse-matrix.md)
- [Dependency & Supply-Chain Audit](docs/audit/dependency-audit.md)
- [Security & Vulnerability Audit](docs/audit/security-audit.md)
- [Legal, Licensing & Attribution Audit](docs/audit/license-and-attribution.md)
- [Architecture Decision Records (ADRs)](docs/audit/architecture-decisions.md)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation
```bash
git clone https://github.com/hitesh3119/ReviewPilot.git
cd ReviewPilot
npm install
```

### Development
```bash
npm run dev
```

### Automated Testing
```bash
npm run test
```

### Production Build
```bash
npm run build
```

---

## 🔒 Security & Data Boundary Guarantee

ReviewPilot does **NOT** engage in automated DOM scraping of Google Maps, CAPTCHA circumvention, user-agent spoofing, or proxy rotation. All data ingestion is architected through authorized Google Business Profile APIs, Google Places API within usage limits, and user-provided data imports.

---

## 📄 License & Attribution

This project is licensed under the [MIT License](LICENSE). Architectural patterns adapted from upstream open-source projects are documented in [docs/audit/license-and-attribution.md](docs/audit/license-and-attribution.md).
