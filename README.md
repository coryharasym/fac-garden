# FAC Digital Garden

An emerging, unofficial prototype for exploring faith, following Jesus, and life in community through resources from [First Alliance Church Calgary](https://www.faccalgary.com/).

> **Prototype notice:** This project is an independently maintained digital-garden experiment, not an official FAC publication or replacement for the church website. Original resources remain with their authors and First Alliance Church. Editorial and institutional approval is needed before presenting it as an official FAC ministry.

## What's here

- `content/index.md` — homepage
- `content/topics/` — three entry-point hubs
- `content/notes/` — linked garden notes
- `content/archive/` — brief original-source summaries and links
- `quartz.config.yaml` — Quartz 5 configuration
- `.github/workflows/deploy.yml` — GitHub Actions → Pages

## Publishing

1. In **Settings → Pages**, change **Build and deployment → Source** to **GitHub Actions**.
2. The workflow builds on every push to `main`. Check **Actions → Deploy FAC Garden to GitHub Pages**.
3. Once deployed, visit https://coryharasym.github.io/fac-garden/.

## Why this repository doesn't copy the Quartz engine

This content-first repository keeps the editable FAC material small and separate from the upstream Quartz code. The workflow checks out a pinned [Quartz 5](https://github.com/jackyzha0/quartz/tree/v5) version into a temporary build directory, then overlays our `content/` and `quartz.config.yaml` before running the standard Quartz build. That is a deliberate lightweight Quartz 5 setup, not a full fork of the upstream source.

For a local preview (Node.js 22+ / npm 10.9+ and Git required):

```bash
bash scripts/preview.sh
```

This downloads Quartz if necessary, installs dependencies, builds the site, and serves the preview locally. It does not modify the tracked FAC content.

## Editorial approach

- Summaries are original, short descriptions; link to FAC for full articles.
- Distinguish draft garden notes from church-authored materials.
- Verify links, dates, permissions, and theological accuracy before promotion.
- Any changes to the official church branding or status require permission.
