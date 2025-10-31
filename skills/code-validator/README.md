# Code Validator Skill

Validates code against the Drop-In Claude Orchestrator's coding standards and guardrails.

## Features

- ✅ Write scope validation
- ✅ Protected file checking
- ✅ Test coverage analysis
- ✅ TypeScript type safety checks
- ✅ Code style enforcement

## Usage

```typescript
import { createSkillsRunner, customSkill } from "@orchestrator/skills-runner";

const runner = createSkillsRunner();

const result = await runner.run(
  "Validate these code changes against our standards",
  [customSkill("skill_orchestrator_code_validator", "v1.0.0")]
);
```

## Input Format

```json
{
  "files": [
    {
      "path": "src/components/Button.tsx",
      "content": "...",
      "operation": "create" | "modify" | "delete"
    }
  ],
  "writeScope": ["src/**", "app/**"],
  "protectedFiles": [".env*", "infra/**"]
}
```

## Output Format

```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "file": "src/components/Button.tsx",
      "message": "Missing test coverage",
      "severity": "warning"
    }
  ]
}
```

## Versions

- `v1.0.0` - Initial release with basic validation
