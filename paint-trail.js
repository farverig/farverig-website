(()=>{
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  if(!finePointer.matches||reducedMotion.matches)return;

  const canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{
    position:'fixed',
    inset:'0',
    width:'100vw',
    height:'100vh',
    pointerEvents:'none',
    zIndex:'18'
  });
  document.body.appendChild(canvas);

  const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});
  if(!ctx)return;

  const palette=['#1FB7A6','#3F6EF2','#7258D8','#C94D98','#F06F63'];
  const points=[];
  const LIFE=1100;
  const MAX_POINTS=96;
  let dpr=1;
  let travel=0;
  let raf=0;
  let last=null;

  function resize(){
    dpr=Math.min(1.35,devicePixelRatio||1);
    canvas.width=Math.round(innerWidth*dpr);
    canvas.height=Math.round(innerHeight*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  addEventListener('resize',resize,{passive:true});

  function hexToRgb(hex){
    const n=parseInt(hex.slice(1),16);
    return [(n>>16)&255,(n>>8)&255,n&255];
  }
  const rgbPalette=palette.map(hexToRgb);
  function mixColor(t,alpha=1){
    const wrapped=((t%rgbPalette.length)+rgbPalette.length)%rgbPalette.length;
    const i=Math.floor(wrapped);
    const f=wrapped-i;
    const a=rgbPalette[i];
    const b=rgbPalette[(i+1)%rgbPalette.length];
    const r=Math.round(a[0]+(b[0]-a[0])*f);
    const g=Math.round(a[1]+(b[1]-a[1])*f);
    const bl=Math.round(a[2]+(b[2]-a[2])*f);
    return `rgba(${r},${g},${bl},${alpha})`;
  }

  function seededNoise(seed){
    const x=Math.sin(seed*12.9898+78.233)*43758.5453;
    return x-Math.floor(x);
  }

  function addPoint(x,y,time){
    let speed=0;
    let angle=0;
    if(last){
      const dx=x-last.x;
      const dy=y-last.y;
      const dist=Math.hypot(dx,dy);
      if(dist<2.2)return;
      const dt=Math.max(8,time-last.time);
      speed=dist/dt;
      angle=Math.atan2(dy,dx);
      travel+=dist;
    }
    const width=Math.max(12,Math.min(24,23-speed*8));
    const seed=travel+time*.01;
    points.push({x,y,time,width,phase:travel/170,angle,seed});
    if(points.length>MAX_POINTS)points.splice(0,points.length-MAX_POINTS);
    last={x,y,time};
    if(!raf)raf=requestAnimationFrame(draw);
  }

  function drawSegment(a,b,now,glow){
    const age=(now-(a.time+b.time)/2)/LIFE;
    if(age>=1)return;
    const fade=Math.pow(Math.max(0,1-age),1.55);
    const grad=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
    grad.addColorStop(0,mixColor(a.phase));
    grad.addColorStop(1,mixColor(b.phase));

    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.lineCap='round';
    ctx.lineJoin='round';
    ctx.strokeStyle=grad;

    if(glow){
      ctx.globalAlpha=.13*fade;
      ctx.lineWidth=((a.width+b.width)/2)*2.45;
      ctx.shadowBlur=18;
      ctx.shadowColor=mixColor((a.phase+b.phase)/2,.9);
    }else{
      ctx.globalAlpha=.46*fade;
      ctx.lineWidth=((a.width+b.width)/2)*.78;
      ctx.shadowBlur=6;
      ctx.shadowColor=mixColor((a.phase+b.phase)/2,.75);
    }
    ctx.stroke();
  }

  function drawGrain(point,index,now){
    const age=(now-point.time)/LIFE;
    if(age>=1)return;
    const fade=Math.pow(Math.max(0,1-age),1.45);
    const spread=point.width*1.45;
    const nx=-Math.sin(point.angle||0);
    const ny=Math.cos(point.angle||0);
    const tx=Math.cos(point.angle||0);
    const ty=Math.sin(point.angle||0);

    for(let j=0;j<3;j++){
      const n1=seededNoise(point.seed+j*7.13+index*.71);
      const n2=seededNoise(point.seed+j*11.37+index*1.19);
      const side=(n1-.5)*spread*2;
      const along=(n2-.5)*point.width*.9;
      const x=point.x+nx*side+tx*along;
      const y=point.y+ny*side+ty*along;
      const radius=.8+seededNoise(point.seed+j*4.7)*2.6;
      ctx.beginPath();
      ctx.arc(x,y,radius,0,Math.PI*2);
      ctx.fillStyle=mixColor(point.phase+(j-.8)*.08,.18*fade);
      ctx.fill();
    }
  }

  function draw(now){
    raf=0;
    ctx.clearRect(0,0,innerWidth,innerHeight);
    while(points.length&&now-points[0].time>LIFE)points.shift();

    if(points.length>1){
      ctx.globalCompositeOperation='source-over';
      for(let i=1;i<points.length;i++)drawSegment(points[i-1],points[i],now,true);
      for(let i=1;i<points.length;i++)drawSegment(points[i-1],points[i],now,false);
      ctx.shadowBlur=0;
      for(let i=0;i<points.length;i+=2)drawGrain(points[i],i,now);
    }
    ctx.globalAlpha=1;
    ctx.shadowBlur=0;

    if(points.length)raf=requestAnimationFrame(draw);
  }

  addEventListener('pointermove',event=>{
    if(event.pointerType&&event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
    addPoint(event.clientX,event.clientY,performance.now());
  },{passive:true});

  addEventListener('pointerleave',()=>{last=null;},{passive:true});
  addEventListener('blur',()=>{last=null;});
})();
