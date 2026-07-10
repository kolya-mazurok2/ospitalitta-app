-- ============================================================
-- Ospitalitta — schema 0002: lock public read against enumeration
--
-- Problem (0001): `for select using (true)` on venue/menu_category/menu_item lets the
-- public anon key dump EVERY venue + every menu + prices in one unfiltered PostgREST
-- query (GET /rest/v1/venue?select=slug,name). The anon key is public by design, so
-- RLS is the only gate — and it was wide open. A competitor could enumerate all clients.
--
-- Fix: no direct anon table read. Guests read exactly one venue's menu through a
-- SECURITY DEFINER function that REQUIRES a slug. Can't be called without knowing a slug,
-- so there is no "list all venues" surface. Admin writes still go via service_role
-- (bypasses RLS), unchanged.
--
-- The function is STABLE → PostgREST allows GET /rest/v1/rpc/get_menu?p_slug=... , so the
-- tagged Data-Cache read (DEC-004) keeps working (GET is cacheable; POST is not).
--
-- Idempotent: safe to run on the already-seeded DB.
-- ============================================================

-- 1) Remove the open read policies. RLS stays ENABLED with no anon SELECT policy
--    → direct anon reads now return nothing.
drop policy if exists "public read venue"    on venue;
drop policy if exists "public read category" on menu_category;
drop policy if exists "public read item"     on menu_item;

-- 2) Single guarded read path: one venue's full menu by slug. Returns NULL if slug unknown.
--    Runs as owner (SECURITY DEFINER) → reads past RLS. Shape matches getPublishedMenu's
--    fetchMenuFromSupabase: { venue:{id,currency}, categories:[{...,menu_item:[...]}] }.
create or replace function public.get_menu(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'venue', jsonb_build_object('id', v.id, 'currency', v.currency),
    'categories', coalesce((
      select jsonb_agg(cat order by cat.sort_order)
      from (
        select
          c.id, c.parent_id, c.key, c.sort_order, c.i18n,
          coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', i.id, 'slug', i.slug,
                'price_minor', i.price_minor, 'price_unit', i.price_unit,
                'glass', i.glass, 'lvl', i.lvl, 'flavor', i.flavor,
                'loved', i.loved, 'house', i.house, 'badge', i.badge,
                'image_url', i.image_url, 'video_url', i.video_url,
                'sort_order', i.sort_order, 'i18n', i.i18n
              ) order by i.sort_order
            )
            from menu_item i where i.category_id = c.id
          ), '[]'::jsonb) as menu_item
        from menu_category c where c.venue_id = v.id
      ) cat
    ), '[]'::jsonb)
  )
  from venue v
  where v.slug = p_slug
  limit 1;
$$;

-- 3) Only the function is reachable by anon — not the tables.
revoke all on function public.get_menu(text) from public;
grant execute on function public.get_menu(text) to anon, authenticated, service_role;
