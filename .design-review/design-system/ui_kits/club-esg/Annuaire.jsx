// ── Annuaire screen ────────────────────────────────────────────────
const MEMBERS = [
  { i: 'SL', name: 'Sophie Laurent', fn: 'Directrice RSE', co: 'Veolia', sector: 'Énergie & Utilities', city: 'Paris', type: 'Responsable RSE', tags: ['CSRD', 'Stratégie RSE', 'Finance durable'] },
  { i: 'MK', name: 'Marc Kowalski', fn: 'Consultant senior', co: 'EY', sector: 'Finance & Assurance', city: 'Lyon', type: 'Consultant RSE', tags: ['Bilan carbone', 'Audit & Certif.'] },
  { i: 'AB', name: 'Aïcha Benali', fn: 'Expert-comptable', co: 'Cabinet Benali', sector: 'Services', city: 'Bordeaux', type: 'Expert-comptable', tags: ['Finance durable', 'Conformité'] },
  { i: 'RP', name: 'Rémi Petit', fn: 'RSE Manager', co: 'Décathlon', sector: 'Commerce', city: 'Lille', type: 'Responsable RSE', tags: ['Éco. circulaire', 'QVT & RH'] },
  { i: 'NB', name: 'Nadia Blanc', fn: 'Directrice Stratégie', co: 'LVMH', sector: 'Luxe & Mode', city: 'Paris', type: 'Responsable RSE', tags: ['Reporting ESG', 'CSRD'] },
  { i: 'PD', name: 'Pierre Dupont', fn: 'Consultant RSE', co: 'Mazars', sector: 'Services financiers', city: 'Nantes', type: 'Consultant RSE', tags: ['Audit & Certif.', 'GRI'] },
];

function AnnuaireScreen({ nav = () => {} }) {
  const [search, setSearch] = React.useState('');
  const filtered = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.fn.toLowerCase().includes(search.toLowerCase()) ||
    m.co.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: T.text }}>Annuaire des membres</h2>
          <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>42 membres · 3 nouveaux cette semaine</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, height: 34, border: `1px solid ${T.border}`, borderRadius: 6, background: T.white, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8 }}>
          <span style={{ color: T.textMuted, fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un membre..." style={{ border: 'none', outline: 'none', fontSize: 12, color: T.text, flex: 1, fontFamily: 'Inter', background: 'transparent' }} />
        </div>
        {['Type de membre ▾', 'Secteur ▾', 'Expertise ▾', 'Zone géo. ▾'].map(f => (
          <div key={f} style={{ ...S.btnOutline, height: 34, padding: '0 12px' }}>{f}</div>
        ))}
      </div>

      {/* Active filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <Tag>Consultant RSE ×</Tag>
        <Tag>Finance &amp; Assurance ×</Tag>
        <span style={{ fontSize: 11, color: T.textMuted, cursor: 'pointer' }}>Effacer les filtres</span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {filtered.map((m, i) => (
          <div key={i} style={{ ...S.card, display: 'flex', gap: 12, padding: '12px 14px' }}>
            <Avatar initials={m.i} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 2 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{m.name}</p>
                  <p style={{ fontSize: 11, color: T.textMuted }}>{m.fn} · {m.co}</p>
                </div>
                <Tag>{m.type.split(' ')[0]}</Tag>
              </div>
              <p style={{ fontSize: 11, color: T.textMuted, margin: '4px 0 6px' }}>📍 {m.city} · {m.sector}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                {m.tags.map(t => <Tag key={t} color={T.textMuted} bg={T.bg}>{t}</Tag>)}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ ...S.btnOutline, display: 'inline-flex', padding: '4px 12px', fontSize: 11, cursor: 'pointer' }} onClick={() => nav('fiche')}>
                  Voir le profil →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 16 }}>
        {['‹', 1, 2, 3, '...', 11, '›'].map((p, i) => (
          <div key={i} style={{ width: 28, height: 28, borderRadius: 6, background: p === 1 ? T.teal : T.white, border: `1px solid ${p === 1 ? T.teal : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: 12, fontWeight: p === 1 ? 700 : 400, color: p === 1 ? '#fff' : T.textMid }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { AnnuaireScreen, MEMBERS });
