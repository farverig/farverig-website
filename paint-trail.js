(()=>{
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  if(!finePointer.matches||reducedMotion.matches)return;

  const canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{
    position:'fixed',inset:'0',width:'100vw',height:'100vh',pointerEvents:'none',zIndex:'18'
  });
  document.body.appendChild(canvas);

  const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});
  if(!ctx)return;

  const palette=['#20B6A6','#416FEF','#735AD9','#C94F99','#EF7064'];
  const rgbPalette=palette.map(hex=>{
    const n=parseInt(hex.slice(1),16);
    return [(n>>16)&255,(n>>8)&255,n&255];
  });

  const points=[];
  const LIFE=1850;
  const MAX_POINTS=125;
  let dpr=1;
  let travel=0;
  let raf=0;
  let last=null;

  function resize(){
    dpr=Math.min(1.25,devicePixelRatio||1);
    canvas.width=Math.round(innerWidth*dpr);
    canvas.height=Math.round(innerHeight*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  addEventListener('resize',resize,{passive:true});

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
      if(dist<1.2)return;
      const dt=Math.max(7,time-last.time);
      speed=dist/dt;
      angle=Math.atan2(dy,dx);
      travel+=dist;
    }

    const width=Math.max(24,Math.min(44,43-speed*10));
    points.push({x,y,time,width,phase:travel/190,angle,seed:travel+time*.01});
    if(points.length>MAX_POINTS)points.splice(0,points.length-MAX_POINTS);
    last={x,y,time};
    if(!raf)raf=requestAnimationFrame(draw);
  }

  function smoothSegment(i,now,scale,alpha){
    const a=points[i-1];
    const b=points[i];
    const c=points[i+1]||b;
    const age=(now-(a.time+b.time)/2)/LIFE;
    if(age>=1)return;

    const fade=Math.pow(Math.max(0,1-age),1.2);
    const endX=(b.x+c.x)/2;
    const endY=(b.y+c.y)/2;
    const startX=i===1?a.x:(a.x+b.x)/2;
    const startY=i===1?a.y:(a.y+b.y)/2;
    const grad=ctx.createLinearGradient(startX,startY,endX,endY);
    grad.addColorStop(0,mixColor(a.phase));
    grad.addColorStop(1,mixColor(b.phase));

    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.quadraticCurveTo(b.x,b.y,endX,endY);
    ctx.lineCap='round';
    ctx.lineJoin='round';
    ctx.strokeStyle=grad;
    ctx.globalAlpha=alpha*fade;
    ctx.lineWidth=((a.width+b.width)/2)*scale;
    ctx.shadowBlur=0;
    ctx.stroke();
  }

  function drawMist(point,index,now){
    const age=(now-point.time)/LIFE;
    if(age>=1)return;
    const fade=Math.pow(Math.max(0,1-age),1.15);
    const spread=point.width*1.7;
    const nx=-Math.sin(point.angle||0);
    const ny=Math.cos(point.angle||0);

    for(let j=0;j<2;j++){
      const n1=seededNoise(point.seed+j*9.17+index*.73);
      const n2=seededNoise(point.seed+j*14.31+index*1.11);
      const side=(n1-.5)*spread*2;
      const drift=(n2-.5)*point.width*1.2;
      const x=point.x+nx*side+Math.cos(point.angle||0)*drift;
      const y=point.y+ny*side+Math.sin(point.angle||0)*drift;
      const radius=1+seededNoise(point.seed+j*5.3)*3.2;
      ctx.beginPath();
      ctx.arc(x,y,radius,0,Math.PI*2);
      ctx.fillStyle=mixColor(point.phase+(j-.5)*.08,.08*fade);
      ctx.fill();
    }
  }

  function draw(now){
    raf=0;
    ctx.clearRect(0,0,innerWidth,innerHeight);
    while(points.length&&now-points[0].time>LIFE)points.shift();

    if(points.length>1){
      ctx.globalCompositeOperation='source-over';
      const passes=[
        [3.1,.045],
        [2.35,.065],
        [1.75,.095],
        [1.28,.13],
        [.92,.18]
      ];
      for(const [scale,alpha] of passes){
        for(let i=1;i<points.length;i++)smoothSegment(i,now,scale,alpha);
      }
      for(let i=0;i<points.length;i+=3)drawMist(points[i],i,now);
    }

    ctx.globalAlpha=1;
    ctx.shadowBlur=0;
    if(points.length)raf=requestAnimationFrame(draw);
  }

  addEventListener('pointermove',event=>{
    if(event.pointerType&&event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
    const samples=event.getCoalescedEvents?event.getCoalescedEvents():[event];
    const step=Math.max(1,Math.ceil(samples.length/3));
    for(let i=0;i<samples.length;i+=step){
      const sample=samples[i];
      addPoint(sample.clientX,sample.clientY,performance.now());
    }
  },{passive:true});

  addEventListener('pointerleave',()=>{last=null;},{passive:true});
  addEventListener('blur',()=>{last=null;});
})();
