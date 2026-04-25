"""
MonitorAgent - Real-time State Monitoring
=====================================

Monitors application state, metrics, and alerting.
"""

import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Callable

@dataclass
class Metric:
    name: str
    value: float
    timestamp: str

@dataclass  
class Alert:
    severity: str
    message: str
    metric: str

class MonitorAgent:
    """
    Real-time state monitoring agent.
    
    Responsibilities:
    - Collect and track metrics
    - Monitor system health
    - Generate alerts
    - Track resource usage
    """
    
    # Default thresholds
    THRESHOLDS = {
        "cpu_percent": 80,
        "memory_percent": 85,
        "disk_percent": 90,
        "response_time_ms": 500,
        "error_rate": 0.05
    }
    
    # Default alert callbacks
    alert_callbacks: Dict[str, List[Callable]] = field(default_factory=dict)
    
    def __init__(self):
        self.metrics: Dict[str, Metric] = {}
        self.alerts: List[Alert] = []
        self.health_status = "healthy"
        self.message = "MonitorAgent initialized for real-time monitoring"
        self.sample_interval = 0.1  # seconds for demo purposes
        self.monitoring = False
        self.start_time = time.time()
    
    def start_monitoring(self):
        """Start background monitoring loop."""
        self.monitoring = True
        self.message = "✓ Monitoring started"
        print(f"[Monitor] {self.message}")
    
    def stop_monitoring(self):
        """Stop monitoring."""
        self.monitoring = False
        self.message = "Monitor stopped"
        print(f"[Monitor] {self.message}")
    
    def collect_metric(self, name: str, value: float):
        """Collect a metric value."""
        self.metrics[name] = Metric(
            name=name,
            value=value,
            timestamp=time.strftime("%H:%M:%S")
        )
        self._check_threshold(name, value)
    
    def _collect_fake_metrics(self):
        """Generate simulated metrics for demo."""
        import random
        
        self.collect_metric("cpu_percent", random.uniform(20, 60))
        self.collect_metric("memory_percent", random.uniform(40, 70))
        self.collect_metric("disk_percent", random.uniform(30, 80))
        self.collect_metric("response_time_ms", random.uniform(50, 200))
        self.collect_metric("active_connections", random.randint(100, 500))
        self.collect_metric("request_rate", random.randint(1000, 5000))
        self.collect_metric("errors", random.randint(0, 10))
    
    def _check_threshold(self, metric: str, value: float):
        """Check metric against threshold."""
        if metric in self.THRESHOLDS:
            threshold = self.THRESHOLDS[metric]
            if value > threshold or metric == "error_rate":
                self._trigger_alert(metric, value, threshold)
    
    def _trigger_alert(self, metric: str, value: float, threshold: float):
        """Trigger an alert for threshold breach."""
        severity = "warning" if value > threshold else "error"
        message = f"⚠ {metric.replace('_', ' ').title()} threshold exceeded: {value:.1f} > {threshold}"
        
        self.alerts.append(Alert(severity=severity, message=message, metric=metric))
        
        # Notify callbacks
        if metric in self.alert_callbacks:
            for callback in self.alert_callbacks[metric]:
                try:
                    callback(metric, value, severity)
                except Exception as e:
                    print(f"[Monitor] Alert callback error: {e}")
        
        self.message = f"⚠ Alert: {message}"
    
    def get_health(self) -> Dict:
        """Get current health status."""
        issues = []
        
        if self.health_status != "healthy":
            issues.append(self.health_status)
        
        return {
            "status": self.health_status,
            "alerts": len(self.alerts),
            "recent_alerts": self.alerts[-5:],
            "metrics": {
                k: {"value": v.value, "timestamp": v.timestamp}
                for k, v in self.metrics.items()
            }
        }
