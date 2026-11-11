const plainText = html => html.replace(/<[^>]+>/g, ' ').replace(/&(amp|lt|gt|quot|apos|nbsp|#\d+|#x[0-9a-f]+);/gi, (entity, key) => {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  if (!key.startsWith('#')) return named[key.toLowerCase()] || entity;
  const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1));
  return code <= 0x10ffff ? String.fromCodePoint(code) : entity;
}).replace(/\s+/g, ' ').trim();

export function prepareArticle(source, language = 'en') {
  const headings = [];
  const counts = new Map();
  const linkLabel = language === 'es' ? 'Enlace a esta sección' : 'Link to this section';
  let html = source.replace(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, content) => {
    const title = plainText(content);
    const slug = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'heading';
    const base = `section-${slug}`;
    const count = (counts.get(base) || 0) + 1;
    counts.set(base, count);
    const id = `${base}${count > 1 ? `-${count}` : ''}`;
    headings.push({ id, title, level: Number(level) });
    return `<h${level} id="${id}">${content}<a class="heading-anchor" href="#${id}" aria-label="${linkLabel}">#</a></h${level}>`;
  });
  const copyLabel = language === 'es' ? 'Copiar código' : 'Copy code';
  html = html.replace(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/gi, (_, attrs, code) => `<div class="code-example"><div class="code-tools"><button type="button" data-copy-code>${copyLabel}</button><span role="status" aria-live="polite"></span></div><pre${attrs} tabindex="0">${code}</pre></div>`);
  const words = plainText(source).split(/\s+/).filter(Boolean).length;
  return { html, headings, readingMinutes: Math.max(1, Math.ceil(words / 220)) };
}
