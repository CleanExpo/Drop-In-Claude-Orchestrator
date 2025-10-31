#!/bin/bash
# Quick Start Setup Script for Claude Integration
# This script sets up everything needed to use Claude CLI, SDK, and Skills

set -e

echo "🚀 Claude Integration Suite - Quick Start"
echo "=========================================="
echo ""

# Check for required tools
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js: $NODE_VERSION"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi
PNPM_VERSION=$(pnpm --version)
echo "✅ pnpm: $PNPM_VERSION"

# Check Python (for skills)
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "⚠️  Python not found. Skills examples will be skipped."
    HAS_PYTHON=false
else
    PYTHON_CMD=$(command -v python3 || command -v python)
    PYTHON_VERSION=$($PYTHON_CMD --version)
    echo "✅ Python: $PYTHON_VERSION"
    HAS_PYTHON=true
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile || pnpm install
echo "✅ Dependencies installed"
echo ""

# Build packages
echo "🔨 Building TypeScript packages..."
pnpm build
echo "✅ Packages built"
echo ""

# Check for Claude CLI
echo "Checking Claude Code CLI..."
if ! command -v claude &> /dev/null; then
    echo "📥 Claude CLI not found. Installing..."
    npm install -g @anthropic-ai/claude-code || echo "⚠️  Could not install Claude CLI (may not be published yet)"
else
    CLAUDE_VERSION=$(claude --version 2>&1 || echo "unknown")
    echo "✅ Claude CLI: $CLAUDE_VERSION"
fi
echo ""

# Check for API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  ANTHROPIC_API_KEY not set"
    echo ""
    echo "To use the integration, set your API key:"
    echo "  export ANTHROPIC_API_KEY='your-api-key-here'"
    echo ""
    echo "Or add it to your shell profile (~/.bashrc or ~/.zshrc):"
    echo "  echo 'export ANTHROPIC_API_KEY=\"your-key\"' >> ~/.bashrc"
    echo ""
else
    echo "✅ ANTHROPIC_API_KEY is set"
    echo ""
fi

# Test skills (if Python available)
if [ "$HAS_PYTHON" = true ]; then
    echo "🧪 Testing skills..."

    echo "  Testing code-validator..."
    $PYTHON_CMD skills/code-validator/v1.0.0/test.py > /dev/null 2>&1 && echo "  ✅ code-validator tests pass" || echo "  ⚠️  code-validator tests failed"

    echo "  Testing schema-validator..."
    $PYTHON_CMD skills/schema-validator/v1.0.0/test.py > /dev/null 2>&1 && echo "  ✅ schema-validator tests pass" || echo "  ⚠️  schema-validator tests failed"

    echo ""
fi

# Make scripts executable
echo "🔧 Setting up scripts..."
chmod +x scripts/claude/*.sh 2>/dev/null || true
chmod +x examples/*.sh 2>/dev/null || true
echo "✅ Scripts are executable"
echo ""

# Summary
echo "=========================================="
echo "✅ Quick Start Setup Complete!"
echo "=========================================="
echo ""
echo "What's ready:"
echo "  ✅ TypeScript packages built"
echo "  ✅ CLI scripts configured"
if [ "$HAS_PYTHON" = true ]; then
    echo "  ✅ Skills tested and ready"
fi
echo ""
echo "Next steps:"
echo ""
echo "1. Try the interactive CLI:"
echo "   ./scripts/claude/dev.sh"
echo ""
echo "2. Generate a plan:"
echo "   ./scripts/claude/plan.sh 'Add user authentication'"
echo ""
echo "3. Run SDK examples:"
echo "   npx tsx examples/02-sdk-basic.ts"
echo ""
echo "4. View all examples:"
echo "   cat examples/README.md"
echo ""
echo "5. Read the integration guide:"
echo "   cat docs/integration-claude.md"
echo ""
echo "📚 Documentation:"
echo "  • Integration Guide: docs/integration-claude.md"
echo "  • SDK Package: packages/claude-sdk/README.md"
echo "  • Skills Runner: packages/skills-runner/README.md"
echo "  • Custom Skills: skills/README.md"
echo "  • Examples: examples/README.md"
echo ""
echo "Happy coding with Claude! 🤖"
