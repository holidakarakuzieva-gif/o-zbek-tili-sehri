export interface SafeSiteItem {
  domain: string;
  url: string;
  descUz: string;
  descRu: string;
}

export interface SafeQuizItem {
  id: string;
  questionUz: string;
  questionRu: string;
  options: string[];
  correctIndex: number;
  explanationUz: string;
  explanationRu: string;
}

export const recommendedSites: SafeSiteItem[] = [
  {
    domain: 'ziyonet.uz',
    url: 'https://ziyonet.uz',
    descUz: 'Oʻzbekistonning taʼlimiy axborot portali',
    descRu: 'Образовательный информационный портал Узбекистана',
  },
  {
    domain: 'uzedu.uz',
    url: 'https://uzedu.uz',
    descUz: 'Maktabgacha va maktab taʼlimi vazirligi rasmiy sayti',
    descRu: 'Официальный сайт Министерства дошкольного и школьного образования',
  },
  {
    domain: 'kitob.uz',
    url: 'https://kitob.uz',
    descUz: 'Oʻzbek va jahon adabiyotining elektron kutubxonasi',
    descRu: 'Электронная библиотека узбекской и мировой литературы',
  },
  {
    domain: 'lex.uz',
    url: 'https://lex.uz',
    descUz: 'Oʻzbekiston Respublikasi qonunchilik maʼlumotlari milliy bazasi',
    descRu: 'Национальная база данных законодательства (включая Закон о государственном языке)',
  },
  {
    domain: 'savodxon.uz',
    url: 'https://savodxon.uz',
    descUz: 'Oʻzbekcha matnlarning imlosini tekshirish xizmati',
    descRu: 'Сервис проверки орфографии узбекского текста',
  },
  {
    domain: 'uz.wikipedia.org',
    url: 'https://uz.wikipedia.org',
    descUz: 'Oʻzbek tilidagi ochiq ensiklopediya',
    descRu: 'Открытая энциклопедия на узбекском языке',
  },
  {
    domain: 'wayground.com',
    url: 'https://wayground.com',
    descUz: 'Oʻqituvchi havolasi orqali interaktiv viktorinalar',
    descRu: 'Интерактивные викторины по ссылке от учителя',
  },
];

export const prohibitedCategories = [
  {
    uz: 'Qimor, tikish (bukmekerlik) va onlayn kazino saytlari',
    ru: 'Сайты азартных игр, ставок (букмекеров) и онлайн-казино',
  },
  {
    uz: '18+ va zoʻravonlikni targʻib qiluvchi resurslar',
    ru: 'Ресурсы с контентом 18+ и сценами насилия',
  },
  {
    uz: 'Oʻzbekiston qonunchiligiga koʻra bloklangan resurslar va ularni chetlab oʻtish uchun VPN/proksi xizmatlari',
    ru: 'Ресурсы, заблокированные по законодательству Узбекистана, и VPN/прокси для их обхода',
  },
  {
    uz: 'Notanish odamlar bilan anonim chatlar',
    ru: 'Анонимные чаты с незнакомыми людьми',
  },
  {
    uz: 'Qaroqchilik (pirat) saytlari va shubhali "bepul yuklab ol" havolalari',
    ru: 'Пиратские сайты и подозрительные ссылки «скачать бесплатно»',
  },
  {
    uz: 'Shaxsiy maʼlumot, parol yoki SMS-kod soʻraydigan firibgar sahifalar',
    ru: 'Мошеннические страницы, запрашивающие личные данные, пароли или SMS-коды',
  },
];

export const sevenRules = [
  {
    uz: 'Parol va SMS-kodlarni hech kimga, hatto "administrator" boʻlib tanishganlarga ham bermang.',
    ru: 'Никому не сообщайте пароли и SMS-коды, даже если собеседник представляется «администратором».',
  },
  {
    uz: 'Havolani bosishdan oldin domenni tekshiring (masalan, uzedu.uz oʻrniga uzedu-free.xyz boʻlsa — bu soxta).',
    ru: 'Перед переходом проверяйте домен (поддельные адреса часто добавляют лишние слова или меняют буквы).',
  },
  {
    uz: 'Shaxsiy rasm va uy manzilingizni ochiq chatlarda joylashtirmang.',
    ru: 'Не публикуйте личные фото и домашний адрес в открытых чатах.',
  },
  {
    uz: 'Nomaʼlum fayllarni (.exe, .apk) tasdiqlanmagan saytlardan yuklamang.',
    ru: 'Не скачивайте неизвестные файлы (.exe, .apk) с непроверенных сайтов.',
  },
  {
    uz: 'Birovning mualliflik huquqini hurmat qiling, qaroqchilik resurslaridan foydalanmang.',
    ru: 'Уважайте авторское право и не пользуйтесь пиратскими ресурсами.',
  },
  {
    uz: 'Internetdagi muloqotda ham hurmat va odob qoidalariga amal qiling.',
    ru: 'Соблюдайте вежливость и уважение в онлайн-общении.',
  },
  {
    uz: 'Shubhali xabar yoki tahdidga duch kelsangiz, darhol ota-onangiz yoki oʻqituvchingizga ayting.',
    ru: 'Если столкнулись с подозрительным сообщением или угрозой — сразу расскажите родителям или учителю.',
  },
];

export const safeQuizItems: SafeQuizItem[] = [
  {
    id: 'sq-1',
    questionUz: 'Qaysi havola rasmiy taʼlim saytiga tegishli?',
    questionRu: 'Какая ссылка ведёт на официальный образовательный сайт?',
    options: ['https://kitob.uz', 'https://kitob-bepul-prize.tk', 'https://uzedu-bonus100.xyz'],
    correctIndex: 0,
    explanationUz: 'kitob.uz — Oʻzbekistonning rasmiy elektron kutubxonasi.',
    explanationRu: 'kitob.uz — официальная электронная библиотека. Остальные адреса имеют признаки фишинга.',
  },
  {
    id: 'sq-2',
    questionUz: 'Chatda notanish kishi sizdan SMS-kod soʻrasa, nima qilish kerak?',
    questionRu: 'Что делать, если незнакомец в чате просит прислать SMS-код?',
    options: [
      'Darhol kodni yuborish',
      'Hech qachon bermaslik va foydalanuvchini bloklash',
      'Faqat oxirgi ikki raqamini aytish',
    ],
    correctIndex: 1,
    explanationUz: 'SMS-kod — shaxsiy hisobingiz kaliti, uni hech kimga berish mumkin emas.',
    explanationRu: 'SMS-код — ключ от вашего аккаунта, его нельзя передавать никому и ни при каких условиях.',
  },
  {
    id: 'sq-3',
    questionUz: 'Oʻzbekcha soʻzning toʻgʻri yozilishini qayerda tekshirish mumkin?',
    questionRu: 'Где можно проверить правильное написание узбекского слова?',
    options: ['savodxon.uz', 'Nomaʼlum reklama sayti', 'Anonim chat'],
    correctIndex: 0,
    explanationUz: 'savodxon.uz — oʻzbek tili imlosini tekshirish uchun ishonchli vosita.',
    explanationRu: 'savodxon.uz — надёжный сервис проверки узбекской орфографии.',
  },
];
