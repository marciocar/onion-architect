# 🔌 API Specification - Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 🔐 Authentication & Authorization

### Authentication Method

**Type:** Bearer Token (JWT)

**Header:**
```
Authorization: Bearer <jwt_token>
```

**Token Source:**
- Tokens emitidos pelo Logto após autenticação
- Tokens incluem `tenantId` e `userId` no payload
- Tokens expiram em 24 horas (configurável)

### Authorization

**Multi-tenancy:**
- Tenant é extraído automaticamente do JWT token
- Todas as requisições são automaticamente filtradas por tenant
- Usuário só pode acessar recursos do seu tenant

**Roles (Future):**
- `admin`: Acesso total ao tenant
- `member`: Acesso padrão
- `viewer`: Acesso somente leitura

---

## 📡 Base URL

**Development:**
```
http://localhost:3000/api
```

**Production:**
```
https://api.onion.app/api
```

---

## 📋 Endpoints

### Knowbases

#### `GET /knowbases`
Lista todas as knowbases do tenant.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Marketing 2025",
      "description": "Conhecimento de marketing",
      "createdAt": "2025-12-12T10:00:00Z",
      "updatedAt": "2025-12-12T10:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

#### `POST /knowbases`
Cria uma nova knowbase.

**Request:**
```json
{
  "name": "Marketing 2025",
  "description": "Conhecimento de marketing"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Marketing 2025",
  "description": "Conhecimento de marketing",
  "createdAt": "2025-12-12T10:00:00Z"
}
```

#### `GET /knowbases/:id`
Obtém uma knowbase específica.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Marketing 2025",
  "description": "Conhecimento de marketing",
  "createdAt": "2025-12-12T10:00:00Z",
  "updatedAt": "2025-12-12T10:00:00Z"
}
```

#### `PUT /knowbases/:id`
Atualiza uma knowbase.

**Request:**
```json
{
  "name": "Marketing 2025 Updated",
  "description": "Nova descrição"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Marketing 2025 Updated",
  "description": "Nova descrição",
  "updatedAt": "2025-12-12T11:00:00Z"
}
```

#### `DELETE /knowbases/:id`
Deleta uma knowbase.

**Response:** `204 No Content`

**Erros:**
- `400 Bad Request`: Knowbase tem agentes vinculados
- `404 Not Found`: Knowbase não existe

---

### Agents

#### `GET /agents`
Lista todos os agentes do tenant.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "@marketing",
      "description": "Assistente de marketing",
      "knowbaseIds": ["uuid1", "uuid2"],
      "createdAt": "2025-12-12T10:00:00Z"
    }
  ]
}
```

#### `POST /agents`
Cria um novo agente.

**Request:**
```json
{
  "name": "@marketing",
  "description": "Assistente de marketing",
  "knowbaseIds": ["uuid1", "uuid2"],
  "instructions": "Você é um especialista em marketing digital...",
  "model": "gpt-4"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "@marketing",
  "description": "Assistente de marketing",
  "knowbaseIds": ["uuid1", "uuid2"],
  "instructions": "Você é um especialista em marketing digital...",
  "model": "gpt-4",
  "createdAt": "2025-12-12T10:00:00Z"
}
```

#### `POST /agents/:id/chat`
Chat com um agente.

**Request:**
```json
{
  "message": "Qual a estratégia de marketing para Q1?",
  "stream": true
}
```

**Response:** `200 OK` (streaming)
```
data: {"content": "A estratégia", "done": false}
data: {"content": " para Q1", "done": false}
data: {"content": " inclui...", "done": true}
```

---

### Commands

#### `GET /commands`
Lista todos os comandos do tenant.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "/daily-report",
      "description": "Gera relatório diário",
      "scheduled": false,
      "createdAt": "2025-12-12T10:00:00Z"
    }
  ]
}
```

#### `POST /commands`
Cria um novo comando.

**Request:**
```json
{
  "name": "/daily-report",
  "description": "Gera relatório diário",
  "steps": [
    {
      "type": "query",
      "query": "Buscar atividades do dia {date}"
    },
    {
      "type": "agent",
      "agentId": "uuid",
      "prompt": "Resumir atividades"
    }
  ],
  "variables": [
    {
      "name": "date",
      "type": "date",
      "default": "today"
    }
  ]
}
```

**Response:** `201 Created`

#### `POST /commands/:id/execute`
Executa um comando.

**Request:**
```json
{
  "variables": {
    "date": "2025-12-12"
  }
}
```

**Response:** `200 OK`
```json
{
  "executionId": "uuid",
  "status": "running",
  "result": null
}
```

#### `GET /commands/:id/executions/:executionId`
Obtém resultado de uma execução.

**Response:** `200 OK`
```json
{
  "executionId": "uuid",
  "status": "completed",
  "result": {
    "output": "Relatório gerado...",
    "steps": [
      {"step": 1, "status": "completed"},
      {"step": 2, "status": "completed"}
    ]
  }
}
```

---

### Rules

#### `GET /rules`
Lista todas as regras do tenant.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "resposta-formal",
      "scope": {
        "agents": ["uuid1"],
        "commands": ["uuid2"]
      },
      "priority": 75,
      "active": true
    }
  ]
}
```

#### `POST /rules`
Cria uma nova regra.

**Request:**
```json
{
  "name": "resposta-formal",
  "scope": {
    "agents": ["uuid1"],
    "global": false
  },
  "behavior": {
    "tone": "formal",
    "language": "pt-BR"
  },
  "priority": 75
}
```

**Response:** `201 Created`

---

### AI Chat

#### `POST /ai/chat`
Chat direto com @onion (orquestrador).

**Request:**
```json
{
  "message": "Crie um agente de vendas",
  "context": {
    "knowbaseIds": ["uuid1"]
  },
  "stream": true
}
```

**Response:** `200 OK` (streaming)
```
data: {"content": "Vou criar", "done": false}
data: {"content": " um agente", "done": false}
data: {"content": " de vendas...", "done": true}
```

---

## 📊 Data Models

### Knowbase

```typescript
interface Knowbase {
  id: string; // UUID v7
  tenantId: string; // UUID
  name: string; // min 1, max 255
  description?: string; // max 1000
  createdAt: Date;
  updatedAt: Date;
}
```

### Agent

```typescript
interface Agent {
  id: string; // UUID v7
  tenantId: string; // UUID
  name: string; // min 1, max 255
  description?: string; // max 1000
  knowbaseIds: string[]; // UUID[], min 1
  instructions?: string; // max 5000
  model?: 'gpt-4' | 'claude-3' | 'custom';
  createdAt: Date;
  updatedAt: Date;
}
```

### Command

```typescript
interface Command {
  id: string; // UUID v7
  tenantId: string; // UUID
  name: string; // pattern: /^\/[a-z0-9-]+$/
  description?: string;
  steps: CommandStep[];
  variables?: CommandVariable[];
  scheduled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CommandStep {
  type: 'query' | 'agent' | 'command' | 'transform';
  // ... step-specific fields
}

interface CommandVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  default?: any;
}
```

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "KNOWBASE_NOT_FOUND",
    "message": "Knowbase não encontrada",
    "details": {
      "id": "uuid"
    }
  }
}
```

### HTTP Status Codes

| Code | Significado |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (no access to resource) |
| `404` | Not Found |
| `409` | Conflict (e.g., duplicate name) |
| `429` | Too Many Requests (rate limit) |
| `500` | Internal Server Error |

### Error Codes

| Code | Descrição |
|------|-----------|
| `VALIDATION_ERROR` | Input validation failed |
| `KNOWBASE_NOT_FOUND` | Knowbase não existe |
| `AGENT_NOT_FOUND` | Agente não existe |
| `TENANT_MISMATCH` | Resource não pertence ao tenant |
| `RATE_LIMIT_EXCEEDED` | Limite de requisições excedido |
| `FEATURE_LIMIT_EXCEEDED` | Limite do plano excedido |

---

## 🚦 Rate Limiting & Performance

### Rate Limits

| Endpoint | Free | Pro | Enterprise |
|----------|------|-----|------------|
| `/knowbases/*` | 100/min | 1000/min | Unlimited |
| `/agents/*` | 50/min | 500/min | Unlimited |
| `/ai/chat` | 20/min | 200/min | Unlimited |
| `/commands/execute` | 10/min | 100/min | Unlimited |

### Performance Expectations

| Endpoint | P95 Latency |
|----------|-------------|
| `GET /knowbases` | < 100ms |
| `POST /knowbases` | < 200ms |
| `POST /agents/:id/chat` | < 5s |
| `POST /commands/:id/execute` | < 2s |

### Caching

- Knowbases list: Cache 5 min
- Agent definitions: Cache 10 min
- Rules: Cache 15 min

---

## 📖 OpenAPI Specification

**Location:** `/api/openapi.json`

**Swagger UI:** `/api/docs` (development only)

---

## 🔄 Webhooks (Future V2)

**Endpoints:**
- `POST /webhooks` - Criar webhook
- `GET /webhooks` - Listar webhooks
- `DELETE /webhooks/:id` - Deletar webhook

**Events:**
- `knowbase.created`
- `agent.created`
- `command.executed`
- `rule.applied`

---

## 📚 References

- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [OpenAPI Specification](https://swagger.io/specification/)

---

**Próximo documento:** [Contributing Guide](CONTRIBUTING.md)

