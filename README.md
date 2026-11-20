# Oʻzbek tilining sehri

Rus tilida taʼlim beriladigan maktablarning 8–10-sinf oʻquvchilari (14–16 yosh, A2–B1 daraja) va ularning oʻqituvchilari uchun yaratilgan zamonaviy oʻzbek tili taʼlimiy veb-platformasi.

Platforma toʻliq brauzerda ishlaydi: server, login yoki API kalit talab qilinmaydi. Oʻquvchining barcha yutuqlari, tanlangan tili va mavzu sozlamalari `localStorage` xotirasida saqlanadi.

---

## Texnologiyalar

- **Vite + React + TypeScript** (`strict: true`)
- **Tailwind CSS** (yorugʻ va tungi rejim)
- **React Router v6** (`BrowserRouter`)
- **@fontsource/nunito** (lotin, kirill va `ʻ` / `ʼ` belgilarini toʻliq qoʻllab-quvvatlaydi)
- **lucide-react** va **Vitest**

---

## 1. Loyihani kompyuterda oʻrnatish va ishga tushirish

Talab qilinadigan muhit: **Node.js 20+** va **npm**.

```bash
# 1. Loyihani klonlash
git clone <SIZNING_GITHUB_REPO_URL>
cd ozbek-tilining-sehri

# 2. Kutubxonalarni oʻrnatish
npm install

# 3. Ishlab chiqish serverini ishga tushirish
npm run dev
```

Brauzerda `http://localhost:3000` manzilini oching.

### Foydali buyruqlar

- `npm run build` — TypeScript tekshiruvi (`tsc -b`) va production yigʻish (`vite build`)
- `npm run preview` — yigʻilgan loyihani lokal koʻrish
- `npm run lint` — TypeScript tip tekshiruvi (`tsc --noEmit`)
- `npm run test` — Vitest birlik testlarini ishga tushirish
- `npm run check` — barcha kontent fayllarining yaxlitligini tekshirish (`validateContent.ts`)

---

## 2. Kontentni tahrirlash (Oʻqituvchilar uchun)

Barcha darslar, mashqlar, testlar va lugʻat `/src/data/` papkasida TypeScript fayllari koʻrinishida saqlanadi:

- `/src/data/lessons/` — 8–10-sinf maʼruzalari
- `/src/data/exercises/` — interaktiv mashqlar
- `/src/data/tests/` — mavzuli va chorak yakuniy testlar
- `/src/data/dictionary.ts` — ruscha-oʻzbekcha lugʻat
- `/src/data/riddles.ts`, `/src/data/proverbs.ts`, `/src/data/tongueTwisters.ts` — sheʼriy topishmoqlar, maqollar va tez aytishlar
- `/src/data/facts.ts` — qiziqarli faktlar
- `/src/data/gallery.ts` — rasmli sayohat kartochkalari

Oʻzgartirish kiritgandan soʻng `npm run check` va `npm run build` buyruqlarini ishga tushirib xato yoʻqligini tekshiring.

---

## 3. GitHubʼga joylash (push)

```bash
git init
git add .
git commit -m "Oʻzbek tilining sehri platformasi"
git branch -M main
git remote add origin https://github.com/<FOYDALANUVCHI>/<REPO>.git
git push -u origin main
```

---

## 4. Vercelʼga deploy qilish

Loyiha ildizida `vercel.json` fayli mavjud (`rewrites` sozlangan), shuning uchun ichki sahifalarni yangilaganda 404 xatosi chiqmaydi.

1. [vercel.com](https://vercel.com) saytiga kiring va **Add New → Project** tugmasini bosing.
2. GitHub hisobingizdagi ushbu repozitoriyni tanlang (**Import**).
3. Quyidagi sozlamalar avtomatik aniqlanadi (agar koʻrinmasa, qoʻlda kiriting):
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Hech qanday Environment Variable (maxfiy kalit) qoʻshish shart emas.
5. **Deploy** tugmasini bosing — bir necha soniyadan soʻng sayt tayyor boʻladi.
