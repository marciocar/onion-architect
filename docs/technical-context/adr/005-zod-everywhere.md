# ADR-005: Zod Everywhere

**Status:** ✅ Aprovado  
**Data:** 2025-12-12  
**Decisores:** Tech Lead, Full-stack Team

---

## Context

Precisamos de validação type-safe em todas as camadas da aplicação:
- API request/response validation
- Database schema validation
- Frontend form validation
- Type generation

**Requisitos:**
- Type safety em runtime
- Validação consistente entre camadas
- Single source of truth para schemas
- TypeScript integration perfeita

**Alternativas consideradas:**
1. Zod (everywhere)
2. Yup
3. Joi
4. TypeBox
5. Valibot

---

## Decision

Adotar **Zod 3.23+** como biblioteca de validação em **todas as camadas** do stack:
- ✅ Fastify (backend API)
- ✅ Prisma (database validation)
- ✅ React/Next.js (frontend forms)
- ✅ Type generation (Zod → TypeScript types)

**Estratégia:** "Zod Everywhere" - um schema, múltiplos usos.

---

## Rationale

### Por que Zod?

1. **TypeScript First**
   - Type inference perfeito
   - Geração de tipos automática
   - Type-safe por padrão
   - Integração nativa com TS

2. **Performance**
   - Validação rápida
   - Bundle size pequeno
   - Tree-shakeable
   - Zero dependencies (core)

3. **Developer Experience**
   - API intuitiva e fluente
   - Composable schemas
   - Mensagens de erro claras
   - Excelente documentação

4. **Ecosystem**
   - Integração com Fastify (`@fastify/type-provider-typebox` + Zod)
   - Integração com React Hook Form
   - Integração com tRPC (se necessário)
   - Comunidade grande e ativa

5. **Flexibility**
   - Validação simples e complexa
   - Custom validators
   - Transformações
   - Async validation

### Por que não Yup?

- ❌ Menos TypeScript-friendly
- ❌ Performance inferior
- ❌ API menos intuitiva
- ❌ Menos ativo

### Por que não Joi?

- ❌ Focado em Node.js (não funciona no browser)
- ❌ Bundle size maior
- ❌ API menos moderna

### Por que não TypeBox?

- ✅ Performance excelente
- ✅ Type-safe
- ❌ Menos popular
- ❌ Ecosystem menor

### Por que não Valibot?

- ✅ Performance excelente
- ✅ Bundle size mínimo
- ❌ Muito novo (menos maduro)
- ❌ Ecosystem menor

---

## Consequences

### Positivas ✅

- **Type Safety:** Validação em runtime + compile-time
- **Consistency:** Mesmo schema em todas as camadas
- **DX:** API intuitiva, menos bugs
- **Performance:** Validação rápida
- **Reusability:** Schemas compartilhados entre frontend/backend

### Negativas ⚠️

- **Bundle Size:** Zod adiciona ao bundle (mas pequeno)
- **Learning Curve:** Conceitos de Zod (aceitável)
- **Duplication:** Possível duplicação de schemas (mitigado com libs compartilhadas)

### Mitigações

- Schemas compartilhados em `libs/shared/schemas`
- Documentação de patterns comuns
- Code generation quando possível

---

## Implementation Details

### Shared Schemas

```typescript
// libs/shared/schemas/src/knowbase.ts
import { z } from 'zod';

export const createKnowbaseSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  tenantId: z.string().uuid(), // Validado mas não enviado pelo cliente
});

export type CreateKnowbaseInput = z.infer<typeof createKnowbaseSchema>;
```

### Backend (Fastify)

```typescript
// apps/api/src/routes/knowbases.ts
import { createKnowbaseSchema } from '@onion/shared/schemas';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

fastify.withTypeProvider<TypeBoxTypeProvider>().post(
  '/knowbases',
  {
    schema: {
      body: createKnowbaseSchema,
      response: {
        201: z.object({
          id: z.string().uuid(),
          name: z.string(),
        }),
      },
    },
  },
  async (request, reply) => {
    // request.body é type-safe e validado
    const knowbase = await createKnowbase(request.body);
    reply.code(201).send(knowbase);
  }
);
```

### Frontend (React Hook Form)

```typescript
// apps/web/src/components/CreateKnowbaseForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createKnowbaseSchema } from '@onion/shared/schemas';

export function CreateKnowbaseForm() {
  const form = useForm({
    resolver: zodResolver(createKnowbaseSchema.omit({ tenantId: true })),
  });
  
  // Form é type-safe e validado
}
```

### Database Validation (Prisma)

```typescript
// libs/database/src/validators.ts
import { z } from 'zod';
import { createKnowbaseSchema } from '@onion/shared/schemas';

export function validateKnowbaseInput(input: unknown) {
  return createKnowbaseSchema.parse(input); // Throws se inválido
}

// Uso antes de Prisma
const validated = validateKnowbaseInput(rawInput);
await prisma.knowbase.create({ data: validated });
```

### Type Generation

```typescript
// libs/shared/schemas/src/index.ts
export * from './knowbase';
export * from './agent';
export * from './command';

// Types são inferidos automaticamente
type CreateKnowbaseInput = z.infer<typeof createKnowbaseSchema>;
```

---

## Best Practices

1. **Shared Schemas**
   - Schemas em `libs/shared/schemas`
   - Reutilizar entre frontend/backend
   - Single source of truth

2. **Composition**
   - Schemas pequenos e compostos
   - `.extend()`, `.merge()`, `.pick()`, `.omit()`

3. **Error Messages**
   - Mensagens customizadas quando necessário
   - Mensagens em português para usuários

4. **Transformations**
   - Usar `.transform()` para normalização
   - Ex: trim strings, normalizar emails

5. **Async Validation**
   - Usar `.refine()` para validações assíncronas
   - Ex: verificar se nome já existe

---

## References

- [Zod Documentation](https://zod.dev/)
- [Zod + Fastify](https://github.com/fastify/fastify-type-provider-typebox)
- [Zod + React Hook Form](https://react-hook-form.com/get-started#SchemaValidation)
- [Zod Best Practices](https://zod.dev/?id=best-practices)

---

**Próximo ADR:** [ADR-006: Logto Self-Hosted](006-logto-self-hosted.md)

