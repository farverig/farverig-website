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

// Booking layout experiment: centered statement above the same readable form.
const bookingLayoutStyle=document.createElement('style');
bookingLayoutStyle.textContent=`
@media (min-width:1051px){
  .booking-section{
    display:block;
    min-height:100vh;
    padding:clamp(4.5rem,6vh,6rem) clamp(5rem,8vw,9rem) clamp(4rem,6vh,5.5rem);
  }
  .booking-intro{
    position:static;
    width:100%;
    margin:0 auto clamp(3.8rem,6vh,5.8rem);
    text-align:center;
  }
  .booking-kicker{
    margin-bottom:clamp(1rem,1.8vh,1.5rem);
  }
  .booking-title{
    max-width:13ch;
    margin:0 auto;
    font-size:clamp(3.6rem,6.1vw,6.8rem);
    line-height:.84;
  }
  .booking-form{
    width:min(100%,70rem);
    margin:0 auto;
  }
}
`;
document.head.appendChild(bookingLayoutStyle);
