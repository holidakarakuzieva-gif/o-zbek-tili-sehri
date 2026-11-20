export interface WordSearchSet {
  id: string;
  titleUz: string;
  titleRu: string;
  size: number;
  words: { word: string; ru: string }[];
}

export interface CrosswordClue {
  id: string;
  number: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
  answer: string;
  clueUz: string;
  clueRu: string;
}

export interface CrosswordPuzzle {
  id: string;
  titleUz: string;
  titleRu: string;
  rows: number;
  cols: number;
  clues: CrosswordClue[];
}

export interface MemoryDeck {
  id: string;
  titleUz: string;
  titleRu: string;
  pairs: { id: string; uz: string; ru: string; emoji: string }[];
}

export interface MillionaireQuestion {
  id: string;
  level: number;
  questionUz: string;
  questionRu: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  hintUz: string;
  hintRu: string;
}

export interface FallingLetterItem {
  id: string;
  before: string;
  after: string;
  missing: string;
  choices: string[];
  fullWord: string;
  ru: string;
}

export interface AffixTrainItem {
  id: string;
  root: string;
  ruPrompt: string;
  correctAffix: string;
  wagons: string[];
  resultWord: string;
}

export interface HiddenWordItem {
  id: string;
  word: string;
  clueUz: string;
  clueRu: string;
}

export interface BlitzQuestion {
  id: string;
  qUz: string;
  qRu: string;
  options: [string, string, string];
  correct: 0 | 1 | 2;
}

export type SyntaxRole = 'ega' | 'kesim' | 'toldiruvchi' | 'aniqlovchi' | 'hol';

export interface SentenceAnalyzerItem {
  id: string;
  grade: 8 | 9;
  ru: string;
  tokens: { word: string; role: SyntaxRole }[];
}

export interface CompoundBuilderItem {
  id: string;
  grade: 10;
  clause1Uz: string;
  clause2Uz: string;
  ru: string;
  choices: string[];
  correctConjunction: string;
  explanationUz: string;
  explanationRu: string;
}

export const WORD_SEARCH_SETS: WordSearchSet[] = [
  {
    id: 'ws-school',
    titleUz: 'Maktab va bilim',
    titleRu: 'Школа и знания',
    size: 8,
    words: [
      { word: 'KITOB', ru: 'книга' },
      { word: 'MAKTAB', ru: 'школа' },
      { word: 'QALAM', ru: 'карандаш' },
      { word: 'DAFTAR', ru: 'тетрадь' },
      { word: 'USTOZ', ru: 'учитель' },
      { word: 'SINF', ru: 'класс' },
    ],
  },
  {
    id: 'ws-cities',
    titleUz: 'Oʻzbekiston shaharlari',
    titleRu: 'Города Узбекистана',
    size: 9,
    words: [
      { word: 'TOSHKENT', ru: 'Ташкент' },
      { word: 'SAMARQAND', ru: 'Самарканд' },
      { word: 'BUXORO', ru: 'Бухара' },
      { word: 'XIVA', ru: 'Хива' },
      { word: 'ANDIJON', ru: 'Андижан' },
      { word: 'TERMIZ', ru: 'Термез' },
    ],
  },
  {
    id: 'ws-nature',
    titleUz: 'Tabiat va fasllar',
    titleRu: 'Природа и времена года',
    size: 8,
    words: [
      { word: 'BAHOR', ru: 'весна' },
      { word: 'KUZ', ru: 'осень' },
      { word: 'QISH', ru: 'зима' },
      { word: 'DARAXT', ru: 'дерево' },
      { word: 'CHINOR', ru: 'чинара' },
      { word: 'LOLA', ru: 'тюльпан' },
    ],
  },
];

export const CROSSWORD_PUZZLES: CrosswordPuzzle[] = [
  {
    id: 'cw-school',
    titleUz: 'Maktab hayoti',
    titleRu: 'Школьная жизнь',
    rows: 10,
    cols: 7,
    clues: [
      {
        id: 'cw1-1a',
        number: 1,
        direction: 'across',
        row: 0,
        col: 0,
        answer: 'KITOB',
        clueUz: 'Bilim manbayi, oʻqiladigan asar',
        clueRu: 'Книга — источник знаний',
      },
      {
        id: 'cw1-2d',
        number: 2,
        direction: 'down',
        row: 0,
        col: 1,
        answer: 'ILM',
        clueUz: 'Oʻqib-oʻrganish orqali olinadigan bilim',
        clueRu: 'Знание, наука',
      },
      {
        id: 'cw1-3d',
        number: 3,
        direction: 'down',
        row: 0,
        col: 3,
        answer: 'OLMA',
        clueUz: 'Bogʻda oʻsadigan shirin meva',
        clueRu: 'Яблоко',
      },
      {
        id: 'cw1-4a',
        number: 4,
        direction: 'across',
        row: 3,
        col: 0,
        answer: 'QALAM',
        clueUz: 'Rasm chizish yoki yozish quroli',
        clueRu: 'Карандаш',
      },
      {
        id: 'cw1-5d',
        number: 5,
        direction: 'down',
        row: 3,
        col: 4,
        answer: 'MAKTAB',
        clueUz: 'Oʻquvchilar taʼlim oladigan maskan',
        clueRu: 'Школа',
      },
      {
        id: 'cw1-6a',
        number: 6,
        direction: 'across',
        row: 6,
        col: 1,
        answer: 'DAFTAR',
        clueUz: 'Ichiga mashq va qoidalar yoziladi',
        clueRu: 'Тетрадь',
      },
      {
        id: 'cw1-7d',
        number: 7,
        direction: 'down',
        row: 6,
        col: 1,
        answer: 'DARS',
        clueUz: '45 daqiqalik oʻquv mashgʻuloti',
        clueRu: 'Урок',
      },
    ],
  },
  {
    id: 'cw-uzbekistan',
    titleUz: 'Vatan va tabiat',
    titleRu: 'Родина и природа',
    rows: 9,
    cols: 9,
    clues: [
      {
        id: 'cw2-1a',
        number: 1,
        direction: 'across',
        row: 1,
        col: 0,
        answer: 'TOSHKENT',
        clueUz: 'Oʻzbekistonning poytaxti',
        clueRu: 'Столица Узбекистана',
      },
      {
        id: 'cw2-1d',
        number: 1,
        direction: 'down',
        row: 1,
        col: 0,
        answer: 'TARIX',
        clueUz: 'Oʻtmishni oʻrganadigan fan',
        clueRu: 'История',
      },
      {
        id: 'cw2-2d',
        number: 2,
        direction: 'down',
        row: 1,
        col: 2,
        answer: 'SUV',
        clueUz: 'Hayot manbayi, daryo va buloqlarda oqadi',
        clueRu: 'Вода',
      },
      {
        id: 'cw2-3a',
        number: 3,
        direction: 'across',
        row: 3,
        col: 2,
        answer: 'VATAN',
        clueUz: 'Ona yurt, tugʻilib oʻsgan diyor',
        clueRu: 'Родина',
      },
      {
        id: 'cw2-4d',
        number: 4,
        direction: 'down',
        row: 3,
        col: 4,
        answer: 'TABIAT',
        clueUz: 'Oʻrmonlar, togʻlar, daryolar — atrof-muhit',
        clueRu: 'Природа',
      },
      {
        id: 'cw2-5a',
        number: 5,
        direction: 'across',
        row: 5,
        col: 4,
        answer: 'BAHOR',
        clueUz: 'Navroʻz keladigan goʻzal fasl',
        clueRu: 'Весна',
      },
      {
        id: 'cw2-6d',
        number: 6,
        direction: 'down',
        row: 5,
        col: 8,
        answer: 'RASM',
        clueUz: 'Qalam yoki boʻyoqda chizilgan tasvir',
        clueRu: 'Рисунок, картина',
      },
    ],
  },
];

export const MEMORY_DECKS: MemoryDeck[] = [
  {
    id: 'mem-1',
    titleUz: 'Kundalik soʻzlar',
    titleRu: 'Повседневные слова',
    pairs: [
      { id: 'm1', uz: 'kutubxona', ru: 'библиотека', emoji: '📚' },
      { id: 'm2', uz: 'doʻstlik', ru: 'дружба', emoji: '🤝' },
      { id: 'm3', uz: 'quyosh', ru: 'солнце', emoji: '☀️' },
      { id: 'm4', uz: 'koʻprik', ru: 'мост', emoji: '🌉' },
      { id: 'm5', uz: 'bilim', ru: 'знание', emoji: '💡' },
      { id: 'm6', uz: 'sayohat', ru: 'путешествие', emoji: '🧭' },
    ],
  },
  {
    id: 'mem-2',
    titleUz: 'Feʼllar',
    titleRu: 'Важные глаголы',
    pairs: [
      { id: 'm7', uz: 'oʻrganmoq', ru: 'изучать', emoji: '📖' },
      { id: 'm8', uz: 'yaratmoq', ru: 'создавать', emoji: '✨' },
      { id: 'm9', uz: 'asramoq', ru: 'беречь', emoji: '🛡️' },
      { id: 'm10', uz: 'tekshirmoq', ru: 'проверять', emoji: '🔍' },
      { id: 'm11', uz: 'tuzatmoq', ru: 'исправлять', emoji: '🛠️' },
      { id: 'm12', uz: 'qoʻrqmoq', ru: 'бояться', emoji: '😨' },
    ],
  },
  {
    id: 'mem-3',
    titleUz: 'Oʻzbekiston va madaniyat',
    titleRu: 'Узбекистан и культура',
    pairs: [
      { id: 'm13', uz: 'obida', ru: 'памятник', emoji: '🕌' },
      { id: 'm14', uz: 'mehmondoʻstlik', ru: 'гостеприимство', emoji: '🫖' },
      { id: 'm15', uz: 'anʼana', ru: 'традиция', emoji: '🎊' },
      { id: 'm16', uz: 'naqsh', ru: 'орнамент', emoji: '💠' },
      { id: 'm17', uz: 'shoir', ru: 'поэт', emoji: '✒️' },
      { id: 'm18', uz: 'meros', ru: 'наследие', emoji: '📜' },
    ],
  },
];

export const MILLIONAIRE_QUESTIONS: MillionaireQuestion[] = [
  {
    id: 'mq-1',
    level: 1,
    questionUz: 'Oʻzbek lotin alifbosida nechta harf va harf birikmasi bor?',
    questionRu: 'Сколько букв и буквосочетаний в узбекском латинском алфавите?',
    options: ['26 ta', '29 ta', '33 ta', '35 ta'],
    correctIndex: 1,
    hintUz: '26 ta harf + sh, ch, ng birikmalari = ...',
    hintRu: '26 одиночных букв + 3 диграфа (sh, ch, ng).',
  },
  {
    id: 'mq-2',
    level: 2,
    questionUz: '«Книга» soʻzi oʻzbek tilida qanday yoziladi?',
    questionRu: 'Как правильно пишется слово «книга» по-узбекски?',
    options: ['kitop', 'kitob', 'qitob', 'kitab'],
    correctIndex: 1,
    hintUz: 'Oxirida «b» harfi yoziladi.',
    hintRu: 'На конце пишется звонкая буква «b».',
  },
  {
    id: 'mq-3',
    level: 3,
    questionUz: '«Пять учеников» birikmasi qaysi javobda toʻgʻri?',
    questionRu: 'Как правильно перевести «пять учеников»?',
    options: ['beshta oʻquvchilar', 'beshta oʻquvchi', 'beshlar oʻquvchi', 'besh oʻquvchilar'],
    correctIndex: 1,
    hintUz: 'Sondan keyin «-lar» qoʻshilmaydi.',
    hintRu: 'После числительного окончание -lar не используется.',
  },
  {
    id: 'mq-4',
    level: 4,
    questionUz: '«U» olmoshi rus tiliga qanday tarjima qilinadi?',
    questionRu: 'Как переводится местоимение «u» на русский язык?',
    options: ['Только «он»', 'Только «она»', '«Он», «она», «оно»', 'Только «они»'],
    correctIndex: 2,
    hintUz: 'Oʻzbek tilida grammatik rod yoʻq.',
    hintRu: 'В узбекском языке нет категории грамматического рода.',
  },
  {
    id: 'mq-5',
    level: 5,
    questionUz: 'Qaysi soʻz «ahvol, vaziyat» (состояние) maʼnosini bildiradi?',
    questionRu: 'Какое слово означает «состояние» (а не «родинка»)?',
    options: ['xol', 'hol', 'qol', 'gol'],
    correctIndex: 1,
    hintUz: 'Yengil «h» harfi bilan boshlanadi.',
    hintRu: 'Начинается с мягкого звука «h».',
  },
  {
    id: 'mq-6',
    level: 6,
    questionUz: '«В школе» (qayerda?) maʼnosini qaysi kelishik beradi?',
    questionRu: 'Какой падеж соответствует значению «в школе»?',
    options: ['maktabga', 'maktabdan', 'maktabda', 'maktabni'],
    correctIndex: 2,
    hintUz: 'Oʻrin-payt kelishigi «-da» qoʻshimchasi bilan yasaladi.',
    hintRu: 'Местный падеж отвечает на вопрос «где?» с окончанием -da.',
  },
  {
    id: 'mq-7',
    level: 7,
    questionUz: 'Oʻzbek gapida kesim (glagol-skazuyemoye) odatda qayerda turadi?',
    questionRu: 'Где обычно стоит сказуемое в нейтральном узбекском предложении?',
    options: ['Boshida', 'Oʻrtasida', 'Oxirida', 'Ikkinchi oʻrinda'],
    correctIndex: 2,
    hintUz: 'Ega + ikkinchi darajali boʻlaklar + ...',
    hintRu: 'Базовый порядок слов: SOV (глагол в конце).',
  },
  {
    id: 'mq-8',
    level: 8,
    questionUz: '«K» harfi bilan tugagan soʻzga joʻnalish kelishigi qanday qoʻshiladi (bilak + ?)?',
    questionRu: 'Какое окончание направительного падежа присоединяется к основе на «k»?',
    options: ['-ga', '-qa', '-ka', '-da'],
    correctIndex: 2,
    hintUz: 'Jarangli «g» jarangsiz «k» ga moslashadi.',
    hintRu: 'После глухого «k» выбирается «-ka».',
  },
  {
    id: 'mq-9',
    level: 9,
    questionUz: 'Qaysi soʻzda tutuq belgisi (ʼ) maʼnoni oʻzgartiradi («стих» ↔ «лев»)?',
    questionRu: 'В какой паре апостроф ʼ различает значения «стих» и «лев»?',
    options: ['talim / talʼim', 'sher / sheʼr', 'orzu / oʻrzu', 'baxt / baxʼt'],
    correctIndex: 1,
    hintUz: 'Hayvon — «sher», adabiy janr — ...',
    hintRu: 'Лев — «sher», а стихотворение пишется с ʼ.',
  },
  {
    id: 'mq-10',
    level: 10,
    questionUz: '«Qoʻrqmoq» (бояться) feʼli qaysi kelishikni talab qiladi?',
    questionRu: 'Какого падежа требует глагол «qoʻrqmoq» (бояться)?',
    options: ['Tushum (-ni)', 'Qaratqich (-ning)', 'Chiqish (-dan)', 'Joʻnalish (-ga)'],
    correctIndex: 2,
    hintUz: '«Nimadan qoʻrqasan?» deb soʻraladi.',
    hintRu: 'Дословно в узбекском: «бояться от кого/чего?».',
  },
  {
    id: 'mq-11',
    level: 11,
    questionUz: '«Xamsa» besh dostonining muallifi, oʻzbek adabiy tilining asoschisi kim?',
    questionRu: 'Кто написал знаменитую «Хамсу» и заложил основы узбекского литературного языка?',
    options: ['Mirzo Ulugʻbek', 'Alisher Navoiy', 'Zahiriddin Bobur', 'Abu Rayhon Beruniy'],
    correctIndex: 1,
    hintUz: '«Muhokamat ul-lugʻatayn» asarini ham yozgan.',
    hintRu: 'Великий поэт и мыслитель XV века.',
  },
  {
    id: 'mq-12',
    level: 12,
    questionUz: '«Задать вопрос» iborasining kalkasiz, toʻgʻri oʻzbekcha tarjimasi qaysi?',
    questionRu: 'Как правильно без кальки перевести фразу «задать вопрос»?',
    options: ['savol qoʻymoq', 'savol bermoq', 'savol yasamoq', 'savol olmoq'],
    correctIndex: 1,
    hintUz: 'Oʻzbek tilida savol «beriladi».',
    hintRu: 'По-узбекски вопрос «дают».',
  },
  {
    id: 'mq-13',
    level: 13,
    questionUz: '«-ki» bogʻlovchisi qoʻshilgan qoʻshma gapda vergul qayerda qoʻyiladi?',
    questionRu: 'Где ставится запятая в предложении с союзом «-ki»?',
    options: ['-ki dan oldin', '-ki dan keyin', 'Vergul qoʻyilmaydi', 'Gap oxirida'],
    correctIndex: 1,
    hintUz: '«Bilamanki, sen albatta gʻolib boʻlasan.»',
    hintRu: '«-ki» пишется слитно с глаголом, а запятая идёт после него.',
  },
  {
    id: 'mq-14',
    level: 14,
    questionUz: 'Qaysi birikma rasmiy «Tarjimayi hol» hujjatiga xos?',
    questionRu: 'Какая фраза характерна для официальной автобиографии («Tarjimayi hol»)?',
    options: ['Menga ruxsat bering', '2010-yilda tugʻilganman', 'Barchangizni taklif etamiz', 'Sotib olishni tavsiya qilamiz'],
    correctIndex: 1,
    hintUz: 'Tarjimayi holda tugʻilgan yil va oʻqish joyi ketma-ket bayon qilinadi.',
    hintRu: 'Автобиография начинается с даты и места рождения.',
  },
  {
    id: 'mq-15',
    level: 15,
    questionUz: '«Garchi yomgʻir yogʻsa ham, sayrga chiqdik» qanday ergash gap turiga kiradi?',
    questionRu: 'Какой тип придаточного предложения в примере с «garchi ... ham»?',
    options: ['Sabab ergash gap', 'Toʻsiqsiz ergash gap', 'Shart ergash gap', 'Oʻrin ergash gap'],
    correctIndex: 1,
    hintUz: '«Хотя шёл дождь...» — toʻsiqqa qaramay bajarilgan harakat.',
    hintRu: 'Передаёт уступительное значение («несмотря на / хотя»).',
  },
];

export const FALLING_LETTER_ITEMS: FallingLetterItem[] = [
  { id: 'fl-1', before: 'ba', after: 'or', missing: 'h', choices: ['h', 'x', 'q'], fullWord: 'bahor', ru: 'весна' },
  { id: 'fl-2', before: 'oʻ', after: 'ituvchi', missing: 'q', choices: ['q', 'k', 'g'], fullWord: 'oʻqituvchi', ru: 'учитель' },
  { id: 'fl-3', before: 'gʻi', after: 'ht', missing: 's', choices: ['s', 'z', 'sh'], fullWord: 'gʻisht', ru: 'кирпич' },
  { id: 'fl-4', before: '', after: 'alq', missing: 'x', choices: ['h', 'x', 'q'], fullWord: 'xalq', ru: 'народ' },
  { id: 'fl-5', before: 'ma', after: 'no', missing: 'ʼ', choices: ['ʼ', 'ʻ', 'y'], fullWord: 'maʼno', ru: 'значение, смысл' },
  { id: 'fl-6', before: 'd', after: 'ʻst', missing: 'o', choices: ['o', 'u', 'a'], fullWord: 'doʻst', ru: 'друг' },
  { id: 'fl-7', before: 'sha', after: 'ar', missing: 'h', choices: ['h', 'x', 'k'], fullWord: 'shahar', ru: 'город' },
  { id: 'fl-8', before: 'ta', after: 'lim', missing: 'ʼ', choices: ['ʼ', 'h', 'x'], fullWord: 'taʼlim', ru: 'образование' },
  { id: 'fl-9', before: 'qis', after: 'loq', missing: 'h', choices: ['h', 'x', 's'], fullWord: 'qishloq', ru: 'деревня, кишлак' },
  { id: 'fl-10', before: 'oʻ', after: 'uv', missing: 'q', choices: ['k', 'q', 'g'], fullWord: 'oʻquv', ru: 'учёба' },
  { id: 'fl-11', before: 'me', after: 'mon', missing: 'h', choices: ['h', 'x', 'k'], fullWord: 'mehmon', ru: 'гость' },
  { id: 'fl-12', before: 'she', after: 'r', missing: 'ʼ', choices: ['ʼ', 'h', 'y'], fullWord: 'sheʼr', ru: 'стихотворение' },
];

export const AFFIX_TRAIN_ITEMS: AffixTrainItem[] = [
  { id: 'at-1', root: 'maktab', ruPrompt: 'в школе', correctAffix: '-da', wagons: ['-ga', '-da', '-dan', '-ni'], resultWord: 'maktabda' },
  { id: 'at-2', root: 'Toshkent', ruPrompt: 'в Ташкент', correctAffix: '-ga', wagons: ['-da', '-ga', '-dan', '-ning'], resultWord: 'Toshkentga' },
  { id: 'at-3', root: 'kutubxona', ruPrompt: 'из библиотеки', correctAffix: '-dan', wagons: ['-da', '-ga', '-dan', '-ni'], resultWord: 'kutubxonadan' },
  { id: 'at-4', root: 'kitob', ruPrompt: 'мою книгу (кого/что?)', correctAffix: '-imni', wagons: ['-imda', '-imni', '-imdan', '-imga'], resultWord: 'kitobimni' },
  { id: 'at-5', root: 'qishloq', ruPrompt: 'в деревню (q → ?)', correctAffix: '-qa', wagons: ['-ga', '-ka', '-qa', '-da'], resultWord: 'qishloqqa' },
  { id: 'at-6', root: 'eshik', ruPrompt: 'на дверь (k → ?)', correctAffix: '-ka', wagons: ['-ga', '-ka', '-qa', '-dan'], resultWord: 'eshikka' },
  { id: 'at-7', root: 'ustoz', ruPrompt: 'учителя (чей?)', correctAffix: '-ning', wagons: ['-ni', '-ning', '-da', '-ga'], resultWord: 'ustozning' },
  { id: 'at-8', root: 'bilim', ruPrompt: 'знающий (прилаг.)', correctAffix: '-li', wagons: ['-li', '-lik', '-chi', '-siz'], resultWord: 'bilimli' },
  { id: 'at-9', root: 'doʻst', ruPrompt: 'дружба (сущ.)', correctAffix: '-lik', wagons: ['-li', '-lik', '-da', '-lar'], resultWord: 'doʻstlik' },
  { id: 'at-10', root: 'bogʻ', ruPrompt: 'в сад (gʻ → ?)', correctAffix: '-ga', wagons: ['-ga', '-qa', '-ka', '-da'], resultWord: 'bogʻga' },
];

export const HIDDEN_WORD_BANK: HiddenWordItem[] = [
  { id: 'hw-1', word: 'KITOB', clueUz: 'Bilim manbayi', clueRu: 'Книга' },
  { id: 'hw-2', word: 'MAKTAB', clueUz: 'Taʼlim maskani', clueRu: 'Школа' },
  { id: 'hw-3', word: 'SAMARQAND', clueUz: 'Registon maydoni joylashgan shahar', clueRu: 'Древний город, где находится Регистан' },
  { id: 'hw-4', word: 'NAVOIY', clueUz: '«Xamsa» muallifi', clueRu: 'Великий поэт, автор «Хамсы»' },
  { id: 'hw-5', word: 'BAHOR', clueUz: 'Yilning eng gullagan fasli', clueRu: 'Весна' },
  { id: 'hw-6', word: 'KUTUBXONA', clueUz: 'Kitoblar saqlanadigan joy', clueRu: 'Библиотека' },
  { id: 'hw-7', word: 'SUMALAK', clueUz: 'Navroʻzning shirin milliy taomi', clueRu: 'Традиционное блюдо Навруза' },
  { id: 'hw-8', word: 'CHINOR', clueUz: 'Uzoq yashaydigan baland daraxt', clueRu: 'Чинара (платан)' },
  { id: 'hw-9', word: 'TARIX', clueUz: 'Oʻtmish haqidagi fan', clueRu: 'История' },
  { id: 'hw-10', word: 'SAYOHAT', clueUz: 'Yangi joylarni koʻrish safari', clueRu: 'Путешествие' },
  { id: 'hw-11', word: 'MEHMON', clueUz: 'Uyga tashrif buyurgan kishi', clueRu: 'Гость' },
  { id: 'hw-12', word: 'VATAN', clueUz: 'Tugʻilib oʻsgan ona diyor', clueRu: 'Родина' },
];

export const BLITZ_QUESTIONS: BlitzQuestion[] = [
  { id: 'bl-1', qUz: '«Книга» oʻzbek tilida nima?', qRu: 'Как будет «книга» по-узбекски?', options: ['daftar', 'kitob', 'qalam'], correct: 1 },
  { id: 'bl-2', qUz: '«Весна» toʻgʻri yozilgan variant:', qRu: 'Правильное написание «весна»:', options: ['baxor', 'bahor', 'bohor'], correct: 1 },
  { id: 'bl-3', qUz: '«Три дома» toʻgʻri tarjima:', qRu: 'Правильный перевод «три дома»:', options: ['uchta uylar', 'uchta uy', 'uch uylar'], correct: 1 },
  { id: 'bl-4', qUz: '«Спасибо» oʻzbekcha qanday?', qRu: 'Как сказать «спасибо»?', options: ['Rahmat', 'Marhamat', 'Uzr'], correct: 0 },
  { id: 'bl-5', qUz: '«В школе» qaysi qoʻshimcha?', qRu: 'Какая форма означает «в школе»?', options: ['maktabga', 'maktabda', 'maktabdan'], correct: 1 },
  { id: 'bl-6', qUz: '«Народ» soʻzi toʻgʻri yozilgani:', qRu: 'Правильное написание слова «народ»:', options: ['halq', 'xalk', 'xalq'], correct: 2 },
  { id: 'bl-7', qUz: '«Из города» qaysi shakl?', qRu: 'Как сказать «из города»?', options: ['shaharda', 'shahardan', 'shaharga'], correct: 1 },
  { id: 'bl-8', qUz: '«Доброе утро»:', qRu: 'Перевод «Доброе утро»:', options: ['Xayrli kech', 'Xayrli kun', 'Xayrli tong'], correct: 2 },
  { id: 'bl-9', qUz: '«Белый» soʻzi qaysi?', qRu: 'Выберите слово «белый»:', options: ['oʻq', 'oq', 'koʻk'], correct: 1 },
  { id: 'bl-10', qUz: '«Стихотворение» toʻgʻri yozilishi:', qRu: 'Правильное написание «стихотворение»:', options: ['sher', 'sheʼr', 'sheʻr'], correct: 1 },
  { id: 'bl-11', qUz: '«Яблоко» oʻzbek tilida:', qRu: '«Яблоко» по-узбекски:', options: ['anor', 'olma', 'uzum'], correct: 1 },
  { id: 'bl-12', qUz: '«Пойти в гости»:', qRu: 'Как правильно «пойти в гости»?', options: ['mehmonga bormoq', 'mehmonlarga bormoq', 'mehmon kelmoq'], correct: 0 },
  { id: 'bl-13', qUz: '«Дружба» soʻzi qaysi?', qRu: 'Перевод слова «дружба»:', options: ['doʻstlik', 'dostlik', 'doʻstchi'], correct: 0 },
  { id: 'bl-14', qUz: '«Бояться собаки» toʻgʻrisi:', qRu: '«Бояться собаки» по-узбекски:', options: ['itni qoʻrqmoq', 'itdan qoʻrqmoq', 'itga qoʻrqmoq'], correct: 1 },
  { id: 'bl-15', qUz: '«Принять участие»:', qRu: 'Как правильно «принять участие»?', options: ['ishtirok qabul qilmoq', 'ishtirok etmoq', 'ishtirok bermoq'], correct: 1 },
  { id: 'bl-16', qUz: '«Kichik» soʻzining antonimi:', qRu: 'Антоним к слову «kichik»:', options: ['katta', 'uzun', 'eski'], correct: 0 },
  { id: 'bl-17', qUz: '«Issiq» soʻzining antonimi:', qRu: 'Антоним к слову «issiq»:', options: ['iliq', 'sovuq', 'yaxshi'], correct: 1 },
  { id: 'bl-18', qUz: '«Qishloq» + joʻnalish kelishigi:', qRu: '«Qishloq» в направительном падеже:', options: ['qishloqga', 'qishloqka', 'qishloqqa'], correct: 2 },
];

export const SENTENCE_ANALYZER_ITEMS: SentenceAnalyzerItem[] = [
  {
    id: 'sa-1',
    grade: 8,
    ru: 'Ученики читают интересную книгу в библиотеке.',
    tokens: [
      { word: 'Oʻquvchilar', role: 'ega' },
      { word: 'kutubxonada', role: 'hol' },
      { word: 'qiziqarli', role: 'aniqlovchi' },
      { word: 'kitobni', role: 'toldiruvchi' },
      { word: 'oʻqishyapti.', role: 'kesim' },
    ],
  },
  {
    id: 'sa-2',
    grade: 8,
    ru: 'Весной наш сад становится очень красивым.',
    tokens: [
      { word: 'Bahorda', role: 'hol' },
      { word: 'bizning', role: 'aniqlovchi' },
      { word: 'bogʻimiz', role: 'ega' },
      { word: 'juda', role: 'hol' },
      { word: 'chiroyli boʻladi.', role: 'kesim' },
    ],
  },
  {
    id: 'sa-3',
    grade: 9,
    ru: 'Учитель терпеливо объяснил ученикам новое правило.',
    tokens: [
      { word: 'Ustoz', role: 'ega' },
      { word: 'oʻquvchilarga', role: 'toldiruvchi' },
      { word: 'yangi', role: 'aniqlovchi' },
      { word: 'qoidani', role: 'toldiruvchi' },
      { word: 'tushuntirdi.', role: 'kesim' },
    ],
  },
  {
    id: 'sa-4',
    grade: 9,
    ru: 'Вчера друзья купили билеты в Самарканд.',
    tokens: [
      { word: 'Kecha', role: 'hol' },
      { word: 'doʻstlarim', role: 'ega' },
      { word: 'Samarqandga', role: 'hol' },
      { word: 'chipta', role: 'toldiruvchi' },
      { word: 'olishdi.', role: 'kesim' },
    ],
  },
  {
    id: 'sa-5',
    grade: 9,
    ru: 'Молодые деревья украшают широкую улицу.',
    tokens: [
      { word: 'Yosh', role: 'aniqlovchi' },
      { word: 'daraxtlar', role: 'ega' },
      { word: 'keng', role: 'aniqlovchi' },
      { word: 'koʻchani', role: 'toldiruvchi' },
      { word: 'bezaydi.', role: 'kesim' },
    ],
  },
];

export const COMPOUND_BUILDER_ITEMS: CompoundBuilderItem[] = [
  {
    id: 'cb-1',
    grade: 10,
    clause1Uz: 'Qoʻngʻiroq chalindi',
    clause2Uz: 'dars boshlandi.',
    ru: 'Прозвенел звонок, и урок начался.',
    choices: ['va', 'lekin', 'chunki', 'yoki'],
    correctConjunction: 'va',
    explanationUz: 'Bir-birini toʻldiruvchi voqealar «va» bogʻlovchisi bilan bogʻlanadi (vergulsiz).',
    explanationRu: 'Последовательные действия соединяются союзом «va» (без запятой перед «va»).',
  },
  {
    id: 'cb-2',
    grade: 10,
    clause1Uz: 'Men hamma qoidani oʻqidim,',
    clause2Uz: 'birinchi mashq biroz qiyin tuyuldi.',
    ru: 'Я прочитал все правила, но первое упражнение показалось трудноватым.',
    choices: ['va', 'ammo', 'chunki', 'shuning uchun'],
    correctConjunction: 'ammo',
    explanationUz: 'Qarama-qarshilikni bildirish uchun «ammo / lekin / biroq» ishlatiladi.',
    explanationRu: 'Для противопоставления используется союз «ammo» (но/однако).',
  },
  {
    id: 'cb-3',
    grade: 10,
    clause1Uz: 'Bugun kutubxonaga boramiz,',
    clause2Uz: 'bizga yangi lugʻatlar kerak.',
    ru: 'Сегодня мы пойдём в библиотеку, потому что нам нужны новые словари.',
    choices: ['yoki', 'lekin', 'chunki', 'va'],
    correctConjunction: 'chunki',
    explanationUz: 'Sababni izohlash uchun «chunki» bogʻlovchisi qoʻllanadi.',
    explanationRu: 'Причину объясняет союз «chunki» (потому что).',
  },
  {
    id: 'cb-4',
    grade: 10,
    clause1Uz: 'Anvar koʻp mashq qildi,',
    clause2Uz: 'olimpiadada birinchi oʻrinni oldi.',
    ru: 'Анвар много тренировался, поэтому занял первое место на олимпиаде.',
    choices: ['shuning uchun', 'chunki', 'biroq', 'yoki'],
    correctConjunction: 'shuning uchun',
    explanationUz: 'Natijani koʻrsatish uchun «shuning uchun» (поэтому) qoʻllanadi.',
    explanationRu: 'Следствие/результат вводится союзом «shuning uchun» (поэтому).',
  },
  {
    id: 'cb-5',
    grade: 10,
    clause1Uz: 'Dam olish kuni togʻga chiqamiz',
    clause2Uz: 'muzeyga sayohat qilamiz.',
    ru: 'В выходной мы поедем в горы или посетим музей.',
    choices: ['yoki', 'chunki', 'ammo', 'shuning uchun'],
    correctConjunction: 'yoki',
    explanationUz: 'Tanlovni bildirish uchun «yoki» (или) ayiruv bogʻlovchisi keladi.',
    explanationRu: 'Выбор между двумя действиями выражается союзом «yoki» (или).',
  },
  {
    id: 'cb-6',
    grade: 10,
    clause1Uz: 'Ustoz ishonadiki,',
    clause2Uz: 'barcha oʻquvchilar imtihonni muvaffaqiyatli topshiradi.',
    ru: 'Учитель верит, что все ученики успешно сдадут экзамен.',
    choices: ['-ki (yuqoridagi shaklda)', 'chunki', 'biroq', 'yoki'],
    correctConjunction: '-ki (yuqoridagi shaklda)',
    explanationUz: 'Izoh ergash gapda «-ki» bogʻlovchisi feʼlga qoʻshiladi va undan keyin vergul qoʻyiladi.',
    explanationRu: 'Союз «-ki» пишется слитно с глаголом, а запятая ставится после него.',
  },
];
