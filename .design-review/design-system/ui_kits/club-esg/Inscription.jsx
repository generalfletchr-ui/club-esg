// ── Inscription screen (3-step) ───────────────────────────────────
function InscriptionScreen({ step = 1, onNext = () => {}, onBack = () => {} }) {
  const steps = ['Infos personnelles', 'Infos professionnelles', 'Charte & validation'];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: 520, background: T.white, borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div style={{ background: T.white, padding: '16px 24px', borderBottom: `1px solid ${T.border}` }}>
          <LogoC scale={0.8} />
        </div>

        <div style={{ padding: '24px 28px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4 }}>Rejoindre le Club ESG</h2>
          <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 20 }}>Votre demande sera examinée par notre équipe avant validation.</p>

          {/* Stepper */}
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
            {steps.map((label, i) => {
              const done = i + 1 < step, active = i + 1 === step;
              return (
                <React.Fragment key={label}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 13, background: done || active ? T.teal : T.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {done ? <span style={{ color: '#fff', fontSize: 12 }}>✓</span> : <span style={{ color: active ? '#fff' : T.textMuted, fontSize: 11, fontWeight: 700 }}>{i+1}</span>}
                    </div>
                    <span style={{ fontSize: 10, color: active ? T.teal : T.textMuted, fontWeight: active ? 600 : 400, textAlign: 'center', width: 90 }}>{label}</span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, background: done ? T.teal : T.border, margin: '12px 4px 0', borderRadius: 1 }} />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step content */}
          {step === 1 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {['Prénom *', 'Nom *'].map(l => (
                  <div key={l}><label style={{ fontSize: 12, fontWeight: 500, color: T.textMid, display: 'block', marginBottom: 4 }}>{l}</label><input style={S.input} /></div>
                ))}
              </div>
              {['Email *', 'Mot de passe *', 'Téléphone'].map(l => (
                <div key={l} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.textMid, display: 'block', marginBottom: 4 }}>{l}</label>
                  <input type={l.includes('passe') ? 'password' : 'text'} style={S.input} />
                </div>
              ))}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.textMid, display: 'block', marginBottom: 4 }}>Photo de profil</label>
                <div style={{ height: 56, border: `1.5px dashed ${T.border}`, borderRadius: 6, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📷</span>
                  <span style={{ fontSize: 11, color: T.textMuted }}>Glisser-déposer ou cliquer · JPEG/PNG · max 5Mo</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              {['Type de membre *', 'Fonction / Poste *', 'Entreprise *'].map(l => (
                <div key={l} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: T.textMid, display: 'block', marginBottom: 4 }}>{l}</label>
                  <input style={S.input} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {["Secteur d'activité *", "Taille d'entreprise *"].map(l => (
                  <div key={l}><label style={{ fontSize: 12, fontWeight: 500, color: T.textMid, display: 'block', marginBottom: 4 }}>{l}</label><input style={S.input} /></div>
                ))}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: T.textMid, display: 'block', marginBottom: 4 }}>Expertises * <span style={{ color: T.textMuted, fontWeight: 400 }}>(multi-sélection)</span></label>
                <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, padding: 8, background: T.bg, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['Bilan carbone', 'CSRD', 'Stratégie RSE', 'Audit & Certif.', 'Finance durable', 'Autre...'].map((t, i) => (
                    <span key={t} style={{ padding: '3px 10px', borderRadius: 20, border: `1px solid ${i < 2 ? T.teal : T.border}`, background: i < 2 ? T.tealLight : T.white, fontSize: 11, color: i < 2 ? T.teal : T.textMid, fontWeight: i < 2 ? 600 : 400, cursor: 'pointer' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
                <div style={{ background: T.bg, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.textMid }}>📄 Charte d'engagement du Club ESG</span>
                  <span style={{ fontSize: 11, color: T.teal, cursor: 'pointer', fontWeight: 500 }}>Télécharger ↓</span>
                </div>
                <div style={{ height: 110, padding: '12px 14px', overflowY: 'auto' }}>
                  <p style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.6 }}>La présente charte définit les engagements des membres du Club ESG…</p>
                  <p style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.6, marginTop: 6 }}>• Respect des autres membres et de la confidentialité des échanges</p>
                  <p style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.6 }}>• Contribution active à la vie de la communauté</p>
                  <p style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.6 }}>• Partage d'informations de bonne foi et dans un esprit constructif</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${T.teal}`, background: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ color: '#fff', fontSize: 10 }}>✓</span>
                </div>
                <p style={{ fontSize: 12, color: T.textMid, lineHeight: 1.5 }}>J'ai lu et j'accepte la charte d'engagement du Club ESG.</p>
              </div>
              <div style={{ background: T.bg, borderRadius: 6, padding: '10px 12px', border: `1px solid ${T.border}` }}>
                <p style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.5 }}>⏳ Votre demande sera examinée sous 48h. Vous recevrez un email de confirmation.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
            {step > 1
              ? <button style={S.btnOutline} onClick={onBack}>← Retour</button>
              : <span style={{ fontSize: 12, color: T.textMuted }}>Déjà membre ? <span style={{ color: T.teal, cursor: 'pointer' }} onClick={onBack}>Se connecter</span></span>
            }
            <button style={S.btn()} onClick={onNext}>{step === 3 ? 'Envoyer ma demande ✓' : 'Continuer →'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { InscriptionScreen });
