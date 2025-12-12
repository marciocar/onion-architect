# ADR-004: Multi-tenancy com Row-Level Security (RLS)

**Status:** ✅ Aprovado  
**Data:** 2025-12-12  
**Decisores:** Tech Lead, Backend Team, Security Lead

---

## Context

O Onion App precisa suportar múltiplos tenants (workspaces/empresas) desde V1, garantindo isolamento completo de dados.

**Requisitos:**
- Isolamento de dados obrigatório (compliance)
- Escalabilidade para 10K+ tenants
- Performance aceitável
- Simplicidade de implementação
- Suporte a LGPD/GDPR

**Alternativas consideradas:**
1. Row-Level Security (RLS) no PostgreSQL
2. Schema-per-tenant
3. Database-per-tenant
4. Application-level filtering

---

## Decision

Adotar **Row-Level Security (RLS)** no PostgreSQL como estratégia de multi-tenancy.

**Implementação:**
- Todas as tabelas têm coluna `tenantId`
- RLS policies garantem isolamento
- Context setting via `current_setting('app.current_tenant')`
- Application layer valida tenant antes de queries

---

## Rationale

### Por que RLS?

1. **Segurança**
   - Isolamento garantido pelo banco de dados
   - Impossível vazar dados entre tenants (se configurado corretamente)
   - Compliance com LGPD/GDPR facilitado
   - Audit trail nativo

2. **Performance**
   - Índices eficientes em `tenantId`
   - Queries otimizadas pelo PostgreSQL
   - Escalabilidade horizontal possível
   - Menos overhead que schema-per-tenant

3. **Simplicidade**
   - Uma database, múltiplos tenants
   - Migrations simples (uma vez)
   - Backup/restore unificado
   - Monitoring centralizado

4. **Escalabilidade**
   - Suporta 10K+ tenants facilmente
   - Particionamento possível no futuro
   - Sharding por tenant se necessário

### Por que não Schema-per-tenant?

- ✅ Isolamento forte
- ❌ Migrations complexas (N schemas)
- ❌ Connection pooling complicado
- ❌ Backup/restore complexo
- **Decisão:** Overhead operacional muito alto

### Por que não Database-per-tenant?

- ✅ Isolamento máximo
- ❌ Overhead operacional enorme
- ❌ Migrations impossíveis de gerenciar
- ❌ Custo de infra muito alto
- **Decisão:** Não escalável

### Por que não Application-level filtering?

- ✅ Simples de implementar
- ❌ Fácil de esquecer (risco de vazamento)
- ❌ Não garante isolamento
- ❌ Compliance difícil
- **Decisão:** Muito arriscado

---

## Consequences

### Positivas ✅

- **Segurança:** Isolamento garantido pelo DB
- **Compliance:** LGPD/GDPR facilitado
- **Performance:** Índices eficientes
- **Simplicidade:** Uma database, migrations simples
- **Escalabilidade:** Suporta muitos tenants

### Negativas ⚠️

- **Complexidade inicial:** Setup de RLS requer conhecimento
- **Debugging:** Queries podem ser mais difíceis de debugar
- **Migration risk:** Migrations podem afetar todos tenants
- **Performance:** Overhead mínimo em queries (aceitável)

### Mitigações

- Documentação completa de RLS patterns
- Testes extensivos de isolamento
- Monitoring de queries por tenant
- Backup antes de migrations críticas

---

## Implementation Details

### Schema Pattern

```prisma
model Knowbase {
  id        String   @id @default(uuidv7())
  tenantId String   // OBRIGATÓRIO em todas as tabelas
  name      String
  
  @@index([tenantId]) // Índice obrigatório
  @@map("knowbases")
}
```

### RLS Policy Setup

```sql
-- migrations/001_enable_rls.sql

-- Habilitar RLS em todas as tabelas
ALTER TABLE knowbases ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;
-- ... todas as tabelas

-- Policy padrão: isolamento por tenant
CREATE POLICY tenant_isolation_knowbases ON knowbases
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

CREATE POLICY tenant_isolation_agents ON agents
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- ... policies para todas as tabelas
```

### Application Layer

```typescript
// libs/database/src/client.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Middleware para setar tenant context
prisma.$use(async (params, next) => {
  // Tenant vem do request (JWT token)
  const tenantId = getTenantFromContext();
  
  // Setar context no PostgreSQL
  await prisma.$executeRawUnsafe(
    `SET app.current_tenant = '${tenantId}'`
  );
  
  return next(params);
});
```

### Fastify Plugin

```typescript
// plugins/tenant.ts
import { FastifyPluginAsync } from 'fastify';

const tenantPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    // Extrair tenant do JWT token
    const tenantId = request.user.tenantId;
    
    // Validar tenant existe e usuário tem acesso
    await validateTenantAccess(tenantId, request.user.id);
    
    // Setar no contexto
    request.tenantId = tenantId;
  });
  
  fastify.addHook('preHandler', async (request, reply) => {
    // Setar tenant no Prisma context
    await prisma.$executeRawUnsafe(
      `SET app.current_tenant = '${request.tenantId}'`
    );
  });
};
```

### Testing

```typescript
// tests/multi-tenancy.test.ts
describe('Multi-tenancy isolation', () => {
  it('should not leak data between tenants', async () => {
    const tenant1 = await createTenant();
    const tenant2 = await createTenant();
    
    // Criar knowbase no tenant1
    await setTenant(tenant1.id);
    const kb1 = await createKnowbase({ name: 'KB1' });
    
    // Tentar acessar do tenant2
    await setTenant(tenant2.id);
    const kb2 = await prisma.knowbase.findUnique({
      where: { id: kb1.id },
    });
    
    expect(kb2).toBeNull(); // Isolamento garantido
  });
});
```

---

## Security Considerations

1. **Always validate tenant in application layer**
   - RLS é última linha de defesa
   - Validar tenant antes de queries

2. **Never trust client-provided tenant ID**
   - Sempre extrair do JWT token
   - Validar usuário tem acesso ao tenant

3. **Audit logging**
   - Logar todas as queries por tenant
   - Monitorar acessos suspeitos

4. **Regular security audits**
   - Testar isolamento periodicamente
   - Penetration testing

---

## References

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Prisma Multi-tenancy Guide](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Multi-tenancy Patterns](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

**Próximo ADR:** [ADR-005: Zod Everywhere](005-zod-everywhere.md)

