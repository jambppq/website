/* ==========================================================================
   navigation.js — the only place that knows practice-page URLs
   ========================================================================== */

import { PRACTICE_URL } from './config.js';

/** Build a practice URL. `year` is optional; 'all' / '' means every year. */
export function practiceUrl(subject, year) {
  const params = new URLSearchParams({ subject });
  if (year && year !== 'all') params.set('year', year);
  params.set('mode', 'practice');
  return `${PRACTICE_URL}?${params}`;
}

export const goToPractice = (subject, year) => { location.href = practiceUrl(subject, year); };
export const goToCbt = () => { location.href = `${PRACTICE_URL}?mode=cbt`; };
