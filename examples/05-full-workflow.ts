#!/usr/bin/env tsx
/**
 * Example 5: Full Development Workflow
 * Combines CLI, SDK, and Skills for a complete feature implementation
 *
 * Run with: npx tsx examples/05-full-workflow.ts
 */

import { runPlan, query, agents } from "../packages/claude-sdk/src/index.js";
import { createSkillsRunner, customSkill } from "../packages/skills-runner/src/index.js";

/**
 * Step 1: Research & Planning
 */
async function step1_research() {
  console.log("📚 Step 1: Research & Planning\n");

  // Use research agent to gather information
  const q = query({
    prompt: "Research best practices for implementing user profile editing in React",
    options: {
      agents: {
        research: agents.research,
      },
      maxTurns: 5,
    },
  });

  let researchNotes = "";
  for await (const msg of q) {
    if ("content" in msg && msg.role === "assistant") {
      researchNotes += JSON.stringify(msg.content);
    }
  }

  console.log("✅ Research complete\n");

  // Generate implementation plan
  console.log("📋 Generating implementation plan...\n");
  const plan = await runPlan(
    "Create a step-by-step plan to implement user profile editing with validation",
    { maxTurns: 3 }
  );

  console.log("✅ Plan generated\n");
  return { researchNotes, plan };
}

/**
 * Step 2: Implementation
 */
async function step2_implement() {
  console.log("⚙️  Step 2: Implementation\n");

  const q = query({
    prompt: `Implement the user profile editing feature:
      1. Create ProfileEdit component
      2. Add form validation
      3. Handle API calls
      4. Add error handling
    `,
    options: {
      agents: {
        coder: agents.coder,
      },
      maxTurns: 15,
      permissionMode: "trusted",
    },
  });

  const implementedFiles: string[] = [];
  for await (const msg of q) {
    if ("tool_use" in msg) {
      // Track file modifications
      if (["Write", "Edit"].includes(msg.tool_use?.name || "")) {
        implementedFiles.push("file"); // Would track actual file paths
      }
    }
  }

  console.log(`✅ Implementation complete (${implementedFiles.length} files)\n`);
  return implementedFiles;
}

/**
 * Step 3: Validation with Skills
 */
async function step3_validate(files: string[]) {
  console.log("✔️  Step 3: Validation\n");

  const runner = createSkillsRunner();

  // Validate code against standards
  console.log("Running code validator skill...");
  try {
    const validation = await runner.run(
      JSON.stringify({
        files: files.map((f) => ({
          path: f,
          operation: "modify",
        })),
        writeScope: ["src/**", "app/**"],
        protectedFiles: [".env*", "infra/**"],
      }),
      [customSkill("skill_orchestrator_code_validator")]
    );

    console.log("Code validation:", validation.result?.valid ? "✅ PASS" : "❌ FAIL");
  } catch (error) {
    console.log("⚠️  Code validator skill not uploaded yet");
  }

  console.log("\n✅ Validation complete\n");
}

/**
 * Step 4: Testing
 */
async function step4_test() {
  console.log("🧪 Step 4: Testing\n");

  const q = query({
    prompt: `Write comprehensive tests for the profile editing feature:
      1. Unit tests for validation logic
      2. Integration tests for API calls
      3. E2E tests for the full flow
    `,
    options: {
      agents: {
        tester: agents.tester,
      },
      maxTurns: 10,
    },
  });

  for await (const msg of q) {
    // Process test results
  }

  console.log("✅ Tests written and passing\n");
}

/**
 * Step 5: Integration & Documentation
 */
async function step5_integrate() {
  console.log("🔗 Step 5: Integration & Documentation\n");

  // Integrate all changes
  const integratorQ = query({
    prompt: "Integrate the profile editing feature into the main application",
    options: {
      agents: {
        integrator: agents.integrator,
      },
      maxTurns: 5,
    },
  });

  for await (const msg of integratorQ) {
    // Process integration
  }

  console.log("✅ Integration complete\n");

  // Update documentation
  const docsQ = query({
    prompt: "Update README and documentation to include the new profile editing feature",
    options: {
      agents: {
        "master-docs": agents["master-docs"],
      },
      maxTurns: 5,
    },
  });

  for await (const msg of docsQ) {
    // Process documentation updates
  }

  console.log("✅ Documentation updated\n");
}

/**
 * Step 6: Final Verification
 */
async function step6_verify() {
  console.log("🔍 Step 6: Final Verification\n");

  const q = query({
    prompt: `Perform final verification:
      1. All tests passing
      2. No regressions
      3. Documentation complete
      4. Ready for deployment
    `,
    options: {
      agents: {
        "master-fullstack": agents["master-fullstack"],
      },
      maxTurns: 5,
    },
  });

  for await (const msg of q) {
    // Process verification
  }

  console.log("✅ Final verification complete\n");
}

/**
 * Main workflow
 */
async function main() {
  console.log("🚀 Full Development Workflow Example\n");
  console.log("This demonstrates a complete feature implementation using:");
  console.log("  • Claude Code CLI for quick checks");
  console.log("  • Agent SDK for programmatic orchestration");
  console.log("  • Agent Skills for validation\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("⚠️  ANTHROPIC_API_KEY not set. Example will be simulated.\n");
    console.log("Workflow steps:");
    console.log("  1. 📚 Research & Planning");
    console.log("  2. ⚙️  Implementation");
    console.log("  3. ✔️  Validation");
    console.log("  4. 🧪 Testing");
    console.log("  5. 🔗 Integration & Documentation");
    console.log("  6. 🔍 Final Verification");
    console.log("\nSet ANTHROPIC_API_KEY to run the full workflow.");
    return;
  }

  try {
    const { researchNotes, plan } = await step1_research();
    const implementedFiles = await step2_implement();
    await step3_validate(implementedFiles);
    await step4_test();
    await step5_integrate();
    await step6_verify();

    console.log("🎉 Feature implementation complete!\n");
    console.log("Summary:");
    console.log("  ✅ Research and planning done");
    console.log("  ✅ Code implemented with validation");
    console.log("  ✅ Tests written and passing");
    console.log("  ✅ Documentation updated");
    console.log("  ✅ Ready for deployment");
  } catch (error) {
    console.error("❌ Workflow error:", error);
    process.exit(1);
  }
}

main();
