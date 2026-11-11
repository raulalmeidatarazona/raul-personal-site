import test from 'node:test';
import assert from 'node:assert/strict';
import { copyText } from '../src/lib/copy-text.mjs';

test('copy feedback handles success, permission failure and unavailable clipboard without throwing', async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  try {
    let copied;
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { writeText: async text => { copied = text; } } } });
    const status = { textContent: '' };
    assert.equal(await copyText('public example', status, 'Copied', 'Copy manually'), true);
    assert.equal(copied, 'public example');
    assert.equal(status.textContent, 'Copied');
    navigator.clipboard.writeText = async () => { throw new Error('Permission denied'); };
    assert.equal(await copyText('public example', status, 'Copied', 'Copy manually'), false);
    assert.equal(status.textContent, 'Copy manually');
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} });
    assert.equal(await copyText('public example', status, 'Copied', 'Copy manually'), false);
    assert.equal(status.textContent, 'Copy manually');
  } finally {
    if (original) Object.defineProperty(globalThis, 'navigator', original);
    else delete globalThis.navigator;
  }
});
