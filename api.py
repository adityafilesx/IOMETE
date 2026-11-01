"""FastAPI adapter for the shared ProofDesk domain and export services.

SQLite is the local default. Set DATABASE_URL to a PostgreSQL connection URL
for the PostgreSQL path; initialize schema with `python -m api --init-db`.
"""
import os,json,sqlite3
from pathlib import Path
from typing import Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field
from engine import analyze, EVIDENCE
from reports import build_report
import exports
import repository

ROOT=Path(__file__).resolve().parent
app=FastAPI(title='ProofDesk local API')
@app.middleware('http')
async def local_origin_guard(request: Request, call_next):
 host=request.headers.get('host','').split(':')[0].lower()
 origin=request.headers.get('origin')
 is_allowed=host in ('127.0.0.1','localhost','testserver') or host.endswith('.vercel.app') or bool(os.environ.get('VERCEL'))
 if not is_allowed or (origin and origin != f'{request.url.scheme}://{request.headers.get("host","")}'):
  return JSONResponse({'error':'Only local or verified deployment requests are allowed'},status_code=403)
 return await call_next(request)


class CaseInput(BaseModel):
 model_config=ConfigDict(extra='allow')
 name:str=Field(default='',max_length=120)
 controls:list[str]=Field(default_factory=list)
 currency:str=Field(default='USD',pattern=r'^[A-Za-z]{3}$')

def validated(case):
 data=case.model_dump()
 try: result=analyze(data)
 except (ValueError,TypeError) as e: raise HTTPException(422,str(e)) from e
 return data,result

@app.post('/api/analyze')
def analysis(case:CaseInput):
 d,a=validated(case);a['report']=build_report(d,a);return a

@app.get('/api/evidence')
def get_evidence():
 return EVIDENCE

@app.get('/api/cases')
def list_cases():
 return repository.list_cases()

@app.get('/api/cases/{ident}')
def get_case(ident:int):
 data=repository.get_case(ident)
 if data is None:raise HTTPException(404,'Case not found')
 return data

@app.post('/api/cases')
def save_case(case:CaseInput):
 d,a=validated(case)
 if not d['name'].strip():raise HTTPException(422,'Case name is required')
 a['report']=build_report(d,a);ident=repository.save_case(d,a)
 if ident is None:raise HTTPException(404,'Case not found')
 return {'id':ident}

@app.delete('/api/cases/{ident}')
def delete_case(ident:int):
 if not repository.delete_case(ident):raise HTTPException(404,'Case not found')
 return {'deleted':True}

@app.post('/api/export/{kind}')
def export(case:CaseInput,kind:str):
 d,_=validated(case); methods={'xlsx':(exports.workbook,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),'pdf':(exports.pdf,'application/pdf'),'docx':(exports.docx,'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
 if kind not in methods:raise HTTPException(404,'Unknown format')
 fn,mime=methods[kind]; return Response(fn(d),media_type=mime,headers={'Content-Disposition':f'attachment; filename=proofdesk.{kind}','Cache-Control':'no-store'})

FRONTEND=ROOT/'frontend'/'dist'
@app.on_event('startup')
def startup_init():
 if os.environ.get('VERCEL'):
  try: repository.initialize()
  except Exception: pass

app.mount('/',StaticFiles(directory=FRONTEND if (FRONTEND/'index.html').exists() else ROOT/'static',html=True),name='static')
if __name__=='__main__':
 import sys
 if '--init-db' in sys.argv: repository.initialize();print('Schema initialized')

