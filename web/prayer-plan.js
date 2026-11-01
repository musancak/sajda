'use strict';
const PrayerPlan=(()=>{
 const surahs=['kawthar','ikhlas','falaq','nas','nasr','asrSurah'];
 // Farz: ab der 3. Rekat nur Fatiha, keine Zusatzsure (Sünnet und Vitir behalten sie, hanefitisch)
 const farz=route=>/Farz/.test(route.title||'');
 function slots(route){return [...new Set(route.seq.filter(s=>s.key==='fatiha2'&&!(farz(route)&&s.r>2)).map(s=>s.r))];}
 function defaults(base){const open=slots(base),choices=Object.fromEntries(open.map(r=>[r,'none']));for(const s of base.seq)if(surahs.includes(s.key)&&open.includes(s.r))choices[s.r]=s.key;return choices;}
 function route(base,choices={}){const selected=defaults(base);for(const [r,key]of Object.entries(choices))if(r in selected&&(key==='none'||surahs.includes(key)))selected[r]=key;const seq=[];for(const s of base.seq){if(surahs.includes(s.key))continue;seq.push({...s});if(s.key==='fatiha2'&&surahs.includes(selected[s.r]))seq.push({...s,key:selected[s.r]});}return{...base,seq};}
 const zone='Europe/Berlin';
 function cityDate(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
 function instant(date,time){const target=Date.parse(date+'T'+time+':00Z');let stamp=target;for(let i=0;i<3;i++){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(stamp)).map(p=>[p.type,p.value]));const wall=Date.UTC(+parts.year,+parts.month-1,+parts.day,+parts.hour,+parts.minute,+parts.second);stamp+=target-wall;}return stamp;}
 function nextTime(days,now=new Date()){const stamp=now.getTime();for(const day of days)for(let i=0;i<6;i++){const at=instant(day.date,day.times[i]);if(at>stamp)return{...day,index:i,at,remaining:at-stamp};}return null;}
 function currentTime(days,now=new Date()){const stamp=now.getTime();for(let d=days.length-1;d>=0;d--)for(let i=5;i>=0;i--){const at=instant(days[d].date,days[d].times[i]);if(at<=stamp)return{...days[d],index:i,at};}return null;}
 function period(days,name,now=new Date()){const first={Sabah:0,Öğle:2,İkindi:3,Akşam:4,Yatsı:5}[name];if(first===undefined)return null;const date=cityDate(now),day=days.find(d=>d.date===date),tomorrow=new Date(date+'T12:00:00Z');tomorrow.setUTCDate(tomorrow.getUTCDate()+1);const endDate=first===5?tomorrow.toISOString().slice(0,10):date,endDay=days.find(d=>d.date===endDate);return{from:first,to:first===5?0:first+1,start:day?.times[first]||null,end:endDay?.times[first===5?0:first+1]||null,nextDay:first===5};}
 return{surahs,slots,route,defaults,cityDate,instant,nextTime,currentTime,period};
})();
if(typeof module!=='undefined')module.exports=PrayerPlan;
