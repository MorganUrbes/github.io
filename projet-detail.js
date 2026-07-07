'use strict';
const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(PRM) { /* skip all parallax */ } else {

const heroBg = document.querySelector('.project-hero__bg');
const heroFg = document.querySelector('.project-hero__fg');
const focusBg = document.querySelector('.project-focus__bg');
let rafId = null;

function applyParallax() {
  const y = window.scrollY;
  const hero = document.querySelector('.project-hero');
  if (!hero) return;
  const heroH = hero.offsetHeight;

  // Hero BG — moves slower (0.3 speed)
  if (heroBg && y < heroH * 1.5) {
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  }
  // Hero FG — moves at different speed (0.15)
  if (heroFg && y < heroH * 1.5) {
    heroFg.style.transform = `translateY(${y * -0.1}px)`;
  }
  // Focus section BG — subtle parallax
  if (focusBg) {
    const focus = focusBg.closest('.project-focus');
    if (focus) {
      const rect = focus.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = -rect.top / (window.innerHeight + rect.height);
        focusBg.style.transform = `translateY(${progress * 60}px)`;
      }
    }
  }
  rafId = null;
}

window.addEventListener('scroll', () => {
  if (!rafId) rafId = requestAnimationFrame(applyParallax);
}, { passive: true });
applyParallax();

} // end if PRM

// ── Progress bar ─────────────────────────────
const bar = document.createElement('div');
bar.style.cssText='position:fixed;top:var(--nav-h);left:0;right:0;height:2px;background:rgba(255,255,255,.06);z-index:99';
const fill = document.createElement('div');
fill.style.cssText='height:100%;background:linear-gradient(90deg,var(--c-accent),var(--c-accent-h));width:0%;transition:width 100ms linear';
bar.appendChild(fill);
document.body.prepend(bar);
window.addEventListener('scroll',()=>{
  const tot=document.documentElement.scrollHeight-window.innerHeight;
  fill.style.width=(tot>0?(scrollY/tot)*100:0)+'%';
},{passive:true});
