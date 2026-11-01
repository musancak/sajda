'use strict';
// Fokus beim Beten: nur Fortschritt, Text und Zurück/Weiter. Tempo, Mikrofon und Quelle hinter „Mehr“.
Object.assign(UI.de,{more:'Mehr',less:'Weniger',exitReading:'Zur Startseite'});
Object.assign(UI.en,{more:'More',less:'Less',exitReading:'Back to start'});
Object.assign(UI.tr,{more:'Daha fazla',less:'Daha az',exitReading:'Ana sayfaya'});

const fokusLeiste=(()=>{const leiste=document.createElement('div');leiste.className='fokus-leiste';
 const raus=Object.assign(document.createElement('button'),{className:'fokus-raus',textContent:'‹'});raus.onclick=()=>home();
 const mehr=Object.assign(document.createElement('button'),{className:'fokus-mehr'});
 mehr.onclick=()=>{document.body.classList.toggle('fokus-mehr-offen');beschriften();neuLayouten()};
 const stand=document.createElement('span');stand.className='fokus-stand';
 leiste.append(raus,stand,mehr);$('reader').prepend(leiste);
 function beschriften(){raus.setAttribute('aria-label',t('exitReading'));mehr.textContent=document.body.classList.contains('fokus-mehr-offen')?t('less'):t('more')}
 return{stand,beschriften}})();

// Die App verteilt lange Texte auf Seiten nach der freien Höhe – nach Umschalten neu berechnen
function neuLayouten(){requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')))}

const vorherShow=show;
show=function(id){vorherShow(id);const an=id==='reader';
 if(an!==document.body.classList.contains('fokus')){document.body.classList.toggle('fokus',an);document.body.classList.remove('fokus-mehr-offen');neuLayouten()}
 fokusLeiste.beschriften()};

// Schritt-Anzeige in die schmale Leiste spiegeln
new MutationObserver(()=>{fokusLeiste.stand.textContent=$('position').textContent}).observe($('position'),{childList:true,characterData:true,subtree:true});
