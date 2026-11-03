# Upstream Dependency Audit & Vulnerability Assessment

- **Scope**: Third-party dependency manifests across `ozhehkovski/geoleadscraper`, `gosom/google-maps-scraper`, and `sonagara-vashram/google-maps-scraper`
- **Document**: Dependency Audit & Supply Chain Evaluation
- **Date**: November 2026

---

## 1. Upstream Dependency Analysis

### A. Repository A: `ozhehkovski/geoleadscraper`
- **Manifests**: `package.json`, `apps/extension/package.json`, `apps/api/package.json`, `pnpm-lock.yaml`.
- **Key Dependencies**:
  - `react`, `react-dom` (v18.x) — UI rendering.
  - `vite` (v5.x) — Bundler.
  - `@nestjs/core`, `@nestjs/common` — Backend API framework.
  - `puppeteer` — Headless browser automation.
  - `xlsx` (SheetJS) — Excel spreadsheet generation.
  - `lucide-react` — Iconography.
- **Risk Assessment**:
  - Older SheetJS (`xlsx`) versions contain known prototype pollution advisories (CVE-2023-30533, CVE-2024-22363). Must ensure clean, modern CSV/XLSX exporters are used or sanitize all inputs.
  - Heavy node_modules footprint due to NestJS + Puppeteer combo in `apps/api`.

### B. Repository B: `gosom/google-maps-scraper`
- **Manifests**: `go.mod`, `go.sum`.
- **Key Dependencies**:
  - `github.com/gosom/scrapemate` — Web crawling core.
  - `modernc.org/sqlite` — Pure Go CGO-free SQLite engine.
  - `github.com/jackc/pgx/v5` — PostgreSQL driver and toolkit.
  - `github.com/riverqueue/river` — PostgreSQL-backed transactional job queue.
  - `github.com/rubenv/sql-migrate` — Database schema migration tool.
  - `github.com/gin-gonic/gin` or standard HTTP routers.
  - `github.com/playwright-community/playwright-go` — Optional headless browser automation.
- **Risk Assessment**:
  - `modernc.org/sqlite` is actively maintained and eliminates the requirement for a C compiler (GCC/MinGW) on Windows, making it ideal for desktop packaging.
  - `pgx/v5` and River queue have excellent security track records.
  - Dependency tree is minimal, auditable, and compiles into a single statically linked binary.

### C. Repository C: `sonagara-vashram/google-maps-scraper`
- **Manifests**: `requirements.txt`.
- **Key Dependencies**:
  - `requests` — HTTP networking.
  - `fake-useragent` — User agent rotation.
- **Risk Assessment**:
  - `fake-useragent` fetches remote user agent lists dynamically over HTTP/HTTPS, introducing external runtime network dependency and potential supply-chain tampering.
  - No lockfile (`Pipfile.lock` or `poetry.lock`) is provided; builds are non-reproducible.

---

## 2. ReviewPilot Phase 1 Dependency Strategy

To adhere strictly to **Karpathy's Simplicity First principle** and prevent supply-chain vulnerabilities, ReviewPilot Phase 1 enforces:

1. **Zero Unnecessary Dependencies**:
   - Only install battle-tested, standard libraries.
   - For UI: React 18/19, TypeScript, Vite, Tailwind CSS, Lucide React icons, and a lightweight chart component.
2. **Safe Export Implementations**:
   - Built-in browser Blob streaming for CSV and JSON exports.
   - Avoid legacy SheetJS dependencies with known CVEs; use lightweight or standard compliant CSV/JSON serialisation.
3. **No Dynamic Code Evaluation**:
   - Ban `eval()`, `new Function()`, and remote script injection.
4. **Deterministic Lockfiles**:
   - Commit strict lockfiles (`package-lock.json`) and run automated vulnerability scanning.

