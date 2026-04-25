# Core Agent Types

## Architecture

All core agents share a common interface and lifecycle:

```
┌────────────────────────────────────────────────────────────┐
│                      Agent Interface                         │
│                                                              │
│  abstract class Agent                                        │
│  │                                                            │
│  │  + name: str                                              │
│  │  + description: str                                        │
│  │  + capabilities: List[Capability]                          │
│  │                                                            │
│  │  + on_request(request: Request) -> Response                │
│  │  + on_complete(result: Result) -> None                    │
│  │  + on_error(error: Error) -> None                          │
│  └──────────────────────────────────────────────────────────┘
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Request Types                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Response Types                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Standard Capabilities

Every core agent supports these standard capabilities:

| Capability | Description |
|---|---|
| `read_files` | Read files from workspace |
| `write_files` | Write files to workspace |
| `execute_command` | Run shell commands |
| `search_code` | Code search and navigation |
| `git_operations` | Git commands |
| `lint` | Run linters |
| `format` | Code formatting |
| `test_files` | Run test files |
| `build` | Build artifacts |
| `deploy` | Deploy to environments |

## Agent Capabilities Matrix

| Capability       | Analyzer | Implementer | Reviewer | Tester | Deployer | Observer | Orchestrator |
|------------------|:--------:|:-----------:|:--------:|:------:|:--------:|:--------:|:----------:|
| `read_files`     | ✅       | ✅          | ✅       | ✅     | ✅       | ✅       | ✅         |
| `write_files`    | ✅       | ✅          | ✅       | ✅     | ✅       | ✅       | ✅         |
| `execute_command`| ✅       | ✅          | ✅       | ✅     | ✅       | ✅       | ✅         |
| `search_code`    | ✅       | ✅          | ✅       | ✅     | ✅       | ✅       | ✅         |
| `git_operations` | ✅       | ✅          | ✅       | ✅     | ✅       | ❌       | ✅         |
| `lint`           | ✅       | ✅          | ✅       | ✅     | ✅       | ✅       | ✅         |
| `format`         | ✅       | ✅          | ✅       | ✅     | ✅       | ❌       | ✅         |
| `test_files`     | ❌       | ✅          | ✅       | ✅     | ✅       | ✅       | ✅         |
| `build`          | ❌       | ✅          | ✅       | ✅     | ✅       | ✅       | ✅         |
| `deploy`         | ❌       | ✅          | ✅       | ✅     | ✅       | ❌       | ✅         |

## Request Types

```python
from atelier.requests import (
    AgentRequest,
    FileReadRequest,
    FileWriteRequest,
    CommandExecutionRequest,
    CodeSearchRequest,
    GitOpRequest,
    LintRequest,
    FormatRequest,
    TestExecutionRequest,
    BuildRequest,
    DeployRequest,
)

class AgentRequest:
    "Base request type"
    agent_id: str
    workspace_id: str
    operation: str
    parameters: dict
    
class FileReadRequest(AgentRequest):
    paths: List[str]
    
class FileWriteRequest(AgrentRequest):
    path: str
    content: str
    
class CommandExecutionRequest(AgentRequest):
    command: str
    args: List[str]
    cwd: Optional[str]
```

## Response Types

```python
from atelier.responses import (
    AgentResponse,
    FileReadResponse,
    FileWriteResponse,
    CommandExecutionResponse,
    CodeSearchResponse,
    GitOpResponse,
    LintResponse,
    FormatResponse,
    TestExecutionResponse,
    BuildResponse,
    DeployResponse,
)

class AgentResponse:
    "Base response type"
    agent_id: str
    status: str  # success | error | warning
    result: dict
    metadata: dict
    
class FileReadResponse(AgentResponse):
    content: str
    encoding: str
    
class FileWriteResponse(AgentResponse):
    bytes_written: int
```

## Error Handling

All agents use the standard error types:

| Error Type | Status Code | Description |
|---|---|---|
| `AgentError` | 400 | Invalid agent ID or unregistered |
| `RequestValidationError` | 400 | Invalid request parameters |
| `WorkspaceNotFoundError` | 404 | Workspace not found |
| `FileNotFoundError` | 404 | Requested file not found |
| `PermissionError` | 403 | Insufficient permissions |
| `CommandExecutionError` | 500 | Command execution failed |
| `RateLimitError` | 429 | Rate limit exceeded |
| `ResourceExhausted` | 503 | Resources unavailable |

## Agent Registration

Agents register via the harness registry:

```python
from atelier.registry import AgentRegistry

registry = AgentRegistry()

registry.register(
    name="com.atelier.analyzer",
    instance=AnalyzerAgent(),
    capabilities=["read_files", "execute_command", "lint", ...],
)

# Discover registered agents
agents = registry.agents()
```

## Agent Configuration

Each agent can be configured independently:

```python
from atelier.config import AgentConfig

analyzer_config = AgentConfig(
    name="com.atelier.analyzer",
    max_file_size="10MB",
    timeout=30,
    allowed_patterns=["*.py", "*.js", "*.ts"],
    ignored_patterns=["node_modules/**", ".git/**"],
)
```

---

*See individual agent docs for specific implementations*
