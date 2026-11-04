# Erzeugt web/globus-land.js: Landpunkte für den Gemeinsam-Globus als Zeilen mit Läufen.
# Quelle: world-atlas land-110m.json (Natural Earth, gemeinfrei), Pfad als Argument:
#   python3 werkzeuge/globus_punkte.py pfad/zu/land-110m.json
# Gitter: Zeilen alle SCHRITT Grad Breite, in jeder Zeile gleiche Abstände auf der Kugel
# (Anzahl Punkte ∝ cos(Breite)). Ausgabe je Zeile: [Breite, Punkte in der Zeile, Start, Ende, Start, Ende, …]
import json, math, os, sys

SCHRITT = 1.6
HIER = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.join(HIER, "..", "web", "globus-land.js")

topo = json.load(open(sys.argv[1]))
sx, sy = topo["transform"]["scale"]
tx, ty = topo["transform"]["translate"]
bögen = []
for bogen in topo["arcs"]:
    x = y = 0
    punkte = []
    for dx, dy in bogen:
        x += dx
        y += dy
        punkte.append((x * sx + tx, y * sy + ty))
    bögen.append(punkte)

def ring(indizes):
    r = []
    for i in indizes:
        b = bögen[i] if i >= 0 else bögen[~i][::-1]
        r.extend(b if not r else b[1:])
    return r

ringe = []
for geo in topo["objects"]["land"]["geometries"]:
    polys = geo["arcs"] if geo["type"] == "MultiPolygon" else [geo["arcs"]]
    for poly in polys:
        for teil in poly:
            ringe.append(ring(teil))

def an_land(lon, lat):
    # Gerade-Ungerade-Regel über alle Ringe (Löcher wie Seen heben sich auf)
    drin = False
    for r in ringe:
        for (x1, y1), (x2, y2) in zip(r, r[1:] + r[:1]):
            if (y1 > lat) != (y2 > lat) and lon < (x2 - x1) * (lat - y1) / (y2 - y1) + x1:
                drin = not drin
    return drin

zeilen = []
lat = -90 + SCHRITT / 2
while lat < 90:
    if lat < -60:  # Antarktis weglassen, sie liegt am Rand und lenkt nur ab
        lat += SCHRITT
        continue
    n = max(1, round(360 / SCHRITT * math.cos(math.radians(lat))))
    land = [an_land(-180 + (i + .5) * 360 / n, lat) for i in range(n)]
    läufe, i = [], 0
    while i < n:
        if land[i]:
            j = i
            while j + 1 < n and land[j + 1]:
                j += 1
            läufe += [i, j]
            i = j + 1
        else:
            i += 1
    if läufe:
        zeilen.append([round(lat, 2), n] + läufe)
    lat += SCHRITT

with open(ZIEL, "w") as f:
    f.write("'use strict';\n// Landpunkte für den Gemeinsam-Globus (aus werkzeuge/globus_punkte.py, Natural Earth 1:110 Mio.)\n")
    f.write("const GLOBUS_LAND=" + json.dumps(zeilen, separators=(",", ":")) + ";\n")
print(len(zeilen), "Zeilen,", sum(sum(z[k + 1] - z[k] + 1 for k in range(2, len(z), 2)) for z in zeilen), "Punkte,", os.path.getsize(ZIEL), "Bytes")
