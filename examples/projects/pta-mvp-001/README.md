# PTA-MVP-001: Prophetic Transcript Analyzer

**Example Project Demonstrating Advanced Orchestrator Features**

This is a reference implementation showing how to use the Drop-In Claude Orchestrator with:
- Hierarchical supervisor agent architecture
- Custom specialized agents
- Future-proof data schemas
- Phase gate enforcement
- Assembly line workflows

## What This Example Demonstrates

### ✅ Advanced Architecture Patterns
- **Hierarchical Supervision**: Queen Agent coordinates specialist agents
- **Assembly Line Workflow**: Mandatory execution order with phase gates
- **Future-Proof Design**: Reserved schema fields for zero-downtime feature additions
- **Custom Agents**: Six specialized agents for transcript analysis

### Project Overview

**Goal**: Analyze video transcripts with strategic focus filtering and competitive differentiation analysis.

**Architecture**: Hierarchical Supervisor Assembly Line

```
Queen Agent (Supervisor)
    ↓
Prophecy Engine Swarm (MUST RUN FIRST - defines future-proof schema)
    ↓
Ingestion Agent (YouTube transcript fetching + DB initialization)
    ↓
Segmenter Agent (NLP segmentation + focus filtering)
    ↓
Formatter Agent (JSON schema enforcement)
    ↓
Test Agent (BLOCKING phase gate - validation required)
    ↓
Queen Agent (Final delivery)
```

## Files in This Example

### Configuration
- **`config/project-config.yaml`** - Complete project configuration showing:
  - Hierarchical agent architecture
  - MoSCoW prioritization
  - Phase gate enforcement
  - Future-proof schema design
  - Zero-cost MVP stack

### Custom Agents
- **`agents/queen-agent.md`** - Supervisor orchestrating all other agents
- **`agents/prophecy-engine.md`** - Schema design with future-proof fields
- **`agents/ingestion-agent.md`** - YouTube transcript fetching
- **`agents/segmenter-agent.md`** - NLP segmentation and focus filtering
- **`agents/formatter-agent.md`** - JSON schema enforcement
- **`agents/test-agent.md`** - Validation with blocking phase gate

### Documentation
- **`INITIALIZATION-SUMMARY.md`** - Detailed initialization walkthrough

## Key Concepts Demonstrated

### 1. Hierarchical Supervisor Pattern
The Queen Agent coordinates all other agents, handling:
- Task delegation to specialists
- Error recovery and retry logic
- Graceful degradation strategies
- User escalation when needed

### 2. Future-Proof Schema Design
Reserved fields enable zero-downtime feature additions:
```yaml
spatial_tags: Array[String]    # Empty in MVP, ready for geospatial tags
geospatial_tag: String          # Empty in MVP, ready for location data
```

### 3. Phase Gate Enforcement
Test Agent is a BLOCKING gate - tests must pass before delivery:
```yaml
agents:
  test-agent:
    blocking: true
    phase_gate: true
    required_coverage: 80%
```

### 4. Workflow Guarantees
Mandatory execution order enforced:
```yaml
workflows:
  main:
    enforce_order: true
    first_agent: prophecy-engine  # MUST run first
```

## How to Use This Example

### Option 1: Reference for Your Project
Study the configuration and agent definitions to understand:
- How to structure hierarchical agents
- How to implement phase gates
- How to design future-proof schemas
- How to enforce workflow order

### Option 2: Adapt for Similar Projects
If you're building a transcript/content analysis tool:
1. Copy the agent structure
2. Modify for your specific needs
3. Adjust the schema and validation rules
4. Configure your data sources

### Option 3: Learn Advanced Patterns
Use this as a learning resource for:
- Multi-agent coordination
- Error handling strategies
- Quality assurance gates
- Scalable architecture design

## Timeline & Scope

- **Timeline**: 1-week MVP
- **Architecture**: Hierarchical Supervisor Assembly Line
- **Zero-Cost Stack**: SQLite, free APIs, free deployment tier

## MoSCoW Prioritization

**MUST HAVE** (MVP):
- Transcript ingestion from YouTube
- Spatial schema (even if empty fields)
- Schema compliance validation
- Focus filtering (TECHNICAL/MARKETING/GENERAL)

**SHOULD HAVE**:
- Competitive analysis
- Content repurposing suggestions

**COULD HAVE**:
- Markdown report generation
- Multiple format exports

**WON'T HAVE** (Out of MVP scope):
- User accounts
- Multi-video search
- Real-time processing

## Technical Stack

```yaml
database: SQLite
api: YouTube Transcript API (free tier)
nlp: spaCy / NLTK
deployment: Vercel free tier
testing: pytest (80% coverage target)
```

## Quality Metrics

- **Test Coverage**: 80% minimum (enforced by blocking phase gate)
- **Schema Validation**: 100% compliance with Prophecy Contract
- **Integration Tests**: Full pipeline validation
- **Error Handling**: Graceful degradation with user escalation

## Using This Configuration

To use this example configuration in your project:

```bash
# 1. Copy the configuration
cp examples/projects/pta-mvp-001/config/project-config.yaml .claude/config.yaml

# 2. Copy the custom agents
cp examples/projects/pta-mvp-001/agents/* .claude/agents/

# 3. Customize for your project
# Edit .claude/config.yaml with your specifics

# 4. Initialize
# Claude will now use your hierarchical architecture
```

## Key Takeaways

1. **Supervisor Pattern**: Use a coordinator agent for complex workflows
2. **Future-Proof Design**: Reserve schema fields for upcoming features
3. **Phase Gates**: Block progression until quality criteria met
4. **Workflow Order**: Enforce critical dependency sequences
5. **Error Recovery**: Implement retry logic and graceful degradation

## Related Documentation

- [Main README](../../../README.md) - Orchestrator overview
- [Initialization Workflow](../../../.claude/INITIALIZATION-WORKFLOW.md) - Setup guide
- [Custom Agents](../../../docs/customizing.md) - Creating your own agents

## Questions?

This is a reference example. For questions about:
- **The orchestrator framework**: See main [README](../../../README.md)
- **Creating custom agents**: See [docs/customizing.md](../../../docs/customizing.md)
- **This specific example**: Review the files in this directory

---

**Note**: This is an example/reference implementation, not a required part of the orchestrator framework. Use it as inspiration for your own projects.
