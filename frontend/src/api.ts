import type {Analysis,Evidence,FormDataCase,SavedCase} from './types';
async function request(path:string, init?:RequestInit):Promise<Response>{
 let response:Response;
 try {response=await fetch(path,init)} catch {throw new Error('Cannot reach ProofDesk. Check that the server is running.');}
 if(!response.ok){let message=`Request failed (${response.status}).`;try{const value:unknown=await response.json();if(typeof value==='object'&&value!==null){const e=value as {detail?:unknown;error?:unknown};if(typeof e.detail==='string')message=e.detail;else if(typeof e.error==='string')message=e.error;else if(Array.isArray(e.detail))message=e.detail.map((x:{msg?:string})=>x.msg||'Invalid input').join('; ');}}catch{/* retain status */}throw new Error(message)}
 return response;
}
const json = (body:unknown):RequestInit => ({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
export const api={
 analyze:async (data:FormDataCase):Promise<Analysis> => (await request('/api/analyze',json(data))).json(),
 cases:async ():Promise<SavedCase[]> => (await request('/api/cases')).json(),
 get:async (id:number):Promise<FormDataCase> => (await request(`/api/cases/${id}`)).json(),
 save:async (data:FormDataCase):Promise<{id:number}> => (await request('/api/cases',json(data))).json(),
 remove:async (id:number):Promise<void> => {await request(`/api/cases/${id}`,{method:'DELETE'});},
 evidence:async ():Promise<Evidence[]> => (await request('/api/evidence')).json(),
 download:async (kind:'xlsx'|'pdf'|'docx', data:FormDataCase):Promise<void> => {const response=await request(`/api/export/${kind}`,json(data));const blob=await response.blob();if(!blob.size)throw new Error('The export was empty.');const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`proofdesk.${kind}`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
};
