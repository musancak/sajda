'use strict';
// Ort und Organisation für die Gebetszeiten wählen.
// DITIB/Diyanet: offizielle Tabellen aus zeiten/diyanet-<stadt>.json (monatlich per GitHub Action erneuert).
// Andere Organisationen: offline berechnet (berechnung.js) für die gewählte Stadt oder den GPS-Standort.
Object.assign(UI.de,{orgDiyanet:'DITIB · Diyanet',orgMwl:'Muslim World League',orgUmmalqura:'Umm al-Qura (Mekka)',orgEgypt:'Ägyptische Behörde',
 timesSetup:'Ort & Methode',timesSetupTitle:'Gebetszeiten',timesOrg:'Organisation',timesPlace:'Ort',myLocation:'Mein Standort (GPS)',
 locating:'Standort wird bestimmt …',noLocation:'Standort nicht verfügbar. Bitte eine Stadt wählen.',nearestCity:'nächste Stadt mit Diyanet-Zeiten: {city}',
 computedTimes:'Berechnet · {org}',diyanetTimes:'Diyanet-Tabelle',done:'Fertig',myPlace:'Mein Standort'});
Object.assign(UI.en,{orgDiyanet:'DITIB · Diyanet',orgMwl:'Muslim World League',orgUmmalqura:'Umm al-Qura (Makkah)',orgEgypt:'Egyptian Authority',
 timesSetup:'Place & method',timesSetupTitle:'Prayer times',timesOrg:'Organisation',timesPlace:'Place',myLocation:'My location (GPS)',
 locating:'Finding your location …',noLocation:'Location unavailable. Please choose a city.',nearestCity:'nearest city with Diyanet times: {city}',
 computedTimes:'Calculated · {org}',diyanetTimes:'Diyanet table',done:'Done',myPlace:'My location'});
Object.assign(UI.tr,{orgDiyanet:'DİTİB · Diyanet',orgMwl:'Muslim World League',orgUmmalqura:'Ümmü’l-Kura (Mekke)',orgEgypt:'Mısır Diyanet İşleri',
 timesSetup:'Yer ve yöntem',timesSetupTitle:'Namaz vakitleri',timesOrg:'Kurum',timesPlace:'Yer',myLocation:'Konumum (GPS)',
 locating:'Konum belirleniyor …',noLocation:'Konum alınamadı. Lütfen bir şehir seç.',nearestCity:'Diyanet vakti olan en yakın şehir: {city}',
 computedTimes:'Hesaplandı · {org}',diyanetTimes:'Diyanet tablosu',done:'Tamam',myPlace:'Konumum'});

const ORGS={diyanet:'orgDiyanet',mwl:'orgMwl',ummalqura:'orgUmmalqura',egypt:'orgEgypt'};
let STAEDTE=[],ortHinweis='';
state.zeiten=Object.assign({org:'diyanet',ort:'stuttgart'},state.zeiten||{});

function abstand(a,b){const r=Math.PI/180,x=(b.lon-a.lon)*r*Math.cos((a.lat+b.lat)/2*r),y=(b.lat-a.lat)*r;return Math.hypot(x,y)}
function naechste(p){return STAEDTE.reduce((best,s)=>!best||abstand(p,s)<abstand(p,best)?s:best,null)}
function ortName(){const z=state.zeiten;return z.ort==='gps'?t('myPlace'):(STAEDTE.find(s=>s.slug===z.ort)?.name||'Stuttgart')}
async function staedteLaden(){if(STAEDTE.length)return;try{STAEDTE=await (await fetch('zeiten/staedte.json')).json()}catch{STAEDTE=[{slug:'stuttgart',name:'Stuttgart',lat:48.776,lon:9.183,url:'https://namazvakitleri.diyanet.gov.tr/tr-TR/11027/stuttgart-icin-namaz-vakti'}]}}
function geraetZone(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Berlin'}catch{return 'Europe/Berlin'}}
function position(){return new Promise((ok,nein)=>{if(!navigator.geolocation)return nein();navigator.geolocation.getCurrentPosition(p=>ok({lat:p.coords.latitude,lon:p.coords.longitude}),nein,{timeout:15000,maximumAge:3600000})})}

validTimes=function(data){return Array.isArray(data?.days)&&data.days.length>0&&data.days.every(d=>/^\d{4}-\d{2}-\d{2}$/.test(d.date)&&Array.isArray(d.times)&&d.times.length===6&&d.times.every(x=>/^([01]\d|2[0-3]):[0-5]\d$/.test(x)))};
acceptTimes=function(data){if(!validTimes(data))return;timesData=data;timesLive=false;drawTimes()};

loadTimes=async function(){if(timesBusy)return;timesBusy=true;drawTimes();
 try{await staedteLaden();const z=state.zeiten;ortHinweis='';
  let ort=STAEDTE.find(s=>s.slug===z.ort);
  if(z.ort==='gps'){try{const p=await position();z.lat=p.lat;z.lon=p.lon;save()}catch{if(z.lat==null){ortHinweis=t('noLocation');z.ort='stuttgart';save();ort=STAEDTE.find(s=>s.slug==='stuttgart')}}}
  const p=z.ort==='gps'?{lat:z.lat,lon:z.lon}:ort;
  if(z.org==='diyanet'){const stadt=z.ort==='gps'?naechste(p):ort;if(z.ort==='gps')ortHinweis=t('nearestCity').replace('{city}',stadt.name);
   const data=await (await fetch('zeiten/diyanet-'+stadt.slug+'.json')).json();data.quelle=t('diyanetTimes');data.link=stadt.url;PrayerPlan.setZone(data.timezone||stadt.tz);acceptTimes(data)}
  else{const tz=z.ort==='gps'?geraetZone():(ort.tz||'Europe/Berlin');PrayerPlan.setZone(tz);acceptTimes({city:ortName(),fetchedAt:new Date().toISOString(),berechnet:true,days:Berechnung.tage(p.lat,p.lon,z.org,new Date(),400,tz)})}
 }catch{}finally{timesBusy=false;drawTimes()}};

const vorherDrawTimes=drawTimes;
drawTimes=function(){vorherDrawTimes();if(!$('timesGrid'))return;
 const z=state.zeiten,tr=STAEDTE.find(s=>s.slug===z.ort)?.land==='TR',org=z.org==='diyanet'&&tr?'Diyanet':t(ORGS[z.org]);
 document.querySelector('[data-t=cityZone]').textContent=ortName()+' · '+org;
 const link=document.querySelector('.time-details a');if(link){link.hidden=!timesData?.link;if(timesData?.link)link.href=timesData.link}
 if(timesData&&!timesBusy){const stamp=new Intl.DateTimeFormat(locale(),{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(timesData.fetchedAt));
  $('timesStatus').textContent=(timesData.berechnet?t('computedTimes').replace('{org}',org):timesData.quelle+' · '+t('dataAsOf')+' '+stamp)+(ortHinweis?' · '+ortHinweis:'')}
 $('refreshTimes').textContent=t('timesSetup')};

function ortDialog(){let d=$('ortDialog');
 if(!d){d=document.createElement('dialog');d.id='ortDialog';d.className='ort-dialog';document.body.append(d)}
 const z=state.zeiten,sel=(id,opts,wert)=>{const s=document.createElement('select');s.id=id;for(const [v,txt] of opts)s.append(Object.assign(document.createElement('option'),{value:v,textContent:txt}));s.value=wert;return s};
 const org=sel('ortOrg',Object.entries(ORGS).map(([k,v])=>[k,t(v)]),z.org);
 const ort=sel('ortOrt',[['gps',t('myLocation')]],z.ort);
 // Städte nach Land gruppiert (Deutschland, Türkei), Ländernamen in der App-Sprache
 let land;try{land=new Intl.DisplayNames([locale()],{type:'region'})}catch{}
 for(const code of [...new Set(STAEDTE.map(s=>s.land||'DE'))]){const g=document.createElement('optgroup');g.label=land?.of(code)||code;
  for(const s of STAEDTE.filter(s=>(s.land||'DE')===code))g.append(Object.assign(document.createElement('option'),{value:s.slug,textContent:s.name}));ort.append(g)}
 ort.value=z.ort;
 const feld=(txt,el)=>{const l=document.createElement('label');l.append(Object.assign(document.createElement('span'),{textContent:txt}),el);return l};
 const fertig=Object.assign(document.createElement('button'),{className:'primary',textContent:t('done')});
 fertig.onclick=()=>{state.zeiten={...state.zeiten,org:org.value,ort:ort.value};save();d.close();timesData=null;if(ort.value==='gps')$('timesStatus').textContent=t('locating');loadTimes()};
 d.replaceChildren(Object.assign(document.createElement('h2'),{textContent:t('timesSetupTitle')}),feld(t('timesOrg'),org),feld(t('timesPlace'),ort),fertig);
 d.showModal()}
$('refreshTimes').onclick=async()=>{await staedteLaden();ortDialog()};
