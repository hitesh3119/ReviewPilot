# Legal, Licensing & Intellectual Property Audit

- **Subject**: Upstream Codebase Licenses, Attribution Obligations, and Compliance Boundaries
- **Document**: Legal & Licensing Review
- **Date**: November 2026

---

## 1. Upstream License Verification

| Upstream Repository | Verified License | Attribution Obligation | Permitted Actions | Prohibited / Unsafe Actions |
|:---|:---:|:---|:---|:---|
| **`ozhehkovski/geoleadscraper`** | **MIT License** | Preserved MIT copyright notice in source/attribution files | Commercial use, modification, distribution, private use | Removing copyright notice; claiming trademark or endorsement |
| **`gosom/google-maps-scraper`** | **MIT License** | Preserved MIT copyright notice in source/attribution files | Commercial use, modification, distribution, private use | Removing copyright notice; claiming trademark or endorsement |
| **`sonagara-vashram/google-maps-scraper`** | **NO LICENSE (All Rights Reserved)** | N/A — Direct copying is unlawful | Viewable on GitHub only | **Direct copying, distribution, or inclusion in commercial software** |

---

## 2. Deep Legal Analysis: Open-Source Code vs. Platform Data Access

> [!IMPORTANT]
> **A Crucial Distinction in Software Law:**
> An open-source license (such as MIT) grants permission to inspect, modify, and distribute the **source code** written by the repository author. **It does NOT grant permission to scrape, extract, or violate the terms of service of third-party platforms (like Google Maps or Google Business Profile).**

### Key Legal Boundaries:
1. **Google Terms of Service (ToS)**:
   - Section 3.2.3 of Google Maps/Google Earth Additional Terms of Service prohibits:
     - Scraping, mass downloading, or creating derivative databases of Google Map content.
     - Accessing Google services through automated means other than sanctioned public APIs.
     - Circumventing rate limits, CAPTCHAs, or authentication boundaries.
2. **ReviewPilot Compliance Strategy**:
   - ReviewPilot does **NOT** adopt or execute scraping scripts targeting Google Maps frontend interfaces.
   - ReviewPilot adopts the **software architecture patterns** (dual-database persistence, clean relational schema, typed UI contracts, export streaming) while isolating data ingestion to:
     - **Authorized Google Business Profile (GBP) API** for businesses managing their own locations.
     - **Google Places API (New)** within authorized rate limits and caching policies.
     - **User-Provided Data Imports** (e.g. Google Takeout review exports, user CSV/JSON spreadsheets).

---

## 3. Attribution Notice

ReviewPilot acknowledges and gives credit to the architectural patterns inspired by open-source projects:

### A. Pattern Attribution: gosom/google-maps-scraper
- **Original Author**: Giorgos Somarakis (`gosom`)
- **License**: MIT License
- **Attributed Patterns**: Dual SQLite/PostgreSQL storage abstraction concepts, relational schema design for place reviews.
- **MIT Notice**:
  ```text
  Copyright (c) 2023 Giorgos Somarakis
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software...
  ```

### B. Pattern Attribution: ozhehkovski/geoleadscraper
- **Original Author**: `ozhehkovski`
- **License**: MIT License
- **Attributed Patterns**: TypeScript review data contracts and client-side multi-format export structuring.
- **MIT Notice**:
  ```text
  Copyright (c) 2024 ozhehkovski
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software...
  ```

### C. sonagara-vashram/google-maps-scraper
- **Status**: No code copied. Zero lines of code or assets incorporated.

