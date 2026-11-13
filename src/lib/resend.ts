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
                 style="display:inline-block;padding:14px 32px;background:#016050;color:#fff;
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

/* ── Missions ──────────────────────────────────────────────── */

/** Email envoyé au posteur quand sa fiche est publiée par un admin */
export async function sendMissionPublishedEmail(
  email: string,
  prenom: string,
  missionTitre: string
) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Club ESG : ta mission est en ligne ! 🚀",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:'Work Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background:#1A365D;padding:32px;text-align:center;">
            <img src="https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/Logo%20Club%20ESG.png"
                 alt="Club ESG" width="160" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px 48px;">
            <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;">
              Ta mission est en ligne, ${prenom} ! 🎉
            </h1>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              Ta fiche <strong>« ${missionTitre} »</strong> vient d'être validée et publiée
              sur le job board du Club ESG. Les membres peuvent désormais la consulter
              et te contacter.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Rendez-vous dans <strong>Mes missions</strong> pour suivre les réponses
              et gérer ta fiche.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="https://club.fletchr.fr/mes-missions"
                 style="display:inline-block;padding:14px 32px;background:#016050;color:#fff;
                        font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">
                Voir mes missions →
              </a>
            </div>
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
              Bonne mission !<br>
              <strong style="color:#374151;">L'équipe Club ESG</strong>
            </p>
          </td>
        </tr>
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

/** Email envoyé au posteur quand sa fiche est rejetée par un admin */
export async function sendMissionRejectedEmail(
  email: string,
  prenom: string,
  missionTitre: string
) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Club ESG : suite à ta fiche mission",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:'Work Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background:#1A365D;padding:32px;text-align:center;">
            <img src="https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/Logo%20Club%20ESG.png"
                 alt="Club ESG" width="160" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px 48px;">
            <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;">
              Bonjour ${prenom},
            </h1>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              Ta fiche <strong>« ${missionTitre} »</strong> n'a pas pu être publiée
              en l'état. Notre équipe a besoin que tu la révises avant de la mettre en ligne.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Connecte-toi à ta page <strong>Mes missions</strong> pour modifier
              la fiche et la soumettre à nouveau.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="https://club.fletchr.fr/mes-missions"
                 style="display:inline-block;padding:14px 32px;background:#016050;color:#fff;
                        font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">
                Modifier ma fiche →
              </a>
            </div>
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
              Cordialement,<br>
              <strong style="color:#374151;">L'équipe Club ESG</strong>
            </p>
          </td>
        </tr>
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

/** Email envoyé au posteur quand un membre répond à sa fiche */
export interface MissionRepondant {
  prenom: string;
  nom: string;
  entreprise: string;
  expertises: string[];
  linkedin?: string | null;
  profil_url: string;
}

export async function sendMissionInterestEmail(
  email: string,
  prenom: string,
  missionTitre: string,
  repondant: MissionRepondant
) {
  const expertisesHtml = repondant.expertises
    .slice(0, 5)
    .map(
      (e) =>
        `<span style="display:inline-block;padding:3px 10px;background:#e4f7f3;color:#016050;border-radius:20px;font-size:11px;font-weight:600;margin:2px;">${e}</span>`
    )
    .join(" ");

  const linkedinBtn = repondant.linkedin
    ? `<a href="${repondant.linkedin}" style="display:inline-block;margin-top:8px;padding:8px 16px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;color:#374151;text-decoration:none;">Voir LinkedIn →</a>`
    : "";

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `Club ESG : ${repondant.prenom} ${repondant.nom} est intéressé(e) par ta mission`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:'Work Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background:#1A365D;padding:32px;text-align:center;">
            <img src="https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/Logo%20Club%20ESG.png"
                 alt="Club ESG" width="160" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px 48px;">
            <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;">
              Nouvelle réponse à ta mission, ${prenom} ! 👋
            </h1>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Un membre est intéressé(e) par ta fiche <strong>« ${missionTitre} »</strong>.
              Voici son profil :
            </p>

            <!-- Carte répondant -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:24px;">
              <tr>
                <td style="padding:20px;">
                  <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#111827;">
                    ${repondant.prenom} ${repondant.nom}
                  </p>
                  <p style="margin:0 0 12px;font-size:13px;color:#6b7280;">
                    ${repondant.entreprise}
                  </p>
                  <div style="margin-bottom:12px;">${expertisesHtml}</div>
                  ${linkedinBtn}
                </td>
              </tr>
            </table>

            <div style="text-align:center;margin:8px 0 24px;">
              <a href="${repondant.profil_url}"
                 style="display:inline-block;padding:14px 32px;background:#016050;color:#fff;
                        font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">
                Voir le profil complet →
              </a>
            </div>
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
              Bonne collaboration !<br>
              <strong style="color:#374151;">L'équipe Club ESG</strong>
            </p>
          </td>
        </tr>
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

/** Notification aux admins : nouvelle demande d'inscription */
export async function sendAdminNewMemberEmail(
  adminEmails: string[],
  prenom: string,
  nom: string,
  email: string,
  entreprise: string,
  fonction: string,
) {
  if (!adminEmails.length) return;
  return resend.emails.send({
    from: FROM,
    to: adminEmails,
    subject: `Club ESG : nouvelle demande de ${prenom} ${nom}`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:'Work Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background:#1A365D;padding:32px;text-align:center;">
            <img src="https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/Logo%20Club%20ESG.png"
                 alt="Club ESG" width="160" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px 48px;">
            <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#111827;">
              Nouvelle demande d'adhésion
            </h1>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:24px;">
              <tr><td style="padding:20px;">
                <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#111827;">${prenom} ${nom}</p>
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${fonction} · ${entreprise}</p>
                <p style="margin:0;font-size:13px;color:#6b7280;">${email}</p>
              </td></tr>
            </table>
            <div style="text-align:center;">
              <a href="https://club.fletchr.fr/admin/demandes"
                 style="display:inline-block;padding:14px 32px;background:#016050;color:#fff;
                        font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">
                Examiner la demande →
              </a>
            </div>
          </td>
        </tr>
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

/* ── Propositions d'animation ──────────────────────────────── */

const FROM_EQUIPE = "L'équipe du Club ESG <noreply@club.fletchr.fr>";
const SITE_URL = "https://club.fletchr.fr";

/** Échappe le texte saisi par les membres avant de l'insérer dans un mail */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Gabarit commun aux mails d'animation (même charte que les autres mails) */
function animationMailLayout(body: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:'Work Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background:#1A365D;padding:32px;text-align:center;">
            <img src="https://146612565.fs1.hubspotusercontent-eu1.net/hubfs/146612565/Fletchr/Logo%20Club%20ESG.png"
                 alt="Club ESG" width="160" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px 48px;font-size:15px;color:#374151;line-height:1.6;">
            ${body}
            <p style="margin:24px 0 0;font-size:15px;color:#374151;">L'équipe du Club ESG</p>
          </td>
        </tr>
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
</html>`;
}

const P = 'style="margin:0 0 16px;"';

/** Message de l'admin : texte libre, retours à la ligne conservés */
function messageBlock(message: string): string {
  return `<p style="margin:0 0 16px;white-space:pre-line;">${escapeHtml(message)}</p>`;
}

export interface AnimationMailInfo {
  email: string;
  prenom: string;
  titre: string;
}

/** Accusé de réception au membre */
export function buildAnimationReceivedEmail(info: AnimationMailInfo) {
  return {
    from: FROM_EQUIPE,
    to: info.email,
    subject: "Nous avons bien reçu votre proposition d'animation",
    html: animationMailLayout(`
      <p ${P}>Bonjour ${escapeHtml(info.prenom)},</p>
      <p ${P}>Merci pour votre proposition « ${escapeHtml(info.titre)} » ! Nous revenons vers vous sous une semaine.</p>`),
  };
}

/** Validation, avec le modèle de présentation en pièce jointe */
export function buildAnimationValidatedEmail(
  info: AnimationMailInfo & { format: "webinaire" | "atelier"; dateLongue: string; heure: string },
  attachment?: { filename: string; content: Buffer }
) {
  return {
    from: FROM_EQUIPE,
    to: info.email,
    subject: "Votre animation pour le Club ESG est validée !",
    html: animationMailLayout(`
      <p ${P}>Bonjour ${escapeHtml(info.prenom)},</p>
      <p ${P}>Merci pour votre proposition : votre ${info.format} « ${escapeHtml(info.titre)} » est validé ! Il aura lieu le ${info.dateLongue} à ${info.heure}, en ligne sur Teams.</p>
      <p style="margin:0 0 8px;">Pour bien le préparer :</p>
      <ol style="margin:0 0 16px;padding-left:20px;">
        <li>Vous trouverez en pièce jointe le modèle de présentation du Club, avec un guide pour l'intervenant.</li>
        <li>Merci de nous envoyer votre support au plus tard une semaine avant la date.</li>
        <li>Nous calerons ensemble un test technique de 15 minutes deux jours avant, pour vérifier la connexion, le micro et le partage d'écran.</li>
      </ol>
      <p ${P}>De notre côté, nous nous occupons de la communication et de l'animation des sondages pendant la session.</p>
      <p ${P}>Merci de faire vivre le Club !</p>`),
    ...(attachment ? { attachments: [attachment] } : {}),
  };
}

/** Demande d'ajustement, avec le lien de modification */
export function buildAnimationAdjustEmail(info: AnimationMailInfo & { message: string; proposalId: string }) {
  const lien = `${SITE_URL}/proposer-animation/${info.proposalId}`;
  return {
    from: FROM_EQUIPE,
    to: info.email,
    subject: "Votre proposition d'animation : un petit ajustement",
    html: animationMailLayout(`
      <p ${P}>Bonjour ${escapeHtml(info.prenom)},</p>
      <p ${P}>Merci pour votre proposition « ${escapeHtml(info.titre)} ».</p>
      ${messageBlock(info.message)}
      <p ${P}>Vous pouvez modifier votre proposition ici : <a href="${lien}" style="color:#016050;font-weight:600;">${lien}</a></p>`),
  };
}

/** Refus */
export function buildAnimationRefusedEmail(info: AnimationMailInfo & { message: string }) {
  return {
    from: FROM_EQUIPE,
    to: info.email,
    subject: "Votre proposition d'animation",
    html: animationMailLayout(`
      <p ${P}>Bonjour ${escapeHtml(info.prenom)},</p>
      <p ${P}>Merci pour votre proposition « ${escapeHtml(info.titre)} ».</p>
      ${messageBlock(info.message)}
      <p ${P}>N'hésitez pas à nous proposer un autre sujet.</p>`),
  };
}

/** Notification aux admins : nouvelle proposition ou proposition ajustée */
export function buildAdminAnimationNotification(
  adminEmails: string[],
  info: {
    prenom: string;
    nom: string;
    titre: string;
    formatLabel: string;
    theme: string;
    dateLongue: string;
    heure: string;
    ajustee: boolean;
  }
) {
  const quoi = info.ajustee ? "Proposition d'animation ajustée" : "Nouvelle proposition d'animation";
  return {
    from: FROM_EQUIPE,
    to: adminEmails,
    subject: `Club ESG : ${quoi.toLowerCase()} de ${info.prenom} ${info.nom}`,
    html: animationMailLayout(`
      <p ${P}><strong>${quoi}</strong></p>
      <p style="margin:0 0 4px;"><strong>Intervenant :</strong> ${escapeHtml(info.prenom)} ${escapeHtml(info.nom)}</p>
      <p style="margin:0 0 4px;"><strong>Titre :</strong> ${escapeHtml(info.titre)}</p>
      <p style="margin:0 0 4px;"><strong>Format :</strong> ${info.formatLabel}</p>
      <p style="margin:0 0 4px;"><strong>Thème :</strong> ${escapeHtml(info.theme)}</p>
      <p ${P}><strong>Date souhaitée :</strong> ${info.dateLongue} à ${info.heure}</p>
      <p ${P}><a href="${SITE_URL}/admin/animations" style="color:#016050;font-weight:600;">Traiter la proposition dans l'espace admin →</a></p>`),
  };
}

/** Envoie un mail préparé par l'un des builders ci-dessus */
export async function sendAnimationEmail(payload: Parameters<typeof resend.emails.send>[0]) {
  if (Array.isArray(payload.to) && payload.to.length === 0) return;
  return resend.emails.send(payload);
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
