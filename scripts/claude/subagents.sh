#!/bin/bash
# Claude Code CLI - Subagents Configuration
# Demonstrates custom subagent definitions with specialized roles

set -e

echo "🤖 Starting Claude Code CLI with custom subagents..."
echo ""

# Check if claude CLI is available
if ! command -v claude &> /dev/null; then
    echo "❌ Error: 'claude' command not found"
    echo "Please install Claude Code CLI first:"
    echo "  npm install -g @anthropic-ai/claude-code"
    exit 1
fi

# Define subagents matching the orchestrator's agent structure
AGENTS_JSON='{
  "master-fullstack": {
    "description": "Plans & coordinates coder/tester/research agents",
    "prompt": "You are a master coordinator for fullstack development. Orchestrate tasks across specialized agents, enforce guardrails, and ensure complete deliverables. Hand off clean JSON contracts between agents.",
    "model": "sonnet",
    "tools": ["Read", "Grep", "Glob", "Task", "TodoWrite"]
  },
  "coder": {
    "description": "Implements code changes for frontend, backend, and APIs",
    "prompt": "You write minimal, tested, production-grade code. Respect write scopes and protected files. Follow the project'\''s existing patterns and conventions.",
    "tools": ["Read", "Edit", "Write", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  },
  "tester": {
    "description": "Writes and runs comprehensive tests",
    "prompt": "You create failing tests first, then make them pass. Prefer fast, deterministic tests. Use Playwright for E2E, Vitest for unit tests.",
    "tools": ["Read", "Write", "Edit", "Bash", "Grep", "Glob"],
    "model": "sonnet"
  },
  "research": {
    "description": "Researches APIs, best practices, and technical documentation",
    "prompt": "You research technical documentation and APIs. Cite sources, summarize tradeoffs, and output concise technical briefs. Use WebSearch and WebFetch tools.",
    "tools": ["Read", "WebSearch", "WebFetch", "Grep", "Glob"],
    "model": "sonnet"
  },
  "integrator": {
    "description": "Merges outputs and resolves conflicts between agents",
    "prompt": "You integrate work from multiple agents, resolve conflicts, and ensure consistency. Verify that all pieces fit together correctly.",
    "tools": ["Read", "Edit", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'

echo "📋 Configured subagents:"
echo "$AGENTS_JSON" | jq -r 'keys[]' | while read -r agent; do
    desc=$(echo "$AGENTS_JSON" | jq -r ".\"$agent\".description")
    echo "  • $agent: $desc"
done
echo ""

# Run Claude CLI with subagents
claude \
  --agents "$AGENTS_JSON" \
  --setting-sources project \
  --permission-mode trusted \
  --verbose

echo ""
echo "✅ Claude Code CLI with subagents ended"
