// POST /api/newsletter — inscription à la newsletter
// Corps JSON : { email, source? ('footer', 'blog'…), website? (piège à robots) }
// Prévient l'adresse de contact par e-mail. Si RESEND_AUDIENCE_ID est défini,
// ajoute aussi l'adresse à l'audience Resend (liste de diffusion).

const { SITE, controlesDeBase, lireCorps, EMAIL_RE, texte, ligne, indisponible, envoyerEmail, dateParis } = require('./_mail');

async function ajouterAudience(email) {
  const cle = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!cle || !audience) return;
  const r = await fetch(`https://api.resend.com/audiences/${encodeURIComponent(audience)}/contacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed: false }),
  }).catch(() => null);
  if (!r || !r.ok) console.error('[newsletter] ajout à l\'audience impossible', r && r.status);
}

module.exports = async (req, res) => {
  if (controlesDeBase(req, res)) return;

  const b = await lireCorps(req);
  if (texte(b.website, 200)) return res.status(200).json({ success: true });

  const email = ligne(b.email, 254).toLowerCase();
  const source = ligne(b.source || 'footer', 40);
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Adresse e-mail invalide.' });
  if (!process.env.RESEND_API_KEY) return indisponible(res);

  await ajouterAudience(email);
  const envoi = await envoyerEmail({
    sujet: `Nouvelle inscription newsletter ${SITE.nom} : ${email}`,
    corps: `Inscription newsletter depuis ${SITE.domaine}\n\nE-mail : ${email}\nSource : ${source}\nDate : ${dateParis()}\n`,
    replyTo: email,
  });
  if (!envoi.ok) return indisponible(res);
  return res.status(200).json({ success: true, message: 'Merci, c’est noté !' });
};
