import { dictionaryEntries } from '../data/dictionary';
import { sampleExercises } from '../data/exercises';
import { sampleFacts } from '../data/facts';
import { sampleGallery } from '../data/gallery';
import { sampleLessons } from '../data/lessons';
import { sampleProverbs } from '../data/proverbs';
import { sampleRiddles } from '../data/riddles';
import { sampleTests } from '../data/tests';
import { sampleTongueTwisters } from '../data/tongueTwisters';
import { uzCyrl } from '../i18n/uz-cyrl';

const errors: string[] = [];

function checkUniqueIds(items: { id: string }[], label: string): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.id) {
      errors.push(`[${label}] Missing id`);
    } else if (seen.has(item.id)) {
      errors.push(`[${label}] Duplicate id: ${item.id}`);
    }
    seen.add(item.id);
  }
}

// 1. Unique IDs
checkUniqueIds(sampleLessons, 'lessons');
checkUniqueIds(sampleExercises, 'exercises');
checkUniqueIds(sampleTests, 'tests');
checkUniqueIds(dictionaryEntries, 'dictionary');
checkUniqueIds(sampleRiddles, 'riddles');
checkUniqueIds(sampleProverbs, 'proverbs');
checkUniqueIds(sampleTongueTwisters, 'tongueTwisters');
checkUniqueIds(sampleFacts, 'facts');
checkUniqueIds(sampleGallery, 'gallery');

// 2. Dictionary duplicate Uzbek words
const dictWords = new Set<string>();
for (const entry of dictionaryEntries) {
  const key = entry.uzLatn.toLowerCase();
  if (dictWords.has(key)) {
    errors.push(`[dictionary] Duplicate uzLatn word: ${entry.uzLatn}`);
  }
  dictWords.add(key);

  if (/[ʻʼ'‘’`]/.test(entry.uzCyrl)) {
    errors.push(`[dictionary] Apostrophe found in Cyrillic: ${entry.uzCyrl}`);
  }
}

// 3. Lesson mini-exercises answer bounds
for (const lesson of sampleLessons) {
  checkUniqueIds(lesson.miniExercises, `lesson:${lesson.id}:miniExercises`);
  for (const ex of lesson.miniExercises) {
    if (ex.correctIndex < 0 || ex.correctIndex >= ex.options.length) {
      errors.push(`[lesson:${lesson.id}] Invalid correctIndex in ${ex.id}`);
    }
  }
}

// 4. Test question answer bounds
for (const test of sampleTests) {
  checkUniqueIds(test.questions, `test:${test.id}:questions`);
  for (const q of test.questions) {
    if (q.type === 'single') {
      if (
        !q.options ||
        q.correctIndex === undefined ||
        q.correctIndex < 0 ||
        q.correctIndex >= q.options.length
      ) {
        errors.push(`[test:${test.id}] Invalid single correctIndex in ${q.id}`);
      }
    }
    if (q.type === 'multiple') {
      if (
        !q.options ||
        !q.correctIndices ||
        q.correctIndices.length === 0 ||
        q.correctIndices.some((idx) => idx < 0 || idx >= q.options!.length)
      ) {
        errors.push(`[test:${test.id}] Invalid multiple correctIndices in ${q.id}`);
      }
    }
  }
}

// 5. Ensure Cyrillic i18n strings contain no ʻ or ʼ (except the Latin switcher label)
for (const [k, v] of Object.entries(uzCyrl)) {
  if (k === 'langUzLatn') continue;
  if (/[ʻʼ]/.test(v)) {
    errors.push(`[i18n:uz-cyrl] Modifier character ʻ or ʼ found in key "${k}": ${v}`);
  }
}

if (errors.length > 0) {
  console.error('Content validation failed:\n' + errors.map((e) => ` - ${e}`).join('\n'));
  throw new Error(`Content validation failed with ${errors.length} error(s)`);
} else {
  console.log(
    `Content validation passed: ${sampleLessons.length} lessons, ${sampleExercises.length} exercises, ${sampleTests.length} tests, ${dictionaryEntries.length} dict entries.`
  );
}
