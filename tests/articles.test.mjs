import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const slugs = [
  'idempotent-consumers-anti-corruption',
  'from-binlog-to-cloudevents-building',
  'building-the-go-streamer-reading',
  'the-polling-tax-how-to-decouple-legacy',
  'estrategias-comprobadas-para-reducir',
  'git-hooks-pre-push-y-draft-pull-request',
];

test('all six original articles are readable locally with their original metadata, code and images', () => {
  assert.ok(existsSync('src/data/articles.json'), 'The original article catalogue must be imported');
  const articles = JSON.parse(readFileSync('src/data/articles.json', 'utf8'));
  assert.deepEqual(articles.map(article => article.slug), slugs);
  for (const article of articles) {
    const file = `dist/p/${article.slug}/index.html`;
    assert.ok(existsSync(file), `Missing article: ${article.slug}`);
    const html = readFileSync(file, 'utf8');
    const body = readFileSync(`src/articles/${article.slug}.html`, 'utf8');
    assert.ok(html.includes(`lang="${article.language}"`));
    assert.ok(html.includes(`datetime="${article.publishedAt}"`));
    assert.ok(html.includes(`rel="canonical" href="${article.sourceUrl}"`));
    assert.ok(html.includes('name="robots" content="noindex,follow"'));
    assert.ok(html.includes(article.title.replaceAll('&', '&amp;')));
    assert.equal(createHash('sha256').update(body).digest('hex'), article.bodySha256);
    assert.doesNotMatch(body, /<(?:script|iframe|form|input|button|svg)\b|\son\w+\s*=|javascript:/i);
    assert.doesNotMatch(body, /<h1\b|subscription-widget/);
    assert.equal((body.match(/<img\b/g) || []).length, article.sourceImageCount);
    assert.equal((body.match(/<pre\b/g) || []).length, article.sourceCodeBlockCount);
    for (const image of article.images) assert.ok(existsSync(`public${image.localPath}`));
  }
});

test('the writing archive exposes all published articles and an ordered series instead of the two draft notes', () => {
  assert.ok(existsSync('dist/notes/index.html'), 'A complete writing archive must be built');
  const archive = readFileSync('dist/notes/index.html', 'utf8');
  const home = readFileSync('dist/index.html', 'utf8');
  for (const slug of slugs) assert.ok(archive.includes(`/p/${slug}/`));
  for (const slug of ['the-polling-tax-how-to-decouple-legacy', 'idempotent-consumers-anti-corruption', 'estrategias-comprobadas-para-reducir']) {
    assert.ok(home.includes(`/p/${slug}/`));
  }
  assert.doesNotMatch(home, /href="\/notes\/(?:retries-are-not-a-strategy|using-ai-without-outsourcing-judgement)/);
  assert.ok(archive.includes('id="legacy-to-events"'));
  const series = ['the-polling-tax-how-to-decouple-legacy', 'building-the-go-streamer-reading', 'from-binlog-to-cloudevents-building', 'idempotent-consumers-anti-corruption'];
  for (let i = 0; i < series.length; i++) {
    const html = readFileSync(`dist/p/${series[i]}/index.html`, 'utf8');
    if (i > 0) assert.ok(html.includes(`/p/${series[i - 1]}/`));
    if (i < series.length - 1) assert.ok(html.includes(`/p/${series[i + 1]}/`));
  }
});
