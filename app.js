(()=>{
const K='treino4-data-v1';
const W=[
['peito','Peito + Tríceps',[['walk1','Caminhada inicial',1,'10 min',''],['abs','Abdominais',3,'30',''],['burp','Burpees',3,'1 min',''],['sup','Supino máquina',4,'12','40'],['push','Flexão de braço',4,'10',''],['tri','Tríceps corda',4,'15','20'],['walk2','Caminhada final',1,'10 min','']]],
['pernas','Pernas',[['walk','Caminhada',1,'10 min','5 km/h'],['ext','Cadeira extensora unilateral',4,'10','10'],['flex','Cadeira flexora',4,'12','32'],['leg','Leg press 45°',4,'10','100'],['calf','Panturrilha sentada',4,'15','25'],['adutora','Cadeira adutora',4,'12','32']]],
['costas','Costas + Bíceps',[['walk','Caminhada',1,'20 min','5,5 km/h'],['pull','Puxador frente',4,'12','30'],['row','Remada sentada',4,'12','32'],['peck','Peck deck invertido',4,'12','15'],['curl','Rosca alternada',4,'12','12'],['scott','Rosca Scott',4,'12','20']]],
['ombros','Ombros + Trapézio',[['warm','Abdução ombro — aquecimento',4,'10','baixo'],['lat','Abdução de ombro',4,'12','8'],['dev','Desenvolvimento máquina',4,'10','15'],['calf','Panturrilha sentada',4,'15','20'],['shrug','Encolhimento de ombros',4,'15','20'],['bike','Bike',1,'20 min','']]]
].map(x=>({id:x[0],name:x[1],ex:x[2].map(e=>({id:e[0],name:e[1],sets:e[2],reps:e[3],load:e[4]}))}));
const seed=[
{id:'s-20260816',date:'2026-08-16',workoutId:'peito',workoutName:'Peito + Tríceps',items:[{exerciseId:'sup',name:'Supino máquina',load:'40',reps:['12','12','12','12']},{exerciseId:'tri',name:'Tríceps corda',load:'15',reps:['12','12','12','12']}]},
{id:'s-20260818',date:'2026-08-18',workoutId:'pernas',workoutName:'Pernas',items:[{exerciseId:'leg',name:'Leg press 45°',load:'100',reps:['10','10','10','10']},{exerciseId:'flex',name:'Cadeira flexora',load:'32',reps:['12','12','12','12']}]},
{id:'s-20260819',date:'2026-08-19',workoutId:'costas',workoutName:'Costas + Bíceps',items:[{exerciseId:'pull',name:'Puxador frente',load:'30',reps:['12','12','12','12']},{exerciseId:'row',name:'Remada sentada',load:'32',reps:['12','12','12','12']},{exerciseId:'scott',name:'Rosca Scott',load:'20',reps:['12','12','12','12']}]},
{id:'s-20260821',date:'2026-08-21',workoutId:'peito',workoutName:'Peito + Tríceps',items:[{exerciseId:'sup',name:'Supino máquina',load:'40',reps:['12','12','12','12']},{exerciseId:'tri',name:'Tríceps corda',load:'15',reps:['15','15','15','15']}]},
{id:'s-20260822',date:'2026-08-22',workoutId:'ombros',workoutName:'Ombros + Trapézio',items:[{exerciseId:'lat',name:'Abdução de ombro',load:'8',reps:['12','12','12','12']},{exerciseId:'dev',name:'Desenvolvimento máquina',load:'15',reps:['10','10','10','10']}]},
{id:'s-20260826',date:'2026-08-26',workoutId:'peito',workoutName:'Peito + Tríceps',items:[{exerciseId:'abs',name:'Abdominais',load:'',reps:['30','30','30']},{exerciseId:'burp',name:'Burpees',load:'',reps:['16','20','20']},{exerciseId:'sup',name:'Supino máquina',load:'40',reps:['12','12','12','12']},{exerciseId:'tri',name:'Tríceps corda',load:'20',reps:['15','15','15','15']}]}
];
let s;try{s=JSON.parse(localStorage.getItem(K))}catch{}if(!s||!Array.isArray(s.sessions))s={sessions:seed,manualNext:null};
s.custom||={};s.draft||=null;s.theme||='dark';
if(!s.sessions.some(x=>x.id==='s-20260826'))s.sessions.push(seed.at(-1));
if(s.draft){s.draft.v||={};s.draft.checks||={};}
let active=s.draft?.workoutId||null,timer=null,left=45,prompt;
const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)],save=()=>localStorage.setItem(K,JSON.stringify(s));
const fmt=d=>d.split('-').reverse().join('/'),today=()=>new Date().toISOString().slice(0,10),esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
function work(id){let b=W.find(x=>x.id===id);return {...b,ex:[...b.ex,...(s.custom[id]||[])]}}
function latest(){return[...s.sessions].sort((a,b)=>a.date.localeCompare(b.date)).at(-1)}
function next(){if(s.manualNext)return s.manualNext;let l=latest();if(!l)return W[0].id;let i=W.findIndex(x=>x.id===l.workoutId);return W[(i+1)%4].id}
function lastPerf(wid,eid){for(let q of [...s.sessions].filter(x=>x.workoutId===wid).sort((a,b)=>b.date.localeCompare(a.date))){let z=(q.items||[]).find(i=>i.exerciseId===eid);if(z)return z}return null}
function num(v){return /^\d+([.,]\d+)?$/.test(String(v??'').trim())?+String(v).replace(',','.'):null}
function repTotal(reps){return (reps||[]).reduce((a,v)=>a+(num(v)??0),0)}
function personalRecord(wid,eid){
  let best=null;
  for(const q of s.sessions.filter(x=>x.workoutId===wid)){
    const it=(q.items||[]).find(i=>i.exerciseId===eid);if(!it)continue;
    const load=num(it.load), reps=repTotal(it.reps);
    const candidate={...it,date:q.date,loadNum:load,repsTotal:reps};
    if(!best){best=candidate;continue}
    if(load!==null && best.loadNum!==null){if(load>best.loadNum||(load===best.loadNum&&reps>best.repsTotal))best=candidate}
    else if(load!==null && best.loadNum===null)best=candidate;
    else if(load===null && best.loadNum===null && reps>best.repsTotal)best=candidate;
  }
  return best;
}
function recordText(r){if(!r)return'';if(r.loadNum!==null)return`🏆 Recorde: ${r.load} kg · ${(r.reps||[]).join('/')}`;if(r.repsTotal>0)return`🏆 Recorde: ${r.repsTotal} reps`;return''}
function applyTheme(){document.body.classList.toggle('light',s.theme==='light');const b=$('#theme');if(b){b.textContent=s.theme==='light'?'🌙':'☀️';b.title=s.theme==='light'?'Usar visual escuro':'Usar visual claro'}const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=s.theme==='light'?'#f3f5f8':'#0b1020'}
function show(v){$$('.view').forEach(x=>x.classList.toggle('on',x.id===v));$$('nav button').forEach(x=>x.classList.toggle('on',x.dataset.v===v));if(v==='home')home();if(v==='work')chooser();if(v==='report')report();if(v==='history')history()}
$$('nav button').forEach(b=>b.onclick=()=>show(b.dataset.v));
$('#theme').onclick=()=>{s.theme=s.theme==='light'?'dark':'light';save();applyTheme()};
function home(){let n=work(next()),l=latest();$('#today').textContent=n.name;$('#last').textContent=s.draft?'Treino em andamento: '+work(s.draft.workoutId).name:l?'Último: '+l.workoutName+' em '+fmt(l.date):'Sem treino concluído';$('#start').textContent=s.draft?'Continuar treino':'Começar treino';$('#count').textContent=s.sessions.length;$('#lastDate').textContent=l?fmt(l.date).slice(0,5):'—';$('#seq').innerHTML=W.map((w,i)=>`<div class="item"><div><b>${i+1}. ${w.name}</b><small>${work(w.id).ex.length} exercícios</small></div><span class="badge">${w.id===next()?'HOJE':''}</span></div>`).join('')}
$('#change').onclick=()=>{let i=W.findIndex(x=>x.id===next());s.manualNext=W[(i+1)%4].id;save();home()};
$('#start').onclick=()=>start(s.draft?.workoutId||next(),!!s.draft);
function chooser(){if(active)return render();$('#choose').hidden=false;$('#active').hidden=true;$('#choose').innerHTML='<h2>Treinos</h2>'+W.map(w=>`<button class="item" data-w="${w.id}" style="width:100%;text-align:left"><b>${w.name}</b><span class="badge">${s.draft?.workoutId===w.id?'CONTINUAR':'Abrir'}</span></button>`).join('');$$('[data-w]').forEach(b=>b.onclick=()=>start(b.dataset.w,s.draft?.workoutId===b.dataset.w))}
function start(id,resume){active=id;if(!resume||!s.draft||s.draft.workoutId!==id)s.draft={workoutId:id,date:today(),v:{},checks:{}};s.draft.v||={};s.draft.checks||={};save();show('work');render()}
const key=(e,f,i)=>`${e}|${f}|${i}`,ckey=(e,i)=>`${e}|${i}`;
function val(e,f,i){let k=key(e.id,f,i);if(k in(s.draft?.v||{}))return s.draft.v[k];let p=lastPerf(active,e.id);return f==='reps'?(p?.reps?.[i]??e.reps):(p?.load??e.load)}
function setSaved(){save();$('#saved').textContent='Salvo agora';clearTimeout(setSaved.t);setSaved.t=setTimeout(()=>$('#saved').textContent='Salvamento automático ativo',900)}
function stepField(inp,delta){
  const raw=String(inp.value||'').trim().replace(',','.');
  const m=raw.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  let n=m?+m[1]:0;n=Math.max(0,n+delta);
  let out=Number.isInteger(n)?String(n):String(Math.round(n*10)/10).replace('.',',');
  if(m&&m[2])out+=m[2];inp.value=out;inp.dispatchEvent(new Event('input',{bubbles:true}));
}
function render(){let w=work(active);$('#choose').hidden=true;$('#active').hidden=false;$('#wt').textContent=w.name;$('#elist').innerHTML=w.ex.map(e=>{let p=lastPerf(w.id,e.id),pr=personalRecord(w.id,e.id);return`<article class="ex"><div class="exhead"><div><h3>${esc(e.name)}</h3><small>${p?`Última: ${p.load?p.load+' kg · ':''}${(p.reps||[]).join('/')}`:'Sem histórico'}</small>${pr?`<small class="record">${esc(recordText(pr))}</small>`:''}</div>${e.id.startsWith('c_')?`<button class="danger" data-r="${e.id}">Remover</button>`:''}</div>${Array.from({length:+e.sets||1},(_,i)=>{let checked=!!s.draft?.checks?.[ckey(e.id,i)];return`<div class="set ${checked?'done':''}" data-setrow="${e.id}|${i}"><button class="seriescheck ${checked?'on':''}" data-c="${e.id}" data-ci="${i}" aria-label="Concluir série ${i+1}">${checked?'✓':''}</button><small>${i+1}ª</small><div class="field"><label>Carga</label><div class="stepper"><button data-step="-1" data-target="load-${e.id}-${i}">−</button><input id="load-${e.id}-${i}" data-e="${e.id}" data-f="load" data-i="${i}" value="${esc(val(e,'load',i))}" placeholder="kg" inputmode="decimal"><button data-step="1" data-target="load-${e.id}-${i}">+</button></div></div><div class="field"><label>Reps</label><div class="stepper"><button data-step="-1" data-target="reps-${e.id}-${i}">−</button><input id="reps-${e.id}-${i}" data-e="${e.id}" data-f="reps" data-i="${i}" value="${esc(val(e,'reps',i))}" placeholder="reps" inputmode="decimal"><button data-step="1" data-target="reps-${e.id}-${i}">+</button></div></div></div>`}).join('')}</article>`}).join('');
  $$('[data-e]').forEach(i=>i.oninput=()=>{s.draft.v[key(i.dataset.e,i.dataset.f,i.dataset.i)]=i.value;setSaved()});
  $$('[data-step]').forEach(b=>b.onclick=()=>{let inp=document.getElementById(b.dataset.target);if(inp)stepField(inp,+b.dataset.step)});
  $$('[data-c]').forEach(b=>b.onclick=()=>{let k=ckey(b.dataset.c,b.dataset.ci),now=!s.draft.checks[k];s.draft.checks[k]=now;setSaved();b.classList.toggle('on',now);b.textContent=now?'✓':'';b.closest('.set')?.classList.toggle('done',now);if(now)startTimer(45)});
  $$('[data-r]').forEach(b=>b.onclick=()=>{s.custom[active]=(s.custom[active]||[]).filter(x=>x.id!==b.dataset.r);save();render()})
}
$('#add').onclick=()=>{let n=$('#ename').value.trim();if(!n)return alert('Digite o nome do exercício.');(s.custom[active]||=[]).push({id:'c_'+Date.now(),name:n,sets:Math.max(1,Math.min(10,+$('#esets').value||4)),reps:$('#ereps').value||'12',load:$('#eload').value||''});save();$('#ename').value='';$('#eload').value='';render()};
$('#leave').onclick=()=>{active=null;show('home')};
$('#discard').onclick=()=>{if(confirm('Descartar este treino em andamento?')){s.draft=null;active=null;save();show('home')}};
$('#finish').onclick=()=>{let w=work(active),items=w.ex.map(e=>({exerciseId:e.id,name:e.name,load:val(e,'load',0),reps:Array.from({length:+e.sets||1},(_,i)=>val(e,'reps',i))}));s.sessions.push({id:'s'+Date.now(),date:s.draft.date,workoutId:w.id,workoutName:w.name,items});s.draft=null;s.manualNext=null;active=null;save();alert('Treino concluído e salvo.');show('home')};
function draw(){$('#clock').textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0')}
function startTimer(sec){clearInterval(timer);left=sec;draw();$$('[data-t]').forEach(b=>b.classList.toggle('active',+b.dataset.t===sec));timer=setInterval(()=>{left--;draw();if(left<=0){clearInterval(timer);timer=null;$$('[data-t]').forEach(b=>b.classList.remove('active'));navigator.vibrate?.([120,80,120]);alert('Descanso concluído.')}},1000)}
$$('[data-t]').forEach(b=>b.onclick=()=>startTimer(+b.dataset.t));
function history(){$('#hist').innerHTML=[...s.sessions].sort((a,b)=>b.date.localeCompare(a.date)).map(x=>{let sum=(x.items||[]).filter(i=>i.load).slice(0,3).map(i=>`${i.name}: ${i.load} kg`).join(' · ');return`<div class="item"><div><b>${x.workoutName}</b><small>${fmt(x.date)}${sum?' · '+sum:''}</small></div></div>`}).join('')}
function report(){let d=new Date();d.setDate(d.getDate()-30);$('#total').textContent=s.sessions.length;$('#month').textContent=s.sessions.filter(x=>x.date>=d.toISOString().slice(0,10)).length;let m={};s.sessions.forEach(q=>(q.items||[]).forEach(i=>{if(!/^\d+([.,]\d+)?$/.test(i.load||''))return;(m[i.name]||=[]).push({d:q.date,l:+i.load.replace(',','.')})}));$('#progress').innerHTML=Object.entries(m).map(([n,p])=>`<div class="progress"><b>${esc(n)}</b><small>${p[0].l} → ${p.at(-1).l} kg · ${p.slice(-5).map(x=>fmt(x.d).slice(0,5)+': '+x.l).join(' · ')}</small></div>`).join('')||'<p class="muted">As cargas aparecerão aqui conforme você treinar.</p>'}
$('#export').onclick=()=>{let u=URL.createObjectURL(new Blob([JSON.stringify(s,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download='treino4-backup-'+today()+'.json';a.click();URL.revokeObjectURL(u)};
$('#import').onchange=async e=>{try{let x=JSON.parse(await e.target.files[0].text());if(!Array.isArray(x.sessions))throw 0;s=x;s.custom||={};s.draft||=null;s.theme||='dark';if(s.draft){s.draft.v||={};s.draft.checks||={}}save();active=s.draft?.workoutId||null;applyTheme();alert('Backup importado.');show('home')}catch{alert('Backup inválido.')}};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;$('#install').hidden=false;$('#install').onclick=async()=>{prompt.prompt();await prompt.userChoice;prompt=null;$('#install').hidden=true}});
window.addEventListener('appinstalled',()=>$('#install').hidden=true);
document.addEventListener('visibilitychange',()=>document.hidden&&save());window.addEventListener('pagehide',save);
if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(console.error);
applyTheme();draw();home();
})();