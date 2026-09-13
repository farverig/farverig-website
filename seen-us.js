(()=>{
  const offers=document.querySelector('.offers');
  const booking=document.querySelector('.booking-section');
  if(!offers||!booking||document.querySelector('.seen-us'))return;

  const logos=[
    'Distortion Ø.png','Grøn Koncert.jpeg','Karrusel Festival.webp','Lunden.png','Saks Potts.png','Syd for Solen.png','Tivoli.png'
  ];
  const label=file=>file.replace(/\.(png|jpe?g|webp|svg)$/i,'');
  const encodePath=file=>`assets/billeder/her-har-du-set-os/${encodeURIComponent(file).replace(/%2F/g,'/')}`;

  const section=document.createElement('section'); section.className='seen-us'; section.setAttribute('aria-labelledby','seen-us-title');
  const makeItem=file=>{const item=document.createElement('figure');item.className='seen-us-item';const img=document.createElement('img');img.src=encodePath(file);img.alt=label(file);img.loading='lazy';const caption=document.createElement('figcaption');caption.textContent=label(file);item.append(img,caption);return item;};
  const inner=document.createElement('div');inner.className='seen-us-inner';
  const heading=document.createElement('p');heading.className='seen-us-kicker';heading.id='seen-us-title';heading.textContent='HER HAR DU MÅSKE SET OS MALE';
  const viewport=document.createElement('div');viewport.className='seen-us-viewport';viewport.setAttribute('aria-label','Steder hvor FARVERIG har malet');
  const track=document.createElement('div');track.className='seen-us-track';
  [...logos,...logos].forEach((file,index)=>{const item=makeItem(file);if(index>=logos.length)item.setAttribute('aria-hidden','true');track.appendChild(item);});
  viewport.appendChild(track);inner.append(heading,viewport);section.appendChild(inner);booking.before(section);

  const style=document.createElement('style');
  style.textContent=`
    .seen-us{position:relative;z-index:2;background:transparent;overflow:hidden;padding:clamp(7rem,11vh,10rem) 0 clamp(8rem,12vh,11rem)}
    .seen-us-inner{position:relative;z-index:8;padding-inline:clamp(4rem,6vw,7rem)}
    .seen-us-kicker{margin:0 0 clamp(2.2rem,4vh,3.4rem);color:rgba(255,255,255,.72);font:400 clamp(.72rem,.82vw,.84rem)/1.4 monospace;letter-spacing:.08em;text-transform:uppercase}
    .seen-us-viewport{position:relative;width:100%;overflow:hidden;padding-block:clamp(2rem,4vh,3.5rem);margin-block:clamp(-2rem,-4vh,-3.5rem)}
    .seen-us-viewport::before,.seen-us-viewport::after{content:'';position:absolute;z-index:6;top:-70%;bottom:-70%;width:clamp(8rem,13vw,15rem);pointer-events:none;backdrop-filter:blur(54px);-webkit-backdrop-filter:blur(54px);filter:blur(10px)}
    .seen-us-viewport::before{left:-4rem;background:linear-gradient(90deg,rgba(9,9,9,.99) 0%,rgba(9,9,9,.88) 16%,rgba(9,9,9,.58) 38%,rgba(9,9,9,.26) 61%,rgba(9,9,9,.07) 80%,rgba(9,9,9,0) 100%);mask-image:linear-gradient(90deg,#000 0%,#000 12%,rgba(0,0,0,.96) 28%,rgba(0,0,0,.7) 54%,rgba(0,0,0,.3) 76%,transparent 100%)}
    .seen-us-viewport::after{right:-4rem;background:linear-gradient(270deg,rgba(9,9,9,.99) 0%,rgba(9,9,9,.88) 16%,rgba(9,9,9,.58) 38%,rgba(9,9,9,.26) 61%,rgba(9,9,9,.07) 80%,rgba(9,9,9,0) 100%);mask-image:linear-gradient(270deg,#000 0%,#000 12%,rgba(0,0,0,.96) 28%,rgba(0,0,0,.7) 54%,rgba(0,0,0,.3) 76%,transparent 100%)}
    .seen-us-track{display:flex;width:max-content;align-items:center;gap:clamp(1.35rem,2vw,2.2rem);padding:clamp(1.5rem,3vh,2.5rem) 0 clamp(2rem,3.5vh,3rem);animation:seen-us-scroll 42s linear infinite;will-change:transform}
    .seen-us-viewport:hover .seen-us-track{animation-play-state:paused}
    .seen-us-item{--seen-scale:.9;flex:0 0 clamp(10rem,13.5vw,14rem);margin:0;text-align:center;transform:scale(var(--seen-scale));transform-origin:center;opacity:1;transition:transform .16s linear;will-change:transform}
    .seen-us-item img{display:block;width:100%;height:clamp(5.5rem,7.6vw,8.2rem);object-fit:contain;object-position:center;opacity:1;filter:grayscale(1) saturate(0) brightness(1.65) contrast(.92);transition:filter .28s ease,transform .28s ease}
    .seen-us-item figcaption{margin-top:.68rem;color:rgba(255,255,255,.72);font:400 clamp(.6rem,.67vw,.7rem)/1.3 monospace;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
    .seen-us-item:hover img{filter:none;transform:scale(1.03)} .seen-us-item:hover figcaption{color:#fff}
    @keyframes seen-us-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @media(max-width:1050px){.seen-us-inner{padding-inline:clamp(1.75rem,4vw,2.5rem)}}
    @media(max-width:760px){.seen-us{padding:5rem 0 6rem}.seen-us-inner{padding-inline:.75rem}.seen-us-kicker{margin-bottom:2.1rem;font-size:.68rem}.seen-us-track{gap:1.15rem;padding-block:1.5rem 2rem;animation-duration:34s}.seen-us-item{flex-basis:9.2rem}.seen-us-item img{height:5.8rem}.seen-us-viewport::before,.seen-us-viewport::after{width:6.5rem;top:-55%;bottom:-55%;backdrop-filter:blur(38px);-webkit-backdrop-filter:blur(38px);filter:blur(8px)}.seen-us-viewport::before{left:-2.5rem}.seen-us-viewport::after{right:-2.5rem}}
    @media(prefers-reduced-motion:reduce){.seen-us-viewport{overflow-x:auto}.seen-us-viewport::before,.seen-us-viewport::after{display:none}.seen-us-track{animation:none}.seen-us-item{--seen-scale:1}}
  `;
  document.head.appendChild(style);

  const items=[...track.querySelectorAll('.seen-us-item')];const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');let depthRaf=0;
  function updateDepth(){depthRaf=0;if(reducedMotion.matches)return;const box=viewport.getBoundingClientRect();const center=box.left+box.width/2;const radius=Math.max(1,box.width*.58);items.forEach(item=>{const r=item.getBoundingClientRect();const itemCenter=r.left+r.width/2;const distance=Math.min(1,Math.abs(itemCenter-center)/radius);const focus=Math.pow(1-distance,1.25);const scale=.86+focus*.16;item.style.setProperty('--seen-scale',scale.toFixed(3));});depthRaf=requestAnimationFrame(updateDepth);}
  depthRaf=requestAnimationFrame(updateDepth);addEventListener('resize',()=>{if(!depthRaf)depthRaf=requestAnimationFrame(updateDepth);},{passive:true});
})();
