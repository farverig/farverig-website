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
    .seen-us{position:relative;z-index:2;background:transparent;overflow:hidden;padding:clamp(5rem,8vh,8rem) 0 clamp(6rem,10vh,9rem)}
    .seen-us-inner{position:relative;z-index:8}
    .seen-us-kicker{margin:0 clamp(1rem,8vw,9rem) clamp(2.5rem,5vh,4rem);color:rgba(255,255,255,.72);font:400 clamp(.72rem,.82vw,.84rem)/1.4 monospace;letter-spacing:.08em;text-transform:uppercase}
    .seen-us-viewport{position:relative;width:100%;overflow:hidden;mask-image:linear-gradient(90deg,transparent 0,#000 7%,#000 93%,transparent 100%)}
    .seen-us-track{display:flex;width:max-content;align-items:flex-start;gap:clamp(4rem,7vw,8rem);padding:1rem clamp(2rem,5vw,5rem);animation:seen-us-scroll 42s linear infinite;will-change:transform}
    .seen-us-viewport:hover .seen-us-track{animation-play-state:paused}
    .seen-us-item{flex:0 0 clamp(13rem,18vw,19rem);margin:0;text-align:center}
    .seen-us-item img{display:block;width:100%;height:clamp(6rem,9vw,9.5rem);object-fit:contain;object-position:center;opacity:.82;filter:grayscale(1) saturate(0) brightness(1.55) contrast(.9);transition:opacity .3s ease,filter .35s ease,transform .35s ease}
    .seen-us-item figcaption{margin-top:1.15rem;color:rgba(255,255,255,.62);font:400 clamp(.62rem,.7vw,.72rem)/1.3 monospace;letter-spacing:.08em;text-transform:uppercase}
    .seen-us-item:hover img{opacity:1;filter:none;transform:scale(1.035)}
    .seen-us-item:hover figcaption{color:#fff}
    @keyframes seen-us-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @media(max-width:760px){
      .seen-us{padding:4rem 0 5rem}
      .seen-us-kicker{margin:0 1rem 2.4rem;font-size:.68rem}
      .seen-us-track{gap:3rem;padding-inline:1.25rem;animation-duration:34s}
      .seen-us-item{flex-basis:11rem}
      .seen-us-item img{height:6.4rem}
    }
    @media(prefers-reduced-motion:reduce){
      .seen-us-viewport{overflow-x:auto;mask-image:none}
      .seen-us-track{animation:none}
    }
  `;
  document.head.appendChild(style);
})();
