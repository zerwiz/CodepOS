"""
OrchestratorAgent - Task Coordination
==================================

Coordinates multiple agents, manages workflow,
handles dependencies, and reports execution.
"""

from typing import Dict, List, Optional, Callable
import time
import threading

class OrchestratorAgent:
    """
    Multi-agent orchestration and workflow management.
    
    Responsibilities:
    - Coordinate agent tasks
    - Manage dependencies
    - Handle timeouts and retries
    - Aggregate results
    """
    
    def __init__(self):
        self.heartbeat_time = time.time()
        self.status = "ready"
        self.message = "OrchestratorAgent - Coordination Center"
        self.running = False
        self.active_tasks = {}
        self.completed_tasks = []
        self.agent_pool = {
            'scanner': 'ScannerAgent',
            'reviewer': 'CodeReviewerAgent',
            'monitor': 'MonitorAgent',
            'builder': 'CI/BuilderAgent',
            'deployer': 'DeployerAgent'
        }
        self.callbacks: Dict[str, List[Callable]] = {}
        self._lock = threading.Lock()
    
    def register_agent(self, name: str, callback: Callable):
        """Register an agent callback."""
        self.agent_pool[name] = callback.__class__.__name__
        self.callbacks[name] = []
    
    def start(self):
        """Start orchestration."""
        self.running = True
        self.heartbeat_time = time.time()
        self.status = "running"
        self.message = "✓ Task orchestration started"
        print(f"[Orchestrator] {self.message}")
    
    def stop(self):
        """Stop orchestration."""
        self.running = False
        self.status = "stopped"
        self.message = "Task orchestration stopped"
    
    def schedule_task(self, task_name: str, priority: int = 1, 
                      callback: Callable = None, timeout: int = 300):
        """Schedule a task for execution."""
        with self._lock:
            self.active_tasks[task_name] = {
                'name': task_name,
                'priority': priority,
                'timeout': timeout,
                'scheduled': time.time(),
                'completed': False,
                'callback': callback
            }
        
        # Check for timeouts
        self._cleanup_timeout_tasks()
    
    def complete_task(self, task_name: str, result: Dict, success: bool):
        """Mark task as complete."""
        with self._lock:
            if task_name in self.active_tasks:
                del self.active_tasks[task_name]
                self.completed_tasks.append({
                    'name': task_name,
                    'success': success,
                    'result': result,
                    'timestamp': time.strftime("%H:%M:%S")
                })
                
                # Call completion callback
                if callback:
                    try:
                        callback(task_name, result)
                    except Exception as e:
                        print(f"[Orchestrator] Task callback error: {e}")
        
        self.message = f"Task '{task_name}': {success}"
    
    def _cleanup_timeout_tasks(self):
        """Clean up completed or timeout tasks."""
        current_time = time.time()
        cutoff = current_time - 300  # 5 minute timeout
        
        for task_name in list(self.active_tasks.keys()):
            task = self.active_tasks[task_name]
            if current_time - task['scheduled'] > task['timeout']:
                self.complete_task(task_name, {}, success=False)
                self.message = f"Task timeout: {task_name}"
    
    def get_workload(self) -> Dict:
        """Get current workload status."""
        return {
            "running": self.running,
            "status": self.status,
            "active_tasks": len(self.active_tasks),
            "active_task_names": list(self.active_tasks.keys()),
            "completed_tasks": len(self.completed_tasks),
            "agents": self.agent_pool,
            "callbacks": list(self.callbacks.keys()),
            "uptime": int(time.time() - self.start_time) if hasattr(self, 'start_time') else 0
        }
