-- =========================================================================
--  Tua Pharma — schema inicial (Bloco 2.1 + base para 2.2/2.3)
--  Rode este arquivo no Supabase: SQL Editor → cole → Run.
-- =========================================================================

create extension if not exists pgcrypto;

-- ---------- Perfis de usuário (1:1 com auth.users) ----------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null default '',
  email      text not null,
  phone      text,
  cpf        text,
  birthdate  date,
  cep        text,
  address    text,
  points     integer not null default 0,
  role       text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- helper: o usuário atual é admin? (usado nas policies)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- cria o profile automaticamente quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Categorias --------------------------------------------------
create table if not exists public.categories (
  slug     text primary key,
  name     text not null,
  tagline  text not null default '',
  icon     text not null default '',
  gradient text[] not null default '{}',
  accent   text not null default '',
  position integer not null default 0
);

-- ---------- Produtos ----------------------------------------------------
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  category          text references public.categories (slug),
  price             numeric(10,2) not null default 0,
  old_price         numeric(10,2),
  stock             integer not null default 0,
  rating            numeric(2,1) not null default 5,
  reviews           integer not null default 0,
  short_description text not null default '',
  description       text not null default '',
  benefits          text[] not null default '{}',
  badges            text[] not null default '{}',
  packaging         text not null default 'jar-capsule-green',
  image_label       text,
  image_url         text,
  sizes             jsonb,
  bestseller        boolean not null default false,
  special           boolean not null default false,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_idx on public.products (active);

-- ---------- Cupons ------------------------------------------------------
create table if not exists public.coupons (
  code     text primary key,
  percent  numeric(4,3) not null,          -- ex.: 0.10 = 10%
  active   boolean not null default true
);

-- ---------- Pedidos -----------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  number           text unique not null default 'TUA-' || to_char(now(), 'YYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 4),
  user_id          uuid references public.profiles (id) on delete set null,
  customer_name    text not null default '',
  customer_email   text not null default '',
  status           text not null default 'novo'
                     check (status in ('novo','aguardando_pagamento','pago','em_preparo','enviado','entregue','cancelado')),
  subtotal         numeric(10,2) not null default 0,
  discount         numeric(10,2) not null default 0,
  shipping         numeric(10,2) not null default 0,
  total            numeric(10,2) not null default 0,
  coupon_code      text,
  payment_method   text,                    -- pix | credit_card | boleto
  pagarme_order_id text,
  shipping_address jsonb,                    -- snapshot do endereço
  created_at       timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name       text not null,                 -- snapshot
  unit_price numeric(10,2) not null,
  quantity   integer not null default 1,
  size       text
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------- Leads (roleta / cadastro) -----------------------------------
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  whatsapp   text,
  email      text not null,
  birthdate  text,
  coupon     text,
  origem     text,
  created_at timestamptz not null default now()
);

-- =========================================================================
--  Row Level Security
-- =========================================================================
alter table public.profiles    enable row level security;
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.coupons     enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.leads       enable row level security;

-- profiles: dono lê/edita o seu; admin tudo
create policy "profiles_self_read"  on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id or public.is_admin());
create policy "profiles_admin_all"  on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- categorias e produtos: leitura pública; escrita só admin
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "products_public_read" on public.products for select using (active or public.is_admin());
create policy "products_admin_write" on public.products for all using (public.is_admin()) with check (public.is_admin());

-- cupons: leitura pública (validação no carrinho); escrita admin
create policy "coupons_public_read" on public.coupons for select using (true);
create policy "coupons_admin_write" on public.coupons for all using (public.is_admin()) with check (public.is_admin());

-- pedidos: cliente vê os seus; admin tudo. (criação de pedido é server-side via service role)
create policy "orders_own_read"  on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_admin_all" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "order_items_read" on public.order_items for select
  using (public.is_admin() or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- leads: só admin lê/gerencia (inserção acontece server-side via service role)
create policy "leads_admin_all" on public.leads for all using (public.is_admin()) with check (public.is_admin());
