# Raúl Almeida — personal site

An English-language engineering portfolio built with Astro. Editorial cream, charcoal and olive styling; selected technical assignments, published articles in their original English or Spanish, short videos, a portrait, and recorded talks.

## Development

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

## Build and preview

```sh
npm run build
npm run preview
```

The production build is static and written to `dist/`. The preview server listens on `127.0.0.1:4321`.

After building, run `node --test tests/*.test.mjs` to verify the six-video catalogue, featured selection, published article archive, series navigation, original article metadata, code hashes, local image assets and absence of initially loaded players.

For a temporary external review, run `ngrok http 4321` while the preview is running. Expose only this site's server, not a workspace directory. Production uses a manual static release on Hetzner with Caddy; see [DEPLOYMENT.md](DEPLOYMENT.md). GitHub Actions is not required.

## Structure

- `src/pages/index.astro`: portfolio, selected Shorts, talks, about and contact.
- `src/pages/videos.astro`: the complete editorially ordered short-video collection.
- `src/data/videos.ts`: YouTube IDs, original titles, English summaries, verified durations and featured ranks. Add new Shorts here and their local thumbnails under `public/images/shorts/`.
- `src/components/ShortCard.astro`: shared vertical video card.
- `src/pages/notes/index.astro`: full published archive and four-part legacy integration reading path.
- `src/pages/p/[slug].astro`: imported articles with original publication dates and languages, source links, and previous/next series navigation.
- `src/data/articles.json`: imported metadata, image mapping and content/code hashes.
- `src/articles/*.html`: sanitised article bodies, preserving source text and code.
- `scripts/import_substack.py`: reproducible public-RSS import; run `python3 scripts/import_substack.py /path/to/public-feed.xml` and review generated changes before committing.
- `src/pages/notes/[slug].astro`: earlier drafts retained at existing URLs, no longer featured.
- `src/components/VideoEmbed.astro`: click-to-load YouTube/VideoPress players with persistent original-source links and accessible close controls.
- `src/styles/`: shared visual tokens and responsive styles.
- `public/images/`: portrait and original recording thumbnails.
- `CONTENT-SOURCES.md`: attribution and source verification for speaking material.

## Content and privacy

Projects are explicitly identified as technical assignments. No fabricated customer metrics or testimonials. The six published articles retain their original language, titles, dates and content; platform subscription controls are excluded. Imported pages continue using `noindex,follow` and canonical links to their original Substack URLs until a separate article migration is approved. Substack publication and subscriber settings have not been changed. See [DEPLOYMENT.md](DEPLOYMENT.md) for portfolio hosting; review article indexing, canonicals and redirects explicitly before migrating the publication. See `CONTENT-SOURCES.md` for provenance and verification limits.

Talk thumbnails are served locally. External players load only after a visitor clicks play. The festival recording opens at Raúl's appearance, **1:41:44**; it is not a trimmed video. The site has no analytics or stored contact-form data. Google Fonts provides DM Sans and IBM Plex Mono, with local fallbacks and Georgia for editorial headings; embedded video providers may make their own requests after activation.

Credentials, environment files, generated output and installed dependencies are excluded from version control. Images and recordings remain subject to their respective owners' rights; this repository does not grant a separate licence to third-party media.
