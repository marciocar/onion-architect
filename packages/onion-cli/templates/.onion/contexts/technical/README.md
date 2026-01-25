# Technical Context

> **Onion v4.0** | Multi-Context Development Orchestrator

**📚 Sistema de Níveis**: Leia `docs/onion/levels-system.md` para entender a filosofia 80/15/5

---

## 🎯 Sobre Este Contexto

O **Technical Context** é dedicado a Developers, DevOps, QA Engineers, e todos os profissionais que trabalham com:

- 💻 **Desenvolvimento de código**
- 🧪 **Testes (unit, integration, e2e)**
- 🔀 **Git workflows (gitflow, branches, PRs)**
- 📚 **Documentação técnica**
- 🏗️ **Arquitetura e design**
- 🚀 **Deploy e CI/CD**

---

## 🚀 Quick Start

### Comandos Starter (80% dos casos)

Use estes comandos para 80% das suas necessidades diárias:

```bash
/technical/work "minha-task"        # Iniciar trabalho em uma task
/technical/plan "feature-x"         # Planejar implementação técnica
/technical/pr                       # Criar Pull Request
/technical/sync                     # Sincronizar branch com main
/technical/docs                     # Gerar documentação técnica
```

### Comandos Intermediate (15% dos casos)

Para workflows mais avançados:

```bash
/technical/start                    # Iniciar sessão de desenvolvimento
/technical/pre-pr                   # Preparar para PR
/technical/code-review              # Review de código
/technical/build-index              # Construir índice de docs
/technical/unit                     # Executar testes unitários
/technical/integration              # Executar testes de integração
```

### Comandos Advanced (5% dos casos)

Para casos especializados:

```bash
/technical/hotfix                   # Criar hotfix urgente
/technical/bump                     # Bump de versão
/technical/consolidate-documents    # Consolidar documentação
/technical/e2e                      # Executar testes end-to-end
```

---

## 🤖 Agentes Especializados

Invoque agentes especializados com `@nome-agente`:

| Agente | Especialidade | Uso |
|--------|--------------|-----|
| @react-developer | React/TypeScript | Desenvolvimento frontend |
| @nodejs-specialist | Node.js backend | Desenvolvimento backend |
| @postgres-specialist | PostgreSQL | Banco de dados |
| @zen-engine-specialist | ZenStack | Auth & access control |
| @nx-monorepo-specialist | Nx monorepo | Workspace management |
| @gitflow-specialist | Git workflows | Branching strategies |
| @test-engineer | Testes | Estratégia de testes |
| @code-reviewer | Code review | Revisão de código |
| @cursor-specialist | Cursor IDE | Problemas de IDE |

---

## 📚 Estrutura

```
technical/
├── commands/
│   ├── starter/          # 10 comandos essenciais (80%)
│   ├── intermediate/     # 15 comandos avançados (15%)
│   └── advanced/         # 7 comandos especializados (5%)
├── agents/               # 23 agentes especializados
├── knowbase/             # Knowledge bases técnicas
└── sessions/             # Sessions de desenvolvimento
```

---

## 🔗 Integrações

### Version Control
- ✅ **Git** (gitflow)
- ✅ GitHub
- ✅ GitLab

### Testing Frameworks
- ✅ **Jest** (unit)
- ✅ Playwright (e2e)
- ✅ Supertest (integration)

### Documentation
- ✅ **C4 Model**
- ✅ Mermaid
- ✅ JSDoc/TSDoc

---

## 📖 Onboarding

**Tempo estimado**: 30 minutos

### Passo 1: Entenda os Comandos Starter (10 min)
Leia e teste os 5 comandos starter principais:
```bash
/technical/work
/technical/plan
/technical/pr
/technical/sync
/technical/docs
```

### Passo 2: Conheça os Agentes (10 min)
Invoque e converse com:
```bash
@react-developer
@nodejs-specialist
@gitflow-specialist
```

### Passo 3: Primeiro Workflow Completo (10 min)
Execute um workflow end-to-end:
```bash
1. /technical/start "minha-feature"
2. /technical/work
3. /technical/pre-pr
4. /technical/pr
```

---

## 🎯 Workflows Comuns

### Workflow 1: Nova Feature (30 min)
```bash
/technical/start "nome-da-feature"   # Criar session
/technical/plan                      # Planejar arquitetura
/technical/work                      # Implementar
/technical/unit                      # Testar
/technical/pre-pr                    # Validar
/technical/pr                        # Criar PR
```

### Workflow 2: Hotfix Urgente (15 min)
```bash
/technical/hotfix "bug-critico"      # Criar branch hotfix
/technical/work                      # Corrigir bug
/technical/integration               # Testar
/technical/pr                        # PR direto para main
```

### Workflow 3: Documentação Completa (20 min)
```bash
/technical/docs                      # Gerar docs técnicas
/technical/build-index               # Construir índice
/technical/validate-docs             # Validar consistência
```

---

## 🔧 Configuração

O arquivo `.context-config.yml` define integrações e preferências:

```yaml
context:
  name: technical
  version: "4.0.0"

integrations:
  version_control:
    provider: git
    strategy: gitflow
  testing:
    unit: jest
    integration: supertest
    e2e: playwright
  documentation:
    format: c4-model
    generator: mermaid
```

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Comandos Totais** | 32 |
| **Agentes** | 23 |
| **Tempo Onboarding** | 30 min |
| **Casos de Uso** | Dev, QA, DevOps, Docs |

---

## 🆘 Ajuda

### Comandos Não Funcionam?
1. Verifique se está no contexto correto: `/technical/help`
2. Teste com warm-up: `/technical/warm-up`
3. Consulte agente: `@react-developer "help with X"`

### Testes Falhando?
1. Verifique dependências: `nx affected:test`
2. Consulte `@test-engineer`
3. Execute: `/technical/unit` ou `/technical/integration`

### Git Conflicts?
1. Sincronize: `/technical/sync`
2. Consulte: `@gitflow-specialist`
3. Code review: `@code-reviewer`

### Dúvidas?
- 📖 Leia: `docs/onion/`
- 🤖 Pergunte: `@react-developer` ou `@nodejs-specialist`
- 🔧 CLI: `onion help technical`

---

**Versão**: 4.0.0  
**Última Atualização**: 2025-12-20  
**Migrado em**: FASE 2

