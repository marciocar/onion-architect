# ADR-003: Prisma como ORM

**Status:** ✅ Aprovado  
**Data:** 2025-12-12  
**Decisores:** Tech Lead, Backend Team

---

## Context

Precisamos escolher uma solução de acesso a dados para PostgreSQL.

**Requisitos:**
- Type-safe database access
- Migrations robustas
- Multi-tenancy support (RLS)
- Performance otimizada
- Developer experience excelente
- Suporte a PostgreSQL 16

**Alternativas consideradas:**
1. Prisma
2. Drizzle ORM
3. TypeORM
4. Raw SQL (pg)

---

## Decision

Adotar **Prisma 6.x** como ORM para acesso ao PostgreSQL.

**Estratégia de Migrations:**
- **Development:** Shadow database para validação
- **Production:** Migrations aplicadas via CI/CD
- **Strategy:** Prisma Migrate (não db push em prod)

---

## Rationale

### Por que Prisma?

1. **Type Safety**
   - Geração automática de tipos TypeScript
   - Type-safe queries em compile-time
   - Autocomplete excelente no IDE
   - Type inference perfeito

2. **Developer Experience**
   - Prisma Studio (GUI para DB)
   - Migrations automáticas
   - Schema declarativo (single source of truth)
   - Hot reload em desenvolvimento

3. **Performance**
   - Query builder otimizado
   - Connection pooling nativo
   - Prepared statements automáticos
   - Menos overhead que TypeORM

4. **Multi-tenancy Support**
   - RLS pode ser configurado no schema
   - Extensions para PostgreSQL
   - Suporte a schemas múltiplos (se necessário)

5. **Ecosystem**
   - Comunidade grande e ativa
   - Documentação excelente
   - Plugins e ferramentas
   - Suporte oficial da Vercel

### Por que não Drizzle?

- ✅ Type-safe também
- ✅ Mais leve que Prisma
- ❌ Menos maduro
- ❌ Ecosystem menor
- ❌ Migrations menos robustas
- **Decisão:** Prisma mais maduro e completo

### Por que não TypeORM?

- ❌ Performance inferior
- ❌ Type safety menos robusto
- ❌ Decorators podem ser confusos
- ❌ Menos ativo (manutenção lenta)

### Por que não Raw SQL?

- ✅ Performance máxima
- ❌ Sem type safety
- ❌ Mais propenso a erros
- ❌ Manutenção difícil
- **Decisão:** Type safety > raw performance

---

## Consequences

### Positivas ✅

- **Type Safety:** Queries type-safe, menos bugs
- **DX:** Prisma Studio, migrations fáceis
- **Performance:** Query builder otimizado
- **Migrations:** Sistema robusto de versionamento
- **Documentation:** Excelente documentação

### Negativas ⚠️

- **Learning Curve:** Prisma tem conceitos próprios
- **Flexibility:** Algumas queries complexas podem ser difíceis
- **Bundle Size:** Prisma Client adiciona ao bundle
- **Migration Lock:** Migrations podem travar em produção

### Mitigações

- Documentação de patterns comuns
- Raw queries quando necessário (`$queryRaw`)
- Migrations testadas em staging antes de prod
- Backup antes de migrations críticas

---

## Implementation Details

### Schema Structure

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Knowbase {
  id          String   @id @default(uuidv7())
  tenantId    String   // Multi-tenancy
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([tenantId])
  @@map("knowbases")
}
```

### Migration Strategy

**Development:**
```bash
# Criar migration
npx prisma migrate dev --name add_knowbase_table

# Validar com shadow database
npx prisma migrate dev --create-only
```

**Production:**
```bash
# Aplicar migrations (via CI/CD)
npx prisma migrate deploy

# NUNCA usar db push em produção
```

### RLS Integration

```prisma
// Extensions para RLS
model Knowbase {
  // ... campos
  
  // RLS será configurado via SQL migrations
  // Prisma não gerencia RLS diretamente
}
```

```sql
-- migrations/001_enable_rls.sql
ALTER TABLE knowbases ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON knowbases
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

### Type-Safe Queries

```typescript
import { prisma } from '@onion/database';

// Type-safe query
const knowbase = await prisma.knowbase.findUnique({
  where: { id: '...' },
  include: { agents: true },
});

// TypeScript sabe exatamente o tipo de `knowbase`
```

---

## Migration Best Practices

1. **Sempre criar migrations explícitas**
   - Não usar `db push` em produção
   - Migrations devem ser versionadas no Git

2. **Testar migrations localmente**
   - Shadow database valida migrations
   - Testar rollback quando possível

3. **Migrations atômicas**
   - Uma migration = uma mudança lógica
   - Não misturar schema changes com data migrations

4. **Backup antes de migrations críticas**
   - Especialmente em produção
   - Ter plano de rollback

5. **Documentar breaking changes**
   - Se migration quebra código existente
   - Documentar em CHANGELOG

---

## References

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Multi-tenancy](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

**Próximo ADR:** [ADR-004: Multi-tenancy com RLS](004-multi-tenancy-rls.md)

