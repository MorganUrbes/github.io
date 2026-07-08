'use strict';
const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Progress bar ─────────────────────────────
const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:64px;left:0;right:0;height:2px;background:rgba(255,255,255,.06);z-index:999;pointer-events:none';
const fill = document.createElement('div');
fill.style.cssText = 'height:100%;background:linear-gradient(90deg,#6C4BF6,#8B6EF8);width:0%;transition:width 80ms linear';
bar.appendChild(fill);
document.body.prepend(bar);
window.addEventListener('scroll', () => {
  const tot = document.documentElement.scrollHeight - window.innerHeight;
  fill.style.width = (tot > 0 ? (scrollY / tot) * 100 : 0) + '%';
}, { passive: true });

if (!PRM) {

  // ── Parallaxe hero BG ──────────────────────
  // Le BG déborde de inset:-30% 0 donc on a ~30% de marge
  // On translate vers le bas au scroll → effet de profondeur
  const heroBg = document.querySelector('.project-hero__bg');
  const heroEl = document.querySelector('.project-hero');

  if (heroBg && heroEl) {
    // Vitesse du parallaxe : 0 = pas de mouvement, 0.4 = très visible
    const SPEED = 0.35;
    let raf = null;

    function updateParallax() {
      const y = window.scrollY;
      const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
      // Seulement quand le hero est visible
      if (y <= heroBottom) {
        heroBg.style.transform = `translateY(${y * SPEED}px)`;
      }
      raf = null;
    }

    window.addEventListener('scroll', () => {
      if (!raf) raf = requestAnimationFrame(updateParallax);
    }, { passive: true });

    updateParallax();
  }

  // ── Reveals au scroll ──────────────────────
  const items = document.querySelectorAll(
    '.enjeu-card, .intervention-item, .project-context__block, ' +
    '.project-enjeux__header, .project-interventions__header'
  );

  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s cubic-bezier(0.16,1,0.3,1), transform .6s cubic-bezier(0.16,1,0.3,1)';
    if (el.classList.contains('enjeu-card')) {
      el.style.transitionDelay = `${(i % 3) * 0.1}s`;
    }
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => obs.observe(el));
}
