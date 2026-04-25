"""
Manager - Pipeline Orchestration
=====================================

Main controller that orchestrates
all agents and manages CI/CD
lifecycle operations.
"""

import time
import json
import os
from agents.orchestrator import OrchestratorAgent
from agents.analyzer import AnalyzerAgent
from agents.developer import DeveloperAgent
from agents.ci_builder import CIBuilderAgent
from agents.deployer import DeployerAgent

class Manager:
    """
    Main manager that orchestrates all CI/CD pipeline operations.
    """
    
    def __init__(self):
        self.orchestrator = OrchestratorAgent()
        self.analyzer = AnalyzerAgent()
        self.developer = DeveloperAgent()
        self.builder = CIBuilderAgent()
        self.deployer = DeployerAgent()
        self.running = False
        
        # Pipeline state
        self.pipeline_logs = []
        self.metrics = {
            "builds": [],
            "deployments": [],
            "tests": [],
            "anomalies": []
        }
        
        # Setup
        self.builder.setup_directories()
        
    def run_pipeline(self, code_url: str = None) -> Dict:
        """
        Run the complete CI/CD pipeline.
        
        Args:
            code_url: Git repository URL
            
        Returns:
            Pipeline execution report
        """
        # Simulate pipeline stages
        start_time = time.time()
        
        # Stage 1: Code Analysis
        print("Stage 1: Code Analysis")
        analysis = self.analyzer.analyze(url=code_url)
        if analysis["status"] == "passed":
            print(f"  ✓ Code quality: {analysis.get('quality_score', 'unknown')}")
        else:
            print(f"  ✗ Code analysis: {analysis.get('message', 'failed')}")
        
        # Stage 2: Code Development
        print("Stage 2: Code Development")
        code = self.developer.develop()
        print(f"  ✓ Development: {code.get('generated_lines', 0)} lines")
        
        # Stage 3: Build
        print("Stage 3: Build")
        build = self.builder.build(code_url or "project", clean=True)
        if build["status"] == "success":
            print(f"  ✓ Build: {build['version']}")
        else:
            print(f"  ✗ Build failed: {build.get('message', 'unknown')}")
        
        # Stage 4: Test
        print("Stage 4: Testing")
        tests = self.builder.test(code_url or "project")
        if tests["status"] == "success":
            print(f"  ✓ Tests: {tests['passed']}/{tests['tests']}")
        else:
            print(f"  ✗ Test failed: {tests.get('message', 'unknown')}")
        
        # Stage 5: Deploy
        print("Stage 5: Deployment")
        deploy = self.deployer.deploy(
            artifact_path=build.get("artifact") or "app.jar",
            environment="production"
        )
        print(f"  ✓ Deployed to: {deploy.get('environment', 'unknown')}")
        
        # Stage 6: Verification
        print("Stage 6: Verification")
        verify = self.deployer.verify(environment="production")
        print(f"  ✓ Verification: {verify.get('status', 'unknown')}")
        
        duration = round(time.time() - start_time, 2)
        print(f"\n  Pipeline duration: {duration}s")
        
        # Record metrics
        self.metrics["builds"].append(build)
        self.metrics["deployments"].append(deploy)
        self.metrics["tests"].append(tests)
        
        return deploy
    
    def deploy_code(self, code_url: str = None) -> Dict:
        """
        Deploy code directly (shortcut method).
        
        Args:
            code_url: Git repository URL
            
        Returns:
            Deployment result
        """
        build = self.builder.build(code_url or "project")
        if build["status"] == "success":
            return self.deployer.deploy(
                artifact_path=build.get("artifact") or "app.jar",
                environment="production"
            )
        return build
    
    def rollback(self, environment: str = "production") -> Dict:
        """
        Rollback last deployment.
        
        Args:
            environment: Target environment
            
        Returns:
            Rollback result
        """
        # Get most recent deployment ID
        deployments = self.deployer.deployments
        if deployments:
            last_deployment = deployments[-1]
            return self.deployer.rollback(
                deployment_id=last_deployment.get("id") or "latest",
                environment=environment
            )
        return {"status": "failed", "message": "No deployment to rollback"}
    
    def get_metrics(self) -> Dict:
        """
        Get pipeline metrics.
        
        Returns:
            Metrics dict
        """
        return {
            "builds": self.metrics["builds"],
            "deployments": self.metrics["deployments"],
            "tests": self.metrics["tests"],
            "anomalies": self.metrics["anomalies"]
        }
    
    def run_stages(self):
        """
        Run all pipeline stages.
        
        Returns:
            Final deployment status
        """
        return self.run_pipeline()
