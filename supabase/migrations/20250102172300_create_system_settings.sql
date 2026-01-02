create table if not exists public.system_settings (
    id bigint primary key default 1,
    institution_name text not null default 'Conservatorio de Música Juan Manuel Olivares',
    opening_time text not null default '07:00',
    tolerance_minutes integer not null default 15,
    notifications_enabled boolean not null default true,
    backup_email text not null default 'sistemas@olivares.edu.ve',
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    constraint single_row check (id = 1)
);

-- Enable RLS
alter table public.system_settings enable row level security;

-- Policy: Allow read access to everyone (authenticated)
create policy "Allow read access to all authenticated users"
on public.system_settings for select
to authenticated
using (true);

-- Policy: Allow update access only to authenticated users (ideally verify role, but for now open to auth)
create policy "Allow update access to authenticated users"
on public.system_settings for update
to authenticated
using (true)
with check (true);

-- Policy: Allow insert (only for the single row if missing)
create policy "Allow insert access to authenticated users"
on public.system_settings for insert
to authenticated
with check (id = 1);

-- Insert default row if not exists
insert into public.system_settings (id)
values (1)
on conflict (id) do nothing;
