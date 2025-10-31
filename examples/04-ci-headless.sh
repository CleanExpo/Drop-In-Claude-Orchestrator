#!/bin/bash
# Example 4: CI/CD Headless Mode
# Demonstrates running Claude CLI in CI without human interaction

set -e

echo "=== CI/CD Headless Mode Examples ==="
echo ""

# Example 1: Code review check
echo "1. Automated Code Review"
claude -p "Review the git diff for potential issues, bugs, or improvements" \
  --max-turns 3 \
  --output-format json \
  --permission-mode review-each-step \
  --setting-sources project \
  > ci-review.json

echo "   ✅ Review saved to ci-review.json"
echo ""

# Example 2: Validate PR changes
echo "2. Validate PR Changes"
claude -p "Check if all modified files are within write scope and not protected" \
  --max-turns 2 \
  --output-format json \
  --setting-sources project \
  > ci-validation.json

echo "   ✅ Validation saved to ci-validation.json"
echo ""

# Example 3: Generate test suggestions
echo "3. Generate Test Suggestions"
claude -p "Analyze modified files and suggest test cases" \
  --max-turns 3 \
  --output-format json \
  > ci-test-suggestions.json

echo "   ✅ Test suggestions saved to ci-test-suggestions.json"
echo ""

# Example 4: Security scan
echo "4. Security Scan"
claude -p "Scan for common security vulnerabilities in the changes" \
  --max-turns 2 \
  --output-format json \
  --permission-mode review-each-step \
  > ci-security.json

echo "   ✅ Security scan saved to ci-security.json"
echo ""

# Parse results
echo "5. Parse Results (example)"
if command -v jq &> /dev/null; then
  echo "   Checking for issues..."

  # Example: Check if review found issues
  ISSUES=$(jq -r '.messages[] | select(.role == "assistant") | .content[]' ci-review.json 2>/dev/null || echo "")

  if [ -n "$ISSUES" ]; then
    echo "   ⚠️  Issues found - review required"
  else
    echo "   ✅ No issues found"
  fi
else
  echo "   ⚠️  jq not installed - skipping JSON parsing"
fi

echo ""
echo "=== CI Examples Complete ==="
echo ""
echo "Usage in GitHub Actions:"
echo "  - Add these checks to your workflow"
echo "  - Parse JSON output to determine if CI should pass/fail"
echo "  - Set permission-mode to 'review-each-step' for safety"
echo "  - Use --max-turns to limit execution time"
