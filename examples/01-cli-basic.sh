#!/bin/bash
# Example 1: Basic Claude CLI Usage

echo "=== Claude CLI Basic Examples ==="
echo ""

# Example 1: Simple REPL session
echo "1. Interactive REPL (launches interactive session)"
echo "   ./scripts/claude/dev.sh"
echo ""

# Example 2: Generate a plan
echo "2. Generate an implementation plan"
./scripts/claude/plan.sh "Add user authentication with JWT tokens"
echo ""

# Example 3: Use with specific prompt
echo "3. One-shot command (print mode)"
claude -p "Analyze the project structure and list all TypeScript files" \
  --max-turns 1 \
  --output-format json \
  --setting-sources project

echo ""
echo "✅ CLI examples complete"
