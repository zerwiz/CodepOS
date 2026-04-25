# Harness - CI/CD Pipeline Framework

A lightweight CI/CD pipeline orchestration framework.

## Agents

- **AnalyzeAgent** - Static code analysis, dependency scanning, vulnerability detection
- **DeveloperAgent** - Code generation, refactoring, unit test creation
- **CIBuildAgent** - Build processes, unit testing, artifact packaging
- **OrchestratorAgent** - Pipeline orchestration, stage management, workflow handling
- **DeployerAgent** - Deployment management, rollback, environment configuration

## Usage

```python
from harness import Manager

manager = Manager()
result = manager.run_pipeline(code_url="github.com/user/repo")
print(result)
```

## Directory Structure

```
.harness/
├── agents/
│   ├── __init__.py
│   ├── analyzer.py
│   ├── developer.py
│   ├── ci_builder.py
│   ├── orchestrator.py
│   └── deployer.py
├── managers/
│   └── manager.py
└── README.md
```

## License

MIT
