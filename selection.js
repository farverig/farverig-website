(()=>{
  const style=document.createElement('style');
  style.textContent=`
    ::selection{background:rgba(0,0,0,.001);color:#000;text-shadow:none}
    ::-moz-selection{background:#cc7197;color:#000;text-shadow:none}
    #farverig-selection-layer{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden}
    .farverig-selection-mark{position:absolute;border-radius:.08em;background:linear-gradient(90deg,#b8d86a 0%,#e7c85b 14%,#e88758 28%,#e66f68 42%,#cc7197 57%,#8a70c5 71%,#628ac7 85%,#54a99b 100%);opacity:.94}
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
