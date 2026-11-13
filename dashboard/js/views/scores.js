/* ==========================================================================
   views/scores.js — projected UTME score + one progress row per subject
   ========================================================================== */

import { $, esc, plural, sum, tone } from '../utils.js';
import { subjectAverages } from '../metrics.js';
import { goToPractice } from '../navigation.js';

export function renderScores() {
  const rows = subjectAverages();
  const practised = rows.filter(r => r.has);

  // Projected score = average accuracy across practised subjects, scaled to 400
  $('proj').textContent = practised.length ? Math.round((sum(practised, 'avg') / practised.length) * 4) : 0;
  $('scoresHint').textContent = practised.length
    ? `Average across ${plural(practised.length, 'practised subject')} of 4`
    : 'No practice yet. Start a session.';

  $('subs').innerHTML = rows.map(r => `
    <div class="sub">
      <span class="subj-name">${esc(r.name)}</span>
      <span class="sub-pct">${r.has ? `${r.avg}% accuracy` : 'No practice yet'}</span>
      <button class="btn-mini" type="button" data-subject="${esc(r.name)}" aria-label="Practise ${esc(r.name)}">Practise</button>
      <div class="track"${r.has
        ? ` role="progressbar" aria-label="${esc(r.name)} accuracy" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${r.avg}"`
        : ' aria-hidden="true"'}><i class="${tone(r.avg, r.has)}" style="width:${r.avg}%"></i></div>
    </div>`).join('');
}

/** One-time: "Practise" buttons use event delegation, so re-rendering never loses them. */
export function initScores() {
  $('subs').addEventListener('click', e => {
    const btn = e.target.closest('button[data-subject]');
    if (btn) goToPractice(btn.dataset.subject);
  });
}
