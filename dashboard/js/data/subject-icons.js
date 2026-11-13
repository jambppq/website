/* ------------------------------------------------------------------
   JAMB PQ – Subject icons
   24x24 stroke icons (Lucide style). Every icon uses currentColor, so
   colour it from CSS (e.g. `color: #16a34a`).
   Each icon is defined ONCE and re-used by every subject name/alias.
------------------------------------------------------------------- */

const svg = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;

/* ---------- 1. Icon artwork (one per concept) ---------- */
const ICONS = {
  // "En" inside a box
  english: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M10 8H7v8h3"/><path d="M7 12h2.5"/><path d="M13 16v-5"/><path d="M13 12.5a2 2 0 0 1 4 0V16"/>'),

  // calculator
  maths: svg('<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>'),

  // atom
  physics: svg('<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>'),

  // conical flask
  chemistry: svg('<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>'),

  // DNA double helix
  biology: svg('<path d="M8 3c0 5 8 5 8 9s-8 4-8 9"/><path d="M16 3c0 5-8 5-8 9s8 4 8 9"/><path d="M9.6 6h4.8"/><path d="M8 12h8"/><path d="M9.6 18h4.8"/>'),

  // trend line going up
  economics: svg('<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>'),

  // capitol / parliament building
  government: svg('<path d="M10 18v-7"/><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>'),

  // open book
  literature: svg('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'),

  // shopping bag (trade / buying & selling)
  commerce: svg('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'),

  // receipt with currency mark
  accounting: svg('<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>'),

  // banknote
  finance: svg('<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>'),

  // ledger book with lines
  ledger: svg('<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M9 7h7"/><path d="M9 11h7"/>'),

  // globe
  geography: svg('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),

  // Latin cross
  cross: svg('<path d="M12 2v20"/><path d="M7 8h10"/>'),

  // crescent moon + star
  crescent: svg('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M16.5 5.3 17.03 6.77 18.59 6.82 17.36 7.78 17.79 9.28 16.5 8.4 15.21 9.28 15.64 7.78 14.41 6.82 15.97 6.77Z"/>'),

  // sprouting plant
  agric: svg('<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>'),

  // Arabic letter "ba" (bowl with dot below)
  arabic: svg('<path d="M4 4v12"/><path d="M8 10v1a5 5 0 0 0 5 5h4a4 4 0 0 0 4-4v-2"/><path d="M14 20.5h.01"/>'),

  // paint palette
  art: svg('<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>'),

  // laptop
  computer: svg('<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>'),

  // translate (A / character) – French
  translate: svg('<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>'),

  // Hausa knot ornament
  hausa: svg('<path d="M12 2l10 10-10 10L2 12z"/><path d="M12 7l5 5-5 5-5-5z"/><path d="M7 7l2.5 2.5M17 7l-2.5 2.5M7 17l2.5-2.5M17 17l-2.5-2.5"/>'),

  // Igbo uli spiral motif
  igbo: svg('<path d="M12 12a2 2 0 0 1 2-2 4 4 0 0 1 4 4 6 6 0 0 1-6 6 8 8 0 0 1-8-8 8 8 0 0 1 8-8"/>'),

  // Yoruba talking drum (dùndún)
  yoruba: svg('<ellipse cx="12" cy="5" rx="7" ry="2.5"/><path d="M5 5c0 5 4 5.5 4 7s-4 2-4 7"/><path d="M19 5c0 5-4 5.5-4 7s4 2 4 7"/><path d="M5 19c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/><path d="M9 8.5l3 2 3-2"/><path d="M9 15.5l3-2 3 2"/>'),

  // history (clock rewinding)
  history: svg('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>'),

  // chef hat (home economics = cooking, food, home management)
  homeEcon: svg('<path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/>'),

  // music notes
  music: svg('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),

  // dumbbell
  fitness: svg('<path d="M6.5 6.5v11"/><path d="M17.5 6.5v11"/><path d="M3 9v6"/><path d="M21 9v6"/><path d="M6.5 12h11"/>'),

  // fallback
  fallback: svg('<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>')
};

/* ---------- 2. Subject list: [display name, emoji, icon key] ---------- */
const SUBJECTS = [
  ['Use of English', '📖', 'english'],
  ['Mathematics', '📐', 'maths'],
  ['Physics', '⚛️', 'physics'],
  ['Chemistry', '🧪', 'chemistry'],
  ['Biology', '🧬', 'biology'],
  ['Economics', '📊', 'economics'],
  ['Government', '🏛️', 'government'],
  ['Literature in English', '📚', 'literature'],
  ['Literature-In-English', '📚', 'literature'],
  ['Commerce', '💼', 'commerce'],
  ['Accounting', '🧾', 'accounting'],
  ['Financial Accounting', '💵', 'finance'],
  ['Principles of Accounts', '📒', 'ledger'],
  ['Geography', '🌍', 'geography'],
  ['CRK', '✝️', 'cross'],
  ['Christian religious studies', '✝️', 'cross'],
  ['IRK', '☪️', 'crescent'],
  ['Islamic-Studies', '☪️', 'crescent'],
  ['Agricultural Science', '🌱', 'agric'],
  ['Agriculture science', '🌱', 'agric'],
  ['Arabic', '🌙', 'arabic'],
  ['Art', '🎨', 'art'],
  ['Computer studies', '💻', 'computer'],
  ['French', '🇫🇷', 'translate'],
  ['Hausa', '🗣️', 'hausa'],
  ['Igbo', '🗣️', 'igbo'],
  ['Yoruba', '🥁', 'yoruba'],
  ['History', '🕰️', 'history'],
  ['Home-Economics', '🍳', 'homeEcon'],
  ['Music', '🎵', 'music'],
  ['Physical and Health Education', '🏋️', 'fitness']
];

/* ---------- 3. Build the public map (same shape as before) ---------- */
const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const SUBJECT_ICONS = {};
for (const [name, emoji, key] of SUBJECTS) {
  SUBJECT_ICONS[name] = { name, slug: slugify(name), emoji, svg: ICONS[key] };
}

/* ---------- 4. Forgiving lookup ----------
   "literature-in-english", "LITERATURE IN ENGLISH", "Islamic Studies"
   all resolve to the right icon. Unknown subjects get a book icon
   instead of breaking the card.                                      */
const _norm = (s) => String(s).toLowerCase().replace(/[-_\s]+/g, ' ').trim();
const _lookup = {};
for (const key of Object.keys(SUBJECT_ICONS)) _lookup[_norm(key)] = SUBJECT_ICONS[key];
Object.assign(_lookup, {
  'christian religious knowledge': SUBJECT_ICONS['CRK'],
  'islamic religious knowledge':   SUBJECT_ICONS['IRK'],
  'islamic studies':               SUBJECT_ICONS['Islamic-Studies'],
  'english':                       SUBJECT_ICONS['Use of English'],
  'english language':              SUBJECT_ICONS['Use of English'],
  'agric':                         SUBJECT_ICONS['Agricultural Science'],
  'agricultural science':          SUBJECT_ICONS['Agricultural Science'],
  'literature':                    SUBJECT_ICONS['Literature in English'],
  'phe':                           SUBJECT_ICONS['Physical and Health Education'],
  'computer science':              SUBJECT_ICONS['Computer studies'],
  'home economics':                SUBJECT_ICONS['Home-Economics'],
  'maths':                         SUBJECT_ICONS['Mathematics']
});

function getSubjectIcon(subjectName) {
  const hit = _lookup[_norm(subjectName)];
  if (hit) return hit;
  return { name: subjectName, slug: slugify(subjectName), emoji: '📄', svg: ICONS.fallback };
}

export { SUBJECT_ICONS, getSubjectIcon, ICONS };
