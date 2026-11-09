# Formulaires — hiving.me

Le site est statique : les formulaires envoient leurs données à de petites **fonctions Vercel** (du code qui tourne chez Vercel seulement quand quelqu'un envoie un formulaire), rangées dans le dossier `api/`. Ces fonctions envoient un e-mail à contact@hiving.me grâce à **Resend** (un service d'envoi d'e-mails). Aucun PHP, aucune base de données, aucun traceur. Même mécanique que hivingfood.fr.

## Qui envoie quoi

| Formulaire (page) | Adresse appelée | Champs (JSON) |
|---|---|---|
| Contact court, sous le bouton contact@hiving.me (accueil, section « Construisons la prochaine référence ») | `POST /api/contact` | `name`, `email`, `company` (facultatif), `message` |
| Newsletter du pied de page (accueil) | `POST /api/newsletter` | `email`, `source: footer` |

Le bouton mailto contact@hiving.me reste en place au-dessus du formulaire. Le code d'envoi est à la fin de `hiving.js` (tout `<form data-hv-form="…">` est pris en charge), les styles dans `hiving.css` (`.cta__form`, `.hv-statut`).

Protections : origine limitée à hiving.me, www.hiving.me et aux prévisualisations Vercel du projet (`hiving-me-….vercel.app`) ; champ piège invisible `website` (un robot le remplit, la demande est ignorée sans erreur) ; longueur des champs limitée.

Réponses : `200` envoyé · `400` champ manquant ou e-mail invalide · `403` origine refusée · `405` mauvaise méthode · `503` envoi impossible (clé absente ou Resend en panne). Avec `503`, le site affiche « Envoi momentanément indisponible, écrivez-nous à contact@hiving.me ».

## À faire par Maxime (une seule fois)

### 1. Dans Resend (resend.com)

1. Utiliser le compte Resend dont **maximebolleaupro@gmail.com** est propriétaire (le même que pour hivingfood.fr).
2. *Domains* → *Add domain* → `hiving.me` (région Europe conseillée).
3. Resend affiche des **enregistrements DNS** à ajouter dans la zone OVH de hiving.me. En général :
   - `TXT` sur `resend._domainkey` : la clé DKIM de Resend (signature des e-mails), sous un nom à part.
   - `MX` sur **`send`** (donc `send.hiving.me`, priorité 10) vers l'adresse `feedback-smtp….amazonses.com` donnée par Resend.
   - `TXT` sur **`send`** : `v=spf1 include:amazonses.com ~all`.
   - Copier les valeurs exactes affichées par Resend, pas celles de cette page.

   **Ces enregistrements ne touchent pas aux MX du domaine** : ils sont posés sur le sous-domaine `send` et sur `resend._domainkey`. Les MX, le SPF et le DMARC de `hiving.me` (réception des e-mails chez OVH MX Plan) restent tels quels : ne rien modifier ni supprimer. Personne d'autre que Maxime ne touche aux DNS (CLAUDE.md §7).
4. Attendre que Resend affiche le domaine « Verified ».
5. *API Keys* → *Create API key* (droit « Sending access », domaine hiving.me, ou une clé « tous domaines » partagée avec hivingfood.fr). Copier la clé directement dans Vercel (étape 2). Ne jamais l'envoyer par e-mail ou dans une conversation.

### 2. Dans Vercel (projet hiving-me → Settings → Environment Variables)

| Variable | Obligatoire | Valeur |
|---|---|---|
| `RESEND_API_KEY` | oui | la clé créée dans Resend : **secret, jamais dans le code** |
| `MAIL_FROM` | non | expéditeur ; par défaut `Hiving <noreply@hiving.me>` (doit être sur le domaine vérifié) |
| `CONTACT_TO` | non | destinataire ; par défaut `contact@hiving.me` |
| `RESEND_AUDIENCE_ID` | non | identifiant d'une audience Resend si on veut aussi y ranger les inscrits newsletter |

Cocher *Production* et *Preview*, enregistrer, puis relancer un déploiement (*Deployments* → *Redeploy*) : les variables ne s'appliquent qu'aux nouveaux déploiements.

Sans `RESEND_API_KEY`, rien n'est envoyé et les visiteurs voient le message « écrivez-nous à contact@hiving.me ».

## Tester

```bash
node tests/formulaires.test.js   # simule chaque fonction (aucun e-mail réel)
```

Puis, sur l'URL de prévisualisation, envoyer un vrai message et vérifier la boîte contact@hiving.me.
