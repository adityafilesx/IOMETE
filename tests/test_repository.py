import json,os,sqlite3,tempfile,unittest
from unittest.mock import patch
import repository
class SQLiteRepositoryTests(unittest.TestCase):
 def test_migration_preserves_existing_case_and_snapshot(self):
  with tempfile.TemporaryDirectory() as td,patch.dict(os.environ,{'PROOFDESK_SQLITE_PATH':td+'/cases.db','DATABASE_URL':''}):
   c=sqlite3.connect(td+'/cases.db');c.execute('CREATE TABLE cases (id INTEGER PRIMARY KEY,name TEXT NOT NULL,data TEXT NOT NULL,updated TEXT NOT NULL)');c.execute('INSERT INTO cases VALUES(1,?,?,?)',('Old',json.dumps({'name':'Old'}),'today'));c.commit();c.close()
   repository.initialize();repository.initialize();self.assertEqual(repository.get_case(1)['name'],'Old');ident=repository.save_case({'name':'New'},{'test':'snapshot'});self.assertEqual(repository.get_case(ident)['name'],'New')
   c,_=repository.connection();self.assertEqual(json.loads(c.execute('SELECT snapshot FROM cases WHERE id=?',(ident,)).fetchone()[0])['analysis']['test'],'snapshot');c.close();self.assertTrue(repository.delete_case(ident))
@unittest.skipUnless(os.getenv('PROOFDESK_POSTGRES_TEST')=='1','requires isolated PostgreSQL')
class PostgreSQLRepositoryTests(unittest.TestCase):
 def test_migration_crud_persistence_and_rollback(self):
  repository.initialize();repository.initialize(); ident=repository.save_case({'name':'Postgres test'},{'annual_change':65000});self.assertEqual(repository.get_case(ident)['name'],'Postgres test')
  c,pg=repository.connection();self.assertTrue(pg);row=c.execute('SELECT snapshot FROM cases WHERE id=%s',(ident,)).fetchone();self.assertEqual(json.loads(row[0])['analysis']['annual_change'],65000);c.close()
  c,_=repository.connection()
  try:
   with c:
    c.execute('UPDATE cases SET name=%s WHERE id=%s',('rollback',ident));raise RuntimeError('test rollback')
  except RuntimeError:pass
  finally:c.close()
  self.assertEqual(repository.get_case(ident)['name'],'Postgres test');self.assertTrue(repository.delete_case(ident))
