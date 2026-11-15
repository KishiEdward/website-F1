# PitPredict — Frontend Prediksi Pit Stop F1

Antarmuka (frontend) skripsi: **prediksi** strategi pit stop Formula 1 dengan model hybrid
**XGBoost–LSTM** (musim 2021–2025). Seluruh keluaran dilabeli sebagai prediksi berbasis data
observasional keputusan balapan aktual — bukan strategi optimal.

> Model belum selesai dilatih, jadi proyek ini berjalan penuh dengan **data demo (mock)**.
> Tidak ada klaim akurasi di UI selama mode mock aktif.

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:5173. Build produksi: `npm run build` lalu `npm run preview`.

## Beralih dari mock → API asli (Python/FastAPI)

1. Implementasikan backend dengan endpoint berikut (sesuai interface `ApiClient` di `src/api/types.ts`):
   - `GET /teams` → `Team[]`
   - `GET /teams/{id}/drivers` → `Driver[]`
   - `GET /seasons` → `number[]`
   - `GET /races?season=YYYY` → `Race[]`
   - `GET /race/{raceId}/laps` → `RaceLaps`
   - `GET /race/{raceId}/strategy?driver={driverId}` → `DriverStrategy`
   - `POST /predict` (body `PredictionInput`) → `PredictionOutput`
2. Ubah `.env`:
   ```
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=http://localhost:8000
   ```
3. Restart dev server. Tidak ada komponen UI yang perlu diubah — semuanya hanya bergantung
   pada interface `ApiClient` (`src/api/client.ts` adalah satu-satunya titik pergantian).

Data untuk backend bisa diambil dari **Jolpica F1 API** dan **FastF1**.

### Mode Live

`VITE_ENABLE_LIVE=true` memunculkan tombol Live di konsol; saat aktif, data lap di-polling
tiap 4 detik via TanStack Query. Untuk stream asli (WebSocket/SSE), ganti `refetchInterval`
di `src/hooks/queries.ts` dengan subscription — komponen UI tidak berubah.

## Menambah halaman

1. Buat komponen halaman di `src/pages/NamaHalaman.tsx`.
2. Daftarkan route di `src/App.tsx` (`<Route path="/nama" element={<NamaHalaman />} />`).
3. Tambahkan link di `src/components/layout/Navbar.tsx`.

Page transition, smooth scroll (Lenis), dan query client sudah tersedia global.

## Struktur

```
src/
├── motion.ts            # token animasi terpusat (easing, durasi, stagger, variants)
├── api/                 # interface ApiClient + mockClient + httpClient
├── store/               # Zustand (state konsol prediksi)
├── hooks/               # TanStack Query, mesin replay, Lenis
├── components/          # layout, ui, home, console, model
└── pages/               # Home, Console, Model
```

## Standar animasi

- Hanya `transform`/`opacity` yang dianimasikan (60fps), token easing terpusat di `motion.ts`.
- GSAP ScrollTrigger untuk hero & pipeline diagram; **semua di-cleanup** via `gsap.context().revert()`.
- Framer Motion untuk transisi halaman/kartu/layout; Recharts untuk grafik probabilitas.
- `prefers-reduced-motion` dihormati: animasi dikurangi (fade singkat, tanpa parallax), bukan dihapus tanpa pengganti.

## Batasan & catatan demo

- Nama tim/pembalap hanya teks referensial; seluruh visual adalah SVG buatan sendiri (tanpa aset resmi F1).
- Lineup pembalap disederhanakan (satu lineup untuk semua musim 2021–2025).
- Kalender demo berisi 11 GP per musim (bukan kalender penuh); São Paulo GP selalu basah
  agar kasus INTERMEDIATE/WET selalu tersedia untuk demo.
- Saat `VITE_USE_MOCK=false`, badge "Data demo" hilang otomatis dari Navbar/Footer.
