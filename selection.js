(()=>{
  const style=document.createElement('style');
  style.textContent=`
    ::selection{background:transparent;color:#000;text-shadow:none}
    ::-moz-selection{background:#c94f99;color:#000;text-shadow:none}
    #farverig-selection-layer{position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:hidden}
    .farverig-selection-mark{position:absolute;border-radius:.08em;background:linear-gradient(90deg,#20b6a6 0%,#416fef 24%,#735ad9 48%,#c94f99 72%,#ef7064 100%);opacity:.9}
  `;
  document.head.appendChild(style);

  const layer=document.createElement('div');
  layer.id='farverig-selection-layer';
  layer.setAttribute('aria-hidden','true');
  document.body.appendChild(layer);

  let raf=0;
  function drawSelection(){
    raf=0;
    layer.replaceChildren();
    const selection=getSelection();
    if(!selection||selection.isCollapsed||selection.rangeCount===0)return;
    const range=selection.getRangeAt(0);
    [...range.getClientRects()].forEach(rect=>{
      if(rect.width<1||rect.height<1)return;
      const mark=document.createElement('span');
      mark.className='farverig-selection-mark';
      mark.style.left=`${rect.left}px`;
      mark.style.top=`${rect.top}px`;
      mark.style.width=`${rect.width}px`;
      mark.style.height=`${rect.height}px`;
      layer.appendChild(mark);
    });
  }
  function queue(){
    if(!raf)raf=requestAnimationFrame(drawSelection);
  }
  document.addEventListener('selectionchange',queue);
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',queue);
})();
