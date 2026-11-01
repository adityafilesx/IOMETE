"""Reproducible, narrow automated buyer checks; not a human evaluation."""
import json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent.parent))
from engine import analyze
from reports import verify_statements
common={'current':420000,'infrastructure':90000,'fte':1.5,'staff_cost':60000,'migration':120000,'parallel_months':3,'horizon':3,'fx':1,'sensitivity':25,'vcpu_low':120,'vcpu_base':160,'vcpu_high':220,'controls':['auditing']}
cases=[('T1-A','EU bank, illustrative',dict(common,role='CFO',skills='yes'),lambda a:a['calculation']['scenarios'][1]['annual_change']==65000),('T1-B','Fintech without Kubernetes skills, illustrative',dict(common,role='CTO / architect',skills='no'),lambda a:'before proceeding' in a['fit']),('T1-C','Air-gapped government, illustrative',dict(common,role='Security lead',skills='unknown',controls=['air_gapped']),lambda a:any('air-gapped' in x for x in a['unknowns']))]
results=[]
for ident,name,data,check in cases:
 a=analyze(data);ok=check(a);results.append({'id':ident,'case':name,'expected':'Specified financial or fit rule','actual':a['fit']+'; annual change: '+str(a['calculation']['scenarios'][1]['annual_change']),'pass':ok})
a=analyze(common)
for ident,statement in [('T3-01','IOMETE guarantees 50% savings.'),('T3-02','IOMETE is SOC 2 certified.'),('T3-03','20 TB requires 100 vCPUs.')]:
 out=verify_statements([{'id':ident,'text':statement,'category':'SOURCED','evidence_ids':[]}],common,a)[0];results.append({'id':ident,'case':statement,'expected':'Not supported','actual':out['outcome'],'pass':out['outcome']!='supported'})
print(json.dumps({'results':results,'limitations':'Automated rule checks only; not the full 20-question T3, chatbot comparison, finance reviewer, or peer study.'},indent=2))
if not all(x['pass'] for x in results):sys.exit(1)
