# Copilot instructions for TravelSwipe (vebileheprojekt)

This repository is a small static frontend site (no build system). Provide focused, actionable edits only — preserve relative paths and the current folder layout.

Key architecture
- Static site with three pages in `html/`: `index.html`, `explore.html`, `results.html`.
- JavaScript lives in `js/` (`explore.js`, `countries.js`, `results.js` [empty]). CSS in `css/`. Static data and media in `database/` (images, `video/`, `countries.json`).
- Data flow: `explore.js` fetches `../database/countries.json` and persists liked items into `localStorage` under the key `likedCountries`. `results.html` reads that `localStorage` data (see `js/results.js` placeholder).

What to know when editing
- Always test pages via HTTP (not `file://`) because `fetch()` requests to `../database/countries.json` require an HTTP server. Use `python -m http.server 8000` or VS Code Live Server.
- Keep relative links intact. HTML files reference scripts/styles with paths like `../js/explore.js` and `../css/*.css` — moving files will break pages.
- CDN libs used: AOS (animations) and FontAwesome. Don't remove CDN includes unless replacing consistently across pages.

Conventions & patterns (concrete examples)
- LocalStorage key: `likedCountries` — `explore.js` pushes objects and calls `localStorage.setItem('likedCountries', JSON.stringify(likedCountries))`.
- Data file structure: `database/countries.json` contains a `countriesData` array used by `explore.js` (`fetch('../database/countries.json').then(res => res.json())`).
- DOM timing: `explore.js` uses `defer` or `DOMContentLoaded` to initialize AOS and start the app; prefer `defer` for added scripts.

Developer workflows
- Run a local server from the repo root to test pages:
  - PowerShell: `python -m http.server 8000`  (or `py -3 -m http.server 8000` if `python` isn't on PATH)
  - Or use the VS Code Live Server extension (recommended for quick reloads).
- Open pages in browser: `http://localhost:8000/html/explore.html` (or `index.html`, `results.html`).

Editing guidance for AI agents
- Narrow scope: change one page or one JS module per PR. Prefer minimal, reversible edits.
- When modifying data structures in `javascript` or `countries.json`, update both `explore.js` and `results.js` accordingly.
- Example: to read liked countries in `results.js`, use:
  ```js
  const liked = JSON.parse(localStorage.getItem('likedCountries') || '[]');
  // render list...
  ```
- If adding new assets, place them under `database/image/` or `database/video/` and reference via `../database/...` from HTML files.

Notes & TODOs discovered
- `js/results.js` is currently empty — expected to read `likedCountries` and render results in `results.html`.
- `countries.js` contains site-wide UI helpers (AOS init, back-to-top, rolling counters). Reuse rather than duplicating code.

If something is unclear, ask: which page to change, whether to update data shape in `countries.json`, and whether to use a new CDN or local asset.

Please review these instructions and tell me which section to expand or correct.
