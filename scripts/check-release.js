#!/usr/bin/env node

/**
 * Check release status
 */

import { execSync } from 'child_process';

console.log('🔍 Checking release status...\n');

// Check local tags
try {
  const tags = execSync('git tag --sort=-v:refname', { encoding: 'utf8' }).trim();
  console.log('📦 Local tags:');
  if (tags) {
    console.log(tags.split('\n').map(t => `  ${t}`).join('\n'));
  } else {
    console.log('  No tags found');
  }
} catch (error) {
  console.log('  Could not check tags');
}

console.log('\n📊 Package.json version:');
try {
  const version = execSync('node -p "require(\'./package.json\').version"', { encoding: 'utf8' }).trim();
  console.log(`  ${version}`);
} catch (error) {
  console.log('  Could not read package.json');
}

console.log('\n🎯 Next steps:');
console.log('   1. Check GitHub Actions:');
console.log('      https://github.com/venturars/cooperative/actions');
console.log('\n   2. Check Releases:');
console.log('      https://github.com/venturars/cooperative/releases');
console.log('\n   3. If release not created:');
console.log('      - Wait 1-2 minutes');
console.log('      - Check workflow logs');
console.log('      - Ensure package.json version changed');
console.log('\n   4. For next release, use:');
console.log('      ./scripts/release.sh');