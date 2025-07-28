#!/bin/bash

# Package Version Consistency Validator
# This script validates that package versions are consistent across the monorepo

echo "🔍 Validating package version consistency..."

# Define expected versions
EXPECTED_TYPESCRIPT="5.8.3"
EXPECTED_NODE_TYPES="^22.15.3" 
EXPECTED_REACT_TYPES="19.1.0"
EXPECTED_REACT_DOM_TYPES="19.1.1"
EXPECTED_VITEST="^2.0.0"
EXPECTED_TSUP="^8.0.0"
EXPECTED_ESLINT="^9.31.0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

# Function to check package version
check_version() {
    local file=$1
    local package_name=$2
    local expected_version=$3
    local section=$4
    local package_dir=$(basename $(dirname $file))
    
    if grep -q "\"$package_name\":" "$file"; then
        local actual_version=$(grep -A 20 "\"$section\":" "$file" | grep "\"$package_name\":" | sed 's/.*": *"\([^"]*\)".*/\1/')
        if [ "$actual_version" != "$expected_version" ]; then
            echo -e "${RED}❌ $package_dir: $package_name expected $expected_version, got $actual_version${NC}"
            errors=$((errors + 1))
        else
            echo -e "${GREEN}✅ $package_dir: $package_name version correct${NC}"
        fi
    fi
}

echo "📋 Checking package versions against standards:"
echo "  TypeScript: $EXPECTED_TYPESCRIPT"
echo "  @types/node: $EXPECTED_NODE_TYPES"
echo "  @types/react: $EXPECTED_REACT_TYPES"
echo "  @types/react-dom: $EXPECTED_REACT_DOM_TYPES"
echo "  vitest: $EXPECTED_VITEST"
echo "  tsup: $EXPECTED_TSUP"
echo "  eslint: $EXPECTED_ESLINT"
echo ""

# Check TypeScript versions
echo "🔧 Checking TypeScript versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    check_version "$file" "typescript" "$EXPECTED_TYPESCRIPT" "devDependencies"
done

echo ""
echo "🔧 Checking @types/node versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    check_version "$file" "@types/node" "$EXPECTED_NODE_TYPES" "devDependencies"
done

echo ""
echo "🔧 Checking @types/react versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    check_version "$file" "@types/react" "$EXPECTED_REACT_TYPES" "devDependencies"
done

echo ""
echo "🔧 Checking @types/react-dom versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    check_version "$file" "@types/react-dom" "$EXPECTED_REACT_DOM_TYPES" "devDependencies"
done

echo ""
echo "🔧 Checking vitest versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    check_version "$file" "vitest" "$EXPECTED_VITEST" "devDependencies"
done

echo ""
echo "🔧 Checking tsup versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    check_version "$file" "tsup" "$EXPECTED_TSUP" "devDependencies"
done

echo ""
echo "🔧 Checking eslint versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    check_version "$file" "eslint" "$EXPECTED_ESLINT" "devDependencies"
done

echo ""
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ All package versions are consistent!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $errors version inconsistencies. Please fix them before proceeding.${NC}"
    echo -e "${YELLOW}💡 Run 'scripts/fix-package-versions.sh' to automatically fix these issues.${NC}"
    exit 1
fi
