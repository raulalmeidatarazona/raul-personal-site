import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const built = (path = 'index.html') => readFileSync(`dist/${path}`, 'utf8');

test('UX-01: all navigation links belong to a keyboard-operable disclosure', () => {
  const home = built();
  const menu = home.match(/<details\b[^>]*class="site-menu"[\s\S]*?<\/details>/)?.[0];
  assert.ok(menu, 'Navigation must have a native details menu');
  assert.match(menu, /<summary[^>]*>Menu<\/summary>/);
  for (const section of ['work', 'notes', 'videos', 'talks', 'about', 'contact']) {
    assert.ok(menu.includes(`href="/#${section}"`), `Missing menu destination: ${section}`);
  }
});

test('UX-03: the opening message names concrete backend problems', () => {
  const intro = built().match(/<p class="intro">([\s\S]*?)<\/p>/)?.[1] || '';
  assert.match(intro, /fragile integrations/);
  assert.match(intro, /inconsistent data/);
  assert.match(intro, /without unnecessary rewrites/);
});

test('UX-04: project decisions and limits are visible without opening a disclosure', () => {
  const projects = [...built().matchAll(/<article class="project[^"\n]*">([\s\S]*?)<\/article>/g)];
  assert.equal(projects.length, 2);
  for (const [, html] of projects) {
    const visible = html.replace(/<details[\s\S]*?<\/details>/g, '');
    assert.match(visible, /class="project-decision"/);
    assert.match(visible, /class="project-limit"/);
    assert.doesNotMatch(html, /Inside the decisions/);
  }
});

test('UX-06: contact offers a visible address and accessible copy feedback', () => {
  const html = built();
  assert.match(html, /id="contact"/);
  assert.match(html, /<button[^>]*data-copy-email[^>]*>Copy email<\/button>/);
  assert.match(html, /id="email-copy-status"[^>]*role="status"/);
  assert.ok(html.includes('mailto:raul.almeida@arsoluciondigital.com'));
  assert.ok(html.includes('href="#contact"'));
});

test('UX-07: internal links use internal arrows and media privacy is explained once per section', () => {
  const home = built();
  const internal = [...home.matchAll(/<a\b[^>]*href="(?:\/|#)[^"]*"[^>]*>([\s\S]*?)<\/a>/g)];
  for (const [, label] of internal) assert.ok(!label.includes('↗'), 'Internal links must not look external');
  assert.doesNotMatch(home, /DESIGN PREVIEW/);
  for (const [page, expected] of [['index.html', 2], ['videos/index.html', 1], ['talks/index.html', 1]]) {
    assert.equal((built(page).match(/The external player loads only when you press play/g) || []).length, expected);
    assert.doesNotMatch(built(page), /<iframe\b/);
  }
});
