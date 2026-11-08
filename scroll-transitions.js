/* Prototype: scroll-drevet overgang fra billedfortælling til tilbud. */
(()=>{
  const story=document.querySelector('.work-story');
  const stage=story?.querySelector('.work-story-stage');
  const offers=document.querySelector('.offers');
  const shell=offers?.querySelector('.offers-shell');
  if(!story||!stage||!offers||!shell)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0;
  const clamp=(n)=>Math.max(0,Math.min(1,n));
  function update(){
    raf=0;
    if(reduced.matches||innerWidth<=760){
      stage.style.opacity='';
      shell.style.opacity='';
      shell.style.transform='';
      return;
    }
    const vh=innerHeight;
    const offerTop=offers.getBoundingClientRect().top;
    // Den nye sektion overtager gradvist den sidste del af billedfortællingen.
    const progress=clamp((vh*.88-offerTop)/(vh*.82));
    stage.style.opacity=String(1-clamp(progress*1.55));
    shell.style.opacity=String(clamp((progress-.08)/.75));
    shell.style.transform=`translate3d(0,${((1-progress)*28).toFixed(1)}px,0)`;
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(update)}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener?.('change',schedule);
  update();
})();
