# Development Guidelines

## Philosophy

CodepOS Elite follows these development guidelines to ensure:
- **Type Safety**: Strict TypeScript checks
- **Test-Driven**: All tests written before implementation
- **File-Based**: YAML configuration for agent ops
- **pi.dev Compliance**: Full ecosystem alignment

---

## Coding Style

### Python (Backend)

```python
# Type hints required
def analyze(code: str) -> AnalysisResult:
    """Analyze code and return metrics."""
    ...

# Pydantic models for validation
from pydantic import BaseModel

class AgentConfig(BaseModel):
    agent_id: str
    timeout: int = 30
    sandbox: bool = True
```

### TypeScript (Frontend)

```typescript
// Strict mode
"strict": true

// Type guards
function isAgent(agent: any): agent is Agent {
    return typeof agent.id === 'string';
}

// Error handling
type Result<T> = {
    success: true;
    value: T;
} | {
    success: false;
    error: string;
};
```

---

## Testing Strategy

### Unit Tests

```python
# tests/test_analyzer.py
from unittest.mock import patch
from analyzer import AnalyzerAgent

def test_analyzer_health():
    agent = AnalyzerAgent()
    result = agent.invoke("health")
    assert result["status"] == "ok"
```

### Integration Tests

```python
# tests/test_workflow.py
def test_analyze_workflow():
    result = workflow("analyze", {"files": ["./"]})
    assert result["files_analyzed"] > 0
```

---

## Workflow Definitions

### justfile Syntax

```bash
# Workflow: Analyze
analyze:
    # Validate config
    [test -f .pi/multi-team/multi-team-config.yaml] || exit 1
    
    # Load agents
    python -m apps.backend.registry.load .pi/multi-team/multi-team-config.yaml
    
    # Run analysis
    python -m apps.backend.agents.analyzer analyze {files}
    
    # Validate results
    python -m apps.backend.agents.validate analysis
    
# Workflow: Review
review:
    review:
    [test -f .pi/multi-team/multi-team-config.yaml] || exit 1
    
    # Run review
    python -m apps.backend.agents.reviewer review {files}
    
    # Validate results
    python -m apps.backend.agents.validate review
```

---

## Error Handling

```python
# Result<T,E> pattern
from dataclasses import dataclass

@dataclass
class Result:
    success: bool
    value: Optional[Any] = None
    error: Optional[str] = None
    
def safe_invoke(operation: str, **kwargs) -> Result:
    try:
        result = agent.invoke(operation, **kwargs)
        return Result(success=True, value=result)
    except AgentError as e:
        return Result(
            success=False, 
            error=str(e),
            traceback=traceback.format_exc()
        )
```

---

## Performance Optimization

```python
# Caching
from functools import lru_cache

@lru_cache(maxsize=32)
def analyze_file(code: str) -> AnalysisResult:
    return compute_metrics(code)

# Async operations
import asyncio

async def concurrent_analyze(files: List[str]) -> List[AnalysisResult]:
    tasks = [analyzer.analyze(f) for f in files]
    return await asyncio.gather(*tasks)
```

---

## Security

```python
# Sandboxed execution
import subprocess

def analyze_sandboxed(code: str, timeout: int = 30) -> str:
    with sandbox(timeout) as context:
        context.set_permission("r", files=[f"*.{ext}" for ext in EXTENSIONS])
        return context.run_script(code)
```

---

## Documentation

### Docstrings

```python
def analyze(code: str) -> AnalysisResult:
    """
    Analyze code and return metrics.
    
    Args:
        code: Source code to analyze
        
    Returns:
        AnalysisResult with metrics
        
    Raises:
        AgentError: If analysis fails
    """
    ...
```

---

## Code Review Checklist

- [ ] Type hints complete
- [ ] Error handling present
- [ ] Tests written
- [ ] Documentation updated
- [ ] Security boundaries respected
- [ ] pi.dev compliance verified
- [ ] Performance optimized