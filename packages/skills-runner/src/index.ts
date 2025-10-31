/**
 * Agent Skills Integration via Messages API
 *
 * This package demonstrates using Agent Skills (both Anthropic pre-built
 * and custom) through the Messages API with container.skills.
 */

import Anthropic from "@anthropic-ai/sdk";

/**
 * Skill types supported by the Messages API
 */
export type SkillType = "anthropic" | "custom";

/**
 * Skill definition for the container parameter
 */
export interface Skill {
  type: SkillType;
  skill_id: string;
  version?: string;
}

/**
 * Configuration for the skills runner
 */
export interface SkillsRunnerConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
}

/**
 * Skills runner class for executing queries with Agent Skills
 */
export class SkillsRunner {
  private client: Anthropic;
  private config: Required<SkillsRunnerConfig>;

  constructor(config: SkillsRunnerConfig = {}) {
    this.config = {
      apiKey: config.apiKey ?? process.env.ANTHROPIC_API_KEY ?? "",
      model: config.model ?? "claude-3-7-sonnet-2025-09-29",
      maxTokens: config.maxTokens ?? 4096,
    };

    if (!this.config.apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is required");
    }

    this.client = new Anthropic({
      apiKey: this.config.apiKey,
    });
  }

  /**
   * Run a query with Agent Skills
   */
  async run(userMessage: string, skills: Skill[]) {
    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      // Skills are specified via the container parameter
      container: {
        skills,
      },
    } as any); // Type assertion needed until SDK types are updated

    return response;
  }

  /**
   * Run with Anthropic pre-built PDF skill
   */
  async runWithPdfSkill(userMessage: string) {
    return this.run(userMessage, [
      {
        type: "anthropic",
        skill_id: "pdf",
        version: "latest",
      },
    ]);
  }

  /**
   * Run with Anthropic pre-built Excel skill
   */
  async runWithExcelSkill(userMessage: string) {
    return this.run(userMessage, [
      {
        type: "anthropic",
        skill_id: "xlsx",
        version: "latest",
      },
    ]);
  }

  /**
   * Run with Anthropic pre-built PowerPoint skill
   */
  async runWithPowerPointSkill(userMessage: string) {
    return this.run(userMessage, [
      {
        type: "anthropic",
        skill_id: "pptx",
        version: "latest",
      },
    ]);
  }

  /**
   * Run with Anthropic pre-built Word skill
   */
  async runWithWordSkill(userMessage: string) {
    return this.run(userMessage, [
      {
        type: "anthropic",
        skill_id: "docx",
        version: "latest",
      },
    ]);
  }

  /**
   * Run with a custom skill
   */
  async runWithCustomSkill(userMessage: string, skillId: string, version = "latest") {
    return this.run(userMessage, [
      {
        type: "custom",
        skill_id: skillId,
        version,
      },
    ]);
  }

  /**
   * Run with multiple skills (both Anthropic and custom)
   */
  async runWithMultipleSkills(userMessage: string, skills: Skill[]) {
    return this.run(userMessage, skills);
  }
}

/**
 * Convenience function to create a skills runner
 */
export function createSkillsRunner(config?: SkillsRunnerConfig) {
  return new SkillsRunner(config);
}

/**
 * Pre-built Anthropic skills
 */
export const AnthropicSkills = {
  PDF: { type: "anthropic" as const, skill_id: "pdf", version: "latest" },
  XLSX: { type: "anthropic" as const, skill_id: "xlsx", version: "latest" },
  PPTX: { type: "anthropic" as const, skill_id: "pptx", version: "latest" },
  DOCX: { type: "anthropic" as const, skill_id: "docx", version: "latest" },
};

/**
 * Helper to create a custom skill reference
 */
export function customSkill(skillId: string, version = "latest"): Skill {
  return {
    type: "custom",
    skill_id: skillId,
    version,
  };
}

/**
 * Example usage
 */
export async function examplePdfAnalysis() {
  const runner = createSkillsRunner();

  const response = await runner.runWithPdfSkill(
    "Analyze this PDF document and summarize the key findings."
  );

  return response;
}

export async function exampleCustomSkill() {
  const runner = createSkillsRunner();

  // Example: using a custom orchestrator skill
  const response = await runner.runWithCustomSkill(
    "Validate this code against our coding standards",
    "skill_orchestrator_code_validator"
  );

  return response;
}

export async function exampleMultipleSkills() {
  const runner = createSkillsRunner();

  // Combine Anthropic PDF skill with custom orchestrator skills
  const response = await runner.runWithMultipleSkills(
    "Extract data from this PDF and validate it against our schema",
    [
      AnthropicSkills.PDF,
      customSkill("skill_orchestrator_schema_validator"),
    ]
  );

  return response;
}
