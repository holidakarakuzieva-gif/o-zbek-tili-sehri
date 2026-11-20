const TS_EXCEPTIONS = new Set<string>([
  'ketsa',
  'ketsam',
  'ketsang',
  'ketsak',
  'ketsangiz',
  'ketsin',
  'otsiz',
  'otsin',
  'aytsa',
  'aytsam',
  'aytsang',
  'aytsak',
  'aytsin',
  'tutsa',
  'tutsam',
  'tutsang',
  'tutsak',
  'tutsin',
  'tutsiz',
  'sotsa',
  'sotsam',
  'sotsang',
  'sotsin',
  'sotsiz',
  'oʻtsa',
  'oʻtsam',
  'oʻtsang',
  'oʻtsak',
  'oʻtsin',
  'kutsa',
  'kutsam',
  'kutsin',
  'yutsa',
  'yutsam',
  'yutsin',
  'qaytsa',
  'qaytsam',
  'qaytsin',
  'bitsa',
  'bitsin',
  'yotsa',
  'yotsin',
  'etsa',
  'etsam',
  'etsang',
  'etsak',
  'etsin',
  'koʻrsatsa',
  'ishlatsa',
  'uzatsa',
  'tuzatsa',
  'kuzatsa',
  'oʻrgatsa',
  'yaratsa',
  'tarqatsa',
  'oʻynatsa',
  'yigʻlatsa',
  'yetishsa',
  'aytishsa',
  'ketishsa',
]);

const TS_LOANWORDS = new Set<string>([
  'litsey',
  'dotsent',
  'abzats',
  'konstitutsiya',
  'atseton',
  'ofitser',
  'protsent',
  'shprits',
  'mototsikl',
  'kvarts',
  'matritsa',
  'meditsina',
  'sotsial',
  'protsess',
  'pitsa',
  'vitse',
  'politsiya',
  'militsiya',
  'tantsor',
  'tsirk',
  'tsex',
  'tsement',
  'tsitrus',
]);

const SINGLE_CHAR_MAP: Record<string, string> = {
  a: 'а',
  b: 'б',
  d: 'д',
  e: 'е',
  f: 'ф',
  g: 'г',
  h: 'ҳ',
  i: 'и',
  j: 'ж',
  k: 'к',
  l: 'л',
  m: 'м',
  n: 'н',
  o: 'о',
  p: 'п',
  q: 'қ',
  r: 'р',
  s: 'с',
  t: 'т',
  u: 'у',
  v: 'в',
  x: 'х',
  y: 'й',
  z: 'з',
  A: 'А',
  B: 'Б',
  D: 'Д',
  E: 'Е',
  F: 'Ф',
  G: 'Г',
  H: 'Ҳ',
  I: 'И',
  J: 'Ж',
  K: 'К',
  L: 'Л',
  M: 'М',
  N: 'Н',
  O: 'О',
  P: 'П',
  Q: 'Қ',
  R: 'Р',
  S: 'С',
  T: 'Т',
  U: 'У',
  V: 'В',
  X: 'Х',
  Y: 'Й',
  Z: 'З',
  'ʼ': 'ъ',
};

const MODIFIER_CHARS = new Set(['ʻ', 'ʼ', "'", '‘', '’', '`']);
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);

function isUpper(ch: string | undefined): boolean {
  if (!ch) return false;
  return ch !== ch.toLowerCase() && ch === ch.toUpperCase();
}

function shouldUseTs(wordLower: string): boolean {
  if (TS_EXCEPTIONS.has(wordLower)) return false;
  if (TS_LOANWORDS.has(wordLower)) return true;
  if (
    wordLower.includes('tsiy') ||
    wordLower.includes('tsion') ||
    wordLower.includes('tsikl') ||
    wordLower.includes('tsent') ||
    wordLower.includes('tser')
  ) {
    return true;
  }
  return false;
}

function transliterateWord(word: string): string {
  // Normalize modifier lookalikes only around o/g or tutuq if needed, preferring U+02BB / U+02BC
  const lowerWord = word.toLowerCase();
  const allowTs = shouldUseTs(lowerWord);

  let result = '';
  let i = 0;

  while (i < word.length) {
    const ch = word[i];
    const next = word[i + 1];
    const next2 = word[i + 2];
    const chLower = ch.toLowerCase();
    const nextLower = next?.toLowerCase();

    // Handle yoʻ / Yoʻ / YOʻ -> йў / Йў / ЙЎ before generic yo -> ё
    if (
      chLower === 'y' &&
      nextLower === 'o' &&
      next2 &&
      MODIFIER_CHARS.has(next2)
    ) {
      if (isUpper(ch) && isUpper(next)) {
        result += 'ЙЎ';
      } else if (isUpper(ch)) {
        result += 'Йў';
      } else {
        result += 'йў';
      }
      i += 3;
      continue;
    }

    // oʻ -> ў, Oʻ -> Ў
    if (chLower === 'o' && next && MODIFIER_CHARS.has(next)) {
      result += isUpper(ch) ? 'Ў' : 'ў';
      i += 2;
      continue;
    }

    // gʻ -> ғ, Gʻ -> Ғ
    if (chLower === 'g' && next && MODIFIER_CHARS.has(next)) {
      result += isUpper(ch) ? 'Ғ' : 'ғ';
      i += 2;
      continue;
    }

    // sh -> ш
    if (chLower === 's' && nextLower === 'h') {
      result += isUpper(ch) ? 'Ш' : 'ш';
      i += 2;
      continue;
    }

    // ch -> ч
    if (chLower === 'c' && nextLower === 'h') {
      result += isUpper(ch) ? 'Ч' : 'ч';
      i += 2;
      continue;
    }

    // ng -> нг
    if (chLower === 'n' && nextLower === 'g') {
      if (isUpper(ch) && isUpper(next)) {
        result += 'НГ';
      } else if (isUpper(ch)) {
        result += 'Нг';
      } else {
        result += 'нг';
      }
      i += 2;
      continue;
    }

    // ts -> ц (only in loanwords)
    if (allowTs && chLower === 't' && nextLower === 's') {
      result += isUpper(ch) ? 'Ц' : 'ц';
      i += 2;
      continue;
    }

    // yo -> ё
    if (chLower === 'y' && nextLower === 'o') {
      result += isUpper(ch) ? 'Ё' : 'ё';
      i += 2;
      continue;
    }

    // yu -> ю
    if (chLower === 'y' && nextLower === 'u') {
      result += isUpper(ch) ? 'Ю' : 'ю';
      i += 2;
      continue;
    }

    // ya -> я
    if (chLower === 'y' && nextLower === 'a') {
      result += isUpper(ch) ? 'Я' : 'я';
      i += 2;
      continue;
    }

    // ye -> е
    if (chLower === 'y' && nextLower === 'e') {
      result += isUpper(ch) ? 'Е' : 'е';
      i += 2;
      continue;
    }

    // Word-initial or post-vowel 'e' -> 'э'
    if (chLower === 'e') {
      const prev = i > 0 ? word[i - 1] : undefined;
      const isStart = i === 0;
      const afterVowel = prev !== undefined && VOWELS.has(prev);
      const afterOOrGModifier =
        i >= 2 &&
        prev !== undefined &&
        MODIFIER_CHARS.has(prev) &&
        (word[i - 2].toLowerCase() === 'o' || word[i - 2].toLowerCase() === 'g');

      if (isStart || afterVowel || afterOOrGModifier) {
        result += isUpper(ch) ? 'Э' : 'э';
        i += 1;
        continue;
      }
    }

    // Single character mapping
    if (ch in SINGLE_CHAR_MAP) {
      result += SINGLE_CHAR_MAP[ch];
      i += 1;
      continue;
    }

    if (MODIFIER_CHARS.has(ch)) {
      result += 'ъ';
      i += 1;
      continue;
    }

    result += ch;
    i += 1;
  }

  return result;
}

/**
 * Converts Uzbek Latin text into Uzbek Cyrillic following official orthography rules.
 */
export function toCyrillic(text: string): string {
  if (!text) return '';
  return text.replace(/[A-Za-zʻʼ'‘’`]+/g, (token) => transliterateWord(token));
}
