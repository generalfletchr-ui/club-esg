// ── Agenda screen ─────────────────────────────────────────────────
const EVENTS = [
  { month: 'Mai 2026', day: '12', weekday: 'Mer.', time: '12h00 – 13h00', type: 'Webinaire', title: 'CSRD : comment se préparer en 2026 ?', desc: 'Décryptage des nouvelles obligations de reporting extra-financier avec des experts.', speakers: 'Sophie Laurent, Marc Kowalski', registered: true, accent: '#00B4B4', accentBg: '#e6f7f7' },
  { month: 'Mai 2026', day: '20', weekday: 'Jeu.', time: '18h30 – 21h00', type: 'Afterwork', title: 'Networking ESG Paris', desc: "Rencontrez les membres du Club ESG autour d'un verre à Paris.", speakers: null, registered: false, accent: '#00B4B4', accentBg: '#e6f7f7' },
  { month: 'Juin 2026', day: '3', weekday: 'Mer.', time: '14h00 – 17h00', type: 'Workshop', title: 'Bilan carbone pratique : méthodologie et outils', desc: 'Atelier pratique pour maîtriser le calcul du bilan carbone de votre organisation.', speakers: 'Rémi Petit', registered: false, accent: '#7c3aed', accentBg: '#f5f3ff' },
];

function AgendaScreen({ nav = () => {} }) {
  const [activeTab, setActiveTab] = React.useState('Tous');
  const tabs = ['Tous', 'Webinaire', 'Afterwork', 'Workshop'];
  const filtered = activeTab === 'Tous' ? EVENTS : EVENTS.filter(e => e.type === activeTab);
  const months = [...new Set(filtered.map(e => e.month))];

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: T.text }}>Agenda</h2>
        <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Prochains événements de la communauté</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {tabs.map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: activeTab === tab ? 600 : 500, background: activeTab === tab ? T.teal : T.white, color: activeTab === tab ? '#fff' : T.textMid, border: `1px solid ${activeTab === tab ? T.teal : T.border}` }}>{tab}</div>
        ))}
      </div>

      {months.map(month => (
        <div key={month} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{month}</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.filter(e => e.month === month).map((ev, i) => (
              <div key={i} style={{ ...S.card, display: 'flex', padding: 0, overflow: 'hidden' }}>
                {/* Date block */}
                <div style={{ width: 72, background: ev.accentBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 0', flexShrink: 0, borderRight: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 11, color: ev.accent, fontWeight: 600 }}>{ev.weekday}</span>
                  <span style={{ fontSize: 28, fontWeight: 700, color: ev.accent, lineHeight: 1.1 }}>{ev.day}</span>
                  <span style={{ fontSize: 10, color: ev.accent }}>{ev.month.split(' ')[0].toLowerCase()}</span>
                </div>
                {/* Content */}
                <div style={{ flex: 1, padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Tag color={ev.accent} bg={ev.accentBg}>{ev.type}</Tag>
                      <span style={{ fontSize: 11, color: T.textMuted }}>⏱ {ev.time}</span>
                    </div>
                    {ev.registered && <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: 20, background: T.greenLight, color: T.greenDark, fontSize: 11, fontWeight: 600 }}>✓ Inscrit</span>}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{ev.title}</h3>
                  <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, marginBottom: ev.speakers ? 8 : 12 }}>{ev.desc}</p>
                  {ev.speakers && <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 12 }}>🎤 {ev.speakers}</p>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {ev.registered
                      ? <span style={{ ...S.btnOutline, fontSize: 11, padding: '5px 12px' }}>Voir le lien de connexion →</span>
                      : <button style={S.btnSm()}>S'inscrire</button>
                    }
                    <span style={{ ...S.btnOutline, fontSize: 11, padding: '5px 12px' }}>+ Ajouter au calendrier</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { AgendaScreen });
