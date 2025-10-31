# Claude Code CLI - Planning Mode (PowerShell)
# Create step-by-step implementation plans with limited turns

param(
    [string]$PlanPrompt = "Create a step-by-step plan to implement the requested feature",
    [int]$MaxTurns = 3
)

$ErrorActionPreference = "Stop"

Write-Host "📝 Starting Claude Code CLI in planning mode..." -ForegroundColor Green
Write-Host "🎯 Prompt: $PlanPrompt" -ForegroundColor Cyan
Write-Host "🔄 Max turns: $MaxTurns" -ForegroundColor Cyan
Write-Host ""

# Check if claude CLI is available
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: 'claude' command not found" -ForegroundColor Red
    Write-Host "Please install Claude Code CLI first:"
    Write-Host "  npm install -g @anthropic-ai/claude-code"
    exit 1
}

# Run Claude CLI in planning mode with JSON output
claude `
  -p $PlanPrompt `
  --max-turns $MaxTurns `
  --output-format json `
  --setting-sources project `
  --permission-mode review-each-step

Write-Host ""
Write-Host "✅ Plan generated successfully" -ForegroundColor Green
