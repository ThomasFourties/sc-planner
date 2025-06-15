const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Obtenir le chemin absolu de la racine du projet
const rootDir = path.resolve(__dirname, '..');

// Fonction pour exécuter une commande git
function execGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Fonction pour vérifier si nous sommes sur la branche master
function checkMasterBranch() {
  const currentBranch = execGitCommand('git rev-parse --abbrev-ref HEAD');
  if (currentBranch !== 'master') {
    console.error('❌ Vous devez être sur la branche master pour créer une release');
    process.exit(1);
  }
}

// Fonction pour vérifier si le working directory est clean
function checkWorkingDirectory() {
  const status = execGitCommand('git status --porcelain');
  if (status) {
    console.error('❌ Le working directory n\'est pas clean. Committez ou stashez vos changements.');
    process.exit(1);
  }
}

// Fonction pour récupérer les derniers changements
function pullLatestChanges() {
  console.log('📥 Récupération des derniers changements...');
  execGitCommand('git pull origin master');
}

// Fonction pour analyser les commits et déterminer la version
function analyzeCommits() {
  console.log('🔍 Analyse des commits...');
  let commits;
  
  // Vérifier si des tags existent
  const tags = execGitCommand('git tag -l').split('\n').filter(tag => tag);
  
  if (tags.length === 0) {
    // Si aucun tag n'existe, on prend tous les commits
    commits = execGitCommand('git log --pretty=format:"%s"').split('\n');
  } else {
    // Si des tags existent, on prend les commits depuis le dernier tag
    const lastTag = tags[tags.length - 1];
    commits = execGitCommand(`git log ${lastTag}..HEAD --pretty=format:"%s"`).split('\n');
  }
  
  let major = false;
  let minor = false;
  let patch = false;

  commits.forEach(commit => {
    if (commit.includes('BREAKING CHANGE') || commit.startsWith('feat!:')) {
      major = true;
    } else if (commit.startsWith('feat:')) {
      minor = true;
    } else if (commit.startsWith('fix:')) {
      patch = true;
    }
  });

  return { major, minor, patch };
}

// Fonction pour mettre à jour la version
function updateVersion() {
  console.log('📝 Mise à jour de la version...');
  const { major, minor, patch } = analyzeCommits();
  
  // Lire la version actuelle
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const [x, y, z] = packageJson.version.split('.').map(Number);
  
  // Calculer la nouvelle version
  let newVersion;
  if (major) {
    newVersion = `${x + 1}.0.0`;
  } else if (minor) {
    newVersion = `${x}.${y + 1}.0`;
  } else if (patch) {
    newVersion = `${x}.${y}.${z + 1}`;
  } else {
    newVersion = packageJson.version;
  }
  
  // Mettre à jour les fichiers package.json
  packageJson.version = newVersion;
  fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n');
  
  // Mettre à jour les autres package.json
  const clientPackage = JSON.parse(fs.readFileSync(path.join(rootDir, 'client/package.json'), 'utf8'));
  clientPackage.version = newVersion;
  fs.writeFileSync(path.join(rootDir, 'client/package.json'), JSON.stringify(clientPackage, null, 2) + '\n');
  
  const serverPackage = JSON.parse(fs.readFileSync(path.join(rootDir, 'server/package.json'), 'utf8'));
  serverPackage.version = newVersion;
  fs.writeFileSync(path.join(rootDir, 'server/package.json'), JSON.stringify(serverPackage, null, 2) + '\n');
  
  return newVersion;
}

// Fonction pour mettre à jour le changelog
function updateChangelog() {
  console.log('📝 Mise à jour du changelog...');
  const lastTag = execGitCommand('git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"');
  const commits = execGitCommand(`git log ${lastTag}..HEAD --pretty=format:"%s"`).split('\n');
  
  let changelog = fs.readFileSync(path.join(rootDir, 'CHANGELOG.md'), 'utf8');
  const version = require(path.join(rootDir, 'package.json')).version;
  
  const newEntry = `## [${version}] - ${new Date().toISOString().split('T')[0]}\n\n`;
  const changes = commits.map(commit => `- ${commit}`).join('\n');
  
  changelog = changelog.replace('# Changelog', `# Changelog\n\n${newEntry}${changes}\n`);
  fs.writeFileSync(path.join(rootDir, 'CHANGELOG.md'), changelog);
}

// Fonction pour créer la release
function createRelease() {
  console.log('🚀 Création de la release...');
  try {
    const newVersion = updateVersion();
    updateChangelog();
    
    // Faire le commit
    execGitCommand('git add .');
    execGitCommand(`git commit -m "chore(release): ${newVersion}"`);
    
    // Créer le tag
    execGitCommand(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
  } catch (error) {
    console.error('❌ Erreur lors de la création de la release');
    console.error(error.message);
    process.exit(1);
  }
}

// Fonction pour pousser les changements
function pushChanges() {
  console.log('📤 Push des changements...');
  execGitCommand('git push origin master');
  execGitCommand('git push --follow-tags origin master');
}

// Fonction principale
function main() {
  console.log('🎯 Démarrage du processus de release...');
  
  // Vérifications
  checkMasterBranch();
  checkWorkingDirectory();
  
  // Processus de release
  pullLatestChanges();
  createRelease();
  pushChanges();
  
  console.log('✅ Release terminée avec succès!');
}

main(); 