const canvas=document.getElementById("c");
const ctx=canvas.getContext("2d");
let W=canvas.width=innerWidth;
let H=canvas.height=innerHeight;
window.onresize=()=>{W=canvas.width=innerWidth;H=canvas.height=innerHeight};

const wishes=[
  "Chúc Quỳnh kì này lại có thêm học bổng 🌸",
  "Mong tình bạn mãi bền chặt như trăng rằm 🌕",
  "Chúc Kiên sớm về bờ  💪",
  "Chúc Cảnh sớm có người yêu ✨",
  "Chúc Hà mọi điều tốt đẹp 🍀"
];

// random tiện ích
const rand=(a,b)=>Math.random()*(b-a)+a;

class Lantern {
  constructor(){
    this.reset(true);
  }
  reset(initial=false){
    this.size=rand(20,40);
    this.x=rand(0,W);
    this.y=initial?rand(0,H):H+50;
    this.vx=rand(-0.2,0.2);
    this.vy=-rand(0.3,0.7);
    this.swing=rand(0,Math.PI*2);
    this.color="hsl(25,90%,55%)";
    this.msg=wishes[Math.floor(Math.random()*wishes.length)];
  }
  draw(ctx){
    ctx.save();
    ctx.translate(this.x,this.y);
    // thân đèn lồng: trên to, dưới nhỏ
    ctx.beginPath();
    ctx.moveTo(-this.size*0.6,-this.size);
    ctx.lineTo(this.size*0.6,-this.size);
    ctx.lineTo(this.size*0.4,this.size);
    ctx.lineTo(-this.size*0.4,this.size);
    ctx.closePath();
    const g=ctx.createLinearGradient(0,-this.size,0,this.size);
    g.addColorStop(0,"#ff9c42");
    g.addColorStop(1,"#d95c00");
    ctx.fillStyle=g;
    ctx.fill();

    // ánh sáng bên trong
    ctx.beginPath();
    ctx.ellipse(0,this.size*0.3,this.size*0.25,this.size*0.35,0,0,Math.PI*2);
    ctx.fillStyle="rgba(255,240,180,0.8)";
    ctx.fill();

    ctx.restore();
  }
  update(){
    this.x+=Math.sin(this.swing)*0.2;
    this.y+=this.vy;
    this.swing+=0.02;
    if(this.y<-60) this.reset();
  }
  hit(px,py){
    return Math.abs(this.x-px)<this.size*0.6 && Math.abs(this.y-py)<this.size;
  }
}

let lanterns=[];
for(let i=0;i<50;i++) lanterns.push(new Lantern());

// sao nhỏ
let stars=Array.from({length:120},()=>({x:rand(0,W),y:rand(0,H*0.7),r:rand(0.5,1.5)}));

function drawStars(){
  ctx.fillStyle="white";
  stars.forEach(s=>{
    ctx.globalAlpha=rand(0.3,1);
    ctx.fillRect(s.x,s.y,s.r,s.r);
  });
  ctx.globalAlpha=1;
}

// vẽ mặt trăng
function drawMoon(){
  let r=Math.min(80,W*0.07);
  let x=W*0.85,y=H*0.2;
  let g=ctx.createRadialGradient(x,y,r*0.3,x,y,r*2);
  g.addColorStop(0,"rgba(255,255,210,0.4)");
  g.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=g;
  ctx.fillRect(0,0,W,H);

  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fillStyle="white";
  ctx.fill();
}

function animate(){
  ctx.fillStyle="#02021a";
  ctx.fillRect(0,0,W,H);
  drawStars();
  drawMoon();
  lanterns.forEach(l=>{l.update();l.draw(ctx)});
  requestAnimationFrame(animate);
}
animate();

// click hiện lời chúc
const wishBox=document.getElementById("wish");
canvas.addEventListener("click",e=>{
  let rect=canvas.getBoundingClientRect();
  let x=e.clientX-rect.left,y=e.clientY-rect.top;
  let target=lanterns.find(l=>l.hit(x,y));
  if(target){
    wishBox.textContent=target.msg;
    wishBox.style.left=target.x+"px";
    wishBox.style.top=target.y+"px";
    wishBox.classList.add("show");
    setTimeout(()=>wishBox.classList.remove("show"),2000);
  }
});