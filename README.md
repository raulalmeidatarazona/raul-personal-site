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

For a temporary external review, run `ngrok http 4321` while the preview is running. Expose only this site's server, not a workspace directory. No deployment or hosting service is configured in this repository.

## Structure

- `src/pages/index.astro`: portfolio, talks, about and contact.
- `src/pages/notes/[slug].astro`: first-edition draft articles.
- `src/components/VideoEmbed.astro`: click-to-load YouTube/VideoPress players with persistent original-source links and accessible close controls.
- `src/styles/`: shared visual tokens and responsive styles.
- `public/images/`: portrait and original recording thumbnails.
- `CONTENT-SOURCES.md`: attribution and source verification for speaking material.

## Content and privacy

Projects are explicitly identified as technical assignments. No fabricated customer metrics or testimonials. Review draft articles and copy before final publication.

Talk thumbnails are served locally. External players load only after a visitor clicks play. The festival recording opens at Raúl's appearance, **1:41:44**; it is not a trimmed video. The site has no analytics or stored contact-form data. Google Fonts provides DM Sans and IBM Plex Mono, with local fallbacks and Georgia for editorial headings; embedded video providers may make their own requests after activation.

Credentials, environment files, generated output and installed dependencies are excluded from version control. Images and recordings remain subject to their respective owners' rights; this repository does not grant a separate licence to third-party media.
