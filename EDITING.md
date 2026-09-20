# Editing

Preserve the original wording, spelling, equations, attribution and order. The source snapshot is `data/magnificent-jump-source.json`: blocks 0–12 form part 1, 13–39 form part 2, and 40–84 form part 3.

The three article pages are `magnificent-jump-intro.md`, `magnificent-jump-random-clock.md` and `magnificent-jump-variance-gamma.md`. `intro.md` is the standalone landing page. `_toc.yml` contains only these three chapters.

Run `python3 scripts/make_magnificent_jump_notebook.py` to regenerate the three pages, figures and executed Notebook. It requires Beautiful Soup, nbformat, NumPy, Matplotlib, fonttools and brotli. The delivered Notebook needs Python 3, NumPy and Matplotlib; keep personal experiments under a different filename.

Visualizations and their captions are in `scripts/magnificent_jump_viz.py`; their styling uses `assets/magnificent-jump.css`. Added material is labelled separately from the original. No image generator is used.

Check `npm test`, `npm run build:pages`, then `python3 qa/magnificent-jump-source-checks.py`. The Python check requires Beautiful Soup and nbformat. Check desktop/mobile, light/dark themes, navigation and downloads for layout changes. Generated root HTML files, `site.js`, `search-index.js`, `build-manifest.json` and `_site/` are build outputs.
