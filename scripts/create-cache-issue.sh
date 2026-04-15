#!/bin/bash

# Script to create GitHub issue for cache system implementation
# Requires: gh CLI installed and authenticated

set -e

echo "🚀 Creating GitHub issue for cache system implementation..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Install from: https://cli.github.com/"
    echo "   Then run: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "   Run: gh auth login"
    exit 1
fi

# Create issue from template
ISSUE_TITLE="feat: Add caching system to SDK"
ISSUE_BODY=$(cat << 'EOF'
## 🚀 Feature Request: Caching System for Cooperative SDK

### 📋 Problem Statement
The SDK currently makes direct API calls for every operation (token balances, swap quotes, etc.), which can lead to:
- **Redundant API calls** for the same data
- **Increased latency** for users
- **Unnecessary rate limiting** hits
- **Poor offline/network-issue resilience**

### 🎯 Goals
1. **Reduce API calls** by caching frequently accessed data
2. **Improve response times** for repeated operations
3. **Add offline capability** for cached data
4. **Maintain data freshness** with smart invalidation
5. **Keep API transparent** - caching should be opt-out, not breaking

### 🔧 Proposed Solution
Implement a layered caching system with memory cache (LRU, short TTL) and persistent cache (LocalStorage/IndexedDB/filesystem) using SWR (Stale-While-Revalidate) strategy.

### 📊 Expected Benefits
- **50-90% reduction** in API calls for common operations
- **Sub-100ms response times** for cached data
- **Offline capability** for previously fetched data
- **Better rate limit management**

### 🏗️ Implementation Plan
**Phase 1**: Basic memory cache + token operations integration  
**Phase 2**: Persistent storage + swap operations integration  
**Phase 3**: Advanced features (analytics, predictive caching, offline mode)

### ✅ Acceptance Criteria
- [ ] 50%+ API call reduction for common operations
- [ ] No breaking API changes
- [ ] Configurable cache strategies
- [ ] >90% test coverage
- [ ] Complete documentation

**Full specification**: See `.github/ISSUE_TEMPLATE/cache-system.md`
EOF
)

echo "📝 Creating issue: $ISSUE_TITLE"
echo "📋 Using repository: venturars/cooperative"

# Create the issue
gh issue create \
  --title "$ISSUE_TITLE" \
  --body "$ISSUE_BODY" \
  --label "enhancement" \
  --label "performance" \
  --label "good first issue" \
  --assignee "@me"

echo "✅ Issue created successfully!"
echo "🔗 Check: https://github.com/venturars/cooperative/issues"