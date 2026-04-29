/* Emails transactionnels Club ESG via Resend */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Club ESG <noreply@club.fletchr.fr>";

/** Email envoyé quand une demande est approuvée */
export async function sendApprovalEmail(email: string, prenom: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Club ESG : bienvenue dans le Club !",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:'Work Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <!-- Header -->
        <tr>
          <td style="background:#1A365D;padding:32px;text-align:center;">
            <img src="https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/Logo%20Club%20ESG.png"
                 alt="Club ESG" width="160" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <!-- Corps -->
        <tr>
          <td style="padding:40px 48px;">
            <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;">
              Bienvenue dans le Club, ${prenom} ! 🎉
            </h1>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              Ta demande d'adhésion au Club ESG vient d'être approuvée.
              Tu fais désormais partie d'une communauté de professionnels engagés
              dans la transition RSE.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Tu peux dès maintenant accéder à la plateforme, explorer l'annuaire des membres,
              consulter les replays de nos événements et t'inscrire aux prochaines sessions.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="https://club.fletchr.fr/connexion"
                 style="display:inline-block;padding:14px 32px;background:#00B4B4;color:#fff;
                        font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">
                Accéder au Club →
              </a>
            </div>
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
              À très vite dans le Club !<br>
              <strong style="color:#374151;">L'équipe Club ESG</strong>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f5f6f8;padding:20px 48px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
              Ensemble, accélérons la transition RSE · club.fletchr.fr
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

/** Email envoyé quand une demande est refusée */
export async function sendRejectionEmail(email: string, prenom: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Club ESG : suite à ta candidature",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:'Work Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <!-- Header -->
        <tr>
          <td style="background:#1A365D;padding:32px;text-align:center;">
            <img src="https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/Logo%20Club%20ESG.png"
                 alt="Club ESG" width="160" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <!-- Corps -->
        <tr>
          <td style="padding:40px 48px;">
            <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;">
              Bonjour ${prenom},
            </h1>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              Nous te remercions de l'intérêt que tu portes au Club ESG et de
              ta candidature pour rejoindre notre communauté.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              Après examen de ta demande, nous ne sommes pas en mesure de
              l'accepter pour le moment. Cette décision ne remet pas en question
              ton engagement RSE — notre communauté est encore en phase de
              démarrage et nous privilégions certains profils pour garantir la
              qualité des échanges.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Tu es bienvenu(e) à re-candidater dans quelques semaines si ta
              situation évolue. N'hésite pas à nous écrire si tu as des questions.
            </p>
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
              Cordialement,<br>
              <strong style="color:#374151;">L'équipe Club ESG</strong>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f5f6f8;padding:20px 48px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
              Ensemble, accélérons la transition RSE · club.fletchr.fr
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
