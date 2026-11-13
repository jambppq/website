# JAMB PQ — Dashboard

Plain HTML/CSS/ES-modules. No build step.

Run locally (ES modules need a server, `file://` won't work):

    python -m http.server 8000      # then open http://localhost:8000/dashboard.html?demo

`?demo` loads sample data and never saves anything.

## Structure
    dashboard.html            markup only
    css/
      tokens.css              colours, spacing, radii (edit the look here)
      base.css                reset, layout grid, a11y, motion
      components.css          buttons, cards, progress bars, dialog
      custom-select.css       styles for the reusable dropdown
      dashboard.css           page sections + responsive rules
    js/
      main.js                 entry point (wiring only)
      config.js               URLs, subject list, year range  <- most edits start here
      state.js                localStorage store
      metrics.js              streaks / accuracy / suggestions
      navigation.js           practice-page URLs
      utils.js                helpers
      data/subject-icons.js   SVG icon per subject (+ getSubjectIcon)
      components/custom-select.js   reusable accessible dropdown
      views/                  greeting, stats, scores, recent, start-practice, details-dialog
      chrome.js               header hairline, active nav, scroll reveal

## Common tasks
- Add a subject: add its name to `ELECTIVES` (config.js) and an entry in `SUBJECTS` (data/subject-icons.js).
- Add a year: change `LAST_YEAR` in config.js.
- New dropdown: `new CustomSelect({ root, label, onChange })` then `.setOptions([...])`.
