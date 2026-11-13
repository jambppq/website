/* ==========================================================================
   state.js — the single source of truth, backed by localStorage.

   Shape of store.data:
     {
       name:     string,
       combo:    [elective, elective, elective],   // English is implied
       examDate: 'YYYY-MM-DD' | '',
       results:  [{ t: timestamp, s: subject, c: correct, n: total, y?: year }]
     }

   RULE: this page only WRITES name / combo / examDate. `results` is written by
   the practice page, so save() merges into the latest stored copy and never
   overwrites results saved in another tab.
   ========================================================================== */

import { STORE_KEY, ENGLISH, DEFAULT_COMBO, DEMO } from './config.js';
import { daysAgo, dayKey, validDate } from './utils.js';

/* ---------- Sample data for ?demo ---------- */
function demoData() {
  const mk = (ago, s, c, n, y) => ({ t: daysAgo(ago).getTime(), s, c, n, y });
  return {
    name: 'Ada',
    combo: DEFAULT_COMBO,
    examDate: dayKey(daysAgo(-175)),
    results: [
      mk(6, ENGLISH, 38, 60, 2019), mk(5, 'Mathematics', 22, 40, 2018), mk(4, 'Physics', 25, 40, 2020), mk(4, 'Chemistry', 35, 40, 2017),
      mk(3, ENGLISH, 42, 60, 2021), mk(2, 'Mathematics', 27, 40, 2019), mk(1, 'Physics', 29, 40, 2021), mk(1, 'Chemistry', 39, 40, 2020),
      mk(0, ENGLISH, 45, 60, 2022), mk(0, 'Mathematics', 30, 40, 2022)
    ]
  };
}

/* ---------- Reading ---------- */
function readStore() {
  try {
    const value = JSON.parse(localStorage.getItem(STORE_KEY));
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch (e) {
    return {};
  }
}

/** Always returns exactly three unique electives, never English. */
export function normalizeCombo(list) {
  const seen = new Set([ENGLISH]);
  const out = [];
  (Array.isArray(list) ? list : []).forEach(s => {
    if (typeof s === 'string' && s && !seen.has(s)) { seen.add(s); out.push(s); }
  });
  DEFAULT_COMBO.forEach(s => { if (out.length < 3 && !seen.has(s)) { seen.add(s); out.push(s); } });
  return out.slice(0, 3);
}

function loadData() {
  if (DEMO) return demoData();
  const raw = readStore();
  const results = (Array.isArray(raw.results) ? raw.results : [])
    .filter(r => r && typeof r.s === 'string' && r.s && +r.n > 0 && Number.isFinite(+r.t))
    .map(r => ({ ...r, t: +r.t, n: +r.n, c: Math.min(Math.max(+r.c || 0, 0), +r.n) }));   // clamp bad scores
  return {
    name: typeof raw.name === 'string' ? raw.name : '',
    combo: normalizeCombo(raw.combo),
    examDate: validDate(raw.examDate || raw.date),   // `date` = older field name
    results
  };
}

/* ---------- Public API ---------- */
export const store = {
  data: loadData(),

  /** Re-read from localStorage (after returning from the practice page, etc.). */
  reload() { if (!DEMO) this.data = loadData(); },

  /** Persist name / combo / examDate. Returns false if the browser blocked storage. */
  save() {
    if (DEMO) return true;
    try {
      const latest = readStore();
      latest.name = this.data.name;
      latest.combo = this.data.combo;
      latest.examDate = this.data.examDate;
      delete latest.date;
      localStorage.setItem(STORE_KEY, JSON.stringify(latest));
      return true;
    } catch (e) {
      return false;
    }
  },

  /** The four UTME subjects: English first, then the three electives. */
  subjects() { return [ENGLISH, ...this.data.combo]; }
};

/** False in private modes that block storage — used to show a warning. */
export function storageAvailable() {
  if (DEMO) return true;
  try { localStorage.setItem('jambpq-probe', '1'); localStorage.removeItem('jambpq-probe'); return true; }
  catch (e) { return false; }
}
