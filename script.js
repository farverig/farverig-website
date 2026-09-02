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

const offerObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  entry.target.classList.toggle('is-visible',entry.isIntersecting);
}),{threshold:.18,rootMargin:'0px 0px -8% 0px'});

document.querySelectorAll('.offer-item').forEach(item=>offerObserver.observe(item));
