"""Export validated cases; the Python analysis remains authoritative.

Spreadsheet formulas are provided for inspection and recalculation in a
spreadsheet application. Formula caches are not calculated here.
"""
from io import BytesIO
from engine import analyze
from reports import build_report

FIELDS=[('current','Current annual cost'),('infrastructure','Infrastructure / year'),('fte','Platform FTE'),('staff_cost','Loaded cost / FTE / year'),('migration','Migration (one-time)'),('parallel_months','Parallel running months'),('horizon','Horizon years'),('fx','Currency per USD'),('vcpu_low','vCPU low'),('vcpu_base','vCPU base'),('vcpu_high','vCPU high')]

def workbook(data):
 from openpyxl import Workbook
 from openpyxl.styles import Font, PatternFill
 from openpyxl.utils import get_column_letter
 a=analyze(data); wb=Workbook(); ws=wb.active; ws.title='Scenarios'; inp=wb.create_sheet('Inputs'); ev=wb.create_sheet('Evidence');sens=wb.create_sheet('Sensitivity')
 inp.append(['Input / buyer assumption','Value']);
 for key,label in FIELDS:
  raw=data.get(key); value=None if raw is None or str(raw).strip()=='' else float(raw); inp.append([label,value])
 inp.append(['Enterprise controls required',int(any(x in data.get('controls',[]) for x in ('masking','security','auditing')))]) # row 13
 inp.append(['Multi-region required',int('multi_region' in data.get('controls',[]))]) # row 14
 inp.append(['Currency',str(data.get('currency','USD')).upper()])
 inp.append(['License rate USD/vCPU/year',500]); inp.append(['Enterprise minimum USD/year',100000])
 ws.append(['Scenario','vCPUs','Plan','License / year','Staff / year','Parallel','One-time','Recurring / year','Annualized','Annual change','TCO','Baseline TCO','Payback years'])
 for row,source in enumerate((10,11,12),2):
  ws.append([('Low','Base','High')[row-2],f'=IF(ISNUMBER(Inputs!B{source}),Inputs!B{source},"")',
  f'=IF(Inputs!B14=1,"Business Critical",IF(Inputs!B13=1,"Enterprise",IF(ISNUMBER(B{row}),IF(B{row}>100,"Enterprise","Free"),"Unknown")))',
  f'=IF(C{row}="Free",0,IF(AND(C{row}="Enterprise",ISNUMBER(B{row}),ISNUMBER(Inputs!B9),Inputs!B9>0),MAX(B{row}*Inputs!B16,Inputs!B17)*Inputs!B9,""))',
  '=IF(AND(ISNUMBER(Inputs!B4),ISNUMBER(Inputs!B5)),Inputs!B4*Inputs!B5,"")',
  '=IF(AND(ISNUMBER(Inputs!B2),ISNUMBER(Inputs!B7)),Inputs!B2*Inputs!B7/12,"")',
  f'=IF(AND(ISNUMBER(Inputs!B6),ISNUMBER(F{row})),Inputs!B6+F{row},"")',
  f'=IF(AND(ISNUMBER(D{row}),ISNUMBER(Inputs!B3),ISNUMBER(E{row})),D{row}+Inputs!B3+E{row},"")',
  f'=IF(AND(ISNUMBER(H{row}),ISNUMBER(G{row}),ISNUMBER(Inputs!B8),Inputs!B8>0),H{row}+G{row}/Inputs!B8,"")',
  f'=IF(AND(ISNUMBER(Inputs!B2),ISNUMBER(I{row})),Inputs!B2-I{row},"")',
  f'=IF(AND(ISNUMBER(H{row}),ISNUMBER(Inputs!B8),ISNUMBER(G{row})),H{row}*Inputs!B8+G{row},"")',
  '=IF(AND(ISNUMBER(Inputs!B2),ISNUMBER(Inputs!B8)),Inputs!B2*Inputs!B8,"")',
  f'=IF(AND(ISNUMBER(G{row}),ISNUMBER(Inputs!B2),ISNUMBER(H{row})),IF(Inputs!B2-H{row}>0,G{row}/(Inputs!B2-H{row}),""),"")'])
 ws.append([]);ws.append(['Blank results mean inputs or custom pricing are unknown. Calculated in spreadsheet on open; compare against the application.'])
 sens.append(['Input','Lower annualized change','Higher annualized change','Changes sign?'])
 for item in a['calculation']['sensitivity']:
  sens.append([item['input'],item['low'],item['high'],'Yes' if item['flips'] else 'No'])
 sens.append(['Values are snapshots from the application, not live workbook formulas.'])
 ev.append(['ID','Claim','URL','Retrieved','Excerpt'])
 for e in a['evidence']: ev.append([e['id'],e['claim'],e['url'],e['date'],e['quote']])
 for sheet in wb:
  sheet.freeze_panes='B2'; sheet.auto_filter.ref=sheet.dimensions
  for c in sheet[1]: c.font=Font(bold=True,color='FFFFFF');c.fill=PatternFill('solid',fgColor='164E3C')
  for col in range(1,sheet.max_column+1): sheet.column_dimensions[get_column_letter(col)].width=22 if sheet!=ev else (14 if col==1 else 55)
  for row in sheet.iter_rows(min_row=2):
   for cell in row:
    if cell.data_type=='f' or cell.data_type=='n': cell.number_format='#,##0.00;[Red](#,##0.00)'
 wb.calculation.fullCalcOnLoad=True; wb.calculation.forceFullCalc=True
 out=BytesIO();wb.save(out);return out.getvalue()

def report_content(data):
 a=analyze(data); report=build_report(data,a); b=a['calculation']['scenarios'][1]; currency=str(data.get('currency','USD')).upper()
 def amount(value): return 'UNKNOWN' if value is None else f'{currency} {value:,.2f}'
 lines=[('heading',str(data.get('name') or 'Business case')),('paragraph',f"Audience: {data.get('role','CFO')} | Deterministic report"),('heading','Decision context'),('paragraph',a['fit']+'.'),('heading','Financial comparison'),('paragraph',f"Annualized change: {amount(b['annual_change'])}; proposed TCO: {amount(b['tco'])}; baseline TCO: {amount(b['baseline_tco'])}."),('paragraph','Annualized cost = recurring cost + (migration + parallel running) / horizon. Payback is one-time cost divided by positive annual run-rate savings.'),('heading','Sourced statements')]
 for statement in report['statements']:
  if statement['category']=='SOURCED':
   e=next(e for e in a['evidence'] if e['id']==statement['evidence_ids'][0]); lines.append(('paragraph',f"[SOURCED {e['id']}] {statement['text']} {e['url']} (retrieved {e['date']}; source snippets: {e['quote']})"))
 lines.append(('heading','Scenarios and sensitivity'))
 for scenario in a['calculation']['scenarios']:
  lines.append(('paragraph',f"[ASSUMED] {scenario['name']} ({scenario['vcpu'] if scenario['vcpu'] is not None else 'UNKNOWN'} vCPU): {scenario['plan']}; annualized cost {amount(scenario['annualized'])}; annual change {amount(scenario['annual_change'])}; TCO {amount(scenario['tco'])}."))
 for item in a['calculation']['sensitivity']:
  lines.append(('paragraph',f"[ASSUMED] {item['input']}: lower {amount(item['low'])}; higher {amount(item['high'])}; sign changes: {'yes' if item['flips'] else 'no'}."))
 if not a['calculation']['sensitivity']:lines.append(('paragraph','[UNKNOWN] Sensitivity is unavailable until the necessary inputs and pricing are known.'))
 lines.append(('heading','Assumptions and open questions'))
 for k,label in FIELDS: lines.append(('paragraph',f"[ASSUMED] {label}: {data.get(k) if data.get(k) not in ('',None) else 'UNKNOWN'}"))
 for q in a['unknowns']:lines.append(('paragraph',f'[UNKNOWN] {q}'))
 lines.append(('paragraph','Confirm pricing, plan eligibility, operational ownership and migration assumptions with IOMETE. This is not legal or compliance advice.'))
 return lines

def docx(data):
 from docx import Document
 from docx.shared import Pt
 doc=Document(); doc.styles['Normal'].font.size=Pt(10)
 for typ,text in report_content(data):
  if typ=='heading':doc.add_heading(text,level=1)
  else:doc.add_paragraph(text)
 out=BytesIO();doc.save(out);return out.getvalue()

def pdf(data):
 from reportlab.lib import colors
 from reportlab.lib.styles import getSampleStyleSheet
 from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
 from xml.sax.saxutils import escape
 out=BytesIO(); doc=SimpleDocTemplate(out,rightMargin=48,leftMargin=48,topMargin=48,bottomMargin=48); styles=getSampleStyleSheet();styles['Heading1'].textColor=colors.HexColor('#164e3c');styles['Heading1'].fontSize=15;styles['Heading1'].leading=18;styles['Heading1'].spaceBefore=6;styles['Heading1'].spaceAfter=4;styles['BodyText'].fontSize=9;styles['BodyText'].leading=12
 story=[]
 for typ,text in report_content(data):
  story.append(Paragraph(escape(text),styles['Heading1' if typ=='heading' else 'BodyText']));story.append(Spacer(1,3))
 doc.build(story);return out.getvalue()
