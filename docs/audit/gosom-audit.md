# Upstream Repository Technical Audit: gosom/google-maps-scraper

- **Repository**: `gosom/google-maps-scraper`
- **URL**: [https://github.com/gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper)
- **Primary Language**: Go (Golang)
- **Ecosystem**: Go modules, Scrapemate framework, SQLite (`modernc.org/sqlite`), PostgreSQL (`pgx`), River queue (`riverpgxv5`), Docker Compose
- **Declared License**: MIT License
- **Auditor**: Principal Software Architect & Security Reviewer
- **Date**: November 2026
- **Audit Methodology**: Based on remote GitHub repository tree inspection, source code analysis (`cmd/scraper/main.go`, `internal/`), dependency manifests (`go.mod`, `go.sum`, `docker-compose.saas.yaml`), commit histories, and public documentation rather than a local clone.

---

## 1. Repository Inventory & Structure

The repository is organized as a high-throughput concurrent Go service and CLI:

```text
gosom/google-maps-scraper/
├── .github/
│   └── workflows/
│       ├── test.yml
│       └── release.yml
├── cmd/
│   └── scraper/
│       └── main.go                    # Bootstrap entry point & CLI parser
├── internal/
│   ├── api/                           # REST API controllers & OpenAPI/Swagger specs
│   ├── config/                        # Viper/env configuration management
│   ├── db/                            # Database abstraction layer
│   │   ├── migrations/                # SQL migration scripts (sql-migrate)
│   │   ├── postgres.go                # PostgreSQL driver & connection pool
│   │   └── sqlite.go                  # SQLite driver (modernc.org/sqlite)
│   ├── gmaps/                         # Scraping & extraction logic
│   │   ├── client.go                  # HTTP / Headless client wrapper
│   │   ├── extractor.go               # HTML/JSON response parser
│   │   ├── job.go                     # Scrapemate job definition
│   │   └── parser.go                  # APP_INITIALIZATION_STATE & DOM extractor
│   ├── models/                        # Domain models (Entry, Review, Job)
│   ├── queue/                         # River queue worker & job dispatcher
│   └── runner/                        # Concurrent execution engine
├── web/                               # SaaS Admin Dashboard UI (Embedded templates / React)
├── docker-compose.yaml                # Standard deployment
├── docker-compose.saas.yaml           # SaaS mode with Postgres & River queue
├── Dockerfile                         # Multi-stage production container build
├── go.mod                             # Go module & dependency manifest
├── go.sum                             # Cryptographic checksums of dependencies
├── Makefile                           # Build and migration targets
├── LICENSE                            # MIT License
└── README.md                          # Usage documentation & flags reference
```

### Dependency Manifest (`go.mod`) Highlights
- **Crawler Framework**: `github.com/gosom/scrapemate`
- **Database Drivers**:
  - `modernc.org/sqlite` (CGO-free pure Go SQLite driver)
  - `github.com/jackc/pgx/v5` (High-performance PostgreSQL driver)
- **Job Queue**: `github.com/riverqueue/river` (`riverpgxv5` transactional background jobs)
- **Migrations**: `github.com/rubenv/sql-migrate`
- **Web / Routing**: Gin or standard library / Chi router with Swagger integration.

---

## 2. Source-Code & Architectural Analysis

### A. Data Acquisition & Concurrency Architecture
- **Scrapemate Engine**: Decouples job dispatching, HTTP fetching, response parsing, and result pipelines.
- **Worker Pools & Goroutines**: Spawns concurrent workers processing queries across channels.
- **Page Extraction Strategy**:
  - Extracts initialization state JSON embedded within Google Maps script tags (`window.APP_INITIALIZATION_STATE`).
  - Fallback to headless Playwright/Chromium when dynamic scrolling or deep review expansion is required.
- **Review Parsing**:
  - Parses `UserReviews` array from embedded JSON or DOM nodes.
  - Extracts: Review ID, Author Name, Profile URL, Star Rating (1–5), Relative Date, Absolute Timestamp, Review Text, Owner Response, Star Distribution (`ReviewsPerRating`), and Photo URLs.

### B. Persistence & Storage Architecture
- **Dual-Database Strategy**:
  - **Local Mode**: Uses `modernc.org/sqlite` — zero external dependencies, file-based persistence, easily portable on Windows/Linux/macOS.
  - **Server/SaaS Mode**: Uses PostgreSQL with connection pooling and relational indexing on Place IDs, queries, and timestamps.
- **Transactional Job Queue**: In PostgreSQL mode, uses River Queue (`riverpgxv5`) which guarantees ACID job enqueueing inside the same database transaction.

### C. Checkpointing & Recovery
- Supports resumable scraping via `-dsn` flag with database-backed status tracking (`pending`, `processing`, `completed`, `failed`).
- CLI mode supports an `-input` file with query checkpointing so interrupted runs can skip already-processed queries.

### D. Export Implementation
- Implements streaming CSV writer and JSON serializer.
- Reviews are exported either nested inside JSON records or flattened into relational review tables.

---

## 3. Security & Vulnerability Analysis

1. **Proxy Credentials Handling**:
   - Supports proxy lists via CLI flags (`-proxies`) or environment variables. Cleartext proxy passwords could be logged in process lists if passed via CLI flags.
2. **Headless Browser Execution Vulnerabilities**:
   - When Playwright runs in headless mode inside Docker or host, rendering untrusted external web pages (e.g., during website contact enrichment) exposes the host to Chromium zero-day exploits.
3. **Database Input Sanitization**:
   - Uses parameterized queries (`pgx` and SQLite prepared statements), preventing SQL injection.
4. **IP Blocking & Anti-Bot Evasion**:
   - Relies heavily on residential proxies to circumvent Google Maps rate-limiting. Datacenter IPs are blocked almost instantaneously with CAPTCHA challenges.

---

## 4. Legal & Licensing Analysis

- **License**: MIT License (`LICENSE` file present).
- **Attribution Obligation**: Requires retaining copyright notice and permission notice in any derivative work or substantial portion.
- **Legally Reusable Patterns**:
  - Dual SQLite / PostgreSQL database abstraction pattern.
  - Relational schema for Places, Reviews, and Ratings.
  - CGO-free SQLite persistence via `modernc.org/sqlite`.
  - Transactional job queue concepts.
- **Platform Compliance Boundary**:
  - Headless browser automation targeting Google Maps directly without user credentials or API tokens triggers Google ToS violations. Must NOT be used for ReviewPilot's core ingestion.

---

## 5. Architectural Evaluation & Scoring

| Dimension | Score (1-10) | Evidence / File Path | Rationale |
|:---|:---:|:---|:---|
| **Architecture Quality** | 9/10 | `internal/db/`, `internal/runner/` | Clean hexagonal/clean-architecture separation; excellent pipeline design. |
| **Maintainability** | 8/10 | `cmd/scraper/main.go`, `internal/` | Go's strong typing and interface boundaries make maintenance straightforward. |
| **Data Model** | 9/10 | `internal/models/` | Complete relational data model with ratings breakdown and review objects. |
| **Review Handling** | 8/10 | `internal/gmaps/extractor.go` | Deep extraction of reviews, star counts, author metadata, and responses. |
| **Pagination** | 7/10 | `internal/gmaps/job.go` | High throughput, though capped at Maps UI 120-item window per search query. |
| **Persistence** | 9/10 | `internal/db/sqlite.go`, `postgres.go` | Best-in-class dual-database support; pure Go SQLite + PostgreSQL. |
| **Recovery** | 8/10 | `internal/queue/`, River queue | Resumable jobs and transactional database state recovery. |
| **Export** | 8/10 | `internal/runner/export.go` | High-efficiency streaming CSV and JSON exports. |
| **API Design** | 8/10 | `internal/api/` | Clean REST API with OpenAPI/Swagger documentation in SaaS mode. |
| **UI/UX** | 5/10 | `web/` | Functional administrative dashboard, but utilitarian and non-commercial. |
| **Performance** | 9/10 | Go concurrency model | Lightweight memory footprint, concurrent goroutines, low CPU usage. |
| **Security** | 7/10 | `internal/db/` | Safe SQL queries; proxy credential handling requires caution. |
| **Testability** | 7/10 | `*_test.go` | Decent unit tests for parsers; integration tests require mock HTTP fixtures. |
| **Portability** | 9/10 | Go single binary compilation | Cross-compiles to standalone Windows `.exe` with zero external runtimes. |

**Overall Score**: 7.9 / 10

---

## 6. Component Reuse Decision

- **Dual-Database Architecture (SQLite local / PostgreSQL cloud)**: `REUSE` / `ADAPT`. This is the exact target architecture for ReviewPilot (local-first SQLite desktop, future PostgreSQL cloud sync).
- **Data Model & Schema**: `REUSE` / `ADAPT`. Relational schema for Places, Reviews, Reviewers, and Responses is sound and directly applicable.
- **Go Single-Binary Portability Pattern**: `ADAPT` for ReviewPilot's desktop backend sidecar or Tauri engine.
- **Automated Scraping / Proxy Engine**: `REJECT`. Incompatible with enterprise compliance and authorized API design boundaries.

