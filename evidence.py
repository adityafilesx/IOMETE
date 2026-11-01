"""Evidence integrity checks; metadata checks do not prove factual entailment."""
from datetime import date
from urllib.parse import urlparse

def validate_record(record,as_of=None,max_age_days=365):
 issues=[]
 for key in ('id','claim','quote','url','retrieval_date','source_title','context','verification_status'):
  if not isinstance(record.get(key),str) or not record[key].strip():issues.append(f'Missing {key}')
 url=record.get('url','');parsed=urlparse(url)
 if parsed.scheme!='https' or parsed.hostname!='iomete.com':issues.append('Source is not an approved IOMETE HTTPS URL')
 try:
  retrieved=date.fromisoformat(record.get('retrieval_date','')); today=as_of or date.today()
  if retrieved>today:issues.append('Retrieval date is in the future')
  elif (today-retrieved).days>max_age_days:issues.append('Evidence may be stale; recheck source')
 except (ValueError,TypeError):issues.append('Invalid retrieval date')
 if record.get('verification_status')!='vendor-stated':issues.append('Source status must identify vendor-stated claims')
 return issues

def validate_pack(records,as_of=None):
 ids=set();issues={}
 for record in records:
  ident=record.get('id','');errors=validate_record(record,as_of)
  if ident in ids:errors.append('Duplicate ID')
  ids.add(ident)
  if errors:issues[ident]=errors
 return issues
