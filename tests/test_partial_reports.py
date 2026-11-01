import unittest
from engine import analyze, partial_calculate
from reports import build_report, verify_statements, write_with_provider
from test_engine import BASE

class PartialTests(unittest.TestCase):
 def test_missing_baseline_preserves_cost(self):
  result=partial_calculate(dict(BASE,current='')); b=result['scenarios'][1]
  self.assertEqual(b['recurring'],280000); self.assertIsNone(b['annual_change']); self.assertIsNone(b['parallel']); self.assertIn('current',result['missing'])
 def test_missing_proposed_preserves_baseline(self):
  b=partial_calculate(dict(BASE,infrastructure=''))['scenarios'][1]; self.assertEqual(b['baseline_tco'],1260000); self.assertIsNone(b['recurring']); self.assertEqual(b['parallel'],105000)
 def test_missing_cpu_is_unknown(self): self.assertEqual(partial_calculate(dict(BASE,vcpu_base='',controls=[]))['scenarios'][1]['plan'],'Unknown')
 def test_invalid_with_missing(self):
  with self.assertRaises(ValueError): partial_calculate(dict(BASE,current='',infrastructure=-1))
 def test_sensitivity_flip(self):
  a=partial_calculate(BASE); self.assertTrue(next(x for x in a['sensitivity'] if x['input']=='current')['flips'])
 def test_all_zero(self):
  d=dict(BASE,current=0,infrastructure=0,fte=0,staff_cost=0,migration=0,parallel_months=0,vcpu_low=0,vcpu_base=0,vcpu_high=0,controls=[]); b=partial_calculate(d)['scenarios'][1]; self.assertEqual(b['tco'],0); self.assertIsNone(b['payback'])

class ReportTests(unittest.TestCase):
 def test_role_lenses_keep_financial_output(self):
  a=build_report(dict(BASE,role='CFO')); b=build_report(dict(BASE,role='Security lead')); self.assertNotEqual(a['statements'][0],b['statements'][0]); self.assertEqual(next(x['text'] for x in a['statements'] if x['id']=='annual-change'),next(x['text'] for x in b['statements'] if x['id']=='annual-change'))
 def test_verification(self):
  d=BASE; a=analyze(d); e=a['evidence'][0]; statements=[{'id':'ok','text':e['claim'],'category':'SOURCED','evidence_ids':[e['id']]},{'id':'part','text':e['claim']+' Guaranteed savings.','category':'SOURCED','evidence_ids':[e['id']]},{'id':'none','text':'IOMETE is certified.','category':'SOURCED','evidence_ids':[]},{'id':'wrong','text':'Annualized change: 999.00 USD.','category':'ASSUMED','evidence_ids':[]}]; self.assertEqual([x['outcome'] for x in verify_statements(statements,d,a)],['supported','partially supported','unsupported','contradicted'])
 def test_mock_provider_and_rejection(self):
  self.assertIn('provider;',write_with_provider(BASE,lambda x:{'statements':x['allowed_statements']})['writer']); self.assertEqual(write_with_provider(BASE,lambda x:{'statements':[]})['writer'],'deterministic fallback')
 def test_timeout_fallback(self):
  def timeout(x): raise TimeoutError()
  self.assertIn('TimeoutError',write_with_provider(BASE,timeout)['provider_error'])

class NumericVerificationTests(unittest.TestCase):
 def test_numeric_value_and_currency(self):
  a=analyze(BASE); items=[{'id':str(i),'text':text,'category':'ASSUMED','evidence_ids':[]} for i,text in enumerate(['Proposed TCO: 1065000.00 USD.','Proposed TCO: 1065001.00 USD.','Proposed TCO: 1065000.00 EUR.','Proposed TCO: about one million dollars.'])]; self.assertEqual([x['outcome'] for x in verify_statements(items,BASE,a)],['supported','contradicted','contradicted','unverifiable'])
 def test_unknown_calculation(self):
  d=dict(BASE,current='');a=analyze(d);x={'id':'x','text':'Annualized change: 65000.00 USD.','category':'ASSUMED','evidence_ids':[]};self.assertEqual(verify_statements([x],d,a)[0]['outcome'],'unverifiable')
