'use strict';
// Kaza-Zähler: offene Pflichtgebete + Vitir zählen (nur lokal in state.kaza), mit Anleitung nachholen über eigene Kaza-Routen
// Grundlage: İslam ve İhsan „Kazâ Namazı Nasıl Kılınır?“ (Farz + Vitir, Niyet „ilk/son“, Kerahat-Zeiten, Tertip ab 6)
const KAZA=[['sabah','Sabah','p2',2],['ogle','Öğle','dhuhrFarz',4],['ikindi','İkindi','asrFarz',4],['aksam','Akşam','p3',3],['yatsi','Yatsı','ishaFarz',4],['vitir','Vitir','witr',3]];
const KAZA_TEXT={
 de:{soon:'bald',title:'Kaza',doneLabel:'nachgeholt',openOf:'noch {n} offen',openShort:'{n} offen',start:'Neu',week:'diese Woche {n}',pace:'in deinem Tempo etwa bis {d}',allDone:'Alles nachgeholt. Allah kabul etsin.',
  emptyTitle:'Wie viele Gebete möchtest du nachholen?',emptyHint:'Eine Schätzung reicht. Du kannst sie jederzeit anpassen.',estimate:'Zeitraum schätzen',enter:'Selbst eintragen',edit:'Bearbeiten',editDone:'Fertig',backup:'Sichern',local:'Nur auf diesem Gerät gespeichert',
  open:'offen',rekat:'Rekat',pray:'Mit Anleitung beten',mark:'Ein Gebet nachgeholt',less:'Eins weniger',more:'Eins mehr',toast:'{p} nachgeholt',undo:'Rückgängig',counted:'{p} eingetragen · noch {n} offen',
  setupTitle:'Zeitraum schätzen',setupHint:'Ab der Religionsmündigkeit bis zu dem Zeitpunkt, ab dem du regelmäßig gebetet hast.',years:'Jahre',months:'Monate',share:'Wie viel davon hast du ungefähr gebetet?',shares:['Nichts','Ein Viertel','Die Hälfte','Drei Viertel'],
  exempt:'Tage im Monat ohne Gebetspflicht (z. B. Menstruation)',witr:'Vitir einbeziehen',perPrayer:'≈ {n} je Gebet',total:'{n} insgesamt',replace:'Ersetzen',add:'Hinzufügen',apply:'Übernehmen',cancel:'Abbrechen',
  infoTitle:'Kurz erklärt',info:['Nachgeholt werden die fünf Pflichtgebete (nur der Farz-Teil) und Vitir, Sunna-Gebete nicht.','In der Niyyah sagst du „das erste“ (oder „das letzte“) versäumte Öğle-Gebet usw. Ein Datum brauchst du nicht.','Kaza geht jederzeit, außer bei Sonnenaufgang, Zenit und Sonnenuntergang.','Sind mehr als sechs Gebete offen, musst du keine Reihenfolge einhalten.','Kennst du die genaue Zahl nicht, reicht deine beste Schätzung.'],source:'Quelle',
  backupHint:'Kopiere diesen Code an einen sicheren Ort, zum Beispiel in deine Notizen. Zum Wiederherstellen den Code hier einfügen und laden.',copy:'Kopieren',copied:'Kopiert',load:'Laden',loaded:'Geladen',bad:'Der Code ist ungültig.',close:'Schließen',
  niyyah:'Niyyah – Absicht',niyet:'Ich habe die Absicht gefasst, um Allahs Wohlgefallen zu erlangen, das erste {g} nachzuholen, das ich versäumt habe.',g:{sabah:'Morgengebet',ogle:'Mittagsgebet',ikindi:'Nachmittagsgebet',aksam:'Abendgebet',yatsi:'Nachtgebet',vitir:'Vitir-Gebet'},vitir:'Vitir'},
 en:{soon:'soon',title:'Kaza',doneLabel:'made up',openOf:'{n} still open',openShort:'{n} open',start:'New',week:'this week {n}',pace:'at your pace until about {d}',allDone:'All made up. May Allah accept it.',
  emptyTitle:'How many prayers would you like to make up?',emptyHint:'An estimate is enough. You can adjust it at any time.',estimate:'Estimate a period',enter:'Enter myself',edit:'Edit',editDone:'Done',backup:'Back up',local:'Stored only on this device',
  open:'open',rekat:'Rekat',pray:'Pray with guidance',mark:'One prayer made up',less:'One less',more:'One more',toast:'{p} made up',undo:'Undo',counted:'{p} recorded · {n} still open',
  setupTitle:'Estimate a period',setupHint:'From reaching religious maturity until you began praying regularly.',years:'Years',months:'Months',share:'Roughly how much of it did you pray?',shares:['Nothing','A quarter','Half','Three quarters'],
  exempt:'Days per month without the duty to pray (e.g. menstruation)',witr:'Include Witr',perPrayer:'≈ {n} per prayer',total:'{n} in total',replace:'Replace',add:'Add',apply:'Apply',cancel:'Cancel',
  infoTitle:'In short',info:['You make up the five obligatory prayers (only the Farz part) and Witr, not the Sunna prayers.','In the Niyyah you say “the first” (or “the last”) missed noon prayer and so on. No date is needed.','Kaza is allowed at any time except at sunrise, zenith and sunset.','If more than six prayers are open, you do not need to keep an order.','If you do not know the exact number, your best estimate is enough.'],source:'Source',
  backupHint:'Copy this code to a safe place, for example your notes. To restore, paste the code here and load it.',copy:'Copy',copied:'Copied',load:'Load',loaded:'Loaded',bad:'The code is invalid.',close:'Close',
  niyyah:'Niyyah – Intention',niyet:'I have made the intention, for the sake of Allah’s pleasure, to make up the first {g} that I missed.',g:{sabah:'morning prayer',ogle:'noon prayer',ikindi:'afternoon prayer',aksam:'evening prayer',yatsi:'night prayer',vitir:'Witr prayer'},vitir:'Witr'},
 tr:{soon:'yakında',title:'Kaza',doneLabel:'kaza edildi',openOf:'{n} kaldı',openShort:'{n} kaldı',start:'Yeni',week:'bu hafta {n}',pace:'bu hızla yaklaşık {d}',allDone:'Hepsi kaza edildi. Allah kabul etsin.',
  emptyTitle:'Kaç namaz kaza etmek istiyorsun?',emptyHint:'Tahmin yeterli. İstediğin zaman değiştirebilirsin.',estimate:'Süreyi tahmin et',enter:'Kendim gireyim',edit:'Düzenle',editDone:'Tamam',backup:'Yedekle',local:'Sadece bu cihazda saklanır',
  open:'kaldı',rekat:'rekât',pray:'Rehberle kıl',mark:'Bir namaz kaza edildi',less:'Bir eksik',more:'Bir fazla',toast:'{p} kaza edildi',undo:'Geri al',counted:'{p} kaydedildi · {n} kaldı',
  setupTitle:'Süreyi tahmin et',setupHint:'Ergenlikten (mükellef olduğun andan) düzenli kılmaya başladığın zamana kadar.',years:'Yıl',months:'Ay',share:'Bu sürede yaklaşık ne kadarını kıldın?',shares:['Hiç','Dörtte bir','Yarısı','Dörtte üç'],
  exempt:'Ayda namaz borcu olmayan günler (ör. hayız)',witr:'Vitir dahil',perPrayer:'≈ vakit başına {n}',total:'toplam {n}',replace:'Değiştir',add:'Ekle',apply:'Uygula',cancel:'Vazgeç',
  infoTitle:'Kısaca',info:['Beş vaktin sadece farzları ve vitir kaza edilir, sünnetler edilmez.','Niyette “kılamadığım ilk” (veya “son”) öğle namazı vb. denir. Tarih gerekmez.','Kaza her zaman kılınabilir; sadece güneş doğarken, zeval ve güneş batarken kılınmaz.','Altıdan fazla kaza borcu varsa sıraya uymak gerekmez.','Sayıyı tam bilmiyorsan, en güçlü tahminin yeterlidir.'],source:'Kaynak',
  backupHint:'Bu kodu güvenli bir yere kopyala, örneğin notlarına. Geri yüklemek için kodu buraya yapıştırıp yükle.',copy:'Kopyala',copied:'Kopyalandı',load:'Yükle',loaded:'Yüklendi',bad:'Kod geçersiz.',close:'Kapat',
  niyet:'Niyet ettim Allah rızası için kılamadığım ilk {g} kaza etmeye',g:{sabah:'sabah namazının farzını',ogle:'öğle namazının farzını',ikindi:'ikindi namazının farzını',aksam:'akşam namazının farzını',yatsi:'yatsı namazının farzını',vitir:'vitir namazını'},vitir:'Vitir'},
 fr:{soon:'bientôt',title:'Qada',doneLabel:'rattrapées',openOf:'encore {n}',openShort:'{n} restantes',start:'Nouveau',week:'cette semaine {n}',pace:'à ton rythme vers {d}',allDone:'Tout est rattrapé. Qu’Allah l’accepte.',
  emptyTitle:'Combien de prières veux-tu rattraper ?',emptyHint:'Une estimation suffit. Tu peux l’ajuster à tout moment.',estimate:'Estimer une période',enter:'Saisir moi-même',edit:'Modifier',editDone:'Terminé',backup:'Sauvegarder',local:'Enregistré uniquement sur cet appareil',
  open:'restantes',rekat:'rakats',pray:'Prier avec le guide',mark:'Une prière rattrapée',less:'Une de moins',more:'Une de plus',toast:'{p} rattrapée',undo:'Annuler',counted:'{p} enregistrée · encore {n}',
  setupTitle:'Estimer une période',setupHint:'De la maturité religieuse jusqu’au moment où tu as prié régulièrement.',years:'Ans',months:'Mois',share:'Quelle part as-tu priée environ ?',shares:['Rien','Un quart','La moitié','Trois quarts'],
  exempt:'Jours par mois sans obligation de prier (p. ex. menstruation)',witr:'Inclure le witr',perPrayer:'≈ {n} par prière',total:'{n} au total',replace:'Remplacer',add:'Ajouter',apply:'Appliquer',cancel:'Annuler',
  infoTitle:'En bref',info:['On rattrape les cinq prières obligatoires (seulement le fard) et le witr, pas les sunnas.','Dans la niyya, tu dis « la première » (ou « la dernière ») prière de midi manquée, etc. Aucune date n’est nécessaire.','Le qada est permis à tout moment sauf au lever du soleil, au zénith et au coucher.','S’il reste plus de six prières, il n’est pas nécessaire de respecter l’ordre.','Si tu ne connais pas le nombre exact, ta meilleure estimation suffit.'],source:'Source',
  backupHint:'Copie ce code dans un endroit sûr, par exemple tes notes. Pour restaurer, colle le code ici et charge-le.',copy:'Copier',copied:'Copié',load:'Charger',loaded:'Chargé',bad:'Le code n’est pas valide.',close:'Fermer',
  niyet:'J’ai l’intention, pour la satisfaction d’Allah, de rattraper la première {g} que j’ai manquée.',g:{sabah:'prière de l’aube',ogle:'prière de midi',ikindi:'prière de l’après-midi',aksam:'prière du soir',yatsi:'prière de la nuit',vitir:'prière du witr'},vitir:'Witr'},
 es:{soon:'pronto',title:'Qada',doneLabel:'recuperadas',openOf:'quedan {n}',openShort:'quedan {n}',start:'Nuevo',week:'esta semana {n}',pace:'a tu ritmo hasta aprox. {d}',allDone:'Todo recuperado. Que Allah lo acepte.',
  emptyTitle:'¿Cuántas oraciones quieres recuperar?',emptyHint:'Basta con una estimación. Puedes ajustarla cuando quieras.',estimate:'Estimar un período',enter:'Introducir yo',edit:'Editar',editDone:'Listo',backup:'Copia de seguridad',local:'Guardado solo en este dispositivo',
  open:'quedan',rekat:'rakats',pray:'Rezar con guía',mark:'Una oración recuperada',less:'Una menos',more:'Una más',toast:'{p} recuperada',undo:'Deshacer',counted:'{p} registrada · quedan {n}',
  setupTitle:'Estimar un período',setupHint:'Desde la madurez religiosa hasta que empezaste a rezar con regularidad.',years:'Años',months:'Meses',share:'¿Cuánto rezaste aproximadamente?',shares:['Nada','Un cuarto','La mitad','Tres cuartos'],
  exempt:'Días al mes sin obligación de rezar (p. ej. menstruación)',witr:'Incluir el witr',perPrayer:'≈ {n} por oración',total:'{n} en total',replace:'Reemplazar',add:'Añadir',apply:'Aplicar',cancel:'Cancelar',
  infoTitle:'En resumen',info:['Se recuperan las cinco oraciones obligatorias (solo el fard) y el witr, no las sunnas.','En la niyya dices «la primera» (o «la última») oración del mediodía perdida, etc. No hace falta una fecha.','El qada se puede rezar siempre, salvo al salir el sol, en el cénit y al ponerse el sol.','Si quedan más de seis oraciones, no hace falta seguir un orden.','Si no sabes el número exacto, basta con tu mejor estimación.'],source:'Fuente',
  backupHint:'Copia este código en un lugar seguro, por ejemplo en tus notas. Para restaurar, pega el código aquí y cárgalo.',copy:'Copiar',copied:'Copiado',load:'Cargar',loaded:'Cargado',bad:'El código no es válido.',close:'Cerrar',
  niyet:'Tengo la intención, por la complacencia de Allah, de recuperar la primera {g} que no realicé.',g:{sabah:'oración del alba',ogle:'oración del mediodía',ikindi:'oración de la tarde',aksam:'oración de la puesta del sol',yatsi:'oración de la noche',vitir:'oración del witr'},vitir:'Witr'},
 ar:{soon:'قريبًا',title:'القضاء',doneLabel:'تم قضاؤها',openOf:'بقي {n}',openShort:'بقي {n}',start:'جديد',week:'هذا الأسبوع {n}',pace:'بهذا المعدل حتى {d} تقريبًا',allDone:'تم قضاء الكل. تقبّل الله.',
  emptyTitle:'كم صلاة تريد أن تقضي؟',emptyHint:'يكفي التقدير، ويمكنك تعديله في أي وقت.',estimate:'تقدير مدة',enter:'أُدخلها بنفسي',edit:'تعديل',editDone:'تم',backup:'نسخ احتياطي',local:'محفوظ على هذا الجهاز فقط',
  open:'متبقية',rekat:'ركعات',pray:'صلِّ مع الدليل',mark:'قُضيت صلاة',less:'واحدة أقل',more:'واحدة أكثر',toast:'قُضيت {p}',undo:'تراجع',counted:'سُجّلت {p} · بقي {n}',
  setupTitle:'تقدير مدة',setupHint:'من سن التكليف حتى بدأت تصلي بانتظام.',years:'سنوات',months:'أشهر',share:'كم صليت منها تقريبًا؟',shares:['لا شيء','الربع','النصف','ثلاثة أرباع'],
  exempt:'أيام في الشهر بلا وجوب صلاة (مثل الحيض)',witr:'مع الوتر',perPrayer:'≈ {n} لكل صلاة',total:'{n} إجمالًا',replace:'استبدال',add:'إضافة',apply:'تطبيق',cancel:'إلغاء',
  infoTitle:'باختصار',info:['تُقضى الصلوات الخمس المفروضة (الفرض فقط) والوتر، ولا تُقضى السنن.','في النية تقول «أول» (أو «آخر») صلاة ظهر فاتتني وهكذا، ولا حاجة إلى تاريخ.','يجوز القضاء في كل وقت إلا عند الشروق والزوال والغروب.','إذا كانت الفوائت أكثر من ست فلا يلزم الترتيب.','إن لم تعرف العدد بدقة فيكفي غالب ظنك.'],source:'المصدر',
  backupHint:'انسخ هذا الرمز إلى مكان آمن، مثل ملاحظاتك. للاستعادة الصق الرمز هنا ثم حمّله.',copy:'نسخ',copied:'تم النسخ',load:'تحميل',loaded:'تم التحميل',bad:'الرمز غير صالح.',close:'إغلاق',
  niyet:'نويت أن أقضي لله تعالى أول {g} فاتتني.',g:{sabah:'صلاة فجر',ogle:'صلاة ظهر',ikindi:'صلاة عصر',aksam:'صلاة مغرب',yatsi:'صلاة عشاء',vitir:'صلاة وتر'},vitir:'الوتر'}
};
const KAZA_HINT={...INTENTION_HINT,fr:SPRACHE_FR.INTENT.hint,es:SPRACHE_ES.INTENT.hint,ar:SPRACHE_AR.INTENT.hint};
const KAZA_NIYYAH={fr:SPRACHE_FR.INTENT.title,es:SPRACHE_ES.INTENT.title,ar:SPRACHE_AR.INTENT.title};
state.kaza={open:{},done:{},days:{},...state.kaza};
const kt=key=>(KAZA_TEXT[state.explanationLanguage]||KAZA_TEXT.de)[key];
const kzFill=(s,v)=>s.replace(/\{(\w)\}/g,(_,k)=>v[k]);
const kzNum=n=>new Intl.NumberFormat(SPRACH_REGION[state.explanationLanguage]||'de-DE').format(n);
const kzName=([k,tr])=>k==='vitir'?kt('vitir'):prayerLabel(tr)[0];

// Kaza-Routen: wie das jeweilige Farz/Vitir, nur mit Kaza-Niyet
SOURCES.kaza=['İslam ve İhsan · Kaza','https://www.islamveihsan.com/kaza-namazi-nasil-kilinir.html'];
for(const [k,tr,base,n] of KAZA){const id='kaza_'+k,key='kazaIntent_'+k,b=ROUTES[base];
 ROUTES[id]={...b,id,title:'Kaza · '+tr,subtitle:n+' rekât',seq:b.seq.map((s,i)=>i?s:{...s,key})};
 LIB[key]={...LIB[b.seq[0].key],id:key,title:'Niyet',lines:[kzFill(KAZA_TEXT.tr.niyet,{g:KAZA_TEXT.tr.g[k]})],note:INTENTION_HINT.tr,intention:true,intentRoute:id,source:'kaza'};
 for(const lang of ['de','en','fr','es','ar'])ERKLAERUNGEN[lang][key]={title:KAZA_TEXT[lang].niyyah||KAZA_NIYYAH[lang],lines:[kzFill(KAZA_TEXT[lang].niyet,{g:KAZA_TEXT[lang].g[k]})],note:KAZA_HINT[lang]};
 for(const lang of Object.keys(KAZA_TEXT))(ROUTE_NAMES[lang]??={})[id]=['Kaza · '+(k==='vitir'?KAZA_TEXT[lang].vitir:tr),n+' '+KAZA_TEXT[lang].rekat];}
const kzIsFarz=isFarz;isFarz=id=>(id.startsWith('kaza_')&&id!=='kaza_vitir')||kzIsFarz(id);

// Zählen
const kzSum=part=>KAZA.reduce((s,[k])=>s+(state.kaza[part][k]||0),0);
const kzDay=(d=new Date())=>d.toLocaleDateString('sv');
function kzMark(k,step=1){const z=state.kaza,day=kzDay();if(step>0&&!(z.open[k]>0))return false;
 z.open[k]=(z.open[k]||0)-step;z.done[k]=Math.max(0,(z.done[k]||0)+step);z.days[day]=Math.max(0,(z.days[day]||0)+step);
 const alt=kzDay(new Date(Date.now()-60*864e5));for(const d of Object.keys(z.days))if(d<alt)delete z.days[d];save();return true}
function kzSince(days){const from=kzDay(new Date(Date.now()-(days-1)*864e5));return Object.entries(state.kaza.days).reduce((s,[d,n])=>d>=from?s+n:s,0)}
function kzPace(open){const days=Object.keys(state.kaza.days).sort();if(!days.length||!open)return'';
 const span=Math.min(28,Math.round((Date.now()-new Date(days[0]+'T12:00').getTime())/864e5)+1);if(span<7)return'';
 const perDay=kzSince(span)/span;if(!perDay)return'';
 return kzFill(kt('pace'),{d:new Date(Date.now()+open/perDay*864e5).toLocaleDateString(SPRACH_REGION[state.explanationLanguage],{month:'long',year:'numeric'})})}

// Bildschirm
const KZ_ICON={play:'<path d="M8 5.8v12.4a.8.8 0 0 0 1.2.7l9.6-6.2a.8.8 0 0 0 0-1.4L9.2 5.1a.8.8 0 0 0-1.2.7z"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',minus:'<path d="M6 12h12"/>',plus:'<path d="M12 6v12M6 12h12"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.2"/>'};
const kzIcon=n=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+KZ_ICON[n]+'</svg>';
let kzEdit=false,kzPending=null,kzToastTimer=0,kzShare=0;
function kzButton(icon,label,fn,cls=''){const b=document.createElement('button');b.className='kaza-btn '+cls;b.innerHTML=kzIcon(icon);b.setAttribute('aria-label',label);b.title=label;b.onclick=fn;return b}
function openKaza(){kzEdit=false;show('kaza');drawKaza()}
function drawKaza(){kzHero();$('kazaList').replaceChildren(...KAZA.map(kzRow))}
function kzHero(){const open=kzSum('open'),done=kzSum('done'),empty=!open&&!done&&!kzEdit;
 document.querySelectorAll('[data-kz]').forEach(el=>el.textContent=kt(el.dataset.kz));
 $('kazaInfo').setAttribute('aria-label',kt('infoTitle'));
 $('kazaEmpty').hidden=!empty;$('kazaStats').hidden=empty;$('kazaSetup').hidden=empty;
 $('kazaDone').textContent=kzNum(done);
 $('kazaFill').style.width=(done+open?done/(done+open)*100:0)+'%';
 const week=kzSince(7),parts=open?[kzFill(kt('openOf'),{n:kzNum(open)})]:[kt('allDone')];
 if(open&&week)parts.push(kzFill(kt('week'),{n:kzNum(week)}));const pace=kzPace(open);if(pace)parts.push(pace);
 $('kazaSub').textContent=parts.join(' · ');
 $('kazaEdit').textContent=kt(kzEdit?'editDone':'edit');$('kazaEdit').classList.toggle('active',kzEdit)}
function kzRow(p){const [k,,,n]=p,c=state.kaza.open[k]||0,li=document.createElement('li');li.className='kaza-row'+(c||kzEdit?'':' is-zero');li.dataset.k=k;
 const name=document.createElement('div');name.className='kaza-name';name.append(Object.assign(document.createElement('strong'),{textContent:kzName(p)}),Object.assign(document.createElement('small'),{textContent:n+' '+kt('rekat')}));li.append(name);
 if(kzEdit){const input=Object.assign(document.createElement('input'),{type:'number',min:0,max:99999,inputMode:'numeric',value:c});input.setAttribute('aria-label',kzName(p)+' · '+kt('open'));
  const set=v=>{state.kaza.open[k]=Math.max(0,Math.min(99999,Math.round(v)||0));save();input.value=state.kaza.open[k];kzHero()};
  input.onchange=()=>set(+input.value);input.onfocus=()=>input.select();
  li.append(kzButton('minus',kt('less'),()=>set((state.kaza.open[k]||0)-1)),input,kzButton('plus',kt('more'),()=>set((state.kaza.open[k]||0)+1)));return li}
 const count=document.createElement('div');count.className='kaza-count';count.append(Object.assign(document.createElement('strong'),{textContent:kzNum(c)}),Object.assign(document.createElement('small'),{textContent:kt('open')}));
 const play=kzButton('play',kt('pray'),()=>configureRoute('kaza_'+k)),check=kzButton('check',kt('mark'),()=>kzCheck(p),'check');play.disabled=check.disabled=!c;
 li.append(count,play,check);return li}
function kzCheck(p){const k=p[0];if(!kzMark(k))return;drawKaza();kzPop(k);
 kzToast(kzFill(kt('toast'),{p:kzName(p)}),()=>{kzMark(k,-1);if(view==='kaza')drawKaza()})}
function kzPop(k){const row=document.querySelector('.kaza-row[data-k="'+k+'"]');if(!row)return;row.classList.remove('pop');void row.offsetWidth;row.classList.add('pop')}
function kzToast(text,undo){const el=$('kazaToast');$('kazaToastText').textContent=text;$('kazaUndo').textContent=kt('undo');
 $('kazaUndo').onclick=()=>{undo();el.classList.remove('show')};el.hidden=false;void el.offsetWidth;el.classList.add('show');
 clearTimeout(kzToastTimer);kzToastTimer=setTimeout(()=>el.classList.remove('show'),5000)}

// Zeitraum schätzen
function kzEstimate(){const months=(+$('kazaYears').value||0)*12+(+$('kazaMonths').value||0),exempt=Math.min(15,Math.max(0,+$('kazaExempt').value||0));
 return Math.max(0,Math.round(months*(30.44-exempt)*(1-kzShare/4)))}
function kzSetupDraw(){const per=kzEstimate(),n=$('kazaWitr').checked?6:5;
 $('kazaShares').querySelectorAll('button').forEach((b,i)=>{b.textContent=kt('shares')[i];b.setAttribute('aria-pressed',i===kzShare)});
 $('kazaPreview').textContent=kzFill(kt('perPrayer'),{n:kzNum(per)})+' · '+kzFill(kt('total'),{n:kzNum(per*n)});
 const has=kzSum('open')>0;$('kazaReplace').textContent=kt(has?'replace':'apply');$('kazaAdd').hidden=!has;$('kazaReplace').disabled=$('kazaAdd').disabled=!per}
function kzSetupApply(add){const per=kzEstimate();for(const [k] of KAZA){if(k==='vitir'&&!$('kazaWitr').checked){if(!add)state.kaza.open[k]=0;continue}state.kaza.open[k]=(add?state.kaza.open[k]||0:0)+per}
 save();$('kazaSetupSheet').close();kzEdit=false;drawKaza()}
$('kazaShares').replaceChildren(...[0,1,2,3].map(i=>button('',()=>{kzShare=i;kzSetupDraw()})));
for(const id of ['kazaYears','kazaMonths','kazaExempt','kazaWitr'])$(id).oninput=kzSetupDraw;
$('kazaReplace').onclick=()=>kzSetupApply(false);$('kazaAdd').onclick=()=>kzSetupApply(true);
const kzSheet=id=>{document.querySelectorAll('#'+id+' [data-kz]').forEach(el=>el.textContent=kt(el.dataset.kz));$(id).showModal()};
document.querySelectorAll('.kaza-sheet [data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
for(const d of document.querySelectorAll('.kaza-sheet'))d.addEventListener('click',e=>{if(e.target===d)d.close()});
function kzOpenSetup(){kzSetupDraw();kzSheet('kazaSetupSheet')}

// Info und Sicherung
function kzOpenInfo(){$('kazaInfoList').replaceChildren(...kt('info').map(s=>Object.assign(document.createElement('li'),{textContent:s})));$('kazaSource').textContent=kt('source')+': İslam ve İhsan';$('kazaSource').href=SOURCES.kaza[1];kzSheet('kazaInfoSheet')}
const kzCode=()=>btoa(unescape(encodeURIComponent(JSON.stringify({sajdaKaza:1,open:state.kaza.open,done:state.kaza.done}))));
function kzOpenBackup(){$('kazaCode').value=kzCode();$('kazaBackupStatus').textContent='';kzSheet('kazaBackupSheet')}
$('kazaCopy').onclick=async()=>{try{await navigator.clipboard.writeText($('kazaCode').value)}catch{$('kazaCode').select();document.execCommand('copy')}$('kazaBackupStatus').textContent=kt('copied')};
$('kazaLoad').onclick=()=>{try{const d=JSON.parse(decodeURIComponent(escape(atob($('kazaCode').value.trim()))));if(d.sajdaKaza!==1)throw 0;
 const clean=o=>Object.fromEntries(KAZA.map(([k])=>[k,Math.max(0,Math.round(+o?.[k]||0))]));state.kaza.open=clean(d.open);state.kaza.done=clean(d.done);save();drawKaza();$('kazaBackupStatus').textContent=kt('loaded')}
 catch{$('kazaBackupStatus').textContent=kt('bad')}};

$('kazaInfo').innerHTML=kzIcon('info');$('kazaInfo').onclick=kzOpenInfo;
$('kazaEstimate').onclick=kzOpenSetup;$('kazaSetup').onclick=kzOpenSetup;$('kazaEnter').onclick=()=>{kzEdit=true;drawKaza()};
$('kazaEdit').onclick=()=>{kzEdit=!kzEdit;drawKaza()};$('kazaBackup').onclick=kzOpenBackup;

// Nach einem angeleiteten Kaza-Gebet automatisch eintragen
const kzStart=start;start=function(id){kzPending=String(id).startsWith('kaza_')?id:null;return kzStart.apply(this,arguments)};
const kzRender=render;render=function(){kzRender();if(view!=='done'||!kzPending||route?.id!==kzPending)return;const p=KAZA.find(([k])=>'kaza_'+k===kzPending);kzPending=null;
 if(kzMark(p[0]))kzToast(kzFill(kt('counted'),{p:kzName(p),n:kzNum(state.kaza.open[p[0]])}),()=>kzMark(p[0],-1))};

// Startseite: Kaza-Kachel vor den „Bald“-Kacheln, auch in der Rekat-Ansicht
const kzHome=drawHomeChoices;drawHomeChoices=function(){kzHome();const bald=$('baldBereich');if(!bald)return;const rekat=bald.hidden;bald.hidden=false;
 for(const k of bald.querySelectorAll('.bald-kachel:not(.kaza-kachel)')){k.hidden=rekat;k.querySelector('.bald-marke').textContent=kt('soon')}
 const open=kzSum('open'),b=document.createElement('button');b.className='bald-kachel kaza-kachel';
 b.append(Object.assign(document.createElement('strong'),{textContent:kt('title')}),Object.assign(document.createElement('span'),{className:'bald-marke',textContent:open?kzFill(kt('openShort'),{n:kzNum(open)}):kt('start')}));
 b.onclick=openKaza;bald.prepend(b)};
const kzLanguage=applyLanguage;applyLanguage=function(){kzLanguage();$('kazaToast').classList.remove('show');if(view==='kaza')drawKaza()};
