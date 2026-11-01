# Macht web/ zur Homescreen-App, die offline läuft: Icons, manifest.webmanifest, sw.js
# und die nötigen Zeilen in index.html. Nach jeder Änderung an web/ erneut ausführen.
# Aufruf mit einem Python, das Pillow hat (z. B. ~/projects/Cockpit-stimme/venv-f5).
import hashlib, json, os, sys
from PIL import Image

HIER = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(HIER, "web")

# Icon: Hürmet-Landschaft zur Morgendämmerung mit Mondsichel (tools/symbol.py)
sys.path.insert(0, os.path.join(HIER, "tools"))
import symbol as sajda_symbol
img = sajda_symbol.zeichnen()
for g in (32, 180, 192, 512):
    img.resize((g, g), Image.LANCZOS).save(os.path.join(WEB, f"icon-{g}.png"))

manifest = {
    "name": "Sajda", "short_name": "Sajda", "lang": "de",
    "start_url": "./", "scope": "./", "display": "standalone",
    "background_color": "#f6f3ea", "theme_color": "#f6f3ea",
    "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
              {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}],
}
open(os.path.join(WEB, "manifest.webmanifest"), "w").write(json.dumps(manifest, ensure_ascii=False))

KOPF = ('<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-180.png">'
        '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">'
        '<meta name="apple-mobile-web-app-title" content="Sajda">')
SW = ("<script>if('serviceWorker'in navigator&&location.protocol.startsWith('http'))"
      "navigator.serviceWorker.register('sw.js').catch(()=>{})</script>")
pfad = os.path.join(WEB, "index.html")
html = open(pfad).read()
if KOPF not in html:
    html = html.replace("</head>", KOPF + "</head>", 1)
if SW not in html:
    html = html.replace("</body>", SW + "</body>", 1)
open(pfad, "w").write(html)

dateien, h = [], hashlib.sha1()
for wurzel, _, namen in sorted(os.walk(WEB)):
    for n in sorted(namen):
        # Stadt-Tabellen nicht vorab laden – nur die gewählte Stadt kommt beim ersten Abruf in den Speicher
        if n in ("sw.js", ".DS_Store", "diyanet-stuttgart.json") or n.startswith("diyanet-"):
            continue
        p = os.path.join(wurzel, n)
        dateien.append(os.path.relpath(p, WEB))
        h.update(open(p, "rb").read())
version = h.hexdigest()[:8]
# Gebetszeiten (JSON) zuerst aus dem Netz holen, damit Aktualisierungen ankommen; alles andere aus dem Cache
sw = f"""const CACHE='gebet-{version}';
const DATEIEN=['./',{','.join(json.dumps(x) for x in dateien)}];
self.addEventListener('install',e=>{{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(DATEIEN.map(u=>new Request(u,{{cache:'reload'}})))));self.skipWaiting()}});
self.addEventListener('activate',e=>{{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()}});
self.addEventListener('fetch',e=>{{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(r.url.endsWith('.json'))e.respondWith(fetch(r).then(a=>{{const k=a.clone();caches.open(CACHE).then(c=>c.put(r,k));return a}}).catch(()=>caches.match(r)));
  else e.respondWith(caches.match(r,{{ignoreSearch:true}}).then(a=>a||fetch(r)))}});
"""
open(os.path.join(WEB, "sw.js"), "w").write(sw)
print(f"{len(dateien)} Dateien im Offline-Speicher, Version {version}")
