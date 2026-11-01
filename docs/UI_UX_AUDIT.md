# ProofDesk UI/UX Audit & Transformation Blueprint

**Date:** 2026-11-01  
**Auditor:** Senior Product Designer & Frontend Architect  
**Scope:** Complete application UX/UI inspection across desktop (1440px), laptop (1280px), tablet (768px), and mobile (375px) viewports.

---

## 1. Executive Summary

ProofDesk has a robust domain foundation: an exact Decimal financial engine, multi-scenario modeling, sensitivity analysis, evidence verification, and export generators (XLSX, PDF, Word, CSV). However, the existing user interface was built as a single monolithic component (`main.tsx`) with rudimentary CSS styling (`style.css`), relying on Unicode character icons, dense tables, and basic layout blocks.

To deliver a **visually exceptional, production-grade B2B SaaS financial intelligence platform**, the application requires:
1. A modular, tokenized **Design System** with enterprise-grade typography, elevation, color tokens, and accessible SVG icons.
2. A persistent, responsive **Global Application Shell** featuring an Overview dashboard, guided Intake builder, deep Analysis workspace, Scenario comparison, Evidence research workspace, Saved Cases manager, and Report Preview with export workflows.
3. Purposeful integration of **React Bits components** (Spotlight Card, CountUp animated metrics, ShinyText highlights, StarBorder CTA enhancements, and smooth micro-interactions).
4. Full accessibility (WCAG 2.2 AA compliant focus states, keyboard navigation, semantic HTML, screen-reader labels, high contrast ratios, and `prefers-reduced-motion` support).

---

## 2. Screen & Workflow Inventory

| Screen / Workflow | Current Implementation | Issues Identified | Redesign Target |
|---|---|---|---|
| **Global Navigation & Shell** | Fixed 220px sidebar with unicode symbols (`◫`, `▤`, `◇`), collapses into a horizontal bar below 700px. | No active case context, no overview dashboard, harsh breakpoint behavior, unicode glyphs instead of professional SVG icons. | Enterprise topbar with workspace badge, active case indicator, breadcrumbs, collapsible sidebar with SVG icons, mobile slide drawer / navigation bar. |
| **Workspace Overview / Dashboard** | Non-existent; defaults directly into the raw builder form. | Users cannot see existing cases, recent activity, pending questions, or workspace metrics upon entering. | Comprehensive landing workspace: KPI cards, quick actions, recent business cases list with status badges, and recommended next steps. |
| **Buyer Intake Experience** | Long single-page form with 3 sections (`01`, `02`, `03`) and 2-column grid. | Form fatigue, missing field tooltips, required fields block partial inputs, no step-by-step progress indicator or review step. | Multi-step guided wizard or segmented accordion with progress bar, contextual field help, inline validation, and clear partial analysis support. |
| **Analysis Results Workspace** | Monolithic container with 3 plain stat cards and stacked text blocks. | Weak visual hierarchy; financial figures blend into paragraphs; no visual breakdown of cost categories; assumptions look like raw bullets. | Executive KPI summary with React Bits `CountUp` numbers, clear currency/frequency tags, visual cost breakdown cards, structured assumptions matrix, and status banners. |
| **Scenario Comparison** | Single wide HTML table (`Low`, `Base`, `High`). | Table overflows on tablet/mobile; hard to compare relative variance or understand which missing inputs cause "UNKNOWN" cells. | Side-by-side interactive Scenario Cards with delta indicators, baseline comparisons, and a responsive comparison data table. |
| **Sensitivity Analysis** | 4-column static table with sign-flip boolean text. | Raw numeric list without visual variance bars or indication of key cost drivers. | Visual sensitivity ranges showing percentage swing, threshold flip alerts, and driver ranking. |
| **Evidence Library** | Flat list of 42 raw entries rendered sequentially. | No search, no category/tag filters, no source organization, quotes take up too much vertical space. | Research workspace with search bar, source filters (IOMETE, benchmark, architecture), categorized cards, quote expansion drawer/modal, and verification badges. |
| **Open Questions & Verification** | Bulleted list of text strings with generic `UNKNOWN` badges. | Minimal distinction between missing buyer inputs, unverified vendor claims, and architecture questions. | Structured due-diligence checklist categorized by risk level, actionable input links, and transparent verification status tags. |
| **Saved Cases Management** | Minimal list with "Open" and "Delete" buttons, native `window.confirm`. | No search/filter, no summary metrics, no visual distinction between partial and complete cases. | Rich case management table with search, organization metadata, last-updated timestamps, completeness badges, and custom modal confirmation. |
| **Report Preview & Exports** | Cluster of 5 buttons triggering direct downloads or `window.print()`. | No in-app executive memo preview; user cannot review formatted memo before downloading; export format differences are not explained. | Dedicated Report Preview tab with executive memo layout, scenario tables, evidence citations, and a unified Export Menu with format guidance. |

---

## 3. UI/UX Deficiencies & Accessibility Gaps

1. **Information Hierarchy & Financial Clarity:**
   - Financial figures lacked prominent tabular styling (`tabular-nums`), making columns hard to compare.
   - Uncertainties and "UNKNOWN" values were displayed as plain strings without contextual explanation of how to resolve them.
   - Colors were used ornamentally rather than semantically.

2. **Form Experience:**
   - Inputs lacked input group icons, helper text, and clear distinctions between mandatory baseline fields and optional operational refinements.
   - Example loader was tucked away in a small header button without clear indication of what it populates.

3. **Motion & Feedback:**
   - No smooth transitions between workspace views; instant DOM replacement feels jarring.
   - Save button merely toggled text to "Saved ✓" without a persistent toast or save state in the topbar.
   - No loading skeletons during API calculation.

4. **Responsive Layouts:**
   - At 1050px, the right rail disappears completely without alternate access.
   - At 768px (tablet), tables overflow and form inputs stretch awkwardly.
   - At 375px (mobile), horizontal padding is tight, buttons bunch up, and typography wraps irregularly.

5. **Accessibility (WCAG 2.2 AA):**
   - Several low-contrast text colors (e.g. `#9aa7a0` on `#ffffff` has contrast ratio 2.3:1, well below 4.5:1).
   - Icon-only or unicode-labeled elements lacked explicit `aria-label` attributes.
   - Keyboard focus rings used inconsistent offsets and colors.

---

## 4. Redesign Architecture & Technology Plan

### A. Design System Tokens (`index.css`)
- **Colors:** Modern slate & emerald enterprise palette:
  - Background: Neutral slate-tinted canvas (`#f8fafc`).
  - Surfaces: Pure white (`#ffffff`) with subtle zinc/slate borders (`#e2e8f0`).
  - Text: Dark slate slate-900 (`#0f172a`) for headers/numbers, slate-600 (`#475569`) for body, slate-400 (`#94a3b8`) for secondary labels.
  - Primary Accent: Deep emerald / teal (`#0f766e` / `#047857`) representing financial intelligence and trust.
  - Semantic: Success (`#15803d`), Warning Amber (`#b45309`), Error Red (`#b91c1c`), Info Slate (`#3b82f6`).
- **Typography:** DM Sans + Plus Jakarta Sans font stack with explicit `tabular-nums` for financial data.
- **Elevation:** Layered micro-shadows (`box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)`).
- **Icons:** Feather / Heroicon-style clean inline SVG icons for crisp, professional appearance.

### B. React Bits Integration
1. **SpotlightCard:** Enhanced integration for featured summary metrics, executive overview, and report highlights.
2. **CountUp:** Polished animated number counter for executive metrics with formatting and `prefers-reduced-motion` compliance.
3. **ShinyText:** Subtle gleaming text effect on featured badges, enterprise tags, and verification statuses.
4. **StarBorder:** Interactive highlight border for key primary actions (e.g. "Build Business Case").
5. **Micro-interactions:** Smooth tab transitions, drawer expansions, toast notifications, and loading skeletons.

### C. Component Architecture
- `src/components/common/`: `AppShell`, `TopBar`, `Sidebar`, `MetricCard`, `Badge`, `Button`, `Toast`, `Modal`, `Tabs`, `Icons`.
- `src/components/dashboard/`: `OverviewWorkspace`, `RecentCasesList`, `MetricOverview`.
- `src/components/intake/`: `BuyerIntakeForm`, `StepNavigation`, `FormSection`, `InputTooltip`.
- `src/components/analysis/`: `ExecutiveSummary`, `CostBreakdown`, `ScenariosGrid`, `SensitivityCard`, `AssumptionsList`, `OpenQuestions`.
- `src/components/evidence/`: `EvidenceWorkspace`, `EvidenceFilterBar`, `EvidenceCard`, `EvidenceDetailModal`.
- `src/components/saved/`: `SavedCasesManager`, `CaseCard`.
- `src/components/report/`: `ReportPreview`, `ExportControls`.

---

## 5. Acceptance & Verification Report

### Verified Results:
- [x] **Zero changes to FastAPI backend endpoints and Decimal financial calculation engine.** All business logic, rounding rules, scenarios, sensitivity calculations, and report builders remain intact.
- [x] **Full preservation of partial analysis and missing input handling:** Unknown values remain explicitly labelled as unknown rather than coerced to zero (e.g. "What is the buyer estimate for current?").
- [x] **Backend Unit Test Suite:** All 31 tests passed in `unittest discover -s tests -v` (29 passed, 2 skipped requiring live isolated PostgreSQL/sockets).
- [x] **Evaluation Rule Checks:** All automated checks in `evaluations/run.py` (T1-A, T1-B, T1-C, T3-01, T3-02, T3-03) passed.
- [x] **Frontend Production Build:** `tsc --noEmit && vite build` passed with zero errors (46 modules transformed, CSS bundle 46.19 kB, JS bundle 306.78 kB).
- [x] **Headless Chrome Multi-Viewport Browser Test (`frontend/tests/browser.mjs`):**
  - **1440px Desktop:** Passed. Verified full business case build, `USD 65,000.00` base scenario annual change, Spotlight Card rendering, save case state transition (`Saved ✓`), and 4 export downloads (`.xlsx`, `.pdf`, `.docx`, `.csv`).
  - **1280px Laptop:** Passed. Responsive layout verified, no horizontal overflow.
  - **768px Tablet:** Passed. Single column form and stacked tables verified, no horizontal overflow.
  - **375px Mobile:** Passed. Verified zero document-level horizontal page overflow (`scrollWidth <= clientWidth`), drawer navigation, touch-friendly inputs, and legible typography.
  - **Modal Interactions:** Verified evidence card click opens detail dialog (`Direct Source Excerpt`), modal focus trap, and keyboard/button dismiss.
  - **Keyboard Accessibility:** Verified visible keyboard focus (`Tab` key navigates to interactive elements, not `BODY`).
  - **Zero Console Errors:** Page error listener recorded zero uncaught exceptions or console errors across all test runs.
  - **Reduced Motion:** Verified `@media (prefers-reduced-motion: reduce)` disables animations and sets instant scrolling.

