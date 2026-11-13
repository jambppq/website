/* ==========================================================================
   views/start-practice.js — hero card: subject picker, year picker, start buttons

   Both pickers are <CustomSelect>s (js/components/custom-select.js).
   Flow:  choose subject → year list rebuilds (showing your last score per year)
          → "Start practice" → navigation.goToPractice(subject, year)
   ========================================================================== */

import { $ } from '../utils.js';
import { percent } from '../utils.js';
import { FIRST_YEAR, LAST_YEAR } from '../config.js';
import { store } from '../state.js';
import { subjectAverages, suggestion } from '../metrics.js';
import { CustomSelect } from '../components/custom-select.js';
import { getSubjectIcon } from '../data/subject-icons.js';
import { goToPractice, goToCbt } from '../navigation.js';

let subjectSelect;
let yearSelect;

/* ---------- Year list ---------- */
/** Years you've already done in the chosen subject show your latest score on the right. */
function renderYears() {
  const subject = subjectSelect.value;

  const latestByYear = new Map();
  [...store.data.results]
    .sort((a, b) => a.t - b.t)
    .forEach(r => { if (r.s === subject && r.y) latestByYear.set(String(r.y), percent(r.c, r.n)); });

  const options = [{ value: 'all', label: 'All years' }];
  for (let year = LAST_YEAR; year >= FIRST_YEAR; year--) {
    const pct = latestByYear.get(String(year));
    options.push({ value: String(year), label: String(year), meta: pct === undefined ? '' : `${pct}%` });
  }
  yearSelect.setOptions(options, yearSelect.value || 'all');   // keeps the chosen year when possible
}

/* ---------- Subject list ---------- */
export function renderStartPractice() {
  const subjects = store.subjects();
  const stats = new Map(subjectAverages().map(r => [r.name, r]));
  const tip = suggestion();

  // Keep the current choice; otherwise start on the suggested subject
  const current = subjectSelect.value;
  const initial = subjects.includes(current) ? current : (tip ? tip.name : subjects[0]);

  subjectSelect.setOptions(
    subjects.map(name => ({
      value: name,
      label: name,
      iconHtml: getSubjectIcon(name).svg,
      meta: stats.get(name).has ? `${stats.get(name).avg}%` : 'New'
    })),
    initial
  );

  $('goHint').textContent = tip ? tip.text : 'Pick a subject and start answering real JAMB past questions.';
  renderYears();
}

/* ---------- One-time setup ---------- */
export function initStartPractice() {
  subjectSelect = new CustomSelect({
    root: $('subjectSelect'),
    label: 'Subject',
    onChange: renderYears                       // different subject → different "done" scores
  });
  yearSelect = new CustomSelect({ root: $('yearSelect'), label: 'Year' });

  const start = () => goToPractice(subjectSelect.value, yearSelect.value);
  $('pGo').addEventListener('click', start);
  $('navStart').addEventListener('click', start);
  $('startCbt').addEventListener('click', goToCbt);
}
