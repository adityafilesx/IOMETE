# Requirements traceability

Status describes verified behavior, not merely the presence of code. Source is `Solution for the IOMETE track.md` unless otherwise noted.

| ID | Requirement | Source | Priority | Dependencies | Status | Implementation | Verification |
|---|---|---|---|---|---|---|---|
| REQ-001 | Collect buyer inputs and validate | §4.1, §5 | P0 | None | Partial | `static/index.html`, `server.py`, `engine.py` | Finance tests and HTTP request; incomplete data currently blocks analysis; industry, hosting and migration plan absent |
| REQ-002 | Calculate costs, TCO and payback transparently | §5 | P0 | Buyer estimates | Partial | `engine.py`, `static/app.js` | Eight unit tests and HTTP example; no partial results for missing inputs |
| REQ-003 | Three scenarios and sensitivity | §4.1, §5 | P0 | Calculation | Partial | `engine.py`, `static/app.js` | HTTP example and tests; independent ± sensitivity, no ranges for other inputs |
| REQ-004 | Plan selection with transparent constraints | §4.1, §5 | P0 | Pricing evidence | Partial | `engine.py` | Free/Enterprise cliff and custom pricing tests; air-gapped eligibility unknown, no manual quote override |
| REQ-005 | Evidence pack with claims, quotes and dates | §4.2, §6 | P0 | Vendor sources | Partial | `engine.py`, `static/evidence.json` | Seven records inspected; ~40 required, claim selection and complete quote support unfinished |
| REQ-006 | Labels and counts for every memo statement | §4.2–4.3 | P0 | Claim mapping | Partial | `static/app.js` | Counts are record counts; not all sentences have individual labels or citations |
| REQ-007 | Fit check and role lens | §4.1, §7 | P1 | Rule engine and evidence | Partial | `engine.py`, `static/app.js` | Skills warning and plan rules exist; role does not change narrative |
| REQ-008 | Unknowns become questions | §4.2–4.3 | P0 | Rules | Partial | `engine.py` | API response inspected; questions are limited fixed rules |
| REQ-009 | Memo preview and export | §4.3, §9 | P0 | Calculation and evidence | Partial | `static/app.js`, `static/style.css` | HTML preview and browser print provided; actual PDF and pagination unverified, Word absent |
| REQ-010 | Spreadsheet export with live formulas | §4.1, §9, §11 | P0 | Calculation | Partial | `static/app.js` | CSV export uses calculated values; XLSX formulas absent; file not browser-tested |
| REQ-011 | Save and resume cases | User implementation request §7.3 | P1 | SQLite | Partial | `server.py`, `static/app.js` | API implementation; browser journey not verified |
| REQ-012 | LLM writer and verifier | §4.2, §9 | P1 | Model credentials, structured output | Missing | — | No model or verifier; deterministic text avoids invented AI output |
| REQ-013 | Published conflicting figures register | §6 | P2 | Curated evidence | Partial | `engine.py` | One vendor savings claim is shown and not applied; other figures and conflict groups absent |
| REQ-014 | Three sample buyers, red-team and comparison tests | §8, §11 | P1 | Evidence, participants | Missing | `tests/test_engine.py` | Only financial automated tests run; no human results claimed |
| REQ-015 | React, FastAPI, PostgreSQL, shadcn, lockfile | §9; user request | P1 | Packages/network | Blocked | `server.py`, `static/` | Standard-library fallback; network unavailable and dependencies absent |
| REQ-016 | Responsive, keyboard and visual QA | User request §6, §9 | P1 | Browser | Not Verified | `static/style.css`, `static/index.html` | Responsive rules and native controls implemented; browser surface unavailable |
| REQ-017 | React Bits discovery and integration | User request phase 2 | P1 | MCP/registry access | Blocked | `docs/REACT_BITS_COMPONENT_AUDIT.md` | No connected MCP tools; registry DNS failure |

## Iteration update (supersedes earlier status descriptions)

| ID | Required change | Current status | Verification / outstanding |
|---|---|---|---|
| REQ-001 | Partial intake and missing fields | Partially complete | Partial engine and HTTP test; industry, hosting and migration-plan inputs absent |
| REQ-002 | Partial financial results | Partially complete | Original eight tests and partial tests pass; more financial cases remain desirable |
| REQ-003 | Sensitivity and scenarios | Partially complete | Existing three scenarios and sensitivity checked; spreadsheet sensitivity absent |
| REQ-005 | Curated atomic source evidence | Partially complete | Seven records, not ~40; several excerpts need atomic verification |
| REQ-006 | Every statement verified and counted | Partially complete | Conservative canonical-text checker exists; web memo not fully checked or labelled; semantic support not established |
| REQ-007 | Role lenses and fit | Partially complete | Role changes evidence order and basic skills/plan rules; full lens and fit absent |
| REQ-009 | PDF and Word reports | Partially complete | Actual PDF text and Word structure tested; full content and visual QA outstanding |
| REQ-010 | Live formula workbook | Partially complete | Formula references inspected, no recalculation engine tested; sensitivity absent |
| REQ-011 | Save and resume | Partially complete | Isolated FastAPI/SQLite lifecycle tested by HTTP; browser and PostgreSQL not verified |
| REQ-012 | LLM writer and verifier | Partially complete | Mock provider and deterministic fallback; no live provider or semantic verifier |
| REQ-014 | Buyer and red-team evaluation | Partially complete | Six narrow automated checks; full T1–T5 and human studies remain |
| REQ-015 | Documented architecture | Partially complete | FastAPI and PostgreSQL connection path added; React stack, migrations, PostgreSQL test, build outstanding |
| REQ-016 | Responsive visual QA | Not verified | Browser unavailable; PDF first page inspected only |
| REQ-017 | React Bits MCP and component | Partially complete | Registry source retrieval succeeded; MCP, installation and premium access unverified |

## Iteration 3 updates (supersede prior rows)

| ID | Status | Implementation and verification | Remaining |
|---|---|---|---|
| REQ-001 | Partially implemented | React intake, partial inputs, industry/hosting/migration context; Chrome workflow | Source-defined terminology and tooltips |
| REQ-002 | Implemented and tested for existing model | Decimal engine; original eight and partial tests | Additional commercial and validation review |
| REQ-003 | Partially implemented | UI and engine scenarios/sensitivity; test and browser journey | Live sensitivity workbook formulas |
| REQ-005 | Partially implemented | 42 vendor-stated records in `data/evidence.json`, metadata tests | Human source audit, atomic excerpts, context and coverage |
| REQ-006 | Partially implemented | Exact canonical and four structured numerical checks with tests | Semantic entailment, all statements, general numeric checks |
| REQ-007 | Partially implemented | Role-based evidence ordering and basic skills/plan rules | Full role narrative and technical fit |
| REQ-009 | Partially implemented | PDF/Word scenarios and sensitivity; content tests and rendered PDF inspection | Full sections, DOCX visual review, two-page plus appendix |
| REQ-010 | Partially implemented | Formula workbook and sensitivity snapshot, reference tests | Actual spreadsheet recalculation, sensitivity formulas |
| REQ-011 | Implemented and tested for local prototype | Shared repository, migrations, SQLite and PostgreSQL CRUD/rollback/API tests | Historical snapshot UI and production deployment controls |
| REQ-012 | Partially implemented | Deterministic fallback, mock provider and conservative checker | Live LLM/Instructor, semantic verification |
| REQ-014 | Partially implemented | Six narrow checks; 20 prompts and T1–T5 protocol | Complete tests and human studies |
| REQ-015 | Partially implemented | React/TypeScript/Vite, FastAPI, PostgreSQL verified locally | Tailwind/shadcn template integration and production hardening |
| REQ-016 | Partially verified | Chrome desktop/mobile journey, reduced-motion setting and basic focus | Comprehensive accessibility, responsive and console audit |
| REQ-017 | Partially implemented | Free Spotlight Card integrated, built and rendered | MCP and premium access unverified; broader accessibility review |
