alter table members
  add column if not exists references_clients text not null default '';
