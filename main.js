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
