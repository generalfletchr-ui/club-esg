alter table members
  add column if not exists disponible_mission boolean not null default false;
