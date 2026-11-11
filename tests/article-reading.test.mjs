import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('UX-05: every published article has a linked index, estimated reading time and code-copy controls', async () => {
  assert.ok(existsSync('src/lib/article-reading.mjs'), 'Article reading support is missing');
  const { prepareArticle } = await import('../src/lib/article-reading.mjs');
  const sample = '<h2>Retries &amp; recovery</h2><p>Preserve the original explanation.</p><h3>Retries &amp; recovery</h3><pre><code>if (a &lt; b) { retry(); }</code></pre>';
  const prepared = prepareArticle(sample);
  assert.deepEqual(prepared.headings.map(h => h.id), ['section-retries-recovery', 'section-retries-recovery-2']);
  assert.equal(prepared.headings[0].title, 'Retries & recovery');
  assert.ok(prepared.html.includes('<code>if (a &lt; b) { retry(); }</code>'));
  assert.equal(prepared.readingMinutes, 1);
  const articles = JSON.parse(readFileSync('src/data/articles.json', 'utf8'));
  for (const article of articles) {
    const html = readFileSync(`dist/p/${article.slug}/index.html`, 'utf8');
    assert.match(html, /class="article-toc"/);
    assert.match(html, /class="reading-time"/);
    const headings = [...html.matchAll(/<h[23]\b[^>]*id="([^"]+)"/g)].map(m => m[1]);
    assert.ok(headings.length > 0);
    assert.equal(new Set(headings).size, headings.length);
    for (const id of headings) assert.ok(html.includes(`href="#${id}"`));
    assert.equal((html.match(/<button\b[^>]*\bdata-copy-code/g) || []).length, article.sourceCodeBlockCount);
  }
});
