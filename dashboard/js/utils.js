/* ==========================================================================
   utils.js — tiny pure helpers (no DOM state, no app state)
   ========================================================================== */

import { DAY_MS } from './config.js';

export const $ = id => document.getElementById(id);

/* ---------- Text ---------- */
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Escape user/stored text before putting it inside an HTML string. */
export const esc = s => String(s).replace(/[&<>"']/g, c => HTML_ESCAPES[c]);
export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/* ---------- Numbers ---------- */
export const percent = (correct, total) => (total ? Math.round((correct / total) * 100) : 0);
export const sum = (list, key) => list.reduce((acc, item) => acc + item[key], 0);

/** Colour tone for a percentage: 'good' >= 70, 'bad' < 50, otherwise 'mid'. */
export const tone = (pct, hasData = true) => (!hasData ? '' : pct >= 70 ? 'good' : pct < 50 ? 'bad' : 'mid');

/* ---------- Dates ---------- */
const pad = n => String(n).padStart(2, '0');
export const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;   // "2026-11-13"
export const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
/** Whole-day counter, so two dates can be subtracted safely (ignores time of day). */
export const dayNumber = d => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);
/** Returns the value only if it looks like YYYY-MM-DD, otherwise ''. */
export const validDate = v => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '');
