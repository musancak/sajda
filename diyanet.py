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

# Türkei: alle 81 Provinzen, jeweils der Zentrumsbezirk (heißt bei Diyanet wie die Provinz)
LAND_TR = 2
TUERKEI = {
    "ADANA": ("Adana", 37.000, 35.321), "ADIYAMAN": ("Adıyaman", 37.764, 38.276), "AFYONKARAHISAR": ("Afyonkarahisar", 38.757, 30.538),
    "AGRI": ("Ağrı", 39.720, 43.051), "AKSARAY": ("Aksaray", 38.369, 34.037), "AMASYA": ("Amasya", 40.650, 35.833),
    "ANKARA": ("Ankara", 39.933, 32.859), "ANTALYA": ("Antalya", 36.897, 30.713), "ARDAHAN": ("Ardahan", 41.110, 42.702),
    "ARTVIN": ("Artvin", 41.183, 41.818), "AYDIN": ("Aydın", 37.845, 27.840), "BALIKESIR": ("Balıkesir", 39.648, 27.883),
    "BARTIN": ("Bartın", 41.636, 32.338), "BATMAN": ("Batman", 37.887, 41.132), "BAYBURT": ("Bayburt", 40.256, 40.225),
    "BILECIK": ("Bilecik", 40.142, 29.979), "BINGOL": ("Bingöl", 38.885, 40.498), "BITLIS": ("Bitlis", 38.401, 42.108),
    "BOLU": ("Bolu", 40.736, 31.607), "BURDUR": ("Burdur", 37.721, 30.290), "BURSA": ("Bursa", 40.183, 29.067),
    "CANAKKALE": ("Çanakkale", 40.155, 26.414), "CANKIRI": ("Çankırı", 40.601, 33.614), "CORUM": ("Çorum", 40.550, 34.955),
    "DENIZLI": ("Denizli", 37.784, 29.096), "DIYARBAKIR": ("Diyarbakır", 37.914, 40.230), "DUZCE": ("Düzce", 40.844, 31.157),
    "EDIRNE": ("Edirne", 41.677, 26.556), "ELAZIG": ("Elazığ", 38.675, 39.223), "ERZINCAN": ("Erzincan", 39.750, 39.500),
    "ERZURUM": ("Erzurum", 39.905, 41.268), "ESKISEHIR": ("Eskişehir", 39.777, 30.521), "GAZIANTEP": ("Gaziantep", 37.066, 37.383),
    "GIRESUN": ("Giresun", 40.913, 38.390), "GUMUSHANE": ("Gümüşhane", 40.460, 39.481), "HAKKARI": ("Hakkari", 37.574, 43.741),
    "HATAY": ("Hatay", 36.202, 36.160), "IGDIR": ("Iğdır", 39.920, 44.045), "ISPARTA": ("Isparta", 37.764, 30.556),
    "ISTANBUL": ("İstanbul", 41.008, 28.978), "IZMIR": ("İzmir", 38.423, 27.143), "KAHRAMANMARAS": ("Kahramanmaraş", 37.586, 36.937),
    "KARABUK": ("Karabük", 41.204, 32.627), "KARAMAN": ("Karaman", 37.181, 33.215), "KARS": ("Kars", 40.608, 43.097),
    "KASTAMONU": ("Kastamonu", 41.389, 33.783), "KAYSERI": ("Kayseri", 38.721, 35.487), "KILIS": ("Kilis", 36.718, 37.121),
    "KIRIKKALE": ("Kırıkkale", 39.846, 33.515), "KIRKLARELI": ("Kırklareli", 41.735, 27.225), "KIRSEHIR": ("Kırşehir", 39.146, 34.161),
    "KOCAELI": ("Kocaeli", 40.765, 29.940), "KONYA": ("Konya", 37.871, 32.485), "KUTAHYA": ("Kütahya", 39.420, 29.983),
    "MALATYA": ("Malatya", 38.355, 38.309), "MANISA": ("Manisa", 38.612, 27.426), "MARDIN": ("Mardin", 37.313, 40.735),
    "MERSIN": ("Mersin", 36.812, 34.641), "MUGLA": ("Muğla", 37.215, 28.364), "MUS": ("Muş", 38.746, 41.506),
    "NEVSEHIR": ("Nevşehir", 38.625, 34.712), "NIGDE": ("Niğde", 37.966, 34.679), "ORDU": ("Ordu", 40.986, 37.880),
    "OSMANIYE": ("Osmaniye", 37.074, 36.248), "RIZE": ("Rize", 41.025, 40.517), "SAKARYA": ("Sakarya", 40.774, 30.394),
    "SAMSUN": ("Samsun", 41.287, 36.330), "SANLIURFA": ("Şanlıurfa", 37.159, 38.797), "SIIRT": ("Siirt", 37.933, 41.946),
    "SINOP": ("Sinop", 42.027, 35.151), "SIRNAK": ("Şırnak", 37.519, 42.454), "SIVAS": ("Sivas", 39.748, 37.017),
    "TEKIRDAG": ("Tekirdağ", 40.978, 27.511), "TOKAT": ("Tokat", 40.314, 36.554), "TRABZON": ("Trabzon", 41.003, 39.717),
    "TUNCELI": ("Tunceli", 39.108, 39.548), "USAK": ("Uşak", 38.682, 29.408), "VAN": ("Van", 38.501, 43.373),
    "YALOVA": ("Yalova", 40.655, 29.277), "YOZGAT": ("Yozgat", 39.820, 34.808), "ZONGULDAK": ("Zonguldak", 41.456, 31.799),
}
MONATE = {"Ocak": 1, "Şubat": 2, "Mart": 3, "Nisan": 4, "Mayıs": 5, "Haziran": 6, "Temmuz": 7,
          "Ağustos": 8, "Eylül": 9, "Ekim": 10, "Kasım": 11, "Aralık": 12}

def holen(pfad, versuche=4):
    req = urllib.request.Request(BASIS + pfad, headers={"User-Agent": "Mozilla/5.0", "Accept": "text/html,application/json"})
    for i in range(versuche):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8")
        except OSError:
            if i == versuche - 1:
                raise
            time.sleep(5 * (i + 1))  # Diyanet bricht bei vielen Abrufen gelegentlich ab

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
    s = name.lower().translate(str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss", "ı": "i", "ş": "s", "ğ": "g", "ç": "c"})).replace("\u0307", "")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def ascii_gross(s):
    return s.upper().translate(str.maketrans("İIŞĞÜÖÇ", "IISGUOC"))

def bezirke_de():
    gefunden = {}
    laender = json.loads(holen(f"/tr-TR/home/GetRegList?ChangeType=country&CountryId={LAND}&Culture=tr-TR"))["StateList"]
    for land in laender:
        q = urllib.parse.urlencode({"ChangeType": "state", "CountryId": LAND, "StateId": land["SehirID"], "Culture": "tr-TR"})
        for orte in json.loads(holen("/tr-TR/home/GetRegList?" + q))["StateRegionList"]:
            if orte["IlceAdi"] in STAEDTE and orte["IlceAdi"] not in gefunden:
                gefunden[orte["IlceAdi"]] = orte
        time.sleep(0.5)
    return gefunden

def bezirke_tr():
    gefunden = {}
    for il in json.loads(holen(f"/tr-TR/home/GetRegList?ChangeType=country&CountryId={LAND_TR}&Culture=tr-TR"))["StateList"]:
        schl = ascii_gross(il["SehirAdiEn"])
        q = urllib.parse.urlencode({"ChangeType": "state", "CountryId": LAND_TR, "StateId": il["SehirID"], "Culture": "tr-TR"})
        for ilce in json.loads(holen("/tr-TR/home/GetRegList?" + q))["StateRegionList"]:
            if ascii_gross(ilce["IlceAdiEn"]) == schl:
                gefunden[schl] = ilce
        time.sleep(0.5)
    return gefunden

def main():
    os.makedirs(ZIEL, exist_ok=True)
    liste = []
    for land, staedte, bezirke, zone in (("DE", STAEDTE, bezirke_de, "Europe/Berlin"), ("TR", TUERKEI, bezirke_tr, "Europe/Istanbul")):
        gefunden = bezirke()
        for schl, (name, lat, lon) in sorted(staedte.items(), key=lambda x: x[1][0]):
            ort = gefunden.get(schl)
            if not ort:
                print("nicht bei Diyanet:", name)
                continue
            tage = tabelle(holen(ort["IlceUrl"]))
            if not tage:
                print("keine Tabelle:", name)
                continue
            s = slug(name) if land == "DE" else "tr-" + slug(name)
            daten = {"city": name, "timezone": zone, "source": BASIS + ort["IlceUrl"],
                     "fetchedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"), "days": tage}
            json.dump(daten, open(os.path.join(ZIEL, f"diyanet-{s}.json"), "w"), ensure_ascii=False, separators=(",", ":"))
            liste.append({"slug": s, "name": name, "land": land, "tz": zone, "lat": lat, "lon": lon, "diyanet": int(ort["IlceID"]), "url": BASIS + ort["IlceUrl"]})
            print(f"{name}: {len(tage)} Tage bis {tage[-1]['date']}", flush=True)
            time.sleep(1)
    json.dump(liste, open(os.path.join(ZIEL, "staedte.json"), "w"), ensure_ascii=False, indent=0)
    print(len(liste), "Städte")

if __name__ == "__main__":
    main()
