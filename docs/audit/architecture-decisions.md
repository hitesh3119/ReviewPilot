# Architecture Decision Records (ADRs)

- **Product**: ReviewPilot
- **Scope**: Unified Core Architecture, Technology Stack, and Design Patterns
- **Date**: November 2026

---

## ADR-001: Desktop Framework Selection (Tauri 2 vs. Electron)

- **Status**: **ACCEPTED**
- **Context**: ReviewPilot requires a portable desktop runtime for Windows (and cross-platform), with minimal memory usage, fast startup, and native installer capabilities.
- **Decision**: Adopt **Tauri 2**.
  - Tauri uses native OS webviews (WebView2 on Windows), reducing bundle sizes from ~120MB (Electron) to ~10MB.
  - Rust/Tauri 2 backend provides native OS window chrome, system tray, notifications, and secure filesystem access.
- **Consequences**:
  - Requires Windows WebView2 runtime (pre-installed on Windows 10/11).
  - Clean separation between frontend (React/Vite) and native host.

---

## ADR-002: Frontend Architecture & Design System

- **Status**: **ACCEPTED**
- **Context**: The product must deliver an elite commercial SaaS experience (inspired by Linear, Vercel, and Stripe) with high data density, instant search, responsive data tables, keyboard shortcuts, and dark/light themes.
- **Decision**: Adopt **React 18/19 + TypeScript + Vite + Tailwind CSS + Lucide Icons**.
  - Strict TypeScript types (`strict: true`) for all domain models.
  - Component-driven architecture using atomic design: `atoms`, `molecules`, `organisms`, `layouts`, `views`.
  - Native CSS variables for dynamic theme toggling (Light default, Dark option).
- **Consequences**:
  - Rapid hot-module reloading in development.
  - Zero heavy third-party UI framework bloat.
  - Full automated component testability via Vitest and Playwright.

---

## ADR-003: Storage & Persistence Strategy (Local-First SQLite to Cloud PostgreSQL)

- **Status**: **ACCEPTED**
- **Context**: ReviewPilot is a local-first application where users retain full ownership and privacy over their review intelligence data, with future cloud synchronization.
- **Decision**: Implement a **Dual-Driver Database Architecture**:
  - **Local Desktop**: Embedded SQLite (`modernc.org/sqlite` or `tauri-plugin-sql` / SQLCipher) storing data in the user's local application data folder (`%APPDATA%/ReviewPilot`).
  - **Cloud/SaaS Mode**: PostgreSQL-compatible schema with relational migrations.
- **Consequences**:
  - Zero cloud dependency for core desktop operations.
  - Full offline capability.
  - Seamless migration path to multi-tenant cloud PostgreSQL in Phase 5.

---

## ADR-004: Data Ingestion & Compliance Boundary

- **Status**: **ACCEPTED**
- **Context**: Upstream tools utilize brittle DOM scraping, proxy pools, and undocumented RPC calls that violate Google Terms of Service and break frequently.
- **Decision**: Strictly enforce an **Authorized Provider Adapter Pattern**:
  - `GoogleBusinessProfileProvider`: Uses official OAuth 2.0 and Google Business Profile API to fetch verified locations and reviews for business owners.
  - `GooglePlacesApiProvider`: Uses official Google Places API (New) for location discovery within authorized caching quotas.
  - `FileImportProvider`: Ingests user-provided data files (Google Takeout JSON, CSV review dumps).
  - **Hard Prohibition**: NO proxy rotation, NO headless browser scraping of Google Maps, NO CAPTCHA evasion, and NO undocumented internal RPC endpoints.
- **Consequences**:
  - Rock-solid stability; immune to Google Maps HTML/DOM class name mutations.
  - 100% compliant with enterprise security and platform terms.
  - When third-party providers do not supply full review text, the UI displays explicit provider metadata rather than fabricating data.

---

## ADR-005: Multi-Format Export Engine

- **Status**: **ACCEPTED**
- **Context**: Users require one-click exports into CSV, Excel (XLSX), and JSON for downstream CRM, spreadsheet analysis, and reporting.
- **Decision**: Implement a modular, client-side streaming export pipeline in TypeScript.
  - **CSV**: RFC 4180 compliant with proper field escaping, quote wrapping, and UTF-8 BOM encoding for Excel compatibility.
  - **JSON**: Formatted, human-readable structured output preserving full nested review metadata.
  - **XLSX**: Clean XML-based spreadsheet generation without vulnerable legacy dependencies.
- **Consequences**:
  - Exports process in milliseconds directly in memory without server round-trips.

