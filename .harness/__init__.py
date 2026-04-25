"""
Harness Framework - Agent Orchestration System
=================================================

Provides multi-agent coordination, event streams, and real-time monitoring.

Usage:
    from harness.orchestrator import Orchestrator
    from harness.agents import AegisAgents
    
    orchestrator = Orchestrator(agents=AegisAgents())
    orchestrator.run()
"""

from .orchestrator import Orchestrator
from .agents import AegisAgents
from .streams import AgentStream
from .events import EventDispatcher

__version__ = "1.0.0"
__all__ = ["Orchestrator", "AegisAgents", "AgentStream", "EventDispatcher"]
