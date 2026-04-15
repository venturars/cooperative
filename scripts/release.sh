#!/bin/bash

# Release script for Cooperative SDK
# Automates the entire release process

set -e  # Exit on error

echo "🚀 Cooperative SDK Release Script"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're on develop branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
    echo -e "${YELLOW}⚠️  Warning: Not on develop branch (currently on $CURRENT_BRANCH)${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

# Step 1: Run tests
echo -e "\n1. ${GREEN}Running tests...${NC}"
pnpm test || {
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
}

# Step 2: Build package
echo -e "\n2. ${GREEN}Building package...${NC}"
pnpm build || {
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
}

# Step 3: Bump version
echo -e "\n3. ${GREEN}Bumping version...${NC}"
pnpm run version:bump || {
    echo -e "${RED}❌ Version bump failed${NC}"
    exit 1
}

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "   New version: ${YELLOW}$NEW_VERSION${NC}"

# Step 4: Commit version change
echo -e "\n4. ${GREEN}Committing version change...${NC}"
git add package.json
git commit -m "chore: bump version to $NEW_VERSION" || {
    echo -e "${RED}❌ Commit failed${NC}"
    exit 1
}

# Step 5: Push to develop
echo -e "\n5. ${GREEN}Pushing to develop...${NC}"
git push origin develop || {
    echo -e "${RED}❌ Push to develop failed${NC}"
    exit 1
}

# Step 6: Merge to main
echo -e "\n6. ${GREEN}Merging to main...${NC}"
git checkout main || {
    echo -e "${RED}❌ Checkout main failed${NC}"
    exit 1
}

git pull origin main || {
    echo -e "${YELLOW}⚠️  Could not pull main, continuing...${NC}"
}

git merge develop || {
    echo -e "${RED}❌ Merge failed${NC}"
    exit 1
}

# Step 7: Push to main (triggers GitHub Actions)
echo -e "\n7. ${GREEN}Pushing to main (triggers release)...${NC}"
git push origin main || {
    echo -e "${RED}❌ Push to main failed${NC}"
    exit 1
}

# Step 8: Go back to develop
echo -e "\n8. ${GREEN}Returning to develop...${NC}"
git checkout develop || {
    echo -e "${YELLOW}⚠️  Could not checkout develop${NC}"
}

# Summary
echo -e "\n${GREEN}✅ Release process started!${NC}"
echo -e "\n📋 What happened:"
echo "   1. Tests passed"
echo "   2. Package built"
echo "   3. Version bumped to $NEW_VERSION"
echo "   4. Changes committed to develop"
echo "   5. develop pushed to remote"
echo "   6. develop merged to main"
echo "   7. main pushed (triggers GitHub Actions)"
echo -e "\n🎯 Next:"
echo "   - GitHub Actions will create release v$NEW_VERSION"
echo "   - Check: https://github.com/venturars/cooperative/actions"
echo "   - Release: https://github.com/venturars/cooperative/releases"
echo -e "\n⏳ The release should be ready in 1-2 minutes."

# Optional: Open browser to check
read -p "Open GitHub Actions page? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "https://github.com/venturars/cooperative/actions"
fi