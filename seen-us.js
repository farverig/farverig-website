(()=>{
  const offers=document.querySelector('.offers');
  const booking=document.querySelector('.booking-section');
  if(!offers||!booking||document.querySelector('.seen-us'))return;

  const logos=[
    'Distortion Ø.png',
    'Grøn Koncert.jpeg',
    'Karrusel Festival.webp',
    'Lunden.png',
    'Saks Potts.png',
    'Syd for Solen.png',
    'Tivoli.png'
  ];

  const label=file=>file.replace(/\.(png|jpe?g|webp|svg)$/i,'');
  const encodePath=file=>`assets/billeder/her-har-du-set-os/${encodeURIComponent(file).replace(/%2F/g,'/')}`;

  const section=document.createElement('section');
  section.className='seen-us';
  section.setAttribute('aria-labelledby','seen-us-title');

  const makeItem=file=>{
    const item=document.createElement('figure');
    item.className='seen-us-item';
    const img=document.createElement('img');
    img.src=encodePath(file);
    img.alt=label(file);
    img.loading='lazy';
    const caption=document.createElement('figcaption');
    caption.textContent=label(file);
    item.append(img,caption);
    return item;
  };

  const inner=document.createElement('div');
  inner.className='seen-us-inner';
  const heading=document.createElement('p');
  heading.className='seen-us-kicker';
  heading.id='seen-us-title';
  heading.textContent='HER HAR DU MÅSKE SET OS MALE';

  const viewport=document.createElement('div');
  viewport.className='seen-us-viewport';
  viewport.setAttribute('aria-label','Steder hvor FARVERIG har malet');
  const track=document.createElement('div');
  track.className='seen-us-track';

  [...logos,...logos].forEach((file,index)=>{
    const item=makeItem(file);
    if(index>=logos.length)item.setAttribute('aria-hidden','true');
    track.appendChild(item);
  });

  viewport.appendChild(track);
  inner.append(heading,viewport);
  section.appendChild(inner);
  booking.before(section);

  const style=document.createElement('style');
  style.textContent=`
    .seen-us{position:relative;z-index:2;background:transparent;overflow:hidden;padding:clamp(7rem,11vh,10rem) 0 clamp(8rem,12vh,11rem)}
    .seen-us-inner{position:relative;z-index:8;padding-inline:clamp(5rem,8vw,9rem)}
    .seen-us-kicker{margin:0 0 clamp(2.2rem,4vh,3.4rem);color:rgba(255,255,255,.72);font:400 clamp(.72rem,.82vw,.84rem)/1.4 monospace;letter-spacing:.08em;text-transform:uppercase}
    .seen-us-viewport{position:relative;width:100%;overflow:hidden;mask-image:linear-gradient(90deg,transparent 0,#000 9%,#000 91%,transparent 100%)}
    .seen-us-track{display:flex;width:max-content;align-items:center;gap:clamp(1.8rem,2.7vw,3rem);padding:clamp(1.5rem,3vh,2.5rem) 0 clamp(2rem,3.5vh,3rem);animation:seen-us-scroll 42s linear infinite;will-change:transform}
    .seen-us-viewport:hover .seen-us-track{animation-play-state:paused}
    .seen-us-item{--seen-scale:.82;--seen-opacity:.52;--seen-blur:3px;--seen-glow:22px;flex:0 0 clamp(10.5rem,14.5vw,15rem);margin:0;text-align:center;transform:scale(var(--seen-scale));transform-origin:center center;opacity:var(--seen-opacity);transition:opacity .18s linear,transform .18s linear;will-change:transform,opacity}
    .seen-us-item img{display:block;width:100%;height:clamp(5.6rem,8vw,8.6rem);object-fit:contain;object-position:center;filter:grayscale(1) saturate(0) brightness(1.65) contrast(.92) blur(var(--seen-blur)) drop-shadow(0 0 var(--seen-glow) rgba(255,255,255,.18));transition:filter .18s linear}
    .seen-us-item figcaption{margin-top:.72rem;color:rgba(255,255,255,.72);font:400 clamp(.6rem,.67vw,.7rem)/1.3 monospace;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
    .seen-us-item:hover{opacity:1 !important}
    .seen-us-item:hover img{filter:none !important}
    .seen-us-item:hover figcaption{color:#fff}
    @keyframes seen-us-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @media(max-width:1050px){
      .seen-us-inner{padding-inline:clamp(2rem,5vw,3rem)}
    }
    @media(max-width:760px){
      .seen-us{padding:5rem 0 6rem}
      .seen-us-inner{padding-inline:1rem}
      .seen-us-kicker{margin-bottom:2.1rem;font-size:.68rem}
      .seen-us-track{gap:1.5rem;padding-block:1.5rem 2rem;animation-duration:34s}
      .seen-us-item{flex-basis:9.5rem}
      .seen-us-item img{height:5.8rem}
    }
    @media(prefers-reduced-motion:reduce){
      .seen-us-viewport{overflow-x:auto;mask-image:none}
      .seen-us-track{animation:none}
      .seen-us-item{--seen-scale:1;--seen-opacity:1;--seen-blur:0px;--seen-glow:0px}
    }
  `;
  document.head.appendChild(style);

  const items=[...track.querySelectorAll('.seen-us-item')];
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let depthRaf=0;

  function updateDepth(){
    depthRaf=0;
    if(reducedMotion.matches)return;
    const box=viewport.getBoundingClientRect();
    const center=box.left+box.width/2;
    const radius=Math.max(1,box.width*.53);

    items.forEach(item=>{
      const r=item.getBoundingClientRect();
      const itemCenter=r.left+r.width/2;
      const distance=Math.min(1,Math.abs(itemCenter-center)/radius);
      const focus=Math.pow(1-distance,1.35);
      const scale=.72+focus*.42;
      const opacity=.28+focus*.72;
      const blur=(1-focus)*4.2;
      const glow=(1-focus)*30;
      item.style.setProperty('--seen-scale',scale.toFixed(3));
      item.style.setProperty('--seen-opacity',opacity.toFixed(3));
      item.style.setProperty('--seen-blur',`${blur.toFixed(2)}px`);
      item.style.setProperty('--seen-glow',`${glow.toFixed(1)}px`);
    });

    depthRaf=requestAnimationFrame(updateDepth);
  }

  depthRaf=requestAnimationFrame(updateDepth);
  addEventListener('resize',()=>{
    if(!depthRaf)depthRaf=requestAnimationFrame(updateDepth);
  },{passive:true});
})();
