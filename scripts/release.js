const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get version from command line argument
const version = process.argv[2];

if (!version) {
  console.error('Please provide a version number (e.g., 0.1.0)');
  process.exit(1);
}

// Validate version format
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Version must be in format x.y.z (e.g., 0.1.0)');
  process.exit(1);
}

// Check if tag already exists
try {
  execSync(`git rev-parse v${version}`, { stdio: 'ignore' });
  console.error(`❌ Tag v${version} already exists. Please use a different version.`);
  process.exit(1);
} catch (error) {
  // Tag doesn't exist, continue with release
}

try {
  // Update root package.json version
  const rootPackageJsonPath = path.join(__dirname, '..', 'package.json');
  const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
  rootPackageJson.version = version;
  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2) + '\n');

  // Update version in client/package.json if it exists
  const clientPackageJsonPath = path.join(__dirname, '..', 'client', 'package.json');
  if (fs.existsSync(clientPackageJsonPath)) {
    const clientPackageJson = JSON.parse(fs.readFileSync(clientPackageJsonPath, 'utf8'));
    clientPackageJson.version = version;
    fs.writeFileSync(clientPackageJsonPath, JSON.stringify(clientPackageJson, null, 2) + '\n');
  }

  // Update version in server/package.json if it exists
  const serverPackageJsonPath = path.join(__dirname, '..', 'server', 'package.json');
  if (fs.existsSync(serverPackageJsonPath)) {
    const serverPackageJson = JSON.parse(fs.readFileSync(serverPackageJsonPath, 'utf8'));
    serverPackageJson.version = version;
    fs.writeFileSync(serverPackageJsonPath, JSON.stringify(serverPackageJson, null, 2) + '\n');
  }

  // Run standard-version
  execSync(`npx standard-version --release-as ${version} --no-verify`, { stdio: 'inherit' });

  console.log(`\n✅ Successfully released version ${version}`);
  console.log('\nNext steps:');
  console.log('1. Review the changes in CHANGELOG.md');
  console.log('2. Push the changes and tags:');
  console.log('   git push --follow-tags origin master');
} catch (error) {
  console.error('Error during release:', error.message);
  process.exit(1);
}
