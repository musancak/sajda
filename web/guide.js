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

// Schritte „Lesetempo“ und „Weiter per Stimme“ in allen sechs Sprachen
const G_TEXTE={
 de:{gtTitle:'Dein Lesetempo',gtText:'So schnell läuft die Markierung beim Beten. Probier es aus, bis es sich ruhig anfühlt.',
  gvTitle:'Weiter per Stimme',gvText:'Tippe aufs Mikrofon und sag „Ja“ – dann geht es hier weiter. So funktioniert es auch beim Lesen.',
  gvTap:'Zum Testen tippen',gvListen:'Ich höre zu … sag „Ja“',gvHeard:'Erkannt – weiter geht’s',gvError:'Mikrofon nicht verfügbar. Du kannst immer die Weiter-Taste nutzen.',gvNote:'Nur zum Üben. Im Namaz selbst keine Befehle sprechen.'},
 en:{gtTitle:'Your reading pace',gtText:'This is how fast the highlight moves while you pray. Try it until it feels calm.',
  gvTitle:'Continue by voice',gvText:'Tap the microphone and say “Yes” – the guide moves on. It works the same while reading.',
  gvTap:'Tap to test',gvListen:'Listening … say “Yes”',gvHeard:'Got it – moving on',gvError:'Microphone unavailable. You can always use the Next button.',gvNote:'Practice only. Don’t speak commands during Namaz itself.'},
 tr:{gtTitle:'Okuma hızın',gtText:'Namazda işaretleme bu hızda ilerler. Sana sakin gelene kadar dene.',
  gvTitle:'Sesle devam',gvText:'Mikrofona dokun ve „Evet“ de – rehber devam eder. Okurken de böyle çalışır.',
  gvTap:'Denemek için dokun',gvListen:'Dinliyorum … „Evet“ de',gvHeard:'Anlaşıldı – devam',gvError:'Mikrofon kullanılamıyor. Her zaman Devam düğmesini kullanabilirsin.',gvNote:'Yalnızca alıştırma için. Namazın içinde komut söyleme.'},
 fr:{gtTitle:'Ton rythme de lecture',gtText:'C’est la vitesse du surlignage pendant la prière. Essaie jusqu’à ce que ce soit calme.',
  gvTitle:'Continuer à la voix',gvText:'Touche le micro et dis « Oui » – le guide continue. Cela marche aussi pendant la lecture.',
  gvTap:'Toucher pour tester',gvListen:'J’écoute … dis « Oui »',gvHeard:'Compris – on continue',gvError:'Micro indisponible. Tu peux toujours utiliser le bouton Suivant.',gvNote:'Seulement pour s’entraîner. Ne prononce pas de commandes pendant la prière.'},
 es:{gtTitle:'Tu ritmo de lectura',gtText:'Así de rápido avanza el resaltado mientras rezas. Pruébalo hasta que se sienta tranquilo.',
  gvTitle:'Seguir con la voz',gvText:'Toca el micrófono y di «Sí»: la guía continúa. Funciona igual al leer.',
  gvTap:'Toca para probar',gvListen:'Escuchando … di «Sí»',gvHeard:'Entendido, seguimos',gvError:'Micrófono no disponible. Siempre puedes usar el botón Siguiente.',gvNote:'Solo para practicar. No digas órdenes durante el propio Namaz.'},
 ar:{gtTitle:'سرعة قراءتك',gtText:'بهذه السرعة يتحرك التظليل أثناء الصلاة. جرّبها حتى تشعر بالهدوء.',
  gvTitle:'المتابعة بالصوت',gvText:'اضغط على الميكروفون وقل «نعم» – فينتقل الدليل إلى الخطوة التالية. ويعمل كذلك أثناء القراءة.',
  gvTap:'اضغط للتجربة',gvListen:'أستمع … قل «نعم»',gvHeard:'تم – نتابع',gvError:'الميكروفون غير متاح. يمكنك دائمًا استخدام زر التالي.',gvNote:'للتدريب فقط. لا تنطق أوامر أثناء الصلاة نفسها.'}};
for(const [code,txt] of Object.entries(G_TEXTE))if(UI[code])Object.assign(UI[code],txt);
const G_BEISPIEL='Bismillahir rahmanir rahim. Alhamdu lillahi rabbil alamin.';
const G_JA=['ja','evet','next','yes','oui','sí','si','نعم'];

const SPRACHEN=[['de','Deutsch'],['tr','Türkçe'],['en','English'],['fr','Français'],['ar','العربية'],['es','Español']];

const Guide=(()=>{
 let schritt=0,rahmen,karte,aufraeumen=null;
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
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
  {ziel:null,titel:'gtTitle',text:'gtText',inhalt(){const g=el('div','g-tempo'),box=el('div','g-tempo-text'),wert=el('div','g-tempo-wert');
   const r=Object.assign(el('input'),{type:'range',min:4,max:24,step:1,value:state.speed});
   const skala=el('div','g-tempo-skala');skala.append(el('span',null,t('slow')),el('span',null,t('fast')));
   const wahl=el('div','g-wahl'),knoepfe={};
   for(const m of ['word','letter']){const b=el('button',state.highlight===m?'aktiv':'',t(m));b.onclick=()=>{state.highlight=m;save();for(const k in knoepfe)knoepfe[k].classList.toggle('aktiv',k===m);aufbauen()};knoepfe[m]=b;wahl.append(b)}
   // Gleiche Uhr wie beim Beten (Pacing), damit das Beispiel genau dem echten Tempo entspricht
   let teile=[],plan,start,uhr=0;
   function aufbauen(){box.replaceChildren();teile=Pacing.units(G_BEISPIEL,state.highlight).map(x=>{const sp=el('span','read-unit',x);box.append(sp);return sp});
    plan=Pacing.timeline([{text:G_BEISPIEL}],{speed:state.speed,mode:state.highlight});start=performance.now()}
   function laufen(jetzt){const zeit=(jetzt-start)%(plan.duration+900),e=Pacing.at(plan,zeit),aktiv=e?e.unit:zeit>=plan.duration?teile.length:-1;
    teile.forEach((sp,i)=>{sp.classList.toggle('active',i===aktiv);sp.classList.toggle('read',i<aktiv)});uhr=requestAnimationFrame(laufen)}
   const beschriften=()=>wert.textContent=state.speed+' '+t('speedUnit');
   r.oninput=()=>{state.speed=+r.value;save();beschriften();aufbauen()};
   beschriften();aufbauen();uhr=requestAnimationFrame(laufen);aufraeumen=()=>cancelAnimationFrame(uhr);
   g.append(box,r,skala,wert,wahl);return g}},
  {ziel:null,titel:'gvTitle',text:'gvText',nur:()=>!!SR,inhalt(){const g=el('div','g-stimme'),mic=el('button','g-mic'),status=el('p','g-stimme-status',t('gvTap'));
   mic.setAttribute('aria-label',t('micOff'));mic.innerHTML='<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>';let erkennung=null,aus=false;
   const stoppen=()=>{aus=true;try{erkennung?.stop()}catch{}};aufraeumen=stoppen;
   mic.onclick=()=>{if(erkennung)return;aus=false;erkennung=new SR();erkennung.lang=SPRACH_REGION[state.explanationLanguage];erkennung.continuous=true;erkennung.interimResults=false;
    erkennung.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){if(!e.results[i].isFinal)continue;
     const v=e.results[i][0].transcript.trim().toLowerCase().replace(/[.!?,]/g,'');
     if(G_JA.includes(v)){stoppen();mic.className='g-mic ok';status.textContent=t('gvHeard');setTimeout(()=>{if(karte&&SCHRITTE[schritt].titel==='gvTitle')weiterGehen()},700);return}}};
    erkennung.onerror=()=>{stoppen();erkennung=null;mic.className='g-mic';status.textContent=t('gvError')};
    erkennung.onend=()=>{if(!aus)try{erkennung.start()}catch{}};
    try{erkennung.start();mic.className='g-mic hoert';status.textContent=t('gvListen')}catch{erkennung=null;status.textContent=t('gvError')}};
   g.append(mic,status,el('p','g-stimme-hinweis',t('gvNote')));return g}},
  {ziel:null,titel:'g5Title',text:'g5Text',nur:()=>!standalone(),inhalt(){const g=el('div','g-hinweis');g.append(el('p',null,t('g5Ios')),el('p',null,t('g5Android')));return g}},
 ].filter(s=>!s.nur||s.nur());

 function zeigen(){
  if(!rahmen){rahmen=el('div','g-rahmen');karte=el('div','g-karte');karte.setAttribute('role','dialog');karte.setAttribute('aria-modal','true');document.body.append(rahmen,karte);addEventListener('resize',platzieren);addEventListener('scroll',mitScrollen,{capture:true,passive:true})}
  aufraeumen?.();aufraeumen=null;
  const s=SCHRITTE[schritt],letzter=schritt===SCHRITTE.length-1;
  document.documentElement.dir=state.explanationLanguage==='ar'?'rtl':'ltr';
  const punkte=el('div','g-punkte');SCHRITTE.forEach((_,i)=>punkte.append(el('i',i===schritt?'an':'')));
  const weiter=el('button','primary',t(letzter?'gStart':'gNext'));weiter.onclick=()=>letzter?ende():weiterGehen();
  const skip=el('button','g-skip',t('gSkip'));skip.onclick=ende;
  const fuss=el('div','g-fuss');fuss.append(skip,punkte,weiter);
  karte.replaceChildren(el('h2',null,t(s.titel)),el('p',null,t(s.text)),...(s.inhalt?[s.inhalt()]:[]),fuss);
  const ziel=s.ziel&&document.querySelector(s.ziel);if(ziel)ziel.scrollIntoView({block:'nearest'});
  platzieren();weiter.focus({preventScroll:true})}

 function weiterGehen(){schritt++;zeigen()}

 // Der Rahmen ist fest am Bildschirm – beim Scrollen ohne Verzögerung mitziehen
 let scrollRuhe=0;
 function mitScrollen(){if(!rahmen)return;rahmen.style.transition='none';platzieren();clearTimeout(scrollRuhe);scrollRuhe=setTimeout(()=>{if(rahmen)rahmen.style.transition=''},150)}

 function platzieren(){if(!rahmen)return;const s=SCHRITTE[schritt],ziel=s.ziel&&document.querySelector(s.ziel);
  if(ziel&&ziel.offsetParent){const r=ziel.getBoundingClientRect(),p=8;
   Object.assign(rahmen.style,{top:r.top-p+'px',left:r.left-p+'px',width:r.width+2*p+'px',height:r.height+2*p+'px',opacity:1});
   karte.classList.toggle('oben',r.top+r.height/2>innerHeight/2)}
  else{Object.assign(rahmen.style,{top:'50%',left:'50%',width:'0px',height:'0px'});karte.classList.remove('oben')}}

 function ende(){state.guideDone=true;save();rahmen?.remove();karte?.remove();rahmen=karte=null;removeEventListener('resize',platzieren);removeEventListener('scroll',mitScrollen,{capture:true});aufraeumen?.();aufraeumen=null;home()}
 function start(){schritt=0;if(view!=='home')home();staedteLaden().then(zeigen)}
 return{start}})();

// Beim ersten Öffnen auf diesem Gerät automatisch, sonst über „Kurzanleitung“ auf der Startseite
const vorherHomeGuide=home;
home=function(){vorherHomeGuide();
 const links=document.querySelector('.home-links');
 if(links&&!$('guideAgain')){const b=Object.assign(document.createElement('button'),{id:'guideAgain'});b.onclick=Guide.start;links.append(b)}
 if($('guideAgain'))$('guideAgain').textContent=t('gAgain')};
setTimeout(()=>{if(!state.guideDone&&view==='home')Guide.start()},400);
