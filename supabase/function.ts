import {VERSION,PRIVACY_VERSION,LEGACY_PRIVACY_VERSION,RH_EMAIL,RECRUITMENT_GOAL,normalizeRecruitment,score,validatePerson,validateAnswers} from './disc.ts';
import {report} from './disc-report.ts';

const dbUrl=Deno.env.get('SUPABASE_URL')!;
const dbKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendKey=Deno.env.get('RESEND_API_KEY');
const sender=Deno.env.get('DISC_EMAIL_FROM');
const emailReady=Boolean(resendKey&&sender);
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
async function db(path:string,method='GET',body?:unknown,prefer='return=representation'){
 const res=await fetch(dbUrl+'/rest/v1/'+path,{method,headers:{apikey:dbKey,Authorization:'Bearer '+dbKey,'Content-Type':'application/json',Prefer:prefer},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
 const text=await res.text();if(!res.ok)throw new Error('database_'+res.status);return text?JSON.parse(text):null;
}
function equals(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
async function hash(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');}
async function deliver(row:any){
 try{
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+resendKey,'Content-Type':'application/json','Idempotency-Key':'max-disc-'+row.id},body:JSON.stringify({from:sender,to:[RH_EMAIL],subject:'[Max DISC] '+row.name.replace(/[\r\n]/g,' ')+' | '+row.result.title,html:report(row)}),signal:AbortSignal.timeout(15000)});
  const data=await r.json();if(!r.ok||!data.id)throw new Error('email_provider_'+r.status);
  await db('max_disc_results?id=eq.'+row.id,'PATCH',{email_status:'sent',email_sent_at:new Date().toISOString(),email_provider_id:data.id,email_error:null});return 'sent';
 }catch(e){await db('max_disc_results?id=eq.'+row.id,'PATCH',{email_status:'failed',email_error:e instanceof Error?e.message:'email_send_failed',email_next_attempt_at:new Date(Date.now()+Math.pow(2,row.email_attempts)*60000).toISOString()});return 'failed';}
}
Deno.serve(async(req:Request)=>{
 try{
  const presented=req.headers.get('X-Max-Disc-Token')||'';
  if(presented.length<48)return json({error:'Acesso não autorizado.'},401);
  const config=await db('max_disc_config?select=backend_token&id=eq.true');
  if(!config?.[0]||!equals(config[0].backend_token,presented))return json({error:'Acesso não autorizado.'},401);
  if(req.method==='GET')return json({ready:true,emailReady});
  if(req.method!=='POST')return json({error:'Método não permitido.'},405);
  const raw=await req.text();if(raw.length>16000)return json({error:'Solicitação muito grande.'},413);
  let body;try{body=JSON.parse(raw);}catch{return json({error:'Solicitação inválida.'},400);}
  if(body.action==='retry'){
   if(!emailReady)return json({emailReady:false,processed:0});
   const rows=await db('rpc/max_disc_claim_email','POST',{p_id:null});let sent=0;
   for(const row of rows)if(await deliver(row)==='sent')sent++;
   return json({emailReady:true,processed:rows.length,sent});
  }
  if(body.website||body.version!==VERSION||![PRIVACY_VERSION,LEGACY_PRIVACY_VERSION].includes(body.privacyVersion)||!validatePerson(body.person,body.privacyVersion===LEGACY_PRIVACY_VERSION)||!validateAnswers(body.answers)||!/^\b[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b$/i.test(body.requestId||''))return json({error:'Confira seus dados, as 40 respostas e a ciência sobre o uso das informações.'},400);
  if(!Number.isFinite(body.startedAt)||Date.now()-body.startedAt<10000)return json({error:'Revise suas respostas antes de concluir.'},400);
  const p=body.person;const person={name:p.name.trim(),email:p.email.trim().toLowerCase(),unit:p.unit,role:p.role.trim(),goal:p.goal,...(p.goal===RECRUITMENT_GOAL&&p.recruitment?{recruitment:normalizeRecruitment(p.recruitment)}:{})};
  const fingerprint=await hash(JSON.stringify({person,answers:body.answers,version:VERSION,privacyVersion:body.privacyVersion}));
  const existing=await db('max_disc_results?id=eq.'+body.requestId+'&select=id,result,payload_hash,email_status');
  if(existing.length){if(existing[0].payload_hash!==fingerprint)return json({error:'Este registro já foi concluído com outros dados. Inicie um novo teste em outra aba.'},409);return json({id:existing[0].id,result:existing[0].result,emailStatus:existing[0].email_status});}
  const ip=body.clientIp||'unknown';const ipKey=await hash(presented+ip);const emailKey=await hash(presented+person.email);
  for(const limits of [{p_key:'ip:'+ipKey,p_limit:120,p_window:3600},{p_key:'email:'+emailKey,p_limit:5,p_window:86400}]){if(!await db('rpc/max_disc_take_rate','POST',limits))return json({error:'Limite de tentativas atingido. Aguarde antes de tentar novamente ou fale com o RH.'},429);}
  const result=score(body.answers);
  let rows;try{rows=await db('max_disc_results','POST',{id:body.requestId,...person,answers:body.answers,result,questionnaire_version:VERSION,privacy_version:body.privacyVersion,payload_hash:fingerprint});}catch(e){
   const concurrent=await db('max_disc_results?id=eq.'+body.requestId+'&select=id,result,payload_hash,email_status');
   if(concurrent[0]?.payload_hash===fingerprint)return json({id:concurrent[0].id,result:concurrent[0].result,emailStatus:concurrent[0].email_status});throw e;
  }
  let emailStatus='pending';
  if(emailReady){try{const claimed=await db('rpc/max_disc_claim_email','POST',{p_id:body.requestId});if(claimed.length)emailStatus=await deliver(claimed[0]);}catch{emailStatus='pending';}}
  return json({id:rows[0].id,result,emailStatus});
 }catch{return json({error:'Não foi possível concluir agora. Suas respostas foram mantidas; tente novamente.'},503);}
});
