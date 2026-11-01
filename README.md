# ProofDesk

A local prototype for an auditable IOMETE business case. The React/TypeScript frontend calls FastAPI; financial results use the shared Decimal engine and missing inputs remain unknown. See [implementation status](docs/IMPLEMENTATION_STATUS.md) for limitations.

## Setup and run

Requires Python 3.10+, Node.js and npm. `pdftotext` is needed for the PDF text test.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.lock
npm --prefix frontend ci
npm --prefix frontend run build
.venv/bin/python -m api --init-db
.venv/bin/python -m uvicorn api:app --host 127.0.0.1 --port 8000
```

Open http://127.0.0.1:8000. The build is served by FastAPI. If the build is absent, FastAPI falls back to the older static frontend. Build again after changing React source. SQLite is the default and stores cases in `proofdesk.sqlite3`.

### PostgreSQL

Set `DATABASE_URL` to a PostgreSQL connection URL supplied through your environment, run `python -m api --init-db` to apply ordered migrations, and start FastAPI with the same environment. For a disposable local test database you can use an existing `postgres:16-alpine` Docker image; provide your own password as `PROOFDESK_POSTGRES_PASSWORD`:

```sh
docker run --rm -d --name proofdesk-postgres -e POSTGRES_PASSWORD="$PROOFDESK_POSTGRES_PASSWORD" -e POSTGRES_DB=proofdesk -p 127.0.0.1:15432:5432 postgres:16-alpine
export DATABASE_URL="postgresql://postgres:${PROOFDESK_POSTGRES_PASSWORD}@127.0.0.1:15432/proofdesk"
.venv/bin/python -m api --init-db
.venv/bin/python -m uvicorn api:app --host 127.0.0.1 --port 8000
```

URL-encode special characters in credentials. Stop the disposable database with `docker stop proofdesk-postgres`. A disposable database has no durable volume and its data is lost on removal.

## Checks

```sh
.venv/bin/python -m unittest discover -s tests -v
PROOFDESK_HTTP_TEST=1 .venv/bin/python tests/test_http_workflow.py -v
PROOFDESK_POSTGRES_TEST=1 .venv/bin/python -m unittest discover -s tests -p test_repository.py -v
npm --prefix frontend run build
node frontend/tests/browser.mjs
.venv/bin/python evaluations/run.py
```

The PostgreSQL test requires `DATABASE_URL` to point to an isolated database. The HTTP and browser tests bind localhost; the browser test uses `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. The evaluation is a small automated check, not a buyer study. XLSX scenario formulas are not cached; a compatible spreadsheet application must recalculate them. Sensitivity values in that workbook are explicitly labelled snapshots.

This is a local single-user prototype. Cases are unencrypted. Do not expose it to a network or use sensitive customer data without authentication, encryption, deployment security and further review. No live model is configured; the report uses a labelled deterministic fallback.
