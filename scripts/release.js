const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get version from command line argument
const version = process.argv[2];

if (!version) {
  console.error('❌ Please provide a version number (e.g., 0.1.0)');
  process.exit(1);
}

// Validate version format
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('❌ Version must be in format x.y.z (e.g., 0.1.0)');
  process.exit(1);
}

try {
  execSync(`git rev-parse v${version}`, { stdio: 'ignore' });
  console.warn(`⚠️ Tag v${version} already exists. Skipping manual tagging.`);
} catch {
  execSync(`git tag -a v${version} -m "Version ${version}"`, { stdio: 'inherit' });
}

try {
  console.log(`🚀 Releasing v${version}...`);

  // Update root package.json
  const rootPkgPath = path.join(__dirname, '..', 'package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
  rootPkg.version = version;
  fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');

  // Update client
  const clientPkgPath = path.join(__dirname, '..', 'client', 'package.json');
  if (fs.existsSync(clientPkgPath)) {
    const clientPkg = JSON.parse(fs.readFileSync(clientPkgPath, 'utf8'));
    clientPkg.version = version;
    fs.writeFileSync(clientPkgPath, JSON.stringify(clientPkg, null, 2) + '\n');
  }

  // Update server
  const serverPkgPath = path.join(__dirname, '..', 'server', 'package.json');
  if (fs.existsSync(serverPkgPath)) {
    const serverPkg = JSON.parse(fs.readFileSync(serverPkgPath, 'utf8'));
    serverPkg.version = version;
    fs.writeFileSync(serverPkgPath, JSON.stringify(serverPkg, null, 2) + '\n');
  }

  // Generate changelog
  execSync(`npx standard-version --release-as ${version} --no-verify --skip-git --skip-commit --skip-tag`, { stdio: 'inherit' });

  // Commit + tag
  execSync('git add .', { stdio: 'inherit' });
  try {
    execSync(`git commit -m "chore(release): ${version}"`, { stdio: 'inherit' });
  } catch {
    console.warn('ℹ️ Nothing to commit, skipping commit step.');
  }

  execSync(`git tag -a v${version} -m "Version ${version}"`, { stdio: 'inherit' });

  // Push
  execSync('git push --follow-tags origin master', { stdio: 'inherit' });

  // GitHub Release
  execSync(`node scripts/create-github-release.js ${version}`, { stdio: 'inherit' });

  console.log(`\n✅ Successfully released version ${version}`);
} catch (error) {
  console.error('❌ Error during release:', error.message);
  process.exit(1);
}
