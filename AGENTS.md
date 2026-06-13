# AGENTS.md

## Project Context

- This project is a Malay-language room booking dashboard for PKG Pantai Remis.
- The system supports `Bilik Mesyuarat` and `Studio`.
- Booking slots are `Pagi`, `Petang`, and `Sepanjang Hari`.
- New bookings are saved as `pending` until approved by an admin.
- Users notify the admin through a manual `wa.me` WhatsApp link, not WhatsApp Cloud API.
- Admin approval can happen from the secure approval link or the admin dashboard.

## Working Rules

- Keep public-facing UI and documentation in Malay by default.
- Preserve the low-cost manual WhatsApp flow unless the user explicitly asks for Cloud API automation.
- Do not commit secrets or local credentials. Keep `.env.local`, `.env`, and `Password.txt` out of git.
- Normalize phone numbers to digits only before storing or searching.
- Treat `pending` and `approved` bookings as slot-blocking; `rejected` and `cancelled` do not block slots.
- Keep changes small and focused.

## Verification

Run the smallest useful checks after edits:

```bash
npm.cmd run test
npm.cmd run typecheck
npm.cmd run build
```

For local smoke checks, use a temporary Next.js dev server and verify:

- `/` loads.
- `/semak` loads.
- `/admin/login` loads.
- Pending approval links still resolve through `/approve/[id]?token=...`.

## Deployment Notes

- Run `supabase/schema.sql` in Supabase SQL Editor after schema changes.
- Required Vercel environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`
  - `APP_BASE_URL`
  - `WHATSAPP_ADMIN_PHONE`
