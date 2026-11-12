# Vamos · Platform Belajar Bahasa Spanyol

Web app untuk belajar bahasa Spanyol dari nol, dengan antarmuka berbahasa Indonesia.

## Fitur

| Fitur | Keterangan |
|---|---|
| **Kurikulum CEFR A1–B1** | 16 unit tematik mengikuti CEFR & Plan Curricular Instituto Cervantes. Tiap unit punya target *can-do*, kosakata, tata bahasa, dan dialog. |
| **Latihan bertahap** | Pola *present → practice → produce*: pilihan ganda → dengar → ketik → susun kalimat → dikte → bicara. Soal yang salah diulang di akhir (*mastery learning*). |
| **Progresi terkunci** | Skor ≥70% membuka unit berikutnya. Ujian per level CEFR. Bisa dibuka semua di Pengaturan. |
| **Ulasan berjarak (SRS)** | Algoritma SM-2 (seperti Anki). Kata dari latihan otomatis masuk dek. |
| **Konjugasi** | Tabel 21 kata kerja × 5 tense (presente, indefinido, imperfecto, perfecto, futuro), plus latihan cepat. |
| **Pelafalan** | Alfabet dengan penjelasan bunyi untuk penutur Indonesia + lab pengucapan (speech recognition). |
| **Kamus** | Pencarian semua kosakata (toleran aksen). |
| **Gamifikasi** | XP, runtutan harian, target harian, grafik aktivitas. |
| **Audio tanpa server** | Web Speech API, aksen Spanyol atau Amerika Latin . |
| **Keyboard aksen** | Tombol á é í ó ú ñ ü ¿ ¡; jawaban tanpa aksen tetap diterima dengan peringatan. |

## Stack

- **React 19 + TypeScript + Vite**: cepat, tanpa backend.
- **React Router**: navigasi.
- **CSS biasa** dengan sistem desain editorial: Fraunces (serif) + IBM Plex Sans, ikon SVG garis tipis, tanpa emoji. Mode gelap otomatis, navigasi bawah di HP.
- Progres disimpan di `localStorage` (bisa ekspor/impor JSON).

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil ada di dist/
```

## Deploy ke Netlify

Sudah ada `netlify.toml` dan `public/_redirects` (untuk SPA routing). Hubungkan repo di Netlify, atau:

```bash
npm run build && npx netlify deploy --prod --dir=dist
```

## Struktur

```
src/
  data/curriculum.ts   ← semua konten unit (tambah unit baru di sini)
  data/verbs.ts        ← kata kerja & mesin konjugasi
  data/alphabet.ts     ← alfabet & tips pelafalan
  lib/exercises.ts     ← generator soal latihan
  lib/srs.ts           ← algoritma SM-2
  lib/speech.ts        ← TTS & speech recognition
  lib/store.tsx        ← progres (XP, streak, SRS) + localStorage
  pages/               ← halaman
  components/          ← komponen UI (ExerciseView, LessonRunner, …)
```

Menambah unit cukup dengan menambah objek baru di `src/data/curriculum.ts`; latihan dibuat otomatis dari kosakata dan kalimatnya.
