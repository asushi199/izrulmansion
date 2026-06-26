create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  room text not null check (room in ('bilik_seminar', 'bilik_mesyuarat', 'studio')),
  date date not null,
  slot text not null check (slot in ('am', 'pm', 'full_day')),
  name text not null,
  school_or_unit text not null,
  purpose text not null,
  contact text not null,
  contact_normalized text not null default '',
  created_at timestamptz not null default now(),
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  approval_token_hash text,
  approved_at timestamptz,
  rejected_at timestamptz,
  notified_at timestamptz,
  notification_error text,
  cancelled_at timestamptz
);

alter table public.bookings
  add column if not exists status text not null default 'approved' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  add column if not exists contact_normalized text not null default '',
  add column if not exists approval_token_hash text,
  add column if not exists approved_at timestamptz,
  add column if not exists rejected_at timestamptz,
  add column if not exists notified_at timestamptz,
  add column if not exists notification_error text;

alter table public.bookings
  drop constraint if exists bookings_room_check;

alter table public.bookings
  add constraint bookings_room_check
  check (room in ('bilik_seminar', 'bilik_mesyuarat', 'studio'));

update public.bookings
set status = case
  when cancelled_at is not null then 'cancelled'
  when status is null then 'approved'
  else status
end;

update public.bookings
set contact_normalized = regexp_replace(contact, '\D', '', 'g')
where contact_normalized = '';

create index if not exists bookings_active_lookup_idx
  on public.bookings (date, room, slot, status)
  where status in ('pending', 'approved');

create index if not exists bookings_pending_contact_lookup_idx
  on public.bookings (contact_normalized, status)
  where status = 'pending';

create or replace function public.prevent_booking_conflict()
returns trigger
language plpgsql
as $$
begin
  if new.status not in ('pending', 'approved') then
    return new;
  end if;

  if exists (
    select 1
    from public.bookings existing
    where existing.id <> new.id
      and existing.status in ('pending', 'approved')
      and existing.room = new.room
      and existing.date = new.date
      and (
        existing.slot = new.slot
        or existing.slot = 'full_day'
        or new.slot = 'full_day'
      )
  ) then
    raise exception 'Slot bilik ini sudah ditempah atau sedang menunggu kelulusan.';
  end if;

  return new;
end;
$$;

drop trigger if exists bookings_prevent_conflict on public.bookings;

create trigger bookings_prevent_conflict
before insert or update on public.bookings
for each row execute function public.prevent_booking_conflict();

alter table public.bookings enable row level security;
