// Outils communs aux fonctions de formulaire (contact, newsletter).
// Même mécanique que hivingfood.fr (dépôt hivingfood-fr), réglée pour hiving.me.
// Envoi des e-mails par l'API Resend. Aucun secret dans le code :
// la clé est lue dans la variable d'environnement RESEND_API_KEY (réglages Vercel).
// Le fichier commence par « _ » : Vercel ne le publie pas comme une adresse.

const SITE = {
  nom: 'Hiving',
  domaine: 'hiving.me',
  contact: 'contact@hiving.me',
  expediteur: 'Hiving <noreply@hiving.me>',
  origines: ['https://hiving.me', 'https://www.hiving.me'],
  // prévisualisations Vercel de ce projet (hiving-me-xxxx.vercel.app, hiving-me-git-branche-equipe.vercel.app)
  previews: /^https:\/\/hiving-me(-[a-z0-9-]+)?\.vercel\.app$/,
};

function origineAutorisee(origin) {
  if (!origin) return true; // appel direct sans navigateur (curl, tests) : pot de miel et validation restent actifs
  if (SITE.origines.includes(origin)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true; // npx vercel dev
  return SITE.previews.test(origin);
}

function enTetes(req, res) {
  const origin = (req.headers && req.headers.origin) || '';
  if (origin && origineAutorisee(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
}

// Contrôles communs : méthode et origine. Renvoie true si la réponse est déjà partie.
function controlesDeBase(req, res) {
  enTetes(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Méthode non autorisée' }); return true; }
  if (!origineAutorisee(req.headers && req.headers.origin)) { res.status(403).json({ error: 'Origine refusée' }); return true; }
  return false;
}

async function lireCorps(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body) || {}; } catch { return {}; } }
  return {};
}

const EMAIL_RE = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[^\s@<>"]{2,24}$/;

// Texte libre : caractères de contrôle retirés (sauf retours à la ligne), longueur limitée.
function texte(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

// Valeur sur une seule ligne (sujet, nom) : jamais de retour à la ligne.
function ligne(v, max) {
  return texte(v, max).replace(/[\r\n\t]+/g, ' ');
}

function adresseContact() {
  return process.env.CONTACT_TO || SITE.contact;
}

function indisponible(res) {
  return res.status(503).json({
    error: `Envoi momentanément indisponible, écrivez-nous à ${adresseContact()}.`,
    contact: adresseContact(),
  });
}

// Envoi des e-mails : deux voies possibles, réglées dans Vercel (aucun secret dans le code).
// 1. Google Workspace (SMTP) si SMTP_USER et SMTP_PASS sont réglées : le compte Google
//    (ex. contact@hivingfood.fr) et son « mot de passe d'application ». Aucun DNS à changer.
// 2. Sinon Resend, si RESEND_API_KEY est réglée.
async function envoyerEmail(message) {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) return envoyerParSmtp(message);
  return envoyerParResend(message);
}

async function envoyerParSmtp({ sujet, corps, replyTo, copieCachee = [] }) {
  let transport;
  try {
    const nodemailer = require('nodemailer');
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } catch (e) {
    console.error('[formulaire] SMTP indisponible', e && e.message);
    return { ok: false, raison: 'config' };
  }
  try {
    await transport.sendMail({
      // Google impose d'envoyer depuis le compte connecté (ou l'un de ses alias).
      from: `${SITE.nom} <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: adresseContact(),
      bcc: copieCachee.length ? copieCachee : undefined,
      replyTo: replyTo || undefined,
      subject: ligne(sujet, 200),
      text: corps,
    });
  } catch (e) {
    console.error('[formulaire] SMTP a refusé l\'envoi', e && e.message);
    return { ok: false, raison: 'envoi' };
  }
  return { ok: true };
}

async function envoyerParResend({ sujet, corps, replyTo }) {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) {
    console.error('[formulaire] RESEND_API_KEY absente : e-mail non envoyé');
    return { ok: false, raison: 'config' };
  }
  let r;
  try {
    r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || SITE.expediteur,
        to: [adresseContact()],
        reply_to: replyTo || undefined,
        subject: ligne(sujet, 200),
        text: corps,
      }),
    });
  } catch (e) {
    console.error('[formulaire] Resend injoignable', e && e.message);
    return { ok: false, raison: 'envoi' };
  }
  if (!r.ok) {
    console.error('[formulaire] Resend a refusé l\'envoi', r.status, await r.text().catch(() => ''));
    return { ok: false, raison: 'envoi' };
  }
  return { ok: true };
}

function dateParis() {
  return new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
}

module.exports = {
  SITE, origineAutorisee, enTetes, controlesDeBase, lireCorps, EMAIL_RE, texte, ligne,
  adresseContact, indisponible, envoyerEmail, dateParis,
};
