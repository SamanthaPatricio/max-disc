export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
import {backend} from '@/lib/disc-server';
export async function GET(){try{const r=await backend();const d=await r.json() as {emailReady?:boolean};return Response.json({ready:r.ok,emailReady:r.ok&&d.emailReady===true},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({ready:false,emailReady:false},{headers:{'Cache-Control':'no-store'}});}}
