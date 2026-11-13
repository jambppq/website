/* ==========================================================================
   chrome.js — page "chrome": header hairline, active nav link, scroll reveal
   ========================================================================== */

import { $ } from './utils.js';

const header = $('mainHeader');
const navLinks = document.querySelectorAll('.tabbar a, .nav-list li:not(:last-child) a');
let ticking = false;

/** Header gets a bottom border after scrolling; the nav highlights the section in view. */
export function updateScrollState() {
  ticking = false;
  header.classList.toggle('scrolled', window.scrollY > 50);

  // Active section = the one whose top is nearest (but above) the top of the screen
  let active = '#main';
  let best = -Infinity;
  ['start', 'scores', 'recent'].forEach(id => {
    const top = $(id).getBoundingClientRect().top;
    if (top <= 120 && top > best) { best = top; active = `#${id}`; }
  });

  // When cards are stacked (phones), the last card can never reach the top: force it at page bottom
  const stacked = $('recent').getBoundingClientRect().top > $('scores').getBoundingClientRect().top + 1;
  if (stacked && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = '#recent';

  navLinks.forEach(a =>
    a.getAttribute('href') === active ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
}

export function initChrome() {
  // Throttle scroll handling to one run per animation frame
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateScrollState); }
  }, { passive: true });

  // Fade sections in the first time they appear
  const items = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    }), { threshold: 0.1 });
    items.forEach(el => observer.observe(el));
  } else {
    items.forEach(el => el.classList.add('in'));
  }
}
