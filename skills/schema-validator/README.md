# Schema Validator Skill

Validates data against JSON schemas for the Drop-In Claude Orchestrator.

## Features

- ✅ JSON Schema compliance checking
- ✅ Type validation
- ✅ Required field validation
- ✅ Custom validation rules
- ✅ Detailed error reporting

## Usage

```typescript
import { createSkillsRunner, customSkill } from "@orchestrator/skills-runner";

const runner = createSkillsRunner();

const result = await runner.run(
  "Validate this data against the schema",
  [customSkill("skill_orchestrator_schema_validator", "v1.0.0")]
);
```

## Input Format

```json
{
  "data": { ... },
  "schema": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "age": { "type": "number" }
    },
    "required": ["name"]
  }
}
```

## Output Format

```json
{
  "valid": true,
  "errors": []
}
```

## Versions

- `v1.0.0` - Initial release with JSON Schema Draft 7 support
