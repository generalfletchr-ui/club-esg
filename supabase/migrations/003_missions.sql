-- ============================================
-- Club ESG — Table missions (Job Board)
-- ============================================

CREATE TABLE missions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poste_par           UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,

  -- Contenu
  type_mission        TEXT NOT NULL CHECK (type_mission IN ('binome', 'cession')),
  titre               TEXT NOT NULL,
  description         TEXT NOT NULL,
  domaine             TEXT NOT NULL CHECK (domaine IN ('Environnement', 'Social', 'Gouvernance', 'Multi')),
  secteur_client      TEXT,
  expertises_requises TEXT[] NOT NULL DEFAULT '{}',
  type_prestation     TEXT CHECK (type_prestation IN ('Conseil', 'Audit', 'Formation', 'Reporting', 'Autre')),
  duree_estimee       TEXT,
  modalite            TEXT CHECK (modalite IN ('Présentiel', 'Distanciel', 'Hybride')),
  localisation        TEXT,
  budget              TEXT,

  -- Workflow
  statut              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (statut IN ('pending', 'published', 'rejected', 'pourvue', 'expired')),
  expire_le           TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),

  -- Admin
  valide_par          UUID REFERENCES members(id),
  valide_le           TIMESTAMPTZ,

  -- Audit
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- SELECT : membres approuvés voient les missions publiées non-expirées
--          + le posteur voit ses propres fiches (tous statuts)
--          + l'admin voit tout
CREATE POLICY "missions_select" ON missions
  FOR SELECT USING (
    (is_approved() AND statut = 'published' AND expire_le > NOW())
    OR auth.uid() = poste_par
    OR is_admin()
  );

-- INSERT : membres approuvés peuvent créer (statut forcé à 'pending' par la logique applicative)
CREATE POLICY "missions_insert" ON missions
  FOR INSERT WITH CHECK (
    is_approved() AND auth.uid() = poste_par
  );

-- UPDATE : le posteur peut modifier sa fiche ; l'admin peut tout modifier
CREATE POLICY "missions_update" ON missions
  FOR UPDATE USING (
    auth.uid() = poste_par OR is_admin()
  );

-- DELETE : le posteur peut supprimer sa fiche pending ; l'admin peut tout supprimer
CREATE POLICY "missions_delete" ON missions
  FOR DELETE USING (
    (auth.uid() = poste_par AND statut = 'pending') OR is_admin()
  );
