(()=>{
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  if(!finePointer.matches||reducedMotion.matches)return;

  const canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{
    position:'fixed',inset:'0',width:'100vw',height:'100vh',pointerEvents:'none',zIndex:'1'
  });
  document.body.appendChild(canvas);

  // Paint sits above the page/video surface, but below all editorial content.
  // Sections that used opaque black backgrounds are made transparent so the
  // fixed paint layer can show through their empty space without covering text/images.
  const layerStyle=document.createElement('style');
  layerStyle.textContent=`
    .hero video{z-index:0 !important}
    .hero-shade{z-index:0 !important}

    .work-story,
    .offers,
    .booking-section{position:relative !important;z-index:2 !important;background:transparent !important;}

    .work-story-stage{position:sticky;z-index:2 !important;}
    .story-shot{z-index:4 !important;}
    .work-story-stage:after{z-index:5 !important;}
    .work-story-copy{z-index:8 !important;}

    .offers-shell{position:relative;z-index:8 !important;}
    .offer-preview{z-index:5 !important;}
    .offer-link,.offer-more,.offers-heading{position:relative;z-index:8 !important;}

    .booking-intro,.booking-form{position:relative;z-index:8 !important;}

    .site-header,.transforming-logo,.hero-label,.bottom-glow,.book-button,.scroll-cue,.hero-scroll-arrow{z-index:20 !important;}
  `;
  document.head.appendChild(layerStyle);

  const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});
  if(!ctx)return;

  const palette=['#20B6A6','#416FEF','#735AD9','#C94F99','#EF7064'];
  const rgbPalette=palette.map(hex=>{
    const n=parseInt(hex.slice(1),16);
    return [(n>>16)&255,(n>>8)&255,n&255];
  });

  const points=[];
  const HOLD=5000;
  const FADE=2200;
  const LIFE=HOLD+FADE;
  const MAX_POINTS=340;
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

  function ageOpacity(time,now){
    const age=now-time;
    if(age<=HOLD)return 1;
    if(age>=LIFE)return 0;
    const t=(age-HOLD)/FADE;
    return Math.pow(1-t,1.35);
  }

  function addPoint(x,y,time){
    let speed=0;
    let angle=0;
    if(last){
      const dx=x-last.x;
      const dy=y-last.y;
      const dist=Math.hypot(dx,dy);
      if(dist<1.8)return;
      const dt=Math.max(7,time-last.time);
      speed=dist/dt;
      angle=Math.atan2(dy,dx);
      travel+=dist;
    }

    const width=Math.max(34,Math.min(70,68-speed*13));
    points.push({x,y,time,width,phase:travel/210,angle,seed:travel+time*.01});
    if(points.length>MAX_POINTS)points.splice(0,points.length-MAX_POINTS);
    last={x,y,time};
    if(!raf)raf=requestAnimationFrame(draw);
  }

  function smoothSegment(i,now,scale,alpha){
    const a=points[i-1];
    const b=points[i];
    const c=points[i+1]||b;
    const fade=(ageOpacity(a.time,now)+ageOpacity(b.time,now))/2;
    if(fade<=0)return;

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
    const fade=ageOpacity(point.time,now);
    if(fade<=0)return;
    const spread=point.width*1.9;
    const nx=-Math.sin(point.angle||0);
    const ny=Math.cos(point.angle||0);

    for(let j=0;j<2;j++){
      const n1=seededNoise(point.seed+j*9.17+index*.73);
      const n2=seededNoise(point.seed+j*14.31+index*1.11);
      const side=(n1-.5)*spread*2;
      const drift=(n2-.5)*point.width*1.35;
      const x=point.x+nx*side+Math.cos(point.angle||0)*drift;
      const y=point.y+ny*side+Math.sin(point.angle||0)*drift;
      const radius=1.2+seededNoise(point.seed+j*5.3)*4.2;
      ctx.beginPath();
      ctx.arc(x,y,radius,0,Math.PI*2);
      ctx.fillStyle=mixColor(point.phase+(j-.5)*.08,.075*fade);
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
        [3.45,.035],
        [2.85,.05],
        [2.25,.075],
        [1.75,.11],
        [1.38,.17],
        [1.12,.28],
        [1.00,1.00]
      ];
      for(const [scale,alpha] of passes){
        for(let i=1;i<points.length;i++)smoothSegment(i,now,scale,alpha);
      }
      for(let i=0;i<points.length;i+=4)drawMist(points[i],i,now);
    }

    ctx.globalAlpha=1;
    ctx.shadowBlur=0;
    if(points.length)raf=requestAnimationFrame(draw);
  }

  addEventListener('pointermove',event=>{
    if(event.pointerType&&event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
    const samples=event.getCoalescedEvents?event.getCoalescedEvents():[event];
    const step=Math.max(1,Math.ceil(samples.length/2));
    for(let i=0;i<samples.length;i+=step){
      const sample=samples[i];
      addPoint(sample.clientX,sample.clientY,performance.now());
    }
  },{passive:true});

  addEventListener('pointerleave',()=>{last=null;},{passive:true});
  addEventListener('blur',()=>{last=null;});
})();
