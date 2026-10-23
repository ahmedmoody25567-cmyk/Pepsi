gsap.registerPlugin(ScrollTrigger);
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

// ---- build cans from template
const tpl=$('#can-tpl').innerHTML;
$$('.can-slot').forEach(el=>el.outerHTML=tpl.replace('GRAD',el.dataset.grad).replace('LABEL',el.dataset.label));

// ---- split hero title into letters
const t=$('#title'); t.innerHTML=[...t.textContent].map(c=>`<span>${c}</span>`).join('');

// ---- marquee text (duplicated for a seamless loop)
const line='COLD ✦ BOLD ✦ PEPSI ✦ DROP THE ICE ✦ POP IT OPEN ✦ ';
$('#mq').textContent=line.repeat(6);

// ---- countdown (7 days from first visit to this page load)
const end=Date.now()+7*864e5, pad=n=>String(n).padStart(2,'0');
setInterval(()=>{const l=Math.max(0,end-Date.now());
 $('#d').textContent=pad(Math.floor(l/864e5));$('#h').textContent=pad(Math.floor(l%864e5/36e5));
 $('#m').textContent=pad(Math.floor(l%36e5/6e4));$('#s').textContent=pad(Math.floor(l%6e4/1e3));},1000);

// ---- fizz bubbles on canvas
const fz=$('#fizz'),fx=fz.getContext('2d');let bubbles=[];
function sizeFizz(){fz.width=fz.clientWidth;fz.height=fz.clientHeight}
sizeFizz();addEventListener('resize',sizeFizz);
for(let i=0;i<70;i++)bubbles.push({x:Math.random(),y:Math.random(),r:1+Math.random()*5,v:.0006+Math.random()*.002,w:Math.random()*6});
(function loop(){fx.clearRect(0,0,fz.width,fz.height);
 bubbles.forEach(b=>{b.y-=b.v;b.w+=.03;if(b.y<-.05){b.y=1.05;b.x=Math.random()}
  fx.beginPath();fx.arc(b.x*fz.width+Math.sin(b.w)*8,b.y*fz.height,b.r,0,7);
  fx.fillStyle='rgba(255,255,255,.25)';fx.fill();fx.strokeStyle='rgba(255,255,255,.6)';fx.stroke()});
 requestAnimationFrame(loop)})();

// ---- confetti
const cf=$('#confetti'),cx=cf.getContext('2d');let bits=[];
function sizeCf(){cf.width=innerWidth;cf.height=innerHeight}sizeCf();addEventListener('resize',sizeCf);
function boom(x,y){for(let i=0;i<110;i++)bits.push({x,y,vx:(Math.random()-.5)*14,vy:-Math.random()*13-3,s:4+Math.random()*7,
 c:['#e4202e','#ffffff','#2f6fe0'][i%3],r:Math.random()*6,life:120})}
(function tick(){cx.clearRect(0,0,cf.width,cf.height);
 bits=bits.filter(b=>b.life-->0);
 bits.forEach(b=>{b.vy+=.35;b.x+=b.vx;b.y+=b.vy;b.r+=.2;cx.save();cx.translate(b.x,b.y);cx.rotate(b.r);
  cx.fillStyle=b.c;cx.fillRect(-b.s/2,-b.s/2,b.s,b.s*.6);cx.restore()});
 requestAnimationFrame(tick)})();

// ---- toast + buy buttons
let tt;function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('show'),2200)}
$$('.card .btn').forEach(b=>b.onclick=e=>{boom(e.clientX,e.clientY);toast(b.dataset.n+' added to your cart')});

// ---- email signup
$('#join').onclick=e=>{const v=$('#email').value.trim(),m=$('#msg');
 if(/^\S+@\S+\.\S+$/.test(v)){m.textContent='You are in. Check your inbox for your first drop.';boom(e.clientX,e.clientY)}
 else m.textContent='Enter a valid email, like you@email.com.'};

// ---- custom cursor + progress bar
const cur=$('.cursor');
addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px'});
$$('a,button,.card').forEach(el=>{el.onmouseenter=()=>cur.classList.add('big-c');el.onmouseleave=()=>cur.classList.remove('big-c')});
addEventListener('scroll',()=>{$('#progress').style.width=scrollY/(document.body.scrollHeight-innerHeight)*100+'%'});

// ---- 3D tilt on cards
$$('.card').forEach(c=>{
 c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  gsap.to(c,{rotationY:x*18,rotationX:-y*18,transformPerspective:700,duration:.3})});
 c.addEventListener('mouseleave',()=>gsap.to(c,{rotationX:0,rotationY:0,duration:.6}))});

// ---- count-up stats
$$('.n').forEach(n=>ScrollTrigger.create({trigger:n,start:'top 85%',once:true,onEnter:()=>{
 const o={v:0};gsap.to(o,{v:+n.dataset.to,duration:2,ease:'power2.out',onUpdate:()=>n.textContent=Math.round(o.v)+n.dataset.s})}}));

// ---- intro + scroll animations
const mm=gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)',()=>{
 gsap.timeline({delay:.6}).to('.loader',{yPercent:-100,duration:.9,ease:'power4.inOut'})
  .from('#title span',{y:200,opacity:0,rotate:20,stagger:.08,duration:.8,ease:'back.out(1.7)'},'-=.3')
  .from('.hero .can',{y:-500,opacity:0,duration:1.1,ease:'bounce.out'},'-=.5');

 // hero pin: can drops and spins
 gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'+=120%',scrub:1,pin:true}})
  .to('.hero .can',{y:'38vh',rotate:24,scale:1.25,ease:'none'},0)
  .to('.hero .big',{scale:.8,opacity:.55,ease:'none'},0)
  .to('.hero .i1',{x:-120,y:160,rotate:-40,ease:'none'},0).to('.hero .i2',{x:120,y:-140,rotate:50,ease:'none'},0);

 // mouse parallax on hero title
 const qx=gsap.quickTo('.hero .big','x',{duration:.6}),qy=gsap.quickTo('.hero .big','y',{duration:.6});
 $('.hero').addEventListener('mousemove',e=>{qx((e.clientX/innerWidth-.5)*40);qy((e.clientY/innerHeight-.5)*25)});

 gsap.from('.card',{y:140,opacity:0,stagger:.2,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.flavours',start:'top 70%'}});

 gsap.timeline({scrollTrigger:{trigger:'.fresh',start:'top top',end:'+=150%',scrub:1,pin:true}})
  .to('.fresh .can',{top:'110%',rotate:360,ease:'none'},0).to('.fresh h2',{color:'#0a3a8f',ease:'none'},.3)
  .to('.fresh .i1',{y:260,rotate:120,ease:'none'},0).to('.fresh .i2',{y:-300,rotate:-150,ease:'none'},0);

 gsap.from('.about article',{y:80,opacity:0,stagger:.25,duration:.9,scrollTrigger:{trigger:'.about',start:'top 80%'}});
 gsap.from('.social h2',{scale:.6,opacity:0,duration:1,ease:'back.out(1.7)',scrollTrigger:{trigger:'.social',start:'top 70%'}});
});
mm.add('(prefers-reduced-motion: reduce)',()=>gsap.set('.loader',{display:'none'}));
