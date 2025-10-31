# Examples

Complete examples demonstrating Claude Code CLI, Agent SDK, and Skills integration.

## Prerequisites

```bash
# Install dependencies
pnpm install

# Build packages
pnpm build

# Set API key
export ANTHROPIC_API_KEY='your-api-key-here'

# Install Claude CLI (if not already installed)
npm install -g @anthropic-ai/claude-code
```

## Examples

### 1. Claude CLI Basic Usage

Demonstrates the Claude Code CLI in REPL, print, and planning modes.

```bash
chmod +x examples/01-cli-basic.sh
./examples/01-cli-basic.sh
```

**What it shows:**
- Interactive REPL mode
- Planning mode with JSON output
- One-shot command execution
- Setting and permission configuration

### 2. Agent SDK Basic Usage

Shows programmatic control using the TypeScript SDK.

```bash
npx tsx examples/02-sdk-basic.ts
```

**What it shows:**
- Running plans with `runPlan()`
- Development tasks with `runDev()`
- Custom queries with specific agents
- Observability hooks

**Examples covered:**
- Plan generation
- Development task execution
- Agent-specific queries
- Tool usage tracking

### 3. Agent Skills Basic Usage

Demonstrates using Anthropic pre-built and custom skills.

```bash
npx tsx examples/03-skills-basic.ts
```

**What it shows:**
- Anthropic PDF skill
- Anthropic Excel skill
- Custom code validator skill
- Combining multiple skills
- Available skills overview

**Note:** Some examples require actual documents (PDF, Excel) or uploaded custom skills.

### 4. CI/CD Headless Mode

Shows how to use Claude CLI in CI/CD pipelines without human interaction.

```bash
chmod +x examples/04-ci-headless.sh
./examples/04-ci-headless.sh
```

**What it shows:**
- Automated code review
- PR change validation
- Test suggestion generation
- Security scanning
- JSON output parsing

**Use cases:**
- GitHub Actions workflows
- GitLab CI pipelines
- Pre-commit hooks
- Automated code quality checks

### 5. Full Development Workflow

Complete end-to-end feature implementation using all three integration methods.

```bash
npx tsx examples/05-full-workflow.ts
```

**What it shows:**
- Multi-agent orchestration
- Research → Planning → Implementation → Testing → Documentation
- Agent handoffs
- Validation with skills
- Final verification

**Workflow steps:**
1. 📚 Research & Planning (research agent)
2. ⚙️ Implementation (coder agent)
3. ✔️ Validation (code-validator skill)
4. 🧪 Testing (tester agent)
5. 🔗 Integration & Documentation (integrator + master-docs agents)
6. 🔍 Final Verification (master-fullstack agent)

## Running Examples

### All at once

```bash
# Make scripts executable
chmod +x examples/*.sh

# Run all examples
npm run examples
```

### Individual examples

```bash
# CLI examples
./examples/01-cli-basic.sh

# SDK examples
npx tsx examples/02-sdk-basic.ts

# Skills examples
npx tsx examples/03-skills-basic.ts

# CI examples
./examples/04-ci-headless.sh

# Full workflow
npx tsx examples/05-full-workflow.ts
```

## Modifying Examples

All examples are self-contained and can be modified:

1. **CLI scripts** (`*.sh`) - Edit the claude commands and prompts
2. **TypeScript examples** (`*.ts`) - Modify the SDK calls and agent configuration
3. **Workflow** - Add custom steps or change the agent orchestration

## Troubleshooting

### "claude command not found"

Install the Claude Code CLI:
```bash
npm install -g @anthropic-ai/claude-code
```

### "ANTHROPIC_API_KEY not set"

Set your API key:
```bash
export ANTHROPIC_API_KEY='your-api-key'
```

### TypeScript errors

Build the packages first:
```bash
pnpm build
```

### Custom skills not working

Custom skills need to be uploaded to the Anthropic API first:
```bash
# See skills/README.md for upload instructions
./scripts/skills/upload.sh code-validator v1.0.0
```

## Learn More

- [Integration Guide](../docs/integration-claude.md)
- [Claude SDK Package](../packages/claude-sdk/README.md)
- [Skills Runner Package](../packages/skills-runner/README.md)
- [Custom Skills Guide](../skills/README.md)
