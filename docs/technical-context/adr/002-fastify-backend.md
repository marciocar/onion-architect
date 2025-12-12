# ADR-002: Fastify como Framework Backend

**Status:** ✅ Aprovado  
**Data:** 2025-12-12  
**Decisores:** Tech Lead, Backend Team

---

## Context

Precisamos escolher um framework HTTP para o backend da API do Onion App.

**Requisitos:**
- Alta performance (low latency)
- TypeScript first-class support
- Plugin ecosystem robusto
- Suporte a async/await
- OpenAPI/Swagger integration
- Multi-tenancy support

**Alternativas consideradas:**
1. Fastify
2. Express
3. NestJS
4. Hono

---

## Decision

Adotar **Fastify 5.x** como framework HTTP para o backend.

**Justificativa técnica:**
- Performance superior (2-3x mais rápido que Express)
- TypeScript nativo com tipagem forte
- Plugin system poderoso e modular
- Schema validation integrado (JSON Schema)
- OpenAPI/Swagger automático
- Async/await first-class

---

## Rationale

### Por que Fastify?

1. **Performance**
   - 2-3x mais rápido que Express
   - Overhead mínimo
   - Ideal para APIs de alta performance
   - Benchmark: [Fastify Benchmarks](https://www.fastify.io/benchmarks/)

2. **TypeScript Support**
   - Tipagem forte nativa
   - Type inference excelente
   - Integração com Zod (via plugins)
   - Type-safe routes e schemas

3. **Plugin Ecosystem**
   - Arquitetura modular via plugins
   - Reutilização de código
   - Encapsulamento de funcionalidades
   - Plugins populares: `@fastify/cors`, `@fastify/helmet`, `@fastify/swagger`

4. **Schema Validation**
   - JSON Schema nativo
   - Validação automática de request/response
   - Integração com Zod (via `@fastify/type-provider-typebox`)
   - Type safety em runtime

5. **Developer Experience**
   - API limpa e intuitiva
   - Logging integrado (Pino)
   - Error handling robusto
   - Hot reload em desenvolvimento

### Por que não Express?

- ❌ Performance inferior
- ❌ TypeScript support menos robusto
- ❌ Sem schema validation nativo
- ❌ Middleware pattern menos type-safe

### Por que não NestJS?

- ❌ Overhead maior (mais complexo)
- ❌ Performance inferior ao Fastify
- ❌ Curva de aprendizado mais íngreme
- ❌ Over-engineering para nosso caso

### Por que não Hono?

- ✅ Performance excelente (Edge-first)
- ❌ Menos maduro que Fastify
- ❌ Ecosystem menor
- ❌ Menos plugins disponíveis

---

## Consequences

### Positivas ✅

- **Performance:** APIs mais rápidas, menor latência
- **Type Safety:** Validação em runtime + compile-time
- **Modularidade:** Plugins facilitam organização
- **DX:** API limpa, fácil de aprender
- **Ecosystem:** Plugins para tudo que precisamos

### Negativas ⚠️

- **Menos popular:** Menos recursos/tutoriais que Express
- **Curva inicial:** Conceitos de plugins podem confundir
- **Migration:** Se precisar migrar, mais trabalho

### Mitigações

- Documentação interna completa
- Code examples e patterns documentados
- Pair programming para onboarding

---

## Implementation Details

### Estrutura de Plugin

```typescript
// plugins/auth.ts
import { FastifyPluginAsync } from 'fastify';

const authPlugin: FastifyPluginAsync = async (fastify) => {
  // Auth logic
};

export default authPlugin;
```

### Schema Validation com Zod

```typescript
import { z } from 'zod';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const createKnowbaseSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

fastify.withTypeProvider<TypeBoxTypeProvider>().post(
  '/knowbases',
  {
    schema: {
      body: createKnowbaseSchema,
    },
  },
  async (request, reply) => {
    // Type-safe request.body
  }
);
```

### Multi-tenancy Support

```typescript
// Decorator para garantir tenant context
fastify.decorate('requireTenant', async (request, reply) => {
  const tenantId = request.headers['x-tenant-id'];
  if (!tenantId) {
    reply.code(401).send({ error: 'Tenant required' });
  }
  request.tenantId = tenantId;
});
```

---

## References

- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Fastify TypeScript Guide](https://www.fastify.io/docs/latest/Reference/TypeScript/)
- [Fastify Plugins](https://www.fastify.io/docs/latest/Reference/Plugins/)
- [Fastify Benchmarks](https://www.fastify.io/benchmarks/)

---

**Próximo ADR:** [ADR-003: Prisma como ORM](003-prisma-orm.md)

