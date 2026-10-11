// One continuous field of particles transforms between landscapes, time, life and law.
export function createCosmos(canvas){
 const ctx=canvas.getContext('2d');if(!ctx)return()=>{};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let w=0,h=0,realm=0,frame=0,last=0,progress=1,start=0;const N=880,pts=[],from=[],to=[];
 const noise=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
 function shape(k,i){const u=noise(i+1),v=noise(i+N),a=u*Math.PI*2;let x,y;
 if(k===0){x=.33+u*.66;const layer=Math.floor(v*5);const ridge=.48+layer*.07-.14*Math.sin(u*9+layer*.9)-.045*Math.sin(u*27);y=ridge+noise(i+3000)*.10;}
 if(k===1){const ring=Math.floor(v*4),r=.12+ring*.058;x=.73+Math.cos(a)*r*1.3;y=.46+Math.sin(a)*r*.93;}
 if(k===2){const group=Math.floor(u*9),gx=.48+(group%3)*.15,gy=.25+Math.floor(group/3)*.21;const theta=v*Math.PI*2,r=.016+noise(i+5000)*.042;x=gx+Math.cos(theta)*r;y=gy+Math.sin(theta)*r*1.6;}
 if(k===3){const petal=Math.floor(v*6),r=.045+u*.24,theta=petal*Math.PI/3+Math.sin(u*Math.PI)*.7;x=.73+Math.cos(theta)*r;y=.46+Math.sin(theta)*r*1.3;}
 return{x:x*w,y:y*h};}
 function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);for(let i=0;i<N;i++){pts[i]=shape(realm,i);to[i]={...pts[i]};from[i]={...pts[i]}}progress=1;draw(performance.now());}
 function draw(t){ctx.clearRect(0,0,w,h);const color=['178,191,143','173,184,215','207,178,134','151,203,193'][realm];const glow=ctx.createRadialGradient(w*.73,h*.45,0,w*.73,h*.45,h*.46);glow.addColorStop(0,`rgba(${color},.10)`);glow.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 // Layered mountain silhouettes give the land realm its own visual identity.
 if(realm===0){for(let layer=0;layer<5;layer++){ctx.beginPath();ctx.moveTo(w*.32,h);for(let x=w*.32;x<=w+6;x+=6){const u=x/w;const y=h*(.53+layer*.064-.12*Math.sin(u*12+layer*.85)-.035*Math.sin(u*31+layer));ctx.lineTo(x,y)}ctx.lineTo(w,h);ctx.closePath();ctx.fillStyle=`rgba(${45+layer*5},${66+layer*4},${48+layer*3},${(.13+layer*.018)*progress})`;ctx.fill()}}
 // Fine cartographic / celestial contours dissolve as the particle field changes.
 ctx.strokeStyle=`rgba(${color},${.12*progress})`;ctx.lineWidth=.7;
 for(let j=0;j<6;j++){ctx.beginPath();if(realm===0){for(let x=0;x<=w;x+=6){const u=x/w,y=h*(.53+j*.066-.09*Math.sin(u*12+j*.9)-.028*Math.sin(u*34));x?ctx.lineTo(x,y):ctx.moveTo(x,y)}}else if(realm===1){ctx.ellipse(w*.73,h*.46,w*(.11+j*.025),h*(.10+j*.035),-.3,0,Math.PI*2)}else if(realm===2){const gx=w*(.48+(j%3)*.15),gy=h*(.25+Math.floor(j/3)*.21);ctx.ellipse(gx,gy,w*.044,h*.075,0,0,Math.PI*2);ctx.moveTo(gx,gy);ctx.lineTo(w*.73,h*.65)}else{const a=j*Math.PI/3;ctx.moveTo(w*.73,h*.46);ctx.lineTo(w*.73+Math.cos(a)*w*.27,h*.46+Math.sin(a)*h*.35)}ctx.stroke()}
 for(let i=0;i<N;i++){const p=pts[i],f=from[i],d=to[i];const ease=1-Math.pow(1-progress,3);p.x=f.x+(d.x-f.x)*ease;p.y=f.y+(d.y-f.y)*ease;const drift=reduced.matches?0:Math.sin(t*.00045+i)*1.2;ctx.fillStyle=`rgba(${color},${.18+noise(i+7000)*.6})`;ctx.beginPath();ctx.arc(p.x,p.y+drift,noise(i+1000)>.96?1.7:.7,0,Math.PI*2);ctx.fill()}
 // A distant moon and sparse stars anchor the scene during all transformations.
 ctx.fillStyle=`rgba(${color},.55)`;ctx.beginPath();ctx.arc(w*.82,h*.18,realm===0?17:5,0,Math.PI*2);ctx.fill();for(let i=0;i<38;i++){ctx.fillStyle=`rgba(${color},${noise(i+9000)*.3})`;ctx.fillRect(noise(i+8000)*w,noise(i+8500)*h*.7,1,1)}
 }
 function tick(t){if(t-last>30){last=t;progress=Math.min(1,(t-start)/1300);draw(t)}if(!reduced.matches&&!document.hidden)frame=requestAnimationFrame(tick);else frame=0;}
 function run(){if(!frame&&!reduced.matches&&!document.hidden)frame=requestAnimationFrame(tick)}
 function change(k){if(k===realm)return;realm=k;start=performance.now();progress=reduced.matches?1:0;for(let i=0;i<N;i++){from[i]={...pts[i]};to[i]=shape(k,i)}if(reduced.matches){progress=1;draw(start)}else run()}
 new ResizeObserver(resize).observe(canvas);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else run()});reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;progress=1;draw(performance.now())}else run()});resize();run();return change;
}
