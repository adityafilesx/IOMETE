# Implementation audit

## Starting point
The authoritative project specification is `Solution for the IOMETE track.md`, especially sections 4–9 and 11. The workspace contained that document and no source code, package manifest, database, Git repository, or project MCP configuration. The PDF named in the IDE context was not present in the workspace. The original specification was left unchanged.

## Product and priorities
ProofDesk helps a buyer prepare a defensible internal IOMETE business case, not sales copy. P0: typed intake, transparent deterministic costs, missing information, evidence, and a readable output. P1: three scenarios, persistence, fit, live-formula spreadsheet, role lenses and verifiable exports. P2: PDF/Word, a larger curated evidence pack, red-team tests and comparison studies.

## Implementation and risks
A local Python standard-library HTTP server, SQLite storage, and browser UI were built from scratch. The specified React/FastAPI/PostgreSQL template could not be installed from the restricted network, and FastAPI, uvicorn, openpyxl and pytest were not installed. This is an explicit prototype deviation, not a replacement of existing code. The local server is single-user and has no authentication, CSRF protection, or production hardening; it must not be exposed to a network. Local financial records are stored unencrypted. The external Google font is optional; system fonts are the fallback.

The cost model uses Decimal and shows inputs, three vCPU scenarios, an annualized comparison, a multi-year TCO and simple payback. It treats Business Critical pricing as unknown, because the published price is custom. Plan selection and the parallel-run approximation are assumptions, not contract advice. Evidence is a small curated pack, not the specified 40–60 claims. Memo generation is deterministic and no LLM is connected. Source matching and nuanced fit rules remain incomplete. See the traceability and status documents for tested behavior and remaining work.

## Acceptance criteria still outstanding
A full implementation needs the prescribed stack and lockfile, partial-input analysis, a verified larger evidence pack with claim-specific rules and complete provenance, role-specific prose and verified claim support, live-formula XLSX export, properly rendered PDF/Word, browser and accessibility QA, three sample buyer journeys, and actual red-team and peer comparison results. None of those results should be invented.

## Iteration update
The original eight tests passed before and after changes. The package registry was reachable with approved network access, allowing FastAPI, export packages and pinned Python dependencies to be installed. A FastAPI/SQLite workflow and an untested PostgreSQL connection path now supplement the original server. The current prototype remains outside the documented React template and is not production ready. Partial data, basic role evidence selection, canonical-text verification, file exports, and a small automated evaluation are now implemented; see `IMPLEMENTATION_STATUS.md` for actual verification and outstanding work.

## Iteration 3
The React/TypeScript interface and a built free React Bits component now run against FastAPI. SQLite and PostgreSQL share ordered migrations and case storage; an isolated PostgreSQL container passed migration, CRUD, rollback and HTTP tests, then was removed. A desktop/mobile Chrome journey passed. The evidence pack was expanded to 42 vendor-stated entries and numerical checks were narrowed to explicit labelled values. These checks do not constitute semantic entailment or an independent source audit. Full structured LLM integration, recalculated XLSX verification, comprehensive accessibility, and real T1–T5 evaluations remain outstanding. See `IMPLEMENTATION_STATUS.md` for precise commands and limitations.
