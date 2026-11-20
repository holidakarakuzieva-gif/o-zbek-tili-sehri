import type { GalleryItem } from '../types';

export const sampleGallery: GalleryItem[] = [
  {
    id: 'gal-registon',
    titleUz: 'Registon maydoni',
    titleRu: 'Площадь Регистан',
    regionUz: 'Samarqand',
    regionRu: 'Самарканд',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Registan_Square_Samarkand.jpg?width=800',
    sourceLabel: 'Wikimedia Commons (CC BY-SA)',
    descriptionUz: 'Samarqandning yuragi hisoblangan Registon uchta muhtasham madrasadan iborat: Ulugʻbek, Sherdor va Tillakori.',
    descriptionRu: 'Сердце Самарканда — ансамбль из трёх величественных медресе: Улугбека, Шердор и Тилля-Кори.',
    newWords: [
      { uz: 'maydon', ru: 'площадь' },
      { uz: 'madrasa', ru: 'медресе, учебное заведение' },
      { uz: 'meʼmorchilik', ru: 'архитектура' },
    ],
  },
  {
    id: 'gal-ichan-qala',
    titleUz: 'Ichan-Qalʼa va Kalta Minor',
    titleRu: 'Ичан-Кала и минарет Кальта-Минор',
    regionUz: 'Xiva',
    regionRu: 'Хива',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khiva_Kalta_Minor_01.jpg?width=800',
    sourceLabel: 'Wikimedia Commons (CC BY-SA)',
    descriptionUz: 'Xiva shahridagi Ichan-Qalʼa ochiq osmon ostidagi muzey boʻlib, YuNESKO roʻyxatiga kiritilgan.',
    descriptionRu: 'Внутренний город Ичан-Кала в Хиве — музей под открытым небом, включённый в список ЮНЕСКО.',
    newWords: [
      { uz: 'qalʼa', ru: 'крепость' },
      { uz: 'minora', ru: 'минарет' },
      { uz: 'koshin', ru: 'изразец, глазурованная плитка' },
    ],
  },
  {
    id: 'gal-buxoro',
    titleUz: 'Poi Kalon majmuasi',
    titleRu: 'Ансамбль Пои-Калон',
    regionUz: 'Buxoro',
    regionRu: 'Бухара',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Po-i-Kalyan_Bukhara_Uzbekistan.jpg?width=800',
    sourceLabel: 'Wikimedia Commons (CC BY-SA)',
    descriptionUz: 'Buxorodagi Kalon minorasi XII asrda qurilgan boʻlib, balandligi 47 metrga yetadi.',
    descriptionRu: 'Минарет Калон в Бухаре построен в XII веке, его высота достигает 47 метров.',
    newWords: [
      { uz: 'majmua', ru: 'комплекс, ансамбль' },
      { uz: 'asr', ru: 'век' },
      { uz: 'balandlik', ru: 'высота' },
    ],
  },
];
