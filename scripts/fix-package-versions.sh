#!/bin/bash

# Package Version Consistency Check and Fix Script
# This script identifies and fixes version inconsistencies across the monorepo

echo "🔍 Checking package version consistency across monorepo..."

# Define consistent versions
TYPESCRIPT_VERSION="5.8.3"
NODE_TYPES_VERSION="22.15.3"
REACT_TYPES_VERSION="19.1.0"
REACT_DOM_TYPES_VERSION="19.1.1"
VITEST_VERSION="2.0.0"
TSUP_VERSION="8.0.0"
ESLINT_VERSION="9.31.0"

echo "📋 Standard versions to be used:"
echo "  TypeScript: $TYPESCRIPT_VERSION"
echo "  @types/node: $NODE_TYPES_VERSION"
echo "  @types/react: $REACT_TYPES_VERSION"
echo "  @types/react-dom: $REACT_DOM_TYPES_VERSION"
echo "  vitest: $VITEST_VERSION"
echo "  tsup: $TSUP_VERSION"
echo "  eslint: $ESLINT_VERSION"
echo ""

# Function to update package.json
update_package_json() {
    local file=$1
    local package_name=$2
    local version=$3
    local section=$4
    
    if grep -q "\"$package_name\":" "$file"; then
        echo "  ✅ Updating $package_name to $version in $(basename $(dirname $file))"
        # Use jq to update the version
        tmp=$(mktemp)
        jq ".$section.\"$package_name\" = \"$version\"" "$file" > "$tmp" && mv "$tmp" "$file"
    fi
}

# Check and fix TypeScript versions
echo "🔧 Fixing TypeScript versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    if grep -q '"typescript"' "$file"; then
        if grep -q '"devDependencies"' "$file" && grep -A 20 '"devDependencies"' "$file" | grep -q '"typescript"'; then
            update_package_json "$file" "typescript" "$TYPESCRIPT_VERSION" "devDependencies"
        fi
    fi
done

# Check and fix Node types versions
echo "🔧 Fixing @types/node versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    if grep -q '"@types/node"' "$file"; then
        update_package_json "$file" "@types/node" "^$NODE_TYPES_VERSION" "devDependencies"
    fi
done

# Check and fix React types versions
echo "🔧 Fixing @types/react versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    if grep -q '"@types/react"' "$file"; then
        update_package_json "$file" "@types/react" "$REACT_TYPES_VERSION" "devDependencies"
    fi
done

echo "🔧 Fixing @types/react-dom versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    if grep -q '"@types/react-dom"' "$file"; then
        update_package_json "$file" "@types/react-dom" "$REACT_DOM_TYPES_VERSION" "devDependencies"
    fi
done

# Check and fix vitest versions
echo "🔧 Fixing vitest versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    if grep -q '"vitest"' "$file"; then
        update_package_json "$file" "vitest" "^$VITEST_VERSION" "devDependencies"
    fi
done

# Check and fix tsup versions
echo "🔧 Fixing tsup versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    if grep -q '"tsup"' "$file"; then
        update_package_json "$file" "tsup" "^$TSUP_VERSION" "devDependencies"
    fi
done

# Check and fix eslint versions
echo "🔧 Fixing eslint versions..."
find . -name "package.json" -not -path "./node_modules/*" | while read file; do
    if grep -q '"eslint"' "$file"; then
        update_package_json "$file" "eslint" "^$ESLINT_VERSION" "devDependencies"
    fi
done

echo "✅ Version consistency check and fix completed!"
echo "📝 Please run 'pnpm install' to update the lockfile with consistent versions."
