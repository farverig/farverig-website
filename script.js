const logo=document.querySelector('.transforming-logo');
const header=document.querySelector('.site-header');

function update(){
  const p=Math.min(1,Math.max(0,scrollY/(innerHeight*.72)));
  logo.style.width='clamp(8.7rem,'+(38-p*25)+'vw,'+(31-p*20)+'rem)';
  logo.style.top='calc('+(50-p*50)+'% + '+p*1.85+'rem)';
  logo.style.transform='translate(-50%,-'+(50-p*50)+'%)';
  document.querySelector('.hero-label').style.opacity=Math.max(0,1-p*3.2);
  document.querySelector('.scroll-cue').style.opacity=Math.max(0,1-p*3.2);
  header.classList.toggle('is-settled',p>.82);
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

// Booking layout experiment: centered statement above a slightly smaller, still readable form.
const bookingLayoutStyle=document.createElement('style');
bookingLayoutStyle.textContent=`
@media (min-width:1051px){
  .booking-section{
    display:flex !important;
    flex-direction:column !important;
    grid-template-columns:none !important;
    grid-template-rows:none !important;
    min-height:100vh !important;
    align-items:stretch !important;
    padding:clamp(2.4rem,3vh,3rem) clamp(5rem,8vw,9rem) clamp(2.4rem,3vh,3rem) !important;
  }
  .booking-intro{
    grid-column:auto !important;
    grid-row:auto !important;
    position:static !important;
    top:auto !important;
    align-self:auto !important;
    width:100% !important;
    margin:0 auto clamp(2rem,2.8vh,2.7rem) !important;
    text-align:center !important;
  }
  .booking-kicker{margin:0 0 .45rem !important;}
  .booking-title{
    max-width:13ch !important;
    margin:0 auto !important;
    font-size:clamp(2.8rem,4.4vw,4.9rem) !important;
    line-height:.84 !important;
  }
  .booking-form{
    grid-column:auto !important;
    grid-row:auto !important;
    width:min(88%,62rem) !important;
    margin:0 auto !important;
    align-self:auto !important;
  }
  .booking-grid{column-gap:clamp(2rem,4vw,4.5rem) !important;}
  .booking-field{padding-bottom:clamp(1.55rem,2.35vh,2.25rem) !important;}
  .booking-field label{font-size:clamp(.66rem,.72vw,.76rem) !important;margin-bottom:.42rem !important;}
  .booking-field input,.booking-field textarea{
    font-size:clamp(1.5rem,2.15vw,2.35rem) !important;
    padding-bottom:.55rem !important;
  }
  .booking-field textarea{min-height:clamp(5.5rem,9vh,7.2rem) !important;}
  .booking-submit{
    margin-top:.25rem !important;
    padding:clamp(.85rem,1.35vh,1.15rem) 0 !important;
    font-size:clamp(2rem,3.6vw,3.9rem) !important;
  }
  .booking-note{margin-top:.75rem !important;font-size:.64rem !important;}
}
`;
document.head.appendChild(bookingLayoutStyle);
