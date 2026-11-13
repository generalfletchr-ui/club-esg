-- Propositions d'animation (webinaire / atelier) par les membres,
-- avec circuit de validation par les admins.
-- Données minimales : le nom de l'intervenant vient de son profil (members),
-- il n'est pas recopié ici.

create table if not exists animation_proposals (
  id                  uuid primary key default gen_random_uuid(),
  member_id           uuid not null references members(id) on delete cascade,
  format              text not null check (format in ('webinaire', 'atelier')),
  theme               text not null,
  theme_autre         text,
  titre               text not null check (char_length(titre) between 1 and 100),
  -- Résumé : plus demandé dans le formulaire (l'équipe contacte l'intervenant)
  resume              text check (char_length(resume) <= 600),
  date_souhaitee      date not null,
  heure               time not null,
  coanimateur_nom     text,
  coanimateur_email   text,
  engagement_le       timestamptz not null,
  statut              text not null default 'en_attente'
                      check (statut in ('en_attente', 'validee', 'a_ajuster', 'refusee')),
  message_admin       text,
  event_id            uuid references events(id) on delete set null,
  traite_par          uuid references members(id) on delete set null,
  traite_le           timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists animation_proposals_member_idx on animation_proposals(member_id);
create index if not exists animation_proposals_statut_idx on animation_proposals(statut);

-- Un même créneau (date + heure) ne peut être validé qu'une seule fois
create unique index if not exists animation_proposals_creneau_valide
  on animation_proposals(date_souhaitee, heure)
  where statut = 'validee';

alter table animation_proposals enable row level security;

-- Lecture : le membre voit ses propositions, les admins voient tout
create policy "animation_proposals_select" on animation_proposals
  for select using (member_id = auth.uid() or is_admin());

-- Création : membre validé, pour lui-même, toujours « en attente »
create policy "animation_proposals_insert" on animation_proposals
  for insert with check (
    member_id = auth.uid() and is_approved() and statut = 'en_attente'
  );

-- Modification par le membre : seulement une proposition « à ajuster »,
-- qu'il renvoie « en attente »
create policy "animation_proposals_update_membre" on animation_proposals
  for update using (member_id = auth.uid() and statut = 'a_ajuster')
  with check (member_id = auth.uid() and statut = 'en_attente');

-- Modification par les admins (validation, ajustement, refus)
create policy "animation_proposals_update_admin" on animation_proposals
  for update using (is_admin());

-- ============================================
-- Ressources du Club (modèle PowerPoint joint au mail de validation)
-- ============================================

-- Réglages modifiables par les admins (ex. fichier du modèle de présentation)
create table if not exists app_settings (
  key         text primary key,
  value       text,
  updated_at  timestamptz not null default now()
);

alter table app_settings enable row level security;

create policy "app_settings_admin" on app_settings
  for all using (is_admin()) with check (is_admin());

-- Bucket privé, réservé aux admins, 20 Mo maximum par fichier
insert into storage.buckets (id, name, public, file_size_limit)
values ('club-ressources', 'club-ressources', false, 20971520)
on conflict (id) do nothing;

create policy "club_ressources_admin_select" on storage.objects
  for select using (bucket_id = 'club-ressources' and is_admin());

create policy "club_ressources_admin_insert" on storage.objects
  for insert with check (bucket_id = 'club-ressources' and is_admin());

create policy "club_ressources_admin_update" on storage.objects
  for update using (bucket_id = 'club-ressources' and is_admin());

create policy "club_ressources_admin_delete" on storage.objects
  for delete using (bucket_id = 'club-ressources' and is_admin());
