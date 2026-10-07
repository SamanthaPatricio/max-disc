export async function backend(body?:unknown){
 const config=process.env;
 if(!config.DISC_BACKEND_URL||!config.DISC_BACKEND_TOKEN)throw new Error('backend_not_configured');
 return fetch(config.DISC_BACKEND_URL,{method:body===undefined?'GET':'POST',headers:{'X-Max-Disc-Token':config.DISC_BACKEND_TOKEN,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(40000)});
}
