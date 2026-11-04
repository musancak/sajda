// Format-Wahl: Zeile in den Einstellungen führt zur Auswahl (entwurf/), Fitra = diese App
(function(){const NAME={'../index':'Fitra',d:'Falak'};
 const L={de:'Format',en:'Layout',tr:'Görünüm',fr:'Format',es:'Formato',ar:'التصميم'};
 const zeile=document.createElement('div');zeile.className='setting-row';
 const titel=document.createElement('label'),link=document.createElement('a');link.href='entwurf/';
 zeile.append(titel,link);document.getElementById('appearancePanel').querySelector('h1').after(zeile);
 function aktualisieren(){let f='../index';try{f=localStorage.getItem('sajda-format')||f}catch{}
  const sp=document.getElementById('explanationLanguage').value;titel.textContent=L[sp]||L.en;link.textContent=(NAME[f]||'Fitra')+' ›'}
 aktualisieren();document.getElementById('explanationLanguage').addEventListener('change',aktualisieren);
 document.getElementById('settingsButton').addEventListener('click',aktualisieren)})();
