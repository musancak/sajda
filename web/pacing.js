'use strict';
// A deterministic reading clock shared by the real page and the live example.
const Pacing = (()=>{
 function units(text,mode){return mode==='letter'?Array.from(text):text.match(/\S+\s*|\s+/gu)||[];}
 function timeline(blocks,{speed=10,mode='word',pause=3}={}){let time=0,events=[];blocks.forEach((b,block)=>{if(b.spoken===false)return;units(b.text,mode).forEach((text,unit)=>{const duration=Array.from(text.replace(/\s/gu,'')).length/speed*1000;if(!duration)return;events.push({start:time,end:time+duration,block,unit,text});time+=duration;});if(b.pauseAfter){events.push({start:time,end:time+pause*1000,pause:true});time+=pause*1000;}});return{events,duration:time};}
 function at(plan,elapsed){return plan.events.find(e=>elapsed>=e.start&&elapsed<e.end)||null;}
 return{units,timeline,at};
})();
if(typeof module!=='undefined')module.exports=Pacing;
