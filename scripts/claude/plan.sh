#!/bin/bash
# Claude Code CLI - Planning Mode
# Create step-by-step implementation plans with limited turns

set -e

# Get the plan prompt from arguments or use default
PLAN_PROMPT="${1:-Create a step-by-step plan to implement the requested feature}"
MAX_TURNS="${2:-3}"

echo "📝 Starting Claude Code CLI in planning mode..."
echo "🎯 Prompt: $PLAN_PROMPT"
echo "🔄 Max turns: $MAX_TURNS"
echo ""

# Check if claude CLI is available
if ! command -v claude &> /dev/null; then
    echo "❌ Error: 'claude' command not found"
    echo "Please install Claude Code CLI first:"
    echo "  npm install -g @anthropic-ai/claude-code"
    exit 1
fi

# Run Claude CLI in planning mode with JSON output
claude \
  -p "$PLAN_PROMPT" \
  --max-turns "$MAX_TURNS" \
  --output-format json \
  --setting-sources project \
  --permission-mode review-each-step

echo ""
echo "✅ Plan generated successfully"
