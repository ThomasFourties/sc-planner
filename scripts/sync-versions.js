const fs = require('fs');
const path = require('path');

// Read package.json to get the current version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

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

console.log(`✅ Synchronized version ${version} across all package.json files`); 