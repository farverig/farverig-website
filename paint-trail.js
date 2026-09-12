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

  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return;

  const palette=['#00B7A8','#446CFF','#7657E8','#D94C9B','#FF765C'];
  const points=[];
  const LIFE=1350;
  const MAX_POINTS=150;
  let dpr=1;
  let travel=0;
  let raf=0;
  let last=null;

  function resize(){
    dpr=Math.min(2,devicePixelRatio||1);
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
  function mixColor(t){
    const wrapped=((t%rgbPalette.length)+rgbPalette.length)%rgbPalette.length;
    const i=Math.floor(wrapped);
    const f=wrapped-i;
    const a=rgbPalette[i];
    const b=rgbPalette[(i+1)%rgbPalette.length];
    return `rgb(${Math.round(a[0]+(b[0]-a[0])*f)},${Math.round(a[1]+(b[1]-a[1])*f)},${Math.round(a[2]+(b[2]-a[2])*f)})`;
  }

  function addPoint(x,y,time){
    let speed=0;
    if(last){
      const dx=x-last.x;
      const dy=y-last.y;
      const dist=Math.hypot(dx,dy);
      if(dist<1.4)return;
      const dt=Math.max(8,time-last.time);
      speed=dist/dt;
      travel+=dist;
    }
    const width=Math.max(14,Math.min(30,29-speed*13));
    points.push({x,y,time,width,phase:travel/155});
    if(points.length>MAX_POINTS)points.splice(0,points.length-MAX_POINTS);
    last={x,y,time};
    if(!raf)raf=requestAnimationFrame(draw);
  }

  function drawSegment(a,b,now,pass){
    const age=(now-(a.time+b.time)/2)/LIFE;
    if(age>=1)return;
    const fade=Math.pow(Math.max(0,1-age),1.45);
    const color=mixColor((a.phase+b.phase)/2);
    const grad=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
    grad.addColorStop(0,mixColor(a.phase));
    grad.addColorStop(1,mixColor(b.phase));

    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.lineCap='round';
    ctx.lineJoin='round';
    ctx.strokeStyle=grad;

    if(pass===0){
      ctx.globalAlpha=.16*fade;
      ctx.lineWidth=((a.width+b.width)/2)*1.85;
      ctx.shadowBlur=22;
      ctx.shadowColor=color;
    }else if(pass===1){
      ctx.globalAlpha=.78*fade;
      ctx.lineWidth=(a.width+b.width)/2;
      ctx.shadowBlur=7;
      ctx.shadowColor=color;
    }else{
      ctx.globalAlpha=.24*fade;
      ctx.lineWidth=Math.max(2.5,((a.width+b.width)/2)*.18);
      ctx.shadowBlur=0;
      ctx.strokeStyle='rgba(255,255,255,.9)';
    }
    ctx.stroke();
  }

  function draw(now){
    raf=0;
    ctx.clearRect(0,0,innerWidth,innerHeight);
    while(points.length&&now-points[0].time>LIFE)points.shift();

    if(points.length>1){
      ctx.globalCompositeOperation='source-over';
      for(let pass=0;pass<3;pass++){
        for(let i=1;i<points.length;i++)drawSegment(points[i-1],points[i],now,pass);
      }
    }
    ctx.globalAlpha=1;
    ctx.shadowBlur=0;

    if(points.length)raf=requestAnimationFrame(draw);
  }

  addEventListener('pointermove',event=>{
    if(event.pointerType&&event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
    const samples=event.getCoalescedEvents?event.getCoalescedEvents():[event];
    for(const sample of samples)addPoint(sample.clientX,sample.clientY,performance.now());
  },{passive:true});

  addEventListener('pointerleave',()=>{last=null;},{passive:true});
  addEventListener('blur',()=>{last=null;});
})();
