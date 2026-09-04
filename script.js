const logo=document.querySelector('.transforming-logo');
const header=document.querySelector('.site-header');

function update(){
  const p=Math.min(1,Math.max(0,scrollY/(innerHeight*.72)));
  logo.style.width='clamp(8.7rem,'+(38-p*25)+'vw,'+(31-p*20)+'rem)';
  logo.style.top='calc('+(50-p*50)+'% + '+p*1.85+'rem)';
  logo.style.transform='translate(-50%,-'+(50-p*50)+'%)';
  document.querySelector('.hero-label').style.opacity=Math.max(0,1-p*3.2);
  document.querySelector('.scroll-cue').style.opacity=Math.max(0,1-p*3.2);
}

update();
addEventListener('scroll',update,{passive:true});
addEventListener('resize',update);

const workObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  entry.target.classList.toggle('is-visible',entry.isIntersecting);
}),{threshold:.12,rootMargin:'-6% 0px -6% 0px'});

document.querySelectorAll('.work-shot').forEach(shot=>workObserver.observe(shot));

const workStory=document.querySelector('.work-story');
const storyCopy=document.querySelector('.work-story-copy');
const storyShots=document.querySelectorAll('.story-shot');

function updateStory(){
  if(!workStory)return;
  const rect=workStory.getBoundingClientRect();
  const p=Math.min(1,Math.max(0,-rect.top/Math.max(1,rect.height-innerHeight)));
  storyCopy.style.opacity=p<.88?1:(1-p)/.12;
  storyShots.forEach(shot=>{
    const x=Number(shot.dataset.start)+p*Number(shot.dataset.travel);
    shot.style.transform='translate3d('+x+'vw,0,0) rotate('+shot.dataset.rotate+'deg)';
  });
}

updateStory();
addEventListener('scroll',updateStory,{passive:true});
addEventListener('resize',updateStory);

const offers=document.querySelector('.offers');
let offerHintShown=false;
let offerHintTimer=null;

function checkOfferHint(){
  if(!offers||offerHintShown)return;
  const rect=offers.getBoundingClientRect();
  if(rect.top<=innerHeight*.78&&rect.bottom>=innerHeight*.35){
    offerHintShown=true;
    clearTimeout(offerHintTimer);
    offerHintTimer=setTimeout(()=>{
      offers.classList.add('is-hinting');
      setTimeout(()=>offers.classList.remove('is-hinting'),2000);
    },300);
  }
}

checkOfferHint();
addEventListener('scroll',checkOfferHint,{passive:true});
addEventListener('resize',checkOfferHint);

const bookingLayoutStyle=document.createElement('style');
bookingLayoutStyle.textContent=`
.site-header{opacity:1 !important;pointer-events:none !important;}
.site-header nav{pointer-events:auto !important;}
@media (min-width:1051px){
  .booking-section{
    display:flex !important;
    flex-direction:column !important;
    grid-template-columns:none !important;
    grid-template-rows:none !important;
    min-height:92vh !important;
    align-items:stretch !important;
    padding:clamp(2rem,2.6vh,2.6rem) clamp(5rem,8vw,9rem) clamp(4rem,5.5vh,5rem) !important;
  }
  .booking-intro{
    grid-column:auto !important;
    grid-row:auto !important;
    position:static !important;
    top:auto !important;
    align-self:auto !important;
    width:100% !important;
    margin:0 auto clamp(1.5rem,2vh,2rem) !important;
    text-align:center !important;
  }
  .booking-kicker{margin:0 0 .45rem !important;}
  .booking-title{
    max-width:13ch !important;
    margin:0 auto !important;
    font-size:clamp(3.5rem,6.05vw,6.8rem) !important;
    line-height:.84 !important;
  }
  .booking-form{
    grid-column:auto !important;
    grid-row:auto !important;
    width:min(84%,58rem) !important;
    margin:0 auto !important;
    align-self:auto !important;
  }
  .booking-grid{column-gap:clamp(2rem,4vw,4.5rem) !important;}
  .booking-field{padding-bottom:clamp(1.4rem,2vh,2rem) !important;}
  .booking-field label{font-size:clamp(.64rem,.7vw,.74rem) !important;margin-bottom:.38rem !important;}
  .booking-field input,.booking-field textarea{
    font-size:clamp(1.4rem,1.95vw,2.15rem) !important;
    padding-bottom:.5rem !important;
  }
  .booking-field textarea{min-height:clamp(4.8rem,7.5vh,6.2rem) !important;}
}
.booking-submit,.booking-note{display:none !important;}
.scroll-cue{display:none !important;}
.book-button{
  left:50% !important;
  right:auto !important;
  bottom:clamp(2.9rem,3.7vh,3.5rem) !important;
  transform:translateX(-50%);
  min-width:clamp(17rem,22vw,22rem);
  justify-content:center;
  padding-left:1.4rem !important;
  padding-right:1.4rem !important;
  transition:background .25s,color .25s,opacity .25s,border-color .25s,transform .25s,min-width .25s;
}
.book-button span:first-child{white-space:nowrap;}
.book-button .book-arrow{display:none !important;}
.book-button:hover{transform:translateX(-50%) translateY(-2px);}
.book-button.is-form-state{min-width:clamp(12.5rem,15vw,15rem);backdrop-filter:blur(14px);}
.book-button.is-form-state.is-incomplete{opacity:.48;}
.book-button.is-form-state.is-ready{opacity:1;}
.book-button.is-success{min-width:clamp(14rem,19vw,19rem);}
.hero-scroll-arrow{
  position:fixed;
  z-index:40;
  left:50%;
  bottom:clamp(.7rem,1vh,1rem);
  width:1.25rem;
  height:.72rem;
  transform:translateX(-50%);
  opacity:1;
  pointer-events:none;
  transition:opacity .35s ease;
  animation:hero-arrow-nudge 1.7s ease-in-out infinite;
}
.hero-scroll-arrow::before,.hero-scroll-arrow::after{
  content:'';
  position:absolute;
  top:.18rem;
  width:.9rem;
  height:1px;
  background:rgba(255,255,255,.92);
}
.hero-scroll-arrow::before{right:50%;transform-origin:right center;transform:rotate(36deg);}
.hero-scroll-arrow::after{left:50%;transform-origin:left center;transform:rotate(-36deg);}
.hero-scroll-arrow.is-hidden{opacity:0;}
@keyframes hero-arrow-nudge{
  0%,100%{transform:translateX(-50%) translateY(0)}
  50%{transform:translateX(-50%) translateY(.34rem)}
}
.booking-section.form-nudge{animation:form-nudge .42s ease;}
@keyframes form-nudge{0%,100%{filter:none}50%{filter:brightness(1.14)}}
`;
document.head.appendChild(bookingLayoutStyle);

const bookingSection=document.querySelector('.booking-section');
const bookingForm=document.querySelector('.booking-form');
const globalCta=document.querySelector('.book-button');
const requiredFields=bookingForm?[...bookingForm.querySelectorAll('input,textarea')]:[];
let successState=false;

const heroScrollArrow=document.createElement('span');
heroScrollArrow.className='hero-scroll-arrow';
document.body.appendChild(heroScrollArrow);

function updateHeroScrollArrow(){
  const show=scrollY<innerHeight*.58;
  heroScrollArrow.classList.toggle('is-hidden',!show);
}

updateHeroScrollArrow();
addEventListener('scroll',updateHeroScrollArrow,{passive:true});
addEventListener('resize',updateHeroScrollArrow);

function fieldComplete(field){
  return field.value.trim().length>0;
}

function formComplete(){
  return requiredFields.length>0&&requiredFields.every(fieldComplete);
}

function bookingInView(){
  if(!bookingSection)return false;
  const rect=bookingSection.getBoundingClientRect();
  return rect.top<innerHeight*.72&&rect.bottom>innerHeight*.25;
}

function setCta(label){
  if(!globalCta)return;
  globalCta.innerHTML=`<span>${label}</span>`;
}

function updateGlobalCta(){
  if(!globalCta||successState)return;
  if(!bookingInView()){
    globalCta.classList.remove('is-form-state','is-incomplete','is-ready');
    setCta('BOOK OS TIL DIT NÆSTE EVENT');
    return;
  }
  globalCta.classList.add('is-form-state');
  if(formComplete()){
    globalCta.classList.remove('is-incomplete');
    globalCta.classList.add('is-ready');
    setCta('SEND FORESPØRGSEL');
  }else{
    globalCta.classList.add('is-incomplete');
    globalCta.classList.remove('is-ready');
    setCta('SEND FORESPØRGSEL');
  }
}

if(globalCta&&bookingSection&&bookingForm){
  globalCta.removeAttribute('href');
  globalCta.setAttribute('role','button');
  globalCta.setAttribute('tabindex','0');

  const handleCta=()=>{
    if(successState)return;
    if(!bookingInView()){
      bookingSection.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    if(!formComplete()){
      const firstEmpty=requiredFields.find(field=>!fieldComplete(field));
      bookingSection.classList.remove('form-nudge');
      void bookingSection.offsetWidth;
      bookingSection.classList.add('form-nudge');
      if(firstEmpty){firstEmpty.focus({preventScroll:false});}
      return;
    }

    // Visual prototype only. Real sending is connected later via Web3Forms.
    successState=true;
    globalCta.classList.remove('is-incomplete','is-ready');
    globalCta.classList.add('is-success');
    setCta('TAK — VI SVARER SNART');
  };

  globalCta.addEventListener('click',event=>{event.preventDefault();handleCta();});
  globalCta.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();handleCta();}
  });
  requiredFields.forEach(field=>field.addEventListener('input',updateGlobalCta));
  addEventListener('scroll',updateGlobalCta,{passive:true});
  addEventListener('resize',updateGlobalCta);
  updateGlobalCta();
}
