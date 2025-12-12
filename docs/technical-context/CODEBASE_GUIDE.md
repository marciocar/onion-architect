# 🗺️ Codebase Navigation Guide - Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 📁 Directory Structure

```
onion-app/
├── apps/                          # Applications
│   ├── api/                      # Fastify backend API
│   │   ├── src/
│   │   │   ├── routes/           # API routes
│   │   │   ├── plugins/          # Fastify plugins
│   │   │   ├── services/         # Business logic
│   │   │   ├── types/            # TypeScript types
│   │   │   └── index.ts          # Entry point
│   │   ├── prisma/               # Prisma migrations (app-specific)
│   │   └── project.json          # NX project config
│   │
│   ├── web/                      # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router
│   │   │   ├── components/       # React components (usa design system)
│   │   │   ├── lib/              # Utilities
│   │   │   └── types/            # TypeScript types
│   │   └── project.json          # NX project config
│   │
│   ├── mobile/                   # React Native mobile app 🆕
│   │   ├── src/
│   │   │   ├── screens/          # Mobile screens
│   │   │   ├── components/       # Mobile components (usa design system)
│   │   │   ├── navigation/       # Navigation setup
│   │   │   └── lib/              # Utilities
│   │   ├── ios/                  # iOS native code
│   │   ├── android/              # Android native code
│   │   └── project.json          # NX project config
│   │
│   └── worker/                   # BullMQ workers
│       ├── src/
│       │   ├── workers/          # Worker definitions
│       │   └── jobs/             # Job processors
│       └── project.json           # NX project config
│
├── libs/                          # Shared libraries
│   ├── shared/                   # Shared utilities
│   │   ├── schemas/              # Zod schemas (shared)
│   │   ├── types/                # Shared TypeScript types
│   │   └── utils/                # Utility functions
│   │
│   ├── design-system/            # Design System Library 🆕
│   │   ├── src/
│   │   │   ├── components/       # Componentes universais
│   │   │   │   ├── Button/       # Button (web + mobile)
│   │   │   │   ├── Input/        # Input (web + mobile)
│   │   │   │   ├── Card/         # Card (web + mobile)
│   │   │   │   └── ...           # Outros componentes
│   │   │   ├── tokens/           # Design tokens (cores, espaçamento)
│   │   │   ├── themes/           # Temas (light/dark)
│   │   │   └── hooks/            # Hooks compartilhados
│   │   └── project.json          # NX project config
│   │
│   ├── database/                 # Database layer
│   │   ├── src/
│   │   │   ├── client.ts         # Prisma client export
│   │   │   ├── migrations/       # Shared migrations
│   │   │   └── seeds/            # Seed scripts
│   │   └── prisma/
│   │       └── schema.prisma      # Prisma schema
│   │
│   ├── auth/                     # Authentication utilities
│   │   └── src/
│   │       ├── logto.ts          # Logto client
│   │       └── middleware.ts     # Auth middleware
│   │
│   ├── ai/                        # AI integrations
│   │   └── src/
│   │       ├── openai.ts         # OpenAI client
│   │       ├── qdrant.ts         # Qdrant client
│   │       └── embeddings.ts     # Embedding utilities
│   │
│   └── features/                  # Feature modules
│       ├── knowbases/             # Knowbase feature
│       ├── agents/                # Agent feature
│       ├── commands/               # Command feature
│       └── rules/                 # Rules feature
│
├── tools/                         # NX generators, scripts
│   └── generators/                # Custom NX generators
│
├── docker/                        # Docker configurations
│   ├── docker-compose.yml         # Local development
│   └── Dockerfile.*              # App-specific Dockerfiles
│
├── docs/                          # Documentation
│   ├── business-context/          # Business documentation
│   ├── technical-context/         # This documentation
│   └── knowbase/                  # Knowledge bases
│
├── .nx/                           # NX cache (gitignored)
├── node_modules/                  # Dependencies
├── nx.json                        # NX configuration
├── package.json                   # Root package.json
├── pnpm-workspace.yaml            # pnpm workspace config
├── tsconfig.base.json             # Base TypeScript config
└── README.md                      # Project README
```

---

## 🔑 Key Files and Their Purpose

### Root Level

| Arquivo | Propósito |
|---------|-----------|
| `nx.json` | Configuração do NX monorepo |
| `package.json` | Dependências root e scripts |
| `pnpm-workspace.yaml` | Configuração do pnpm workspace |
| `tsconfig.base.json` | TypeScript base config (path mappings) |
| `docker-compose.yml` | Infraestrutura local (PostgreSQL, Redis, etc.) |

### Apps

#### `apps/api/`
| Arquivo/Dir | Propósito |
|-------------|-----------|
| `src/index.ts` | Entry point do servidor Fastify |
| `src/routes/` | Rotas da API (REST endpoints) |
| `src/plugins/` | Plugins Fastify (auth, tenant, etc.) |
| `src/services/` | Lógica de negócio (services layer) |
| `project.json` | Configuração NX para este app |

#### `apps/web/`
| Arquivo/Dir | Propósito |
|-------------|-----------|
| `src/app/` | Next.js App Router (pages/routes) |
| `src/components/` | Componentes React (usa design system) |
| `src/lib/` | Utilities e helpers do frontend |
| `project.json` | Configuração NX para este app |

#### `apps/mobile/` 🆕
| Arquivo/Dir | Propósito |
|-------------|-----------|
| `src/screens/` | Telas do app mobile |
| `src/components/` | Componentes mobile (usa design system) |
| `src/navigation/` | Configuração de navegação |
| `src/lib/` | Utilities compartilhadas |
| `ios/` | Código nativo iOS |
| `android/` | Código nativo Android |
| `app.json` | Configuração Expo |
| `project.json` | Configuração NX para este app |

#### `apps/worker/`
| Arquivo/Dir | Propósito |
|-------------|-----------|
| `src/workers/` | Definições de workers BullMQ |
| `src/jobs/` | Processadores de jobs |
| `project.json` | Configuração NX para este app |

### Libraries

#### `libs/shared/schemas/`
**Propósito:** Schemas Zod compartilhados entre frontend e backend

```typescript
// libs/shared/schemas/src/knowbase.ts
export const createKnowbaseSchema = z.object({
  name: z.string().min(1),
});
```

#### `libs/database/`
**Propósito:** Camada de acesso a dados (Prisma)

| Arquivo | Propósito |
|---------|-----------|
| `prisma/schema.prisma` | Schema do banco de dados |
| `src/client.ts` | Export do Prisma Client |

#### `libs/design-system/` 🆕
**Propósito:** Design system universal (web + mobile)

| Arquivo/Dir | Propósito |
|-------------|-----------|
| `src/tokens/` | Design tokens (cores, espaçamento, tipografia) |
| `src/components/` | Componentes universais (Tamagui) |
| `src/themes/` | Temas (light/dark) |
| `src/hooks/` | Hooks compartilhados (useTheme, etc.) |

#### `libs/features/`
**Propósito:** Módulos de features (knowbases, agents, etc.)

Cada feature tem:
- `service.ts` - Business logic
- `types.ts` - TypeScript types
- `schemas.ts` - Zod schemas (se específico da feature)

---

## 🔄 Data Flow Patterns

### Request Flow (API)

```
1. HTTP Request
   ↓
2. Fastify receives request
   ↓
3. Auth Plugin (validates JWT, sets tenant)
   ↓
4. Route Handler (validates input with Zod)
   ↓
5. Service Layer (business logic)
   ↓
6. Database Layer (Prisma + RLS)
   ↓
7. Response (validated with Zod)
   ↓
8. HTTP Response
```

### Multi-tenancy Flow

```
1. Request arrives with JWT token
   ↓
2. Auth plugin extracts tenantId from token
   ↓
3. Tenant plugin sets PostgreSQL context:
   SET app.current_tenant = 'tenant-id'
   ↓
4. All Prisma queries automatically filtered by RLS
   ↓
5. Response contains only tenant's data
```

### AI Request Flow

```
1. User asks question via @onion
   ↓
2. Frontend sends to /api/ai/chat
   ↓
3. API validates input, extracts knowbase context
   ↓
4. Service queries Qdrant for relevant chunks
   ↓
5. Service calls OpenAI API with context
   ↓
6. Response streamed back to frontend
   ↓
7. Frontend displays response incrementally
```

---

## 🔌 Integration Points

### External Services

| Serviço | Localização | Propósito |
|---------|-------------|-----------|
| **Logto** | `libs/auth/src/logto.ts` | Autenticação |
| **OpenAI** | `libs/ai/src/openai.ts` | LLM API |
| **Qdrant** | `libs/ai/src/qdrant.ts` | Vector database |
| **MinIO** | `libs/storage/src/minio.ts` | File storage |
| **Redis** | `libs/queue/src/redis.ts` | Queue/BullMQ |

### Internal Integrations

| Integração | Como funciona |
|-------------|----------------|
| **Frontend ↔ Backend** | REST API (`/api/*`) |
| **Backend ↔ Database** | Prisma Client |
| **Backend ↔ Workers** | BullMQ queue |
| **Apps ↔ Libs** | NX path mappings (`@onion/shared`, etc.) |

---

## 🚀 Deployment Architecture

### Development (Local)

```
┌─────────────────────────────────────────┐
│         Docker Compose                  │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │PostgreSQL│  │  Redis   │           │
│  │   :5432  │  │   :6379  │           │
│  └──────────┘  └──────────┘           │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │  MinIO   │  │  Qdrant  │           │
│  │  :9000   │  │  :6333   │           │
│  └──────────┘  └──────────┘           │
│                                         │
│  ┌──────────┐                          │
│  │  Logto   │                          │
│  │  :3001   │                          │
│  └──────────┘                          │
│                                         │
└─────────────────────────────────────────┘
         ↑
         │
┌─────────────────────────────────────────┐
│      NX Dev Server (Local)             │
├─────────────────────────────────────────┤
│  apps/api (Fastify :3000)              │
│  apps/web (Next.js :3002)              │
│  apps/mobile (Expo :8081) 🆕           │
│  apps/worker (BullMQ)                  │
└─────────────────────────────────────────┘
```

### Production (Future)

```
┌─────────────────────────────────────────┐
│         Load Balancer                  │
└─────────────────────────────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│ API 1 │ │ API 2│  (Fastify instances)
└───┬───┘ └──┬───┘
    │         │
    └────┬────┘
         │
┌────────▼────────┐
│   PostgreSQL    │  (with RLS)
│   (Primary)     │
└─────────────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │  (Replica)
│   (Read-only)   │
└─────────────────┘

┌─────────────┐  ┌──────────┐  ┌─────────┐
│    Redis    │  │  MinIO   │  │ Qdrant  │
│  (Cluster)  │  │ (S3)     │  │ (Vector)│
└─────────────┘  └──────────┘  └─────────┘
```

---

## 🧭 Navigation Tips

### Finding Code

**Por Feature:**
```
Feature: Knowbases
├── Schema: libs/shared/schemas/src/knowbase.ts
├── Service: libs/features/knowbases/src/service.ts
├── API Route: apps/api/src/routes/knowbases.ts
├── Frontend: apps/web/src/components/KnowbaseForm.tsx
└── Types: libs/shared/types/src/knowbase.ts
```

**Por Camada:**
```
Backend API
├── Routes: apps/api/src/routes/
├── Services: apps/api/src/services/
└── Plugins: apps/api/src/plugins/

Frontend
├── Pages: apps/web/src/app/
├── Components: apps/web/src/components/
└── Hooks: apps/web/src/hooks/
```

### Common Tasks

**Adicionar nova rota:**
1. Criar schema em `libs/shared/schemas/`
2. Criar service em `apps/api/src/services/`
3. Criar route em `apps/api/src/routes/`
4. Adicionar testes em `apps/api/src/routes/__tests__/`

**Adicionar novo componente:**
1. Criar em `apps/web/src/components/`
2. Usar schemas de `libs/shared/schemas/`
3. Adicionar testes em `apps/web/src/components/__tests__/`

**Adicionar nova feature:**
1. Criar lib em `libs/features/[feature-name]/`
2. Exportar schemas, services, types
3. Usar em apps conforme necessário

---

## 🔍 Code Search Patterns

### Finding Related Code

**Grep patterns:**
```bash
# Encontrar todos os usos de um schema
grep -r "createKnowbaseSchema" .

# Encontrar todas as rotas de uma feature
grep -r "knowbases" apps/api/src/routes/

# Encontrar todos os testes de uma feature
find . -name "*knowbase*.test.ts"
```

### NX Commands

```bash
# Ver dependências de um projeto
nx graph --focus=api

# Executar testes de um projeto
nx test api

# Build de um projeto
nx build api

# Ver o que foi afetado por mudanças
nx affected:test
```

---

## 📚 References

- [NX Documentation](https://nx.dev/)
- [Fastify Documentation](https://www.fastify.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

**Próximo documento:** [Business Logic](BUSINESS_LOGIC.md)

