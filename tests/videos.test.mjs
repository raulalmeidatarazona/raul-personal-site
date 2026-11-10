import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const catalogIds = ['EJ5NpxJ_SGU', 'b7IqZczTcGI', 'VnLj11LXxzo', 'GbBUQexIUrs', 'wnF2yn-QjWM', 'QD0J1roHq5o'];

test('the built video collection contains all six Shorts in editorial order without loading external players', () => {
  assert.ok(existsSync('dist/videos/index.html'), 'The /videos collection must be built');
  const html = readFileSync('dist/videos/index.html', 'utf8');
  const ids = [...html.matchAll(/data-short-id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, catalogIds);
  assert.equal((html.match(/data-video-embed\s/g) || []).length, 6);
  assert.doesNotMatch(html, /<iframe\b/i);
  for (const id of catalogIds) {
    assert.ok(html.includes(`https://www.youtube-nocookie.com/embed/${id}?`));
    assert.ok(html.includes(`https://www.youtube.com/shorts/${id}`));
    assert.ok(existsSync(`public/images/shorts/${id}.jpg`));
  }
  assert.equal((html.match(/Audio in Spanish/g) || []).length, 6);
  for (const duration of ['PT1M51S', 'PT1M3S', 'PT1M28S', 'PT2M31S', 'PT1M54S', 'PT1M47S']) {
    assert.ok(html.includes(`datetime="${duration}"`));
  }
});

test('the home page features modernisation, demand spikes and AI without changing the existing talks', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.ok(html.includes('id="videos"'), 'Home must include the short-video selection');
  const ids = [...html.matchAll(/data-short-id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, ['GbBUQexIUrs', 'wnF2yn-QjWM', 'QD0J1roHq5o']);
  assert.ok(html.includes('href="/videos/"'));
  assert.doesNotMatch(html, /<iframe\b/i);
  assert.equal((html.match(/data-video-embed\s/g) || []).length, 6);
  assert.ok(html.includes('start=6104'));
  assert.ok(html.includes('NCcNgffg'));
  assert.ok(html.includes('YV-pVvkb68U'));
});
