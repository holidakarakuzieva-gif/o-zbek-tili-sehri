import { describe, expect, it } from 'vitest';
import { matchesQuery, normalizeAnswer, normalizeForSearch } from './normalize';

describe('normalize utilities', () => {
  it('treats all apostrophe variants and omissions identically for search', () => {
    expect(normalizeForSearch('oʻqituvchi')).toBe('oqituvchi');
    expect(normalizeForSearch("o'qituvchi")).toBe('oqituvchi');
    expect(normalizeForSearch('o`qituvchi')).toBe('oqituvchi');
    expect(normalizeForSearch('o‘qituvchi')).toBe('oqituvchi');
    expect(normalizeForSearch('maʼno')).toBe('mano');
  });

  it('matches queries without modifier characters against official orthography', () => {
    expect(matchesQuery('oʻqituvchi', 'oqituvchi')).toBe(true);
    expect(matchesQuery('oʻqituvchi', "o'qituv")).toBe(true);
    expect(matchesQuery('gʻisht', 'gisht')).toBe(true);
    expect(matchesQuery('maʼno', 'mano')).toBe(true);
    expect(matchesQuery('kitob', 'daftar')).toBe(false);
  });

  it('normalizes answers softly for exercises', () => {
    expect(normalizeAnswer("  Men o'quvchiman! ")).toBe('men oquvchiman');
    expect(normalizeAnswer('Men oʻquvchiman.')).toBe('men oquvchiman');
  });
});
