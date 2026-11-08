/* Scrollprototype: tydelig indtoning af "Vi tilbyder". */
(()=>{
  const offers=document.querySelector('.offers');
  if(!offers)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=n=>Math.max(0,Math.min(1,n));
  let frame=0;
  function update(){
    frame=0;
    if(reduced.matches||innerWidth<=760){
      offers.style.opacity='';
      offers.style.transform='';
      return;
    }
    const top=offers.getBoundingClientRect().top;
    const vh=innerHeight;
    // Fade foregår mens tilbudssektionen kommer ind i viewporten.
    // Først helt synlig når dens top er tæt på toppen af skærmen.
    const progress=clamp((vh*.94-top)/(vh*.82));
    offers.style.opacity=String(progress);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update)}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener?.('change',schedule);
  update();
})();
