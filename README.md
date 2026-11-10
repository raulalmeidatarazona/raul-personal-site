# Raúl Almeida — personal site

An English-language engineering portfolio built with Astro. Editorial cream, charcoal and olive styling; selected technical assignments, draft engineering notes, a portrait, and recorded talks.

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

After building, run `node --test tests/videos.test.mjs` to verify the six-video catalogue, featured selection, source links, local assets and absence of initially loaded players.

For a temporary external review, run `ngrok http 4321` while the preview is running. Expose only this site's server, not a workspace directory. No deployment or hosting service is configured in this repository.

## Structure

- `src/pages/index.astro`: portfolio, selected Shorts, talks, about and contact.
- `src/pages/videos.astro`: the complete editorially ordered short-video collection.
- `src/data/videos.ts`: YouTube IDs, original titles, English summaries, verified durations and featured ranks. Add new Shorts here and their local thumbnails under `public/images/shorts/`.
- `src/components/ShortCard.astro`: shared vertical video card.
- `src/pages/notes/[slug].astro`: first-edition draft articles.
- `src/components/VideoEmbed.astro`: click-to-load YouTube/VideoPress players with persistent original-source links and accessible close controls.
- `src/styles/`: shared visual tokens and responsive styles.
- `public/images/`: portrait and original recording thumbnails.
- `CONTENT-SOURCES.md`: attribution and source verification for speaking material.

## Content and privacy

Projects are explicitly identified as technical assignments. No fabricated customer metrics or testimonials. Review draft articles and copy before final publication.

Talk thumbnails are served locally. External players load only after a visitor clicks play. The festival recording opens at Raúl's appearance, **1:41:44**; it is not a trimmed video. The site has no analytics or stored contact-form data. Google Fonts provides DM Sans and IBM Plex Mono, with local fallbacks and Georgia for editorial headings; embedded video providers may make their own requests after activation.

Credentials, environment files, generated output and installed dependencies are excluded from version control. Images and recordings remain subject to their respective owners' rights; this repository does not grant a separate licence to third-party media.
