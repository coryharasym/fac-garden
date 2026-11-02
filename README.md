# FAC Digital Garden

A public digital garden prototype drawn from resources on [First Alliance Church Calgary](https://www.faccalgary.com/).

> **Prototype notice:** This is an independently curated experiment, not an official FAC publication. Seek permission before presenting it as an institutional FAC project. Original stories and writings remain on the FAC website.

## Browse the site

- `content/index.md` — homepage
- `content/first-steps/` — First Steps pathway: Alpha, Baptism, Classes, Discipleship Bands
- `content/blog/` — 30 selected FAC blog articles (short summaries and original-source links)
- `content/topics/` — the three thematic hubs
- `content/notes/` — evolving and interconnected garden notes
- `content/archive/` — other resource references

## Hosting

Site URL: https://coryharasym.github.io/fac-garden/

The GitHub Actions workflow `.github/workflows/deploy.yml` builds the site on `main` and deploys it to GitHub Pages. The workflow checks out a pinned Quartz 5 engine during the cloud build. **No local Quartz installation is necessary.**

To publish new content, commit changes to `main` through GitHub (or request an edit through ChatGPT). Check the workflow in GitHub Actions after publishing.

## Editorial commitments

- Publish a short catalogue summary and direct link to each FAC original rather than reproducing full copyrighted works.
- Be transparent that this prototype is not the church's official voice.
- Avoid storing personal or sensitive information in public GitHub commits.
- Review content attribution, source accuracy, registration links, and theological references before promotion.
- Entries are curated manually, not continuously synced from FAC's source website.

Source: https://www.faccalgary.com/blog and https://www.faccalgary.com/firststeps


## Brand and navigation implementation

See [docs/FAC-DESIGN-GUIDE.md](docs/FAC-DESIGN-GUIDE.md) for typography, colours, mission and tone. The primary navigation is injected into built HTML by `scripts/finalize-site.mjs` after Quartz renders pages, preventing duplicated base URLs. `scripts/verify-site-links.mjs` checks every generated internal link and the five-item navigation before Pages deployment. The build copies `quartz/styles/custom.scss` into the pinned Quartz engine to apply the FAC design. No local Quartz installation is necessary.

If the published base path changes, update `configuration.baseUrl`, `base` in `scripts/finalize-site.mjs`, and `origin`/`prefix` in `scripts/verify-site-links.mjs`.

Keep link resolution set to `absolute`: source links use paths from the content root. Keep `note-properties` enabled with `hidePropertiesView: true`; this plugin parses frontmatter even when the properties panel is hidden. Validation also rejects empty hubs, missing page/search titles, incorrect First Steps destinations, and missing local assets.

## Blog catalogue and publication dates

`data/fac-blog-posts.json` records the original FAC article URL, publication and update timestamps, a short curated summary, categories, and theme connections. The 79 article records were checked against FAC’s public blog sitemap and each page’s `BlogPosting` metadata on 2026-11-02. Calendar dates follow `America/Edmonton` to match FAC’s Calgary dates, including late-evening posts whose UTC date is the following day. Original publication and subsequent source updates are separate fields.

Run `node scripts/update-blog.mjs` after editing the catalogue to regenerate article entries, the chronological blog directory, and category pages. Existing article paths are preserved. The build uses `defaultDateType: published` and `TZ: America/Edmonton` so Quartz lists use the source publication date. `node scripts/verify-blog-catalogue.mjs <quartz-public-directory>` checks the generated article dates and catalogue connections before deployment. Updates from FAC are reviewed manually; this is not an automatic live feed.
