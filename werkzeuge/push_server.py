# Test-Server für echte Push-Benachrichtigungen (nur zum Ausprobieren, nicht für die veröffentlichte Seite):
# liefert web/ aus und nimmt Push-Abos entgegen; schickt Test-Pushs und Erinnerungen zu den heutigen Gebetszeiten.
# Aufruf: werkzeuge/.venv-push/bin/python werkzeuge/push_server.py   (Port 8854, dann HTTPS-Tunnel davor)
import base64, json, os, threading, time
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from cryptography.hazmat.primitives import serialization
from py_vapid import Vapid
from pywebpush import webpush, WebPushException

HIER = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(HIER, "..", "web")
SCHLUESSEL = os.path.join(HIER, "vapid.pem")
ABOS = os.path.join(HIER, "push-abos.json")
PORT = 8854

if not os.path.exists(SCHLUESSEL):
    v = Vapid(); v.generate_keys(); v.save_key(SCHLUESSEL)
vapid = Vapid.from_file(SCHLUESSEL)
oeffentlich = base64.urlsafe_b64encode(vapid.public_key.public_bytes(
    serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)).rstrip(b"=").decode()

def abos():
    try: return json.load(open(ABOS))
    except Exception: return []

def senden(titel, text):
    behalten = []
    for abo in abos():
        try:
            webpush(abo, json.dumps({"titel": titel, "text": text}), vapid_private_key=SCHLUESSEL,
                    vapid_claims={"sub": "https://musancak.github.io/sajda/"}, ttl=600)
            behalten.append(abo)
        except WebPushException as e:
            print("Push fehlgeschlagen:", e)
            if e.response is None or e.response.status_code not in (404, 410): behalten.append(abo)
    json.dump(behalten, open(ABOS, "w"))
    print(datetime.now().strftime("%H:%M:%S"), "gesendet:", titel, "·", text, "an", len(behalten))

NAMEN = ["Morgengebet", "Sonnenaufgang", "Mittagsgebet", "Nachmittagsgebet", "Abendgebet", "Nachtgebet"]
geplant = []

def heute_planen():
    for t in geplant: t.cancel()
    geplant.clear()
    daten = json.load(open(os.path.join(WEB, "zeiten", "diyanet-stuttgart.json")))
    tag = datetime.now().strftime("%Y-%m-%d")
    zeiten = next((d["times"] for d in daten["days"] if d["date"] == tag), None) or []
    jetzt = datetime.now()
    for i, z in enumerate(zeiten):
        if i == 1: continue
        um = datetime.strptime(tag + " " + z, "%Y-%m-%d %H:%M")
        if um > jetzt:
            t = threading.Timer((um - jetzt).total_seconds(), senden, ("Sajda", f"Zeit für das {NAMEN[i]} · {z}"))
            t.daemon = True; t.start(); geplant.append(t)
    return len(geplant)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=WEB, **k)
    def antwort(self, daten, code=200):
        roh = json.dumps(daten).encode()
        self.send_response(code); self.send_header("Content-Type", "application/json"); self.send_header("Content-Length", len(roh)); self.end_headers(); self.wfile.write(roh)
    def end_headers(self):
        self.send_header("Cache-Control", "no-store"); super().end_headers()
    def do_GET(self):
        if self.path == "/api/push/schluessel": return self.antwort({"schluessel": oeffentlich})
        super().do_GET()
    def do_POST(self):
        laenge = int(self.headers.get("Content-Length") or 0)
        try: daten = json.loads(self.rfile.read(min(laenge, 20000)) or b"{}")
        except Exception: return self.antwort({"fehler": "kein JSON"}, 400)
        if self.path == "/api/push/abo":
            if not str(daten.get("endpoint", "")).startswith("https://"): return self.antwort({"fehler": "kein Abo"}, 400)
            liste = [a for a in abos() if a.get("endpoint") != daten["endpoint"]][-4:] + [daten]
            json.dump(liste, open(ABOS, "w")); return self.antwort({"ok": True, "abos": len(liste)})
        if self.path == "/api/push/test":
            sek = max(5, min(600, int(daten.get("sekunden", 30))))
            t = threading.Timer(sek, senden, ("Sajda", str(daten.get("text", "Test-Erinnerung"))[:120])); t.daemon = True; t.start()
            return self.antwort({"ok": True, "in": sek})
        if self.path == "/api/push/heute":
            return self.antwort({"ok": True, "geplant": heute_planen()})
        self.antwort({"fehler": "unbekannt"}, 404)

print("Push-Testserver auf Port", PORT)
ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
