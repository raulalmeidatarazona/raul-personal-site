# Photo and speaking sources

## Short-video collection

Channel supplied by Raúl: https://www.youtube.com/@raulalmeida5710/shorts

The six public Shorts were inventoried and their durations checked against YouTube player metadata. Automatic Spanish transcripts informed the editorial summaries; English titles are site copy, not replacements for original YouTube titles. Original titles are retained in `src/data/videos.ts` and used for player labels.

Suggested watching order (not an existing YouTube playlist or a complete course):

1. https://www.youtube.com/shorts/EJ5NpxJ_SGU — 1:51
2. https://www.youtube.com/shorts/b7IqZczTcGI — 1:03
3. https://www.youtube.com/shorts/VnLj11LXxzo — 1:28
4. https://www.youtube.com/shorts/GbBUQexIUrs — 2:31
5. https://www.youtube.com/shorts/wnF2yn-QjWM — 1:54
6. https://www.youtube.com/shorts/QD0J1roHq5o — 1:47

Home features modernisation, demand spikes and AI, in that order. All recordings retain their original Spanish audio. No YouTube uploads, titles or playlists were changed.

Official thumbnails downloaded from `https://i.ytimg.com/vi/{videoId}/maxresdefault.jpg` into `public/images/shorts/`. Inspected together with the centre-cropped 9:16 display used on the site: faces and main visual material remain visible. Local thumbnails and explicit click-to-load YouTube privacy-enhanced embeds preserve the existing player behaviour.

## Portrait

User-supplied existing portrait, copied unchanged to `public/images/raul-almeida-portrait.jpg`. Inspected before use. No AI retouching applied.

## WordCamp Cartagena 2024

Official speaker page: https://cartagena.wordcamp.org/2024/speaker/raul-hernando-almeida/

Official title: «APIs y Automatización: Transformando tu WordPress en una Máquina de Negocios».
Official schedule: 8 June 2024, 12:45, Sala B.
Official recording supplied by Raúl and verified on WordPress.tv: https://wordpress.tv/2024/07/23/apis-y-automatizacion-transformando-tu-wordpress-en-una-maquina-de-negocios/

Published on 23 July 2024 (publication date, not event date). VideoPress ID: NCcNgffg. No matching YouTube upload verified. Do not label the separate WordPress Cartagena recording as this WordCamp session.

## WordPress Cartagena recording

YouTube: https://www.youtube.com/watch?v=YV-pVvkb68U
YouTube oEmbed verified title: «Desarrollar en WordPress con Raul Almeida».
Publisher: WordPress Cartagena. Thumbnail downloaded from the verified oEmbed image URL and served locally. A click-to-load YouTube privacy-enhanced embed plays within the page; the original source link remains visible. No third-party video requests before clicking a thumbnail.

## Embedded players and thumbnails

Shared Astro component: `src/components/VideoEmbed.astro`. Players are created only after an explicit click; close removes the iframe and returns keyboard focus to the play button. No extra player dependency.

WordCamp uses the VideoPress embed found in the official WordPress.tv page, ID NCcNgffg. Thumbnail source: https://videos.files.wordpress.com/NCcNgffg/video-bffb5ecd94_mp4.scrubthumb.jpg?w=1280 (inspected: a single title slide, not a contact sheet).

Festival thumbnail source: https://i.ytimg.com/vi/T6qQIuMQZ1A/hqdefault.jpg (inspected: Raúl speaking at the event). Both are served locally. YouTube embed uses `start=6104`; source link retains `t=6104s`. This starts at the requested appearance but does not restrict seeking or trim the recording.

## Sustainable fashion festival

Recording supplied by Raúl: https://m.youtube.com/watch?v=T6qQIuMQZ1A&pp=iggUQAFKEExpRmphaV8zR1Q4OWxNWXc%3D

YouTube oEmbed title preserved verbatim: «SUSTAINABLE FASHION FEST 2026 - Barcelona - DIA 3 - Comnferencia». Publisher: Sustainable Fashion Fest.

Raúl identifies his appearance as starting at 1:41:44. Timestamp calculated as 6104 seconds; site link: https://www.youtube.com/watch?v=T6qQIuMQZ1A&t=6104s. It links to that position in the original broadcast; it is not a trimmed clip.

«Technology meets sustainable fashion» is descriptive site copy, not a verified session title. No exact event date or session title asserted.
