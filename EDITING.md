# Editing

Preserve the original wording, spelling, equations, attribution and order. The source snapshot is `data/magnificent-jump-source.json`: blocks 0–12 form part 1, 13–39 form part 2, and 40–84 form part 3.

The three article pages are `magnificent-jump-intro.md`, `magnificent-jump-random-clock.md` and `magnificent-jump-variance-gamma.md`. `intro.md` is the standalone landing page. `_toc.yml` contains only these three chapters.

Run `python3 scripts/make_magnificent_jump_notebook.py` to regenerate the three pages, figures and executed Notebook. It requires Beautiful Soup, nbformat, NumPy, Matplotlib, fonttools and brotli. The delivered Notebook needs Python 3, NumPy and Matplotlib; keep personal experiments under a different filename.

Visualizations and their captions are in `scripts/magnificent_jump_viz.py`; their styling uses `assets/magnificent-jump.css`. Added material is labelled separately from the original. No image generator is used.

Check `npm test`, `npm run build:pages`, then `python3 qa/magnificent-jump-source-checks.py`. The Python check requires Beautiful Soup and nbformat. Check desktop/mobile, light/dark themes, navigation and downloads for layout changes. Generated root HTML files, `site.js`, `search-index.js`, `build-manifest.json` and `_site/` are build outputs.

## Interactive learning labs

Each chapter includes a separately labelled browser lab, injected by `build.cjs` without editing original article blocks or the Notebook. A link near the start of the article and the local table of contents open `#interactive-viz`.

- Part 1: vary the gamma-clock variance and tail threshold; compare a 24,000-sample VG histogram with a Normal density at the same theoretical mean and variance.
- Part 2: inspect a 120-interval gamma clock and VG path, select an observation or the largest clock increment, and compare with a regular clock.
- Part 3: adjust drift, Brownian scale and clock variance; compare theoretical mean, SD, skewness and excess kurtosis.

Implementation: `assets/vg-interactive.mjs`, `assets/vg-math.mjs`, `assets/vg-interactive.css`. Native SVG and controls use the existing QuantCorner light/dark design; no chart dependencies or image generator. Simulation seeds are reproducible; New sample advances the seed and Reset restores defaults. The figures and executed Notebook remain available without these browser controls.

`npm test` verifies numerical moments, skewness, gamma sampling, the Normal limit, histogram mass and reproducibility, in addition to original wording preservation. After a build, run the Python source check and verify browser sliders, presets, reset, small-screen chart scrolling and both themes. See `data/interactive-viz-provenance.json`.

## Author card

The landing page and all three chapters display the article author's card, configured in `_config.yml`. Use the user-supplied photo `assets/images/surapas-homchum.png` and Surapas's LinkedIn, not the site owner's profile. The generator retains `author_profile: true`; the original article blocks and Notebook remain unchanged. The portrait is copied without alteration and displayed with the existing circular CSS frame.
