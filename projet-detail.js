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

// ── Parallaxe hero BG + FG ───────────────────
const heroBg  = document.querySelector('.project-hero__bg');
const heroFg  = document.querySelector('.project-hero__fg');
const heroEl  = document.querySelector('.project-hero');

// ── Parallaxe focus BG ───────────────────────
const focusBg = document.querySelector('.project-focus__bg');
const focusEl = document.querySelector('.project-focus');

// ── Reveal au scroll ────────────────────────
// Éléments à animer à l'entrée dans la vue
const revealEls = document.querySelectorAll(
  '.project-context__block, .enjeu-card, .intervention-item, .intervention-with-visual, .intervention-visual, .intervention-visual--full, .project-gallery__item'
);

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.revealDelay || '0', 10);
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
      revealObs.unobserve(el);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach((el, i) => {
  // Init invisible
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)';
  // Stagger pour les cards enjeux (groupes de 3)
  if (el.classList.contains('enjeu-card')) {
    el.dataset.revealDelay = String((i % 3) * 80);
  }
  revealObs.observe(el);
});

// ── Headers de sections ──────────────────────
const sectionHeaders = document.querySelectorAll(
  '.project-enjeux__header, .project-interventions__header, .project-context__grid'
);
const headerObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      headerObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

sectionHeaders.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(32px)';
  el.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)';
  headerObs.observe(el);
});

// ── RAF loop pour parallaxe ──────────────────
let raf = null;

function onScroll() {
  if (!raf) {
    raf = requestAnimationFrame(() => {
      const y = scrollY;

      // Hero parallaxe — BG plus lent, FG légèrement différent
      if (heroEl) {
        const heroH = heroEl.offsetHeight;
        if (y < heroH * 1.5) {
          if (heroBg) heroBg.style.transform = `translateY(${y * 0.28}px)`;
          if (heroFg) heroFg.style.transform = `translateY(calc(-50% + ${y * -0.08}px))`;
        }
      }

      // Focus parallaxe — BG se déplace légèrement
      if (focusEl && focusBg) {
        const rect = focusEl.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          focusBg.style.transform = `translateY(${(progress - 0.5) * -60}px)`;
        }
      }

      raf = null;
    });
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

} // end if !PRM
