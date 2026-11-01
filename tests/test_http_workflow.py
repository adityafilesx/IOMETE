"""Run separately with local socket permissions: python tests/test_http_workflow.py."""
import json,os,subprocess,sys,tempfile,time,unittest,urllib.request,urllib.error
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent.parent));sys.path.insert(0,str(Path(__file__).resolve().parent));from test_engine import BASE
ROOT=Path(__file__).resolve().parent.parent
@unittest.skipUnless(os.environ.get('PROOFDESK_HTTP_TEST')=='1','requires local socket permission')
class HTTPWorkflow(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.tmp=tempfile.TemporaryDirectory();env=dict(os.environ,PROOFDESK_SQLITE_PATH=str(Path(cls.tmp.name)/'test.db'))
  subprocess.run([sys.executable,'-m','api','--init-db'],cwd=ROOT,env=env,check=True,stdout=subprocess.DEVNULL)
  cls.server=subprocess.Popen([sys.executable,'-m','uvicorn','api:app','--host','127.0.0.1','--port','8765'],cwd=ROOT,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
  for _ in range(100):
   try: urllib.request.urlopen('http://127.0.0.1:8765/',timeout=.2);break
   except OSError: time.sleep(.05)
  else: raise RuntimeError('Server failed to start')
 @classmethod
 def tearDownClass(cls): cls.server.terminate();cls.server.wait(timeout=5);cls.tmp.cleanup()
 def request(self,path,data=None,method=None):
  req=urllib.request.Request('http://127.0.0.1:8765'+path,data=None if data is None else json.dumps(data).encode(),headers={'Content-Type':'application/json'},method=method)
  with urllib.request.urlopen(req) as r:return r.read()
 def test_case_lifecycle_and_exports(self):
  d=dict(BASE,name='Example',role='CFO',currency='USD',current=''); result=json.loads(self.request('/api/analyze',d));self.assertIsNone(result['calculation']['scenarios'][1]['annual_change']);self.assertIn('current',result['calculation']['missing']);self.assertTrue(result['report']['verification'])
  ident=json.loads(self.request('/api/cases',d))['id'];saved=json.loads(self.request('/api/cases/'+str(ident)));self.assertEqual(saved['current'],'');self.assertEqual(json.loads(self.request('/api/cases'))[0]['id'],ident)
  for kind,magic in [('xlsx',b'PK'),('docx',b'PK'),('pdf',b'%PDF')]: self.assertTrue(self.request('/api/export/'+kind,d).startswith(magic))
  self.assertTrue(json.loads(self.request('/api/cases/'+str(ident),method='DELETE'))['deleted'])
if __name__=='__main__': unittest.main()
