-- Support de présentation (PDF) joint aux replays.
-- Le PDF est stocké dans un bucket privé : réservé aux membres validés,
-- comme les replays eux-mêmes. Seuls les admins ajoutent ou suppriment.

-- Chemin du PDF dans le bucket replay-supports (null = pas de support)
alter table replays
  add column if not exists support_path text;

-- Bucket privé, PDF uniquement, 20 Mo maximum par fichier
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('replay-supports', 'replay-supports', false, 20971520, array['application/pdf'])
on conflict (id) do nothing;

-- Lecture : membres validés et admins
create policy "replay_supports_select" on storage.objects
  for select using (
    bucket_id = 'replay-supports'
    and is_approved()
  );

-- Ajout : admins uniquement
create policy "replay_supports_insert" on storage.objects
  for insert with check (
    bucket_id = 'replay-supports'
    and is_admin()
  );

-- Remplacement : admins uniquement
create policy "replay_supports_update" on storage.objects
  for update using (
    bucket_id = 'replay-supports'
    and is_admin()
  );

-- Suppression : admins uniquement
create policy "replay_supports_delete" on storage.objects
  for delete using (
    bucket_id = 'replay-supports'
    and is_admin()
  );
