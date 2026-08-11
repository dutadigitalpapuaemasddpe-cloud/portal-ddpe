# Portal Pemetaan Potensi DDPE 2026

Portal resmi pemetaan ulang pengurus **Duta Digital Papua Emas**.

## Fitur

- Landing page dengan liquid glass (ungu–biru digital + emas)
- Assessment 20 pernyataan situasional + scoring otomatis
- Hasil instan (radar chart + 12 dimensi + rekomendasi peran)
- Twibbon generator premium (canvas)
- Dashboard pengurus (password-protected) dengan Overview, Submissions, Analytics, Role Mapping
- Siap deploy ke GitHub Pages

## Akses Dashboard

Dashboard saat ini **hanya untuk Founder / Ketua Umum**.

Password:
```
DDPE2026!Ring1
```

Ubah di `js/dashboard.js` → variabel `DASH_PASSWORD`.

Pengurus lain tidak diberi akses untuk saat ini. Fokus organisasi ada pada form pemetaan potensi. Fitur dashboard bersama akan dibuka setelah fase ini stabil.

## Setup Email (Formspree)

1. Buat akun di https://formspree.io
2. Buat form baru, arahkan ke `dutadigitalpapuaemasddpe@gmail.com`
3. Salin Form ID
4. Paste ke `js/assessment.js` → `FORMSPREE_ID`

## Deploy ke GitHub Pages

1. Buat repository baru (misal: `portal-pemetaan-potensi-ddpe`)
2. Upload seluruh isi folder ini ke root repository
3. Settings → Pages → Source: Deploy from branch `main` / root
4. Akses via `https://<username>.github.io/portal-pemetaan-potensi-ddpe/`

## Catatan

- Data submission disimpan di `localStorage` browser (demo).
- Untuk data real lintas perangkat, hubungkan Formspree + Google Sheets / Supabase.
- Logo: `assets/logo-ddpe.jpg`

---

© 2026 Duta Digital Papua Emas  
Dokumen internal organisasi. Bukan penetapan sebagai lembaga/duta resmi pemerintah.
