# MAOS: Multi-Agent Optimization System

## Overview

The Multi-Agent Optimization System (MAOS) is a specialized agent within the Drop-In Claude Orchestrator that provides silent, autonomous optimization of your existing codebase using Anthropic best practices and documentation patterns.

## What is MAOS?

MAOS is a meta-orchestrator that deploys multiple specialized subagents to analyze and optimize your project without requiring manual intervention or producing verbose output. It's designed for:

- **Silent Operation**: Works in the background with minimal token usage
- **Project-Aware**: Auto-detects your technology stack and applies appropriate patterns
- **Non-Invasive**: Optimizes existing code without changing project structure
- **Documentation-Driven**: Uses Anthropic Developer Guide patterns and MCP best practices
- **Safe**: Validates all changes and respects existing functionality

## When to Use MAOS

Use MAOS when you want to:

- Apply Anthropic best practices across your codebase
- Standardize error handling and security patterns
- Optimize performance without breaking changes
- Improve code quality and maintainability
- Ensure consistency with modern patterns
- Validate your implementation against best practices

**Don't use MAOS for**:
- Adding new features (use @coder instead)
- Debugging specific issues (use @stuck instead)
- Research tasks (use @research instead)
- Major refactoring or restructuring

## How It Works

### Subagent Architecture

MAOS deploys six autonomous subagents that work in parallel:

#### 1. ALPHA (Project Scanner)
Discovers and maps your project structure:
- Identifies project type (Next.js, Python, Go, etc.)
- Locates configuration files
- Maps architecture patterns
- Caches project metadata

#### 2. BETA (Documentation Compiler)
Fetches and caches Anthropic best practices:
- Developer Guide patterns
- MCP connector documentation
- AI Agent architectures
- Claude Code CLI skills
- Security and performance patterns

#### 3. GAMMA (Pattern Analyzer)
Analyzes your existing code:
- Identifies current patterns and conventions
- Maps optimization opportunities
- Respects architectural decisions
- Queues targeted refinements

#### 4. DELTA (Code Optimizer)
Applies optimizations across four parallel threads:
- **Thread 1**: Error handling standardization
- **Thread 2**: Performance optimization
- **Thread 3**: Security pattern implementation
- **Thread 4**: Code consistency enforcement

#### 5. EPSILON (Testing Validator)
Validates all changes:
- Runs existing test suites
- Ensures no breaking changes
- Validates optimizations
- Checks dependency compatibility

#### 6. ZETA (Resource Manager)
Maintains execution environment:
- Keeps Docker context persistent
- Prevents context switching
- Manages resource caching
- Monitors efficiency

### Execution Flow

```
1. Deploy ZETA (Resource Manager - Daemon)
   ↓
2. Deploy ALPHA (Project Scanner)
   ↓ (awaits ALPHA_COMPLETE)
3. Deploy BETA + GAMMA (Parallel)
   ↓ (awaits BETA_COMPLETE + GAMMA_COMPLETE)
4. Deploy DELTA (Multi-threaded Optimization)
   ↓ (awaits DELTA_COMPLETE)
5. Deploy EPSILON (Validation)
   ↓ (awaits EPSILON_COMPLETE)
6. Emit completion signal
```

## Supported Project Types

MAOS auto-detects and optimizes:

### Languages & Frameworks
- **JavaScript/TypeScript**: Node.js, React, Next.js, Vue, Nuxt, Angular, Svelte
- **Python**: Django, FastAPI, Flask, general Python
- **Go**: Standard library, frameworks
- **Rust**: Cargo-based projects
- **Ruby**: Rails, Sinatra, general Ruby
- **PHP**: Laravel, WordPress, Composer projects
- **Java**: Maven, Gradle projects
- **C#**: .NET projects
- **Elixir**: Mix projects

### Project Categories
- **Frontend**: Component optimization, bundle size, render performance
- **Backend**: API optimization, database queries, caching layers
- **Full-stack**: End-to-end optimization, API contracts, shared types
- **Library**: API surface, tree-shaking, type definitions
- **CLI**: Command parsing, error messages, help documentation
- **Microservice**: Service boundaries, error handling, logging

## Optimization Areas

### 1. Code Quality
- Remove dead code
- Standardize formatting
- Improve variable naming
- Add missing error handling
- Apply DRY principles
- Implement SOLID patterns (where applicable)

### 2. Performance
- Optimize loops and iterations
- Implement appropriate caching
- Reduce redundant operations
- Optimize database queries
- Apply async patterns
- Implement resource pooling

### 3. Security
- Validate all inputs
- Sanitize outputs
- Check authentication/authorization
- Remove hardcoded credentials
- Implement security best practices

### 4. Error Handling
- Consistent error messages
- Graceful degradation
- Retry logic where appropriate
- Proper error propagation

### 5. Testing
- Improve test coverage
- Add edge case tests
- Validate error scenarios
- Ensure all tests pass

### 6. Maintainability
- Add missing documentation
- Improve code organization
- Standardize patterns
- Reduce complexity

## Usage

### Basic Usage

```
@maos
```

That's it! MAOS will:
1. Scan your project
2. Apply appropriate optimizations
3. Validate all changes
4. Report completion

### Configuration

Enable MAOS in `.claude/config.yaml`:

```yaml
agents:
  maos:
    enabled: true
    definition: ".claude/agents/maos.md"
    autonomy: silent              # silent | verbose
    max_changes_per_file: 10      # Limit scope
    require_tests_pass: true      # Phase gate
```

### Advanced Options

```yaml
maos:
  optimization_profiles:
    - code_quality
    - performance
    - security
    - error_handling
    - testing
    - maintainability

  excluded_paths:
    - "node_modules/**"
    - "dist/**"
    - "build/**"
    - ".next/**"

  token_budget:
    max_per_run: 60
    subagent_output: 0

  docker:
    maintain_context: true
    prevent_switching: true
```

## What MAOS Won't Do

MAOS is designed with strict boundaries:

### Prohibited Actions
- Access external repositories
- Add new features or functionality
- Modify project structure
- Add new dependencies
- Change configuration files (beyond optimization)
- Produce verbose progress reports
- Request user input during execution
- Expand scope beyond current project

### Respect Existing
- File organization
- Naming conventions
- Architecture patterns
- Dependency choices
- Test frameworks
- Documentation style

## Output Format

MAOS produces minimal output:

```
[MAOS] OPTIMIZATION COMPLETE

Project: Next.js 14 Full-stack
Files optimized: 47
Patterns applied: 12
Tests status: 156 PASS / 0 FAIL
Ready: TRUE
```

## Token Efficiency

MAOS is designed for maximum token efficiency:

- **Orchestrator output**: <15 tokens
- **Subagent output**: 0 tokens (silent execution)
- **Completion signals**: 1 token each
- **Total interaction**: <60 tokens

This makes MAOS ideal for:
- Large codebases
- Frequent optimization runs
- Resource-constrained environments
- Batch processing

## Safety & Guardrails

### Validation Gates
1. **Pre-optimization**: Backup current state
2. **During optimization**: Respect existing patterns
3. **Post-optimization**: Validate all tests pass
4. **Rollback**: Automatic if tests fail

### Scope Enforcement
- Current project directory only
- No external repository access
- No new dependencies
- No structural changes

### Test Requirements
- All existing tests must pass
- No breaking changes allowed
- Coverage must not decrease
- Performance must not degrade

## Integration with Other Agents

MAOS can be combined with other orchestrator agents:

### Before Other Agents
```
1. @maos              # Optimize codebase first
2. @research          # Research new feature
3. @coder             # Implement on clean base
4. @tester            # Validate
```

### After Other Agents
```
1. @coder             # Implement feature
2. @tester            # Validate
3. @maos              # Apply best practices
4. @master-docs       # Document
```

### Periodic Optimization
```
# Weekly optimization
@maos

# Before major releases
@maos
@tester
@master-devops
```

## Troubleshooting

### MAOS Not Running
```bash
# Check configuration
cat .claude/config.yaml | grep -A 5 "maos:"

# Verify agent definition exists
ls .claude/agents/maos.md
```

### Optimizations Too Aggressive
Adjust configuration:
```yaml
maos:
  max_changes_per_file: 5     # Reduce from 10
  conservative_mode: true     # Add this
```

### Tests Failing After MAOS
MAOS automatically rolls back if tests fail, but you can:
```bash
# Review what changed
git diff

# Manually rollback if needed
git checkout .
```

### Performance Issues
```yaml
maos:
  docker:
    maintain_context: true    # Keep this enabled

  parallel_threads: 2         # Reduce from 4 if needed
```

## Best Practices

### 1. Run Before Major Changes
Clean up technical debt before adding features:
```
@maos
# Review results
@coder [implement new feature]
```

### 2. Periodic Maintenance
Schedule regular optimization runs:
- Weekly for active projects
- Monthly for stable projects
- Before releases
- After major refactors

### 3. Review Logs
Check what MAOS optimized:
```bash
cat .claude/logs/$(date +%Y-%m-%d)/maos-run.log
```

### 4. Combine with CI
Integrate MAOS into your workflow:
```yaml
# .github/workflows/optimize.yml
- name: Run MAOS
  run: claude-cli @maos
```

### 5. Use with Guardrails
Leverage existing safety features:
```yaml
guardrails:
  require_tests_to_pass: true
  protected_files:
    - ".env*"
    - "infra/**"
```

## Examples

### Example 1: Next.js Project
```
User: @maos

[MAOS] OPTIMIZATION COMPLETE

Project: Next.js 14 Full-stack
Files optimized: 52
Patterns applied:
  - Error boundary standardization (8 files)
  - API route error handling (12 files)
  - Component memoization (15 files)
  - Type safety improvements (17 files)
Tests status: 203 PASS / 0 FAIL
Ready: TRUE
```

### Example 2: Python FastAPI
```
User: @maos

[MAOS] OPTIMIZATION COMPLETE

Project: Python FastAPI
Files optimized: 31
Patterns applied:
  - Exception handling standardization (9 files)
  - Async/await optimization (7 files)
  - Input validation (11 files)
  - Type hints improvement (4 files)
Tests status: 89 PASS / 0 FAIL
Ready: TRUE
```

### Example 3: Go Microservice
```
User: @maos

[MAOS] OPTIMIZATION COMPLETE

Project: Go Microservice
Files optimized: 24
Patterns applied:
  - Error wrapping standardization (8 files)
  - Context propagation (6 files)
  - Logging consistency (10 files)
Tests status: 142 PASS / 0 FAIL
Ready: TRUE
```

## Anthropic Documentation Integration

MAOS automatically applies patterns from:

- **[Anthropic Developer Guide](https://docs.anthropic.com)**: Best practices for AI integration
- **MCP Connector Documentation**: Optimal server patterns
- **Claude Code CLI Skills**: Tool usage patterns
- **Security Best Practices**: OWASP and industry standards
- **Performance Optimization**: Language-specific patterns
- **Testing Frameworks**: Comprehensive coverage strategies

## Roadmap

### v1.0 (Current)
- Core MAOS functionality
- Universal project detection
- Silent optimization mode
- Six specialized subagents

### v1.1 (Planned)
- Custom optimization profiles
- Project-specific rules
- Enhanced reporting options
- Integration with master agents

### v2.0 (Future)
- Machine learning pattern detection
- Historical optimization tracking
- Team-wide consistency enforcement
- Cloud-based pattern library

## Contributing

MAOS is part of the Drop-In Claude Orchestrator. Contributions welcome:

- Additional project type handlers
- New optimization patterns
- Language-specific optimizations
- Documentation improvements

## License

MIT License - see [LICENSE](../LICENSE) for details.

---

**MAOS**: Silent optimization. Maximum efficiency. Zero scope creep.

Start with: `@maos`
