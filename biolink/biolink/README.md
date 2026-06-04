# bio.link — plateforme de profils multi-utilisateurs (auto-hébergeable)

Une plateforme façon **guns.lol** : chacun crée son compte, choisit son pseudo,
personnalise son profil (avatar, fond image/vidéo, musique, effets, liens) et
obtient une page publique à l'adresse `ton-site.com/sonpseudo`.

Tout fonctionne avec **Node.js + SQLite** : aucune base de données externe à
installer, juste un fichier `data.db` créé automatiquement.

---

## ⚡ Lancer en local (test sur ta machine)

Prérequis : **Node.js 18 ou plus** (https://nodejs.org).

```bash
# 1. dans le dossier du projet
npm install        # installe les dépendances (1ère fois seulement)

# 2. démarrer
npm start
```

Ouvre ensuite **http://localhost:3000** dans ton navigateur.
Crée un compte → tu arrives sur le tableau de bord → personnalise → ta page
est sur `http://localhost:3000/tonpseudo`.

> Si `npm install` bloque sur `better-sqlite3`, installe les outils de build :
> - **Windows** : `npm install --global windows-build-tools` (ou installe « Desktop development with C++ » via Visual Studio)
> - **Linux** : `sudo apt install build-essential python3`
> - **Mac** : `xcode-select --install`

---

## 🌍 Mettre le site en ligne (accessible à tous)

Le site n'est PAS un site statique : il faut un hébergement qui **exécute du
Node.js**. GitHub Pages ne convient donc PAS. Voici les options classiques :

### Option A — VPS (contrôle total, ~3-5 €/mois : Hetzner, OVH, DigitalOcean...)
```bash
# sur le serveur, une fois Node installé :
git clone <ton-repo>   # ou envoie les fichiers en FTP/scp
cd biolink
npm install
# garder le process en vie avec pm2 :
npm install -g pm2
SESSION_SECRET="mets-une-longue-phrase-secrete" pm2 start server.js --name biolink
pm2 save
```
Place ensuite un reverse-proxy (Nginx/Caddy) devant pour le HTTPS et ton domaine.
Exemple Caddy (HTTPS automatique), fichier `Caddyfile` :
```
ton-domaine.com {
    reverse_proxy localhost:3000
}
```

### Option B — Hébergeur « clé en main » (Render, Railway, Fly.io...)
- Crée un nouveau « Web Service » à partir de ton dépôt.
- Build command : `npm install`
- Start command : `npm start`
- Variable d'environnement : `SESSION_SECRET` = une longue chaîne aléatoire.

**🔴 SUR RAILWAY — étape OBLIGATOIRE pour ne rien perdre :**
1. Dans ton service, ajoute un **Volume** (Settings → Volumes) avec comme
   chemin de montage : `/data`
2. Ajoute la variable d'environnement : `DATA_DIR` = `/data`
   → ainsi la base `data.db`, les sessions et les fichiers `uploads/` sont
   stockés dans le volume persistant et survivent aux redéploiements.
3. Ajoute aussi `SESSION_SECRET` = une longue phrase secrète.

---

## ⚙️ Variables d'environnement

| Variable         | Rôle                                              | Défaut            |
|------------------|---------------------------------------------------|-------------------|
| `PORT`           | Port d'écoute                                      | `3000`            |
| `SESSION_SECRET` | Clé de signature des sessions (mets-en une !)     | aléatoire (à chaque redémarrage → déconnecte tout le monde) |

**Important** : définis toujours `SESSION_SECRET` en production, sinon les
utilisateurs sont déconnectés à chaque redémarrage du serveur.

---

## 🗂️ Structure

```
biolink/
├── server.js            ← serveur (auth, dashboard, uploads, pages)
├── db.js                ← base SQLite (création des tables)
├── package.json
├── views/               ← pages (EJS)
│   ├── index.ejs        ← accueil
│   ├── register.ejs / login.ejs
│   ├── dashboard.ejs    ← édition du profil
│   ├── profile.ejs      ← page publique /pseudo
│   └── 404.ejs
├── public/
│   ├── css/app.css      ← style accueil + dashboard
│   ├── css/profile.css  ← style des pages profil
│   └── js/profile.js    ← moteur des pages profil
└── uploads/             ← fichiers envoyés par les utilisateurs
```

Fichiers générés automatiquement (ne pas commit) : `data.db`, `sessions.db`,
et le contenu de `uploads/`.

---

## ✅ Ce qui est inclus

- Inscription / connexion, mots de passe chiffrés (bcrypt)
- Pseudos uniques + liste de pseudos réservés
- Tableau de bord : avatar, sous-titre, bio multi-lignes (typewriter),
  couleurs, effet (neige/pluie/étoiles), statut, curseur, liens sociaux, boutons
- Upload photo / fond (image ou vidéo) / musique (limite 25 Mo/fichier)
- Page publique animée : écran d'entrée, lecteur audio, particules, tilt 3D
- Compteur de vues réel (stocké en base)
- Protection anti-XSS (données échappées, URLs et couleurs validées)

---

## 🔒 À FAIRE avant une vraie mise en prod publique

Ouvrir un site où **n'importe qui** uploade des fichiers implique des
responsabilités. Pense à :

1. **HTTPS obligatoire** (via Caddy/Nginx) + ajouter `cookie.secure = true`
   dans la config de session de `server.js`.
2. **Modération** : tu es responsable du contenu (images, musiques) mis en
   ligne par les utilisateurs. Prévois un moyen de supprimer un profil et
   des conditions d'utilisation.
3. **RGPD / données personnelles** : page de confidentialité, possibilité de
   suppression de compte, base hébergée dans l'UE de préférence.
4. **Anti-abus** : limite le nombre d'inscriptions par IP, ajoute un captcha,
   limite la taille totale du stockage. (non inclus — à ajouter selon tes besoins)
5. **Droits d'auteur (musiques)** : les utilisateurs ne doivent uploader que
   des fichiers dont ils ont les droits.
6. **Sauvegardes** : sauvegarde régulièrement `data.db` et `uploads/`.
7. **Stockage externe** recommandé en prod (S3 / Cloudflare R2) au lieu du
   disque local pour les uploads, surtout sur hébergeur éphémère.

---

## 🧩 Idées d'extensions

- Présence Discord « live » (via l'API Lanyard)
- Suppression / réinitialisation de compte
- Badges attribués par un admin
- Domaines personnalisés par utilisateur
- Vérification d'email

Bon hébergement ! 🚀
