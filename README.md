# Morgan Urbes — Portfolio Personnel

Site statique, gratuit à héberger sur GitHub Pages.  
Stack : HTML / CSS / JavaScript vanilla. Aucune dépendance, aucun build requis.

---

## Arborescence

```
morgan-portfolio/
├── index.html        # Structure HTML complète
├── style.css         # Design system, animations, responsive
├── main.js           # Interactions, scroll reveal, parallaxe
└── README.md         # Ce fichier
```

---

## Lancement local

Aucune installation nécessaire.

**Option 1 — Extension VS Code (recommandée)**
1. Installer l'extension **Live Server** dans VS Code
2. Clic droit sur `index.html` → **Open with Live Server**
3. Le site s'ouvre sur `http://localhost:5500`

**Option 2 — Python (si installé)**
```bash
cd morgan-portfolio
python3 -m http.server 5500
# Puis ouvrir http://localhost:5500
```

**Option 3 — Node.js (si installé)**
```bash
cd morgan-portfolio
npx serve .
# Puis ouvrir l'URL affichée dans le terminal
```

> ⚠️ Ne pas ouvrir `index.html` directement dans le navigateur (protocole `file://`) — les fonts Google et certains comportements CSS/JS peuvent différer.

---

## Publication sur GitHub Pages (gratuit)

### 1. Créer un dépôt GitHub
```bash
git init
git add .
git commit -m "feat: initial portfolio"
```

Créer un repo sur https://github.com/new  
Exemple de nom : `portfolio` ou `morgan-urbes.github.io`

```bash
git remote add origin https://github.com/TON_USERNAME/NOM_DU_REPO.git
git branch -M main
git push -u origin main
```

### 2. Activer GitHub Pages
1. Aller dans **Settings** → **Pages**
2. Source : **Deploy from a branch**
3. Branch : `main` — Folder : `/ (root)`
4. Cliquer **Save**

Le site sera accessible à :
- `https://TON_USERNAME.github.io/NOM_DU_REPO/`

> Si le repo s'appelle exactement `TON_USERNAME.github.io`, l'URL sera simplement `https://TON_USERNAME.github.io/`

### 3. Mettre à jour le site
```bash
git add .
git commit -m "update: ..."
git push
```
GitHub Pages se met à jour automatiquement en ~1 minute.

---

## Domaine personnalisé (optionnel — gratuit avec Cloudflare)

1. Acheter un nom de domaine (ex: morganurbes.fr)
2. Dans GitHub Pages Settings → **Custom domain** → saisir le domaine
3. Configurer les DNS chez ton registrar :
   - `A` record → `185.199.108.153` (et les 3 autres IPs GitHub Pages)
   - ou `CNAME` → `TON_USERNAME.github.io`

---

## Personnalisation

### Modifier les informations personnelles
Tout le contenu éditable est dans `index.html` :
- Nom, bio, email, téléphone → Chercher "Morgan" et remplacer
- Liens sociaux → `<a href="#">LinkedIn</a>` → remplacer `#` par les vraies URLs
- Clients / logos → Section `.logos-track`
- Projets → Cards `.project-card`
- Timeline → Section `.timeline`

### Ajouter une vraie image de projet
Remplacer le div `.project-thumb-inner` par :
```html
<img src="assets/images/nom-projet.webp" alt="Description du projet" loading="lazy" />
```

### Couleur d'accent
Dans `style.css`, modifier :
```css
--c-accent: #6C4BF6;       /* violet principal */
--c-accent-light: #8B6EF8; /* violet clair (hover) */
```

---

## Accessibilité

- `prefers-reduced-motion` respecté (toutes les animations désactivées)
- Contraste WCAG AA sur fond sombre et fond clair
- Navigation clavier complète (`:focus-visible`)
- Attributs `aria-label`, `aria-expanded`, `role` sur les éléments interactifs
- Liens d'évitement possibles à ajouter : `<a href="#main" class="skip-link">Aller au contenu</a>`

---

## Performance

- 0 dépendance JavaScript
- Animations CSS uniquement via `transform` et `opacity` (pas de layout thrashing)
- `IntersectionObserver` pour les reveals (lazy, non-bloquant)
- `will-change` appliqué uniquement sur les orbs animés
- Google Fonts avec `display=swap` (non-bloquant)
- Images : utiliser `.webp` avec `loading="lazy"` et `decoding="async"`

---

## Licence

Usage personnel — Morgan Urbes © 2024
