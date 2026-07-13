'use strict';
const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Nav ──────────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id],footer[id],main[id]');
let tick = false;
function onScroll(){if(!tick){requestAnimationFrame(()=>{const y=scrollY;navbar?.classList.toggle('scrolled',y>20);let cur='';sections.forEach(s=>{if(y>=s.offsetTop-100)cur=s.id});navLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href').replace('#','')===cur));tick=false});tick=true}}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

// ── Mobile menu ──────────────────────────────
const burger=document.querySelector('.nav-burger');
const mMenu=document.getElementById('mobile-menu');
burger?.addEventListener('click',()=>{const o=burger.getAttribute('aria-expanded')==='true';burger.setAttribute('aria-expanded',String(!o));mMenu.hidden=o});
document.querySelectorAll('.mobile-link').forEach(l=>l.addEventListener('click',()=>{burger?.setAttribute('aria-expanded','false');if(mMenu)mMenu.hidden=true}));
document.addEventListener('click',e=>{if(!navbar?.contains(e.target)){burger?.setAttribute('aria-expanded','false');if(mMenu)mMenu.hidden=true}});

// ── Hero reveal ──────────────────────────────
function initHeroReveal(){document.querySelectorAll('.hero .reveal-line').forEach(l=>{const d=parseInt(l.dataset.delay||'0',10);setTimeout(()=>l.classList.add('animated'),200+d)})}
if(PRM){document.querySelectorAll('.reveal-line').forEach(e=>{e.style.opacity='1';e.style.transform='none'})}
else{document.fonts?document.fonts.ready.then(initHeroReveal):window.addEventListener('load',initHeroReveal)}

// ── Scroll reveal ─────────────────────────────
function initReveal(){const items=document.querySelectorAll('.reveal-up');if(!('IntersectionObserver'in window)){items.forEach(e=>e.classList.add('in-view'));return}
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{const el=e.target;const d=parseInt(el.dataset.delay||'0',10);if(e.isIntersecting){el.classList.remove('out-view');PRM?el.classList.add('in-view'):setTimeout(()=>el.classList.add('in-view'),d)}else{const r=e.boundingClientRect;if(r.top<0){el.classList.remove('in-view');el.classList.add('out-view');setTimeout(()=>el.classList.remove('out-view'),350)}}})},{threshold:.08,rootMargin:'0px 0px -40px 0px'});items.forEach(e=>obs.observe(e))}
initReveal();

// ── Carousel ─────────────────────────────────
function initCarousel(){const t=document.getElementById('carousel-track');if(!t)return;t.innerHTML=t.innerHTML+t.innerHTML;if(PRM)t.style.animationPlayState='paused'}
initCarousel();

// ── Smooth scroll ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1);if(!id)return;const t=document.getElementById(id);if(!t)return;e.preventDefault();const h=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),10)||64;window.scrollTo({top:t.getBoundingClientRect().top+scrollY-h,behavior:PRM?'instant':'smooth'})})});

// ── Steps hover ──────────────────────────────
const steps=document.querySelectorAll('.step');const stepsLine=document.querySelector('.steps-line');
steps.forEach((s,i)=>{s.addEventListener('mouseenter',()=>{if(!stepsLine)return;const p=((i+.5)/steps.length)*100;stepsLine.style.background=`linear-gradient(90deg,transparent 0%,rgba(108,75,246,.3) 15%,rgba(108,75,246,.8) ${p}%,rgba(108,75,246,.3) 85%,transparent 100%)`});s.addEventListener('mouseleave',()=>{if(stepsLine)stepsLine.style.background=''})});

// ── CV preview modal ──────────────────────────
(function(){
  const triggers=document.querySelectorAll('.cv-trigger');
  if(!triggers.length)return;
  const pdfUrl=triggers[0].getAttribute('href');
  let modal;
  function buildModal(){
    modal=document.createElement('div');
    modal.className='cv-modal-overlay';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.setAttribute('aria-label','Aperçu du CV');
    modal.innerHTML=`<div class="cv-modal-box"><div class="cv-modal-header"><p class="cv-modal-title">Aperçu du CV</p><div class="cv-modal-actions"><a href="${pdfUrl}" download class="btn btn--primary btn--sm">Télécharger le CV</a><button class="cv-modal-close" aria-label="Fermer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div></div><div class="cv-modal-frame-wrap"><div class="cv-modal-loader" role="status" aria-live="polite"><span class="cv-modal-spinner"></span><span class="cv-modal-loader-text">Chargement du CV…</span></div><iframe src="${pdfUrl}" class="cv-modal-frame" title="Aperçu du CV de Morgan Urbes"></iframe></div></div>`;
    document.body.appendChild(modal);
    const frame=modal.querySelector('.cv-modal-frame');
    const loader=modal.querySelector('.cv-modal-loader');
    frame.addEventListener('load',()=>{frame.classList.add('loaded');loader.hidden=true});
    modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
    modal.querySelector('.cv-modal-close').addEventListener('click',closeModal);
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
  }
  function openModal(){if(!modal)buildModal();modal.classList.add('open');document.body.style.overflow='hidden'}
  function closeModal(){if(!modal)return;modal.classList.remove('open');document.body.style.overflow=''}
  triggers.forEach(t=>t.addEventListener('click',e=>{e.preventDefault();openModal()}));
})();
