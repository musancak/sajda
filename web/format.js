// Format-Wahl: Zeile in den Einstellungen führt zur Auswahl (entwurf/), Fitra = diese App
(function(){const NAME={'../index':'Fitra',d:'Falak'};
 // Format-Knopf bis 4.12.2026 hervorgehoben mit „Neu“
 const NEU=Date.now()<new Date('2026-12-04').getTime(),NEU_T={de:'Neu',en:'New',tr:'Yeni',fr:'Nouveau',es:'Nuevo',ar:'جديد'};
 if(NEU)document.getElementById('formatButton').classList.add('neu');
 const L={de:'Format',en:'Layout',tr:'Görünüm',fr:'Format',es:'Formato',ar:'التصميم'};
 const zeile=document.createElement('div');zeile.className='setting-row';
 const titel=document.createElement('label'),link=document.createElement('a');link.href='entwurf/';
 zeile.append(titel,link);document.getElementById('appearancePanel').querySelector('h1').after(zeile);
 function aktualisieren(){let f='../index';try{f=localStorage.getItem('sajda-format')||f}catch{}
  const sp=document.getElementById('explanationLanguage').value;titel.textContent=L[sp]||L.en;const knopf=document.getElementById('formatButton');knopf.textContent=L[sp]||L.en;if(NEU)knopf.append(Object.assign(document.createElement('span'),{className:'neu-marke',textContent:NEU_T[sp]||NEU_T.en}));link.textContent=(NAME[f]||'Fitra')+' ›'}
 aktualisieren();document.getElementById('explanationLanguage').addEventListener('change',aktualisieren);
 document.getElementById('settingsButton').addEventListener('click',aktualisieren)})();
