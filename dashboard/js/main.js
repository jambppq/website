/* ==========================================================================
   main.js — entry point. Wires modules together; contains no feature logic.

   File map
     config.js            settings (URLs, subjects, years)
     state.js             localStorage-backed data store
     metrics.js           streaks, accuracy, suggestions (pure calculations)
     navigation.js        practice-page URLs
     utils.js             small helpers
     data/subject-icons.js  SVG icon for every subject
     components/custom-select.js  reusable dropdown
     views/*              one file per dashboard section
     chrome.js            header + scroll behaviour
   ========================================================================== */

import { DEMO, STORE_KEY } from './config.js';
import { $ } from './utils.js';
import { store, storageAvailable } from './state.js';
import { renderGreeting } from './views/greeting.js';
import { renderStats } from './views/stats.js';
import { renderScores, initScores } from './views/scores.js';
import { renderRecent, initRecent } from './views/recent.js';
import { renderStartPractice, initStartPractice } from './views/start-practice.js';
import { initDetailsDialog } from './views/details-dialog.js';
import { initChrome, updateScrollState } from './chrome.js';

/** Redraw every section from the current store. Safe to call any time. */
function renderAll() {
  renderGreeting();
  renderStartPractice();
  renderStats();
  renderScores();
  renderRecent();
  updateScrollState();
}

/** Re-read storage, then redraw (not in ?demo mode). */
function refresh() {
  if (DEMO) return;
  store.reload();
  renderAll();
}

/* ---------- Boot ---------- */
if (!storageAvailable()) $('storageNote').hidden = false;

initChrome();
initStartPractice();
initScores();
initRecent();
initDetailsDialog({ onSave: renderAll });
renderAll();

/* Keep numbers fresh when returning from the practice page, switching tabs, or after midnight */
window.addEventListener('pageshow', e => { if (e.persisted) refresh(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
window.addEventListener('storage', e => { if (e.key === null || e.key === STORE_KEY) refresh(); });
