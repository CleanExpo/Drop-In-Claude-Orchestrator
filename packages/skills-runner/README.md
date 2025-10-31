# @orchestrator/skills-runner

Agent Skills integration via the Messages API for the Drop-In Claude Orchestrator.

## Overview

This package provides a clean interface for using Agent Skills (both Anthropic pre-built and custom) through the Messages API with the `container.skills` parameter.

## Features

- **Anthropic Pre-built Skills**: PDF, Excel, PowerPoint, Word
- **Custom Skills**: Support for your own uploaded skills
- **Multiple Skills**: Combine skills in a single query
- **Type-safe API**: Full TypeScript support
- **Easy Configuration**: Simple API key setup

## Installation

```bash
pnpm install @orchestrator/skills-runner
```

## Environment Setup

Set your Anthropic API key:

```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```

## Usage

### Using Anthropic Pre-built Skills

```typescript
import { createSkillsRunner } from "@orchestrator/skills-runner";

const runner = createSkillsRunner();

// Analyze a PDF
const pdfResult = await runner.runWithPdfSkill(
  "Summarize the key points from this PDF document"
);

// Process an Excel file
const excelResult = await runner.runWithExcelSkill(
  "Extract the sales data from Q4 and calculate the total"
);

// Analyze a PowerPoint
const pptResult = await runner.runWithPowerPointSkill(
  "List all the main topics covered in this presentation"
);

// Process a Word document
const docResult = await runner.runWithWordSkill(
  "Extract all action items from this document"
);
```

### Using Custom Skills

```typescript
import { createSkillsRunner, customSkill } from "@orchestrator/skills-runner";

const runner = createSkillsRunner();

// Use a custom skill
const result = await runner.runWithCustomSkill(
  "Validate this code against our standards",
  "skill_orchestrator_code_validator",
  "v1.0.0" // optional version
);

// Or use the helper function
const result2 = await runner.run(
  "Check this data against our schema",
  [customSkill("skill_orchestrator_schema_validator")]
);
```

### Combining Multiple Skills

```typescript
import {
  createSkillsRunner,
  AnthropicSkills,
  customSkill
} from "@orchestrator/skills-runner";

const runner = createSkillsRunner();

// Combine Anthropic and custom skills
const result = await runner.runWithMultipleSkills(
  "Extract data from this PDF and validate it against our schema",
  [
    AnthropicSkills.PDF,
    customSkill("skill_orchestrator_schema_validator"),
  ]
);
```

### Advanced Configuration

```typescript
import { SkillsRunner } from "@orchestrator/skills-runner";

const runner = new SkillsRunner({
  apiKey: "your-api-key", // Optional, defaults to ANTHROPIC_API_KEY env var
  model: "claude-3-7-sonnet-2025-09-29", // Optional
  maxTokens: 4096, // Optional
});

const result = await runner.run(
  "Your query here",
  [{ type: "anthropic", skill_id: "pdf", version: "latest" }]
);
```

## Available Anthropic Skills

The following pre-built skills are available:

- `pdf` - Process PDF documents
- `xlsx` - Process Excel spreadsheets
- `pptx` - Process PowerPoint presentations
- `docx` - Process Word documents

## Creating Custom Skills

Custom skills can be created and uploaded via the Anthropic Skills API. See the [Skills documentation](../../skills/README.md) for details on creating and uploading custom skills.

## API Reference

### `createSkillsRunner(config?)`

Create a new skills runner instance.

### `SkillsRunner.run(message, skills)`

Run a query with specified skills.

### `SkillsRunner.runWithPdfSkill(message)`

Run with the PDF skill.

### `SkillsRunner.runWithExcelSkill(message)`

Run with the Excel skill.

### `SkillsRunner.runWithPowerPointSkill(message)`

Run with the PowerPoint skill.

### `SkillsRunner.runWithWordSkill(message)`

Run with the Word skill.

### `SkillsRunner.runWithCustomSkill(message, skillId, version?)`

Run with a custom skill.

### `SkillsRunner.runWithMultipleSkills(message, skills)`

Run with multiple skills.

### `customSkill(skillId, version?)`

Helper to create a custom skill reference.

### `AnthropicSkills`

Pre-configured Anthropic skill definitions (PDF, XLSX, PPTX, DOCX).

## Learn More

- [Agent Skills Documentation](https://docs.anthropic.com/en/docs/build-with-claude/agent-skills)
- [Messages API](https://docs.anthropic.com/en/api/messages)
- [Custom Skills Guide](../../skills/README.md)
