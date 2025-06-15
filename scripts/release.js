const { execSync } = require('child_process');
const fs = require('fs');
const { Octokit } = require('@octokit/rest');

// Get version from CLI
const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('❌ Provide a valid version: x.y.z');
  process.exit(1);
}

// Check if tag exists
try {
  execSync(`git rev-parse v${version}`, { stdio: 'ignore' });
  console.error(`❌ Tag v${version} already exists`);
  process.exit(1);
} catch { }

// Run standard-version
try {
  execSync(`npx standard-version --release-as ${version} --no-verify`, { stdio: 'inherit' });
  console.log(`\n✅ Successfully released version ${version}`);
} catch (err) {
  console.error('❌ Release failed during standard-version:', err.message);
  process.exit(1);
}

// Extract release notes from CHANGELOG.md
const getReleaseNotes = () => {
  const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');
  const match = changelog.match(new RegExp(`##+ \\[?${version}\\]?([\\s\\S]*?)(?=\\n##+ |\\n*$)`));
  return match ? match[1].trim() : '⚠️ No changelog entry found.';
};

// Push to GitHub & create release
const createGitHubRelease = async () => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ GITHUB_TOKEN is missing');
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token });

  try {
    await octokit.repos.createRelease({
      owner: 'ThomasFourties',
      repo: 'sc-planner',
      tag_name: `v${version}`,
      name: `v${version}`,
      body: getReleaseNotes(),
      draft: false,
      prerelease: false
    });

    console.log(`✅ GitHub release v${version} created`);
  } catch (err) {
    console.error('❌ GitHub release failed:', err.message);
    process.exit(1);
  }
};

// Push to GitHub & create release
createGitHubRelease();
