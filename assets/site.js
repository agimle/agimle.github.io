const menu=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
if(menu&&navigation){
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
  navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');}});
}
const tocLinks=[...document.querySelectorAll('.document-toc a')];
if(tocLinks.length&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){tocLinks.forEach(link=>link.classList.toggle('active',link.hash==='#'+entry.target.id));}}},{rootMargin:'-10% 0px -70% 0px'});
 document.querySelectorAll('.document-body h2,.document-body h3').forEach(heading=>observer.observe(heading));
}
const toc=document.querySelector('.document-sidebar details');
if(toc){const small=matchMedia('(max-width:760px)');const update=()=>{toc.open=!small.matches;};update();small.addEventListener('change',update);}
const progress=document.querySelector('.reading-progress');
if(progress){const update=()=>{const available=document.documentElement.scrollHeight-innerHeight;progress.value=available>0?100*scrollY/available:0;};addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();}

const dialog=document.querySelector('.figure-dialog');
if(dialog){
 const viewer=dialog.querySelector('#figure-image');
 const scroll=dialog.querySelector('.figure-scroll');
 const title=dialog.querySelector('#figure-title');
 const scaleLabel=dialog.querySelector('#figure-scale');
 let naturalWidth=1,currentWidth=1;
 const setWidth=width=>{currentWidth=Math.max(60,Math.min(naturalWidth*5,width));viewer.style.width=`${currentWidth}px`;scaleLabel.value=`${Math.round(100*currentWidth/naturalWidth)}%`;};
 const fit=()=>{setWidth(Math.min(naturalWidth,scroll.clientWidth-32));scroll.scrollTo(0,0);};
 document.querySelectorAll('.diagram-trigger').forEach(button=>button.addEventListener('click',()=>{
  const image=button.querySelector('img');
  title.textContent=image.alt;
  viewer.alt=image.alt;
  viewer.onload=()=>{naturalWidth=viewer.naturalWidth;fit();};
  viewer.src=image.src;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  if(viewer.complete&&viewer.naturalWidth){naturalWidth=viewer.naturalWidth;fit();}
 }));
 dialog.querySelector('[data-figure-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
 dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
 dialog.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{
  const action=button.dataset.zoom;
  if(action==='fit')fit();
  else if(action==='actual')setWidth(naturalWidth);
  else setWidth(currentWidth*(action==='in'?1.3:1/1.3));
 }));
}
