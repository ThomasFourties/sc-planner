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

try {
  // Update package.json version
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

  // Create CHANGELOG.md if it doesn't exist
  const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) {
    const defaultChangelog = fs.readFileSync(path.join(__dirname, '..', 'CHANGELOG.md'), 'utf8');
    fs.writeFileSync(changelogPath, defaultChangelog);
  }

  // Run standard-version
  execSync(`npx standard-version --release-as ${version} --no-verify`, { stdio: 'inherit' });

  console.log(`\n✅ Successfully released version ${version}`);
  console.log('\nNext steps:');
  console.log('1. Review the changes in CHANGELOG.md');
  console.log('2. Push the changes and tags:');
  console.log('   git push --follow-tags origin main');
  console.log('3. Create a new release on GitHub with the generated changelog');
} catch (error) {
  console.error('Error during release:', error.message);
  process.exit(1);
} 