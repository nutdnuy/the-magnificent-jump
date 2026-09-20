import {sampleVG,moments,clockPath,histogram,normalDensity} from './vg-math.mjs';
const definitions=[
 {title:'Heavy tails · หางหนาต่างจากความผันผวนอย่างไร?',task:'ลองเพิ่ม ν จาก 0 เป็น 1 โดยคง σ ไว้ แล้วดูโอกาสที่ |X| เกิน 3 เท่าของ SD แม้ variance จะเท่ากัน หางของสองแบบจำลองก็ไม่จำเป็นต้องเหมือนกัน',controls:[['nu','Clock variance ν',0,1,.05,.4],['cut','Tail threshold · เท่าของ SD',2,4,.25,3]],presets:[['Normal limit',{nu:0}],['Thicker tails',{nu:1}]]},
 {title:'Random clock · เวลาเท่ากัน แต่เดินไม่เท่ากัน',task:'เลื่อน Observation เพื่อดูทีละช่วง สังเกตช่วงที่ ΔG ใหญ่และขนาด ΔX จากนั้นลอง ν = 0 เพื่อกลับสู่นาฬิกาปกติ',controls:[['nu','Clock variance ν',0,1,.05,.4],['step','Observation · จุดเวลา',1,120,1,60]],presets:[['Regular clock',{nu:0}],['Random clock',{nu:.4}]]},
 {title:'Shape explorer · ปรับรูปทรงของ Variance Gamma',task:'เริ่มจาก θ = 0 แล้วลองค่าลบและค่าบวก ดูทั้งตำแหน่งค่าเฉลี่ยและความเบ้ จากนั้นเพิ่ม σ เพื่อแยกผลของความกว้างออกจากความเบ้',controls:[['theta','Drift θ',-.3,.3,.025,0],['sigma','Brownian scale σ',.1,.4,.025,.2],['nu','Clock variance ν',0,1,.05,.4]],presets:[['Left skew',{theta:-.2}],['Symmetric',{theta:0}],['Right skew',{theta:.2}]]}
];
const fmt=(x,d=3)=>Math.abs(x)<.5*10**(-d)?(0).toFixed(d):x.toFixed(d);
const fine=x=>x!==0&&Math.abs(x)<1e-5?x.toExponential(2):fmt(x,5);
const metric=(label,value)=>`<div><dt>${label}</dt><dd>${value}</dd></div>`;
function chart({series,min,max,ymin=0,ymax,xlabel,ylabel,bars=false,marker,tail}){
 const W=680,H=320,L=62,R=20,T=32,B=54,x=v=>L+(v-min)/(max-min)*(W-L-R),y=v=>H-B-(v-ymin)/(ymax-ymin)*(H-T-B);
 let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${ylabel}; ${xlabel}"><title>${ylabel} versus ${xlabel}</title>`;
 for(let i=0;i<=4;i++){const v=ymin+(ymax-ymin)*i/4;svg+=`<line class="grid" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end">${fmt(v,2)}</text>`;}
 for(let i=0;i<=4;i++){const v=min+(max-min)*i/4;svg+=`<text x="${x(v)}" y="${H-B+23}" text-anchor="middle">${fmt(v,2)}</text>`;}
 svg+=`<text x="${L}" y="18">${ylabel}</text><text x="${W/2}" y="${H-8}" text-anchor="middle">${xlabel}</text>`;
 series.forEach((points,i)=>{
 if(bars&&i===0){const width=(W-L-R)/points.length;for(const [a,b] of points)svg+=`<rect class="vg-bar" style="opacity:${tail===undefined?.65:Math.abs(a)>tail?.95:.3}" x="${x(a)-width/2}" y="${y(b)}" width="${Math.max(1,width-1)}" height="${Math.max(0,y(0)-y(b))}"/>`;}
 else svg+=`<path class="${i?'vg-benchmark':'vg-series'}" d="${points.map(([a,b],j)=>`${j?'L':'M'}${x(a).toFixed(2)},${y(b).toFixed(2)}`).join(' ')}"/>`;
 });
 if(tail!==undefined)for(const edge of [-tail,tail])svg+=`<line x1="${x(edge)}" x2="${x(edge)}" y1="${T}" y2="${H-B}" stroke="currentColor" stroke-dasharray="3 4"/>`;
 if(marker!==undefined)svg+=`<line x1="${x(marker)}" x2="${x(marker)}" y1="${T}" y2="${H-B}" stroke="currentColor" stroke-dasharray="3 4"/>`;
 return svg+'</svg>';
}
for(const host of document.querySelectorAll('[data-vg-lab]')){
 const kind=Number(host.dataset.vgLab),def=definitions[kind],state=Object.fromEntries(def.controls.map(([key,,,,,value])=>[key,value]));
 let seed=20260920,cacheKey='',cache;
 host.innerHTML=`<p class="vg-eyebrow">INTERACTIVE VIZ · เนื้อหาเสริม</p><h2 id="interactive-viz">${def.title}</h2><p class="vg-task">${def.task}</p><div class="vg-controls">${def.controls.map(([key,label,min,max,step,value])=>`<label class="vg-control" for="vg-${key}"><span>${label}<output id="out-${key}" for="vg-${key}">${value}</output></span><input id="vg-${key}" data-key="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`).join('')}</div><div class="vg-buttons">${def.presets.map(([label],i)=>`<button type="button" data-preset="${i}">${label}</button>`).join('')}${kind===1?'<button type="button" data-action="jump">Largest clock step · ช่วงที่ ΔG ใหญ่สุด</button>':''}<button type="button" data-action="resample">New sample · สุ่มใหม่</button><button type="button" data-action="reset">Reset · เริ่มใหม่</button></div><div class="vg-legend"><span>${kind===1?'Gamma clock G(t) / VG X(t)':'VG · simulated histogram'}</span><span>${kind===1?'Regular clock t / Brownian comparator':'Normal · same mean and variance'}</span></div><div class="vg-plot" tabindex="0" role="group" aria-label="กราฟหลัก เลื่อนแนวนอนบนจอเล็ก"></div>${kind===1?'<div class="vg-plot vg-second" tabindex="0" role="group" aria-label="กราฟการเคลื่อนไหว เลื่อนแนวนอนบนจอเล็ก"></div>':''}<dl class="vg-metrics"></dl><p class="vg-status" role="status" aria-live="polite"></p><details><summary>Model & reading guide · วิธีอ่านและสมมติฐาน</summary><p>${kind===1?'จำลอง 120 ช่วงในเวลา T = 1; ΔG ~ Gamma(Δt/ν, ν), ΔX = 0.2√ΔG Z เส้นเชื่อมแสดงค่าที่จุดเวลา ไม่ใช่เส้นทางต่อเนื่องจริงของ jump process เส้น Brownian ใช้ Z ชุดเดียวกันเพื่อเทียบผลของนาฬิกา แต่ไม่ใช่ Brownian เส้นเดียวกันที่นำมาอ่านต่างเวลา':'จำลอง X(T) = θG(T) + σ√G(T)Z จำนวน 24,000 ค่า โดย G(T) ~ Gamma(T/ν, ν), Z ~ Normal(0,1) และเป็นอิสระกัน เส้นประคือ Normal ที่มี mean และ variance เท่ากับ VG ตามทฤษฎี แท่งเป็นความหนาแน่นจากตัวอย่างสุ่ม ไม่ใช่เส้นความหนาแน่นแบบ exact'}.</p><p>T = 1 หน่วยเวลา, E[G(t)] = t, Var[G(t)] = νt; ν = 0 ใช้ขีดจำกัด G(t) = t. X เป็นองค์ประกอบ log-return หน่วยทศนิยม ไม่ใช่ราคาสินทรัพย์หรือ simple return. ${kind===0?'กำหนด θ = 0 และ σ = 0.2; SD = 0.2 คงที่.':''} ผลทั้งหมดเป็นแบบจำลองสมมติ ไม่ใช่ข้อมูลตลาดหรือการประเมินราคาออปชัน</p><p>ใช้ seed เดิมเมื่อปรับค่าเพื่อให้ทำซ้ำได้ การปรับพารามิเตอร์อาจเปลี่ยนลำดับการสุ่ม Gamma จึงไม่ใช่การจับคู่ตัวอย่างแบบหนึ่งต่อหนึ่ง กด New sample เพื่อดู sampling noise และ Reset เพื่อกลับค่าเริ่มต้น</p><p>อ้างอิง: <a href="https://engineering.nyu.edu/sites/default/files/2018-09/CarrEuropeanFinReview1998.pdf">Madan, Carr & Chang (1998), §2</a></p></details><p class="vg-method"></p>`;
 const plot=host.querySelector('.vg-plot'),metrics=host.querySelector('.vg-metrics'),status=host.querySelector('.vg-status');
 function render(){
 for(const [key] of def.controls){host.querySelector(`#vg-${key}`).value=state[key];host.querySelector(`#out-${key}`).textContent=fmt(state[key],key==='step'?0:3);}
 if(kind===1){
 const key=`${state.nu}:${seed}`;if(key!==cacheKey){cache=clockPath(state.nu,seed);cacheKey=key;}
 const rows=cache,r=rows[state.step],ymax=Math.max(1,...rows.map(p=>p.g))*1.08;
 plot.innerHTML=chart({series:[rows.map(p=>[p.t,p.g]),rows.map(p=>[p.t,p.t])],min:0,max:1,ymax,xlabel:'Calendar time t',ylabel:'Clock time G(t)',marker:r.t});
 const bound=Math.max(.2,...rows.flatMap(p=>[Math.abs(p.x),Math.abs(p.b)]))*1.1;
 host.querySelector('.vg-second').innerHTML=chart({series:[rows.map(p=>[p.t,p.x]),rows.map(p=>[p.t,p.b])],min:0,max:1,ymin:-bound,ymax:bound,xlabel:'Calendar time t',ylabel:'X(t) · decimal units',marker:r.t});
 metrics.innerHTML=metric('Calendar time t',fmt(r.t))+metric('Clock time G(t)',fmt(r.g))+metric('Selected ΔG',fine(r.dg))+metric('Selected ΔX',fine(r.dx));
 status.textContent=`จุดที่ ${state.step}/120: นาฬิกาปฏิทินเดิน ${fmt(1/120,5)} แต่นาฬิกาสุ่มเดิน ${fine(r.dg)} หน่วยเวลา ช่วงที่ ΔG ใหญ่มีความแปรปรวนแบบมีเงื่อนไขของ ΔX มากขึ้น แต่ไม่ได้แปลว่า ΔX ต้องมากทุกครั้ง เพราะยังขึ้นกับ Z`;
 }else{
 const theta=state.theta??0,sigma=state.sigma??.2,nu=state.nu,m=moments(theta,sigma,nu),key=`${theta}:${sigma}:${nu}:${seed}`;
 if(key!==cacheKey){cache=sampleVG({theta,sigma,nu,seed});cacheKey=key;}
 // Fixed domain across controls makes width/shift comparisons meaningful.
 const min=kind===0?-1:-2.4,max=kind===0?1:2.4,h=histogram(cache,min,max,kind===0?64:96),line=Array.from({length:241},(_,i)=>{const x=min+(max-min)*i/240;return [x,normalDensity(x,m.mean,m.sd)];});
 plot.innerHTML=chart({series:[h.points,line],min,max,ymax:Math.max(...h.points.map(p=>p[1]),...line.map(p=>p[1]))*1.12,xlabel:'X(T) · decimal log-return component',ylabel:'Probability density',bars:true,tail:kind===0?state.cut*m.sd:undefined});
 if(kind===0){
 const count=cache.filter(v=>Math.abs(v)>state.cut*m.sd).length,p=count/cache.length,se=Math.sqrt(p*(1-p)/cache.length),normalTail=2*normalSurvival(state.cut);
 metrics.innerHTML=metric('VG tail · sample',fmt(100*p,2)+'%')+metric('Normal tail · theory',fmt(100*normalTail,3)+'%')+metric('Variance · theory',fmt(m.variance,3))+metric('Excess kurtosis · theory',fmt(m.excess,2));
 status.textContent=`เส้นตั้งคือเกณฑ์ |X| > ${fmt(state.cut*m.sd,2)} (แท่งเข้มใช้จุดกึ่งกลาง bin): พบ ${count.toLocaleString()} จาก 24,000 ตัวอย่าง ค่า VG tail มี sampling SE ≈ ${fmt(100*se,3)} จุดเปอร์เซ็นต์ เมื่อ ν = 0 แบบจำลองเป็น Normal แต่ค่าประมาณจากตัวอย่างยังแกว่งได้`;
 }else{
 metrics.innerHTML=metric('Mean · theory',fmt(m.mean))+metric('SD · theory',fmt(m.sd))+metric('Skewness · theory',fmt(m.skew))+metric('Excess kurtosis · theory',fmt(m.excess,2));
 status.textContent=`${theta===0?'θ = 0: รูปทรงสมมาตรตามทฤษฎี':theta<0?'θ < 0: ค่าเฉลี่ยติดลบ และความเบ้ติดลบเมื่อ ν > 0':'θ > 0: ค่าเฉลี่ยเป็นบวก และความเบ้เป็นบวกเมื่อ ν > 0'} ค่า mean = θT และ variance = (σ² + θ²ν)T ดังนั้นการเปลี่ยน θ อาจเปลี่ยนทั้งตำแหน่ง ความกว้าง และความเบ้`;
 }
 host.querySelector('.vg-method').textContent=`Simulation · T = 1 · n = 24,000 · seed ${seed} · นอกขอบกราฟ ${h.outside} ค่า (${fmt(h.outside/240,2)}%) ไม่ปรับแท่งให้รวมเป็น 100% เฉพาะช่วงที่แสดง · แกน X คงที่ แกน Y ปรับตามข้อมูล`;
 }
 if(kind===1)host.querySelector('.vg-method').textContent=`Simulation · T = 1 · 120 intervals · σ = 0.2 · θ = 0 · seed ${seed} · แกน Y ปรับตามเส้นทางที่สุ่ม`;
 }
 host.addEventListener('input',e=>{if(e.target.dataset.key){state[e.target.dataset.key]=Number(e.target.value);render();}});
 host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.preset!==undefined)Object.assign(state,def.presets[Number(b.dataset.preset)][1]);else if(b.dataset.action==='reset'){Object.assign(state,Object.fromEntries(def.controls.map(([key,,,,,value])=>[key,value])));seed=20260920;}else if(b.dataset.action==='resample')seed++;else if(b.dataset.action==='jump')state.step=cache.reduce((best,r,i)=>r.dg>cache[best].dg?i:best,1);render();});
 render();
}
// Stable normal survival approximation; absolute error below 8e-8.
function normalSurvival(x){const t=1/(1+.2316419*x);return Math.exp(-x*x/2)/Math.sqrt(2*Math.PI)*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));}
