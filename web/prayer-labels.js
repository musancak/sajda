'use strict';
const PRAYER_LABELS={
 de:{Sabah:['Morgengebet','Fajr · Sabah'],Öğle:['Mittagsgebet','Dhuhr · Öğle'],İkindi:['Nachmittagsgebet','Asr · İkindi'],Akşam:['Abendgebet','Maghrib · Akşam'],Yatsı:['Nachtgebet','Isha · Yatsı']},
 en:{Sabah:['Morning prayer','Fajr · Sabah'],Öğle:['Noon prayer','Dhuhr · Öğle'],İkindi:['Afternoon prayer','Asr · İkindi'],Akşam:['Evening prayer','Maghrib · Akşam'],Yatsı:['Night prayer','Isha · Yatsı']},
 tr:{Sabah:['Sabah namazı','Fajr'],Öğle:['Öğle namazı','Dhuhr'],İkindi:['İkindi namazı','Asr'],Akşam:['Akşam namazı','Maghrib'],Yatsı:['Yatsı namazı','Isha']}
};
function prayerLabel(name){return PRAYER_LABELS[state.explanationLanguage]?.[name]||[name,'',''];}
function translatePrayerNames(text){if(state.explanationLanguage==='tr')return text;for(const name of Object.keys(PRAYER_LABELS.de))text=text.replaceAll(name,prayerLabel(name)[0]);return text;}
function timeLabel(i){if(i===0)return[prayerLabel('Sabah')[0],'Fajr · İmsak'];if(i===1)return[t('sunrise'),'Güneş'];return prayerLabel(['Öğle','İkindi','Akşam','Yatsı'][i-2]);}
function timeBoundary(i){return{de:['İmsak','Sonnenaufgang','Mittag','Nachmittag','Abend','Nacht'],en:['İmsak','sunrise','noon','afternoon','evening','night'],tr:['İmsak','Güneş','Öğle','İkindi','Akşam','Yatsı']}[state.explanationLanguage][i];}
function prayerButton(name,ids){const label=prayerLabel(name),b=button('',()=>choosePrayer(name,ids));b.dataset.prayerName=name;b.append(Object.assign(document.createElement('strong'),{className:'prayer-primary',textContent:label[0]}),Object.assign(document.createElement('small'),{className:'prayer-traditional',textContent:label[1]}));return b;}
