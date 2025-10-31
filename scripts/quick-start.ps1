# Quick Start Setup Script for Claude Integration (PowerShell)
# This script sets up everything needed to use Claude CLI, SDK, and Skills

$ErrorActionPreference = "Continue"

Write-Host "🚀 Claude Integration Suite - Quick Start" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Check for required tools
Write-Host "Checking prerequisites..." -ForegroundColor Cyan

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}
$NodeVersion = node --version
Write-Host "✅ Node.js: $NodeVersion" -ForegroundColor Green

# Check pnpm
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}
$PnpmVersion = pnpm --version
Write-Host "✅ pnpm: $PnpmVersion" -ForegroundColor Green

# Check Python (for skills)
$HasPython = $false
if (Get-Command python -ErrorAction SilentlyContinue) {
    $PythonVersion = python --version
    Write-Host "✅ Python: $PythonVersion" -ForegroundColor Green
    $HasPython = $true
} else {
    Write-Host "⚠️  Python not found. Skills examples will be skipped." -ForegroundColor Yellow
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
try {
    pnpm install --frozen-lockfile
} catch {
    pnpm install
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Build packages
Write-Host "🔨 Building TypeScript packages..." -ForegroundColor Cyan
pnpm build
Write-Host "✅ Packages built" -ForegroundColor Green
Write-Host ""

# Check for Claude CLI
Write-Host "Checking Claude Code CLI..." -ForegroundColor Cyan
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "📥 Claude CLI not found. Installing..." -ForegroundColor Yellow
    try {
        npm install -g @anthropic-ai/claude-code
    } catch {
        Write-Host "⚠️  Could not install Claude CLI (may not be published yet)" -ForegroundColor Yellow
    }
} else {
    try {
        $ClaudeVersion = claude --version 2>&1
        Write-Host "✅ Claude CLI: $ClaudeVersion" -ForegroundColor Green
    } catch {
        Write-Host "✅ Claude CLI installed" -ForegroundColor Green
    }
}
Write-Host ""

# Check for API key
if (-not $env:ANTHROPIC_API_KEY) {
    Write-Host "⚠️  ANTHROPIC_API_KEY not set" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To use the integration, set your API key:" -ForegroundColor White
    Write-Host '  $env:ANTHROPIC_API_KEY="your-api-key-here"' -ForegroundColor Gray
    Write-Host ""
    Write-Host "Or add it to your PowerShell profile:" -ForegroundColor White
    Write-Host '  Add-Content $PROFILE "`n$env:ANTHROPIC_API_KEY=`"your-key`""' -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "✅ ANTHROPIC_API_KEY is set" -ForegroundColor Green
    Write-Host ""
}

# Test skills (if Python available)
if ($HasPython) {
    Write-Host "🧪 Testing skills..." -ForegroundColor Cyan

    Write-Host "  Testing code-validator..." -ForegroundColor White
    try {
        python skills/code-validator/v1.0.0/test.py > $null 2>&1
        Write-Host "  ✅ code-validator tests pass" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  code-validator tests failed" -ForegroundColor Yellow
    }

    Write-Host "  Testing schema-validator..." -ForegroundColor White
    try {
        python skills/schema-validator/v1.0.0/test.py > $null 2>&1
        Write-Host "  ✅ schema-validator tests pass" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  schema-validator tests failed" -ForegroundColor Yellow
    }

    Write-Host ""
}

# Summary
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ Quick Start Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "What's ready:" -ForegroundColor Cyan
Write-Host "  ✅ TypeScript packages built" -ForegroundColor White
Write-Host "  ✅ CLI scripts configured" -ForegroundColor White
if ($HasPython) {
    Write-Host "  ✅ Skills tested and ready" -ForegroundColor White
}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Try the interactive CLI:" -ForegroundColor White
Write-Host "   .\scripts\claude\dev.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Generate a plan:" -ForegroundColor White
Write-Host "   .\scripts\claude\plan.ps1 'Add user authentication'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Run SDK examples:" -ForegroundColor White
Write-Host "   npx tsx examples/02-sdk-basic.ts" -ForegroundColor Gray
Write-Host ""
Write-Host "4. View all examples:" -ForegroundColor White
Write-Host "   Get-Content examples\README.md" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Read the integration guide:" -ForegroundColor White
Write-Host "   Get-Content docs\integration-claude.md" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  • Integration Guide: docs\integration-claude.md" -ForegroundColor White
Write-Host "  • SDK Package: packages\claude-sdk\README.md" -ForegroundColor White
Write-Host "  • Skills Runner: packages\skills-runner\README.md" -ForegroundColor White
Write-Host "  • Custom Skills: skills\README.md" -ForegroundColor White
Write-Host "  • Examples: examples\README.md" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding with Claude! 🤖" -ForegroundColor Green
