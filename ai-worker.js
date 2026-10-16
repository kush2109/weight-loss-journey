// Cloudflare Worker: sends a meal photo to the AI service and returns estimated nutrition.
const J=(o,s,h)=>new Response(JSON.stringify(o),{status:s||200,headers:{'Content-Type':'application/json',...h}});
export default{async fetch(req,env){
 const cors={'Access-Control-Allow-Origin':env.ALLOWED_ORIGIN,'Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin'};
 if(req.method=='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!='POST'||req.headers.get('Origin')!=env.ALLOWED_ORIGIN)return J({error:'forbidden'},403,cors);
 const b=await req.json().catch(()=>({}));
 if(!b.image||b.image.length>6e6)return J({error:'Image missing or too large'},400,cors);
 const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'x-api-key':env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01','content-type':'application/json'},body:JSON.stringify({model:env.MODEL||'claude-haiku-5-5',max_tokens:800,
  system:'You estimate nutrition from meal photos. Reply with JSON only, no other text: {"items":[{"name":"food with portion, e.g. 2 chapati","kcal":number,"protein":number,"carbs":number,"fat":number}]}. Use typical Indian home-cooked portions where appropriate. Estimate honestly. If no food is visible return {"items":[]}.',
  messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:b.image}},{type:'text',text:'Identify each food on the plate and estimate its nutrition.'}]}]})});
 if(!r.ok)return J({error:'AI service error '+r.status},502,cors);
 const j=await r.json(),t=(j.content||[]).map(c=>c.text||'').join('');
 try{return J(JSON.parse(t.match(/\{[\s\S]*\}/)[0]),200,cors)}catch(e){return J({error:'Could not read the AI answer'},502,cors)}
}}
