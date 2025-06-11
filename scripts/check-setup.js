#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Vérification de la configuration du changelog...\n');

const checks = [
  {
    name: 'Fichier CHANGELOG.md',
    test: () => fs.existsSync('CHANGELOG.md'),
    message: 'CHANGELOG.md existe'
  },
  {
    name: 'Configuration .versionrc.json',
    test: () => fs.existsSync('.versionrc.json'),
    message: 'Configuration standard-version trouvée'
  },
  {
    name: 'Script sync-versions',
    test: () => fs.existsSync('scripts/sync-versions.js'),
    message: 'Script de synchronisation des versions présent'
  },
  {
    name: 'Workflow GitHub Actions',
    test: () => fs.existsSync('.github/workflows/changelog.yml'),
    message: 'Workflow GitHub Actions configuré'
  },
  {
    name: 'Template Git',
    test: () => fs.existsSync('.gitmessage'),
    message: 'Template de commit Git présent'
  },
  {
    name: 'Versions synchronisées',
    test: () => {
      try {
        const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const clientPkg = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
        const serverPkg = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
        
        return rootPkg.version === clientPkg.version && 
               rootPkg.version === serverPkg.version;
      } catch (e) {
        return false;
      }
    },
    message: 'Toutes les versions sont synchronisées'
  },
  {
    name: 'Git configuré',
    test: () => {
      try {
        const template = execSync('git config commit.template', { encoding: 'utf8' }).trim();
        return template.includes('.gitmessage');
      } catch (e) {
        return false;
      }
    },
    message: 'Template Git configuré (lancez `npm run setup` si nécessaire)'
  }
];

let allGood = true;

checks.forEach(check => {
  const result = check.test();
  const icon = result ? '✅' : '❌';
  const status = result ? 'OK' : 'ERREUR';
  
  console.log(`${icon} ${check.name}: ${status}`);
  if (result) {
    console.log(`   → ${check.message}`);
  }
  
  if (!result) allGood = false;
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Tout est configuré correctement !');
  console.log('\n💡 Prochaines étapes:');
  console.log('   1. Committez avec le format: feat: add changelog system');
  console.log('   2. Poussez sur master pour tester l\'automation');
  console.log('   3. Consultez docs/CHANGELOG_GUIDE.md pour plus d\'infos');
} else {
  console.log('⚠️  Certaines vérifications ont échoué.');
  console.log('   Lancez `npm run setup` pour configurer Git');
  console.log('   Vérifiez que tous les fichiers sont présents');
}

console.log('\n📚 Documentation: docs/CHANGELOG_GUIDE.md'); 