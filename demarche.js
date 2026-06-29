'use strict';

// ── Barre de progression au scroll ──────────
const progressFill = document.querySelector('.dm-progress-fill');
const totalH = () => document.documentElement.scrollHeight - window.innerHeight;

function updateProgress() {
  if (!progressFill) return;
  const pct = totalH() > 0 ? (window.scrollY / totalH()) * 100 : 0;
  progressFill.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ── Active pill au scroll ────────────────────
const pills    = document.querySelectorAll('.dm-step-pill');
const stepSecs = document.querySelectorAll('.dm-step-section[id]');

function updateActivePill() {
  const y = window.scrollY + window.innerHeight * 0.3;
  let current = '';
  stepSecs.forEach(sec => {
    if (y >= sec.offsetTop) current = sec.id;
  });
  pills.forEach(pill => {
    const href = pill.getAttribute('href').replace('#', '');
    pill.classList.toggle('active', href === current);
  });
}
window.addEventListener('scroll', updateActivePill, { passive: true });
updateActivePill();

// ── Inject barre de progression dans le DOM ──
const progressBar = document.createElement('div');
progressBar.className = 'dm-progress-bar';
progressBar.innerHTML = '<div class="dm-progress-fill"></div>';
document.body.prepend(progressBar);
// Réassigner après injection
const fill = document.querySelector('.dm-progress-fill');
window.addEventListener('scroll', () => {
  if (!fill) return;
  const pct = totalH() > 0 ? (window.scrollY / totalH()) * 100 : 0;
  fill.style.width = pct + '%';
}, { passive: true });
