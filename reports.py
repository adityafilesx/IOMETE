"""Conservative report construction and verification.

Only canonical evidence statements and exact calculator-derived statements are
accepted. This is deliberately not a semantic entailment engine.
"""
from engine import analyze
from decimal import Decimal, InvalidOperation
import re

LENSES = {
 'CFO': ('PRICE-02','PRICE-01','PRICE-04'),
 'Security lead': ('PRICE-03','FAQ-01','PRICE-04'),
 'CTO / architect': ('PRICE-05','FAQ-01','PRICE-01'),
 'Student / newcomer': ('PRICE-01','PRICE-05','FAQ-01'),
}

def build_report(data, analysis=None):
 a=analysis or analyze(data); evidence={e['id']:e for e in a['evidence']}; role=data.get('role','CFO'); chosen=LENSES.get(role,LENSES['CFO']); base=a['calculation']['scenarios'][1]
 statements=[{'id':'source-'+eid,'text':evidence[eid]['claim'],'category':'SOURCED','evidence_ids':[eid]} for eid in chosen]
 if base['annual_change'] is not None:
  statements.append({'id':'annual-change','text':f"Annualized change: {base['annual_change']:.2f} {str(data.get('currency','USD')).upper()}.",'category':'ASSUMED','evidence_ids':[]})
 statements.append({'id':'fit','text':a['fit']+'.','category':'ASSUMED','evidence_ids':[]})
 statements.extend({'id':f'unknown-{i}','text':q,'category':'UNKNOWN','evidence_ids':[]} for i,q in enumerate(a['unknowns']))
 return {'role':role,'writer':'deterministic fallback','statements':statements,'verification':verify_statements(statements,data,a)}

def verify_statements(statements,data,analysis):
 """Allow only exact, atomic canonical assertions; reject unrecognized paraphrases."""
 evidence={e['id']:e for e in analysis['evidence']}; base=analysis['calculation']['scenarios'][1]
 expected_financial=None if base['annual_change'] is None else f"Annualized change: {base['annual_change']:.2f} {str(data.get('currency','USD')).upper()}."
 results=[]
 for item in statements:
  text=item.get('text',''); category=item.get('category'); ids=item.get('evidence_ids',[]); outcome='unverifiable'; reason='Not in the approved atomic claim set.'
  if category=='SOURCED':
   if not ids: outcome,reason='unsupported','A sourced assertion requires an evidence ID.'
   elif any(i not in evidence for i in ids): outcome,reason='unsupported','An evidence ID is not in the evidence pack.'
   elif any(text==evidence[i]['claim'] for i in ids): outcome,reason='supported','Exact canonical evidence claim.'
   elif any(evidence[i]['claim'] in text for i in ids): outcome,reason='partially supported','Contains a supported claim plus unverified text.'
   else: outcome,reason='unverifiable','The cited record does not establish this exact assertion.'
  elif category=='ASSUMED':
   if text in (expected_financial,analysis['fit']+'.'): outcome,reason='supported','Matches deterministic analysis.'
   else:
    # A deliberately narrow structured numeric grammar. It does not infer
    # financial meaning from arbitrary prose or treat similarity as entailment.
    match=re.fullmatch(r'(Annualized change|Proposed TCO|Baseline TCO|Run-rate savings):\s*([+-]?[\d,]+(?:\.\d+)?)\s+([A-Za-z]{3})\.',text)
    if match:
     field={'Annualized change':'annual_change','Proposed TCO':'tco','Baseline TCO':'baseline_tco','Run-rate savings':'run_rate_savings'}[match.group(1)]
     expected=base[field]
     try: value=Decimal(match.group(2).replace(',',''))
     except InvalidOperation: value=None
     if expected is None: outcome,reason='unverifiable','The required calculation is unknown.'
     elif match.group(3).upper()!=str(data.get('currency','USD')).upper(): outcome,reason='contradicted','Currency differs from the case currency.'
     elif value!=Decimal(str(expected)): outcome,reason='contradicted','Value differs from the calculator output.'
     else: outcome,reason='supported','The labelled value and currency match the deterministic calculation.'
    elif text.startswith(('Annualized change:','Proposed TCO:','Baseline TCO:','Run-rate savings:')):
     outcome,reason='unverifiable','Financial statement is not in the supported structured format.'
  elif category=='UNKNOWN':
   if text in analysis['unknowns']: outcome,reason='supported','Matches a recorded open question.'
  results.append({'statement_id':item.get('id'),'outcome':outcome,'explanation':reason})
 return results

def write_with_provider(data, provider=None):
 """Optional provider interface: accept only pre-approved atomic statements.
 Provider must return {'statements': [...]}; failures use a labelled fallback.
 """
 a=analyze(data); fallback=build_report(data,a)
 if provider is None: return fallback
 try:
  candidate=provider({'input':data,'analysis':a,'allowed_statements':fallback['statements']})
  if not isinstance(candidate,dict) or not isinstance(candidate.get('statements'),list): raise ValueError('Invalid provider response')
  statements=candidate['statements']
  if not all(isinstance(x,dict) and isinstance(x.get('text'),str) and isinstance(x.get('evidence_ids'),list) for x in statements): raise ValueError('Invalid statement schema')
  checks=verify_statements(statements,data,a)
  if not statements or any(x['outcome']!='supported' for x in checks): raise ValueError('Report failed verification')
  # Require all approved facts and open questions: omission must not hide limitations.
  canonical={(x['id'],x['text'],x['category'],tuple(x['evidence_ids'])) for x in fallback['statements']}
  actual={(x.get('id'),x['text'],x.get('category'),tuple(x['evidence_ids'])) for x in statements}
  if actual!=canonical: raise ValueError('Report omitted or changed required statements')
  return {'role':fallback['role'],'writer':'provider; verified against exact approved statements','statements':statements,'verification':checks}
 except (Exception) as exc:
  fallback['provider_error']=f'Provider failed or output was rejected ({type(exc).__name__}); deterministic fallback used.'
  return fallback
