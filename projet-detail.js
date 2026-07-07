'use strict';
const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Progress bar ─────────────────────────────
const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:var(--nav-h);left:0;right:0;height:2px;background:rgba(255,255,255,.06);z-index:99;pointer-events:none';
const fill = document.createElement('div');
fill.style.cssText = 'height:100%;background:linear-gradient(90deg,#6C4BF6,#8B6EF8);width:0%;transition:width 80ms linear';
bar.appendChild(fill);
document.body.prepend(bar);
window.addEventListener('scroll', () => {
  const tot = document.documentElement.scrollHeight - window.innerHeight;
  fill.style.width = (tot > 0 ? (scrollY / tot) * 100 : 0) + '%';
}, { passive: true });

if (!PRM) {

// ── Éléments ─────────────────────────────────
const heroBg  = document.querySelector('.project-hero__bg');
const heroFg  = document.querySelector('.project-hero__fg');
const heroEl  = document.querySelector('.project-hero');
const focusBg = document.querySelector('.project-focus__bg');
const focusEl = document.querySelector('.project-focus');

// ── Reveals au scroll ────────────────────────
function initReveals() {
  const cards = document.querySelectorAll('.enjeu-card, .intervention-item, .project-gallery__item');
  const blocks = document.querySelectorAll('.project-context__block, .project-enjeux__header, .project-interventions__header');

  const obsCards = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const d = parseInt(e.target.dataset.rd || '0');
      setTimeout(() => {
        e.target.classList.add('rd-visible');
      }, d);
      obsCards.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const obsBlocks = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('rd-visible');
      obsBlocks.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Stagger enjeux cards
  document.querySelectorAll('.enjeu-card').forEach((el, i) => {
    el.dataset.rd = String((i % 3) * 90);
  });

  cards.forEach(el => {
    el.classList.add('rd-init');
    obsCards.observe(el);
  });
  blocks.forEach(el => {
    el.classList.add('rd-init', 'rd-up');
    obsBlocks.observe(el);
  });
}
initReveals();

// ── RAF parallaxe ────────────────────────────
let raf = null;

function applyParallax() {
  const y = scrollY;

  // Hero BG — se déplace plus lentement que le scroll
  if (heroEl && heroBg) {
    const heroH = heroEl.offsetHeight;
    if (y < heroH * 1.5) {
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }

  // Hero FG — centré via CSS top:50%, on ajuste via margin-top
  // On utilise une CSS var pour ne pas écraser le centrage
  if (heroEl && heroFg) {
    const heroH = heroEl.offsetHeight;
    if (y < heroH * 1.5) {
      // Utilise marginTop pour le parallaxe sans toucher au transform du centrage
      heroFg.style.marginTop = `${y * -0.08}px`;
    }
  }

  // Focus BG — parallaxe basé sur la position relative dans la vue
  if (focusEl && focusBg) {
    const rect = focusEl.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = (window.innerHeight * 0.5 - rect.top) / rect.height;
      const shift = progress * 80; // max 80px de déplacement
      focusBg.style.transform = `translateY(${shift}px)`;
    }
  }

  raf = null;
}

window.addEventListener('scroll', () => {
  if (!raf) raf = requestAnimationFrame(applyParallax);
}, { passive: true });

// Lancer une première fois
applyParallax();

} // end if !PRM
