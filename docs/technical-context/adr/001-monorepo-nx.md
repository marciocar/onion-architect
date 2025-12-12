# ADR-001: Monorepo com NX

**Status:** ✅ Aprovado  
**Data:** 2025-12-12  
**Decisores:** Tech Lead, Product Owner

---

## Context

O Onion App precisa de uma estrutura que permita:
- Compartilhamento de código entre frontend e backend
- Features modulares e reutilizáveis
- Builds otimizados e cache
- Desenvolvimento full-stack eficiente
- Escalabilidade para múltiplos apps no futuro

**Alternativas consideradas:**
1. Monorepo com Turborepo
2. Monorepo com NX
3. Repositórios separados
4. Monorepo simples (pnpm workspaces)

---

## Decision

Adotar **NX 19.x** como ferramenta de monorepo para gerenciar o projeto Onion App.

**Estrutura:**
```
onion-app/
├── apps/
│   ├── api/          # Fastify backend
│   ├── web/          # Next.js frontend
│   └── worker/       # BullMQ workers
├── libs/
│   ├── shared/       # Shared utilities
│   ├── database/     # Prisma client
│   ├── auth/         # Auth utilities
│   ├── ai/           # AI integrations
│   └── features/     # Feature modules
└── tools/            # NX generators
```

---

## Rationale

### Por que NX?

1. **Mature & Battle-tested**
   - Usado por grandes empresas (Google, Microsoft, etc.)
   - Comunidade ativa e suporte robusto
   - Roadmap claro e atualizações frequentes

2. **Developer Experience**
   - Task caching inteligente (builds 10x mais rápidos)
   - Graph de dependências visual
   - Generators para scaffolding
   - Affected commands (só testa/builda o que mudou)

3. **TypeScript First**
   - Suporte nativo a TypeScript
   - Path mapping automático
   - Type checking incremental

4. **Ecosystem Integration**
   - Plugins para Next.js, Fastify, Prisma
   - Suporte a Docker
   - CI/CD otimizado

5. **Escalabilidade**
   - Suporta projetos grandes (100+ libs)
   - Computed caching
   - Distributed task execution (futuro)

### Por que não Turborepo?

- Menos maduro que NX
- Menos plugins disponíveis
- Menor comunidade
- Foco mais em build, menos em DX

### Por que não repos separados?

- Dificulta compartilhamento de código
- Duplicação de tipos/interfaces
- Deploys mais complexos
- Menos visibilidade de dependências

---

## Consequences

### Positivas ✅

- **Builds rápidos:** Cache reduz tempo de build em 80%+
- **Type safety:** Compartilhamento de tipos entre apps/libs
- **Developer velocity:** Generators aceleram criação de features
- **Code reuse:** Libs compartilhadas evitam duplicação
- **Dependency graph:** Visibilidade clara de dependências

### Negativas ⚠️

- **Curva de aprendizado:** NX tem conceitos próprios
- **Overhead inicial:** Setup mais complexo que repo simples
- **Tooling:** Requer conhecimento de NX CLI

### Mitigações

- Documentação completa em `CODEBASE_GUIDE.md`
- Generators customizados para padrões do projeto
- Onboarding guide para novos desenvolvedores

---

## Alternatives Considered

### Turborepo
- ✅ Mais simples que NX
- ❌ Menos maduro
- ❌ Menos plugins
- **Decisão:** Não escolhido por maturidade

### pnpm workspaces
- ✅ Simples e direto
- ❌ Sem task orchestration
- ❌ Sem dependency graph
- **Decisão:** Não escolhido por falta de features

### Repos separados
- ✅ Simplicidade
- ❌ Duplicação de código
- ❌ Deploys complexos
- **Decisão:** Não escolhido por overhead operacional

---

## References

- [NX Documentation](https://nx.dev/)
- [NX vs Turborepo Comparison](https://nx.dev/concepts/more-concepts/turborepo-vs-nx)
- [NX Best Practices](https://nx.dev/concepts/more-concepts/mental-model)

---

**Próximo ADR:** [ADR-002: Fastify como Framework Backend](002-fastify-backend.md)

