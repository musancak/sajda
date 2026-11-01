'use strict';
let startCountdownArmed=false,exactPrayerAction=null;
const countdownDialog=$('startCountdown');
const basePacePlay=$('pacePlay').onclick;
const startClock=StartCountdown.create({now:()=>performance.now(),request:fn=>requestAnimationFrame(fn),cancel:id=>cancelAnimationFrame(id),onTick:value=>{$('countdownValue').textContent=String(value)},onComplete:()=>{if(countdownDialog.open)countdownDialog.close();if(view!=='reader'||!current()?.intention)return;startCountdownArmed=false;basePacePlay();}});
function cancelStartCountdown(){startClock.cancel();if(countdownDialog.open)countdownDialog.close();}
function beginStartCountdown(){stopVoice();if(startClock.isActive())return;countdownDialog.showModal();startClock.start();$('cancelCountdown').focus();}
$('cancelCountdown').onclick=()=>{cancelStartCountdown();$('pacePlay').focus()};countdownDialog.addEventListener('cancel',event=>{event.preventDefault();cancelStartCountdown();$('pacePlay').focus()});
$('pacePlay').onclick=()=>{if(!running&&startCountdownArmed&&index===0&&current()?.intention){beginStartCountdown();return;}basePacePlay();};
function chooseExactPrayer(action){exactPrayerAction=action;show('exactPrayer');$('exactPrayerChoices').replaceChildren(...['dhuhrFarz','asrFarz','ishaFarz'].map(id=>{const b=button(routeName(ROUTES[id]).join(' · '),()=>{const next=exactPrayerAction;exactPrayerAction=null;next?.(id)});b.className='farz-choice';return b}));}
const configureBeforeIntention=configureRoute;configureRoute=function(id,bypass=false){if(id==='p4')return chooseExactPrayer(selected=>configureBeforeIntention(selected,bypass));configureBeforeIntention(id,bypass);};
const startBeforeIntention=start;start=function(id,reset=false){cancelStartCountdown();if(id==='p4')return chooseExactPrayer(selected=>start(selected,reset));startBeforeIntention(id,reset);startCountdownArmed=route?.type==='prayer'&&index===0&&page===0;};
$('exactPrayerBack').onclick=home;
