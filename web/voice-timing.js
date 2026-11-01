'use strict';
const VoiceTiming=(()=>{
 class Detector{
  constructor(){this.first=null;this.last=null;this.candidate=null;this.noise=.003;}
  sample(rms,ms){if(this.first===null&&rms<.012)this.noise=this.noise*.98+rms*.02;const threshold=Math.max(.012,Math.min(.045,this.noise*3));if(rms>threshold){if(this.candidate===null)this.candidate=ms;if(this.first===null&&ms-this.candidate>=100)this.first=this.candidate;if(this.first!==null)this.last=ms;}else this.candidate=null;return this.first!==null;}
  duration(){return this.first===null||this.last===null?null:Math.max(.1,(this.last-this.first)/1000);}
  silentFor(ms){return this.last===null?0:(ms-this.last)/1000;}
 }
 const chars=blocks=>blocks.reduce((n,b)=>n+Array.from((b.text||'').replace(/\s/gu,'')).length,0);
 function calibration(blocks,seconds,repetitions=1){const count=chars(blocks)*repetitions;if(!Number.isFinite(seconds)||seconds<=0||seconds>1800||!count)return null;return{seconds,characters:count,repetitions,rate:count/seconds,measuredAt:new Date().toISOString()};}
 return{Detector,chars,calibration};
})();
if(typeof module!=='undefined')module.exports=VoiceTiming;
