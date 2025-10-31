#!/usr/bin/env tsx
/**
 * Example 2: Claude Agent SDK Basic Usage
 *
 * Run with: npx tsx examples/02-sdk-basic.ts
 */

import { runPlan, runDev, query, agents } from "../packages/claude-sdk/src/index.js";

async function example1_runPlan() {
  console.log("=== Example 1: Run a Plan ===\n");

  const messages = await runPlan(
    "Create a step-by-step plan to add input validation to the user signup form",
    { maxTurns: 3 }
  );

  console.log(`\n✅ Generated ${messages.length} messages\n`);
}

async function example2_runDev() {
  console.log("=== Example 2: Run Development Task ===\n");

  const messages = await runDev(
    "Add a simple utility function to format dates as ISO strings"
  );

  console.log(`\n✅ Completed with ${messages.length} messages\n`);
}

async function example3_customQuery() {
  console.log("=== Example 3: Custom Query with Specific Agents ===\n");

  const q = query({
    prompt: "Research best practices for React Server Components",
    options: {
      agents: {
        research: agents.research,
      },
      maxTurns: 5,
      permissionMode: "review-each-step",
    },
  });

  let messageCount = 0;
  for await (const msg of q) {
    if ("content" in msg) {
      messageCount++;
      console.log(`Message ${messageCount}:`, msg.type);
    }
  }

  console.log(`\n✅ Research completed with ${messageCount} messages\n`);
}

async function example4_withHooks() {
  console.log("=== Example 4: Query with Observability Hooks ===\n");

  const toolUsage: Record<string, number> = {};

  const q = query({
    prompt: "List all TypeScript files in the packages directory",
    options: {
      agents: {
        coder: agents.coder,
      },
      maxTurns: 5,
      hooks: {
        preToolUse: async (tool) => {
          console.log(`[Hook] About to use tool: ${tool}`);
        },
        postToolUse: async (tool) => {
          toolUsage[tool] = (toolUsage[tool] || 0) + 1;
          console.log(`[Hook] Completed tool: ${tool}`);
        },
      },
    },
  });

  for await (const msg of q) {
    // Process messages
  }

  console.log("\n📊 Tool Usage Statistics:");
  Object.entries(toolUsage).forEach(([tool, count]) => {
    console.log(`  ${tool}: ${count} times`);
  });

  console.log("\n✅ Query with hooks complete\n");
}

// Main execution
async function main() {
  console.log("🚀 Claude Agent SDK Examples\n");
  console.log("Note: Set ANTHROPIC_API_KEY environment variable to run these examples\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("⚠️  ANTHROPIC_API_KEY not set. Examples will be skipped.\n");
    return;
  }

  try {
    await example1_runPlan();
    await example2_runDev();
    await example3_customQuery();
    await example4_withHooks();

    console.log("✅ All SDK examples completed successfully!");
  } catch (error) {
    console.error("❌ Error running examples:", error);
    process.exit(1);
  }
}

main();
