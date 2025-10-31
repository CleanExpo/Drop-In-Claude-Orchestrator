# Custom Agent Skills

This directory contains custom Agent Skills for the Drop-In Claude Orchestrator.

## What are Agent Skills?

Agent Skills are packaged instruction/code resources that can be executed via Claude's code execution tool. They can be:

- **Anthropic-managed**: Pre-built skills like PDF, Excel, PowerPoint processing
- **Custom**: Your own skills uploaded via the Skills API

Both types integrate similarly via the `container.skills` parameter in the Messages API.

## Directory Structure

```
skills/
├── code-validator/          # Example: Code validation skill
│   ├── v1.0.0/             # Version-specific implementation
│   │   ├── skill.yaml      # Skill metadata
│   │   ├── main.py         # Skill implementation
│   │   ├── requirements.txt # Dependencies
│   │   └── test.py         # Unit tests
│   └── README.md           # Skill documentation
├── schema-validator/        # Example: Schema validation skill
│   ├── v1.0.0/
│   │   ├── skill.yaml
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── test.py
│   └── README.md
└── README.md               # This file
```

## Creating a Custom Skill

### 1. Create the directory structure

```bash
mkdir -p skills/my-skill/v1.0.0
cd skills/my-skill/v1.0.0
```

### 2. Create skill.yaml

```yaml
name: my-skill
version: 1.0.0
description: "Brief description of what the skill does"
runtime: python  # or node, bash
entry_point: main.py
dependencies:
  - requirements.txt
```

### 3. Implement the skill

```python
# main.py
def execute(input_data):
    """
    Main entry point for the skill.

    Args:
        input_data: Input from Claude

    Returns:
        Result to return to Claude
    """
    # Your skill logic here
    return {"status": "success", "result": "..."}

if __name__ == "__main__":
    import sys
    import json

    input_data = json.loads(sys.stdin.read())
    result = execute(input_data)
    print(json.dumps(result))
```

### 4. Add dependencies

```txt
# requirements.txt
pydantic>=2.0.0
requests>=2.31.0
```

### 5. Write tests

```python
# test.py
import unittest
from main import execute

class TestMySkill(unittest.TestCase):
    def test_basic_execution(self):
        result = execute({"test": "data"})
        self.assertEqual(result["status"], "success")

if __name__ == "__main__":
    unittest.main()
```

### 6. Document the skill

```markdown
# My Skill

Brief description and usage instructions.

## Usage

\`\`\`typescript
import { customSkill } from "@orchestrator/skills-runner";

const skill = customSkill("skill_my_skill_id", "v1.0.0");
\`\`\`
```

## Uploading Custom Skills

Skills are uploaded via the Anthropic Skills API. Create a helper script:

```bash
# scripts/skills/upload.sh
#!/bin/bash

SKILL_NAME=$1
VERSION=$2

echo "Uploading skill: $SKILL_NAME v$VERSION"

# Package the skill
cd skills/$SKILL_NAME/$VERSION
tar -czf ../../../$SKILL_NAME-$VERSION.tar.gz .

# Upload via API
curl -X POST https://api.anthropic.com/v1/skills \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "'$SKILL_NAME'",
    "version": "'$VERSION'",
    "archive": "@'$SKILL_NAME-$VERSION'.tar.gz"
  }'
```

## Using Custom Skills

### Via Skills Runner

```typescript
import { createSkillsRunner, customSkill } from "@orchestrator/skills-runner";

const runner = createSkillsRunner();

const result = await runner.run(
  "Validate this code",
  [customSkill("skill_code_validator", "v1.0.0")]
);
```

### Via Messages API

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-3-7-sonnet-2025-09-29",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Validate this code" }],
  container: {
    skills: [
      { type: "custom", skill_id: "skill_code_validator", version: "v1.0.0" }
    ]
  }
});
```

## Example Skills

### Code Validator

Validates code against the orchestrator's coding standards:
- Checks write scopes
- Enforces protected files
- Validates test coverage
- Checks type safety

[See implementation →](./code-validator/README.md)

### Schema Validator

Validates data against JSON schemas:
- Schema compliance checking
- Type validation
- Required field validation
- Custom validation rules

[See implementation →](./schema-validator/README.md)

## Best Practices

1. **Version your skills** - Use semantic versioning (v1.0.0, v1.1.0, etc.)
2. **Write tests** - Include unit tests for all skill logic
3. **Document inputs/outputs** - Clear documentation of expected data structures
4. **Handle errors gracefully** - Return structured error responses
5. **Keep skills focused** - One skill = one responsibility
6. **Use type hints** - For Python skills, use type hints for clarity
7. **Validate inputs** - Always validate input data before processing

## CI Integration

Add skill testing to your CI pipeline:

```yaml
# .github/workflows/test-skills.yml
name: Test Skills

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Test all skills
        run: |
          for skill in skills/*/; do
            echo "Testing $skill"
            cd "$skill"
            for version in v*/; do
              cd "$version"
              python test.py
              cd ..
            done
            cd ../..
          done
```

## Learn More

- [Agent Skills Documentation](https://docs.anthropic.com/en/docs/build-with-claude/agent-skills)
- [Skills API Reference](https://docs.anthropic.com/en/api/skills)
- [Skills Runner Package](../packages/skills-runner/README.md)
