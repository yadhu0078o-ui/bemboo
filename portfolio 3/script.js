const canvas=document.getElementById('live-bg');
const ctx=canvas.getContext('2d');
let W=0,H=0,dpr=1,particles=[],blobs=[];
function resizeLive(){
 dpr=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
 canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.width=W+'px'; canvas.style.height=H+'px';
 ctx.setTransform(dpr,0,0,dpr,0,0);
 const count=Math.min(120,Math.max(45,Math.floor(W*H/12000)));
 particles=Array.from({length:count},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.25,r:Math.random()*1.7+.45,a:Math.random()*.42+.16,phase:Math.random()*Math.PI*2}));
 blobs=[
  {x:W*.18,y:H*.22,r:Math.min(W,H)*.22,c:'rgba(120,76,220,.10)',sx:.00035,sy:.00028,phase:0},
  {x:W*.78,y:H*.30,r:Math.min(W,H)*.26,c:'rgba(25,170,190,.075)',sx:-.00028,sy:.00032,phase:2},
  {x:W*.52,y:H*.82,r:Math.min(W,H)*.30,c:'rgba(94,55,190,.075)',sx:.00022,sy:-.0003,phase:4}
 ];
}
function drawLive(t){
 const sec=t*.001; ctx.clearRect(0,0,W,H);
 // slowly moving ambient light, like a live wallpaper
 ctx.globalCompositeOperation='source-over';
 for(const b of blobs){
  const x=b.x+Math.sin(sec*b.sx*10000+b.phase)*W*.10;
  const y=b.y+Math.cos(sec*b.sy*10000+b.phase)*H*.09;
  const g=ctx.createRadialGradient(x,y,0,x,y,b.r);
  g.addColorStop(0,b.c); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,b.r,0,Math.PI*2); ctx.fill();
 }
 // drifting particles
 for(const p of particles){
  p.x+=p.vx+Math.sin(sec*.45+p.phase)*.045; p.y+=p.vy+Math.cos(sec*.38+p.phase)*.035;
  if(p.x<-20)p.x=W+20;if(p.x>W+20)p.x=-20;if(p.y<-20)p.y=H+20;if(p.y>H+20)p.y=-20;
  const alpha=p.a+.10*Math.sin(sec*1.8+p.phase);
  ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(191,166,255,${alpha})`;ctx.fill();
 }
 // subtle constellation connections
 for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){
  const a=particles[i],b=particles[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
  if(d<125){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(128,108,190,${(1-d/125)*.085})`;ctx.lineWidth=.7;ctx.stroke();}
 }
 // slow flowing horizontal light trails
 for(let k=0;k<3;k++){
  ctx.beginPath();
  for(let x=-40;x<=W+40;x+=18){const y=H*(.25+k*.27)+Math.sin(x*.006+sec*.18+k)*18+Math.sin(x*.013-sec*.12)*9;if(x===-40)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
  ctx.strokeStyle=`rgba(${k===1?'55,180,205':'145,100,220'},.035)`;ctx.lineWidth=1.2;ctx.stroke();
 }
 requestAnimationFrame(drawLive);
}
resizeLive();addEventListener('resize',resizeLive);requestAnimationFrame(drawLive);
const glow=document.querySelector('.cursor-glow');
let mx=innerWidth/2,my=innerHeight/2,gx=mx,gy=my;
let speed=0,lastX=mx,lastY=my;
addEventListener('mousemove',e=>{
 mx=e.clientX; my=e.clientY;
 const movement=Math.hypot(mx-lastX,my-lastY);
 speed=Math.min(1,movement/45);
 lastX=mx; lastY=my;
});
(function loop(){
 gx+=(mx-gx)*.095; gy+=(my-gy)*.095;
 glow.style.left=gx+'px'; glow.style.top=gy+'px';
 const scale=1+speed*.12;
 glow.style.transform=`translate(-50%,-50%) scale(${scale})`;
 speed*=.91;
 requestAnimationFrame(loop);
})();

// Give the cursor aura a larger, softer presence over things you can click.
const interactive=document.querySelectorAll('a,button,.skill,.featured,.nav');
interactive.forEach(el=>{
 el.addEventListener('mouseenter',()=>glow.classList.add('active'));
 el.addEventListener('mouseleave',()=>glow.classList.remove('active'));
});
addEventListener('mousedown',()=>{
 glow.classList.add('click');
 setTimeout(()=>glow.classList.remove('click'),220);
});
const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));
document.getElementById('year').textContent=new Date().getFullYear();
