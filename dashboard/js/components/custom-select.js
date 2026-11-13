/* ==========================================================================
   custom-select.js — accessible replacement for <select> (ARIA combobox +
   listbox pattern). Reusable: the subject picker AND the year picker use it.

   USAGE
     const select = new CustomSelect({
       root:  document.getElementById('subjectSelect'),   // empty <div>
       label: 'Subject',                                  // screen-reader label
       onChange: (value, option) => { ... }               // fires on USER choice only
     });

     select.setOptions([
       { value: 'physics', label: 'Physics', iconHtml: '<svg…>', meta: '72%' }
     ], 'physics');                                       // 2nd arg = selected value

     select.value;                // current value
     select.setValue('physics');  // programmatic change (does not fire onChange)

   OPTION FIELDS
     value     string, required
     label     string, required
     iconHtml  optional trusted HTML (our own SVG strings) shown beside the label
     meta      optional small text on the right (e.g. "72%" or "New")

   KEYBOARD  ↓ ↑ move · Home/End jump · Enter/Space open or choose · Esc close · Tab closes
   Styles live in css/custom-select.css.
   ========================================================================== */

import { esc } from '../utils.js';

let instanceCount = 0;   // gives every instance unique element ids for ARIA

export class CustomSelect {
  constructor({ root, label, onChange = () => {} }) {
    this.root = root;
    this.onChange = onChange;
    this.options = [];
    this.value = '';
    this.activeIndex = -1;   // option highlighted by keyboard/hover

    const id = `cselect-${++instanceCount}`;
    this.ids = { label: `${id}-label`, text: `${id}-text`, menu: `${id}-menu`, option: i => `${id}-opt-${i}` };

    root.classList.add('cselect');
    root.innerHTML = `
      <span class="sr-only" id="${this.ids.label}">${esc(label)}</span>
      <button class="cselect-btn" type="button" role="combobox" aria-haspopup="listbox"
              aria-expanded="false" aria-controls="${this.ids.menu}"
              aria-labelledby="${this.ids.label} ${this.ids.text}">
        <span class="cselect-icon" aria-hidden="true" hidden></span>
        <span class="cselect-text" id="${this.ids.text}"></span>
        <svg class="cselect-chevron" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5"/></svg>
      </button>
      <ul class="cselect-menu" id="${this.ids.menu}" role="listbox" aria-labelledby="${this.ids.label}" hidden></ul>`;

    this.button = root.querySelector('.cselect-btn');
    this.iconEl = root.querySelector('.cselect-icon');
    this.textEl = root.querySelector('.cselect-text');
    this.menu = root.querySelector('.cselect-menu');

    this.bindEvents();
  }

  /* ---------- Public API ---------- */

  /** Replace the option list. Keeps `value` if it still exists, otherwise picks the first option. */
  setOptions(options, value = this.value) {
    this.options = options;
    this.value = options.some(o => o.value === value) ? value : (options[0]?.value ?? '');
    this.renderMenu();
    this.renderButton();
  }

  /** Change the selected value from code (does not call onChange). */
  setValue(value) {
    if (!this.options.some(o => o.value === value)) return;
    this.value = value;
    this.renderMenu();
    this.renderButton();
  }

  /* ---------- Rendering ---------- */

  get selected() { return this.options.find(o => o.value === this.value); }

  renderButton() {
    const option = this.selected;
    this.textEl.textContent = option ? option.label : '';
    this.iconEl.innerHTML = option?.iconHtml || '';
    this.iconEl.hidden = !option?.iconHtml;
  }

  renderMenu() {
    this.menu.innerHTML = this.options.map((o, i) => `
      <li class="cselect-opt" role="option" id="${this.ids.option(i)}" aria-selected="${o.value === this.value}">
        ${o.iconHtml ? `<span class="cselect-opt-icon" aria-hidden="true">${o.iconHtml}</span>` : ''}
        <span class="cselect-opt-name">${esc(o.label)}</span>
        ${o.meta ? `<span class="cselect-opt-meta">${esc(o.meta)}</span>` : ''}
      </li>`).join('');
  }

  /* ---------- Open / close ---------- */

  isOpen() { return !this.menu.hidden; }

  open() {
    this.menu.hidden = false;
    this.button.setAttribute('aria-expanded', 'true');
    // Flip upwards when there isn't room below (80px = room for the bottom tab bar)
    const rect = this.button.getBoundingClientRect();
    const roomBelow = window.innerHeight - rect.bottom - 80;
    this.root.classList.toggle('up', roomBelow < Math.min(this.menu.scrollHeight, 288) && rect.top > roomBelow);
    this.setActive(this.options.findIndex(o => o.value === this.value));
  }

  close() {
    this.menu.hidden = true;
    this.button.setAttribute('aria-expanded', 'false');
    this.button.removeAttribute('aria-activedescendant');
  }

  /* ---------- Highlight + choose ---------- */

  setActive(index) {
    const items = [...this.menu.children];
    if (!items.length) return;
    this.activeIndex = (index + items.length) % items.length;   // wraps around
    items.forEach((el, i) => el.classList.toggle('active', i === this.activeIndex));
    this.button.setAttribute('aria-activedescendant', items[this.activeIndex].id);

    // Scroll the MENU only — never the page
    const el = items[this.activeIndex];
    if (el.offsetTop < this.menu.scrollTop) this.menu.scrollTop = el.offsetTop - 4;
    else if (el.offsetTop + el.offsetHeight > this.menu.scrollTop + this.menu.clientHeight)
      this.menu.scrollTop = el.offsetTop + el.offsetHeight - this.menu.clientHeight + 4;
  }

  choose(index) {
    const option = this.options[index];
    if (!option) return;
    const changed = option.value !== this.value;
    this.value = option.value;
    [...this.menu.children].forEach((el, i) => el.setAttribute('aria-selected', String(i === index)));
    this.renderButton();
    this.close();
    if (changed) this.onChange(option.value, option);
  }

  /* ---------- Events ---------- */

  bindEvents() {
    this.button.addEventListener('click', () => (this.isOpen() ? this.close() : this.open()));
    this.button.addEventListener('keydown', e => this.onKeydown(e));

    // Keep focus on the button while clicking inside the menu
    this.menu.addEventListener('mousedown', e => e.preventDefault());
    this.menu.addEventListener('click', e => {
      const item = e.target.closest('.cselect-opt');
      if (item) this.choose([...this.menu.children].indexOf(item));
    });

    // Close when clicking elsewhere or when focus leaves the component
    document.addEventListener('click', e => { if (this.isOpen() && !this.root.contains(e.target)) this.close(); });
    this.root.addEventListener('focusout', e => { if (this.isOpen() && !this.root.contains(e.relatedTarget)) this.close(); });
  }

  onKeydown(e) {
    const open = this.isOpen();
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); open ? this.setActive(this.activeIndex + 1) : this.open(); break;
      case 'ArrowUp':   e.preventDefault(); open ? this.setActive(this.activeIndex - 1) : this.open(); break;
      case 'Home': if (open) { e.preventDefault(); this.setActive(0); } break;
      case 'End':  if (open) { e.preventDefault(); this.setActive(this.options.length - 1); } break;
      case 'Enter':
      case ' ':    e.preventDefault(); open ? this.choose(this.activeIndex) : this.open(); break;
      case 'Escape': if (open) { e.preventDefault(); this.close(); } break;
      case 'Tab':  if (open) this.close(); break;
    }
  }
}
