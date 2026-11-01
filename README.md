# Sajda – Gebetsbegleiter

**[musancak.github.io/sajda](https://musancak.github.io/sajda/)**

Eine Web-App, die Schritt für Schritt durch das Gebet führt – ruhig, gut lesbar und auch ohne Internet.

## Funktionen

- **Geführtes Gebet** für alle Gebete und Varianten (Farz, Sünnet, Vitir), mit Absicht, Rezitationen in Umschrift und Erklärungen zu jeder Haltung
- **Gebetszeiten** nach DITIB/Diyanet für 43 deutsche Städte und alle 81 Provinzen der Türkei (jeweils in Ortszeit) oder berechnet nach Muslim World League, Umm al-Qura und der ägyptischen Behörde – für eine Stadt oder den eigenen Standort
- **Sechs Sprachen:** Deutsch, Türkisch, Englisch, Französisch, Spanisch, Arabisch (von rechts nach links)
- **Lesetempo:** Markierung im eigenen Tempo, auf Wunsch per Aufnahme eingelernt
- **Fokus-Modus** beim Beten und **Kurzanleitung** beim ersten Öffnen
- **Offline** dank Service Worker; lässt sich wie eine App auf den Home-Bildschirm legen

## Technik

- Reines HTML, CSS und JavaScript, keine Abhängigkeiten
- `berechnung.js` berechnet Gebetszeiten astronomisch (Sonnenstand, Dämmerungswinkel, Regel für hohe Breiten)
- `diyanet.py` holt die offiziellen Diyanet-Tabellen; eine GitHub Action erneuert sie monatlich
- `offline.py` erzeugt Icons, Manifest und den Service Worker

## Quellen

Die Abläufe folgen der hanafitischen Darstellung von [İslam ve İhsan](https://www.islamveihsan.com/); Gebetszeiten von [Diyanet](https://namazvakitleri.diyanet.gov.tr/).
