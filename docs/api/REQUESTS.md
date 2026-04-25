# Request Schemas

## Types

### AgentRequest

Base agent request with common fields.

```python
from pydantic import BaseModel, Field

class AgentRequest(BaseModel):
    """Base agent request."""
    agent_id: str = Field(..., description="Agent identifier")
    workspace_id: str = Field(..., description="Workspace identifier")
    operation: str = Field(..., description="Operation to perform")
    parameters: dict = Field(default_factory=dict, description="Operation parameters")
```

### FileReadRequest

```python
class FileReadRequest(AgentRequest):
    """Read file(s) from workspace."""
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier.analyzer",
                "workspace_id": "ws-12345",
                "operation": "read_files",
                "parameters": {
                    "paths": ["src/**/*.py", "README.md"]
                }
            }
        }
    
    paths: list[str] = Field(..., description="Files to read")
    encoding: str | None = Field(None, default="utf-8")
```

### FileWriteRequest

```python
class FileWriteRequest(AgentRequest):
    """Write file to workspace."""
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier.implementer",
                "workspace_id": "ws-12345",
                "operation": "write_file",
                "parameters": {
                    "path": "src/utils.py",
                    "content": "def hello():\n    print('Hello!')\n",
                    "overwrite": True,
                    "mode": "644"
                }
            }
        }
    
    path: str = Field(..., description="File path")
    content: str = Field(..., description="File content")
    overwrite: bool = Field(True, default=True)
    mode: str | None = Field(None, default="644")
```

### CommandExecutionRequest

```python
class CommandExecutionRequest(AgentRequest):
    """Execute shell command."""
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier.analyzer",
                "workspace_id": "ws-12345",
                "operation": "execute_command",
                "parameters": {
                    "command": "git log --oneline",
                    "args": [],
                    "cwd": None,
                    "timeout": 30,
                    "stream": True
                }
            }
        }
    
    command: str = Field(..., description="Command to execute")
    args: list[str] = Field(default_factory=list, description="Command arguments")
    cwd: str | None = Field(None, description="Working directory")
    timeout: int = Field(30, description="Timeout in seconds")
    stream: bool = Field(False, description="Stream output")
```

### CodeSearchRequest

```python
class CodeSearchRequest(AgentRequest):
    """Search for code patterns."""
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier.analyzer",
                "workspace_id": "ws-12345",
                "operation": "search_code",
                "parameters": {
                    "pattern": "def .*\\\\([^)]*:.*\\\):",  # Python functions
                    "files": ["src/**/*.py"],
                    "limit": 100,
                    "context_lines": 3
                }
            }
        }
    
    pattern: str = Field(..., description="Search pattern (regex)")
    files: list[str] | None = Field(None, description="Files to search")
    limit: int = Field(100, description="Max results")
    context_lines: int = Field(3, description="Context lines")
    fuzzy: bool = Field(True, description="Enable fuzzy matching")
```

### GitOpRequest

```python
class GitOpRequest(AgentRequest):
    """Git operations."""
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier.implementer",
                "workspace_id": "ws-12345",
                "operation": "git_operation",
                "parameters": {
                    "command": "commit",
                    "message": "Initial commit",
                    "add_paths": ["src/**"],
                    "sign": False
                }
            }
        }
    
    command: str = Field(..., description="Git command")
    message: str | None = Field(None, description="Commit message")
    add_paths: list[str] | None = Field(None, description="Paths to add")
    sign: bool = Field(False, description="GPG sign")
    author: dict | None = Field(None, description="Author details")
```

### LintRequest

```python
class LintRequest(AgentRequest):
    """Run linter."""
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier.reviewer",
                "workspace_id": "ws-12345",
                "operation": "lint",
                "parameters": {
                    "linter": "ruff",
                    "paths": ["src/**/*.py"],
                    "fix": False,
                    "output_format": "json"
                }
            }
        }
    
    linter: str = Field(..., description="Linter to use")
    paths: list[str] | None = Field(None, description="Paths to lint")
    fix: bool = Field(False, description="Auto-fix issues")
    output_format: str = Field("json", description="Output format")
```

### TestExecutionRequest

```python
class TestExecutionRequest(AgentRequest):
    """Run tests."""
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier-tester",
                "workspace_id": "ws-12345",
                "operation": "execute_tests",
                "parameters": {
                    "test_file": "tests/test_main.py",
                    "include": [],
                    "exclude": [],
                    "options": {
                        "-v": True,
                        "-q": False
                    },
                    "output_format": "json"
                }
            }
        }
    
    test_file: str | None = Field(None, description="Test file to run")
    include: list[str] | None = Field(None, description="Test paths to include")
    exclude: list[str] | None = Field(None, description="Test paths to exclude")
    options: dict | None = Field(None, description="Test runner options")
    output_format: str = Field("json", description="Output format")
```

---

*See [RESPONSES.md](./RESPONSES.md) for response schemas*
