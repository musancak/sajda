'use strict';
// Gemeinsam: Globus mit der Gebets-Welle (offline aus dem Sonnenstand berechnet) und gemeinsamer Kaza-Balken.
// Mitzählen ist freiwillig und anonym: nach einem Gebet nur +1 und die Gegend auf ganze Grad gerundet (Supabase, werkzeuge/gemeinsam.sql).
const GM_API='https://tdattimvlqyljahijyoo.supabase.co/rest/v1/rpc/',GM_KEY='sb_publishable_GhyClAXoPp0t752Fvk1kUw_VxGZ0tuX';
const GM_TEXT={
 de:{title:'Gemeinsam',atYou:'Bei dir gerade: {p}',today:'{n} Gebete in den letzten 24 Stunden',places:'aus {n} Gegenden',kaza:'Gemeinsam nachgeholt',goal:'Ziel {n}',week:'+{n} diese Woche',
  join:'Anonym mitzählen',joinHint:'Nach jedem Gebet nur +1 und deine Gegend, auf etwa 100 km gerundet. Kein Name, kein Konto.',offline:'Die gemeinsamen Zahlen sind gerade nicht erreichbar.',live:'live',drag:'Zum Drehen ziehen',
  tile:'Gemeinsam',tileSub:'{n} heute',globe:'Globus: wo auf der Welt gerade welches Gebet ist',p:['Fajr','Vormittag','Dhuhr','Asr','Maghrib','Isha']},
 en:{title:'Together',atYou:'Now at your place: {p}',today:'{n} prayers in the last 24 hours',places:'from {n} regions',kaza:'Made up together',goal:'Goal {n}',week:'+{n} this week',
  join:'Count me in anonymously',joinHint:'After each prayer only +1 and your region, rounded to about 100 km. No name, no account.',offline:'The shared numbers cannot be reached right now.',live:'live',drag:'Drag to turn',
  tile:'Together',tileSub:'{n} today',globe:'Globe: which prayer is due where in the world right now',p:['Fajr','Morning','Dhuhr','Asr','Maghrib','Isha']},
 tr:{title:'Birlikte',atYou:'Şu an sende: {p}',today:'Son 24 saatte {n} namaz',places:'{n} bölgeden',kaza:'Birlikte kaza edildi',goal:'Hedef {n}',week:'bu hafta +{n}',
  join:'Anonim olarak sayılsın',joinHint:'Her namazdan sonra sadece +1 ve bölgen, yaklaşık 100 km yuvarlanmış. İsim yok, hesap yok.',offline:'Ortak sayılara şu an ulaşılamıyor.',live:'canlı',drag:'Çevirmek için sürükle',
  tile:'Birlikte',tileSub:'bugün {n}',globe:'Küre: dünyada şu an nerede hangi vakit var',p:['Sabah','Kuşluk','Öğle','İkindi','Akşam','Yatsı']},
 fr:{title:'Ensemble',atYou:'Chez toi maintenant : {p}',today:'{n} prières ces dernières 24 heures',places:'depuis {n} régions',kaza:'Rattrapées ensemble',goal:'Objectif {n}',week:'+{n} cette semaine',
  join:'Compter anonymement',joinHint:'Après chaque prière, seulement +1 et ta région, arrondie à environ 100 km. Pas de nom, pas de compte.',offline:'Les chiffres communs ne sont pas joignables pour le moment.',live:'en direct',drag:'Glisser pour tourner',
  tile:'Ensemble',tileSub:'{n} aujourd’hui',globe:'Globe : quelle prière a lieu où dans le monde en ce moment',p:['Fajr','Matinée','Dhuhr','Asr','Maghrib','Isha']},
 es:{title:'Juntos',atYou:'Ahora donde estás: {p}',today:'{n} oraciones en las últimas 24 horas',places:'desde {n} regiones',kaza:'Recuperadas juntos',goal:'Meta {n}',week:'+{n} esta semana',
  join:'Contar de forma anónima',joinHint:'Tras cada oración solo +1 y tu región, redondeada a unos 100 km. Sin nombre, sin cuenta.',offline:'Ahora no se pueden cargar las cifras comunes.',live:'en vivo',drag:'Arrastra para girar',
  tile:'Juntos',tileSub:'{n} hoy',globe:'Globo: qué oración toca dónde en el mundo ahora',p:['Fajr','Mañana','Dhuhr','Asr','Maghrib','Isha']},
 ar:{title:'معًا',atYou:'عندك الآن: {p}',today:'{n} صلاة في آخر 24 ساعة',places:'من {n} منطقة',kaza:'قضاء معًا',goal:'الهدف {n}',week:'+{n} هذا الأسبوع',
  join:'احسبني دون اسم',joinHint:'بعد كل صلاة فقط +1 ومنطقتك مقرّبة إلى نحو 100 كم. بلا اسم وبلا حساب.',offline:'تعذّر الوصول إلى الأرقام المشتركة الآن.',live:'مباشر',drag:'اسحب للتدوير',
  tile:'معًا',tileSub:'{n} اليوم',globe:'الكرة الأرضية: أي صلاة حان وقتها وأين الآن',p:['الفجر','الضحى','الظهر','العصر','المغرب','العشاء']}
};
// Farben je Zeit: Fajr, Vormittag (keine Pflichtzeit), Dhuhr, Asr, Maghrib, Isha
const GM_FARBE=['#c7849a','#b7c3a5','#d6a33f','#c46f38','#9c3f36','#2e4a6e'];
const GM_ZIELE=[1e3,5e3,1e4,25e3,5e4,1e5,25e4,5e5,1e6,25e5,5e6,1e7];
state.gemeinsam={mit:false,stand:null,warte:[],...state.gemeinsam};
const gt=key=>(GM_TEXT[state.explanationLanguage]||GM_TEXT.de)[key];
const gmFill=(s,v)=>s.replace(/\{(\w)\}/g,(_,k)=>v[k]);
const gmNum=n=>new Intl.NumberFormat(SPRACH_REGION[state.explanationLanguage]||'de-DE').format(n);

// Ort: GPS oder gewählte Stadt, für den Globus und (gerundet) fürs Mitzählen
function gmOrt(){const z=state.zeiten||{};if(z.ort==='gps'&&z.lat!=null)return{lat:z.lat,lon:z.lon};
 const s=(typeof STAEDTE!=='undefined'&&STAEDTE.find(s=>s.slug===z.ort))||{lat:48.776,lon:9.183};return{lat:s.lat,lon:s.lon}}

// Server
async function gmRufen(fn,body){const r=await fetch(GM_API+fn,{method:'POST',headers:{apikey:GM_KEY,'Content-Type':'application/json'},body:JSON.stringify(body||{})});
 if(!r.ok)throw new Error(r.status);const text=await r.text();return text?JSON.parse(text):null}
let gmLaedt=null,gmFehler=false;
function gmLaden(){if(gmLaedt)return gmLaedt;
 gmLaedt=gmRufen('sajda_stand').then(s=>{state.gemeinsam.stand={...s,zeit:Date.now()};gmFehler=false;save()}).catch(()=>{gmFehler=true}).finally(()=>{gmLaedt=null;gmZeichnen()});return gmLaedt}
function gmMelden(art,anzahl=1){if(!state.gemeinsam.mit)return;const o=gmOrt(),w=state.gemeinsam.warte;
 w.push({p_art:art,p_anzahl:anzahl,p_lat:Math.round(o.lat),p_lon:Math.round(o.lon)});if(w.length>20)w.splice(0,w.length-20);save();gmSenden()}
let gmSendet=false;
async function gmSenden(){if(gmSendet||!state.gemeinsam.warte.length||!navigator.onLine)return;gmSendet=true;
 try{while(state.gemeinsam.warte.length){await gmRufen('sajda_melden',state.gemeinsam.warte[0]);state.gemeinsam.warte.shift();save()}gmLaden()}catch{}finally{gmSendet=false}}
addEventListener('online',gmSenden);

// Sonnenstand → welche Gebetszeit an einem Punkt gerade ist (0 Fajr … 5 Isha)
const gmRad=Math.PI/180;
function gmSonne(t){const D=t/864e5+2440587.5-2451545,fix=(a,b)=>((a%b)+b)%b;
 const g=fix(357.529+.98560028*D,360)*gmRad,q=fix(280.459+.98564736*D,360),L=fix(q+1.915*Math.sin(g)+.02*Math.sin(2*g),360)*gmRad,e=(23.439-.00000036*D)*gmRad;
 const RA=fix(Math.atan2(Math.cos(e)*Math.sin(L),Math.cos(L))/gmRad/15,24),eqt=q/15-RA;
 const utc=(t%864e5)/36e5;return{decl:Math.asin(Math.sin(e)*Math.sin(L)),lon:-15*(utc-12+((eqt+12)%24+24)%24-12)*gmRad}}
function gmZeit(sinLat,cosLat,lat,lon,s){const H=lon-s.lon,sh=sinLat*Math.sin(s.decl)+cosLat*Math.cos(s.decl)*Math.cos(H),h=Math.asin(sh)/gmRad;
 const morgens=Math.sin(H)<0;
 if(morgens)return h<=-18?5:h<=-.833?0:1;
 const asr=Math.atan(1/(1+Math.tan(Math.abs(lat-s.decl))))/gmRad;
 return h>asr?2:h>-.833?3:h>-17?4:5}

// Landpunkte vorbereiten
const GM_P=(()=>{const lat=[],lon=[];for(const [b,n,...l] of GLOBUS_LAND)for(let k=0;k<l.length;k+=2)for(let i=l[k];i<=l[k+1];i++){lat.push(b*gmRad);lon.push((-180+(i+.5)*360/n)*gmRad)}
 const N=lat.length,P={N,lat:Float32Array.from(lat),sinLat:new Float32Array(N),cosLat:new Float32Array(N),sinLon:new Float32Array(N),cosLon:new Float32Array(N),zeit:new Uint8Array(N)};
 for(let i=0;i<N;i++){P.sinLat[i]=Math.sin(lat[i]);P.cosLat[i]=Math.cos(lat[i]);P.sinLon[i]=Math.sin(lon[i]);P.cosLon[i]=Math.cos(lon[i])}P.lon=Float32Array.from(lon);return P})();
let gmZeitStand=0,gmHier=2;
function gmZeitenRechnen(){const now=Date.now();if(now-gmZeitStand<20e3)return;gmZeitStand=now;const s=gmSonne(now),P=GM_P;
 for(let i=0;i<P.N;i++)P.zeit[i]=gmZeit(P.sinLat[i],P.cosLat[i],P.lat[i],P.lon[i],s);
 const o=gmOrt();gmHier=gmZeit(Math.sin(o.lat*gmRad),Math.cos(o.lat*gmRad),o.lat*gmRad,o.lon*gmRad,s)}

// Ansicht
const gmView=document.createElement('main');gmView.id='gemeinsam';gmView.hidden=true;
gmView.innerHTML='<div class="kaza-top"><h1 id="gmTitel"></h1><span id="gmLive" class="gm-live" hidden></span></div>'+
 '<section class="gm-globus"><canvas id="gmCanvas" role="img"></canvas><p id="gmHier" class="gm-hier"></p></section>'+
 '<div id="gmLegende" class="gm-legende"></div>'+
 '<section class="kaza-hero gm-hero"><div class="gm-kopf"><span id="gmKazaTitel"></span><span id="gmZiel"></span></div><div class="kaza-big"><strong id="gmKaza">–</strong><span id="gmWoche"></span></div><div class="kaza-bar"><div id="gmBalken"></div></div><p id="gmHeute"></p></section>'+
 '<label class="gm-mit"><input type="checkbox" id="gmMit"><span><strong id="gmMitTitel"></strong><small id="gmMitHinweis"></small></span></label>';
$('kaza').after(gmView);
{const l=document.createElement('link');l.rel='stylesheet';l.href='gemeinsam.css';document.head.append(l)}
$('gmMit').onchange=e=>{state.gemeinsam.mit=e.target.checked;if(!e.target.checked)state.gemeinsam.warte=[];save()};

function gmZeichnen(){if(view!=='gemeinsam')return;const s=state.gemeinsam.stand,P=gt('p');
 $('gmTitel').textContent=gt('title');$('gmCanvas').setAttribute('aria-label',gt('globe'));$('gmCanvas').title=gt('drag');
 gmZeitenRechnen();$('gmHier').textContent=gmFill(gt('atYou'),{p:P[gmHier]});
 $('gmLegende').replaceChildren(...[0,2,3,4,5].map(i=>{const el=document.createElement('span');el.className='gm-chip'+(i===gmHier?' hier':'');el.style.setProperty('--c',GM_FARBE[i]);el.textContent=P[i];return el}));
 $('gmKazaTitel').textContent=gt('kaza');$('gmMitTitel').textContent=gt('join');$('gmMitHinweis').textContent=gt('joinHint');$('gmMit').checked=state.gemeinsam.mit;
 const live=s&&s.punkte?.some(p=>p.min<60);$('gmLive').hidden=!live;$('gmLive').textContent=gt('live');
 if(!s){$('gmKaza').textContent='–';$('gmZiel').textContent='';$('gmWoche').textContent='';$('gmBalken').style.width='0';$('gmHeute').textContent=gmFehler?gt('offline'):'';return}
 const k=s.kaza||0,ziel=GM_ZIELE.find(z=>z>k)||k,vorher=GM_ZIELE[GM_ZIELE.indexOf(ziel)-1]||0;
 $('gmKaza').textContent=gmNum(k);$('gmZiel').textContent=gmFill(gt('goal'),{n:gmNum(ziel)});
 $('gmWoche').textContent=s.kazaWoche>0?gmFill(gt('week'),{n:gmNum(s.kazaWoche)}):'';
 $('gmBalken').style.width=Math.min(100,(k-vorher)/(ziel-vorher)*100)+'%';
 const orte=(s.punkte||[]).length,teile=[gmFill(gt('today'),{n:gmNum(s.heute||0)})];if(orte)teile.push(gmFill(gt('places'),{n:gmNum(orte)}));
 $('gmHeute').textContent=teile.join(' · ')+(gmFehler?' · '+gt('offline'):'')}

// Globus: orthografische Projektion, langsames Drehen, Ziehen zum Drehen
const gmG={l0:0,b0:.5,R:0,w:0,h:0,dpr:1,ziehen:null,ruhe:0,lauf:0,letzt:0};
const gmRuhig=matchMedia('(prefers-reduced-motion: reduce)');
function gmGroesse(){const c=$('gmCanvas');c.style.width=c.style.height='0';const box=c.parentElement.getBoundingClientRect(),hier=$('gmHier').offsetHeight;
 const s=Math.max(120,Math.min(box.width,box.height-hier-6));gmG.dpr=Math.min(2,devicePixelRatio||1);
 c.style.width=c.style.height=s+'px';c.width=c.height=Math.round(s*gmG.dpr);gmG.w=gmG.h=c.width;gmG.R=c.width/2-4*gmG.dpr}
function gmMalen(){const c=$('gmCanvas'),x=c.getContext('2d'),{w,R,l0,b0}=gmG,cx=w/2,cy=w/2,P=GM_P;if(!R)return;
 x.clearRect(0,0,w,w);
 const g=x.createRadialGradient(cx-R*.35,cy-R*.4,R*.1,cx,cy,R);g.addColorStop(0,'#fbf8f0');g.addColorStop(1,'#e4e6d8');
 x.fillStyle=g;x.beginPath();x.arc(cx,cy,R,0,7);x.fill();x.strokeStyle='rgb(32 61 52/12%)';x.lineWidth=gmG.dpr;x.stroke();
 const sb=Math.sin(b0),cb=Math.cos(b0),sl=Math.sin(l0),cl=Math.cos(l0),r=Math.max(1.1,R*.0125);
 for(let f=0;f<6;f++){x.fillStyle=GM_FARBE[f];
  for(let i=0;i<P.N;i++){if(P.zeit[i]!==f)continue;const cd=P.cosLon[i]*cl+P.sinLon[i]*sl,cosc=sb*P.sinLat[i]+cb*P.cosLat[i]*cd;if(cosc<=0)continue;
   const sd=P.sinLon[i]*cl-P.cosLon[i]*sl,X=P.cosLat[i]*sd,Y=cb*P.sinLat[i]-sb*P.cosLat[i]*cd;
   x.globalAlpha=.35+.65*cosc;x.fillRect(cx+R*X-r,cy-R*Y-r,2*r,2*r)}}
 x.globalAlpha=1;
 const punkt=(lat,lon)=>{const la=lat*gmRad,lo=lon*gmRad-l0,cosc=sb*Math.sin(la)+cb*Math.cos(la)*Math.cos(lo);
  return cosc>0?[cx+R*Math.cos(la)*Math.sin(lo),cy-R*(cb*Math.sin(la)-sb*Math.cos(la)*Math.cos(lo)),cosc]:null};
 // Lichtpunkte: hier wurde gebetet (frisch = pulsierend)
 const puls=(Date.now()%2400)/2400;
 for(const p of state.gemeinsam.stand?.punkte||[]){const q=punkt(p.lat,p.lon);if(!q)continue;const frisch=p.min<60,gr=R*(.018+.008*Math.min(5,Math.log2(1+p.n)));
  x.fillStyle=frisch?'#fff6dc':'rgb(255 250 235/75%)';x.strokeStyle=frisch?'#a26a14':'rgb(162 106 20/45%)';x.lineWidth=1.5*gmG.dpr;x.globalAlpha=.4+.6*q[2];
  x.beginPath();x.arc(q[0],q[1],gr,0,7);x.fill();x.stroke();
  if(frisch&&!gmRuhig.matches){x.strokeStyle='rgb(214 163 63/'+(1-puls)*.9+')';x.lineWidth=1.5*gmG.dpr;x.beginPath();x.arc(q[0],q[1],gr*(1+puls*2.2),0,7);x.stroke()}}
 x.globalAlpha=1;
 // eigener Ort
 const o=gmOrt(),q=punkt(o.lat,o.lon);if(q){x.strokeStyle='#183c33';x.fillStyle='#fffdf8';x.lineWidth=2*gmG.dpr;x.beginPath();x.arc(q[0],q[1],R*.03,0,7);x.fill();x.stroke();
  x.fillStyle='#183c33';x.beginPath();x.arc(q[0],q[1],R*.012,0,7);x.fill()}}
function gmSchritt(t){if(view!=='gemeinsam'){gmG.lauf=0;return}const dt=Math.min(100,t-(gmG.letzt||t));gmG.letzt=t;
 if(!gmG.ziehen&&!gmRuhig.matches&&t>gmG.ruhe)gmG.l0+=dt*.00006;gmZeitenRechnen();gmMalen();gmG.lauf=requestAnimationFrame(gmSchritt)}
function gmStart(){gmGroesse();if(!gmG.lauf){gmG.letzt=0;gmG.lauf=requestAnimationFrame(gmSchritt)}}
{const c=$('gmCanvas');c.style.touchAction='none';
 c.onpointerdown=e=>{c.setPointerCapture(e.pointerId);gmG.ziehen={x:e.clientX,y:e.clientY,l0:gmG.l0,b0:gmG.b0}};
 c.onpointermove=e=>{const z=gmG.ziehen;if(!z)return;const k=gmG.dpr/gmG.R;gmG.l0=z.l0-(e.clientX-z.x)*k;gmG.b0=Math.max(-1.1,Math.min(1.1,z.b0+(e.clientY-z.y)*k));if(gmRuhig.matches)gmMalen()};
 c.onpointerup=c.onpointercancel=()=>{gmG.ziehen=null;gmG.ruhe=performance.now()+4000}}
new ResizeObserver(()=>{if(view==='gemeinsam')gmStart()}).observe(gmView);

function openGemeinsam(){show('gemeinsam');const o=gmOrt();gmG.l0=o.lon*gmRad;gmG.b0=Math.max(-1,Math.min(1,o.lat*gmRad*.7));gmZeitStand=0;gmZeichnen();gmStart();gmLaden();gmSenden()}
setInterval(()=>{if(view==='gemeinsam'&&!document.hidden)gmLaden()},60e3);
setInterval(()=>{if(view==='gemeinsam')gmZeichnen()},20e3);

// Mitzählen: abgeschlossenes Gebet (Fertig-Seite) und jedes nachgeholte Kaza
let gmOffen=null;
const gmStartVorher=start;start=function(id){gmOffen=ROUTES[id]?.type==='prayer'?id:null;return gmStartVorher.apply(this,arguments)};
const gmRenderVorher=render;render=function(){gmRenderVorher();if(view==='done'&&gmOffen&&route?.id===gmOffen){gmOffen=null;gmMelden('gebet')}};
const gmKazaVorher=kzMark;kzMark=function(k,step=1){const ok=gmKazaVorher(k,step);if(ok!==false)gmMelden('kaza',step);return ok};

// Startseite: Kachel neben Kaza
const gmHome=drawHomeChoices;drawHomeChoices=function(){gmHome();const bald=$('baldBereich');if(!bald)return;
 const s=state.gemeinsam.stand,b=document.createElement('button'),m=Object.assign(document.createElement('span'),{className:'bald-marke'});b.className='bald-kachel kaza-kachel gm-kachel';
 const marke=()=>{const n=state.gemeinsam.stand?.heute;m.hidden=!n;if(n)m.textContent=gmFill(gt('tileSub'),{n:gmNum(n)})};
 b.append(Object.assign(document.createElement('strong'),{textContent:gt('tile')}),m);marke();
 b.onclick=openGemeinsam;const kz=bald.querySelector('.kaza-kachel');kz?kz.after(b):bald.prepend(b);
 if(!s||Date.now()-s.zeit>10*60e3)gmLaden().then(marke)};
const gmLanguage=applyLanguage;applyLanguage=function(){gmLanguage();if(view==='gemeinsam')gmZeichnen()};
