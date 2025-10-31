# Claude Integration Guide

Complete guide to integrating Claude Code CLI, Agent SDK, and Skills with the Drop-In Claude Orchestrator.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Claude Code CLI](#claude-code-cli)
4. [Claude Agent SDK](#claude-agent-sdk)
5. [Agent Skills](#agent-skills)
6. [MCP Integration](#mcp-integration)
7. [Guardrails & Permissions](#guardrails--permissions)
8. [CI/CD Integration](#cicd-integration)
9. [Examples](#examples)

## Overview

The Drop-In Claude Orchestrator now integrates three powerful Anthropic capabilities:

1. **Claude Code CLI** - Fast REPL, print-mode for scripting, JSON output, subagent configuration
2. **Claude Agent SDK** - Programmatic agent control, hooks, permission modes, streaming
3. **Agent Skills** - Pre-built and custom packaged tools (PDF, Excel, code validation, etc.)

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Claude Code  │  │  Agent SDK   │  │    Skills    │     │
│  │     CLI      │  │  (TypeScript)│  │   (Python)   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           │                                 │
│                    ┌──────▼───────┐                        │
│                    │     MCP      │                        │
│                    │   Servers    │                        │
│                    └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/CleanExpo/Drop-In-Claude-Orchestrator.git
cd Drop-In-Claude-Orchestrator

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Environment Setup

```bash
# Set your Anthropic API key
export ANTHROPIC_API_KEY='your-api-key-here'

# For Windows PowerShell
$env:ANTHROPIC_API_KEY='your-api-key-here'
```

### Verify Installation

```bash
# Check CLI is available
claude --version

# Test the orchestrator CLI scripts
./scripts/claude/dev.sh

# Run TypeScript compilation
pnpm typecheck

# Run skill tests
python skills/code-validator/v1.0.0/test.py
```

## Claude Code CLI

### Overview

The Claude Code CLI provides interactive and scripted access to Claude with support for:

- REPL mode for interactive development
- Print mode for automation
- JSON output for scripting
- Subagent configuration
- Permission modes

### Usage

#### Development REPL

```bash
# Bash/Linux/macOS
./scripts/claude/dev.sh

# Windows PowerShell
.\scripts\claude\dev.ps1
```

This launches an interactive session with:
- Verbose output enabled
- Trusted permission mode
- Project settings loaded from `.claude/settings.json`

#### Planning Mode

```bash
# Generate a plan
./scripts/claude/plan.sh "Add user authentication with tests"

# With custom max turns
./scripts/claude/plan.sh "Refactor the API layer" 5
```

Planning mode:
- Limited turns (default: 3)
- JSON output format
- Review-each-step permission mode
- Perfect for generating implementation plans

#### Subagents Mode

```bash
# Run with configured subagents
./scripts/claude/subagents.sh
```

This demonstrates:
- Custom agent definitions
- Agent hierarchy (master-fullstack → coder, tester, research)
- Tool restrictions per agent
- Model selection per agent

### CLI Options

```bash
# Common CLI flags
claude \
  --continue \                    # Continue mode
  --verbose \                     # Verbose output
  --max-turns 10 \                # Maximum conversation turns
  --output-format json \          # Output as JSON
  --permission-mode trusted \     # Permission mode
  --setting-sources project \     # Load .claude/settings.json
  --agents '{"agent-name": {...}}' # Custom agents
```

### Configuration

Settings are loaded from `.claude/settings.json`:

```json
{
  "models": {
    "default": "claude-sonnet-4-5-20250929",
    "sonnet": "claude-sonnet-4-5-20250929"
  },
  "permissions": {
    "mode": "trusted",
    "allowedTools": ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
  },
  "maxTurns": 50
}
```

## Claude Agent SDK

### Overview

The Agent SDK provides programmatic control over agents with TypeScript:

- Define custom agents
- Configure tools per agent
- Add hooks for observability
- Stream responses in real-time
- Integrate MCP servers

### Installation

```bash
cd packages/claude-sdk
pnpm install
pnpm build
```

### Basic Usage

```typescript
import { runDev, runPlan, agents } from "@orchestrator/claude-sdk";

// Run a development query
const messages = await runDev(
  "Implement user profile page with tests"
);

// Generate a plan
const plan = await runPlan(
  "Add authentication system",
  { maxTurns: 3 }
);
```

### Advanced: Direct Query API

```typescript
import { query, agents, orchestratorMcpServer } from "@orchestrator/claude-sdk";

const q = query({
  prompt: "Add input validation to signup form",
  options: {
    agents,
    mcpServers: {
      "orchestrator-sdk": orchestratorMcpServer,
    },
    maxTurns: 10,
    permissionMode: "trusted",
    systemPrompt: {
      type: "preset",
      preset: "claude_code",
      append: "Follow orchestrator guardrails strictly.",
    },
    settingSources: ["project"],
  },
});

// Stream messages
for await (const msg of q) {
  if ("content" in msg) {
    console.log(msg);
  }
}
```

### Custom Agents

```typescript
import { query, type AgentDefinition } from "@orchestrator/claude-sdk";

const customAgent: AgentDefinition = {
  description: "Security auditor",
  prompt: "You audit code for security vulnerabilities...",
  tools: ["Read", "Grep", "Glob"],
  model: "sonnet",
};

const q = query({
  prompt: "Audit this codebase for security issues",
  options: {
    agents: {
      "security-auditor": customAgent,
    },
  },
});
```

### Hooks

```typescript
import { query } from "@orchestrator/claude-sdk";

const q = query({
  prompt: "Implement feature X",
  options: {
    hooks: {
      preToolUse: async (tool, input) => {
        console.log(`About to use tool: ${tool}`);
        // Can modify input or cancel tool use
      },
      postToolUse: async (tool, output) => {
        console.log(`Tool ${tool} completed`);
        // Can analyze output for logging/metrics
      },
    },
  },
});
```

## Agent Skills

### Overview

Agent Skills are packaged capabilities that can be:

- **Anthropic Pre-built**: PDF, Excel, PowerPoint, Word processing
- **Custom**: Your own uploaded skills

### Installation

```bash
cd packages/skills-runner
pnpm install
pnpm build
```

### Using Pre-built Skills

```typescript
import { createSkillsRunner } from "@orchestrator/skills-runner";

const runner = createSkillsRunner();

// Analyze a PDF
const result = await runner.runWithPdfSkill(
  "Extract all tables from this PDF and summarize the data"
);

// Process Excel
const excelResult = await runner.runWithExcelSkill(
  "Calculate the total sales from column D"
);
```

### Using Custom Skills

```typescript
import { createSkillsRunner, customSkill } from "@orchestrator/skills-runner";

const runner = createSkillsRunner();

// Use the code validator skill
const validation = await runner.run(
  "Validate these code changes against our standards",
  [customSkill("skill_orchestrator_code_validator", "v1.0.0")]
);

// Use the schema validator skill
const schemaCheck = await runner.run(
  "Validate this JSON data against the schema",
  [customSkill("skill_orchestrator_schema_validator", "v1.0.0")]
);
```

### Combining Skills

```typescript
import {
  createSkillsRunner,
  AnthropicSkills,
  customSkill
} from "@orchestrator/skills-runner";

const runner = createSkillsRunner();

// Combine Anthropic PDF skill with custom validator
const result = await runner.runWithMultipleSkills(
  "Extract data from this PDF and validate it",
  [
    AnthropicSkills.PDF,
    customSkill("skill_orchestrator_schema_validator"),
  ]
);
```

### Creating Custom Skills

See [skills/README.md](../skills/README.md) for detailed instructions.

Quick example:

```bash
# Create skill structure
mkdir -p skills/my-skill/v1.0.0
cd skills/my-skill/v1.0.0

# Create skill.yaml
cat > skill.yaml <<EOF
name: my-skill
version: 1.0.0
description: "My custom skill"
runtime: python
entry_point: main.py
EOF

# Implement main.py
cat > main.py <<'EOF'
import json, sys

def execute(input_data):
    # Your logic here
    return {"status": "success", "result": "..."}

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    result = execute(input_data)
    print(json.dumps(result))
EOF

# Write tests
cat > test.py <<'EOF'
import unittest
from main import execute

class TestMySkill(unittest.TestCase):
    def test_basic(self):
        result = execute({"test": "data"})
        self.assertEqual(result["status"], "success")

if __name__ == "__main__":
    unittest.main()
EOF

# Test it
python test.py
```

## MCP Integration

### Overview

The orchestrator integrates with Model Context Protocol (MCP) servers:

- **Playwright**: Browser automation
- **Filesystem**: File operations
- **Git**: Git operations
- **Browser**: Web browsing
- **Jina**: Web search and scraping

### Configuration

MCP servers are configured in `.claude/settings.json`:

```json
{
  "mcp": {
    "servers": {
      "playwright": {
        "enabled": "auto",
        "config": ".claude/mcp/playwright.config.json"
      },
      "filesystem": {
        "enabled": true,
        "config": ".claude/mcp/fs.config.json"
      },
      "git": {
        "enabled": true,
        "config": ".claude/mcp/git.config.json"
      }
    }
  }
}
```

### SDK MCP Server

The orchestrator provides a custom MCP server with tools:

```typescript
import { orchestratorMcpServer } from "@orchestrator/claude-sdk";

// Tools available:
// - echo: Simple echo for testing
// - getAgentInfo: Query agent definitions
```

### Adding Custom MCP Tools

```typescript
import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const myTool = tool(
  "myTool",
  "Description of what it does",
  {
    param1: (z) => z.string(),
  },
  async ({ param1 }) => {
    // Tool implementation
    return {
      content: [
        { type: "text", text: "Result" }
      ]
    };
  }
);

const mcp = createSdkMcpServer({
  name: "my-mcp",
  version: "1.0.0",
  tools: [myTool],
});
```

## Guardrails & Permissions

### Write Scopes

Restrict where code can be modified:

```json
{
  "guardrails": {
    "writeScope": [
      "src/**",
      "app/**",
      "docs/**",
      "packages/**"
    ]
  }
}
```

### Protected Files

Prevent modification of sensitive files:

```json
{
  "guardrails": {
    "protectedFiles": [
      ".env*",
      "infra/**",
      "Dockerfile",
      ".git/**"
    ]
  }
}
```

### Permission Modes

```json
{
  "permissions": {
    "mode": "trusted",  // or "review-each-step"
    "allowedTools": ["Read", "Write", "Edit", "Bash"],
    "disallowedTools": []
  }
}
```

### Enforcement

Guardrails are enforced via:

1. **SDK Configuration**: Loaded from `.claude/settings.json`
2. **Custom Skills**: Code validator skill checks write scopes
3. **Hooks**: Pre-tool-use hooks can validate operations

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/claude-checks.yml
name: Claude Code Checks

on: [push, pull_request]

jobs:
  lint-with-claude:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: pnpm install

      - name: Run Claude plan mode check
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          ./scripts/claude/plan.sh "Review this PR for issues" 3 > plan.json
          cat plan.json

      - name: Test skills
        run: |
          python skills/code-validator/v1.0.0/test.py
          python skills/schema-validator/v1.0.0/test.py
```

### Headless Mode

For automated checks without interaction:

```bash
# Print mode with JSON output
claude -p "Analyze this code for potential bugs" \
  --max-turns 3 \
  --output-format json \
  --permission-mode review-each-step
```

## Examples

### Example 1: Feature Development Workflow

```typescript
// 1. Generate a plan
import { runPlan } from "@orchestrator/claude-sdk";

const plan = await runPlan(
  "Add user profile editing feature with tests",
  { maxTurns: 3 }
);

// 2. Execute with agents
import { query, agents } from "@orchestrator/claude-sdk";

const q = query({
  prompt: "Implement the profile editing feature following the plan",
  options: {
    agents,
    maxTurns: 20,
  },
});

for await (const msg of q) {
  console.log(msg);
}

// 3. Validate with custom skill
import { createSkillsRunner, customSkill } from "@orchestrator/skills-runner";

const runner = createSkillsRunner();
const validation = await runner.run(
  "Validate the implementation",
  [customSkill("skill_orchestrator_code_validator")]
);
```

### Example 2: Document Processing Pipeline

```typescript
import { createSkillsRunner, AnthropicSkills } from "@orchestrator/skills-runner";

const runner = createSkillsRunner();

// Extract data from PDF
const pdfData = await runner.runWithPdfSkill(
  "Extract all customer information from this invoice PDF"
);

// Process in Excel
const excelResult = await runner.runWithExcelSkill(
  "Add this customer data to the spreadsheet and calculate totals"
);

// Generate report
const docResult = await runner.runWithWordSkill(
  "Create a summary report of the processed invoices"
);
```

### Example 3: Multi-Agent Orchestration

```typescript
import { query, agents, orchestratorMcpServer } from "@orchestrator/claude-sdk";

const q = query({
  prompt: `
    Research best practices for React Server Components,
    then implement a server component for the dashboard,
    write comprehensive tests,
    and update the documentation.
  `,
  options: {
    agents: {
      "master-fullstack": agents["master-fullstack"],
      "research": agents["research"],
      "coder": agents["coder"],
      "tester": agents["tester"],
      "master-docs": agents["master-docs"],
    },
    mcpServers: {
      "orchestrator-sdk": orchestratorMcpServer,
    },
    maxTurns: 30,
    hooks: {
      postToolUse: async (tool, output) => {
        // Log for observability
        console.log(`[${new Date().toISOString()}] ${tool} completed`);
      },
    },
  },
});

for await (const msg of q) {
  if ("content" in msg) {
    console.log(msg);
  }
}
```

### Example 4: CI/CD Safety Gate

```typescript
// ci/safety-check.ts
import { runPlan, createSkillsRunner, customSkill } from "@orchestrator/claude-sdk";

async function ciSafetyCheck() {
  // 1. Analyze changes
  const analysis = await runPlan(
    "Analyze the git diff and identify potential issues",
    { maxTurns: 2 }
  );

  // 2. Validate code
  const runner = createSkillsRunner();
  const validation = await runner.run(
    "Validate all modified files",
    [customSkill("skill_orchestrator_code_validator")]
  );

  // 3. Check result
  if (!validation.result.valid) {
    console.error("❌ Validation failed:", validation.result.errors);
    process.exit(1);
  }

  console.log("✅ All checks passed");
}

ciSafetyCheck();
```

## Learn More

- [Claude Code CLI Documentation](https://docs.anthropic.com/en/docs/build-with-claude/cli)
- [Agent SDK Documentation](https://docs.anthropic.com/en/docs/build-with-claude/agent-sdk)
- [Agent Skills Documentation](https://docs.anthropic.com/en/docs/build-with-claude/agent-skills)
- [MCP Documentation](https://modelcontextprotocol.io/)

## Support

For issues or questions:

- [GitHub Issues](https://github.com/CleanExpo/Drop-In-Claude-Orchestrator/issues)
- [Documentation](../README.md)
- [Examples](./examples/)
