// ── Dashboard screen ───────────────────────────────────────────────
function DashboardScreen({ nav = () => {} }) {
  return (
    <div style={{ padding: '20px 24px' }}>
      <p style={{ fontSize: 13, color: T.teal, fontWeight: 500, marginBottom: 3 }}>Bonjour, Thomas,</p>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 16 }}>Bienvenue au Club ESG !</h1>

      {/* Profile completion */}
      <div style={{ ...S.card, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.textMid }}>Complétion du profil</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.teal }}>75%</span>
          </div>
          <div style={{ height: 5, background: T.border, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: '75%', height: '100%', background: T.teal, borderRadius: 3 }} />
          </div>
          <p style={{ fontSize: 11, color: T.textMuted, marginTop: 5 }}>Ajoutez votre photo de profil et votre biographie pour compléter votre profil.</p>
        </div>
        <button style={S.btn()}>Compléter mon profil →</button>
      </div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Events */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Prochains événements</span>
            <span style={{ fontSize: 11, color: T.teal, fontWeight: 600, cursor: 'pointer' }} onClick={() => nav('agenda')}>Voir tout →</span>
          </div>
          {[
            { type: 'Webinaire', title: 'CSRD : comment se préparer ?', date: '12 mai · 12h00', icon: '🎙' },
            { type: 'Afterwork', title: 'Networking ESG Paris', date: '20 mai · 18h30', icon: '🤝' },
          ].map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderTop: `1px solid ${T.border}` }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: T.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>{ev.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 3 }}><Tag>{ev.type}</Tag></div>
                <p style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{ev.title}</p>
                <p style={{ fontSize: 11, color: T.textMuted }}>{ev.date}</p>
              </div>
              <button style={S.btnSm()}>S'inscrire</button>
            </div>
          ))}
        </div>

        {/* New members */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Nouveaux membres</span>
            <span style={{ fontSize: 11, color: T.teal, fontWeight: 600, cursor: 'pointer' }} onClick={() => nav('annuaire')}>Annuaire →</span>
          </div>
          {[
            { i: 'SL', name: 'Sophie Laurent', role: 'Consultante RSE', company: 'BNP Paribas' },
            { i: 'MK', name: 'Marc Kowalski', role: 'Responsable RSE', company: 'Veolia' },
            { i: 'AB', name: 'Aïcha Benali', role: 'Expert-comptable', company: 'Cabinet Benali' },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: `1px solid ${T.border}` }}>
              <Avatar initials={m.i} size={30} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{m.name}</p>
                <p style={{ fontSize: 11, color: T.textMuted }}>{m.role} · {m.company}</p>
              </div>
              <span style={{ fontSize: 11, color: T.teal, fontWeight: 500, cursor: 'pointer' }} onClick={() => nav('fiche')}>Voir →</span>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div style={{ borderRadius: 8, background: T.greenLight, border: `1px solid ${T.greenBorder}`, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>💬</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>Groupe WhatsApp communautaire</p>
            <p style={{ fontSize: 11, color: T.greenDark }}>Rejoignez les échanges rapides et informels avec les membres</p>
          </div>
        </div>
        <button style={S.btn(T.greenDark)}>Rejoindre →</button>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen });
