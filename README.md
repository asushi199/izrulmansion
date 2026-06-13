# Tempahan Bilik PKG Pantai Remis

Sistem web untuk mengurus tempahan `Bilik Mesyuarat` dan `Studio` di PKG Pantai Remis. Pengguna boleh menyemak kekosongan bilik, menghantar permohonan, dan memaklumkan admin melalui WhatsApp. Admin hanya meluluskan tempahan selepas menyemak permohonan.

## Fungsi Utama

- Paparan jadual mingguan dan bulanan.
- Dua bilik: `Bilik Mesyuarat` dan `Studio`.
- Slot tempahan: `Pagi`, `Petang`, atau `Sepanjang Hari`.
- Permohonan baharu masuk sebagai `Menunggu kelulusan`.
- Slot `pending` dan `approved` akan menghalang tempahan bertindih.
- Pengguna boleh klik butang WhatsApp selepas menghantar permohonan.
- Pengguna boleh cari semula permohonan di `/semak` menggunakan nombor telefon.
- Admin boleh luluskan, tolak, kemas kini, atau batalkan tempahan.
- Nombor telefon disimpan dalam format digit sahaja.

## Teknologi

- Next.js App Router
- React
- TypeScript
- Supabase
- WhatsApp `wa.me` manual share link

## Persediaan Tempatan

1. Pasang dependencies:

```bash
npm install
```

2. Salin fail env:

```bash
copy .env.example .env.local
```

3. Isi nilai dalam `.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=change-this-password
ADMIN_SESSION_SECRET=change-this-random-secret
APP_BASE_URL=http://localhost:3000
WHATSAPP_ADMIN_PHONE=60123456789
```

4. Jalankan SQL dalam `supabase/schema.sql` melalui Supabase SQL Editor.

5. Jalankan server:

```bash
npm run dev
```

## Deployment

Tetapkan environment variables berikut di Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `APP_BASE_URL`
- `WHATSAPP_ADMIN_PHONE`

Pastikan `APP_BASE_URL` ialah URL sebenar laman selepas deploy, contohnya:

```env
APP_BASE_URL=https://nama-projek.vercel.app
```

## WhatsApp

Sistem ini tidak menggunakan WhatsApp Cloud API. Ia menggunakan pautan `wa.me` supaya WhatsApp dibuka dengan mesej yang siap diisi. Pengguna masih perlu menekan butang send dalam WhatsApp.

Format nombor telefon admin:

```env
WHATSAPP_ADMIN_PHONE=60123456789
```

Gunakan format antarabangsa tanpa simbol `+`, tanpa jarak, dan tanpa `-`.

## Semak Permohonan

Jika pengguna menutup halaman selepas menghantar tempahan, mereka boleh pergi ke:

```text
/semak
```

Kemudian masukkan nombor telefon yang digunakan semasa tempahan. Sistem akan mencari permohonan yang masih `pending` dan memaparkan semula butang WhatsApp.

## Skrip

```bash
npm run dev
npm run test
npm run typecheck
npm run build
```

## Nota Keselamatan

- Jangan commit `.env.local`, `.env`, atau `Password.txt`.
- Jangan dedahkan `SUPABASE_SERVICE_ROLE_KEY`.
- Jalankan semula `supabase/schema.sql` selepas perubahan skema.
