"""
ScannerAgent - Static Code Analysis
==============================

Performs static analysis, linting, and code quality checks.
"""

import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional
import hashlib

@dataclass
class ScanResult:
    timestamp: str
    file: str
    issues: List[str] = field(default_factory=list)
    complexity: int = 0

class ScannerAgent:
    """
    Static code analysis agent.
    
    Responsibilities:
    - Code linting and style checking
    - Security vulnerability detection
    - Complexity analysis
    - Dependency auditing
    """
    
    # Linting rules
    LINT_RULES = {
        "python": [
            "no-unused-imports",
            "blank-line-after-function",
            "max-line-length-120",
            "no-eval",
            "no-assert",
            "prefer-type-hinting",
        ],
        "typescript": [
            "no-implicit-any",
            "prefer-const",
            "max-line-length-120",
            "no-eval",
            "prefer-readonly",
        ],
        "javascript": [
            "no-unused-vars",
            "no-var",
            "max-line-length-120",
            "prefer-const",
        ]
    }
    
    def __init__(self):
        self.scan_count = 0
        self.results: Dict[str, ScanResult] = {}
        self.status = "idle"
        self.message = "ScannerAgent initialized and ready"
    
    def analyze(self, code: str, filename: str = "unknown") -> Dict:
        """
        Perform static analysis on code.
        
        Args:
            code: Source code string
            filename: Path or name of the file
        
        Returns:
            Analysis results dictionary
        """
        self.scan_count += 1
        issues = []
        complexity = 0
        
        # Count lines
        lines = code.split('\n')
        self._analyze_issues(code, filename, issues)
        self._calculate_complexity(code, complexity)
        
        # Generate hash for tracking
        file_hash = hashlib.md5(code.encode()).hexdigest()
        
        self.results[filename] = ScanResult(
            timestamp=self._get_timestamp(),
            file=filename,
            issues=issues,
            complexity=complexity
        )
        
        # Log scan completion
        self.message = f"✓ Scan completed: {len(issues)} issues found, complexity: {complexity}"
        
        return {
            "issues": issues,
            "complexity": complexity,
            "filename": filename,
            "hash": file_hash
        }
    
    def _analyze_issues(self, code: str, filename: str, issues: List[str]):
        """Check various code issues."""
        issues.extend(self._check_security(code))
        issues.extend(self._check_style(code))
        issues.extend(self._check_complexity(code))
    
    def _check_security(self, code: str) -> List[str]:
        """Security vulnerability checks."""
        findings = []
        if "eval(" in code.lower():
            findings.append("⚠ WARNING: eval() detected - security risk")
        if "exec(" in code.lower():
            findings.append("⚠ WARNING: exec() detected - security risk")
        if "import os" in code or "import subprocess" in code:
            findings.append("⚠ SECURITY: System-level import detected")
        return findings
    
    def _check_style(self, code: str) -> List[str]:
        """Code style checks."""
        findings = []
        lines = code.split('\n')
        for i, line in enumerate(lines, 1):
            if line.strip() and len(line) > 120:
                findings.append(f"  L{10:03d}: Line {i} exceeds 120 chars")
        return findings
    
    def _calculate_complexity(self, code: str, complexity: int):
        """Estimate code complexity."""
        # Count function definitions
        func_count = len(re.findall(r'def\s+', code)) + len(re.findall(r'function\s+', code))
        complexity = func_count * 10  # Base complexity calculation
        
    def _get_timestamp(self) -> str:
        from datetime import datetime
        return datetime.now().strftime("%H:%M:%S")
    
    def get_status(self) -> Dict:
        """Get agent status."""
        return {
            "agent": "ScannerAgent",
            "status": self.status,
            "message": self.message,
            "scans": self.scan_count,
            "recent_results": {
                k: {
                    "issues": v.issues,
                    "complexity": v.complexity,
                    "timestamp": v.timestamp
                }
                for k, v in list(self.results.items())[-5:]
            }
        }
