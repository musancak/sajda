'use strict';
const SectionTempo=(()=>{
 const aliases={fatiha1:'fatiha',fatiha2:'fatiha',tashahhud1:'tashahhud',tashahhud2:'tashahhud',qunut1a:'qunut1',qunut1b:'qunut1',kursi1:'kursi',kursi2:'kursi',kursi3:'kursi',sujud1:'secde',sujud2:'secde'};
 function key(id){return aliases[id]||id;}
 function speed(state,id){const learned=state.sectionDurations?.[key(id)]?.rate;if(Number.isFinite(learned)&&learned>0)return learned;const value=state.sectionSpeeds?.[key(id)];return Number.isFinite(value)&&value>=4&&value<=24?value:state.speed;}
 function custom(state,id){return Number.isFinite(state.sectionSpeeds?.[key(id)])||Number.isFinite(state.sectionDurations?.[key(id)]?.rate);}
 return{key,speed,custom};
})();
if(typeof module!=='undefined')module.exports=SectionTempo;
