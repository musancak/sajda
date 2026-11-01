'use strict';
// App-Name „Sajda“ und Vorschau auf kommende Bereiche (Dua-Sammlung, Dhikr-Zähler)
const APP_NAME='Sajda';
Object.assign(UI.de,{app:APP_NAME,appSub:'Gebetsbegleiter',soon:'Bald verfügbar',soonDuas:'Duas',soonDuasSub:'Bittgebete für den Alltag',soonDhikr:'Dhikr',soonDhikrSub:'Zähler & Gedenken'});
Object.assign(UI.en,{app:APP_NAME,appSub:'Prayer companion',soon:'Coming soon',soonDuas:'Duas',soonDuasSub:'Supplications for every day',soonDhikr:'Dhikr',soonDhikrSub:'Counter & remembrance'});
Object.assign(UI.tr,{app:APP_NAME,appSub:'Namaz rehberi',soon:'Yakında',soonDuas:'Dualar',soonDuasSub:'Günlük dualar',soonDhikr:'Zikir',soonDhikrSub:'Sayaç ve zikir'});
document.title=APP_NAME;
// Arabisch von rechts nach links
const vorherSprache=applyLanguage;
applyLanguage=function(){vorherSprache();document.title=APP_NAME+' – '+t('appSub');document.documentElement.dir=state.explanationLanguage==='ar'?'rtl':'ltr'};

const vorherHomeChoices=drawHomeChoices;
drawHomeChoices=function(){vorherHomeChoices();
 let bald=$('baldBereich');
 if(!bald){bald=document.createElement('section');bald.id='baldBereich';bald.className='bald';$('homeShortcuts').after(bald)}
 bald.hidden=$('homeShortcuts').hidden;
 const kachel=(titel,sub)=>{const k=document.createElement('div');k.className='bald-kachel';k.setAttribute('aria-disabled','true');
  k.append(Object.assign(document.createElement('strong'),{textContent:t(titel)}),Object.assign(document.createElement('small'),{textContent:t(sub)}),Object.assign(document.createElement('span'),{className:'bald-marke',textContent:t('soon')}));return k};
 bald.replaceChildren(kachel('soonDuas','soonDuasSub'),kachel('soonDhikr','soonDhikrSub'))};
