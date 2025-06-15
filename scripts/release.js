const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Fonction pour créer la release
function createRelease() {
  console.log('🚀 Création de la release...');
  execGitCommand('npx standard-version');
}

// Fonction pour pousser les changements
function pushChanges() {
  console.log('📤 Push des changements...');
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