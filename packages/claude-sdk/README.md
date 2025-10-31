# @orchestrator/claude-sdk

Claude Agent SDK integration for the Drop-In Claude Orchestrator.

## Overview

This package provides programmatic control over the orchestrator's agents using the [@anthropic-ai/claude-agent-sdk](https://docs.anthropic.com/en/docs/build-with-claude/agent-sdk).

## Features

- **Agent Definitions**: Pre-configured agents (coder, tester, research, integrator, master-*)
- **Custom MCP Tools**: Orchestrator-specific tools via SDK MCP server
- **Streaming Support**: Real-time message streaming
- **Hooks Integration**: Pre/post tool use, session start/end
- **Permission Modes**: Trusted, review-each-step
- **Settings Integration**: Loads from `.claude/settings.json`

## Installation

```bash
pnpm install @orchestrator/claude-sdk
```

## Usage

### Run a planning query

```typescript
import { runPlan } from "@orchestrator/claude-sdk";

const messages = await runPlan(
  "Create a step-by-step plan to add user authentication",
  { maxTurns: 3 }
);

console.log(messages);
```

### Run a development query

```typescript
import { runDev } from "@orchestrator/claude-sdk";

const messages = await runDev(
  "Implement the user profile page with tests"
);

console.log(messages);
```

### Use agents directly

```typescript
import { query, agents } from "@orchestrator/claude-sdk";

const q = query({
  prompt: "Add input validation to the signup form",
  options: {
    agents,
    maxTurns: 10,
    permissionMode: "trusted",
  },
});

for await (const msg of q) {
  if ("content" in msg) {
    console.log(msg);
  }
}
```

### Custom MCP server

```typescript
import { orchestratorMcpServer } from "@orchestrator/claude-sdk";

// Use the orchestrator MCP server with custom tools:
// - echo: Simple echo tool for testing
// - getAgentInfo: Query agent definitions
```

## Agent Definitions

The package includes these pre-configured agents:

- `master-fullstack` - Coordinates all agents, ensures completeness
- `coder` - Implements features and bug fixes
- `tester` - Writes and runs tests
- `research` - Researches APIs and best practices
- `integrator` - Merges work from multiple agents
- `stuck` - Detects blockers and provides alternatives
- `master-devops` - Handles CI/CD and deployments
- `master-docs` - Maintains documentation
- `master-data` - Manages seeds and fixtures

## Configuration

The SDK loads settings from `.claude/settings.json` in your project root.

Example settings:

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

## API Reference

### `runPlan(prompt, options?)`

Run a planning query with limited turns and JSON output.

### `runDev(prompt, options?)`

Run a development query with full agent access.

### `agents`

Pre-configured agent definitions matching the orchestrator's structure.

### `orchestratorMcpServer`

Custom MCP server with orchestrator-specific tools.

## Learn More

- [Agent SDK Documentation](https://docs.anthropic.com/en/docs/build-with-claude/agent-sdk)
- [Orchestrator Documentation](../../docs/getting-started.md)
- [Agent Definitions](../../.claude/agents/)
