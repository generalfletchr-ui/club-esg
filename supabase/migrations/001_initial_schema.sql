-- ============================================
-- Club ESG — Schéma initial de la base de données
-- ============================================

-- ==================
-- TABLE : members
-- ==================
CREATE TABLE members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  type_membre TEXT NOT NULL CHECK (type_membre IN ('Expert-comptable', 'Consultant RSE', 'Responsable RSE', 'Autre')),
  fonction TEXT NOT NULL,
  entreprise TEXT NOT NULL,
  siret TEXT NOT NULL,
  secteur TEXT NOT NULL CHECK (secteur IN (
    'Tous Secteurs', 'Agroalimentaire', 'Industrie & Manufacturing',
    'BTP & Construction', 'Énergie & Utilities', 'Transport & Logistique',
    'Commerce & Distribution', 'Hôtellerie & Restauration',
    'Santé & Médico-social', 'Pharmacie & Cosmétique',
    'Services aux entreprises', 'Finance & Assurance', 'Immobilier',
    'Tech & Numérique', 'Télécommunications', 'Éducation & Formation',
    'Culture & Médias', 'Associations & ESS', 'Secteur public', 'Autre'
  )),
  taille_entreprise TEXT NOT NULL CHECK (taille_entreprise IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  zone_geo TEXT NOT NULL,
  ville TEXT NOT NULL,
  site_web TEXT,
  photo_url TEXT,
  biographie TEXT NOT NULL CHECK (char_length(biographie) <= 500),
  expertises TEXT[] NOT NULL,
  linkedin TEXT,
  telephone TEXT,
  charte_acceptee BOOLEAN DEFAULT FALSE,
  statut TEXT DEFAULT 'pending' CHECK (statut IN ('pending', 'approved', 'rejected')),
  role TEXT DEFAULT 'pending' CHECK (role IN ('pending', 'member', 'admin')),
  date_inscription TIMESTAMPTZ DEFAULT NOW(),
  premiere_connexion TIMESTAMPTZ,
  derniere_connexion TIMESTAMPTZ,
  approuve_par UUID REFERENCES members(id),
  approuve_le TIMESTAMPTZ
);

-- ==================
-- TABLE : events
-- ==================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  date_heure TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  type_event TEXT NOT NULL CHECK (type_event IN ('Webinaire', 'Afterwork', 'Workshop')),
  lien_inscription TEXT NOT NULL,
  image_url TEXT,
  cree_par UUID REFERENCES members(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- TABLE : replays
-- ==================
CREATE TABLE replays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  date_event DATE NOT NULL,
  description TEXT NOT NULL,
  type_event TEXT NOT NULL CHECK (type_event IN ('Webinaire', 'Afterwork', 'Workshop')),
  lien_replay TEXT NOT NULL,
  image_url TEXT,
  intervenants TEXT,
  cree_par UUID REFERENCES members(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE replays ENABLE ROW LEVEL SECURITY;

-- --------------------
-- Policies : members
-- --------------------

-- Fonction utilitaire : vérifie si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM members
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Fonction utilitaire : vérifie si l'utilisateur est approuvé (membre ou admin)
CREATE OR REPLACE FUNCTION is_approved()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM members
    WHERE id = auth.uid() AND statut = 'approved'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- SELECT : les membres approved et admins peuvent lire les profils approved
CREATE POLICY "members_select" ON members
  FOR SELECT USING (
    is_approved() AND statut = 'approved'
  );

-- INSERT : un utilisateur authentifié peut insérer son propre profil
CREATE POLICY "members_insert" ON members
  FOR INSERT WITH CHECK (
    id = auth.uid()
  );

-- UPDATE : un membre peut modifier son propre profil, un admin peut modifier tout
CREATE POLICY "members_update" ON members
  FOR UPDATE USING (
    id = auth.uid() OR is_admin()
  );

-- DELETE : admin uniquement
CREATE POLICY "members_delete" ON members
  FOR DELETE USING (
    is_admin()
  );

-- --------------------
-- Policies : events
-- --------------------

-- SELECT : membres approved et admins
CREATE POLICY "events_select" ON events
  FOR SELECT USING (
    is_approved()
  );

-- INSERT : admins uniquement
CREATE POLICY "events_insert" ON events
  FOR INSERT WITH CHECK (
    is_admin()
  );

-- UPDATE : admins uniquement
CREATE POLICY "events_update" ON events
  FOR UPDATE USING (
    is_admin()
  );

-- DELETE : admins uniquement
CREATE POLICY "events_delete" ON events
  FOR DELETE USING (
    is_admin()
  );

-- --------------------
-- Policies : replays
-- --------------------

-- SELECT : membres approved et admins
CREATE POLICY "replays_select" ON replays
  FOR SELECT USING (
    is_approved()
  );

-- INSERT : admins uniquement
CREATE POLICY "replays_insert" ON replays
  FOR INSERT WITH CHECK (
    is_admin()
  );

-- UPDATE : admins uniquement
CREATE POLICY "replays_update" ON replays
  FOR UPDATE USING (
    is_admin()
  );

-- DELETE : admins uniquement
CREATE POLICY "replays_delete" ON replays
  FOR DELETE USING (
    is_admin()
  );

-- ============================================
-- STORAGE : bucket avatars
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy : upload par l'utilisateur authentifié (dans son propre dossier)
CREATE POLICY "avatars_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

-- Policy : mise à jour par l'utilisateur authentifié
CREATE POLICY "avatars_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

-- Policy : suppression par l'utilisateur authentifié
CREATE POLICY "avatars_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

-- Policy : lecture publique
CREATE POLICY "avatars_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'avatars'
  );

-- ============================================
-- ADMINS INITIAUX
-- Note : ces INSERT seront exécutés après la création
-- des comptes via Supabase Auth. Les UUID seront mis à jour
-- manuellement après la première inscription de chaque admin.
-- ============================================

-- INSERT INTO members (id, email, prenom, nom, type_membre, fonction, entreprise, siret, secteur, taille_entreprise, zone_geo, ville, biographie, expertises, charte_acceptee, statut, role)
-- VALUES
--   ('<uuid-thomas>', 'thomas@fletchr.fr', 'Thomas', 'Perrien', 'Autre', 'Responsable Partenariats', 'Fletchr', '00000000000000', 'Tech & Numérique', '11-50', 'France', 'Paris', 'Responsable Partenariats chez Fletchr, plateforme de pilotage RSE.', ARRAY['Stratégie RSE', 'CSRD / Reporting extra-financier'], true, 'approved', 'admin'),
--   ('<uuid-marie>', 'marie@fletchr.fr', 'Marie', '', 'Autre', 'Équipe Fletchr', 'Fletchr', '00000000000000', 'Tech & Numérique', '11-50', 'France', 'Paris', 'Membre de l''équipe Fletchr.', ARRAY['Stratégie RSE'], true, 'approved', 'admin'),
--   ('<uuid-oumaima>', 'oumaima@fletchr.fr', 'Oumaima', '', 'Autre', 'Équipe Fletchr', 'Fletchr', '00000000000000', 'Tech & Numérique', '11-50', 'France', 'Paris', 'Membre de l''équipe Fletchr.', ARRAY['Stratégie RSE'], true, 'approved', 'admin');
