-- Compteur public du nombre de membres validés (page d'accueil).
-- Renvoie uniquement un nombre : aucune donnée personnelle n'est exposée.
-- SECURITY DEFINER permet le comptage malgré la RLS de la table members.
create or replace function public.count_active_members()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int from members where statut = 'approved';
$$;

grant execute on function public.count_active_members() to anon, authenticated;
