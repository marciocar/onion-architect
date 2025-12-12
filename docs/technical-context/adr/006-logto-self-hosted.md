# ADR-006: Logto Self-Hosted

**Status:** ✅ Aprovado  
**Data:** 2025-12-12  
**Decisores:** Tech Lead, Security Lead

---

## Context

Precisamos de um sistema de autenticação e autorização para o Onion App.

**Requisitos:**
- Multi-tenancy support
- SSO/SAML (future, enterprise)
- Social login (Google, GitHub)
- Self-hosted (controle de dados)
- LGPD/GDPR compliant
- JWT tokens
- Role-based access control (RBAC)

**Alternativas consideradas:**
1. Logto (self-hosted)
2. Keycloak
3. Auth0 (SaaS)
4. Clerk (SaaS)
5. NextAuth.js (custom)

---

## Decision

Adotar **Logto self-hosted** como sistema de autenticação e autorização.

**Justificativa:**
- Open-source e self-hosted (controle de dados)
- Multi-tenancy nativo
- Moderno e developer-friendly
- Suporte a SSO/SAML (future)
- Integração fácil com Fastify

---

## Rationale

### Por que Logto?

1. **Self-Hosted**
   - Controle total dos dados
   - Compliance facilitado (LGPD/GDPR)
   - Sem vendor lock-in
   - Custo controlado

2. **Multi-tenancy Native**
   - Suporte nativo a múltiplos tenants
   - Isolamento de dados
   - Perfect fit para nosso caso

3. **Modern & Developer-Friendly**
   - API RESTful moderna
   - SDKs para múltiplas linguagens
   - Documentação excelente
   - TypeScript support

4. **Features**
   - Social login (Google, GitHub, etc.)
   - Email/password
   - SSO/SAML (future)
   - MFA (future)
   - RBAC

5. **Ecosystem**
   - Integração com Fastify
   - SDKs para React/Next.js
   - Admin dashboard
   - API completa

### Por que não Keycloak?

- ✅ Muito maduro e robusto
- ❌ Complexo demais para nosso caso
- ❌ Curva de aprendizado íngreme
- ❌ Overhead operacional alto
- **Decisão:** Over-engineering

### Por que não Auth0/Clerk (SaaS)?

- ✅ Simples de usar
- ❌ Vendor lock-in
- ❌ Dados em terceiros (compliance difícil)
- ❌ Custo pode escalar
- **Decisão:** Não self-hosted

### Por que não NextAuth.js?

- ✅ Simples e direto
- ❌ Não tem multi-tenancy nativo
- ❌ Precisaríamos construir muito
- ❌ Manutenção maior
- **Decisão:** Muito trabalho custom

---

## Consequences

### Positivas ✅

- **Controle:** Dados em nosso controle
- **Compliance:** LGPD/GDPR facilitado
- **Multi-tenancy:** Suporte nativo
- **Modern:** API e SDKs modernos
- **Flexibility:** Customizável

### Negativas ⚠️

- **Operational:** Precisamos manter Logto
- **Setup:** Setup inicial mais complexo
- **Learning:** Curva de aprendizado
- **Updates:** Precisamos atualizar manualmente

### Mitigações

- Docker Compose para facilitar setup
- Documentação completa
- Monitoring e alertas
- Backup automático

---

## Implementation Details

### Docker Compose Setup

```yaml
# docker-compose.yml
services:
  logto:
    image: logtoio/logto:latest
    ports:
      - "3001:3001"
    environment:
      - DB_URL=postgresql://logto:password@postgres:5432/logto
      - ENDPOINT=http://localhost:3001
    depends_on:
      - postgres
```

### Fastify Integration

```typescript
// plugins/auth.ts
import { FastifyPluginAsync } from 'fastify';
import { LogtoClient } from '@logto/node';

const logto = new LogtoClient({
  endpoint: process.env.LOGTO_ENDPOINT!,
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
});

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('authenticate', async (request, reply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }
    
    const claims = await logto.verifyAccessToken(token);
    request.user = claims;
    request.tenantId = claims.tenantId; // Multi-tenancy
  });
};

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      tenantId: string;
      email: string;
    };
  }
}
```

### Next.js Integration

```typescript
// apps/web/src/lib/auth.ts
import { LogtoClient } from '@logto/next';

export const logto = new LogtoClient({
  endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!,
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
});
```

### Multi-tenancy Setup

```typescript
// Ao criar usuário, associar a tenant
const user = await logto.createUser({
  username: email,
  primaryEmail: email,
  customData: {
    tenantId: tenant.id, // Associar a tenant
  },
});
```

---

## Security Considerations

1. **Token Validation**
   - Sempre validar tokens no backend
   - Verificar expiração
   - Verificar assinatura

2. **HTTPS Only**
   - Logto apenas via HTTPS em produção
   - Cookies secure flag

3. **Rate Limiting**
   - Rate limit em endpoints de auth
   - Prevenir brute force

4. **Secrets Management**
   - Secrets em variáveis de ambiente
   - Nunca commitar secrets
   - Rotação periódica

---

## References

- [Logto Documentation](https://docs.logto.io/)
- [Logto Self-Hosted Guide](https://docs.logto.io/self-hosted/)
- [Logto Multi-tenancy](https://docs.logto.io/recipes/multi-tenancy/)

---

**Todos os ADRs concluídos. Ver:** [index.md](../index.md)

