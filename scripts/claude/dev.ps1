# Claude Code CLI - Development REPL Mode (PowerShell)
# Fast interactive development with verbose output

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Claude Code CLI in development mode..." -ForegroundColor Green
Write-Host "📋 Loading settings from .claude/settings.json" -ForegroundColor Cyan
Write-Host ""

# Check if claude CLI is available
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: 'claude' command not found" -ForegroundColor Red
    Write-Host "Please install Claude Code CLI first:"
    Write-Host "  npm install -g @anthropic-ai/claude-code"
    exit 1
}

# Run Claude CLI in continue mode with verbose output
claude `
  --continue `
  --verbose `
  --setting-sources project `
  --permission-mode trusted

Write-Host ""
Write-Host "✅ Claude Code CLI session ended" -ForegroundColor Green
