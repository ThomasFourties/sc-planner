const { execSync } = require('child_process');

// Get version from CLI
const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('❌ Provide a valid version: x.y.z');
  process.exit(1);
}

try {
  execSync(`git rev-parse v${version}`, { stdio: 'ignore' });
  console.error(`❌ Tag v${version} already exists`);
  process.exit(1);
} catch { }

try {
  // Run standard-version with multi-package bumping
  execSync(`npx standard-version --release-as ${version} --no-verify`, { stdio: 'inherit' });

  console.log(`\n✅ Successfully released version ${version}`);
  console.log('\nNext steps:');
  console.log('1. Review CHANGELOG.md');
  console.log('2. git push --follow-tags origin master');
} catch (error) {
  console.error('❌ Release failed:', error.message);
  process.exit(1);
}
