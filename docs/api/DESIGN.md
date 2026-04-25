# API Architecture Design

## Overview

The Code Agent Harness API provides a unified interface for clients to interact with code agents. It supports both REST and WebSocket protocols.

## API Categories

| Category | HTTP Method | Purpose |
|----|---|--|
| Agents | GET   | List registered agents |
| Agents | POST  | Invoke agent operations |
| Workspaces | GET   | List workspaces |
| Workspaces | POST  | Create workspace |
| Workspaces | DELETE | Delete workspace |
| Audit   | GET   | Query audit logs |

## Endpoint Catalog

### Agent Operations

| Endpoint | Description | Auth |
|----|-----|---|
| `/api/v1/agents` | List available agents | No |
| `/api/v1/agents/{id}` | Get agent details | No |
| `/api/v1/agents/{id}/invoke` | Invoke agent operation | Yes |
| `/api/v1/agents/health` | Agent health check | No |

### Workspace Operations

| Endpoint | Description | Auth |
|----|-----|---|
| `/api/v1/workspaces` | List workspaces | Yes |
| `/api/v1/workspaces` | Create workspace | Yes |
| `/api/v1/workspaces/{id}` | Get workspace | Yes |
| `/api/v1/workspaces/{id}` | Update workspace | Yes |
| `/api/v1/workspaces/{id}` | Delete workspace | Yes |

### Audit Operations

| Endpoint | Description | Auth |
|----|-----|---|
| `/api/v1/audit/logs` | Query audit logs | Yes |

## HTTP Status Codes

### Success Codes

| Code | Description |
|---|---|--|
| 200 | OK |
| 201 | Created |
| 202 | Accepted |

### Client Errors

| Code | Description |
|---|---|--|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |

### Server Errors

| Code | Description |
|---|---|
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## Request/Response Schema

### Request Wrapper

All agent requests wrap parameters:

```json
{
  "agent_id": "com.atelier.analyzer",
  "workspace_id": "ws-12345",
  "operation": "static_analysis",
  "parameters": {
    "paths": ["src/**"],
    "options": {
      "include_dependencies": true
    }
  }
}
```

### Response Wrapper

```json
{
  "request_id": "req-67890",
  "agent_id": "com.atelier.analyzer",
  "status": "success",
  "result": {
    "type": "analysis_report",
    "data": {
      "files_analyzed": 123,
      "complexity_score": 42,
      "issues": []
    }
  },
  "metadata": {
    "duration_ms": 1523,
    "timestamp": "2025-04-24T12:00:00Z"
  }
}
```

## Rate Limiting

| Endpoint | Rate Limit | Burst |
|---|---|---|
| `/api/v1/agents/...` | 100 req/min | 30 |
| `/api/v1/workspaces/...` | 50 req/min | 20 |

## Authentication

Authentication via API tokens:

1. Create token in workspace settings
2. Include in `Authorization: Bearer <token>` header
3. Token scopes control access levels

## WebSocket Protocol

Real-time agent communication via WebSocket:

```javascript
// Connection setup
const ws = new WebSocket(`ws://harness-server:8080/ws?workspace_id=ws-12345`);

// Connect event
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "auth",
    token: "<api_token>",
  }));
};

// Message event
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle messages
};

// Subscription
ws.send(JSON.stringify({
  type: "subscribe",
  agent_id: "com.atelier.analyzer",
}));
```

## Protocol Messages

### Client → Server

| Type | Description |
|---|---|--|
| `auth` | Authenticate connection |
| `subscribe` | Subscribe to agent stream |
| `unsubscribe` | Unsubscribe from stream |
| `invoke` | Request agent operation |
| `ping` | Keep-alive ping |

### Server → Client

| Type | Description |
|---|---|
| `auth_success` | Authentication success |
| `auth_failed` | Authentication failed |
| `event` | Agent event (progress, result, error) |
| `pong` | Keep-alive pong |

---

*See individual endpoint docs for specific schemas*
