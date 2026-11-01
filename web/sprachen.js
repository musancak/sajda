'use strict';
// Französisch, Spanisch und Arabisch einhängen (Daten in sprache-fr/es/ar.js).
// Muss vor app.js geladen werden: app.js setzt eine unbekannte Sprache sonst auf Deutsch zurück.
const ERKLAERUNGEN={de:EXPLANATIONS_DE,en:EXPLANATIONS_EN};
for(const [code,daten] of [['fr',SPRACHE_FR],['es',SPRACHE_ES],['ar',SPRACHE_AR]]){
 UI[code]={...UI.en,...daten.UI};
 // Titel wie „Subhanaka“ sind sprachunabhängig – alles Übrige kommt aus der Übersetzung
 const ex=Object.fromEntries(Object.entries(EXPLANATIONS_DE).map(([k,v])=>[k,{title:v.title,note:''}]));
 for(const [k,v] of Object.entries(daten.EX))ex[k]={note:'',...v};
 for(const id of Object.keys(INTENTIONS)){const key=ROUTES[id].seq[0].key;ex[key]={title:daten.INTENT.title,lines:[daten.INTENT[id]],note:daten.INTENT.hint}}
 ERKLAERUNGEN[code]=ex;
 ROUTE_NAMES[code]=daten.RN;PRAYER_LABELS[code]=daten.PL;PREPARATION_TEXT[code]=daten.PT;
}
const ZEITGRENZEN={de:['İmsak','Sonnenaufgang','Mittag','Nachmittag','Abend','Nacht'],en:['İmsak','sunrise','noon','afternoon','evening','night'],tr:['İmsak','Güneş','Öğle','İkindi','Akşam','Yatsı'],
 fr:SPRACHE_FR.TB,es:SPRACHE_ES.TB,ar:SPRACHE_AR.TB};
function timeBoundary(i){return(ZEITGRENZEN[state.explanationLanguage]||ZEITGRENZEN.de)[i]}
const SPRACH_REGION={de:'de-DE',en:'en-GB',tr:'tr-TR',fr:'fr-FR',es:'es-ES',ar:'ar-u-nu-latn'};
