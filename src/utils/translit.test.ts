import { describe, expect, it } from 'vitest';
import { toCyrillic } from './translit';

describe('toCyrillic transliterator', () => {
  it('converts basic Uzbek words with oʻ, gʻ, sh, ch, ng, ʼ', () => {
    const cases: [string, string][] = [
      ['oʻqituvchi', 'ўқитувчи'],
      ['Oʻzbekiston', 'Ўзбекистон'],
      ['gʻisht', 'ғишт'],
      ['Gʻolib', 'Ғолиб'],
      ['eshik', 'эшик'],
      ['Eshik', 'Эшик'],
      ['yer', 'ер'],
      ['Yer', 'Ер'],
      ['maʼno', 'маъно'],
      ['taʼlim', 'таълим'],
      ['sheʼr', 'шеър'],
      ['aʼlo', 'аъло'],
      ['eʼlon', 'эълон'],
      ['Toshkent', 'Тошкент'],
      ['shahar', 'шаҳар'],
      ['chiroyli', 'чиройли'],
      ['tong', 'тонг'],
      ['quyosh', 'қуёш'],
      ['yulduz', 'юлдуз'],
      ['yaxshi', 'яхши'],
      ['yomgʻir', 'ёмғир'],
      ['yoʻl', 'йўл'],
      ['Yoʻl', 'Йўл'],
      ['keldi', 'келди'],
      ['maktab', 'мактаб'],
      ['doʻstlik', 'дўстлик'],
      ['baxt', 'бахт'],
      ['hayot', 'ҳаёт'],
      ['xalq', 'халқ'],
      ['qalam', 'қалам'],
      ['SHAHAR', 'ШАҲАР'],
      ['CHIROYLI', 'ЧИРОЙЛИ'],
      ['OʻZBEK', 'ЎЗБЕК'],
      ['NG', 'НГ'],
    ];

    for (const [latn, cyrl] of cases) {
      expect(toCyrillic(latn)).toBe(cyrl);
    }
  });

  it('handles ts -> ц only in loanwords and preserves native exceptions', () => {
    expect(toCyrillic('litsey')).toBe('лицей');
    expect(toCyrillic('dotsent')).toBe('доцент');
    expect(toCyrillic('abzats')).toBe('абзац');
    expect(toCyrillic('konstitutsiya')).toBe('конституция');
    expect(toCyrillic('ofitser')).toBe('офицер');
    // Native morpheme boundaries
    expect(toCyrillic('ketsa')).toBe('кетса');
    expect(toCyrillic('otsiz')).toBe('отсиз');
    expect(toCyrillic('aytsa')).toBe('айтса');
    expect(toCyrillic('oʻtsa')).toBe('ўтса');
  });

  it('transliterates full sentences preserving punctuation', () => {
    expect(toCyrillic("Men oʻzbek tilini yaxshi koʻraman!")).toBe(
      'Мен ўзбек тилини яхши кўраман!'
    );
    expect(toCyrillic('Bugun ob-havo juda aʼlo.')).toBe('Бугун об-ҳаво жуда аъло.');
  });
});
