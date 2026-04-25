# SOLID Principles Implementation

## Single Responsibility

```python
# app/backend/agents/
# ├── analyzer.py          # Only analysis code
# ├── reviewer.py          # Only review code
# ├── tester.py            # Only testing code
# └── deployer.py          # Only deployment code

# Each file has one responsibility
class AnalyzerAgent:
    """Single responsibility: Code analysis only."""
    
    def __init__(self, config: AgentConfig):
        self.config = config
    
    def analyze(self, code: str) -> AnalysisResult:
        """Analyze code."""
        ...
```

---

## Open/Closed

```python
# Extensions for analysis (without modifying core)
class AnalyzerAgent:
    def __init__(self, config: AgentConfig):
        self.plugins = []
    
    def register_plugin(self, plugin: AnalysisPlugin) -> None:
        """Register analysis plugins."""
        self.plugins.append(plugin)
    
    def analyze(self, code: str) -> AnalysisResult:
        results = []
        for plugin in self.plugins:
            results.append(plugin.analyze(code))
        return combine_results(results)
```

---

## Liskov Substitution

```python
# All agents follow common interface
from abc import ABC, abstractmethod

class Agent(ABC):
    @abstractmethod
    def health(self) -> str:
        pass
    
    @abstractmethod
    def invoke(self, operation: str, **kwargs) -> Any:
        pass

# All agents are interchangeable
def run_agent(agent: Agent) -> str:
    return agent.health()

# Can use any agent implementation
analyzer = AnalyzerAgent(config)
reviewer = ReviewerAgent(config)

run_agent(analyzer)  # Works
run_agent(reviewer)  # Works
```

---

## Interface Segregation

```python
# Specific interfaces for specific needs
class AnalyzeAgent(Agent):
    """Agent that can analyze code."""
    pass

class TestAgent(Agent):
    """Agent that can test code."""
    pass

class BuildAgent(Agent):
    """Agent that can build code."""
    pass

# No large interface that includes unused operations
```

---

## Dependency Inversion

```python
# High-level modules depend on abstractions
from abc import ABC, abstractmethod

class AgentRepository(ABC):
    @abstractmethod
    def get_agent(self, agent_id: str) -> Agent:
        pass

# Concrete implementations
class YAMLAgentRepository(AgentRepository):
    def __init__(self, config_path: Path):
        self.config_path = config_path
    
    def get_agent(self, agent_id: str) -> Agent:
        config = load_config(self.config_path)
        return config.agents[agent_id]

class MemoryAgentRepository(AgentRepository):
    def __init__(self, agents: Dict[str, Agent]):
        self.agents = agents
    
    def get_agent(self, agent_id: str) -> Agent:
        return self.agents.get(agent_id)

# Clients depend on repository interface
class Workflow:
    def __init__(self, repository: AgentRepository):
        self.repository = repository
    
    def execute(self, operation: str, **kwargs):
        agent = self.repository.get_agent("com.atelier.analyzer")
        return agent.invoke(operation, **kwargs)
```

---

## Dependency Injection

```python
# Configuration-driven dependency injection
class AgentConfig:
    agent_id: str
    class_name: str
    config: Dict[str, Any]

def create_agent(config: AgentConfig) -> Agent:
    """Factory for creating agents."""
    module_path = config.class_name.split('.')[:-1]
    class_name = config.class_name.split('.')[-1]
    module = importlib.import_module('.'.join(module_path))
    agent_class = getattr(module, class_name)
    return agent_class(**config.config)

# Usage
config = AgentConfig(
    agent_id="com.atelier.analyzer",
    class_name="apps.backend.agents.analyzer.AnalyzerAgent",
    config={"timeout": 30}
)

agent = create_agent(config)
```

---

## Interface Examples

```python
# Agent interface
class Agent:
    @abstractmethod
    def health(self) -> str:
        """Health check"""
        pass
    
    @abstractmethod
    def analyze(self, code: str) -> AnalysisResult:
        """Analyze code"""
        pass
    
    @abstractmethod
    def test(self, code: str) -> TestResult:
        """Test code"""
        pass
    
    @abstractmethod
    def deploy(self, build_dir: str) -> str:
        """Deploy changes"""
        pass
```

---

## Repository Pattern

```python
from abc import ABC, abstractmethod

class AgentRepository(ABC):
    """Interface for agent persistence."""
    
    @abstractmethod
    def get_agent(self, agent_id: str) -> Agent:
        pass
    
    @abstractmethod
    def register_agent(self, agent_id: str, agent: Agent) -> None:
        pass

# Implementations
class FileAgentRepository(AgentRepository):
    """File-based agent storage."""
    def get_agent(self, agent_id: str) -> Agent:
        path = self.storage_path / "agents" / agent_id / "config.yaml"
        config = yaml.safe_load(path.read_text())
        return self.load_agent(config)
    
    def register_agent(self, agent_id: str, agent: Agent) -> None:
        path = self.storage_path / "agents" / agent_id / "config.yaml"
        yaml.safe_dump(agent.to_dict(), path.open('w'))
```

---

## Factory Pattern

```python
from abc import ABC, abstractmethod

class AgentFactory(ABC):
    @abstractmethod
    def create(self, agent_class: type) -> Agent:
        pass

class YAMLAgentFactory(AgentFactory):
    def __init__(self, config_path: Path):
        self.config_path = config_path
    
    def create(self, agent_class: type) -> Agent:
        config = yaml.safe_load(open_agent_config(self.config_path))
        return agent_class(**config)
```

---

## Usage in Production

```python
# apps/backend/src/registry/loader.py
from pathlib import Path
from apps.backend.agents import AnalyzerAgent, ReviewerAgent
from apps.backend.repositories.file_repository import FileAgentRepository

# Load agents from config
def load_agents(config_path: Path) -> Dict[str, Agent]:
    agents: Dict[str, Agent] = {}
    config = yaml.safe_load(open(config_path))
    
    for agent_def in config['agents']:
        agent_id = agent_def['id']
        agent_class = agent_def['class']
        agent_config = agent_def['config']
        
        # Create agent instance
        module_path = agent_class.split('.')[:-1]
        class_name = agent_class.split('.')[-1]
        module = importlib.import_module('.'.join(module_path))
        agent_class = getattr(module, class_name)
        
        agents[agent_id] = agent_class(**agent_config)
    
    return agents

# Example
agents = load_agents(Path('/apps/backend/src/configuration/agents.yaml'))
```

---

## Complete Example

```python
# apps/backend/src/main.py
from pathlib import Path
from apps.backend.repositories.file_repository import FileAgentRepository
from apps.backend.agents import AnalyzerAgent, ReviewerAgent
from apps.backend.workflows import analyze, review, implement

# Load agents
config_path = Path('.pi/multi-team/multi-team-config.yaml').absolute()
repository = FileAgentRepository(config_path)

# Orchestrate workflow
def run_analyze_workflow() -> AnalysisResult:
    agent = repository.get_agent("com.atelier.analyzer")
    return agent.analyze(code)
```

---

## Summary

- **Single Responsibility**: Each agent has one purpose
- **Open/Closed**: Easy to extend with plugins
- **Liskov Substitution**: All agents implement common interface
- **Interface Segregation**: Specific interfaces for specific needs
- **Dependency Inversion**: High-level depends on abstractions