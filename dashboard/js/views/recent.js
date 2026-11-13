/* ==========================================================================
   views/recent.js — last five sessions with a trend vs the previous attempt
   ========================================================================== */

import { $, esc, percent, dayNumber, tone } from '../utils.js';
import { store } from '../state.js';
import { goToPractice } from '../navigation.js';
import { getSubjectIcon } from '../data/subject-icons.js';

const whenLabel = timestamp => {
  const days = dayNumber(new Date()) - dayNumber(new Date(timestamp));
  return days <= 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
};

function trendHtml(change) {
  if (change === undefined) return '';                       // first attempt in this subject
  if (change > 0) return ` · <span class="trend up">↑ ${change}%</span>`;
  if (change < 0) return ` · <span class="trend down">↓ ${Math.abs(change)}%</span>`;
  return ' · <span class="trend">no change</span>';
}

export function renderRecent() {
  // Walk oldest → newest, remembering each subject's previous % to compute the trend
  const oldestFirst = [...store.data.results].sort((a, b) => a.t - b.t);
  const lastPct = {};
  const trends = new Map();
  oldestFirst.forEach(r => {
    const pct = percent(r.c, r.n);
    if (r.s in lastPct) trends.set(r, pct - lastPct[r.s]);
    lastPct[r.s] = pct;
  });

  const recent = oldestFirst.reverse().slice(0, 5);          // newest five

  if (!recent.length) {
    $('rList').innerHTML = '<li class="empty">No practice yet. Pick a subject above and select <strong>Start practice</strong> to log your first session.</li>';
    return;
  }

  $('rList').innerHTML = recent.map(r => {
    const pct = percent(r.c, r.n);
    return `
    <li class="res">
      <span class="subj-icon" aria-hidden="true">${getSubjectIcon(r.s).svg}</span>
      <div class="res-info">
        <div class="res-head"><b title="${esc(r.s)}">${esc(r.s)}</b><span class="score ${tone(pct)}">${pct}%</span></div>
        <small>${whenLabel(r.t)} · ${r.c}/${r.n}${r.y ? ` · ${esc(r.y)}` : ''}${trendHtml(trends.get(r))}</small>
      </div>
      <button class="btn-mini btn-go" type="button" data-subject="${esc(r.s)}" aria-label="Continue practice in ${esc(r.s)}">
        <span class="go-text">Continue</span>
        <svg class="ic go-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </button>
    </li>`;
  }).join('');
}

export function initRecent() {
  $('rList').addEventListener('click', e => {
    const btn = e.target.closest('button[data-subject]');
    if (btn) goToPractice(btn.dataset.subject);
  });
}
