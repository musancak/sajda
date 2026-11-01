'use strict';
// Kurzanleitung beim ersten Öffnen (pro Gerät gemerkt in state.guideDone).
// Jeder Schritt hebt einen Bereich hervor und lässt das Wichtigste direkt einstellen.
Object.assign(UI.de,{gSkip:'Überspringen',gNext:'Weiter',gStart:'Los geht’s',gAgain:'Kurzanleitung',
 g1Title:'Willkommen bei Sajda',g1Text:'Dein Begleiter Schritt für Schritt durchs Gebet. Wähle zuerst deine Sprache.',
 g2Title:'Deine Gebetszeiten',g2Text:'Wähle, nach welcher Organisation und für welchen Ort die Zeiten gelten.',
 g3Title:'Gebet starten',g3Text:'Tippe auf ein Gebet. Das aktuelle ist dunkel markiert. Unter „Nach Rekat“ findest du alle Varianten.',
 g4Title:'Gut lesbar',g4Text:'Stell die Schrift so groß ein, dass du sie beim Beten bequem liest. Beim Beten blendet „Mehr“ Tempo und Mikrofon ein.',
 g4Sample:'Allahu Akbar',
 g5Title:'Wie eine App nutzen',g5Text:'Leg Sajda auf den Home-Bildschirm. Dann startet es im Vollbild und funktioniert auch ohne Internet.',
 g5Ios:'iPhone: Safari → Teilen → „Zum Home-Bildschirm“',g5Android:'Android: Chrome → ⋮ → „App installieren“'});
Object.assign(UI.en,{gSkip:'Skip',gNext:'Next',gStart:'Let’s go',gAgain:'Quick guide',
 g1Title:'Welcome to Sajda',g1Text:'Your step-by-step companion through the prayer. First, choose your language.',
 g2Title:'Your prayer times',g2Text:'Choose which organisation and which place the times are for.',
 g3Title:'Start a prayer',g3Text:'Tap a prayer. The current one is highlighted. “By rakat” lists every variant.',
 g4Title:'Easy to read',g4Text:'Set the text size so you can read it comfortably while praying. During prayer, “More” shows tempo and microphone.',
 g4Sample:'Allahu Akbar',
 g5Title:'Use it like an app',g5Text:'Add Sajda to your home screen. It then opens full screen and works offline.',
 g5Ios:'iPhone: Safari → Share → “Add to Home Screen”',g5Android:'Android: Chrome → ⋮ → “Install app”'});
Object.assign(UI.tr,{gSkip:'Geç',gNext:'İleri',gStart:'Başlayalım',gAgain:'Kısa rehber',
 g1Title:'Sajda’ya hoş geldin',g1Text:'Namazda adım adım yanındaki rehber. Önce dilini seç.',
 g2Title:'Namaz vakitlerin',g2Text:'Vakitlerin hangi kuruma ve hangi yere göre gösterileceğini seç.',
 g3Title:'Namaza başla',g3Text:'Bir namaza dokun. Şu anki vakit koyu renkle işaretli. „Rekâta göre“ altında tüm çeşitler var.',
 g4Title:'Rahat okunsun',g4Text:'Yazıyı namazda rahat okuyacağın büyüklüğe ayarla. Namaz sırasında „Daha fazla“ tempo ve mikrofonu gösterir.',
 g4Sample:'Allahu Akbar',
 g5Title:'Uygulama gibi kullan',g5Text:'Sajda’yı ana ekrana ekle. Böylece tam ekran açılır ve internetsiz de çalışır.',
 g5Ios:'iPhone: Safari → Paylaş → „Ana Ekrana Ekle“',g5Android:'Android: Chrome → ⋮ → „Uygulamayı yükle“'});

const SPRACHEN=[['de','Deutsch'],['tr','Türkçe'],['en','English'],['fr','Français'],['ar','العربية'],['es','Español']];

const Guide=(()=>{
 let schritt=0,rahmen,karte;
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
 const SCHRITTE=[
  {ziel:null,titel:'g1Title',text:'g1Text',inhalt(){const g=el('div','g-sprachen');
   for(const [code,name] of SPRACHEN){if(!UI[code])continue;const b=el('button',state.explanationLanguage===code?'aktiv':'',name);b.lang=code;
    b.onclick=()=>{state.explanationLanguage=code;save();applyLanguage();zeigen()};g.append(b)}return g}},
  {ziel:'.times-board',titel:'g2Title',text:'g2Text',inhalt(){const g=el('div','g-felder'),z=state.zeiten;
   const sel=(opts,wert,fn)=>{const s=el('select');for(const [v,t] of opts)s.append(Object.assign(el('option'),{value:v,textContent:t}));s.value=wert;s.onchange=()=>fn(s.value);return s};
   g.append(sel(Object.entries(ORGS).map(([k,v])=>[k,t(v)]),z.org,v=>{state.zeiten={...state.zeiten,org:v};save();timesData=null;loadTimes()}),
            sel([['gps',t('myLocation')],...STAEDTE.map(s=>[s.slug,s.name])],z.ort,v=>{state.zeiten={...state.zeiten,ort:v};save();timesData=null;loadTimes()}));return g}},
  {ziel:'#prayerChoices',titel:'g3Title',text:'g3Text'},
  {ziel:null,titel:'g4Title',text:'g4Text',inhalt(){const g=el('div','g-schrift'),probe=el('p','g-probe',t('g4Sample'));probe.style.fontSize=state.font+'px';
   const r=Object.assign(el('input'),{type:'range',min:36,max:72,step:2,value:state.font});r.oninput=()=>{state.font=+r.value;probe.style.fontSize=state.font+'px';save()};
   g.append(probe,r);return g}},
  {ziel:null,titel:'g5Title',text:'g5Text',nur:()=>!standalone(),inhalt(){const g=el('div','g-hinweis');g.append(el('p',null,t('g5Ios')),el('p',null,t('g5Android')));return g}},
 ].filter(s=>!s.nur||s.nur());

 function zeigen(){
  if(!rahmen){rahmen=el('div','g-rahmen');karte=el('div','g-karte');karte.setAttribute('role','dialog');karte.setAttribute('aria-modal','true');document.body.append(rahmen,karte);addEventListener('resize',platzieren)}
  const s=SCHRITTE[schritt],letzter=schritt===SCHRITTE.length-1;
  document.documentElement.dir=state.explanationLanguage==='ar'?'rtl':'ltr';
  const punkte=el('div','g-punkte');SCHRITTE.forEach((_,i)=>punkte.append(el('i',i===schritt?'an':'')));
  const weiter=el('button','primary',t(letzter?'gStart':'gNext'));weiter.onclick=()=>letzter?ende():(schritt++,zeigen());
  const skip=el('button','g-skip',t('gSkip'));skip.onclick=ende;
  const fuss=el('div','g-fuss');fuss.append(skip,punkte,weiter);
  karte.replaceChildren(el('h2',null,t(s.titel)),el('p',null,t(s.text)),...(s.inhalt?[s.inhalt()]:[]),fuss);
  platzieren();weiter.focus({preventScroll:true})}

 function platzieren(){if(!rahmen)return;const s=SCHRITTE[schritt],ziel=s.ziel&&document.querySelector(s.ziel);
  if(ziel&&ziel.offsetParent){const r=ziel.getBoundingClientRect(),p=8;
   Object.assign(rahmen.style,{top:r.top-p+'px',left:r.left-p+'px',width:r.width+2*p+'px',height:r.height+2*p+'px',opacity:1});
   karte.classList.toggle('oben',r.top+r.height/2>innerHeight/2)}
  else{Object.assign(rahmen.style,{top:'50%',left:'50%',width:'0px',height:'0px'});karte.classList.remove('oben')}}

 function ende(){state.guideDone=true;save();rahmen?.remove();karte?.remove();rahmen=karte=null;removeEventListener('resize',platzieren);home()}
 function start(){schritt=0;if(view!=='home')home();staedteLaden().then(zeigen)}
 return{start}})();

// Beim ersten Öffnen auf diesem Gerät automatisch, sonst über „Kurzanleitung“ auf der Startseite
const vorherHomeGuide=home;
home=function(){vorherHomeGuide();
 const links=document.querySelector('.home-links');
 if(links&&!$('guideAgain')){const b=Object.assign(document.createElement('button'),{id:'guideAgain'});b.onclick=Guide.start;links.append(b)}
 if($('guideAgain'))$('guideAgain').textContent=t('gAgain')};
setTimeout(()=>{if(!state.guideDone&&view==='home')Guide.start()},400);
