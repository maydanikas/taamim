const CACHE='taamim-v1';
const ASSETS=["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "img/01.jpg", "img/02.jpg", "img/03.jpg", "img/04.jpg", "img/05.jpg", "img/06.jpg", "img/07.jpg", "img/08.jpg", "img/09.jpg", "img/10.jpg", "img/11.jpg", "img/12.jpg", "img/13.jpg", "img/14.jpg", "img/15.jpg", "img/16.jpg", "img/17.jpg", "img/18.jpg", "img/19.jpg", "img/20.jpg", "img/21.jpg", "img/22.jpg", "img/23.jpg", "img/24.jpg", "img/25.jpg", "img/26.jpg", "img/27.jpg", "img/28.jpg", "img/29.jpg", "img/30.jpg", "img/31.jpg", "img/32.jpg", "img/33.jpg", "img/34.jpg", "img/35.jpg", "img/36.jpg", "img/37.jpg", "img/38.jpg", "img/39.jpg", "img/40.jpg", "img/41.jpg", "img/42.jpg", "img/43.jpg", "audio/01.mp3", "audio/02.mp3", "audio/03.mp3", "audio/04.mp3", "audio/05.mp3", "audio/06.mp3", "audio/07.mp3", "audio/08.mp3", "audio/09.mp3", "audio/10.mp3", "audio/11.mp3", "audio/12.mp3", "audio/13.mp3", "audio/14.mp3", "audio/15.mp3", "audio/16.mp3", "audio/17.mp3", "audio/18.mp3", "audio/19.mp3", "audio/20.mp3", "audio/21.mp3", "audio/22.mp3", "audio/23.mp3", "audio/24.mp3", "audio/25.mp3", "audio/26.mp3", "audio/27.mp3", "audio/28.mp3", "audio/29.mp3", "audio/30.mp3", "audio/31.mp3", "audio/32.mp3", "audio/33.mp3", "audio/34.mp3", "audio/35.mp3", "audio/36.mp3", "audio/37.mp3", "audio/38.mp3", "audio/39.mp3", "audio/40.mp3", "audio/41.mp3", "audio/42.mp3", "audio/43.mp3"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function ranged(req,res){
  const m=/bytes=(\d*)-(\d*)/.exec(req.headers.get('range')||'');
  if(!m)return res;
  const buf=await res.arrayBuffer(),size=buf.byteLength;
  let s=m[1]===''?Math.max(0,size-Number(m[2])):Number(m[1]);
  let e=m[1]===''||m[2]===''?size-1:Math.min(Number(m[2]),size-1);
  if(s>e||s>=size)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
  return new Response(buf.slice(s,e+1),{status:206,statusText:'Partial Content',headers:{'Content-Type':res.headers.get('Content-Type')||'audio/mpeg','Content-Length':String(e-s+1),'Content-Range':'bytes '+s+'-'+e+'/'+size,'Accept-Ranges':'bytes'}});
}
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==location.origin)return;
  const isPage=req.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/');
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    if(isPage){
      try{const r=await fetch(req);if(r&&r.ok)cache.put('index.html',r.clone());return r}
      catch(_){return (await cache.match('index.html'))||(await cache.match('./'))||Response.error()}
    }
    let hit=await cache.match(req,{ignoreSearch:true});
    if(!hit){
      try{const r=await fetch(req);if(r&&r.ok&&!req.headers.get('range'))cache.put(req,r.clone());return r}catch(_){return Response.error()}
    }
    return ranged(req,hit);
  })());
});
