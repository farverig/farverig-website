/* Scroll-styret, fast scene: tilbuddene bygges op som en stak. */
(()=>{
  const offers=document.querySelector('.offers');
  const shell=offers?.querySelector('.offers-shell');
  const heading=offers?.querySelector('.offers-heading');
  const items=offers?[...offers.querySelectorAll('.offer-link,.offer-more')]:[];
  if(!offers||!shell||!heading||!items.length)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const wrapper=document.createElement('div');
  wrapper.className='offers-scroll-scene';
  offers.parentNode.insertBefore(wrapper,offers);
  wrapper.appendChild(offers);
  const style=document.createElement('style');
  style.textContent=`
    @media(min-width:761px) and (prefers-reduced-motion:no-preference){
      .offers-scroll-scene{position:relative;height:290vh;margin-top:-100vh;z-index:6;pointer-events:none}
      .offers-scroll-scene .offers{position:sticky;top:0;height:100vh;min-height:100vh;margin-top:0!important;padding-top:clamp(3rem,5vh,5rem)!important;padding-bottom:clamp(3rem,5vh,5rem)!important;background:#090909;opacity:0;pointer-events:none}
      .offers-scroll-scene.is-complete{pointer-events:auto}
      .offers-scroll-scene.is-complete .offers{pointer-events:auto}
      .offers-scroll-scene .offers-cloud{min-height:0}
      .offers-scroll-scene .offers-shell{transform:none!important}
      .offers-scroll-scene .offers-heading,.offers-scroll-scene .offer-link,.offers-scroll-scene .offer-more{will-change:opacity,transform}
    }
  `;
  document.head.appendChild(style);
  const clamp=n=>Math.max(0,Math.min(1,n));
  let raf=0;
  function clear(){
    wrapper.style.height='';
    wrapper.style.marginTop='';
    offers.style.opacity='';
    heading.style.opacity='';
    heading.style.transform='';
    items.forEach(el=>{el.style.opacity='';el.style.transform='';});
    wrapper.classList.add('is-complete');
  }
  function update(){
    raf=0;
    if(reduced.matches||innerWidth<=760){clear();return;}
    wrapper.classList.remove('is-complete');
    const rect=wrapper.getBoundingClientRect();
    const travel=Math.max(1,rect.height-innerHeight);
    const p=clamp(-rect.top/travel);
    // Første del: arbejdsbillederne opløses på stedet.
    const scene=clamp((p-.015)/.17);
    offers.style.opacity=String(scene);
    const intro=clamp((p-.12)/.13);
    heading.style.opacity=String(intro);
    heading.style.transform=`translate3d(0,${((1-intro)*16).toFixed(1)}px,0)`;
    // Hvert ord lander med en lille forskydning oven på den foregående rytme.
    const start=.23,step=.075,duration=.12;
    items.forEach((el,i)=>{
      const t=clamp((p-start-i*step)/duration);
      const eased=1-Math.pow(1-t,3);
      el.style.opacity=String(t);
      el.style.transform=`translate3d(0,${((1-eased)*34).toFixed(1)}px,0)`;
    });
    if(p>=.87)wrapper.classList.add('is-complete');
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(update)}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener?.('change',schedule);
  update();
})();
