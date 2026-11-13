/* ==========================================================================
   metrics.js — numbers derived from store.data (no DOM here)
   ========================================================================== */

import { store } from './state.js';
import { dayKey, daysAgo, dayNumber, percent, sum } from './utils.js';

/* ---------- Streaks ---------- */
const practiceDays = () => new Set(store.data.results.map(r => dayKey(new Date(r.t))));

/** Consecutive practice days ending today (or yesterday: a streak lives until the day ends). */
export function currentStreak() {
  const days = practiceDays();
  let count = 0;
  let i = days.has(dayKey(new Date())) ? 0 : 1;
  while (days.has(dayKey(daysAgo(i)))) { count++; i++; }
  return count;
}

/** Longest run of consecutive practice days ever. */
export function bestStreak() {
  const nums = [...practiceDays()].map(k => dayNumber(new Date(k + 'T00:00:00'))).sort((a, b) => a - b);
  let best = 0, run = 0, prev = null;
  for (const n of nums) {
    run = prev !== null && n - prev === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = n;
  }
  return best;
}

/* ---------- Questions answered ---------- */
/** Questions answered `ago` days back (0 = today). */
export function questionsOn(ago) {
  const key = dayKey(daysAgo(ago));
  return sum(store.data.results.filter(r => dayKey(new Date(r.t)) === key), 'n');
}

/* ---------- Per-subject accuracy ---------- */
/** One row per UTME subject: { name, has: practised?, avg: accuracy % } */
export function subjectAverages() {
  return store.subjects().map(name => {
    const rows = store.data.results.filter(r => r.s === name);
    return { name, has: rows.length > 0, avg: percent(sum(rows, 'c'), sum(rows, 'n')) };
  });
}

/** What to practise next: a subject never tried, else the weakest one. null if no data yet. */
export function suggestion() {
  const rows = subjectAverages();
  const practised = rows.filter(r => r.has);
  if (!practised.length) return null;

  const fresh = rows.find(r => !r.has);
  if (fresh) return { name: fresh.name, text: `You haven’t practised ${fresh.name} yet. Start there to see your full score.` };

  const weakest = [...practised].sort((a, b) => a.avg - b.avg)[0];
  return { name: weakest.name, text: `${weakest.name} is your lowest score at ${weakest.avg}%. A session there lifts your total fastest.` };
}
