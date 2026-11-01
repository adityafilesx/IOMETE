"""Deterministic ProofDesk calculation and evidence rules. Amounts use Decimal."""
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

from pathlib import Path
import json

EVIDENCE = json.loads((Path(__file__).parent / 'data' / 'evidence.json').read_text(encoding='utf-8'))

def num(data, key, required=True):
 v=data.get(key)
 if v is None or str(v).strip()=='':
  if required: raise ValueError(f'{key.replace("_", " ")} is required')
  return None
 try: n=Decimal(str(v))
 except (InvalidOperation,ValueError): raise ValueError(f'{key.replace("_", " ")} must be a number')
 if not n.is_finite() or n < 0 or n > Decimal('1000000000000'): raise ValueError(f'{key.replace("_", " ")} must be a finite non-negative number')
 return n

def money(n): return float(n.quantize(Decimal('.01'),rounding=ROUND_HALF_UP))

def calculate(d):
 current=num(d,'current'); infra=num(d,'infrastructure'); fte=num(d,'fte'); staff=num(d,'staff_cost'); migration=num(d,'migration'); months=num(d,'parallel_months'); horizon=num(d,'horizon'); fx=num(d,'fx'); sensitivity=num(d,'sensitivity')
 if horizon < 1 or horizon > 30 or horizon != int(horizon): raise ValueError('Horizon must be a whole number between 1 and 30')
 if months > 120: raise ValueError('Parallel months must not exceed 120')
 if fx == 0: raise ValueError('FX rate must be greater than zero')
 if sensitivity > 100: raise ValueError('Sensitivity must be between 0 and 100 percent')
 cpus=[num(d,k) for k in ('vcpu_low','vcpu_base','vcpu_high')]
 if not cpus[0] <= cpus[1] <= cpus[2]: raise ValueError('vCPU scenarios must be ordered low, base, high')
 controls=d.get('controls',[])
 if not isinstance(controls,list) or any(c not in ['masking','security','auditing','multi_region','air_gapped'] for c in controls): raise ValueError('Invalid controls')
 scenarios=[]
 for label,cpu in zip(('Low','Base','High'),cpus):
  plan='Business Critical' if 'multi_region' in controls else ('Enterprise' if cpu>100 or any(c in controls for c in ('masking','security','auditing')) else 'Free')
  license = None if plan=='Business Critical' else (Decimal(0) if plan=='Free' else max(cpu*500,Decimal(100000))*fx)
  one=migration+current*months/12
  recurring=None if license is None else license+infra+fte*staff
  saving=None if recurring is None else current-recurring
  scenarios.append({'name':label,'vcpu':float(cpu),'plan':plan,'license':None if license is None else money(license),'staff':money(fte*staff),'parallel':money(current*months/12),'one_time':money(one),'recurring':None if recurring is None else money(recurring),'annualized':None if recurring is None else money(recurring+one/horizon),'annual_change':None if recurring is None else money(current-recurring-one/horizon),'tco':None if recurring is None else money(recurring*horizon+one),'baseline_tco':money(current*horizon),'payback':None if saving is None or saving<=0 else float((one/saving).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)),'run_rate_savings':None if saving is None else money(saving)})
 base=scenarios[1]; sens=[]
 if base['annual_change'] is not None:
  for k in ('current','infrastructure','fte','staff_cost','migration','parallel_months','vcpu_base'):
   changes=[]
   for sign in (-1,1):
    clone=dict(d); clone[k]=str(num(d,k)*(1+Decimal(sign)*sensitivity/100)); clone['sensitivity']='0'
    if k=='vcpu_base': clone['vcpu_low']=clone['vcpu_base']; clone['vcpu_high']=clone['vcpu_base']
    # calculate without recursive sensitivity
    changes.append(_annual(clone))
   sens.append({'input':k,'low':changes[0],'high':changes[1], 'flips': any(x is not None and (x>=0)!=(base['annual_change']>=0) for x in changes)})
 return {'scenarios':scenarios,'sensitivity':sens}

def _annual(d):
 c=num(d,'current'); cpu=num(d,'vcpu_base'); h=num(d,'horizon'); fx=num(d,'fx'); controls=d.get('controls',[])
 if 'multi_region' in controls:return None
 lic=Decimal(0) if cpu<=100 and not any(x in controls for x in ('masking','security','auditing')) else max(cpu*500,Decimal(100000))*fx
 return money(c-lic-num(d,'infrastructure')-num(d,'fte')*num(d,'staff_cost')-(num(d,'migration')+c*num(d,'parallel_months')/12)/h)

def analyze(d):
 result=partial_calculate(d); base=result['scenarios'][1]; unknown=['How are billable vCPUs counted under our contract?', 'Which vendor certifications and deployment-specific compliance obligations apply?', 'What migration effort and support terms apply to our workloads?']
 unknown.extend('What is the buyer estimate for '+k.replace('_',' ')+'?' for k in result['missing'])
 if 'air_gapped' in d.get('controls',[]): unknown.append('Which plan and support terms apply to our air-gapped deployment?')
 if base['plan']=='Business Critical': unknown.append('What is our Business Critical contract price and minimum commitment?')
 skills=d.get('skills','unknown'); fit='Needs operational capability before proceeding' if skills=='no' else ('Validate operational capability' if skills=='unknown' else 'Operational capability reported')
 return {'calculation':result,'evidence':EVIDENCE,'unknowns':unknown,'fit':fit}

FINANCIAL_FIELDS = ('current','infrastructure','fte','staff_cost','migration','parallel_months','horizon','fx','sensitivity','vcpu_low','vcpu_base','vcpu_high')

def partial_calculate(d):
 """Calculate only values whose dependencies are known; never impute missing inputs."""
 values={k:num(d,k,False) for k in FINANCIAL_FIELDS}
 missing=[k for k,v in values.items() if v is None]
 if values['horizon'] is not None and (values['horizon']<1 or values['horizon']>30 or values['horizon']!=int(values['horizon'])): raise ValueError('Horizon must be a whole number between 1 and 30')
 if values['fx'] == 0: raise ValueError('FX rate must be greater than zero')
 if values['parallel_months'] is not None and values['parallel_months']>120: raise ValueError('Parallel months must not exceed 120')
 if values['sensitivity'] is not None and values['sensitivity']>100: raise ValueError('Sensitivity must be between 0 and 100 percent')
 cpus=[values[k] for k in ('vcpu_low','vcpu_base','vcpu_high')]
 if any(a is not None and b is not None and a>b for a,b in zip(cpus,cpus[1:])) or (cpus[0] is not None and cpus[2] is not None and cpus[0]>cpus[2]): raise ValueError('vCPU scenarios must be ordered low, base, high')
 controls=d.get('controls',[])
 if not isinstance(controls,list) or any(c not in ['masking','security','auditing','multi_region','air_gapped'] for c in controls): raise ValueError('Invalid controls')
 if not missing:
  r=calculate(d); r['missing']=[]; return r
 current=values['current']; infra=values['infrastructure']; fte=values['fte']; staff_cost=values['staff_cost']; migration=values['migration']; months=values['parallel_months']; horizon=values['horizon']; fx=values['fx']
 staff=fte*staff_cost if fte is not None and staff_cost is not None else None
 parallel=current*months/12 if current is not None and months is not None else None
 one=migration+parallel if migration is not None and parallel is not None else None
 scenarios=[]
 for label,cpu in zip(('Low','Base','High'),cpus):
  plan='Business Critical' if 'multi_region' in controls else ('Enterprise' if any(c in controls for c in ('masking','security','auditing')) or (cpu is not None and cpu>100) else ('Free' if cpu is not None else 'Unknown'))
  license=None
  if plan=='Free': license=Decimal(0)
  elif plan=='Enterprise' and cpu is not None and fx is not None: license=max(cpu*500,Decimal(100000))*fx
  recurring=license+infra+staff if all(x is not None for x in (license,infra,staff)) else None
  saving=current-recurring if current is not None and recurring is not None else None
  annualized=recurring+one/horizon if all(x is not None for x in (recurring,one,horizon)) else None
  tco=recurring*horizon+one if all(x is not None for x in (recurring,one,horizon)) else None
  rounded=lambda v: None if v is None else money(v)
  scenarios.append({'name':label,'vcpu':None if cpu is None else float(cpu),'plan':plan,'license':rounded(license),'staff':rounded(staff),'parallel':rounded(parallel),'one_time':rounded(one),'recurring':rounded(recurring),'annualized':rounded(annualized),'annual_change':rounded(current-annualized) if current is not None and annualized is not None else None,'tco':rounded(tco),'baseline_tco':rounded(current*horizon) if current is not None and horizon is not None else None,'payback':float((one/saving).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)) if one is not None and saving is not None and saving>0 else None,'run_rate_savings':rounded(saving)})
 return {'scenarios':scenarios,'sensitivity':[],'missing':missing}
