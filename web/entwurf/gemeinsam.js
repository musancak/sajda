'use strict';
// Falak: Gemeinsam-Blatt mit Globus (Gebets-Welle aus dem Sonnenstand) und gemeinsamem Kaza-Balken.
// Gleiche Server-Funktionen und gleicher Speicher (namaz-tr-v3 → gemeinsam) wie ../gemeinsam.js in Fitra. Lädt nach basis.js und ../globus-land.js.
const GM_API='https://tdattimvlqyljahijyoo.supabase.co/rest/v1/rpc/',GM_KEY='sb_publishable_GhyClAXoPp0t752Fvk1kUw_VxGZ0tuX';
const GM_NAME=['Sabah','Kuşluk','Öğle','İkindi','Akşam','Yatsı'];
const GM_FARBE=['#c7849a','#b7c3a5','#d6a33f','#c46f38','#9c3f36','#2e4a6e'];
const GM_ZIELE=[1e3,5e3,1e4,25e3,5e4,1e5,25e4,5e5,1e6,25e5,5e6,1e7];
const gmRuhig=matchMedia('(prefers-reduced-motion: reduce)');

// Speicher teilen mit Fitra
function gmLesen(){try{return JSON.parse(localStorage.getItem('namaz-tr-v3')||'{}')}catch{return{}}}
let gm={mit:false,stand:null,warte:[],...gmLesen().gemeinsam};
function gmSpeichern(){try{const s=gmLesen();s.gemeinsam=gm;localStorage.setItem('namaz-tr-v3',JSON.stringify(s))}catch{}}
let GM_STAEDTE=[];fetch('../zeiten/staedte.json').then(r=>r.json()).then(l=>{GM_STAEDTE=l;gmZeitStand=0}).catch(()=>{});
function gmOrt(){const z=gmLesen().zeiten||{};if(z.ort==='gps'&&z.lat!=null)return{lat:z.lat,lon:z.lon};
 const s=GM_STAEDTE.find(s=>s.slug===z.ort)||{lat:48.776,lon:9.183};return{lat:s.lat,lon:s.lon}}

// Server
async function gmRufen(fn,body){const r=await fetch(GM_API+fn,{method:'POST',headers:{apikey:GM_KEY,'Content-Type':'application/json'},body:JSON.stringify(body||{})});
 if(!r.ok)throw new Error(r.status);const t=await r.text();return t?JSON.parse(t):null}
let gmLaedt=null,gmFehler=false;
function gmLaden(){if(gmLaedt)return gmLaedt;
 gmLaedt=gmRufen('sajda_stand').then(s=>{gm.stand={...s,zeit:Date.now()};gmFehler=false;gmSpeichern()}).catch(()=>{gmFehler=true}).finally(()=>{gmLaedt=null;gmText();kacheln()});return gmLaedt}
let gmSendet=false;
async function gmSenden(){if(gmSendet||!gm.warte.length||!navigator.onLine)return;gmSendet=true;
 try{while(gm.warte.length){await gmRufen('sajda_melden',gm.warte[0]);gm.warte.shift();gmSpeichern()}gmLaden()}catch{}finally{gmSendet=false}}
function gmMelden(art,anzahl=1){if(!gm.mit)return;const o=gmOrt();gm.warte.push({p_art:art,p_anzahl:anzahl,p_lat:Math.round(o.lat),p_lon:Math.round(o.lon)});
 if(gm.warte.length>20)gm.warte.splice(0,gm.warte.length-20);gmSpeichern();gmSenden()}
addEventListener('online',gmSenden);
window.gmGebet=()=>gmMelden('gebet');
{const vorher=kazaPlus;kazaPlus=function(k,schritt=1){const ok=vorher(k,schritt);if(ok)gmMelden('kaza',schritt);return ok}}

// Sonnenstand → welche Gebetszeit an einem Punkt gerade ist (0 Sabah … 5 Yatsı)
const gmRad=Math.PI/180;
function gmSonne(t){const D=t/864e5+2440587.5-2451545,fix=(a,b)=>((a%b)+b)%b;
 const g=fix(357.529+.98560028*D,360)*gmRad,q=fix(280.459+.98564736*D,360),L=fix(q+1.915*Math.sin(g)+.02*Math.sin(2*g),360)*gmRad,e=(23.439-.00000036*D)*gmRad;
 const RA=fix(Math.atan2(Math.cos(e)*Math.sin(L),Math.cos(L))/gmRad/15,24),eqt=q/15-RA;
 const utc=(t%864e5)/36e5;return{decl:Math.asin(Math.sin(e)*Math.sin(L)),lon:-15*(utc-12+((eqt+12)%24+24)%24-12)*gmRad}}
function gmZeit(sinLat,cosLat,lat,lon,s){const H=lon-s.lon,h=Math.asin(sinLat*Math.sin(s.decl)+cosLat*Math.cos(s.decl)*Math.cos(H))/gmRad;
 if(Math.sin(H)<0)return h<=-18?5:h<=-.833?0:1;
 const asr=Math.atan(1/(1+Math.tan(Math.abs(lat-s.decl))))/gmRad;return h>asr?2:h>-.833?3:h>-17?4:5}
const GM_P=(()=>{const lat=[],lon=[];for(const [b,n,...l] of GLOBUS_LAND)for(let k=0;k<l.length;k+=2)for(let i=l[k];i<=l[k+1];i++){lat.push(b*gmRad);lon.push((-180+(i+.5)*360/n)*gmRad)}
 const N=lat.length,P={N,lat:Float32Array.from(lat),lon:Float32Array.from(lon),sinLat:new Float32Array(N),cosLat:new Float32Array(N),sinLon:new Float32Array(N),cosLon:new Float32Array(N),zeit:new Uint8Array(N)};
 for(let i=0;i<N;i++){P.sinLat[i]=Math.sin(lat[i]);P.cosLat[i]=Math.cos(lat[i]);P.sinLon[i]=Math.sin(lon[i]);P.cosLon[i]=Math.cos(lon[i])}return P})();
let gmZeitStand=0,gmHier=2;
function gmZeitenRechnen(){const now=Date.now();if(now-gmZeitStand<20e3)return;gmZeitStand=now;const s=gmSonne(now),P=GM_P;
 for(let i=0;i<P.N;i++)P.zeit[i]=gmZeit(P.sinLat[i],P.cosLat[i],P.lat[i],P.lon[i],s);
 const o=gmOrt();gmHier=gmZeit(Math.sin(o.lat*gmRad),Math.cos(o.lat*gmRad),o.lat*gmRad,o.lon*gmRad,s)}

// Blatt
const gmBlattEl=document.createElement('div');gmBlattEl.className='blatt gm-blatt';gmBlattEl.id='gmBlatt';
gmBlattEl.innerHTML='<div class="griff"></div><div class="gm-kopf"><h2>Gemeinsam</h2><span class="mono gm-live" id="gmLive" hidden>LIVE</span></div>'+
 '<p class="hinweis" id="gmHier"></p><canvas id="gmCanvas" role="img" aria-label="Globus: wo auf der Welt gerade welches Gebet ist" title="Zum Drehen ziehen"></canvas>'+
 '<div class="gm-legende" id="gmLegende"></div>'+
 '<div class="gm-balken"><div class="gm-zeile"><span class="mono">GEMEINSAM NACHGEHOLT</span><span class="mono" id="gmZiel"></span></div><b class="num" id="gmKaza">–</b>'+
 '<div class="gm-bahn"><i id="gmFuell"></i></div><p class="hinweis" id="gmHeute"></p></div>'+
 '<label class="gm-mit"><input type="checkbox" id="gmMit"><span><b>Anonym mitzählen</b><small>Nach jedem Gebet nur +1 und deine Gegend, auf etwa 100 km gerundet. Kein Name, kein Konto.</small></span></label>';
document.body.append(gmBlattEl);
const gmBlatt=blatt(gmBlattEl);
$('gmMit').onchange=e=>{gm.mit=e.target.checked;if(!gm.mit)gm.warte=[];gmSpeichern();haptik()};
const gmOffen=()=>gmBlattEl.classList.contains('offen');

function gmText(){if(!gmOffen())return;const s=gm.stand;gmZeitenRechnen();
 $('gmHier').textContent='Bei dir gerade: '+GM_NAME[gmHier];
 $('gmLegende').replaceChildren(...[0,2,3,4,5].map(i=>{const el=document.createElement('span');el.className='gm-chip'+(i===gmHier?' hier':'');el.style.setProperty('--c',GM_FARBE[i]);el.textContent=GM_NAME[i];return el}));
 $('gmMit').checked=gm.mit;$('gmLive').hidden=!(s&&s.punkte?.some(p=>p.min<60));
 if(!s){$('gmKaza').textContent='–';$('gmZiel').textContent='';$('gmFuell').style.width='0';$('gmHeute').textContent=gmFehler?'Die gemeinsamen Zahlen sind gerade nicht erreichbar.':'';return}
 const k=s.kaza||0,ziel=GM_ZIELE.find(z=>z>k)||k,vorher=GM_ZIELE[GM_ZIELE.indexOf(ziel)-1]||0;
 rollen($('gmKaza'),zahl(k));$('gmZiel').textContent='ZIEL '+zahl(ziel);$('gmFuell').style.width=Math.min(100,(k-vorher)/(ziel-vorher)*100)+'%';
 const teile=[zahl(s.heute||0)+' Gebete in den letzten 24 Stunden'];if(s.punkte?.length)teile.push('aus '+zahl(s.punkte.length)+' Gegenden');if(s.kazaWoche>0)teile.push('+'+zahl(s.kazaWoche)+' Kaza diese Woche');
 $('gmHeute').textContent=teile.join(' · ')+(gmFehler?' · gerade nicht erreichbar':'')}

// Globus: orthografische Projektion, sehr langsames Drehen, Ziehen zum Drehen
const gmG={l0:0,b0:.5,R:0,dpr:1,ziehen:null,ruhe:0,lauf:0,letzt:0};
function gmGroesse(){const c=$('gmCanvas'),s=Math.min(gmBlattEl.clientWidth-40,innerHeight*.36,320);gmG.dpr=Math.min(2,devicePixelRatio||1);
 c.style.width=c.style.height=s+'px';c.width=c.height=Math.round(s*gmG.dpr);gmG.R=c.width/2-4*gmG.dpr}
function gmMalen(){const c=$('gmCanvas'),x=c.getContext('2d'),w=c.width,{R,l0,b0}=gmG,cx=w/2,cy=w/2,P=GM_P;if(!R)return;
 const nacht=document.body.classList.contains('nacht');x.clearRect(0,0,w,w);
 const g=x.createRadialGradient(cx-R*.35,cy-R*.4,R*.1,cx,cy,R);g.addColorStop(0,nacht?'#3a3a3e':'#fbf8f0');g.addColorStop(1,nacht?'#202023':'#e4e6d8');
 x.fillStyle=g;x.beginPath();x.arc(cx,cy,R,0,7);x.fill();x.strokeStyle=nacht?'rgb(255 255 255/12%)':'rgb(32 61 52/12%)';x.lineWidth=gmG.dpr;x.stroke();
 const sb=Math.sin(b0),cb=Math.cos(b0),sl=Math.sin(l0),cl=Math.cos(l0),r=Math.max(1.1,R*.0125);
 for(let f=0;f<6;f++){x.fillStyle=GM_FARBE[f];
  for(let i=0;i<P.N;i++){if(P.zeit[i]!==f)continue;const cd=P.cosLon[i]*cl+P.sinLon[i]*sl,cosc=sb*P.sinLat[i]+cb*P.cosLat[i]*cd;if(cosc<=0)continue;
   const X=P.cosLat[i]*(P.sinLon[i]*cl-P.cosLon[i]*sl),Y=cb*P.sinLat[i]-sb*P.cosLat[i]*cd;x.globalAlpha=.35+.65*cosc;x.fillRect(cx+R*X-r,cy-R*Y-r,2*r,2*r)}}
 x.globalAlpha=1;
 const punkt=(lat,lon)=>{const la=lat*gmRad,lo=lon*gmRad-l0,cosc=sb*Math.sin(la)+cb*Math.cos(la)*Math.cos(lo);
  return cosc>0?[cx+R*Math.cos(la)*Math.sin(lo),cy-R*(cb*Math.sin(la)-sb*Math.cos(la)*Math.cos(lo)),cosc]:null};
 const puls=(Date.now()%4800)/4800;
 for(const p of gm.stand?.punkte||[]){const q=punkt(p.lat,p.lon);if(!q)continue;const frisch=p.min<60,gr=R*(.018+.008*Math.min(5,Math.log2(1+p.n)));
  x.fillStyle=frisch?'#fff6dc':'rgb(255 250 235/75%)';x.strokeStyle=frisch?'#a26a14':'rgb(162 106 20/45%)';x.lineWidth=1.5*gmG.dpr;x.globalAlpha=.4+.6*q[2];
  x.beginPath();x.arc(q[0],q[1],gr,0,7);x.fill();x.stroke();
  if(frisch&&!gmRuhig.matches){x.strokeStyle='rgb(214 163 63/'+(1-puls)*.9+')';x.beginPath();x.arc(q[0],q[1],gr*(1+puls*2.2),0,7);x.stroke()}}
 x.globalAlpha=1;
 const o=gmOrt(),q=punkt(o.lat,o.lon);if(q){x.strokeStyle=nacht?'#f5f5f7':'#183c33';x.fillStyle=nacht?'#202023':'#fffdf8';x.lineWidth=2*gmG.dpr;x.beginPath();x.arc(q[0],q[1],R*.03,0,7);x.fill();x.stroke();
  x.fillStyle=x.strokeStyle;x.beginPath();x.arc(q[0],q[1],R*.012,0,7);x.fill()}}
function gmSchritt(t){if(!gmOffen()){gmG.lauf=0;return}const dt=Math.min(100,t-(gmG.letzt||t));gmG.letzt=t;
 if(!gmG.ziehen&&!gmRuhig.matches&&t>gmG.ruhe)gmG.l0+=dt*.00003;gmZeitenRechnen();gmMalen();gmG.lauf=requestAnimationFrame(gmSchritt)}
{const c=$('gmCanvas');c.style.touchAction='none';
 c.onpointerdown=e=>{e.stopPropagation();c.setPointerCapture(e.pointerId);gmG.ziehen={x:e.clientX,y:e.clientY,l0:gmG.l0,b0:gmG.b0}};
 c.onpointermove=e=>{const z=gmG.ziehen;if(!z)return;const k=gmG.dpr/gmG.R;gmG.l0=z.l0-(e.clientX-z.x)*k;gmG.b0=Math.max(-1.1,Math.min(1.1,z.b0+(e.clientY-z.y)*k));if(gmRuhig.matches)gmMalen()};
 c.onpointerup=c.onpointercancel=()=>{gmG.ziehen=null;gmG.ruhe=performance.now()+4000}}
function gmAuf(){const o=gmOrt();gmG.l0=o.lon*gmRad;gmG.b0=Math.max(-1.1,Math.min(1.1,o.lat*gmRad*.8));gmBlatt.auf();gmZeitStand=0;gmText();
 requestAnimationFrame(()=>{gmGroesse();gmMalen();if(!gmG.lauf){gmG.letzt=0;gmG.lauf=requestAnimationFrame(gmSchritt)}});gmLaden();gmSenden()}
setInterval(()=>{if(gmOffen()&&!document.hidden)gmLaden()},60e3);
addEventListener('resize',()=>{if(gmOffen()){gmGroesse();gmMalen()}});
const gmKachelText=()=>gm.stand?.heute?zahl(gm.stand.heute)+' HEUTE':'GEMEINSAM';
gmSenden();if(!gm.stand||Date.now()-gm.stand.zeit>10*60e3)gmLaden();
