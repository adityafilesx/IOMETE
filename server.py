"""Local-only HTTP API and static application. No external services or secrets."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse
import json, sqlite3, datetime
from engine import analyze
ROOT=Path(__file__).parent
DB=ROOT/'proofdesk.sqlite3'
def db():
 c=sqlite3.connect(DB); c.execute('CREATE TABLE IF NOT EXISTS cases (id INTEGER PRIMARY KEY, name TEXT NOT NULL, data TEXT NOT NULL, updated TEXT NOT NULL)'); return c
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw): super().__init__(*a,directory=str(ROOT/'static'),**kw)
 def log_message(self,*args): pass
 def sendjson(self,data,status=200):
  b=json.dumps(data,allow_nan=False).encode(); self.send_response(status); self.send_header('Content-Type','application/json'); self.send_header('Content-Length',str(len(b))); self.send_header('Cache-Control','no-store'); self.end_headers(); self.wfile.write(b)
 def do_GET(self):
  path=urlparse(self.path).path
  if path=='/api/cases':
   with db() as c: self.sendjson([{'id':r[0],'name':r[1],'updated':r[2]} for r in c.execute('SELECT id,name,updated FROM cases ORDER BY updated DESC')]); return
  if path.startswith('/api/cases/'):
   try:
    with db() as c: row=c.execute('SELECT data FROM cases WHERE id=?',(int(path.split('/')[-1]),)).fetchone()
    self.sendjson(json.loads(row[0]) if row else {'error':'Case not found'},200 if row else 404)
   except ValueError: self.sendjson({'error':'Invalid case ID'},400)
   return
  super().do_GET()
 def do_POST(self):
  try:
   length=int(self.headers.get('Content-Length','0'))
   if length<=0 or length>100000: raise ValueError('Invalid request size')
   data=json.loads(self.rfile.read(length)); path=urlparse(self.path).path
   if not isinstance(data,dict): raise ValueError('Expected an object')
   if path=='/api/analyze':
    from reports import build_report
    result=analyze(data); result['report']=build_report(data,result); self.sendjson(result); return
   if path in ('/api/export/xlsx','/api/export/pdf','/api/export/docx'):
    import exports
    kind=path.rsplit('/',1)[-1]
    try: content=getattr(exports, {'xlsx':'workbook','pdf':'pdf','docx':'docx'}[kind])(data)
    except ImportError: self.sendjson({'error':'Export dependencies are not installed; see README.'},503); return
    types={'xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','pdf':'application/pdf','docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
    self.send_response(200); self.send_header('Content-Type',types[kind]); self.send_header('Content-Disposition',f'attachment; filename=proofdesk.{kind}'); self.send_header('Content-Length',str(len(content))); self.send_header('Cache-Control','no-store'); self.end_headers(); self.wfile.write(content); return
   if path=='/api/cases':
    analyze(data); name=str(data.get('name','')).strip()
    if not name or len(name)>120: raise ValueError('Enter a case name (up to 120 characters)')
    with db() as c:
     now=datetime.datetime.now(datetime.timezone.utc).isoformat(); ident=data.get('id')
     if ident:
      cur=c.execute('UPDATE cases SET name=?,data=?,updated=? WHERE id=?',(name,json.dumps(data),now,ident))
      if not cur.rowcount: raise ValueError('Case not found')
     else: ident=c.execute('INSERT INTO cases(name,data,updated) VALUES(?,?,?)',(name,json.dumps(data),now)).lastrowid
    self.sendjson({'id':ident}); return
   self.sendjson({'error':'Not found'},404)
  except (ValueError,TypeError,KeyError,json.JSONDecodeError) as e: self.sendjson({'error':str(e)},400)
 def do_DELETE(self):
  try:
   ident=int(urlparse(self.path).path.split('/')[-1])
   with db() as c: count=c.execute('DELETE FROM cases WHERE id=?',(ident,)).rowcount
   self.sendjson({'deleted':bool(count)},200 if count else 404)
  except ValueError: self.sendjson({'error':'Invalid case ID'},400)
if __name__=='__main__':
 print('ProofDesk running at http://127.0.0.1:8000',flush=True); ThreadingHTTPServer(('127.0.0.1',8000),Handler).serve_forever()
