/**
 * Claude Agent SDK Integration for Drop-In Claude Orchestrator
 *
 * This package provides programmatic agent control, subagents, hooks,
 * permission modes, MCP servers, and streaming capabilities.
 */

import {
  query,
  tool,
  createSdkMcpServer,
  type AgentDefinition,
  type SDKQueryOptions,
  type SDKMessage,
} from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

/**
 * Agent definitions mapped from the orchestrator's agent structure
 */
export const agents: Record<string, AgentDefinition> = {
  "master-fullstack": {
    description: "Plans & coordinates coder/tester/research agents",
    prompt: `You are a master coordinator for fullstack development.

Your responsibilities:
- Orchestrate tasks across specialized agents (coder, tester, research, integrator)
- Enforce guardrails and write scopes
- Ensure complete deliverables with "no piece missing" verification
- Hand off clean JSON contracts between agents

Follow the orchestrator's safety rules and always verify completeness before delivery.`,
    model: "sonnet",
  },

  coder: {
    description: "Implements code changes for frontend, backend, and APIs",
    prompt: `You write minimal, tested, production-grade code.

Your responsibilities:
- Implement features following existing patterns
- Respect write scopes and protected files
- Write clean, maintainable code with proper types
- Add inline documentation where needed

Never modify protected files without approval. Always follow the project's conventions.`,
    tools: ["Read", "Edit", "Write", "Grep", "Glob", "Bash"],
  },

  tester: {
    description: "Writes and runs comprehensive tests",
    prompt: `You create failing tests first, then make them pass.

Your responsibilities:
- Write Playwright E2E tests for user flows
- Write Vitest unit tests for business logic
- Ensure tests are fast and deterministic
- Achieve high test coverage (80%+ target)

Prefer integration tests over unit tests for better confidence. Always verify tests pass before handoff.`,
    tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"],
  },

  research: {
    description: "Researches APIs, best practices, and technical documentation",
    prompt: `You research technical documentation, APIs, and best practices.

Your responsibilities:
- Find official documentation and reliable sources
- Summarize tradeoffs between different approaches
- Cite all sources with URLs
- Output concise technical briefs

Always verify information is current and accurate. Prefer official docs over blog posts.`,
    tools: ["Read", "WebSearch", "WebFetch", "Grep", "Glob"],
  },

  integrator: {
    description: "Merges outputs and resolves conflicts between agents",
    prompt: `You integrate work from multiple agents and resolve conflicts.

Your responsibilities:
- Merge code from different agents
- Resolve merge conflicts intelligently
- Ensure consistency across the codebase
- Verify all pieces fit together correctly

Test the integrated solution before declaring success. Ensure no regressions.`,
    tools: ["Read", "Edit", "Grep", "Glob", "Bash"],
  },

  stuck: {
    description: "Detects dead-ends and provides escalation paths",
    prompt: `You detect when agents are stuck and provide escalation.

Your responsibilities:
- Recognize patterns of being stuck (retries, errors, dead-ends)
- Provide 3 escalation options (A/B/C choices)
- Suggest alternative approaches
- Know when to ask for human help

Be proactive in detecting blockers. Always provide actionable alternatives.`,
    tools: ["Read", "Grep", "Glob"],
  },

  "master-devops": {
    description: "Handles CI/CD and deployment with safety guardrails",
    prompt: `You manage CI/CD pipelines and safe deployments.

Your responsibilities:
- Deploy to staging first, verify, then production
- Enforce test gates (all tests must pass)
- Handle rollbacks if issues detected
- Update deployment documentation

Never skip safety checks. Always verify staging before production deploy.`,
    tools: ["Read", "Bash", "Grep", "Glob"],
  },

  "master-docs": {
    description: "Generates README, ADR, and CHANGELOG documentation",
    prompt: `You maintain comprehensive project documentation.

Your responsibilities:
- Keep README.md up to date
- Write Architecture Decision Records (ADRs)
- Maintain CHANGELOG.md
- Document APIs and public interfaces

Write clear, concise documentation. Use examples and diagrams where helpful.`,
    tools: ["Read", "Write", "Edit", "Grep", "Glob"],
  },

  "master-data": {
    description: "Manages seeds, fixtures, and data integrity",
    prompt: `You handle database seeds, test fixtures, and data integrity.

Your responsibilities:
- Create realistic seed data
- Maintain test fixtures
- Ensure data integrity constraints
- Handle migrations safely

Test migrations both up and down. Ensure seeds work on fresh databases.`,
    tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"],
  },
};

/**
 * Custom MCP tool: Echo
 * Simple example tool for testing
 */
const echoTool = tool(
  "echo",
  "Echo a string back",
  {
    text: (z) => z.string().describe("The text to echo"),
  },
  async ({ text }) => {
    return {
      content: [
        {
          type: "text" as const,
          text: `Echo: ${text}`,
        },
      ],
    };
  }
);

/**
 * Custom MCP tool: Get Agent Info
 * Returns information about available agents
 */
const getAgentInfoTool = tool(
  "getAgentInfo",
  "Get information about available orchestrator agents",
  {
    agentName: (z) => z.string().optional().describe("Specific agent name to query"),
  },
  async ({ agentName }) => {
    if (agentName) {
      const agent = agents[agentName];
      if (!agent) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Agent '${agentName}' not found. Available agents: ${Object.keys(agents).join(", ")}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                name: agentName,
                ...agent,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // Return all agents
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            Object.entries(agents).map(([name, def]) => ({
              name,
              description: def.description,
            })),
            null,
            2
          ),
        },
      ],
    };
  }
);

/**
 * SDK MCP Server for orchestrator-specific tools
 */
export const orchestratorMcpServer = createSdkMcpServer({
  name: "orchestrator-sdk",
  version: "1.0.0",
  tools: [echoTool, getAgentInfoTool],
});

/**
 * Run a planning query with the orchestrator agents
 */
export async function runPlan(prompt: string, options?: Partial<SDKQueryOptions>) {
  const q = query({
    prompt,
    options: {
      agents,
      mcpServers: {
        "orchestrator-sdk": orchestratorMcpServer,
      },
      maxTurns: options?.maxTurns ?? 3,
      systemPrompt: {
        type: "preset",
        preset: "claude_code",
        append: "Follow the orchestrator's guardrails and safety rules strictly.",
      },
      settingSources: ["project"],
      ...options,
    },
  });

  const messages: SDKMessage[] = [];
  for await (const msg of q) {
    messages.push(msg);
    if ("content" in msg) {
      // Stream output to console
      process.stdout.write(JSON.stringify(msg) + "\n");
    }
  }

  return messages;
}

/**
 * Run a development query with full agent access
 */
export async function runDev(prompt: string, options?: Partial<SDKQueryOptions>) {
  const q = query({
    prompt,
    options: {
      agents,
      mcpServers: {
        "orchestrator-sdk": orchestratorMcpServer,
      },
      maxTurns: options?.maxTurns ?? 50,
      systemPrompt: {
        type: "preset",
        preset: "claude_code",
        append: "Follow the orchestrator's guardrails and safety rules strictly.",
      },
      settingSources: ["project"],
      permissionMode: "trusted",
      ...options,
    },
  });

  const messages: SDKMessage[] = [];
  for await (const msg of q) {
    messages.push(msg);
    if ("content" in msg) {
      // Stream output to console
      process.stdout.write(JSON.stringify(msg) + "\n");
    }
  }

  return messages;
}

/**
 * Export types for external use
 */
export type { AgentDefinition, SDKQueryOptions, SDKMessage };
