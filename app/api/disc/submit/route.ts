export const runtime='nodejs';
export const maxDuration=60;
import {backend} from '@/lib/disc-server';
import {validateAnswers,validatePerson,VERSION,PRIVACY_VERSION} from '@/lib/disc';
export async function POST(req:Request){
 try{
  const origin=req.headers.get('origin');
  if(origin){
   let source:URL;try{source=new URL(origin);}catch{return Response.json({error:'Origem não permitida.'},{status:403});}
   const requestHost=req.headers.get('host')||new URL(req.url).host;
   if(source.host!==requestHost||!['http:','https:'].includes(source.protocol)||(process.env.VERCEL==='1'&&source.protocol!=='https:'))return Response.json({error:'Origem não permitida.'},{status:403});
  }
  if(!req.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Formato inválido.'},{status:415});
  const raw=await req.text();if(raw.length>12000)return Response.json({error:'Solicitação muito grande.'},{status:413});
  let b;try{b=JSON.parse(raw);}catch{return Response.json({error:'Solicitação inválida.'},{status:400});}
  if(b.website||!validatePerson(b.person)||!validateAnswers(b.answers)||b.version!==VERSION||b.privacyVersion!==PRIVACY_VERSION)return Response.json({error:'Confira seus dados e responda a todas as perguntas.'},{status:400});
  const r=await backend({person:b.person,answers:b.answers,requestId:b.requestId,startedAt:b.startedAt,version:b.version,privacyVersion:b.privacyVersion,website:b.website,clientIp:req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown'});
  return Response.json(await r.json(),{status:r.status,headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'A conexão foi interrompida. Suas respostas foram mantidas. Tente concluir novamente.'},{status:503});}
}
