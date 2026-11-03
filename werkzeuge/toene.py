# Erzeugt die Benachrichtigungstöne für Sajda (synthetisch, keine fremden Aufnahmen):
#   hicaz    – drei weiche Glockenschläge im Maqam Hicaz (D · Es · Fis), aufsteigend
#   ney      – gehauchter Flötenton mit leichtem Vibrato, wie eine Ney
#   kristall – zwei gläserne Töne (Quinte), sehr kurz und modern
# Aufruf: python3 werkzeuge/toene.py  → web/entwurf/toene/<name>.m4a (über afconvert)
import os, subprocess, wave
import numpy as np

SR = 44100
ZIEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "web", "entwurf", "toene")
os.makedirs(ZIEL, exist_ok=True)
rng = np.random.default_rng(7)

def hall(x, dauer=2.4, nass=0.28):
    n = int(SR * dauer)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir[:int(SR * .012)] = 0
    ir /= np.abs(ir).sum() ** .5 * 6
    laenge = len(x) + n - 1
    f = 1 << (laenge - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, f) * np.fft.rfft(ir, f), f)[:laenge]
    return np.concatenate([x, np.zeros(n - 1)]) * (1 - nass) + y * nass

def glocke(f, dauer, lautst=1.0):
    t = np.arange(int(SR * dauer)) / SR
    teile = [(1, 1, 2.2), (2.0, .35, 3.2), (2.76, .22, 4.5), (5.4, .08, 7), (0.5, .18, 1.6)]
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-d * t) for r, a, d in teile)
    anschlag = np.minimum(1, t / .004)
    return s * anschlag * lautst

def platzieren(gesamt, klang, ab):
    i = int(SR * ab); gesamt[i:i + len(klang)] += klang[:len(gesamt) - i]

def hicaz():
    x = np.zeros(int(SR * 3.4))
    for f, ab, l in [(293.66, 0, .8), (311.13, .32, .7), (369.99, .64, 1.0)]:
        platzieren(x, glocke(f, 2.6, l), ab)
    return hall(x)

def ney():
    d = 2.8; t = np.arange(int(SR * d)) / SR
    f = 392 * (1 + .006 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / .8))
    f = f * np.where(t < .5, 1, 2 ** (2 / 12 - .25 / 12))
    phase = 2 * np.pi * np.cumsum(f) / SR
    ton = np.sin(phase) + .25 * np.sin(2 * phase) + .08 * np.sin(3 * phase)
    hauch = np.convolve(rng.standard_normal(len(t)), np.ones(40) / 40, "same") * .35
    huelle = np.minimum(1, t / .18) * np.exp(-np.maximum(0, t - 1.6) * 3)
    return hall((ton * (1 + .3 * hauch) + hauch * .3) * huelle * .6, 2.8, .35)

def kristall():
    x = np.zeros(int(SR * 2.2))
    for f, ab, l in [(698.46, 0, .7), (1046.5, .14, .6)]:
        t = np.arange(int(SR * 1.8)) / SR
        k = (np.sin(2 * np.pi * f * t) + .15 * np.sin(2 * np.pi * f * 3.01 * t)) * np.exp(-3.4 * t) * np.minimum(1, t / .003)
        platzieren(x, k * l, ab)
    return hall(x, 1.8, .3)

def speichern(name, x):
    x = x / np.abs(x).max() * .8
    rechts = np.concatenate([np.zeros(int(SR * .011)), x])[:len(x)]
    stereo = (np.stack([x, rechts * .96], 1) * 32767).astype(np.int16)
    pfad = os.path.join(ZIEL, name + ".wav")
    with wave.open(pfad, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(stereo.tobytes())
    subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "128000", pfad, pfad[:-4] + ".m4a"], check=True)
    os.remove(pfad)
    print(name, round(len(x) / SR, 1), "s")

for name, fn in [("hicaz", hicaz), ("ney", ney), ("kristall", kristall)]:
    speichern(name, fn())
