# The Magnificent Jump

A standalone QuantCorner project containing the original Thai article by **สุรพัศ หอมชุ่ม · Math Nerd**, organized into exactly three parts. The article wording, spelling and equations remain unchanged; three separately labelled visualizations use hypothetical data.

- Website: https://nutdnuy.github.io/the-magnificent-jump/
- Repository: https://github.com/nutdnuy/the-magnificent-jump
- Local project: `~/Desktop/QuantConnet Content/the-magnificent-jump`
- Notebook: `notebooks/the-magnificent-jump.ipynb`
- Original: https://qc-variance-gamma-model.nutdnuy.chatgpt.site/

## Build and preview

Use Node.js 22 or newer.

```sh
npm ci
npm test
npm run build:pages
npm run dev
```

Preview: http://127.0.0.1:8766/. This repository has its own source files, dependencies, build and GitHub Pages workflow. It does not depend on a checkout of Quantitative Finance Notes.

See [EDITING.md](EDITING.md) for source preservation and notebook generation, [DEPLOYMENT.md](DEPLOYMENT.md) for publishing, and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution.

## Interactive learning labs

Each chapter includes a separately labelled browser lab, injected by `build.cjs` without editing original article blocks or the Notebook. A link near the start of the article and the local table of contents open `#interactive-viz`.

- Part 1: vary the gamma-clock variance and tail threshold; compare a 24,000-sample VG histogram with a Normal density at the same theoretical mean and variance.
- Part 2: inspect a 120-interval gamma clock and VG path, select an observation or the largest clock increment, and compare with a regular clock.
- Part 3: adjust drift, Brownian scale and clock variance; compare theoretical mean, SD, skewness and excess kurtosis.

Implementation: `assets/vg-interactive.mjs`, `assets/vg-math.mjs`, `assets/vg-interactive.css`. Native SVG and controls use the existing QuantCorner light/dark design; no chart dependencies or image generator. Simulation seeds are reproducible; New sample advances the seed and Reset restores defaults. The figures and executed Notebook remain available without these browser controls.

`npm test` verifies numerical moments, skewness, gamma sampling, the Normal limit, histogram mass and reproducibility, in addition to original wording preservation. After a build, run the Python source check and verify browser sliders, presets, reset, small-screen chart scrolling and both themes. See `data/interactive-viz-provenance.json`.
