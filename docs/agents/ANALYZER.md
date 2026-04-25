# Analyzer Agent Documentation

## Purpose

The Analyzer Agent provides comprehensive code analysis capabilities, including static analysis, pattern recognition, and complexity measurement.

## Capabilities

Supported operations:

- ✅ Static Analysis
- ✅ Dependency Tree
- ✅ Code Metrics
- ✅ Code Smells
- ✅ Security Scanning
- ❌ Test Execution

### Static Analysis

Analyzes code structure, patterns, and issues:

```python
async def analyze_code(self, request: Request) -> Response:
    """
    Analyzes code for patterns and issues.
    
    Args:
        request: Request containing paths and analysis options
    
    Returns:
        AnalysisReport with findings
    """
```

### Dependency Tree

Builds dependency graphs:

```python
async def analyze_dependencies(self, request: Request) -> Response:
    """
    Builds dependency tree for workspace.
    """
```

### Code Metrics

Computes complexity metrics:

- Cyclomatic Complexity
- Lines of Code
- Code Density
- Halstead Metrics

### Security Scanning

Checks for common vulnerabilities:

- OWASP Top 10
- Dependency vulnerabilities
- Code injection risks
- XSS vulnerabilities

## Request Format

```json
{
  "agent_id": "com.atelier.analyzer",
  "operation": "static_analysis",
  "parameters": {
    "paths": ["src/**/*.py"],
    "exclude": ["node_modules/**", ".git/**"],
    "include_dependencies": true,
    "depth": 3
  }
}
```

## Response Format

```json
{
  "agent_id": "com.atelier.analyzer",
  "status": "success",
  "result": {
    "type": "analysis_report",
    "data": {
      "files_analyzed": 150,
      "complexity_score": 42,
      "issues": [
        {
          "id": "ISS-001",
          "type": "code_smell",
          "severity": "medium",
          "file": "src/old_module.py",
          "line": 45,
          "message": "Large function (> 100 lines)"
        }
      ],
      "metrics": {
        "loc": 15000,
        "cyclomatic_complexity": 125,
        "maintainability_index": 67
      }
    }
  }
}
```

## Error Responses

### File Not Found

```json
{
  "agent_id": "com.atelier.analyzer",
  "status": "error",
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "Path does not exist: /nonexistent/file.py"
  }
}
```

### Invalid Configuration

```json
{
  "agent_id": "com.atelier.analyzer",
  "status": "error",
  "error": {
    "code": "INVALID_CONFIG",
    "message": "Invalid configuration: 'include_dependencies' must be boolean"
  }
}
```

## Usage Examples

### Python Code Analysis

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "com.atelier.analyzer",
    "operation": "static_analysis",
    "parameters": {
      "paths": ["src/**/*.py"],
      "exclude": ["node_modules/**"]
    }
  }' \
  http://harness:8080/api/v1/agents/com.atelier.analyzer/invoke
```

### Dependency Tree Generation

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "com.atelier.analyzer",
    "operation": "dependency_tree",
    "parameters": {
      "paths": ["package.json"],
      "depth": 3
    }
  }' \
  http://harness:8080/api/v1/agents/com.atelier.analyzer/invoke
```

## Performance Considerations

- File size limit: 10MB per file
- Rate limit: 10 requests/min per workspace
- Background processing for large codebases
- Results cached where appropriate
