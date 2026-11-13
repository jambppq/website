/* ==========================================================================
   views/details-dialog.js — modal for name, UTME date and the 3 electives

   Opened by clicking the name in the greeting or "Set your UTME details".
   (Electives use native <select>s on purpose: the OS picker is best inside a
   scrolling modal. Swap in <CustomSelect> later if you want them styled.)
   ========================================================================== */

import { $, esc, validDate } from '../utils.js';
import { ELECTIVES } from '../config.js';
import { store } from '../state.js';

const dialog = $('detailsDlg');
const form = $('detailsForm');

function openDetails(focusId) {
  if (typeof dialog.showModal !== 'function') return;     // very old browsers: do nothing

  $('nameInput').value = store.data.name;
  $('dateInput').value = store.data.examDate;
  $('dlgError').hidden = true;

  // One <select> per elective. A saved subject that's no longer in ELECTIVES is still listed.
  $('comboFields').innerHTML = store.data.combo.map((current, i) => {
    const list = ELECTIVES.includes(current) ? ELECTIVES : [current, ...ELECTIVES];
    const options = list.map(s => `<option${s === current ? ' selected' : ''}>${esc(s)}</option>`).join('');
    return `<label class="field">Subject ${i + 2}<select>${options}</select></label>`;
  }).join('');

  dialog.showModal();
  $(focusId).focus();
}

/** `onSave` runs after a successful save so the page can re-render. */
export function initDetailsDialog({ onSave }) {
  form.addEventListener('submit', e => {
    if (!e.submitter || e.submitter.value !== 'save') return;     // Cancel just closes the dialog

    const picks = [...document.querySelectorAll('#comboFields select')].map(s => s.value);
    if (new Set(picks).size < picks.length) {                     // duplicates → keep dialog open
      e.preventDefault();
      $('dlgError').textContent = 'Choose three different subjects.';
      $('dlgError').hidden = false;
      return;
    }

    store.data.name = $('nameInput').value.trim().slice(0, 24);
    store.data.examDate = validDate($('dateInput').value);
    store.data.combo = picks;
    if (!store.save()) $('storageNote').hidden = false;
    onSave();
  });

  $('name').addEventListener('click', () => openDetails('nameInput'));
  $('setDate').addEventListener('click', () => openDetails('dateInput'));
}
