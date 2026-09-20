// Unit-mean gamma clock: G(t) ~ Gamma(shape=t/nu, scale=nu).
export function rng(seed) {
 let state=seed>>>0;
 return () => {state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
export function normal(random) {return Math.sqrt(-2*Math.log(Math.max(random(),1e-15)))*Math.cos(2*Math.PI*random());}
// Marsaglia–Tsang rejection sampler, with the shape<1 transformation.
export function gamma(shape, scale, random) {
 if(!(shape>0 && scale>0))throw new RangeError('Positive gamma shape and scale required');
 if(shape<1)return gamma(shape+1,scale,random)*Math.pow(Math.max(random(),1e-15),1/shape);
 const d=shape-1/3,c=1/Math.sqrt(9*d);
 for(;;){const z=normal(random),v=1+c*z;if(v<=0)continue;const w=v*v*v,u=Math.max(random(),1e-15);if(u<1-.0331*z**4||Math.log(u)<.5*z*z+d*(1-w+Math.log(w)))return scale*d*w;}
}
export function moments(theta,sigma,nu,T=1){
 const variance=(sigma*sigma+theta*theta*nu)*T;
 return {mean:theta*T,variance,sd:Math.sqrt(variance),skew:(3*theta*sigma*sigma*nu+2*theta**3*nu**2)*T/variance**1.5,excess:(3*sigma**4*nu+12*theta*theta*sigma*sigma*nu**2+6*theta**4*nu**3)*T/variance**2};
}
export function sampleVG({theta=0,sigma=.2,nu=.4,T=1,n=24000,seed=20260920}={}) {
 const random=rng(seed),values=[];
 for(let i=0;i<n;i++){const g=nu===0?T:gamma(T/nu,nu,random);values.push(theta*g+sigma*Math.sqrt(g)*normal(random));}
 return values;
}
export function clockPath(nu,seed,steps=120){
 const random=rng(seed),zRandom=rng(seed+991),dt=1/steps;
 const rows=[{t:0,g:0,x:0,b:0,dg:0,dx:0}];
 for(let i=1;i<=steps;i++){const last=rows[i-1],dg=nu===0?dt:gamma(dt/nu,nu,random),z=normal(zRandom),dx=.2*Math.sqrt(dg)*z;rows.push({t:i*dt,g:last.g+dg,x:last.x+dx,b:last.b+.2*Math.sqrt(dt)*z,dg,dx});}
 return rows;
}
export function histogram(values,min,max,bins=60){
 const counts=Array(bins).fill(0),width=(max-min)/bins;let outside=0;
 for(const value of values){if(value<min||value>=max){outside++;continue;}counts[Math.floor((value-min)/width)]++;}
 return {points:counts.map((c,i)=>[min+(i+.5)*width,c/(values.length*width)]),outside,width};
}
export function normalDensity(x,mean,sd){return Math.exp(-.5*((x-mean)/sd)**2)/(sd*Math.sqrt(2*Math.PI));}
