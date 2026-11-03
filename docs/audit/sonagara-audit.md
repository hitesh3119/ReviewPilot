# Upstream Repository Technical Audit: sonagara-vashram/google-maps-scraper

- **Repository**: `sonagara-vashram/google-maps-scraper`
- **URL**: [https://github.com/sonagara-vashram/google-maps-scraper](https://github.com/sonagara-vashram/google-maps-scraper)
- **Primary Language**: Python
- **Ecosystem**: Python 3, `requests`, Protocol Buffers (`protobuf`), HTTP client
- **Declared License**: **NONE (Unlicensed / All Rights Reserved)**
- **Auditor**: Principal Software Architect & Security Reviewer
- **Date**: November 2026
- **Audit Methodology**: Based on remote GitHub repository tree inspection, source code analysis (`scraper.py`, `grid.py`, `parser.py`, `requirements.txt`), commit histories, and public documentation rather than a local clone.

---

## 1. Repository Inventory & Structure

The repository is a lightweight Python script project focused on reverse-engineered HTTP requests:

```text
sonagara-vashram/google-maps-scraper/
├── scraper.py                         # Main scraper script with HTTP request handlers
├── grid.py                            # Bounding-box geographic grid decomposition
├── parser.py                          # Protobuf / nested array response parser
├── utils.py                           # Helper functions (delays, headers, proxies)
├── requirements.txt                   # Python package dependencies
├── queries.txt                        # Sample input search queries
└── README.md                          # Project documentation and CLI usage
```

### Dependency Manifest (`requirements.txt`)
- `requests` (HTTP library)
- `fake-useragent` (User-Agent header spoofing)
- Standard library modules (`csv`, `json`, `time`, `os`, `re`, `math`).

---

## 2. Source-Code & Architectural Analysis

### A. Data Acquisition Strategy
- **Browserless Reverse Engineering**:
  - Does NOT use Selenium, Playwright, or Puppeteer.
  - Intercepts and replicates Google Maps internal RPC / web endpoints (e.g., `/maps/preview/search`, `/maps/rpc/listugcposts`).
  - Sends direct HTTP GET/POST requests mimicking Google Maps client requests with query parameters (e.g., `pb=!1m...` protobuf-serialized payload strings).
- **Geographic Grid Partitioning (`grid.py`)**:
  - Solves the Google Maps 120-result query display limit by splitting a target city or region into a matrix of smaller latitude/longitude bounding boxes.
  - Iterates through the coordinate grid, issuing localized search requests to collect exhaustive listings.
- **Review Parsing**:
  - Extracts reviews from the internal RPC responses by indexing deep nested arrays/tuples or parsing raw protobuf responses.
  - Extracts: Review ID, Reviewer Name, Star Rating, Timestamp, Text, and Photo count.

### B. Persistence, Storage, and Recovery
- **Storage**: Simple flat-file CSV export using Python's built-in `csv.DictWriter`.
- **Checkpointing**: Uses a plain text or JSON progress file recording the last completed grid coordinate index or query. If killed, it restarts from the last recorded grid cell.
- **Deduplication**: In-memory Python `set` of Place IDs or URLs. Memory usage scales with the number of collected listings.

---

## 3. Security & Vulnerability Analysis

1. **Protocol Buffer & RPC Schema Fragility**:
   - Google changes internal `pb` parameter schemas and nested response array indexes without any prior notification or deprecation period. Any server-side change silently breaks the parser or causes index errors (`IndexError: list index out of range`).
2. **Anti-Detection & Evasion Mechanisms**:
   - Implements random delay jitter, rotating user-agents (`fake-useragent`), and rotating proxy lists.
   - Triggers Google reCAPTCHA challenges or immediate 429 / 403 HTTP response codes when requests are detected as automated traffic.
3. **Absence of Input Validation & Sanitization**:
   - Query strings and file paths are concatenated without strict validation, creating potential path traversal vulnerabilities if exposed as an API or service.
4. **Supply Chain & Maintenance**:
   - No automated test suite, no CI/CD workflows, no linting configuration.

---

## 4. Legal & Licensing Audit

> [!CAUTION]
> **CRITICAL LEGAL FINDING**: This repository contains **NO LICENSE FILE**. Under international copyright law and GitHub Terms of Service, when a repository has no explicit open-source license, **All Rights Reserved** applies by default.

- **Direct Code Copying / Reusing**: **STRICTLY PROHIBITED**. Incorporating any code, files, or verbatim scripts from this repository into ReviewPilot would constitute copyright infringement.
- **Platform Terms Violations**:
  - The script relies on automated queries to undocumented Google internal RPC endpoints, explicitly violating Google's Terms of Service and Robot Exclusion protocols.
  - ReviewPilot's architecture explicitly forbids proxy rotation, anti-detection, and scraping of undocumented endpoints.

---

## 5. Architectural Evaluation & Scoring

| Dimension | Score (1-10) | Evidence / File Path | Rationale |
|:---|:---:|:---|:---|
| **Architecture Quality** | 4/10 | `scraper.py`, `grid.py` | Procedural scripts lacking modular abstraction or interface boundaries. |
| **Maintainability** | 3/10 | `parser.py` | Hardcoded nested array indexes break whenever Google updates payloads. |
| **Data Model** | 4/10 | Dict-based records | No typed schemas, no data validation (Pydantic/dataclasses absent). |
| **Review Handling** | 5/10 | `parser.py` | Extracts basic reviews, but fails on replies, translations, and pagination tokens. |
| **Pagination** | 6/10 | `grid.py` | Geographic grid subdivision is clever, but fragile against rate limits. |
| **Persistence** | 3/10 | `scraper.py` | Only writes flat CSV files; no database, no relational queries. |
| **Recovery** | 5/10 | State file | Primitive index checkpointing in a local file. |
| **Export** | 4/10 | CSV writer | Only supports basic CSV; no XLSX, no JSON streaming. |
| **API Design** | 1/10 | None | No API, CLI-only execution. |
| **UI/UX** | 1/10 | Terminal output | No GUI or web interface; basic console logging. |
| **Performance** | 7/10 | Direct HTTP requests | Fast network requests, but throttled quickly by Google anti-bot systems. |
| **Security** | 3/10 | `utils.py` | Anti-detection, proxy rotation, unverified HTTP sessions. |
| **Testability** | 1/10 | None | Zero automated tests or fixtures. |
| **Portability** | 5/10 | Python script | Requires Python runtime and pip dependencies installed on the host. |

**Overall Score**: 3.7 / 10

---

## 6. Component Reuse Decision

- **Source Code**: `REJECT ENTIRELY`. No open-source license exists (All Rights Reserved), rendering any direct code reuse legally hazardous.
- **Internal RPC Scraping Logic**: `REJECT`. Violates compliance boundaries and architectural principles.
- **Geographic Grid Partitioning Concept**: `REIMPLEMENT` (conceptual pattern only). The mathematical concept of bounding-box grid decomposition for geographic searches can be cleanly and independently implemented in Phase 2 for authorized Google Places API queries if needed.

