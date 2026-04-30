// ── Fiche membre screen ────────────────────────────────────────────
function FicheMembreScreen({ nav = () => {} }) {
  const m = { i: 'SL', name: 'Sophie Laurent', fn: 'Directrice RSE', co: 'Veolia', sector: 'Énergie & Utilities', city: 'Paris', region: 'Île-de-France', size: '1000+ employés', linkedin: 'linkedin.com/in/sophielaurent', since: 'Février 2026', bio: "Directrice RSE chez Veolia depuis 5 ans, je pilote la stratégie de développement durable du groupe en France. Spécialisée dans la CSRD et le reporting extra-financier, j'accompagne les équipes dans la transformation vers un modèle d'entreprise plus responsable.", tags: ['CSRD / Reporting extra-financier', 'Stratégie RSE', 'Finance durable', 'Bilan carbone', 'Conformité réglementaire'] };
  return (
    <div style={{ padding: '20px 24px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: T.teal, cursor: 'pointer' }} onClick={() => nav('annuaire')}>Annuaire</span>
        <span style={{ fontSize: 12, color: T.textMuted }}>›</span>
        <span style={{ fontSize: 12, color: T.textMid, fontWeight: 500 }}>Sophie Laurent</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ ...S.card, textAlign: 'center', padding: '24px 16px' }}>
            <Avatar initials={m.i} size={72} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, marginTop: 12, marginBottom: 2 }}>{m.name}</h2>
            <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 10 }}>{m.fn} · {m.co}</p>
            <Tag>Responsable RSE</Tag>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[['📍', `${m.city}, ${m.region}`], ['🏢', m.sector], ['👥', m.size], ['🔗', m.linkedin]].map(([icon, val], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: T.bg, borderRadius: 6 }}>
                  <span style={{ fontSize: 13 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: i === 3 ? T.teal : T.textMid }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <button style={{ ...S.btn(), width: '100%', justifyContent: 'center', fontSize: 12 }}>💬 Contacter via WhatsApp</button>
            </div>
          </div>
          <div style={{ ...S.card, padding: '12px 14px' }}>
            <p style={{ ...S.label, marginBottom: 6 }}>Membre depuis</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{m.since}</p>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 8 }}>Biographie</p>
            <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>{m.bio}</p>
          </div>
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 10 }}>Expertises</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {m.tags.map(t => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 10 }}>Entreprise</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[['Entreprise', 'Veolia', false], ['Site web', 'veolia.com', true], ['Secteur', m.sector, false], ['Taille', m.size, false]].map(([l, v, link]) => (
                <div key={l}>
                  <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>{l}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: link ? T.teal : T.text }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 10 }}>Événements en commun</p>
            {[{ title: 'CSRD : comment se préparer ?', date: '12 mai 2026', type: 'Webinaire' }, { title: 'Networking ESG Paris', date: '20 mars 2026', type: 'Afterwork' }].map((ev, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i === 0 ? `1px solid ${T.border}` : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: T.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🎙</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{ev.title}</p>
                  <p style={{ fontSize: 11, color: T.textMuted }}>{ev.date}</p>
                </div>
                <Tag>{ev.type}</Tag>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FicheMembreScreen });
