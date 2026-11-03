'use strict';
// Gemeinsame Daten für die Entwürfe A/B/C: echte Diyanet-Zeiten, Kaza-Zahlen aus der App (localStorage), Demo-Uhr
const $=id=>document.getElementById(id);
const NAMEN=['Morgengebet','Sonnenaufgang','Mittagsgebet','Nachmittagsgebet','Abendgebet','Nachtgebet'];
const KURZ=['Sabah','Güneş','Öğle','İkindi','Akşam','Yatsı'];
const KAZA_ZEILEN=[['sabah','Morgengebet'],['ogle','Mittagsgebet'],['ikindi','Nachmittagsgebet'],['aksam','Abendgebet'],['yatsi','Nachtgebet'],['vitir','Vitir']];
// Kerahat grob für den Prototyp (vor dem Veröffentlichen mit Diyanet abgleichen): nach Sonnenaufgang 45 min, vor Öğle 10 min, vor Akşam 40 min
const KERAHAT=[[1,0,45],[2,-10,0],[4,-40,0]];
const ICON={check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',play:'<path d="M8 5.8v12.4a.8.8 0 0 0 1.2.7l9.6-6.2a.8.8 0 0 0 0-1.4L9.2 5.1a.8.8 0 0 0-1.2.7z"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',
 drop:'<path d="M12 3.5c3 4 6 7.2 6 10.5a6 6 0 0 1-12 0c0-3.3 3-6.5 6-10.5z"/>',book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',beads:'<circle cx="12" cy="5" r="2"/><circle cx="6.5" cy="9" r="2"/><circle cx="17.5" cy="9" r="2"/><circle cx="7.5" cy="15.5" r="2"/><circle cx="16.5" cy="15.5" r="2"/><path d="M12 17.5v4"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',back:'<path d="M15 5l-7 7 7 7"/>',up:'<path d="M6 15l6-6 6 6"/>',moon:'<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/>'};
const icon=n=>'<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+ICON[n]+'</svg>';

let zustand={};try{zustand=JSON.parse(localStorage.getItem('namaz-tr-v3')||'{}')}catch{}
zustand.kaza={open:{},done:{},days:{},...zustand.kaza};
const speichern=()=>{try{const s=JSON.parse(localStorage.getItem('namaz-tr-v3')||'{}');s.kaza=zustand.kaza;localStorage.setItem('namaz-tr-v3',JSON.stringify(s))}catch{}};
const kazaOffen=()=>KAZA_ZEILEN.reduce((s,[k])=>s+(zustand.kaza.open[k]||0),0);
const kazaErledigt=()=>KAZA_ZEILEN.reduce((s,[k])=>s+(zustand.kaza.done[k]||0),0);
function kazaPlus(k,schritt=1){const z=zustand.kaza,tag=new Date().toLocaleDateString('sv');if(schritt>0&&!(z.open[k]>0))return false;
 z.open[k]=(z.open[k]||0)-schritt;z.done[k]=Math.max(0,(z.done[k]||0)+schritt);z.days[tag]=Math.max(0,(z.days[tag]||0)+schritt);speichern();return true}
const zahl=n=>new Intl.NumberFormat('de-DE').format(n);

// Uhr: echte Zeit oder Demo-Minute vom Regler
let demoMinute=null;
const minuteJetzt=()=>{if(demoMinute!==null)return demoMinute;const d=new Date();return d.getHours()*60+d.getMinutes()+d.getSeconds()/60};
const hm=m=>{m=((Math.round(m)%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};
const dauer=m=>{m=Math.max(0,Math.round(m));const h=Math.floor(m/60);return h?h+':'+String(m%60).padStart(2,'0'):m+' min'};

let TAG=null;
async function zeitenLaden(){const ort=zustand.zeiten?.org==='diyanet'&&zustand.zeiten?.ort&&zustand.zeiten.ort!=='gps'?zustand.zeiten.ort:'stuttgart';
 let daten;try{daten=await (await fetch('../zeiten/diyanet-'+ort+'.json')).json()}catch{daten=await (await fetch('../zeiten/diyanet-stuttgart.json')).json()}
 const heute=new Date().toLocaleDateString('sv'),i=Math.max(0,daten.days.findIndex(d=>d.date===heute)),d=daten.days[i],morgen=daten.days[i+1]||d;
 const min=t=>{const[h,m]=t.split(':');return +h*60+ +m};
 TAG={stadt:daten.city,hijri:d.hijri,T:d.times.map(min),morgenImsak:min(morgen.times[0])};return TAG}

// Lage: in welchem Gebetsfenster sind wir, was kommt als Nächstes, gerade Kerahat?
function lage(m=minuteJetzt()){const T=TAG.T;let fenster=5;for(let i=0;i<6;i++)if(m>=T[i])fenster=i;if(m<T[0])fenster=5;
 const zeiten=[...T.map((t,i)=>[i,t]),[0,TAG.morgenImsak+1440]];const [naechst,um]=zeiten.find(([,t])=>t>m)||[0,T[0]+1440];
 let kerahat=null;for(const[i,von,bis]of KERAHAT){const a=T[i]+von,b=T[i]+bis;if(m>=a&&m<b)kerahat={bis:b,i}}
 const gebet=fenster===1?null:fenster;
 const ende=fenster===5?(m<T[0]?T[0]:TAG.morgenImsak+1440):fenster===0?T[1]:T[fenster+1];
 return{m,fenster,gebet,naechst,um,rest:um-m,kerahat,ende}}

// Himmelsfarben über den Tag (oben, unten), Stützpunkte relativ zu den Gebetszeiten
function farben(m){const T=TAG.T,P=[[T[0]-90,'#0c1726','#1b2c44'],[T[0],'#1d2b4f','#4a4f78'],[T[1]-15,'#5b6fa6','#f0b08a'],[T[1]+60,'#8cc3ea','#f7e6c8'],[T[2],'#74b2e0','#e6f0f2'],[T[3],'#8db9d8','#f2e2bf'],
 [T[4]-45,'#7b8fbf','#f4b98a'],[T[4],'#4b5687','#ee8f6a'],[T[4]+35,'#232c52','#5e4f78'],[T[5]+30,'#0c1726','#1b2c44']];
 const mm=m<P[0][0]?m+1440:m;let a=P[P.length-1],b=[P[0][0]+1440,P[0][1],P[0][2]];
 for(let i=0;i<P.length-1;i++)if(mm>=P[i][0]&&mm<P[i+1][0]){a=P[i];b=P[i+1]}
 const f=Math.min(1,Math.max(0,(mm-a[0])/((b[0]-a[0])||1))),mix=(x,y)=>{const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=p(x),B=p(y);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*f)).join(',')+')'};
 return[mix(a[1],b[1]),mix(a[2],b[2])]}

// Rollende Zahl: nur geänderte Zeichen rollen herein
function rollen(el,text){const alt=el.dataset.text||'';if(alt===text)return;el.dataset.text=text;el.classList.add('roll');
 const teile=[...text].map((c,i)=>{const s=document.createElement('span');s.textContent=c;if(c!==alt[i]&&alt)s.className='neu';return s});el.replaceChildren(...teile)}

// Haptik auf dem iPhone: ein verstecktes Schalter-Element antippen (Safari 18)
const haptikFeld=Object.assign(document.createElement('label'),{className:'haptik',innerHTML:'<input type="checkbox" switch>'});document.body.append(haptikFeld);
const haptik=()=>{try{haptikFeld.click()}catch{}};

// Hinweis mit Rückgängig
let toastUhr=0;function toast(text,rueck){let el=$('toast');if(!el){el=Object.assign(document.createElement('div'),{id:'toast',className:'toast'});el.innerHTML='<span></span><button>Rückgängig</button>';document.body.append(el)}
 el.firstChild.textContent=text;el.lastChild.onclick=()=>{rueck();el.classList.remove('an')};el.classList.add('an');clearTimeout(toastUhr);toastUhr=setTimeout(()=>el.classList.remove('an'),4500)}

// Kaza-Liste (in Blatt oder Karte)
function kazaListe(box,neuZeichnen){box.className='kz';box.replaceChildren(...KAZA_ZEILEN.map(([k,name])=>{const z=document.createElement('div');z.className='kz-zeile';
 z.innerHTML='<b></b><span class="num"></span><button class="press" aria-label="Ein Gebet nachgeholt">'+icon('check')+'</button>';z.querySelector('b').textContent=name;z.querySelector('.num').textContent=zahl(zustand.kaza.open[k]||0);
 z.querySelector('button').onclick=()=>{if(!kazaPlus(k))return;haptik();z.querySelector('.num').textContent=zahl(zustand.kaza.open[k]);z.classList.remove('pop');void z.offsetWidth;z.classList.add('pop');neuZeichnen?.();
  toast(name+' nachgeholt',()=>{kazaPlus(k,-1);z.querySelector('.num').textContent=zahl(zustand.kaza.open[k]);neuZeichnen?.()})};return z}))}

// Blatt von unten mit Ziehen zum Schließen
function blatt(el){const schleier=Object.assign(document.createElement('div'),{className:'schleier'});el.before(schleier);
 const zu=()=>{el.classList.remove('offen');schleier.classList.remove('offen');el.style.removeProperty('--zug')};schleier.onclick=zu;
 let start=null;el.addEventListener('pointerdown',e=>{if(e.target.closest('button,input'))return;start=e.clientY;el.classList.add('zieht');el.setPointerCapture(e.pointerId)});
 el.addEventListener('pointermove',e=>{if(start===null)return;el.style.setProperty('--zug',Math.max(0,e.clientY-start)+'px')});
 el.addEventListener('pointerup',e=>{if(start===null)return;const d=e.clientY-start;start=null;el.classList.remove('zieht');if(d>90)zu();else el.style.setProperty('--zug','0px')});
 return{auf:()=>{schleier.classList.add('offen');el.classList.add('offen');haptik()},zu}}

// Formate: Name, Datei, kurze Beschreibung (Fitra = die heutige App, bleibt unverändert)
const FORMATE=[['../index','Fitra','Das Original. Klar, ruhig, alles an seinem Platz.'],['a','Ufuk','Der Horizont. Der Himmel folgt deinem Tag.'],['b','Lawh','Die Tafeln. Jede Karte öffnet sich zur ganzen Seite.'],['c','Waqt','Der Moment. Nur das, was jetzt dran ist.'],['d','Falak','Die Umlaufbahn. Die Gebete wie Perlen auf ihrer Bahn.']];
// Umschalter + Zeit-Regler
function umschalter(aktiv,neuZeichnen){const w=document.createElement('nav');w.className='wahl';
 w.innerHTML='<a href="index.html" class="an">'+(FORMATE.find(f=>f[0]===aktiv)||['','Format'])[1]+' ⌄</a>'+'<button aria-label="Uhrzeit vorspulen">'+icon('clock').replace('class="i"','class="i" style="width:16px;height:16px;vertical-align:-3px"')+'</button>';
 const r=document.createElement('div');r.className='regler';r.innerHTML='<span class="num" id="reglerZeit"></span><input type="range" min="0" max="1439" step="1"><button>Jetzt</button>';
 document.body.append(w,r);const ein=r.querySelector('input');ein.value=Math.round(minuteJetzt());$('reglerZeit').textContent=hm(ein.value);
 w.querySelector('button').onclick=()=>r.classList.toggle('offen');
 ein.oninput=()=>{demoMinute=+ein.value;$('reglerZeit').textContent=hm(demoMinute);neuZeichnen()};
 r.querySelector('button').onclick=()=>{demoMinute=null;ein.value=Math.round(minuteJetzt());$('reglerZeit').textContent=hm(ein.value);neuZeichnen()}}

// Seitenwechsel A/B/C mit weichem Überblenden (View Transitions über Seiten, Safari 18.2+)
const vtStil=document.createElement('style');vtStil.textContent='@view-transition{navigation:auto}';document.head.append(vtStil);
