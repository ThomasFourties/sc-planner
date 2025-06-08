#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to synchronize version numbers across all package.json files
 */

// Get the version from the root package.json
const rootPackagePath = path.join(__dirname, '..', 'package.json');
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
const newVersion = rootPackage.version;

console.log(`🔄 Synchronizing version to ${newVersion}...`);

// List of package.json files to update
const packagePaths = [
  path.join(__dirname, '..', 'client', 'package.json'),
  path.join(__dirname, '..', 'server', 'package.json')
];

let updatedCount = 0;

packagePaths.forEach((packagePath) => {
  if (fs.existsSync(packagePath)) {
    try {
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const oldVersion = packageContent.version;
      
      if (oldVersion !== newVersion) {
        packageContent.version = newVersion;
        fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2) + '\n');
        console.log(`✅ Updated ${path.relative(process.cwd(), packagePath)}: ${oldVersion} → ${newVersion}`);
        updatedCount++;
      } else {
        console.log(`ℹ️  ${path.relative(process.cwd(), packagePath)} already at version ${newVersion}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${packagePath}:`, error.message);
    }
  } else {
    console.log(`⚠️  Package file not found: ${packagePath}`);
  }
});

console.log(`\n🎉 Version synchronization complete! Updated ${updatedCount} files.`); 