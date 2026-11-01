<div align="center">

# ProofDesk
### The Technical Due-Diligence & Financial Intelligence Platform for IOMETE

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.162-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![WCAG](https://img.shields.io/badge/WCAG-2.2%20AA-10B981)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Tests](https://img.shields.io/badge/Tests-Passing-success)](tests/)

<p align="center">
  <strong>Construct evidence-backed, auditable business cases for platform modernization.</strong><br/>
  High-precision Decimal financial calculations · Multi-scenario TCO sizing · Zero fabricated savings · 42 curated vendor citations · Multi-format board exports.
</p>

[Explore Features](#-core-features) •
[Interactive Architecture](#-interactive-architecture--workflow) •
[React Bits Integration](#-react-bits-uiux-suite) •
[Quickstart](#-quickstart--local-setup) •
[Vercel Deployment](#-deploying-to-vercel) •
[Verification Suite](#-testing--acceptance-suite)

---

</div>

## 📌 Executive Overview

**ProofDesk** is an enterprise-grade financial intelligence and technical fit workspace designed for engineering leaders, CFOs, enterprise architects, and technical due-diligence teams evaluating an analytical migration to the **IOMETE Lakehouse**.

Unlike conventional sales ROI calculators that silently zero out missing inputs or extrapolate arbitrary percentage savings, ProofDesk operates on a **defense-first governance model**:
* **Explicit Unknowns:** Blank fields remain visibly marked as `UNKNOWN` rather than coerced to zero.
* **Exact Decimal Arithmetic:** Computes annualized run-rate change, multi-year TCO, and payback using Python's standard-library `Decimal` module to eliminate IEEE 754 floating-point drift.
* **Three-Scenario Sizing:** Evaluates Low, Base, and High vCPU workloads with automated sensitivity sign-flip detection.
* **Curated Evidence Pack:** 42 dated, vendor-stated claims tied directly to pricing rules and verified by exact canonical match.
* **Multi-Format Board Exports:** Generates audit-ready Excel workbooks (`.xlsx` with live formulas), executive memo PDFs, Word briefings (`.docx`), and raw data CSVs.

---

## 🚀 Core Features

| Workflow | Capabilities | Visual Highlights |
|---|---|---|
| **Overview Dashboard** | Workspace summary KPIs, recent cases quick-resume, and step-by-step defensible next actions. | React Bits `SpotlightCard` methodology showcase with glowing radial pointer illumination. |
| **Buyer Intake Builder** | Guided multi-step workflow across 3 logical domains: (1) About Case, (2) Baseline & Scale, and (3) Operating Assumptions. | Inline parameter tooltips, validation tags, and one-click *Load Illustrative Example*. |
| **Financial Intelligence** | Real-time executive KPI metrics, line-item cost categorization, and multi-year TCO comparisons. | React Bits `CountUp` numbers with `tabular-nums` formatting and reduced-motion fallback. |
| **Scenario Variance** | Side-by-side Low, Base, and High vCPU sizing with plan cliff detection and customizable FX rates. | Responsive comparative data table with clear delta indicators and baseline costs. |
| **Sensitivity Analysis** | Automated stress-testing varying operating parameters by user-defined percentages (e.g. ±25%). | Sign-flip alerts identifying which variables cause net savings to flip into cost increases. |
| **Evidence Research** | Searchable repository of 42 vendor statements with topic filters (Pricing, Security, Architecture, Migration). | Detail inspection modal with source URLs, retrieval dates, and claim transparency notice. |
| **Saved Cases Manager** | Persistent SQLite/PostgreSQL storage with versioned analysis snapshots and last-updated timestamps. | Case restore, metadata chips, and accessible modal confirmation for deletion. |
| **Executive Memo & Exports** | In-app formatted decision memorandum preview ready for board review or direct browser printing. | Unified toolbar downloading live formula `.xlsx`, executive `.pdf`, briefing `.docx`, and `.csv`. |

---

## 🏗 Interactive Architecture & Workflow

```mermaid
flowchart TD
    subgraph Client["Frontend: React 19 + TypeScript + Vite"]
        UI[App Shell & Navigation]
        Builder[Guided Buyer Intake]
        Overview[Overview & Recent Cases]
        Analysis[Financial Intelligence Workspace]
        Evidence[Evidence Research Library]
        Report[Executive Memo & Export Menu]
    end

    subgraph Backend["Backend: FastAPI + Python 3.10+"]
        API[FastAPI Router: /api/*]
        Engine[Exact Decimal Financial Engine]
        Verifier[Exact-Claim & Numeric Verifier]
        ReportsGen[ReportLab PDF & python-docx Generator]
        WorkbookGen[openpyxl Live Formula Workbook Generator]
    end

    subgraph Data["Persistence & Repositories"]
        SQLite[(SQLite: proofdesk.sqlite3)]
        Postgres[(PostgreSQL: DATABASE_URL)]
        Pack[(Evidence Pack: 42 JSON Records)]
    end

    UI --> Builder & Overview & Evidence & Report
    Builder -->|POST /api/analyze| API
    API --> Engine
    Engine --> Verifier
    Verifier --> Pack
    API -->|Save / Restore| SQLite & Postgres
    API -->|Export /pdf /xlsx /docx| ReportsGen & WorkbookGen
    API -->|Response JSON| Analysis
```

### Calculation Engine Formulation
* **Annualized Cost:** $\text{License} + \text{Infrastructure} + \text{Staff} + \frac{\text{Migration} + \text{Parallel Run}}{\text{Horizon}}$
* **Annualized Net Change:** $\text{Current Annual Cost} - \text{Annualized Cost}$
* **Total Cost of Ownership (TCO):** $(\text{Recurring Cost} \times \text{Horizon}) + \text{One-Time Costs}$
* **Simple Payback:** $\frac{\text{One-Time Costs}}{\text{Positive Annual Run-Rate Savings}}$

---

## 🎨 React Bits UI/UX Suite

ProofDesk integrates free, accessible components from [reactbits.dev](https://reactbits.dev/) to deliver a polished enterprise B2B SaaS experience without distracting visual clutter:

```
┌────────────────────────────────────────────────────────────────────────┐
│ REACT BITS COMPONENT SHOWCASE                                          │
├───────────────────┬────────────────────────────────────────────────────┤
│ SpotlightCard     │ Pointer-following radial light illumination on the │
│                   │ Overview methodology card & Builder right rail.    │
│ CountUp           │ Smooth cubic-bezier numerical counter transition   │
│                   │ for financial KPI figures (tabular numbers).       │
│ ShinyText         │ Subtle metallic light-sweep animation for category │
│                   │ badges and enterprise headers.                     │
│ StarBorder        │ Dynamic glowing perimeter border tracing primary   │
│                   │ CTA buttons ("Build business case").               │
└───────────────────┴────────────────────────────────────────────────────┘
```

* **Respects Reduced Motion:** All animations automatically evaluate `prefers-reduced-motion: reduce`. When active, animated transitions collapse to 0.01ms and static target values render immediately.
* **Design Tokens:** Curated palette featuring neutral canvas (`#f8fafc`), clean card surfaces (`#ffffff`), dark slate typography (`#0f172a`), deep emerald accents (`#0f766e`), and semantic alerts.

---

## 💻 Quickstart & Local Setup

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** and **npm**
* *(Optional for PDF text tests)* `pdftotext` (via `brew install poppler` on macOS or `apt install poppler-utils` on Linux)

### 1. Clone & Set Up Python Environment
```bash
git clone https://github.com/adityafilesx/IOMETE.git
cd IOMETE

# Create and activate Python virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install locked dependencies
pip install -r requirements.lock
```

### 2. Build Frontend
```bash
npm --prefix frontend ci
npm --prefix frontend run build
```

### 3. Initialize Database & Run Server
```bash
# Initialize SQLite schema migrations
python -m api --init-db

# Launch production-ready local server
uvicorn api:app --host 127.0.0.1 --port 8000
```
Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** in your browser. FastAPI automatically serves the compiled React application from `frontend/dist/`.

---

## 🐘 PostgreSQL Configuration (Optional)

By default, ProofDesk stores saved cases in local SQLite (`proofdesk.sqlite3`). To switch to an enterprise PostgreSQL instance:

```bash
# Example: Launch disposable local PostgreSQL 16 container
docker run --rm -d --name proofdesk-postgres \
  -e POSTGRES_PASSWORD="secretpassword" \
  -e POSTGRES_DB=proofdesk \
  -p 127.0.0.1:15432:5432 postgres:16-alpine

# Set connection URL & run migrations
export DATABASE_URL="postgresql://postgres:secretpassword@127.0.0.1:15432/proofdesk"
python -m api --init-db

# Launch server
uvicorn api:app --host 127.0.0.1 --port 8000
```

---

## ☁️ Deploying to Vercel

The repository includes ready-to-deploy configuration for Vercel Serverless:
* [`vercel.json`](vercel.json): Configures `@vercel/python` for FastAPI at `/api/*` and `@vercel/static-build` for the Vite frontend.
* [`requirements.txt`](requirements.txt): Pinned dependencies for the Vercel Python runtime.
* [`api/index.py`](api/index.py): Serverless ASGI handler with automatic SQLite `/tmp` fallback and schema initialization.

### Deployment Steps:
1. Push your repository to GitHub.
2. Go to **[vercel.com/new](https://vercel.com/new)** and import `adityafilesx/IOMETE`.
3. Keep default settings (Vercel automatically detects `vercel.json` and build scripts).
4. Click **Deploy**.

---

## 🧪 Testing & Acceptance Suite

Execute the comprehensive automated test matrix across backend, exports, browser journeys, and evaluations:

```bash
# 1. Run all backend unit tests (engine, evidence, exports, repository)
.venv/bin/python -m unittest discover -s tests -v

# 2. Verify frontend TypeScript & production build
npm --prefix frontend run build

# 3. Run Playwright multi-viewport browser test (1440px, 1280px, 768px, 375px)
node frontend/tests/browser.mjs

# 4. Run automated red-team rule checks
.venv/bin/python evaluations/run.py
```

### Verified Browser Journey:
* **Multi-Viewport Support:** Verified across **1440px Desktop**, **1280px Laptop**, **768px Tablet**, and **375px Mobile** with zero horizontal overflow (`scrollWidth === clientWidth`).
* **Core Journeys:** Full and partial analysis, case saving and restoration, search and modal inspection in the evidence library, visible keyboard focus (`Tab` navigation), and four download streams (`.xlsx`, `.pdf`, `.docx`, `.csv`).

---

## 📁 Repository Directory Structure

```text
├── api.py                    # FastAPI application, origin guard & static mounts
├── api/
│   └── index.py              # Vercel Serverless Function entrypoint
├── engine.py                 # Core Decimal financial calculation engine
├── evidence.py               # Evidence integrity & citation validation
├── exports.py                # Excel (.xlsx), PDF, Word (.docx) & CSV generators
├── repository.py             # Shared SQLite / PostgreSQL migration & snapshot repo
├── reports.py                # Deterministic executive memo generator
├── requirements.lock         # Locked Python dependency versions
├── requirements.txt          # Vercel deployment requirements
├── vercel.json               # Fullstack Vercel deployment configuration
├── package.json              # Root build orchestration script
├── data/
│   └── evidence.json         # 42 dated, vendor-stated evidence records
├── docs/
│   ├── UI_UX_AUDIT.md        # Complete UI/UX audit & verification report
│   ├── IMPLEMENTATION_STATUS.md # Iteration roadmap & verified status
│   ├── REACT_BITS_COMPONENT_AUDIT.md # React Bits integration review
│   └── REQUIREMENTS_TRACEABILITY.md # Traceability matrix from requirements
├── evaluations/              # Automated red-team checks & protocol
├── frontend/
│   ├── package.json          # React 19, TypeScript 5.9, Vite 6.4
│   ├── src/
│   │   ├── main.tsx          # Application root & view state orchestrator
│   │   ├── style.css         # Tokenized design system & React Bits animations
│   │   ├── api.ts            # Typed HTTP client
│   │   ├── types.ts          # Core domain TypeScript definitions
│   │   └── components/
│   │       ├── Icons.tsx     # Enterprise inline SVG icon library
│   │       ├── SpotlightCard.tsx # React Bits spotlight card component
│   │       ├── common/       # Badge, Modal, Toast, Tooltip
│   │       ├── layout/       # TopBar, Sidebar
│   │       ├── reactbits/    # CountUp, ShinyText, StarBorder
│   │       └── views/        # Overview, Builder, Analysis, Evidence, Saved, Report
│   └── tests/
│       └── browser.mjs       # Headless Chrome multi-viewport test
└── tests/                    # Backend unit test suite (31 tests)
```

---

## ⚖️ Governance & Security Notice

* **Local Prototype Security:** ProofDesk is designed as a single-user technical due-diligence tool. Data stored in SQLite/PostgreSQL is unencrypted. Do not expose this service to an untrusted public network without adding authentication, TLS termination, and role-based access control.
* **Evidence Verification Limits:** The built-in verifier checks exact canonical statements and structured numerical limits for labelled metrics. It does not establish arbitrary semantic entailment or replace human contract legal reviews.
* **Spreadsheet Recalculation:** XLSX exports contain live formulas. To observe dynamic recalculations, open the workbook in Microsoft Excel, LibreOffice Calc, or Google Sheets.

---

<div align="center">
  <sub>Built for the second conversation. Turn platform details into a decision your team can defend.</sub>
</div>
