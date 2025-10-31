#!/bin/bash
# Claude Code CLI - Development REPL Mode
# Fast interactive development with verbose output

set -e

echo "🚀 Starting Claude Code CLI in development mode..."
echo "📋 Loading settings from .claude/settings.json"
echo ""

# Check if claude CLI is available
if ! command -v claude &> /dev/null; then
    echo "❌ Error: 'claude' command not found"
    echo "Please install Claude Code CLI first:"
    echo "  npm install -g @anthropic-ai/claude-code"
    exit 1
fi

# Run Claude CLI in continue mode with verbose output
claude \
  --continue \
  --verbose \
  --setting-sources project \
  --permission-mode trusted

echo ""
echo "✅ Claude Code CLI session ended"
