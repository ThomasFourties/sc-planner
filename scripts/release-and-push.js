const { execSync } = require('child_process');

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
  // Run release script
  console.log(`🚀 Creating release ${version}...`);
  execSync(`pnpm release ${version}`, { stdio: 'inherit' });

  // Push changes and tags
  console.log('\n📤 Pushing changes and tags...');
  execSync('git push --follow-tags origin master', { stdio: 'inherit' });

  console.log(`\n✅ Successfully released and pushed version ${version}`);
} catch (error) {
  console.error('Error during release and push:', error.message);
  process.exit(1);
} 