/* ==========================================================================
   config.js — every setting a developer is likely to change lives here.
   ========================================================================== */

export const PRACTICE_URL = 'practice.html';          // receives ?subject=&year=&mode=practice|cbt
export const STORE_KEY = 'jambpq-dashboard-v1';       // localStorage key (shared with the practice page)

export const ENGLISH = 'Use of English';              // compulsory in UTME
export const DEFAULT_COMBO = ['Mathematics', 'Physics', 'Chemistry'];

/* Years we have questions for. The year menu is built from this range. */
export const FIRST_YEAR = 2020;
export const LAST_YEAR = 2025;

/* Subjects a candidate can choose as electives (everything except English).
   Names MUST match the subject names used by the rest of the site. */
export const ELECTIVES = [
  'Agriculture science', 'Arabic', 'Art', 'Biology', 'Chemistry',
  'Christian religious studies', 'Commerce', 'Computer studies', 'Economics',
  'French', 'Geography', 'Government', 'Hausa', 'History', 'Home-Economics',
  'Igbo', 'Islamic-Studies', 'Literature-In-English', 'Mathematics', 'Music',
  'Physical and Health Education', 'Physics', 'Principles of Accounts', 'Yoruba'
];

export const DAY_MS = 864e5;

/* Open the page with ?demo to preview sample data (nothing is saved). */
export const DEMO = new URLSearchParams(location.search).has('demo');
