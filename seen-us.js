(()=>{
  const offers=document.querySelector('.offers');
  const booking=document.querySelector('.booking-section');
  if(!offers||!booking||document.querySelector('.seen-us'))return;
  const logos=['Distortion Ø.png','Grøn Koncert.png','Karrusel Festival.webp','Lunden.png','Saks Potts.png','Syd for Solen.png','Tivoli.png'];
  const label=file=>file.replace(/\.(png|jpe?g|webp|svg)$/i,'');
  const encodePath=file=>`assets/billeder/her-har-du-set-os/${encodeURIComponent(file)}`;
  const section=document.createElement('section');section.className='seen-us';section.setAttribute('aria-labelledby','seen-us-title');
  const makeItem=file=>{const item=document.createElement('figure');item.className='seen-us-item';const img=document.createElement('img');img.src=encodePath(file);img.alt=label(file);img.loading='lazy';const caption=document.createElement('figcaption');caption.textContent=label(file);item.append(img,caption);return item;};
  const inner=document.createElement('div');inner.className='seen-us-inner';const heading=document.createElement('p');heading.className='seen-us-kicker';heading.id='seen-us-title';heading.textContent='HER HAR DU MÅSKE SET OS MALE';
  const viewport=document.createElement('div');viewport.className='seen-us-viewport';viewport.setAttribute('aria-label','Steder hvor FARVERIG har malet');const track=document.createElement('div');track.className='seen-us-track';
  [...logos,...logos].forEach((file,index)=>{const item=makeItem(file);if(index>=logos.length)item.setAttribute('aria-hidden','true');track.appendChild(item);});viewport.appendChild(track);inner.append(heading,viewport);section.appendChild(inner);booking.before(section);
  const style=document.createElement('style');style.textContent=`
    .seen-us{position:relative;z-index:2;background:transparent;overflow:hidden;padding:clamp(5.8rem,8.5vh,8rem) 0 clamp(6.8rem,9.5vh,9rem)}
    .seen-us-inner{position:relative;z-index:8;padding-inline:clamp(5rem,8vw,9rem)}
    .seen-us-kicker{margin:0 0 clamp(1.45rem,2.3vh,2rem);color:rgba(255,255,255,.72);font:400 clamp(.72rem,.82vw,.84rem)/1.4 monospace;letter-spacing:.08em;text-transform:uppercase}
    .seen-us-viewport{position:relative;width:100%;overflow:hidden;perspective:780px;-webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.22) 2%,rgba(0,0,0,.72) 5%,#000 9%,#000 91%,rgba(0,0,0,.72) 95%,rgba(0,0,0,.22) 98%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.22) 2%,rgba(0,0,0,.72) 5%,#000 9%,#000 91%,rgba(0,0,0,.72) 95%,rgba(0,0,0,.22) 98%,transparent 100%)}
    .seen-us-track{display:flex;width:max-content;align-items:center;gap:clamp(1.35rem,2vw,2.2rem);padding:clamp(1rem,2vh,1.6rem) 0 clamp(1.6rem,2.8vh,2.3rem);will-change:transform}
    .seen-us-item{--seen-scale:.72;--seen-z:0px;flex:0 0 clamp(11rem,15vw,16rem);margin:0;text-align:center;transform:translateZ(var(--seen-z)) scale(var(--seen-scale));transform-origin:center;opacity:1;transition:transform .12s linear,filter .18s linear;will-change:transform,filter}
    .seen-us-item img{display:block;width:100%;height:clamp(6.4rem,8.8vw,9.6rem);object-fit:contain;object-position:center;opacity:1;filter:grayscale(1) saturate(0) brightness(1.65) contrast(.92);transition:filter .28s ease,transform .28s ease}
    .seen-us-item figcaption{margin-top:.62rem;color:rgba(255,255,255,.72);font:400 clamp(.6rem,.67vw,.7rem)/1.3 monospace;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;opacity:0;transform:translateY(.38rem);transition:opacity .24s ease,transform .3s cubic-bezier(.2,.7,.2,1),color .24s ease}
    .seen-us-item:hover img{filter:none;transform:scale(1.03)}
    .seen-us-item:hover figcaption{color:#fff;opacity:1;transform:translateY(0)}
    @media(hover:none){.seen-us-item figcaption{opacity:.72;transform:none}}
    @media(max-width:760px){.seen-us{padding:4.5rem 0 5.2rem}.seen-us-inner{padding-inline:1.15rem}.seen-us-kicker{margin-bottom:1.55rem;font-size:.68rem}.seen-us-track{gap:1.15rem;padding-block:1rem 1.6rem}.seen-us-item{flex-basis:9.8rem}.seen-us-item img{height:6.2rem}.seen-us-viewport{-webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.5) 5%,#000 13%,#000 87%,rgba(0,0,0,.5) 95%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.5) 5%,#000 13%,#000 87%,rgba(0,0,0,.5) 95%,transparent 100%)}}
    @media(prefers-reduced-motion:reduce){.seen-us-viewport{overflow-x:auto;-webkit-mask-image:none;mask-image:none}.seen-us-item{--seen-scale:1;--seen-z:0px;filter:none!important}.seen-us-item figcaption{transform:none}}
  `;document.head.appendChild(style);

  const items=[...track.querySelectorAll('.seen-us-item')];
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let depthRaf=0;
  let carouselAnimation=null;
  let currentRate=1;
  let targetRate=1;
  let rateRaf=0;

  function setupCarousel(){
    if(reducedMotion.matches||!track.animate)return;
    carouselAnimation?.cancel();
    carouselAnimation=track.animate([
      {transform:'translate3d(0,0,0)'},
      {transform:'translate3d(-50%,0,0)'}
    ],{duration:32000,iterations:Infinity,easing:'linear'});
    carouselAnimation.playbackRate=currentRate;
  }

  function easePlaybackRate(){
    rateRaf=0;
    if(!carouselAnimation)return;
    currentRate+=(targetRate-currentRate)*.11;
    if(Math.abs(targetRate-currentRate)<.008)currentRate=targetRate;
    carouselAnimation.playbackRate=currentRate;
    if(currentRate!==targetRate)rateRaf=requestAnimationFrame(easePlaybackRate);
  }

  function setRate(rate){
    targetRate=rate;
    if(!rateRaf)rateRaf=requestAnimationFrame(easePlaybackRate);
  }

  viewport.addEventListener('mouseenter',()=>setRate(.48));
  viewport.addEventListener('mouseleave',()=>setRate(1));

  function updateDepth(){
    depthRaf=0;
    if(reducedMotion.matches)return;
    const box=viewport.getBoundingClientRect();
    const center=box.left+box.width/2;
    const radius=Math.max(1,box.width*.52);
    const edgeZone=box.width*.105;
    items.forEach(item=>{
      const r=item.getBoundingClientRect();
      const itemCenter=r.left+r.width/2;
      const distance=Math.min(1,Math.abs(itemCenter-center)/radius);
      const focus=Math.pow(1-distance,1.08);
      const scale=.62+focus*.58;
      const z=focus*54;
      item.style.setProperty('--seen-scale',scale.toFixed(3));
      item.style.setProperty('--seen-z',`${z.toFixed(1)}px`);
      const edgeDistance=Math.min(itemCenter-box.left,box.right-itemCenter);
      const edge=Math.max(0,Math.min(1,edgeDistance/edgeZone));
      const blur=(1-edge)*13;
      const glow=(1-edge)*8;
      item.style.filter=`blur(${blur.toFixed(1)}px) drop-shadow(0 0 ${glow.toFixed(1)}px rgba(255,255,255,.34))`;
    });
    depthRaf=requestAnimationFrame(updateDepth);
  }

  setupCarousel();
  depthRaf=requestAnimationFrame(updateDepth);
  addEventListener('resize',()=>{if(!depthRaf)depthRaf=requestAnimationFrame(updateDepth);},{passive:true});
})();
