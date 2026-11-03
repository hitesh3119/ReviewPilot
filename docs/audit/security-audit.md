# Security, Privacy & Vulnerability Audit

- **Focus**: Secrets exposure, input validation, network security, data protection, and platform compliance
- **Document**: Comprehensive Security Review across Upstreams & ReviewPilot
- **Date**: November 2026

---

## 1. Upstream Security Review Findings

### A. Secret & Credential Exposure
- **Audited Upstreams**:
  - `ozhehkovski/geoleadscraper`: No hardcoded API keys detected in git history. However, user session cookies and authentication tokens in active browser tabs can be accessed by the extension if content scripts are compromised.
  - `gosom/google-maps-scraper`: CLI flags permit passing database DSNs (`postgres://user:pass@host/db`) and proxy credentials directly on the command line. On Linux/Windows, CLI flags are visible in process tables (`ps aux`, Task Manager) to other local processes.
  - `sonagara-vashram/google-maps-scraper`: Proxy credentials stored in plain text files (`proxies.txt`).

### B. Input Validation & Injection Risks
- **SQL Injection**:
  - `gosom`: Safe. Employs parameterized queries via `pgx` and prepared statements in `modernc.org/sqlite`.
  - `ozhehkovski` & `sonagara-vashram`: Do not use SQL databases.
- **Cross-Site Scripting (XSS)**:
  - `ozhehkovski`: Renders scraped review text inside the extension DOM. If a malicious reviewer posts unescaped HTML/script tags in a public review, un-sanitized rendering creates an XSS vulnerability inside the extension context.
- **Path Traversal**:
  - `sonagara-vashram`: File paths for CSV exports are derived directly from user queries without filename sanitization (e.g. queries containing `../` or illegal Windows characters `\ / : * ? " < > |` cause filesystem exceptions or directory traversal).

### C. Network & Proxy Evasion Risks
- All three upstreams attempt to bypass Google's rate-limiting or anti-bot defenses:
  - `sonagara-vashram`: Header spoofing (`fake-useragent`) and rotating proxies.
  - `gosom`: Residential proxy pools and headless browser evasions.
  - `ozhehkovski`: Intercepts user browser cookies.
- **Risk Analysis**: These techniques are fragile, trigger IP bans, pose compliance hazards for enterprise deployments, and directly violate platform terms.

---

## 2. ReviewPilot Security Architecture & Guardrails

To achieve enterprise-grade security and user privacy, ReviewPilot adopts the following hard architectural guardrails:

```
+-------------------------------------------------------------+
|                ReviewPilot Security Boundary                |
+-------------------------------------------------------------+
| 1. Local-First Data Storage                                 |
|    - All business data & reviews stored locally on device   |
|    - SQLite database encrypted at rest (SQLCipher ready)    |
|    - Portable, user-controlled data directory               |
+-------------------------------------------------------------+
| 2. Authorized API & Data Boundary                           |
|    - NO proxy rotation, NO bot evasion, NO undocumented RPC |
|    - Uses official Google Business Profile APIs             |
|    - Uses Places API within terms                           |
|    - Supports authorized user imports (Takeout, CSV, JSON)  |
+-------------------------------------------------------------+
| 3. Zero Credential Exposure in Logs/Process Table           |
|    - API tokens stored in OS Secure Credential Vault        |
|    - Environment variables & encrypted configuration files  |
|    - Automatic redaction of auth headers in logs            |
+-------------------------------------------------------------+
| 4. XSS & Content Sanitization                               |
|    - Strict DOM text escaping in React                      |
|    - Content Security Policy (CSP) blocking unsafe-eval     |
|    - Strict sanitization of export filenames                |
+-------------------------------------------------------------+
```

### Mandatory Security Checklist for ReviewPilot Phase 1
- [x] Input sanitization on all search filters and filename generators.
- [x] Strict React DOM text rendering preventing any XSS execution from review contents.
- [x] Explicit `MOCK DATA` labeling in mock fixtures with zero real user PII.
- [x] Zero API keys, OAuth client secrets, or private tokens committed to Git.
- [x] Strict `.gitignore` excluding all local environment files, databases, and build artifacts.

