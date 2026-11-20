import type { ExerciseItem } from '../../types';

export const sampleExercises: ExerciseItem[] = [
  {
    id: 'ex-sound-1',
    type: 'sound-detective',
    grade: 8,
    promptUz: 'Qaysi soʻz "ahvol, vaziyat" (состояние) maʼnosida toʻgʻri yozilgan?',
    promptRu: 'Какое слово в значении «состояние» написано правильно?',
    hintUz: 'Yengil "h" harfi ishlatiladi.',
    hintRu: 'Используется лёгкий звук «h».',
    explanationUz: '"Hol" — ahvol, "xol" — yuzdagi nuqta (родинка).',
    explanationRu: '«Hol» означает состояние, а «xol» — родинка.',
    payload: {
      options: ['xol', 'hol', 'qol', 'kol'],
      correctIndex: 1,
    },
  },
  {
    id: 'ex-sentence-1',
    type: 'sentence-builder',
    grade: 8,
    promptUz: 'Soʻzlarni toʻgʻri tartibga keltirib gap tuzing (feʼl gap oxirida):',
    promptRu: 'Соберите предложение в правильном порядке (глагол в конце):',
    hintUz: 'Avval ega ("Men"), keyin toʻldiruvchi, oxirida kesim.',
    hintRu: 'Сначала подлежащее («Men»), затем дополнение, в конце сказуемое.',
    explanationUz: 'Oʻzbek tilida odatiy soʻz tartibi: Ega + Ikkinchi darajali boʻlaklar + Kesim.',
    explanationRu: 'Базовый порядок слов в узбекском: Подлежащее + Второстепенные члены + Сказуемое.',
    payload: {
      tokens: ['oʻqiyman', 'kitob', 'qiziqarli', 'Men'],
      correctOrder: ['Men', 'qiziqarli', 'kitob', 'oʻqiyman'],
    },
  },
  {
    id: 'ex-fill-1',
    type: 'fill-blank',
    grade: 9,
    promptUz: 'Boʻsh joyga mos qoʻshimchani tanlang: "Biz maktab___ ketdik." (в школу)',
    promptRu: 'Выберите подходящее окончание: «Biz maktab___ ketdik.» (в школу)',
    hintUz: 'Yoʻnalish kelishigi "qayerga?" savoliga javob beradi.',
    hintRu: 'Направительный падеж отвечает на вопрос «qayerga?» (куда?).',
    explanationUz: '"Qayerga?" savoliga "-ga" qoʻshimchasi javob beradi: maktabga.',
    explanationRu: 'На вопрос «куда?» отвечает окончание «-ga»: maktabga.',
    payload: {
      options: ['-da', '-ga', '-dan', '-ni'],
      correctIndex: 1,
    },
  },
  {
    id: 'ex-translate-1',
    type: 'translator',
    grade: 8,
    promptUz: '"Три книги" birikmasini oʻzbek tiliga tarjima qiling:',
    promptRu: 'Переведите словосочетание «Три книги» на узбекский:',
    hintUz: 'Sondan keyin ot birlikda keladi (-lar qoʻshilmaydi).',
    hintRu: 'После числительного существительное ставится в единственном числе (без -lar).',
    explanationUz: 'Oʻzbek tilida sondan keyin "-lar" qoʻshilmaydi: uchta kitob.',
    explanationRu: 'В узбекском после чисел окончание «-lar» не добавляется: uchta kitob.',
    payload: {
      acceptedAnswers: ['uchta kitob', 'uch kitob'],
    },
  },
];
