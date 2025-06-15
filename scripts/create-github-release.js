const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'ThomasFourties';
const REPO_NAME = 'sc-planner';

if (!GITHUB_TOKEN) {
  console.error('Please set GITHUB_TOKEN environment variable');
  process.exit(1);
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

async function createRelease(version) {
  try {
    // Read CHANGELOG.md
    const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
    const changelog = fs.readFileSync(changelogPath, 'utf8');

    // Extract the section for this version
    // const versionRegex = new RegExp(`## \\[${version}\\] - [\\d-]+\\n\\n([\\s\\S]*?)(?=\\n## |$)`);
    const versionRegex = new RegExp(`### \\[${version}\\].*?\\n+([\\s\\S]*?)(?=\\n### |$)`);
    const match = changelog.match(versionRegex);

    if (!match) {
      console.error(`Could not find changelog section for version ${version}`);
      process.exit(1);
    }

    const releaseNotes = match[1].trim();

    // Create the release
    const response = await octokit.repos.createRelease({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      tag_name: `v${version}`,
      name: `Version ${version}`,
      body: releaseNotes,
      draft: false,
      prerelease: false
    });

    console.log(`✅ Successfully created GitHub release for version ${version}`);
    console.log(`🔗 Release URL: ${response.data.html_url}`);
  } catch (error) {
    console.error('Error creating GitHub release:', error.message);
    process.exit(1);
  }
}

// Get version from command line argument
const version = process.argv[2];

if (!version) {
  console.error('Please provide a version number (e.g., 0.1.0)');
  process.exit(1);
}

createRelease(version); 