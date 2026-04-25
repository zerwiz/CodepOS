# Response Schemas

## Base Response

```python
from pydantic import BaseModel, Field

class BaseResponse(BaseModel):
    """Base response schema."""
    agent_id: str = Field(..., description="Agent that processed request")
    status: str = Field(..., description="Result status")
    result: dict = Field(default_factory=dict, description="Operation result")
    metadata: dict = Field(default_factory=dict, description="Additional metadata")
```

### Success Response

```json
{
  "agent_id": "com.atelier.analyzer",
  "status": "success",
  "result": {
    "request_id": "req-67890",
    "timestamp": "2025-04-24T12:00:00Z",
    "duration_ms": 1523,
    "data": {...}
  },
  "metadata": {
    "workspace_id": "ws-12345",
    "request_id": "req-67890"
  }
}
```

### Error Response

```json
{
  "agent_id": "com.atelier.analyzer",
  "status": "error",
  "result": {},
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "Path does not exist",
    "details": {}
  },
  "metadata": {
    "workspace_id": "ws-12345"
  }
}
```

## File Response Types

### FileReadResponse

```python
class FileReadResponse(BaseResponse):
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier.analyzer",
                "status": "success",
                "result": {
                    "request_id": "req-67890",
                    "content": "print('Hello, World!')",
                    "encoding": "utf-8",
                    "size_bytes": 23
                },
                "metadata": {"path": "README.md"}
            }
        }
    
    content: str = Field(..., description="File content")
    encoding: str = Field(..., description="File encoding")
    size_bytes: int = Field(..., description="File size in bytes")
```

### FileWriteResponse

```python
class FileWriteResponse(BaseResponse):
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier.implementer",
                "status": "success",
                "result": {
                    "request_id": "req-67890",
                    "bytes_written": 23,
                    "path": "src/utils.py",
                    "mode": "644"
                },
                "metadata": {}
            }
        }
    
    bytes_written: int = Field(..., description="Bytes written")
    path: str = Field(..., description="File path")
    mode: str = Field(..., description="File mode")
```

## Command Response Types

### CommandExecutionResponse

```python
class CommandExecutionResponse(BaseResponse):
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier.analyzer",
                "status": "success",
                "result": {
                    "request_id": "req-67890",
                    "command": "git log --oneline",
                    "stdout": "commit abc123\nAuthor: Jane Doe",
                    "stderr": "",
                    "exit_code": 0,
                    "duration_ms": 123
                },
                "metadata": {}
            }
        }
    
    command: str = Field(default="").description="Executed command"
    stdout: str = Field(..., description="Standard output")
    stderr: str = Field(default="", description="Standard error")
    exit_code: int = Field(..., description="Exit code")
    duration_ms: float = Field(..., description="Duration in milliseconds")
```

## Analysis Response Types

### AnalysisReportResponse

```python
class AnalysisReportResponse(FileReadResponse):
    class Config:
        json_schema_extra = {
            "example": {
                "agent_id": "com.atelier.analyzer",
                "status": "success",
                "result": {
                    "files_analyzed": 150,
                    "complexity_score": 42,
                    "issues": [
                        {
                            "id": "ISS-001",
                            "type": "code_smell",
                            "severity": "medium",
                            "file": "src/old_module.py",
                            "line": 45,
                            "column": 2,
                            "message": "Large function (105 lines)"
                        }
                    ],
                    "metrics": {
                        "loc": 15000,
                        "cyclomatic_complexity": 125,
                        "maintainability_index": 67
                    }
                },
                "metadata": {}
            }
        }
    
    files_analyzed: int = Field(..., description="Number of files analyzed")
    complexity_score: float = Field(..., description="Overall complexity score")
    issues: list[Issue] = Field(default_factory=list, description="Found issues")
    metrics: dict = Field(default_factory=dict, description="Code metrics")

class Issue(BaseModel):
    """Code issue or finding."""
    id: str = Field(..., description="Issue identifier")
    type: str = Field(..., description="Issue type")
    severity: str = Field(..., description="Issue severity")
    file: str = Field(..., description="Affected file")
    line: int | None = Field(None, description="Line number")
    column: int | None = Field(None, description="Column number")
    message: str = Field(..., description="Issue message")
    suggestions: list[str] = Field(default_factory=list, description="Fix suggestions")
```

---

## Response Status Codes

| Status | Description |
|--|---|
| `success` | Operation completed successfully |
| `partial` | Partial success with warnings |
| `warning` | Completed with warnings |
| `error` | Operation failed |
| `timeout` | Operation timed out |

---

*See [AGENT-RESPONSES.md](./AGENT-RESPONSES.md) for agent-specific responses*
