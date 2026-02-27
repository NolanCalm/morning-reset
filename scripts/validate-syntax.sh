#!/bin/bash
# Validate TypeScript syntax and detect common corruption patterns
# Usage: ./scripts/validate-syntax.sh [file]

set -e  # Exit on error

echo "🔍 Validating TypeScript syntax..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any issues found
ISSUES_FOUND=0

# Function to check for corruption patterns
check_corruption_patterns() {
  local file=$1
  local content=$(cat "$file")

  # Pattern 1: Missing || in hook default values
  # user?.id  '' instead of user?.id || ''
  if echo "$content" | grep -E "user\?\.id\s+''" > /dev/null; then
    echo -e "${RED}❌ ISSUE: Missing || operator in hook default value${NC}"
    echo -e "   File: $file"
    echo -e "   Pattern: user?.id  '' (should be user?.id || '')${NC}"
    ISSUES_FOUND=1
  fi

  # Pattern 2: Missing || in loading states
  # loading  loading instead of loading || loading
  if echo "$content" | grep -E "\w+\.loading\s+\w+\.loading" > /dev/null; then
    echo -e "${RED}❌ ISSUE: Missing || operator in loading state${NC}"
    echo -e "   File: $file"
    echo -e "   Pattern: loading  loading (should be loading || loading)${NC}"
    ISSUES_FOUND=1
  fi

  # Pattern 3: Double spaces that might hide missing operators
  if echo "$content" | grep -E "  '" > /dev/null; then
    echo -e "${YELLOW}⚠️  WARNING: Suspicious double quotes with spaces${NC}"
    echo -e "   File: $file"
    echo -e "   This might indicate a missing || operator${NC}"
    # Don't set ISSUES_FOUND for warnings
  fi
}

# If a specific file is provided, validate only that file
if [ -n "$1" ]; then
  echo "Validating file: $1"

  if [[ "$1" == *.ts || "$1" == *.tsx ]]; then
    echo "Running TypeScript type check..."
    npx tsc --noEmit "$1" || {
      echo -e "${RED}❌ TypeScript compilation failed for $1${NC}"
      exit 1
    }

    echo "Checking for corruption patterns..."
    check_corruption_patterns "$1"
  else
    echo -e "${YELLOW}⚠️  Skipping non-TypeScript file: $1${NC}"
  fi
else
  # Validate all TypeScript files
  echo "Running TypeScript type check on all files..."
  npx tsc --noEmit || {
    echo -e "${RED}❌ TypeScript compilation failed${NC}"
    exit 1
  }

  echo "Checking for corruption patterns in all TypeScript files..."
  find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v ".next" | while read -r file; do
    check_corruption_patterns "$file"
  done
fi

# Final summary
if [ $ISSUES_FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ All validations passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Corruption patterns found. Please review the output above.${NC}"
  exit 1
fi
