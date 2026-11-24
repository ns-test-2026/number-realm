// Number Speedway offline cache. Bump VERSION when files change.
const VERSION="speedway-v2",CORE=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","audio/bark.mp3","audio/opening.mp3","audio/parade.mp3"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("speedway-")&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put("index.html",cp));return res}).catch(()=>caches.open(VERSION).then(c=>c.match("index.html"))));return}
  e.respondWith(caches.open(VERSION).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res}))))});
