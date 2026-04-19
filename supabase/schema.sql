-- LEADS TABLE (quote requests from the form)
create table leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  phone text not null,
  email text,
  product_type text,
  message text,
  status text default 'nouveau' check (status in ('nouveau', 'contacté', 'devis_envoyé', 'converti', 'archivé')),
  notes text,
  source text default 'website'
);

-- SITE SETTINGS TABLE
create table settings (
  id int primary key default 1,
  phone text,
  email text,
  address text,
  whatsapp text,
  facebook_url text,
  instagram_url text,
  updated_at timestamptz default now()
);

-- Insert default settings
insert into settings (id, phone, email, address, whatsapp)
values (1, '+212 5XX XXX XXX', 'contact@rifmachine.ma', 'Zone Industrielle, Casablanca', '+212 6XX XXX XXX');

-- ROW LEVEL SECURITY
alter table leads enable row level security;
alter table settings enable row level security;

-- Allow public insert on leads (for the contact form)
create policy "Allow public insert" on leads for insert with check (true);

-- Only authenticated admin can read/update leads and settings
create policy "Admin full access leads" on leads for all using (auth.role() = 'authenticated');
create policy "Admin full access settings" on settings for all using (auth.role() = 'authenticated');
