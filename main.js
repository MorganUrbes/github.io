/* ═══════════════════════════════════════════
   MORGAN PORTFOLIO — MAIN JS
   - Navbar scroll effect
   - Hero reveal animation
   - Scroll-triggered reveals
   - Active nav link
   - Mobile menu
   - Parallax (light, perf-safe)
═══════════════════════════════════════════ */

'use strict';

// ── Respect prefers-reduced-motion ──────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ── Navbar ───────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id], footer[id]');

let lastScrollY = 0;
let ticking = false;

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const y = window.scrollY;

      // Glassmorphism on scroll
      navbar.classList.toggle('scrolled', y > 20);

      // Active nav link
      let current = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 100;
        if (y >= top) current = sec.id;
      });
      navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === current);
      });

      lastScrollY = y;
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run on load


// ── Mobile Menu ──────────────────────────────
const burger = document.querySelector('.nav-burger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

burger?.addEventListener('click', () => {
  const isOpen = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!isOpen));
  if (isOpen) {
    mobileMenu.hidden = true;
  } else {
    mobileMenu.removeAttribute('hidden');
  }
});

// Close menu on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    burger?.setAttribute('aria-expanded', 'false');
    if (mobileMenu) mobileMenu.hidden = true;
  }
});


// ── Hero Reveal (line by line) ────────────────
function initHeroReveal() {
  const lines = document.querySelectorAll('.hero .reveal-line');
  lines.forEach(line => {
    const delay = parseInt(line.dataset.delay || '0', 10);
    setTimeout(() => {
      line.classList.add('animated');
    }, 200 + delay);
  });
}

if (prefersReducedMotion) {
  document.querySelectorAll('.reveal-line').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
} else {
  // Wait for fonts
  if (document.fonts) {
    document.fonts.ready.then(initHeroReveal);
  } else {
    window.addEventListener('load', initHeroReveal);
  }
}


// ── Scroll Reveal (IntersectionObserver) ─────
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-up');

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);

        if (prefersReducedMotion) {
          el.classList.add('in-view');
        } else {
          setTimeout(() => el.classList.add('in-view'), delay);
        }
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px'
  });

  items.forEach(el => observer.observe(el));
}

initScrollReveal();


// ── Subtle Hero Parallax ─────────────────────
// Only translates the grid + orbs — not the content
// Uses RAF + will-change for performance
if (!prefersReducedMotion) {
  const heroGrid = document.querySelector('.hero-grid');
  const heroOrbs = document.querySelectorAll('.hero .orb');

  let heroScrollY = 0;
  let heroTicking = false;

  function updateParallax() {
    const y = window.scrollY;
    const heroEl = document.querySelector('.hero');
    if (!heroEl) return;
    const heroH = heroEl.offsetHeight;

    // Only active while hero is visible
    if (y < heroH) {
      const factor = y / heroH;
      if (heroGrid) {
        heroGrid.style.transform = `translateY(${y * 0.15}px)`;
      }
      heroOrbs.forEach((orb, i) => {
        const speed = 0.06 + i * 0.03;
        orb.style.transform = `translateY(${y * speed}px)`;
      });
    }
    heroTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!heroTicking) {
      window.requestAnimationFrame(updateParallax);
      heroTicking = true;
    }
  }, { passive: true });
}


// ── Step hover: highlight connector line ─────
const steps = document.querySelectorAll('.step');
const stepsLine = document.querySelector('.steps-line');

steps.forEach((step, i) => {
  step.addEventListener('mouseenter', () => {
    if (!stepsLine) return;
    const pct = ((i + 0.5) / steps.length) * 100;
    stepsLine.style.background = `linear-gradient(90deg,
      transparent 0%,
      rgba(108,75,246,0.3) 15%,
      rgba(108,75,246,0.8) ${pct}%,
      rgba(108,75,246,0.3) 85%,
      transparent 100%)`;
    stepsLine.style.transition = 'background 0.4s ease';
  });
  step.addEventListener('mouseleave', () => {
    if (!stepsLine) return;
    stepsLine.style.background = '';
  });
});


// ── Smooth anchor scrolling (offset for navbar) ─
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 64;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
  });
});
