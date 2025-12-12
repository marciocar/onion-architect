# 👥 Contributing Guide - Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 🌿 Branch Strategy

### Git Flow

**Branches principais:**
- `main` - Produção (protegida)
- `develop` - Desenvolvimento (default)
- `feature/*` - Features novas
- `fix/*` - Bug fixes
- `hotfix/*` - Hotfixes críticos

### Branch Naming

```bash
# Features
feature/knowbase-management
feature/agent-chat-streaming

# Bug fixes
fix/knowbase-deletion-error
fix/multi-tenancy-leak

# Hotfixes
hotfix/critical-security-patch
```

### Workflow

```
1. Criar branch de feature
   git checkout -b feature/my-feature develop

2. Desenvolver e commitar
   git commit -m "feat: add knowbase creation"

3. Push e criar PR
   git push origin feature/my-feature
   # Criar PR para develop

4. Code review e merge
   # Após aprovação, merge para develop

5. Deploy para staging
   # develop → staging (automático)

6. Deploy para produção
   # develop → main (após validação)
```

---

## 📝 Code Review Process

### Review Requirements

**Antes de criar PR:**
- [ ] Código segue style guide
- [ ] Testes passando (`nx test`)
- [ ] Lint passando (`nx lint`)
- [ ] Type check passando (`nx type-check`)
- [ ] Documentação atualizada (se necessário)

### Review Criteria

**O que revisar:**
1. **Funcionalidade:** Código faz o que deveria?
2. **Type Safety:** TypeScript strict, Zod validation?
3. **Multi-tenancy:** TenantId sempre presente?
4. **Performance:** N+1 queries? Índices adequados?
5. **Security:** Input validation? Tenant validation?
6. **Tests:** Cobertura adequada? Testes relevantes?

### Review Comments

**Formato:**
```markdown
**Sugestão:** [descrição]
**Crítico:** [descrição] (bloqueia merge)
**Nitpick:** [descrição] (opcional)
```

---

## 🧪 Testing Requirements

### Test Types

**Unit Tests:**
- Testar funções isoladas
- Mock de dependências externas
- Fast execution (< 100ms cada)

**Integration Tests:**
- Testar integração entre componentes
- Database real (test DB)
- API endpoints

**E2E Tests:**
- Testar fluxos completos
- Playwright
- Critical paths only

### Coverage Requirements

| Fase | Coverage |
|------|----------|
| V1 | 60% |
| V2 | 80% |

**O que não precisa de teste:**
- Types/interfaces
- Simple getters/setters
- Config files

### Running Tests

```bash
# Todos os testes
nx test

# Testes de um projeto
nx test api

# Testes afetados
nx affected:test

# E2E tests
nx e2e web
```

---

## 🚀 Deployment Process

### Development → Staging

**Automático via CI/CD (future):**
1. Push para `develop`
2. GitHub Actions roda testes
3. Build de apps
4. Deploy para staging
5. Smoke tests

### Staging → Production

**Manual (após validação):**
1. Merge `develop` → `main`
2. Tag release: `v1.0.0`
3. GitHub Actions deploy
4. Monitor logs
5. Rollback se necessário

### Rollback Procedure

```bash
# 1. Identificar commit anterior
git log --oneline

# 2. Reverter para commit
git revert <commit-hash>

# 3. Push e deploy
git push origin main
```

---

## 🛠️ Environment Setup

### Prerequisites

- Node.js 22 LTS
- pnpm 9.x
- Docker & Docker Compose
- PostgreSQL 16 (ou via Docker)
- Redis 7 (ou via Docker)

### Setup Steps

```bash
# 1. Clone repository
git clone <repo-url>
cd onion-app

# 2. Install dependencies
pnpm install

# 3. Start infrastructure
docker-compose up -d

# 4. Setup database
nx run database:migrate
nx run database:seed

# 5. Start apps
nx serve api      # Backend (port 3000)
nx serve web      # Frontend (port 3002)
nx serve worker   # Workers

# 6. Verify
curl http://localhost:3000/api/health
```

### Environment Variables

**`.env.local` (criar a partir de `.env.example`):**
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/onion

# Logto
LOGTO_ENDPOINT=http://localhost:3001
LOGTO_APP_ID=your-app-id
LOGTO_APP_SECRET=your-app-secret

# AI (BYOL)
OPENAI_API_KEY=sk-...

# Storage
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Qdrant
QDRANT_URL=http://localhost:6333
```

---

## 🐛 Debugging Guide

### Backend (Fastify)

**Logs:**
```typescript
// Logging automático com Pino
fastify.log.info({ tenantId, userId }, 'Action performed');
```

**Debug mode:**
```bash
DEBUG=* nx serve api
```

**Database queries:**
```typescript
// Habilitar query logging no Prisma
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Frontend (Next.js)

**React DevTools:**
- Instalar extensão do browser
- Inspect components e state

**Next.js Debug:**
```bash
NODE_OPTIONS='--inspect' nx serve web
```

### Database

**Prisma Studio:**
```bash
nx run database:studio
```

**Direct SQL:**
```bash
docker exec -it onion-postgres psql -U user -d onion
```

---

## 📋 Common Tasks

### Adicionar Nova Feature

```bash
# 1. Criar branch
git checkout -b feature/new-feature develop

# 2. Criar schema Zod
# libs/shared/schemas/src/new-feature.ts

# 3. Criar service
# libs/features/new-feature/src/service.ts

# 4. Criar route
# apps/api/src/routes/new-feature.ts

# 5. Criar testes
# apps/api/src/routes/__tests__/new-feature.test.ts

# 6. Commit e PR
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### Adicionar Nova Migration

```bash
# 1. Editar schema.prisma
# libs/database/prisma/schema.prisma

# 2. Criar migration
nx run database:migrate:dev --name add_new_table

# 3. Verificar migration
# libs/database/prisma/migrations/XXX_add_new_table/migration.sql

# 4. Commit migration
git add libs/database/prisma/migrations/
git commit -m "chore: add migration for new table"
```

### Adicionar Novo Componente React

```bash
# 1. Criar componente
# apps/web/src/components/NewComponent.tsx

# 2. Criar testes
# apps/web/src/components/__tests__/NewComponent.test.tsx

# 3. Exportar
# apps/web/src/components/index.ts
```

---

## 🎨 Code Style

### TypeScript

**Config:** `tsconfig.json` (strict mode)

**Linting:** ESLint 9.x
```bash
nx lint api
nx lint web
```

**Formatting:** Prettier 3.x
```bash
nx format:write
```

### Commit Messages

**Formato:** Conventional Commits

```bash
feat: add knowbase creation endpoint
fix: resolve multi-tenancy leak in agents
docs: update API documentation
refactor: simplify command execution
test: add tests for knowbase service
chore: update dependencies
```

---

## 📚 Resources

- [NX Documentation](https://nx.dev/)
- [Fastify Best Practices](https://www.fastify.io/docs/latest/Guides/Best-Practices/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Próximo documento:** [Troubleshooting Guide](TROUBLESHOOTING.md)

