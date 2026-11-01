"""Shared SQLite/PostgreSQL case repository with ordered schema migrations."""
import datetime,json,os,sqlite3
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def connection():
 url=os.environ.get('DATABASE_URL','')
 if url:
  if not url.startswith(('postgresql://','postgres://')): raise RuntimeError('DATABASE_URL must be a PostgreSQL URL')
  import psycopg
  return psycopg.connect(url),True
 default_path='/tmp/proofdesk.sqlite3' if os.environ.get('VERCEL') else str(ROOT/'proofdesk.sqlite3')
 return sqlite3.connect(os.environ.get('PROOFDESK_SQLITE_PATH',default_path)),False


def initialize():
 c,pg=connection()
 try:
  with c:
   c.execute('CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY)')
   applied={r[0] for r in c.execute('SELECT version FROM schema_migrations').fetchall()}
   if 1 not in applied:
    c.execute('CREATE TABLE IF NOT EXISTS cases (id '+('BIGSERIAL' if pg else 'INTEGER')+' PRIMARY KEY, name TEXT NOT NULL, data TEXT NOT NULL, updated TEXT NOT NULL)')
    c.execute('INSERT INTO schema_migrations(version) VALUES (1)')
   if 2 not in applied:
    # Existing installations have only the first four columns. This migration
    # preserves their contents and does not fabricate historical snapshots.
    c.execute('ALTER TABLE cases ADD COLUMN snapshot TEXT')
    c.execute('INSERT INTO schema_migrations(version) VALUES (2)')
 finally:c.close()

def list_cases():
 try:
  c,pg=connection()
  try:return [dict(zip(('id','name','updated'),row)) for row in c.execute('SELECT id,name,updated FROM cases ORDER BY updated DESC').fetchall()]
  finally:c.close()
 except sqlite3.OperationalError:
  initialize()
  c,pg=connection()
  try:return [dict(zip(('id','name','updated'),row)) for row in c.execute('SELECT id,name,updated FROM cases ORDER BY updated DESC').fetchall()]
  finally:c.close()

def get_case(ident):
 try:
  c,pg=connection()
  try:row=c.execute('SELECT data FROM cases WHERE id='+('%s' if pg else '?'),(ident,)).fetchone();return json.loads(row[0]) if row else None
  finally:c.close()
 except sqlite3.OperationalError:
  initialize()
  return None

def save_case(data,analysis):
 name=data['name'].strip(); ident=data.get('id');now=datetime.datetime.now(datetime.timezone.utc).isoformat();c,pg=connection();q='%s' if pg else '?'
 snapshot=json.dumps({'version':1,'analysis':analysis},allow_nan=False)
 try:
  with c:
   if ident:
    cur=c.execute(f'UPDATE cases SET name={q},data={q},updated={q},snapshot={q} WHERE id={q}',(name,json.dumps(data),now,snapshot,ident))
    if not cur.rowcount: return None
   elif pg:ident=c.execute(f'INSERT INTO cases(name,data,updated,snapshot) VALUES({q},{q},{q},{q}) RETURNING id',(name,json.dumps(data),now,snapshot)).fetchone()[0]
   else:ident=c.execute(f'INSERT INTO cases(name,data,updated,snapshot) VALUES({q},{q},{q},{q})',(name,json.dumps(data),now,snapshot)).lastrowid
  return ident
 except sqlite3.OperationalError:
  initialize()
  c2,pg2=connection()
  try:
   with c2:
    if ident:
     cur=c2.execute(f'UPDATE cases SET name={q},data={q},updated={q},snapshot={q} WHERE id={q}',(name,json.dumps(data),now,snapshot,ident))
     if not cur.rowcount: return None
    elif pg2:ident=c2.execute(f'INSERT INTO cases(name,data,updated,snapshot) VALUES({q},{q},{q},{q}) RETURNING id',(name,json.dumps(data),now,snapshot)).fetchone()[0]
    else:ident=c2.execute(f'INSERT INTO cases(name,data,updated,snapshot) VALUES({q},{q},{q},{q})',(name,json.dumps(data),now,snapshot)).lastrowid
   return ident
  finally:c2.close()
 finally:c.close()

def delete_case(ident):
 try:
  c,pg=connection()
  try:
   with c:return bool(c.execute('DELETE FROM cases WHERE id='+('%s' if pg else '?'),(ident,)).rowcount)
  finally:c.close()
 except sqlite3.OperationalError:
  initialize()
  return False
