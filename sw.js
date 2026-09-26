/* ينهي التخزين القديم ويعيد تحميل النوافذ مرة واحدة إلى الملفات المنشورة. */
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())await caches.delete(key);await self.clients.claim();const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});await Promise.all(windows.map(client=>client.navigate(client.url)));await self.registration.unregister();})()));
