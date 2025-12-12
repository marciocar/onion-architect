# 🤖 AI Development Guide - Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

Este documento serve como guia para desenvolvimento assistido por IA (Cursor AI, GitHub Copilot, etc.) no projeto Onion App.

---

## 🎯 Code Style Preferences

### TypeScript Conventions

**Naming:**
```typescript
// ✅ CORRETO
interface UserProfile {
  id: string;
  email: string;
  createdAt: Date;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // ...
};

// ❌ INCORRETO
interface user_profile {
  id: string;
}

const GetUserProfile = async (userId: string) => {
  // ...
};
```

**File Naming:**
- Components: `PascalCase.tsx` (ex: `UserProfile.tsx`)
- Utilities: `camelCase.ts` (ex: `formatDate.ts`)
- Types: `camelCase.types.ts` (ex: `user.types.ts`)
- Constants: `UPPER_SNAKE_CASE.ts` (ex: `API_ENDPOINTS.ts`)

### Code Organization

**Prefer:**
- Small, focused functions (< 50 lines)
- Single responsibility principle
- Composition over inheritance
- Explicit over implicit

**Avoid:**
- God objects/functions
- Deep nesting (> 3 levels)
- Magic numbers/strings
- Any types (use `unknown` if needed)

---

## 🧪 Testing Approach

### Testing Framework

- **Unit/Integration:** Vitest 2.x
- **E2E:** Playwright 1.50+
- **Coverage Target:** 60% (V1), 80% (V2)

### Test Structure

```typescript
// ✅ CORRETO
describe('KnowbaseService', () => {
  describe('createKnowbase', () => {
    it('should create knowbase with valid input', async () => {
      // Arrange
      const input = { name: 'Test', tenantId: 'tenant-1' };
      
      // Act
      const result = await service.createKnowbase(input);
      
      // Assert
      expect(result).toMatchObject({
        id: expect.any(String),
        name: 'Test',
      });
    });
    
    it('should throw error with invalid tenant', async () => {
      // ...
    });
  });
});
```

### Test File Naming

- Unit tests: `*.test.ts`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.e2e.test.ts`

### Test Data Management

```typescript
// libs/shared/testing/src/fixtures.ts
export const createTestKnowbase = (overrides?: Partial<Knowbase>) => ({
  id: 'test-id',
  name: 'Test Knowbase',
  tenantId: 'test-tenant',
  ...overrides,
});
```

---

## 🔄 Common Patterns

### Error Handling

```typescript
// ✅ CORRETO - Use Result pattern ou exceptions claras
import { z } from 'zod';

export class KnowbaseNotFoundError extends Error {
  constructor(id: string) {
    super(`Knowbase ${id} not found`);
    this.name = 'KnowbaseNotFoundError';
  }
}

// Uso
try {
  const knowbase = await findKnowbase(id);
  if (!knowbase) {
    throw new KnowbaseNotFoundError(id);
  }
} catch (error) {
  if (error instanceof KnowbaseNotFoundError) {
    reply.code(404).send({ error: error.message });
  }
  throw error;
}
```

### Async/Await Patterns

```typescript
// ✅ CORRETO - Sempre use async/await
const result = await fetchData();

// ❌ INCORRETO - Evite callbacks
fetchData((err, result) => {
  // ...
});
```

### Validation Pattern

```typescript
// ✅ CORRETO - Zod everywhere
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
});

const validated = schema.parse(input); // Throws se inválido
```

### Multi-tenancy Pattern

```typescript
// ✅ SEMPRE incluir tenantId
const knowbase = await prisma.knowbase.create({
  data: {
    name: input.name,
    tenantId: request.tenantId, // OBRIGATÓRIO
  },
});

// ❌ NUNCA esquecer tenantId
const knowbase = await prisma.knowbase.create({
  data: {
    name: input.name,
    // ❌ Faltando tenantId
  },
});
```

### Design System Pattern

```typescript
// ✅ CORRETO - Usar componentes do design system
import { Button, Input, Card } from '@onion/design-system';

export function MyComponent() {
  return (
    <Card>
      <Input placeholder="Nome" />
      <Button variant="primary">Salvar</Button>
    </Card>
  );
}

// ❌ INCORRETO - Criar componentes custom sem necessidade
export function MyComponent() {
  return (
    <div className="custom-card">
      <input className="custom-input" />
      <button className="custom-button">Salvar</button>
    </div>
  );
}
```

### Mobile/Web Sharing Pattern

```typescript
// ✅ CORRETO - Componente universal funciona em ambos
import { Button } from '@onion/design-system';

// Funciona em web e mobile automaticamente
<Button>Click me</Button>

// ✅ CORRETO - Variant específico quando necessário
import { ButtonWeb } from '@onion/design-system';

// Apenas em web quando comportamento específico necessário
<ButtonWeb webOnlyProp={value} />
```

---

## ⚠️ Gotchas and Anti-patterns

### Common Mistakes

1. **Esquecer tenantId**
   ```typescript
   // ❌ ERRADO
   await prisma.knowbase.create({ data: { name: 'Test' } });
   
   // ✅ CORRETO
   await prisma.knowbase.create({
     data: { name: 'Test', tenantId: request.tenantId },
   });
   ```

2. **Não validar input**
   ```typescript
   // ❌ ERRADO
   const knowbase = await createKnowbase(request.body);
   
   // ✅ CORRETO
   const validated = createKnowbaseSchema.parse(request.body);
   const knowbase = await createKnowbase(validated);
   ```

3. **Usar `any` type**
   ```typescript
   // ❌ ERRADO
   function process(data: any) { }
   
   // ✅ CORRETO
   function process(data: unknown) {
     const validated = schema.parse(data);
   }
   ```

4. **Não tratar erros de RLS**
   ```typescript
   // ❌ ERRADO
   const knowbase = await prisma.knowbase.findUnique({ where: { id } });
   
   // ✅ CORRETO
   // Tenant context já está setado via middleware
   const knowbase = await prisma.knowbase.findUnique({ where: { id } });
   if (!knowbase) {
     throw new KnowbaseNotFoundError(id);
   }
   ```

### Performance Considerations

1. **N+1 Queries**
   ```typescript
   // ❌ ERRADO
   for (const kb of knowbases) {
     const agents = await prisma.agent.findMany({ where: { knowbaseId: kb.id } });
   }
   
   // ✅ CORRETO
   const knowbasesWithAgents = await prisma.knowbase.findMany({
     include: { agents: true },
   });
   ```

2. **Índices obrigatórios**
   ```prisma
   // ✅ SEMPRE indexar tenantId
   model Knowbase {
     tenantId String
     @@index([tenantId])
   }
   ```

3. **Connection Pooling**
   ```typescript
   // ✅ Prisma já gerencia pooling
   // Não criar múltiplas instâncias
   export const prisma = new PrismaClient(); // Singleton
   ```

### Security Requirements

1. **Sempre validar tenant access**
   ```typescript
   // ✅ CORRETO
   if (knowbase.tenantId !== request.tenantId) {
     throw new ForbiddenError();
   }
   ```

2. **Nunca confiar em input do cliente**
   ```typescript
   // ❌ ERRADO
   const tenantId = request.body.tenantId;
   
   // ✅ CORRETO
   const tenantId = request.user.tenantId; // Do JWT token
   ```

3. **Sanitizar output**
   ```typescript
   // ✅ Usar Zod para sanitizar
   const outputSchema = z.object({
    id: z.string(),
    name: z.string(),
    // Não incluir campos sensíveis
  });
  ```

---

## 🔗 Integration Patterns

### Fastify + Prisma

```typescript
// ✅ Pattern recomendado
fastify.post('/knowbases', async (request, reply) => {
  // 1. Validar input
  const input = createKnowbaseSchema.parse(request.body);
  
  // 2. Criar com tenantId do contexto
  const knowbase = await prisma.knowbase.create({
    data: {
      ...input,
      tenantId: request.tenantId,
    },
  });
  
  // 3. Retornar resposta validada
  return reply.code(201).send(knowbaseSchema.parse(knowbase));
});
```

### Next.js + React Hook Form + Zod

```typescript
// ✅ Pattern recomendado
const form = useForm<CreateKnowbaseInput>({
  resolver: zodResolver(createKnowbaseSchema.omit({ tenantId: true })),
});

const onSubmit = async (data: CreateKnowbaseInput) => {
  const response = await fetch('/api/knowbases', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    // Handle error
  }
};
```

---

## 📚 Code Examples

### Creating a New Feature

```typescript
// 1. Schema (libs/shared/schemas/src/feature.ts)
export const createFeatureSchema = z.object({
  name: z.string().min(1),
});

// 2. Service (apps/api/src/services/feature.ts)
export class FeatureService {
  async create(input: CreateFeatureInput, tenantId: string) {
    return prisma.feature.create({
      data: { ...input, tenantId },
    });
  }
}

// 3. Route (apps/api/src/routes/features.ts)
fastify.post('/features', async (request, reply) => {
  const input = createFeatureSchema.parse(request.body);
  const feature = await featureService.create(input, request.tenantId);
  return reply.code(201).send(feature);
});

// 4. Test (apps/api/src/routes/__tests__/features.test.ts)
describe('POST /features', () => {
  it('should create feature', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/features',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Test' },
    });
    
    expect(response.statusCode).toBe(201);
  });
});
```

---

## 🎨 AI Prompting Tips

### When Asking AI to Write Code

**Good prompts:**
- "Create a Fastify route for creating knowbases with Zod validation and multi-tenancy support"
- "Write a Prisma query to find knowbases with their agents, ensuring tenant isolation"
- "Create a React form component using React Hook Form and Zod for knowbase creation"

**Bad prompts:**
- "Create a route" (muito vago)
- "Make it work" (sem contexto)
- "Fix this" (sem explicar o problema)

### Context to Provide

1. **Stack:** "Using Fastify, Prisma, Zod, multi-tenancy"
2. **Pattern:** "Follow the pattern in `routes/knowbases.ts`"
3. **Constraints:** "Must include tenantId, validate with Zod"

---

## 📖 References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Fastify Best Practices](https://www.fastify.io/docs/latest/Guides/Best-Practices/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Zod Documentation](https://zod.dev/)

---

**Próximo documento:** [Codebase Guide](CODEBASE_GUIDE.md)

