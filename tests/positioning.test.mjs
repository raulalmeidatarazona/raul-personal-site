import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('TypeScript is visible in the introduction, CARMA project and biography', () => {
  const home = readFileSync('dist/index.html', 'utf8');
  const hero = home.match(/class="hero-foot mono"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '';
  assert.match(hero, /TYPESCRIPT/);
  const carma = home.match(/<article class="project reverse">([\s\S]*?)<\/article>/)?.[1] || '';
  assert.match(carma, /<span>TypeScript<\/span>/);
  assert.ok(carma.includes('carma-challenge'));
  const biography = home.match(/id="about"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(biography, /Go, PHP, TypeScript and SQL/);
});
