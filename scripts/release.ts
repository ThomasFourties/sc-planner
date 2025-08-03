import { execSync } from 'child_process';
import fs from 'fs';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('❌ Usage: pnpm release <version>');
  console.error('   Example: pnpm release 1.0.0');
  process.exit(1);
}

console.log(`🚀 Starting release process for version ${version}...`);

// Vérifier l'état du git
const checkGitStatus = () => {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.error(
        '❌ Working directory is not clean. Commit your changes first.'
      );
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Failed to check git status:', err.message);
    process.exit(1);
  }
};

// Vérifier si on est sur master
const checkBranch = () => {
  try {
    const branch = execSync('git branch --show-current', {
      encoding: 'utf8',
    }).trim();
    if (branch !== 'master' && branch !== 'main') {
      console.error(`❌ You must be on master/main branch. Current: ${branch}`);
      process.exit(1);
    }
    console.log(`✅ On ${branch} branch`);
  } catch (err) {
    console.error('❌ Failed to check current branch:', err.message);
    process.exit(1);
  }
};

// Vérifier si le tag existe déjà
const checkTag = () => {
  try {
    execSync(`git rev-parse v${version}`, { stdio: 'ignore' });
    console.error(`❌ Tag v${version} already exists`);
    process.exit(1);
  } catch {
    console.log(`✅ Tag v${version} is available`);
  }
};

// Exécuter standard-version
const runStandardVersion = () => {
  try {
    console.log('📝 Running standard-version...');
    execSync(`npx standard-version --release-as ${version} --no-verify`, {
      stdio: 'inherit',
    });
    console.log(`✅ Standard-version completed for ${version}`);
  } catch (err) {
    console.error('❌ Standard-version failed:', err.message);
    process.exit(1);
  }
};

// Extraire les notes de release
const getReleaseNotes = () => {
  try {
    const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');
    const match = changelog.match(
      new RegExp(`##+ \\[?${version}\\]?([\\s\\S]*?)(?=\\n##+ |\\n*$)`)
    );
    return match ? match[1].trim() : '⚠️ No changelog entry found.';
  } catch (err) {
    console.warn('⚠️ Could not read CHANGELOG.md');
    return 'Release notes not available.';
  }
};

// Créer la release GitHub
const createGitHubRelease = async () => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    console.error('   Set it in your .env or export GITHUB_TOKEN=your_token');
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token });

  try {
    console.log('🐙 Creating GitHub release...');
    await octokit.repos.createRelease({
      owner: 'ThomasFourties',
      repo: 'sc-planner',
      tag_name: `v${version}`,
      name: `v${version}`,
      body: getReleaseNotes(),
      draft: false,
      prerelease: false,
    });
    console.log(`✅ GitHub release v${version} created`);
  } catch (err) {
    console.error('❌ GitHub release failed:', err.message);
    process.exit(1);
  }
};

// Pousser les tags
const pushTags = () => {
  try {
    console.log('📤 Pushing tags to origin...');
    execSync('git push origin master --follow-tags', { stdio: 'inherit' });
    console.log('✅ Tags pushed successfully');
  } catch (err) {
    console.error('❌ Failed to push tags:', err.message);
    process.exit(1);
  }
};

// Processus principal
const main = async () => {
  console.log('🔍 Pre-flight checks...');
  checkGitStatus();
  checkBranch();
  checkTag();

  console.log('\n📝 Creating release...');
  runStandardVersion();

  console.log('\n🐙 Creating GitHub release...');
  await createGitHubRelease();

  console.log('\n📤 Pushing to GitHub...');
  pushTags();

  console.log('\n🎉 Release process completed!');
  console.log(`   Version: v${version}`);
  console.log(`   GitHub Actions will now build and deploy automatically.`);
  console.log(
    `   Monitor: https://github.com/ThomasFourties/sc-planner/actions`
  );
};

main().catch((err) => {
  console.error('❌ Release failed:', err.message);
  process.exit(1);
});
