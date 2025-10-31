# Claude Code CLI - Subagents Configuration (PowerShell)
# Demonstrates custom subagent definitions with specialized roles

$ErrorActionPreference = "Stop"

Write-Host "🤖 Starting Claude Code CLI with custom subagents..." -ForegroundColor Green
Write-Host ""

# Check if claude CLI is available
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: 'claude' command not found" -ForegroundColor Red
    Write-Host "Please install Claude Code CLI first:"
    Write-Host "  npm install -g @anthropic-ai/claude-code"
    exit 1
}

# Define subagents matching the orchestrator's agent structure
$AgentsJson = @'
{
  "master-fullstack": {
    "description": "Plans & coordinates coder/tester/research agents",
    "prompt": "You are a master coordinator for fullstack development. Orchestrate tasks across specialized agents, enforce guardrails, and ensure complete deliverables. Hand off clean JSON contracts between agents.",
    "model": "sonnet",
    "tools": ["Read", "Grep", "Glob", "Task", "TodoWrite"]
  },
  "coder": {
    "description": "Implements code changes for frontend, backend, and APIs",
    "prompt": "You write minimal, tested, production-grade code. Respect write scopes and protected files. Follow the project's existing patterns and conventions.",
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
}
'@

Write-Host "📋 Configured subagents:" -ForegroundColor Cyan
$Agents = $AgentsJson | ConvertFrom-Json
foreach ($agent in $Agents.PSObject.Properties) {
    $desc = $agent.Value.description
    Write-Host "  • $($agent.Name): $desc" -ForegroundColor White
}
Write-Host ""

# Run Claude CLI with subagents
claude `
  --agents $AgentsJson `
  --setting-sources project `
  --permission-mode trusted `
  --verbose

Write-Host ""
Write-Host "✅ Claude Code CLI with subagents ended" -ForegroundColor Green
