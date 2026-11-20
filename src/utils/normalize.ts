const APOSTROPHES_REGEX = /[ʻʼ'‘’`"]/g;

/**
 * Normalizes a string for forgiving Uzbek search:
 * lowercases, unifies/strips apostrophe variants (ʻ, ʼ, ', `, ‘, ’),
 * and collapses extra whitespace.
 */
export function normalizeForSearch(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(APOSTROPHES_REGEX, '')
    .replace(/\s+/g, ' ');
}

/**
 * Checks whether `query` matches `target` regardless of apostrophe variants or omission.
 */
export function matchesQuery(target: string, query: string): boolean {
  const normQuery = normalizeForSearch(query);
  if (!normQuery) return true;
  return normalizeForSearch(target).includes(normQuery);
}

/**
 * Normalizes user-typed exercise/test answers softly:
 * ignores case, apostrophe variants, and trailing punctuation.
 */
export function normalizeAnswer(input: string): string {
  return normalizeForSearch(input).replace(/[.,!?;:]+$/g, '').trim();
}
