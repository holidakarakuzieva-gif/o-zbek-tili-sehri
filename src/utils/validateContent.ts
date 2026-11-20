import { dictionaryEntries } from '../data/dictionary';
import { EXERCISE_TYPE_ORDER, sampleExercises } from '../data/exercises';
import { sampleFacts } from '../data/facts';
import { sampleGallery } from '../data/gallery';
import { CROSSWORD_PUZZLES } from '../data/gamesData';
import { sampleLessons } from '../data/lessons';
import { sampleProverbs } from '../data/proverbs';
import { sampleRiddles } from '../data/riddles';
import { sampleTests } from '../data/tests';
import { sampleTongueTwisters } from '../data/tongueTwisters';
import { uzCyrl } from '../i18n/uz-cyrl';
import { toCyrillic } from './translit';

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
    if (q.type === 'match') {
      if (!q.pairs || q.pairs.length < 2) {
        errors.push(`[test:${test.id}] Invalid match pairs in ${q.id}`);
      }
    }
    if (q.type === 'short') {
      if (!q.acceptedAnswers || q.acceptedAnswers.length === 0) {
        errors.push(`[test:${test.id}] Invalid short acceptedAnswers in ${q.id}`);
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

// 6. Stage 2 completeness & orthography checks
if (sampleLessons.length < 30) {
  errors.push(`[lessons] Expected >= 30 lessons, found ${sampleLessons.length}`);
}
for (const g of [8, 9, 10] as const) {
  const count = sampleLessons.filter((l) => l.grade === g).length;
  if (count < 10) {
    errors.push(`[lessons] Grade ${g} has ${count} lessons (expected >= 10)`);
  }
}
if (dictionaryEntries.length < 400) {
  errors.push(`[dictionary] Expected >= 400 entries, found ${dictionaryEntries.length}`);
}

const mixedTokenRe = /([A-Za-zʻʼ]+[\u0400-\u04FF]+|[\u0400-\u04FF]+[A-Za-zʻʼ]+)/;
const badQuoteRe = /['`‘’]/;

function checkUzField(scope: string, field: string, val: string): void {
  if (mixedTokenRe.test(val)) {
    errors.push(`[${scope}] Mixed Latin/Cyrillic token in ${field}: "${val}"`);
  }
  if (badQuoteRe.test(val)) {
    errors.push(`[${scope}] Non-standard quote/apostrophe in ${field}: "${val}"`);
  }
}

for (const lesson of sampleLessons) {
  const uzFields: [string, string][] = [
    ['titleUz', lesson.titleUz],
    ['goalUz', lesson.goalUz],
    ['didYouKnowUz', lesson.didYouKnowUz],
    ['ruDifferenceUz', lesson.ruDifferenceUz],
    ['typicalError.wrong', lesson.typicalError.wrong],
    ['typicalError.right', lesson.typicalError.right],
    ['typicalError.explanationUz', lesson.typicalError.explanationUz],
    ...lesson.theoryUz.map((t, i): [string, string] => [`theoryUz[${i}]`, t]),
    ...lesson.examples.map((e, i): [string, string] => [`examples[${i}].uz`, e.uz]),
    ...lesson.miniExercises.flatMap((m, i): [string, string][] => [
      [`mini[${i}].questionUz`, m.questionUz],
      [`mini[${i}].explanationUz`, m.explanationUz],
      ...m.options.map((o, j): [string, string] => [`mini[${i}].options[${j}]`, o]),
    ]),
  ];
  for (const [field, val] of uzFields) {
    checkUzField(`lesson:${lesson.id}`, field, val);
  }
  const cyrTitle = toCyrillic(lesson.titleUz);
  if (/[ʻʼ]/.test(cyrTitle)) {
    errors.push(`[lesson:${lesson.id}] Transliterated title contains ʻ/ʼ: "${cyrTitle}"`);
  }
}

for (const entry of dictionaryEntries) {
  for (const [field, val] of [
    ['uzLatn', entry.uzLatn],
    ['exampleUz', entry.exampleUz],
    ['topic', entry.topic],
  ] as const) {
    if (mixedTokenRe.test(val) || /[\u0400-\u04FF]/.test(val)) {
      errors.push(`[dictionary:${entry.id}] Cyrillic character in ${field}: "${val}"`);
    }
    if (badQuoteRe.test(val)) {
      errors.push(`[dictionary:${entry.id}] Non-standard quote/apostrophe in ${field}: "${val}"`);
    }
  }
}

// 7. Stage 3 exercises & crossword validation
if (sampleExercises.length < 100) {
  errors.push(`[exercises] Expected >= 100 exercises, found ${sampleExercises.length}`);
}
for (const tp of EXERCISE_TYPE_ORDER) {
  const count = sampleExercises.filter((e) => e.type === tp).length;
  if (count < 10) {
    errors.push(`[exercises] Type "${tp}" has ${count} items (expected >= 10)`);
  }
}
for (const ex of sampleExercises) {
  for (const [field, val] of [
    ['promptUz', ex.promptUz],
    ['hintUz', ex.hintUz],
    ['explanationUz', ex.explanationUz],
  ] as const) {
    checkUzField(`exercise:${ex.id}`, field, val);
  }
}

for (const puzzle of CROSSWORD_PUZZLES) {
  const placed = new Map<string, string>();
  for (const clue of puzzle.clues) {
    for (let i = 0; i < clue.answer.length; i++) {
      const r = clue.direction === 'across' ? clue.row : clue.row + i;
      const c = clue.direction === 'across' ? clue.col + i : clue.col;
      if (r < 0 || r >= puzzle.rows || c < 0 || c >= puzzle.cols) {
        errors.push(`[crossword:${puzzle.id}] Clue ${clue.id} out of bounds at (${r},${c})`);
      }
      const key = `${r}-${c}`;
      const existing = placed.get(key);
      if (existing && existing !== clue.answer[i]) {
        errors.push(
          `[crossword:${puzzle.id}] Conflict at (${r},${c}): "${existing}" vs "${clue.answer[i]}"`
        );
      }
      placed.set(key, clue.answer[i]);
    }
  }
}

// 8. Stage 4 tests, riddles, proverbs, tongueTwisters, facts, gallery validation
if (sampleTests.length < 18) {
  errors.push(`[tests] Expected >= 18 tests, found ${sampleTests.length}`);
}
for (const g of [8, 9, 10] as const) {
  const count = sampleTests.filter((tst) => tst.grade === g).length;
  if (count < 6) {
    errors.push(`[tests] Grade ${g} has ${count} tests (expected >= 6)`);
  }
}
for (const test of sampleTests) {
  checkUzField(`test:${test.id}`, 'titleUz', test.titleUz);
  checkUzField(`test:${test.id}`, 'topic', test.topic);
  for (const q of test.questions) {
    checkUzField(`test:${test.id}:${q.id}`, 'questionUz', q.questionUz);
    checkUzField(`test:${test.id}:${q.id}`, 'explanationUz', q.explanationUz);
    q.options?.forEach((o, i) => checkUzField(`test:${test.id}:${q.id}`, `options[${i}]`, o));
    q.acceptedAnswers?.forEach((a, i) =>
      checkUzField(`test:${test.id}:${q.id}`, `acceptedAnswers[${i}]`, a)
    );
  }
}

if (sampleRiddles.length < 40) {
  errors.push(`[riddles] Expected >= 40 riddles, found ${sampleRiddles.length}`);
}
for (const r of sampleRiddles) {
  r.lines.forEach((line, i) => checkUzField(`riddle:${r.id}`, `lines[${i}]`, line));
  checkUzField(`riddle:${r.id}`, 'answerUz', r.answerUz);
}

if (sampleProverbs.length < 30) {
  errors.push(`[proverbs] Expected >= 30 proverbs, found ${sampleProverbs.length}`);
}
for (const p of sampleProverbs) {
  checkUzField(`proverb:${p.id}`, 'uz', p.uz);
  checkUzField(`proverb:${p.id}`, 'meaningUz', p.meaningUz);
}

if (sampleTongueTwisters.length < 20) {
  errors.push(`[tongueTwisters] Expected >= 20 tongue twisters, found ${sampleTongueTwisters.length}`);
}
for (const tt of sampleTongueTwisters) {
  checkUzField(`tongueTwister:${tt.id}`, 'uz', tt.uz);
}

if (sampleFacts.length < 50) {
  errors.push(`[facts] Expected >= 50 facts, found ${sampleFacts.length}`);
}
for (const f of sampleFacts) {
  checkUzField(`fact:${f.id}`, 'titleUz', f.titleUz);
  checkUzField(`fact:${f.id}`, 'textUz', f.textUz);
}

if (sampleGallery.length < 30) {
  errors.push(`[gallery] Expected >= 30 gallery items, found ${sampleGallery.length}`);
}
for (const g of sampleGallery) {
  checkUzField(`gallery:${g.id}`, 'titleUz', g.titleUz);
  checkUzField(`gallery:${g.id}`, 'regionUz', g.regionUz);
  checkUzField(`gallery:${g.id}`, 'descriptionUz', g.descriptionUz);
  if (g.newWords.length < 3) {
    errors.push(`[gallery:${g.id}] Expected >= 3 newWords, found ${g.newWords.length}`);
  }
  g.newWords.forEach((w, i) => checkUzField(`gallery:${g.id}`, `newWords[${i}].uz`, w.uz));
  if (!g.imageUrl.startsWith('https://')) {
    errors.push(`[gallery:${g.id}] Invalid imageUrl: "${g.imageUrl}"`);
  }
}

if (errors.length > 0) {
  console.error('Content validation failed:\n' + errors.map((e) => ` - ${e}`).join('\n'));
  throw new Error(`Content validation failed with ${errors.length} error(s)`);
} else {
  console.log(
    `Content validation passed: ${sampleLessons.length} lessons, ${sampleExercises.length} exercises, ${sampleTests.length} tests, ${dictionaryEntries.length} dict entries, ${sampleRiddles.length} riddles, ${sampleProverbs.length} proverbs, ${sampleTongueTwisters.length} tongue twisters, ${sampleFacts.length} facts, ${sampleGallery.length} gallery items.`
  );
}
