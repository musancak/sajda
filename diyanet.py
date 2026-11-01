# Holt die offiziellen Diyanet-Gebetszeiten (DITIB) für die Städte in STAEDTE und schreibt
# web/zeiten/diyanet-<slug>.json sowie web/zeiten/staedte.json (Name, Koordinaten, Diyanet-ID).
# Koordinaten braucht die App für „Mein Standort“ und die berechneten Methoden.
# Aufruf: python3 diyanet.py   (läuft auch monatlich als GitHub Action)
import html, json, os, re, time, urllib.parse, urllib.request
from datetime import datetime, timezone

HIER = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.join(HIER, "web", "zeiten")
BASIS = "https://namazvakitleri.diyanet.gov.tr"
LAND = 13  # ALMANYA

# Name wie bei Diyanet (ohne Umlaute, groß) → Anzeigename, Breite, Länge
STAEDTE = {
    "AACHEN": ("Aachen", 50.776, 6.084), "AUGSBURG": ("Augsburg", 48.371, 10.898),
    "BERLIN": ("Berlin", 52.520, 13.405), "BIELEFELD": ("Bielefeld", 52.030, 8.532),
    "BOCHUM": ("Bochum", 51.482, 7.216), "BONN": ("Bonn", 50.737, 7.098),
    "BRAUNSCHWEIG": ("Braunschweig", 52.269, 10.521), "BREMEN": ("Bremen", 53.079, 8.802),
    "DARMSTADT": ("Darmstadt", 49.873, 8.651), "DORTMUND": ("Dortmund", 51.514, 7.468),
    "DRESDEN": ("Dresden", 51.050, 13.738), "DUISBURG": ("Duisburg", 51.434, 6.762),
    "DUSSELDORF": ("Düsseldorf", 51.227, 6.773), "ESSEN": ("Essen", 51.456, 7.012),
    "ESSLINGEN": ("Esslingen", 48.740, 9.307), "FRANKFURT": ("Frankfurt am Main", 50.110, 8.682),
    "FREIBURG": ("Freiburg", 47.999, 7.842), "GELSENKIRCHEN": ("Gelsenkirchen", 51.518, 7.086),
    "HAGEN": ("Hagen", 51.367, 7.463), "HAMBURG": ("Hamburg", 53.551, 9.994),
    "HAMM": ("Hamm", 51.681, 7.820), "HANNOVER": ("Hannover", 52.376, 9.732),
    "HEIDELBERG": ("Heidelberg", 49.399, 8.672), "HEILBRONN": ("Heilbronn", 49.142, 9.219),
    "KARLSRUHE": ("Karlsruhe", 49.007, 8.404), "KASSEL": ("Kassel", 51.312, 9.480),
    "KIEL": ("Kiel", 54.323, 10.123), "KOLN": ("Köln", 50.938, 6.960),
    "KREFELD": ("Krefeld", 51.339, 6.586), "LEIPZIG": ("Leipzig", 51.340, 12.375),
    "LUDWIGSBURG": ("Ludwigsburg", 48.897, 9.192), "LUDWIGSHAFEN": ("Ludwigshafen", 49.477, 8.445),
    "MAINZ": ("Mainz", 49.993, 8.247), "MANNHEIM": ("Mannheim", 49.488, 8.466),
    "MUNCHEN": ("München", 48.137, 11.576), "MUNSTER": ("Münster", 51.961, 7.626),
    "NURNBERG": ("Nürnberg", 49.452, 11.077), "OFFENBACH": ("Offenbach", 50.096, 8.766),
    "PFORZHEIM": ("Pforzheim", 48.892, 8.695), "REUTLINGEN": ("Reutlingen", 48.491, 9.204),
    "SAARBRUCKEN": ("Saarbrücken", 49.240, 6.997), "STUTTGART": ("Stuttgart", 48.776, 9.183),
    "ULM": ("Ulm", 48.401, 9.988), "WIESBADEN": ("Wiesbaden", 50.082, 8.240),
    "WUPPERTAL": ("Wuppertal", 51.256, 7.151),
}
MONATE = {"Ocak": 1, "Şubat": 2, "Mart": 3, "Nisan": 4, "Mayıs": 5, "Haziran": 6, "Temmuz": 7,
          "Ağustos": 8, "Eylül": 9, "Ekim": 10, "Kasım": 11, "Aralık": 12}

def holen(pfad):
    req = urllib.request.Request(BASIS + pfad, headers={"User-Agent": "Mozilla/5.0", "Accept": "text/html,application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8")

def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]*>", " ", s))).strip()

def tabelle(seite):
    # gleiche Prüfung wie worker/index.mjs: 8 Spalten, Datum, 6 aufsteigende Uhrzeiten
    tage = {}
    for zeile in re.findall(r"<tr\b[^>]*>(.*?)</tr>", seite, re.S | re.I):
        zellen = [text(z) for z in re.findall(r"<td\b[^>]*>(.*?)</td>", zeile, re.S | re.I)]
        if len(zellen) != 8:
            continue
        m = re.match(r"^(\d{1,2})\s+(\S+)\s+(\d{4})", zellen[0])
        if not m or m.group(2) not in MONATE:
            continue
        zeiten = zellen[2:]
        if not all(re.fullmatch(r"([01]\d|2[0-3]):[0-5]\d", z) for z in zeiten):
            continue
        minuten = [int(z[:2]) * 60 + int(z[3:]) for z in zeiten]
        if any(b <= a for a, b in zip(minuten, minuten[1:])):
            continue
        datum = f"{m.group(3)}-{MONATE[m.group(2)]:02d}-{int(m.group(1)):02d}"
        tage[datum] = {"date": datum, "hijri": zellen[1], "times": zeiten}
    return [tage[k] for k in sorted(tage)]

def slug(name):
    s = name.lower().translate(str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"}))
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def main():
    os.makedirs(ZIEL, exist_ok=True)
    laender = json.loads(holen(f"/tr-TR/home/GetRegList?ChangeType=country&CountryId={LAND}&Culture=tr-TR"))["StateList"]
    gefunden = {}
    for land in laender:
        q = urllib.parse.urlencode({"ChangeType": "state", "CountryId": LAND, "StateId": land["SehirID"], "Culture": "tr-TR"})
        for orte in json.loads(holen("/tr-TR/home/GetRegList?" + q))["StateRegionList"]:
            if orte["IlceAdi"] in STAEDTE and orte["IlceAdi"] not in gefunden:
                gefunden[orte["IlceAdi"]] = orte
        time.sleep(0.5)
    liste = []
    for schl, (name, lat, lon) in sorted(STAEDTE.items(), key=lambda x: x[1][0]):
        ort = gefunden.get(schl)
        if not ort:
            print("nicht bei Diyanet:", name)
            continue
        tage = tabelle(holen(ort["IlceUrl"]))
        if not tage:
            print("keine Tabelle:", name)
            continue
        s = slug(name)
        daten = {"city": name, "timezone": "Europe/Berlin", "source": BASIS + ort["IlceUrl"],
                 "fetchedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"), "days": tage}
        json.dump(daten, open(os.path.join(ZIEL, f"diyanet-{s}.json"), "w"), ensure_ascii=False, separators=(",", ":"))
        liste.append({"slug": s, "name": name, "lat": lat, "lon": lon, "diyanet": int(ort["IlceID"]), "url": BASIS + ort["IlceUrl"]})
        print(f"{name}: {len(tage)} Tage bis {tage[-1]['date']}", flush=True)
        time.sleep(1)
    json.dump(liste, open(os.path.join(ZIEL, "staedte.json"), "w"), ensure_ascii=False, indent=0)
    print(len(liste), "Städte")

if __name__ == "__main__":
    main()
