'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Navbar ───────────────────────────────────
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id], footer[id]');
let ticking = false;

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 20);
      let current = '';
      sections.forEach(sec => { if (y >= sec.offsetTop - 100) current = sec.id; });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').replace('#','') === current);
      });
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile Menu ──────────────────────────────
const burger     = document.querySelector('.nav-burger');
const mobileMenu = document.getElementById('mobile-menu');

burger?.addEventListener('click', () => {
  const isOpen = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    burger?.setAttribute('aria-expanded', 'false');
    if (mobileMenu) mobileMenu.hidden = true;
  });
});
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    burger?.setAttribute('aria-expanded', 'false');
    if (mobileMenu) mobileMenu.hidden = true;
  }
});

// ── Hero Reveal ──────────────────────────────
function initHeroReveal() {
  document.querySelectorAll('.hero .reveal-line').forEach(line => {
    const delay = parseInt(line.dataset.delay || '0', 10);
    setTimeout(() => line.classList.add('animated'), 200 + delay);
  });
}
if (prefersReducedMotion) {
  document.querySelectorAll('.reveal-line').forEach(el => {
    el.style.opacity = '1'; el.style.transform = 'none';
  });
} else {
  document.fonts ? document.fonts.ready.then(initHeroReveal) : window.addEventListener('load', initHeroReveal);
}

// ── Scroll Reveal — REJOUE à chaque passage ──
// Quand un élément entre dans la vue → in-view
// Quand il repart vers le HAUT → out-view (reset)
// Quand il repasse en vue → in-view de nouveau
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-up');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);

      if (entry.isIntersecting) {
        // Entrée dans la vue → révèle
        el.classList.remove('out-view');
        if (prefersReducedMotion) {
          el.classList.add('in-view');
        } else {
          setTimeout(() => el.classList.add('in-view'), delay);
        }
      } else {
        // Sortie de la vue
        const rect = entry.boundingClientRect;
        // Si l'élément sort par le HAUT → reset pour pouvoir re-animer
        if (rect.top < 0) {
          el.classList.remove('in-view');
          el.classList.add('out-view');
          // Retire out-view rapidement pour préparer la prochaine entrée
          setTimeout(() => el.classList.remove('out-view'), 350);
        }
        // Si sortie par le bas (scroll vers le haut) → pas de reset,
        // l'élément n'est pas encore apparu
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(el => observer.observe(el));
}
initScrollReveal();

// ── Carrousel logos — duplication infinie ────
function initCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;

  // Duplique les items pour le défilement sans saut
  const original = track.innerHTML;
  track.innerHTML = original + original;

  // Pause au hover (déjà géré en CSS sur .carousel-track:hover)
  // Pause si prefers-reduced-motion
  if (prefersReducedMotion) {
    track.style.animationPlayState = 'paused';
  }
}
initCarousel();

// ── Parallaxe hero (fond seulement) ──────────
if (!prefersReducedMotion) {
  const heroGrid = document.querySelector('.hero-grid');
  const heroOrbs = document.querySelectorAll('.hero .orb');
  let heroTicking = false;

  window.addEventListener('scroll', () => {
    if (!heroTicking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const heroEl = document.querySelector('.hero');
        if (!heroEl || y >= heroEl.offsetHeight) { heroTicking = false; return; }
        if (heroGrid) heroGrid.style.transform = `translateY(${y * 0.12}px)`;
        heroOrbs.forEach((orb, i) => {
          // Combine parallaxe avec l'animation CSS existante via une variable
          orb.style.setProperty('--parallax-y', `${y * (0.05 + i * 0.02)}px`);
        });
        heroTicking = false;
      });
      heroTicking = true;
    }
  }, { passive: true });
}

// ── Step hover — ligne connecteur ────────────
const steps     = document.querySelectorAll('.step');
const stepsLine = document.querySelector('.steps-line');
steps.forEach((step, i) => {
  step.addEventListener('mouseenter', () => {
    if (!stepsLine) return;
    const pct = ((i + 0.5) / steps.length) * 100;
    stepsLine.style.background = `linear-gradient(90deg,
      transparent 0%, rgba(108,75,246,0.3) 15%,
      rgba(108,75,246,0.8) ${pct}%,
      rgba(108,75,246,0.3) 85%, transparent 100%)`;
  });
  step.addEventListener('mouseleave', () => {
    if (!stepsLine) return;
    stepsLine.style.background = '';
  });
});

// ── Smooth scroll avec offset navbar ─────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 64;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - navH,
      behavior: prefersReducedMotion ? 'instant' : 'smooth'
    });
  });
});
