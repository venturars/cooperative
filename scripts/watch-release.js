#!/usr/bin/env node

/**
 * Watch release status
 */

import { execSync } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('👀 Watching release status...\n');
console.log('Workflow fix applied: Added pnpm installation');
console.log('Triggered with commit: chore: trigger release workflow with pnpm fix');
console.log('Expected: Release v0.2.0 should be created\n');

let attempts = 0;
const maxAttempts = 12; // 2 minutes (10 seconds each)

async function checkStatus() {
  attempts++;
  
  console.log(`\n📊 Check #${attempts} (${new Date().toLocaleTimeString()})`);
  
  try {
    // Check local tags
    const tags = execSync('git tag --sort=-v:refname', { encoding: 'utf8' }).trim();
    console.log('🏷️  Local tags:');
    if (tags) {
      const tagList = tags.split('\n');
      tagList.forEach(tag => {
        console.log(`  ${tag}`);
      });
      
      // Check if v0.2.0 exists
      if (tagList.includes('v0.2.0')) {
        console.log('\n🎉 SUCCESS: v0.2.0 tag created!');
        console.log('✅ Release should be on GitHub:');
        console.log('   https://github.com/venturars/cooperative/releases');
        return true;
      }
    } else {
      console.log('  No new tags yet');
    }
    
    // Check package version
    const version = execSync('node -p "require(\'./package.json\').version"', { encoding: 'utf8' }).trim();
    console.log(`📦 Package version: ${version}`);
    
    if (attempts >= maxAttempts) {
      console.log('\n⏰ Timeout: Workflow may have failed');
      console.log('🔍 Check GitHub Actions:');
      console.log('   https://github.com/venturars/cooperative/actions');
      console.log('\n⚠️  Possible issues:');
      console.log('   - Workflow still failing');
      console.log('   - Permissions issue');
      console.log('   - Network delay');
      return false;
    }
    
    return false;
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('⏳ Waiting for workflow to complete...');
  console.log('(Checking every 10 seconds for 2 minutes)\n');
  
  for (let i = 0; i < maxAttempts; i++) {
    const success = await checkStatus();
    if (success) {
      process.exit(0);
    }
    
    if (i < maxAttempts - 1) {
      await setTimeout(10000); // Wait 10 seconds
    }
  }
  
  console.log('\n🔍 Manual checks needed:');
  console.log('1. GitHub Actions: https://github.com/venturars/cooperative/actions');
  console.log('2. Look for "Release" workflow');
  console.log('3. Check logs for errors');
  console.log('4. Verify pnpm is installed correctly');
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}