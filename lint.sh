#!/bin/bash

set -e  # Exit on first error

echo "Running full project checks..."

echo "=== Running ESLint ==="
pnpm lint 2>&1

echo "=== Running Biome linting ==="
pnpm lint:biome 2>&1

echo "=== Checking formatting ==="
pnpm format:check 2>&1

echo "=== Running tests ==="
pnpm test:run 2>&1

echo "=== Running build ==="
pnpm build 2>&1

echo "All checks passed!"