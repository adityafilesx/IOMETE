import unittest
from engine import calculate

BASE=dict(current=420000,infrastructure=90000,fte=1.5,staff_cost=60000,migration=120000,parallel_months=3,horizon=3,fx=1,sensitivity=25,vcpu_low=120,vcpu_base=160,vcpu_high=220,controls=['auditing'])
class FinanceTests(unittest.TestCase):
 def calc(self,**kw): return calculate(dict(BASE,**kw))['scenarios'][1]
 def test_spec_example(self):
  b=self.calc(); self.assertEqual(b['license'],100000); self.assertEqual(b['parallel'],105000); self.assertEqual(b['annualized'],355000); self.assertEqual(b['annual_change'],65000); self.assertEqual(b['tco'],1065000); self.assertEqual(b['payback'],1.61)
 def test_non_positive_savings(self):
  self.assertIsNone(self.calc(current=280000)['payback']); self.assertIsNone(self.calc(current=100000)['payback'])
 def test_zero_investment(self): self.assertEqual(self.calc(migration=0,parallel_months=0)['payback'],0)
 def test_free_and_cliff(self):
  self.assertEqual(self.calc(vcpu_low=100,vcpu_base=100,vcpu_high=100,controls=[])['license'],0)
  self.assertEqual(self.calc(vcpu_low=101,vcpu_base=101,vcpu_high=101,controls=[])['license'],100000)
 def test_custom_is_unknown(self): self.assertIsNone(self.calc(controls=['multi_region'])['tco'])
 def test_fx_and_horizon(self):
  b=self.calc(fx=2,horizon=5); self.assertEqual(b['license'],200000); self.assertEqual(b['tco'],2125000)
 def test_missing_invalid(self):
  for k,v in [('current',''),('infrastructure',-1),('fx',0),('fte','NaN'),('horizon',0),('vcpu_base',999)]:
   with self.subTest(k=k),self.assertRaises(ValueError): self.calc(**{k:v})
 def test_rounding(self): self.assertEqual(self.calc(infrastructure='90000.005')['recurring'],280000.01)
if __name__=='__main__': unittest.main()
