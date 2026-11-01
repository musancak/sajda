'use strict';
// Gebetszeiten für beliebige Orte berechnen (offline), nach dem Verfahren von PrayTimes.org.
// Ergebnis hat dasselbe Format wie die Diyanet-Tabellen: {date, times:[İmsak,Güneş,Öğle,İkindi,Akşam,Yatsı]}.
const Berechnung=(()=>{
 const METHODEN={
  mwl:{fajr:18,isha:17},              // Muslim World League
  ummalqura:{fajr:18.5,ishaMin:90},   // Umm al-Qura, Mekka
  egypt:{fajr:19.5,isha:17.5}         // Ägyptische Behörde
 };
 const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
 const sin=d=>Math.sin(rad(d)),cos=d=>Math.cos(rad(d)),tan=d=>Math.tan(rad(d));
 const asin=x=>deg(Math.asin(x)),acos=x=>deg(Math.acos(x)),atan2=(y,x)=>deg(Math.atan2(y,x)),acot=x=>deg(Math.atan(1/x));
 const fix=(a,b)=>{a=a-b*Math.floor(a/b);return a<0?a+b:a};
 function julian(y,m,d){if(m<=2){y-=1;m+=12}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5}
 function sonne(jd){const D=jd-2451545,g=fix(357.529+.98560028*D,360),q=fix(280.459+.98564736*D,360),L=fix(q+1.915*sin(g)+.02*sin(2*g),360),e=23.439-.00000036*D;
  const RA=atan2(cos(e)*sin(L),cos(L))/15;return{decl:asin(sin(e)*sin(L)),eqt:q/15-fix(RA,24)}}
 // Abweichung der Zone Europe/Berlin von UTC an diesem Tag in Stunden (Sommerzeit beachtet)
 function zone(y,m,d,tz){const t=Date.UTC(y,m-1,d,12),p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).formatToParts(new Date(t)).map(x=>[x.type,x.value]));
  return (Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute)-t)/3600000}
 function tag(y,m,d,lat,lon,methode,tz){
  const M=METHODEN[methode],jd=julian(y,m,d)-lon/(15*24);
  const mittag=t=>fix(12-sonne(jd+t).eqt,24);
  const winkel=(a,t,ccw)=>{const dc=sonne(jd+t).decl,h=acos((-sin(a)-sin(dc)*sin(lat))/(cos(dc)*cos(lat)))/15;return mittag(t)+(ccw?-h:h)};
  const asr=(f,t)=>{const dc=sonne(jd+t).decl;return winkel(-acot(f+tan(Math.abs(lat-dc))),t)};
  const auf=winkel(.833,6/24,true),unter=winkel(.833,18/24),nacht=24-(unter-auf);
  let fajr=winkel(M.fajr,5/24,true),isha=M.ishaMin?unter+M.ishaMin/60:winkel(M.isha,18/24);
  // hohe Breiten (Sommer in Norddeutschland): Winkel-Anteil der Nacht als Grenze
  const anteil=a=>a/60*nacht;
  if(!(auf-fajr<=anteil(M.fajr)))fajr=auf-anteil(M.fajr);
  if(!M.ishaMin&&!(isha-unter<=anteil(M.isha)))isha=unter+anteil(M.isha);
  const off=zone(y,m,d,tz)-lon/15;
  return [fajr,auf,mittag(12/24),asr(1,13/24),unter,isha].map(h=>{const min=Math.round(fix(h+off,24)*60)%1440;return String(Math.floor(min/60)).padStart(2,'0')+':'+String(min%60).padStart(2,'0')})}
 function tage(lat,lon,methode,von=new Date(),anzahl=400,tz='Europe/Berlin'){
  const out=[],start=Date.UTC(von.getFullYear(),von.getMonth(),von.getDate()-1);
  for(let i=0;i<anzahl;i++){const t=new Date(start+i*86400000),y=t.getUTCFullYear(),m=t.getUTCMonth()+1,d=t.getUTCDate();
   out.push({date:y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0'),times:tag(y,m,d,lat,lon,methode,tz)})}
  return out}
 return{METHODEN,tag,tage};
})();
if(typeof module!=='undefined')module.exports=Berechnung;
