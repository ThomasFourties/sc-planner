# Guide du Changelog Automatique 📝

Ce projet utilise un système de changelog automatique basé sur les [Conventional Commits](https://conventionalcommits.org/) et [standard-version](https://github.com/conventional-changelog/standard-version).

## 🎯 Comment ça marche ?

Le changelog est généré automatiquement à partir de vos messages de commit lorsque vous poussez sur la branche `master`. Le système analyse vos commits et :

1. **Détermine automatiquement le type de version** (patch, minor, major)
2. **Génère le changelog** avec les nouvelles fonctionnalités et corrections
3. **Met à jour les versions** dans tous les package.json
4. **Crée un tag Git** et une release GitHub
5. **Pousse les changements** automatiquement

## 📋 Format des commits

Utilisez ces préfixes dans vos messages de commit :

### Types de commits et impact sur la version

| Type | Description | Impact Version | Exemple |
|------|-------------|----------------|---------|
| `feat` | Nouvelle fonctionnalité | **MINOR** (0.1.0 → 0.2.0) | `feat: add user authentication` |
| `fix` | Correction de bug | **PATCH** (0.1.0 → 0.1.1) | `fix: resolve login issue` |
| `feat!` | Breaking change | **MAJOR** (0.1.0 → 1.0.0) | `feat!: redesign API endpoints` |
| `perf` | Amélioration de performance | **PATCH** | `perf: optimize database queries` |
| `refactor` | Refactorisation | **PATCH** | `refactor: restructure user service` |
| `docs` | Documentation | **PATCH** | `docs: update API documentation` |
| `style` | Changements de style/format | **PATCH** | `style: fix code formatting` |
| `test` | Ajout/modification de tests | **PATCH** | `test: add user service tests` |
| `build` | Changements du système de build | **PATCH** | `build: update Docker configuration` |
| `ci` | Changements CI/CD | **PATCH** | `ci: add deployment workflow` |
| `chore` | Tâches de maintenance | **PATCH** | `chore: update dependencies` |

### Exemples de commits bien formatés

```bash
# Nouvelle fonctionnalité (minor bump)
git commit -m "feat: add password reset functionality"

# Correction de bug (patch bump)
git commit -m "fix: resolve email validation issue"

# Breaking change (major bump)
git commit -m "feat!: redesign authentication system"

# Avec scope (optionnel)
git commit -m "feat(auth): add OAuth2 integration"
git commit -m "fix(db): resolve connection timeout"

# Avec description détaillée
git commit -m "feat: add user profile management

- Add profile update endpoint
- Implement avatar upload
- Add profile validation"
```

## 🚀 Utilisation

### Automatique (Recommandé)

1. **Faites vos commits** avec le format conventional :
   ```bash
   git commit -m "feat: add new dashboard feature"
   git commit -m "fix: resolve authentication bug"
   ```

2. **Poussez sur master** :
   ```bash
   git push origin master
   ```

3. **Le système se charge du reste** ! 🎉
   - Analyse vos commits
   - Génère le changelog
   - Crée une nouvelle version
   - Pousse les changements

### Manuel (si nécessaire)

Vous pouvez aussi déclencher manuellement une release :

```bash
# Patch version (0.1.0 → 0.1.1)
npm run version:patch

# Minor version (0.1.0 → 0.2.0)
npm run version:minor

# Major version (0.1.0 → 1.0.0)
npm run version:major

# Ou utiliser directement standard-version
npm run release -- --release-as minor
```

### Via GitHub Actions (Manuel)

1. Allez dans l'onglet **Actions** de votre repo GitHub
2. Sélectionnez **Auto Changelog and Release**
3. Cliquez sur **Run workflow**
4. Choisissez le type de release (patch/minor/major)

## 📊 Que se passe-t-il automatiquement ?

Quand vous poussez sur `master`, le workflow :

1. **Analyse les commits** récents
2. **Détermine la version** :
   - `feat:` → version minor (0.1.0 → 0.2.0)
   - `fix:` → version patch (0.1.0 → 0.1.1)
   - `feat!:` ou `BREAKING CHANGE:` → version major (0.1.0 → 1.0.0)
3. **Met à jour** :
   - `CHANGELOG.md`
   - `package.json` (racine)
   - `client/package.json`
   - `server/package.json`
4. **Crée un tag Git** (ex: `v0.2.0`)
5. **Crée une GitHub Release**
6. **Pousse tout** automatiquement

## ⚙️ Configuration

Les fichiers de configuration :

- `.versionrc.json` : Configuration standard-version
- `scripts/sync-versions.js` : Script de synchronisation des versions
- `.github/workflows/changelog.yml` : Workflow GitHub Actions

## 🔧 Commandes utiles

```bash
# Voir l'historique des versions
git tag --sort=-version:refname | head -10

# Voir les changements depuis le dernier tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline

# Générer le changelog manuellement (sans créer de version)
npm run changelog

# Synchroniser les versions manuellement
npm run sync-versions
```

## 🚫 Éviter les déclenchements automatiques

Si vous voulez pousser sans déclencher le changelog automatique :

```bash
git commit -m "docs: update README [skip ci]"
```

Le `[skip ci]` empêchera le workflow de se déclencher.

## 📝 Bonnes pratiques

1. **Utilisez toujours les conventional commits**
2. **Soyez descriptif** dans vos messages
3. **Groupez vos commits logiquement** avant de pousser
4. **Relisez le changelog généré** et corrigez si nécessaire
5. **Utilisez des scopes** pour organiser (`feat(auth):`, `fix(db):`)

## 🆘 Dépannage

### Le workflow ne se déclenche pas
- Vérifiez que vous êtes sur la branche `master`
- Assurez-vous que le commit ne contient pas `[skip ci]`

### Version incorrecte générée
- Vérifiez le format de vos commits
- Utilisez le workflow manuel pour corriger

### Erreur de permissions
- Vérifiez que `GITHUB_TOKEN` a les permissions nécessaires
- Le token doit pouvoir créer des releases et pousser des tags

---

💡 **Tip** : Ce système encourage les bonnes pratiques de commit et maintient automatiquement un historique propre des changements ! 