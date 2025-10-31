#!/usr/bin/env tsx
/**
 * Example 3: Agent Skills Basic Usage
 *
 * Run with: npx tsx examples/03-skills-basic.ts
 */

import {
  createSkillsRunner,
  AnthropicSkills,
  customSkill,
} from "../packages/skills-runner/src/index.js";

async function example1_pdfSkill() {
  console.log("=== Example 1: Use PDF Skill ===\n");

  const runner = createSkillsRunner();

  try {
    const result = await runner.runWithPdfSkill(
      "Extract the table of contents from this PDF document"
    );

    console.log("PDF Analysis Result:");
    console.log(JSON.stringify(result, null, 2));
    console.log("\n✅ PDF skill example complete\n");
  } catch (error) {
    console.log("⚠️  Skipped (requires PDF input):", error.message);
  }
}

async function example2_excelSkill() {
  console.log("=== Example 2: Use Excel Skill ===\n");

  const runner = createSkillsRunner();

  try {
    const result = await runner.runWithExcelSkill(
      "Calculate the sum of column A in the spreadsheet"
    );

    console.log("Excel Processing Result:");
    console.log(JSON.stringify(result, null, 2));
    console.log("\n✅ Excel skill example complete\n");
  } catch (error) {
    console.log("⚠️  Skipped (requires Excel input):", error.message);
  }
}

async function example3_customSkill() {
  console.log("=== Example 3: Use Custom Code Validator Skill ===\n");

  const runner = createSkillsRunner();

  try {
    const result = await runner.run(
      JSON.stringify({
        files: [
          {
            path: "src/app.ts",
            content: "const foo: string = 'bar';",
            operation: "modify",
          },
        ],
        writeScope: ["src/**"],
        protectedFiles: [".env*"],
      }),
      [customSkill("skill_orchestrator_code_validator", "v1.0.0")]
    );

    console.log("Code Validation Result:");
    console.log(JSON.stringify(result, null, 2));
    console.log("\n✅ Custom skill example complete\n");
  } catch (error) {
    console.log("⚠️  Note: Custom skills require upload to Anthropic API");
    console.log("    See skills/README.md for upload instructions");
  }
}

async function example4_multipleSkills() {
  console.log("=== Example 4: Combine Multiple Skills ===\n");

  const runner = createSkillsRunner();

  try {
    const result = await runner.runWithMultipleSkills(
      "Extract data from this PDF and validate it against our schema",
      [
        AnthropicSkills.PDF,
        customSkill("skill_orchestrator_schema_validator"),
      ]
    );

    console.log("Multi-Skill Result:");
    console.log(JSON.stringify(result, null, 2));
    console.log("\n✅ Multiple skills example complete\n");
  } catch (error) {
    console.log("⚠️  Skipped (requires both PDF input and uploaded custom skill)");
  }
}

async function example5_allAnthropicSkills() {
  console.log("=== Example 5: Available Anthropic Skills ===\n");

  console.log("Pre-built Anthropic Skills:");
  console.log("  • PDF (pdf) - Process PDF documents");
  console.log("  • Excel (xlsx) - Process Excel spreadsheets");
  console.log("  • PowerPoint (pptx) - Process PowerPoint presentations");
  console.log("  • Word (docx) - Process Word documents");

  console.log("\nUsage:");
  console.log(`  const runner = createSkillsRunner();`);
  console.log(`  const result = await runner.runWithPdfSkill("Extract tables");`);
  console.log(`  // or`);
  console.log(`  const result = await runner.run("Query", [AnthropicSkills.PDF]);`);

  console.log("\n✅ Skills overview complete\n");
}

// Main execution
async function main() {
  console.log("🎯 Agent Skills Examples\n");
  console.log("Note: Set ANTHROPIC_API_KEY environment variable to run these examples\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("⚠️  ANTHROPIC_API_KEY not set. Examples will be skipped.\n");
    return;
  }

  try {
    await example5_allAnthropicSkills();
    // Note: Other examples require actual files or uploaded custom skills
    console.log("To run with actual files:");
    console.log("  1. Provide PDF/Excel/Word documents in your prompts");
    console.log("  2. Upload custom skills using scripts/skills/upload.sh");
    console.log("  3. Reference uploaded skills by their skill_id");

    console.log("\n✅ Skills examples overview complete!");
  } catch (error) {
    console.error("❌ Error running examples:", error);
    process.exit(1);
  }
}

main();
