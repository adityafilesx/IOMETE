import unittest
from datetime import date
from engine import EVIDENCE
from evidence import validate_record,validate_pack
from reports import verify_statements
from engine import analyze
from test_engine import BASE
class EvidenceTests(unittest.TestCase):
 def test_evidence_integrity(self):
  self.assertGreaterEqual(len(EVIDENCE),40);self.assertEqual(validate_pack(EVIDENCE,date(2026,11,1)),{})
 def test_missing_stale_and_untrusted(self):
  record=dict(EVIDENCE[0],quote='',url='https://evil.example/',retrieval_date='2020-01-01');errors=validate_record(record,date(2026,11,1));self.assertTrue(any('quote' in x for x in errors));self.assertTrue(any('Source' in x for x in errors));self.assertTrue(any('stale' in x for x in errors))
 def test_duplicate_ids(self):self.assertIn(EVIDENCE[0]['id'],validate_pack([EVIDENCE[0],EVIDENCE[0]],date(2026,11,1)))
 def test_missing_and_wrong_citation(self):
  a=analyze(BASE); statements=[{'id':'x','text':EVIDENCE[0]['claim'],'category':'SOURCED','evidence_ids':['MISSING']},{'id':'y','text':'IOMETE guarantees 50% savings.','category':'SOURCED','evidence_ids':['FAQ-02']}];r=verify_statements(statements,BASE,a);self.assertEqual(r[0]['outcome'],'unsupported');self.assertNotEqual(r[1]['outcome'],'supported')
