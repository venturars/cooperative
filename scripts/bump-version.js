#!/usr/bin/env node

/**
 * Version Bump Script for Cooperative SDK
 * 
 * This script automatically determines the next version based on commit messages
 * since the last tag and updates package.json.
 * 
 * Usage:
 *   node scripts/bump-version.js [--dry-run] [--version <x.y.z>]
 * 
 * Examples:
 *   node scripts/bump-version.js              # Bump based on commits
 *   node scripts/bump-version.js --dry-run    # Show what would happen
 *   node scripts/bump-version.js --version 0.2.0  # Set specific version
 */

import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const versionIndex = args.indexOf('--version');
const customVersion = versionIndex !== -1 ? args[versionIndex + 1] : null;

function runCommand(cmd) {
  try {
    return execSync(cmd, { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Error running command: ${cmd}`);
    console.error(error.message);
    process.exit(1);
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync(join(rootDir, 'package.json'), 'utf8'));
  return packageJson.version;
}

function getLatestTag() {
  try {
    const tags = runCommand('git tag --sort=-v:refname');
    const versionTags = tags.split('\n').filter(tag => /^v\d+\.\d+\.\d+$/.test(tag));
    return versionTags[0] || null;
  } catch (error) {
    return null;
  }
}

function getCommitsSinceTag(tag) {
  if (!tag) {
    // If no tag, get all commits
    return runCommand('git log --pretty=format:"%s" --reverse').split('\n');
  }
  
  return runCommand(`git log --pretty=format:"%s" ${tag}..HEAD`).split('\n');
}

function determineBumpType(commits) {
  let bumpType = 'patch'; // Default to patch
  
  for (const commit of commits) {
    const message = commit.toLowerCase();
    
    // Check for breaking changes
    if (message.includes('breaking change') || /^[a-z]+(\([^)]+\))?!:/i.test(commit)) {
      return 'major';
    }
    
    // Check for features
    if (/^feat(\([^)]+\))?:/i.test(commit)) {
      bumpType = 'minor';
    }
    
    // Fixes, docs, chore, etc. keep as patch
  }
  
  return bumpType;
}

function calculateNextVersion(currentVersion, bumpType) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${bumpType}`);
  }
}

function updatePackageJson(newVersion) {
  const packagePath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const oldVersion = packageJson.version;
  packageJson.version = newVersion;
  
  if (!dryRun) {
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  }
  
  return { oldVersion, newVersion };
}

function displayCommitAnalysis(commits, latestTag) {
  console.log('\n📊 Commit Analysis:');
  console.log(`Latest tag: ${latestTag || 'No tags found'}`);
  console.log(`Commits since tag: ${commits.length}`);
  
  if (commits.length === 0) {
    console.log('No commits since last tag.');
    return;
  }
  
  const features = commits.filter(c => /^feat(\([^)]+\))?:/i.test(c));
  const fixes = commits.filter(c => /^fix(\([^)]+\))?:/i.test(c));
  const docs = commits.filter(c => /^docs(\([^)]+\))?:/i.test(c));
  const chore = commits.filter(c => /^chore(\([^)]+\))?:/i.test(c));
  const breaking = commits.filter(c => 
    c.toLowerCase().includes('breaking change') || /^[a-z]+(\([^)]+\))?!:/i.test(c)
  );
  
  console.log('\n📈 Breakdown:');
  if (breaking.length > 0) console.log(`  Breaking changes: ${breaking.length}`);
  if (features.length > 0) console.log(`  Features: ${features.length}`);
  if (fixes.length > 0) console.log(`  Fixes: ${fixes.length}`);
  if (docs.length > 0) console.log(`  Documentation: ${docs.length}`);
  if (chore.length > 0) console.log(`  Maintenance: ${chore.length}`);
  
  console.log('\n📝 Recent commits:');
  commits.slice(-5).forEach((commit, i) => {
    console.log(`  ${commits.length - 4 + i}. ${commit}`);
  });
}

function main() {
  console.log('🚀 Cooperative SDK - Version Bump Script\n');
  
  // Get current state
  const currentVersion = getCurrentVersion();
  const latestTag = getLatestTag();
  const commits = getCommitsSinceTag(latestTag);
  
  // Display analysis
  displayCommitAnalysis(commits, latestTag);
  
  // Determine next version
  let newVersion;
  let bumpType;
  
  if (customVersion) {
    // Use custom version if provided
    if (!/^\d+\.\d+\.\d+$/.test(customVersion)) {
      console.error(`❌ Invalid version format: ${customVersion}`);
      console.error('   Use format: x.y.z (e.g., 0.1.0)');
      process.exit(1);
    }
    newVersion = customVersion;
    bumpType = 'custom';
  } else {
    // Determine bump type from commits
    bumpType = determineBumpType(commits);
    newVersion = calculateNextVersion(currentVersion, bumpType);
  }
  
  console.log(`\n🎯 Version Decision:`);
  console.log(`   Current: ${currentVersion}`);
  console.log(`   Bump type: ${bumpType}`);
  console.log(`   Next: ${newVersion}`);
  
  if (currentVersion === newVersion && !customVersion) {
    console.log('\n⚠️  No version bump needed.');
    console.log('   No significant changes detected since last release.');
    return;
  }
  
  // Update package.json
  const { oldVersion, newVersion: finalVersion } = updatePackageJson(newVersion);
  
  console.log(`\n${dryRun ? '📋 DRY RUN - Would update:' : '✅ Updated:'}`);
  console.log(`   package.json: ${oldVersion} → ${finalVersion}`);
  
  if (!dryRun) {
    console.log('\n📋 Next steps:');
    console.log('   1. Commit the version change:');
    console.log(`      git add package.json`);
    console.log(`      git commit -m "chore: bump version to ${finalVersion}"`);
    console.log('\n   2. Merge to main for release:');
    console.log(`      git checkout main`);
    console.log(`      git merge develop`);
    console.log(`      git push origin main`);
    console.log('\n   3. GitHub Actions will create release v' + finalVersion);
  } else {
    console.log('\n💡 Run without --dry-run to apply changes.');
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { determineBumpType, calculateNextVersion };