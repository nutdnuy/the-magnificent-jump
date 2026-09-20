import assert from 'node:assert/strict';
import {sampleVG,moments,clockPath,histogram,rng,gamma} from '../assets/vg-math.mjs';
for(const nu of [0,.05,.4,1])for(const theta of [-.3,0,.3]){
 const m=moments(theta,.2,nu),v=sampleVG({theta,nu,n:200000,seed:4102});
 const mean=v.reduce((a,b)=>a+b,0)/v.length,variance=v.reduce((a,b)=>a+(b-mean)**2,0)/v.length;
 assert.ok(Math.abs(mean-m.mean)<6*m.sd/Math.sqrt(v.length));
 assert.ok(Math.abs(variance-m.variance)<.035*m.variance);
 const skew=v.reduce((a,b)=>a+(b-mean)**3,0)/v.length/variance**1.5;
 assert.ok(Math.abs(skew-m.skew)<.15);
 assert.ok(v.every(Number.isFinite));
}
for(const nu of [0,.05,1]){
 const rows=clockPath(nu,20260920);
 assert.equal(rows.length,121);
 assert.ok(rows.every((r,i)=>r.g>=0&&(!i||r.g>=rows[i-1].g)));
 if(nu===0)for(const r of rows){assert.ok(Math.abs(r.g-r.t)<1e-12);assert.ok(Math.abs(r.x-r.b)<1e-12);}
 assert.deepEqual(rows,clockPath(nu,20260920));
}
const random=rng(91),draws=Array.from({length:100000},()=>gamma(.2,.5,random));
assert.ok(Math.abs(draws.reduce((a,b)=>a+b,0)/draws.length-.1)<.003);
const h=histogram([-2,-1,0,.5,1,2],-1,1,4);
assert.equal(h.outside,3);
assert.ok(Math.abs(h.points.reduce((a,b)=>a+b[1]*h.width,0)+h.outside/6-1)<1e-12);
assert.deepEqual(sampleVG({n:100}),sampleVG({n:100}));
assert.notDeepEqual(sampleVG({n:100,seed:1}),sampleVG({n:100,seed:2}));
console.log('PASS: VG moments, skewness, gamma shape<1, monotone clock, Normal limit, histogram mass and reproducible seeds.');
