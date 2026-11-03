// Service Worker nur für die Entwürfe: zeigt Push-Benachrichtigungen und öffnet beim Antippen Falak
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch{d={titel:'Sajda',text:e.data?e.data.text():''}}
 e.waitUntil(self.registration.showNotification(d.titel||'Sajda',{body:d.text||'',icon:'../icon-192.png',badge:'../icon-192.png',tag:'sajda',renotify:true}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():self.clients.openWindow('d.html')))});
