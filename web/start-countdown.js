'use strict';
const StartCountdown=(()=>{
 function create({now,request,cancel,onTick,onComplete}){let frame=0,token=0,active=false;function stop(){token++;active=false;cancel(frame);frame=0;}function start(){stop();active=true;const run=token,began=now();let last=null;function tick(){if(!active||run!==token)return;const value=Math.ceil((3000-(now()-began))/1000);if(value<=0){active=false;frame=0;onComplete();return;}if(value!==last){last=value;onTick(value);}frame=request(tick);}tick();}return{start,cancel:stop,isActive:()=>active};}
 return{create};
})();
if(typeof module!=='undefined')module.exports=StartCountdown;
