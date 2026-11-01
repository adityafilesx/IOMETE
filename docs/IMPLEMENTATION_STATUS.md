# Implementation status

## Iteration 3 baseline and verification
Baseline: `git status` reported no Git repository; `unittest discover` found 23 tests, 22 passed and one local-socket test skipped. No user files were removed.

Final checks: `npm --prefix frontend run build` passed TypeScript and Vite production build. `.venv/bin/python -m unittest discover -s tests -q` found 31 tests: 29 passed and two skipped (local HTTP and live PostgreSQL). Both skipped paths were separately exercised with permission: the HTTP lifecycle/export test passed against PostgreSQL, and PostgreSQL and SQLite repository migration tests both passed. The isolated PostgreSQL 16 container was stopped and removed. The original eight calculator tests remain passing.

A real Chrome/Playwright run (`node frontend/tests/browser.mjs`) passed desktop and 375px mobile checks: full and partial analysis, save/open, evidence navigation, XLSX/PDF/Word/CSV downloads, basic keyboard focus, no page errors and no document-level horizontal overflow. Screenshots were inspected. This is not a complete accessibility audit. PDF text and DOCX structure tests pass; a sample PDF with scenarios and sensitivity was rendered and both pages inspected. No spreadsheet engine was available to recalculate the XLSX and no DOCX renderer was available.

## Implemented
- React/TypeScript/Vite frontend with centralized typed API client, intake, partial analysis, scenarios, sensitivity, evidence, verification output, saved cases and four export controls. FastAPI serves the built UI, falling back to the previous static frontend if no build exists. Existing source and financial engine remain available.
- React Bits free `SpotlightCard-TS-CSS` source and styles integrated into a non-critical feature card; build and Chrome render passed. MCP connectivity was not verified.
- Shared SQLite/PostgreSQL repository with ordered schema migrations and a versioned analysis/report snapshot on save. Existing records migrate without deleting their inputs. PostgreSQL migration, CRUD, transaction rollback and HTTP workflow were tested with a temporary local container. The frontend still recalculates on reopening rather than displaying the historical snapshot.
- 42 dated vendor-stated evidence entries in `data/evidence.json`, including scoped plan and security caveats. Metadata and missing/duplicate/stale/untrusted-source tests were added. Some older compound snippets still require atomization and independent human review; the pack is not a certification of truth or complete coverage of all required topics.
- Deterministic exact-claim checking and narrow structured numerical checks now detect mismatched values or currencies for four labelled metrics. Semantic entailment, general atomic claim extraction and broad numerical prose checks are not implemented. The provider interface remains mock-only; no live LLM or Instructor integration.
- PDF/Word report content now includes three scenarios and sensitivity; workbook includes a labelled sensitivity snapshot sheet. Formula references and generated document content are tested, but workbook recalculation remains unverified.
- `evaluations/PROTOCOL.md` and 20 proposed red-team prompts prepare T1–T5. Six narrow automated rule checks pass. The complete red-team Q&A, buyer review, finance reviewer, peer study and chatbot comparison have not been run; no human outcomes are claimed.

## Remaining work
## Iteration 4: Complete UI/UX Transformation Using React Bits

### Baseline and Verification:
- **Design System & Aesthetics:** Tokenized design system with enterprise slate & emerald palette, DM Sans and tabular financial typography, micro-shadow elevations, and crisp inline SVG icons replacing all legacy unicode characters.
- **React Bits Component Suite:**
  - `SpotlightCard-TS-CSS`: Integrated into the Overview feature hero and Builder right rail.
  - `CountUp`: Tabular animated number counter for executive metrics with automatic `prefers-reduced-motion` detection.
  - `ShinyText`: Subtle lustrous gradient sweep animation for high-priority badges, headers, and verification tags.
  - `StarBorder`: Dynamic animated glowing border for primary CTA buttons ("Build business case", "Save case").
- **Screens & Workflows Redesigned:**
  - **Overview / Dashboard (`OverviewView`):** Comprehensive workspace hub with KPI summary cards, recent business cases list, quick resume actions, and step-by-step defensible next actions.
  - **Buyer Intake (`BuilderView`):** Guided workflow with structured section indicators (01 About Case, 02 Baseline & Scale, 03 Operating Assumptions), contextual tooltips, inline validation, and illustrative example loader.
  - **Financial Intelligence Workspace (`AnalysisView`):** Executive KPI summary, responsive 3-scenario table, sensitivity sign-flip matrix, full assumptions audit trail, role-specific evidence statements, verification results, and open questions.
  - **Evidence Research Workspace (`EvidenceView`):** Interactive search by claim/quote/ID, topic filters (Pricing, Security, Architecture, Migration), clickable inspection modal dialog, and transparent verification boundaries note.
  - **Saved Cases Manager (`SavedCasesView`):** Filterable cases list, last-updated tags, metadata pills, case restore, and accessible delete confirmation modal.
  - **Executive Briefing & Exports (`ReportPreviewView`):** Formatted printable decision memo sheet and unified Export Menu for Excel (.xlsx live formulas), PDF (.pdf), Word (.docx), and CSV.
  - **App Shell & Feedback:** Persistent enterprise `TopBar` with active case context and saved status badge; responsive `Sidebar` with mobile drawer navigation; accessible `Toast` notification system for all mutations.
- **Verification Across Viewports:**
  - `node frontend/tests/browser.mjs` passed in headless Chrome across 1440px desktop, 1280px laptop, 768px tablet, and 375px mobile viewports.
  - Verified: intake submission, full analysis, partial analysis with missing fields, save case, open case, evidence modal inspection, 4 export downloads, visible keyboard focus, 0 console/page errors, and 0 horizontal page overflow (`scrollWidth <= clientWidth`).
  - `unittest discover` passed 31 tests (29 passed, 2 skipped requiring live isolated sockets/PostgreSQL).
  - Production build (`npm run build`) passed with zero TypeScript errors.

Commands and setup are in `README.md`; evaluation materials are in `evaluations/`.

