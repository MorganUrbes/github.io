'use strict';
const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Progress bar ─────────────────────────────
const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;right:0;height:2px;background:rgba(255,255,255,.06);z-index:999;pointer-events:none;margin-top:var(--nav-h)';
const fill = document.createElement('div');
fill.style.cssText = 'height:100%;background:linear-gradient(90deg,#6C4BF6,#8B6EF8);width:0%;transition:width 80ms linear';
bar.appendChild(fill);
document.body.prepend(bar);
window.addEventListener('scroll', () => {
  const tot = document.documentElement.scrollHeight - window.innerHeight;
  fill.style.width = (tot > 0 ? (scrollY / tot) * 100 : 0) + '%';
}, { passive: true });

// ── Parallaxe hero BG uniquement ─────────────
// Simple et robuste : translate le BG vers le bas au scroll
if (!PRM) {
  const heroBg = document.querySelector('.project-hero__bg');
  const heroEl = document.querySelector('.project-hero');

  if (heroBg && heroEl) {
    window.addEventListener('scroll', () => {
      const y = scrollY;
      const h = heroEl.offsetHeight;
      if (y < h * 1.5) {
        // BG descend à 30% de la vitesse du scroll → effet parallaxe
        heroBg.style.transform = `translateY(${y * 0.3}px)`;
      }
    }, { passive: true });
  }

  // ── Reveals au scroll ──────────────────────
  const items = document.querySelectorAll(
    '.enjeu-card, .intervention-item, .project-context__block, .project-enjeux__header, .project-interventions__header'
  );

  if (items.length && 'IntersectionObserver' in window) {
    // Init
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity .5s ease, transform .5s ease`;
      // Stagger pour les enjeux cards
      if (el.classList.contains('enjeu-card')) {
        el.style.transitionDelay = `${(i % 3) * 0.08}s`;
      }
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => obs.observe(el));
  }
}
