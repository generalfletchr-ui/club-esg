// ── Landing page screen ───────────────────────────────────────────
function LandingScreen({ onLogin = () => {}, onJoin = () => {} }) {
  return (
    <div style={{ minHeight: '100vh', background: T.white, overflowY: 'auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Nav */}
      <div style={{ background: T.white, padding: '12px 40px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <LogoC scale={0.85} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={S.btnOutline} onClick={onLogin}>Se connecter</button>
          <button style={S.btn()} onClick={onJoin}>Rejoindre le Club</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0a2a4a 0%,#1a4a6a 60%,#0a3a3a 100%)', padding: '52px 40px 44px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,180,180,0.15)', border: '1px solid rgba(0,180,180,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 18 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: T.teal, display: 'inline-block' }}></span>
          <span style={{ color: T.teal, fontSize: 12, fontWeight: 600 }}>Communauté privée · 40+ professionnels</span>
        </div>
        <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1.25, maxWidth: 560, margin: '0 auto 14px' }}>
          La communauté des <span style={{ color: T.teal }}>professionnels ESG</span> engagés
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.6 }}>
          Échangez, formez-vous et développez votre réseau avec des experts-comptables, consultants RSE et responsables ESG.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button style={S.btn()} onClick={onJoin}>Demander l'accès</button>
          <button style={{ ...S.btnOutline, background: 'transparent', color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.25)' }} onClick={onLogin}>Découvrir le club</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[['40+','Membres'],['12','Webinaires'],['8','Replays'],['3','Events / mois']].map(([n,l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.teal }}>{n}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Members preview */}
      <div style={{ padding: '28px 40px', background: T.bg }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14, textAlign: 'center' }}>Quelques membres de la communauté</h3>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{i:'SL',name:'Sophie L.',role:'Consultante RSE',tags:['CSRD','Stratégie RSE']},{i:'MK',name:'Marc K.',role:'Responsable RSE',tags:['Bilan carbone']},{i:'AB',name:'Aïcha B.',role:'Expert-comptable',tags:['Finance durable']},{i:'RP',name:'Rémi P.',role:'Consultant RSE',tags:['Audit & Certif.']}].map((m, i) => (
            <div key={i} style={{ ...S.card, width: 190, textAlign: 'center', padding: 14 }}>
              <Avatar initials={m.i} size={40} />
              <p style={{ fontSize: 13, fontWeight: 600, color: T.text, marginTop: 8, marginBottom: 2 }}>{m.name}</p>
              <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 8 }}>{m.role}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                {m.tags.map(t => <Tag key={t} color={T.textMuted} bg={T.bg}>{t}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div style={{ padding: '24px 40px', background: T.white }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 14, textAlign: 'center' }}>Prochains événements</h3>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {[{type:'Webinaire',title:'CSRD : comment se préparer ?',date:'12 mai 2026 · 12h00',icon:'🎙'},{type:'Afterwork',title:'Networking ESG Paris',date:'20 mai 2026 · 18h30',icon:'🤝'},{type:'Workshop',title:'Bilan carbone pratique',date:'3 juin 2026 · 14h00',icon:'📋'}].map((ev, i) => (
            <div key={i} style={{ ...S.card, flex: 1, maxWidth: 280 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{ev.icon}</span>
                <Tag>{ev.type}</Tag>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>{ev.title}</p>
              <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 10 }}>{ev.date}</p>
              <button style={S.btnSm()} onClick={onJoin}>S'inscrire</button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA footer */}
      <div style={{ padding: '28px 40px', background: T.teal, textAlign: 'center' }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Prêt·e à rejoindre la communauté ?</p>
        <button style={{ padding: '9px 24px', background: '#fff', borderRadius: 6, cursor: 'pointer', border: 'none', color: T.teal, fontWeight: 700, fontSize: 13, fontFamily: 'Inter' }} onClick={onJoin}>
          Demander l'accès gratuit →
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { LandingScreen });
