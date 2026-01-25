---
name: help
description: Lista comandos disponíveis do contexto Technical organizados por nível de complexidade
model: sonnet
category: technical
tags: [help, discovery, onboarding, levels]
version: "4.0.0"
updated: "2025-12-20"
level: starter
context: technical
---

# Technical Context - Help

Lista todos os comandos disponíveis no contexto **Technical**, organizados por nível de complexidade (starter, intermediate, advanced).

---

## 🎯 Uso

```bash
# Listar comandos starter (padrão - 80% dos casos)
/technical/help

# Listar comandos de um nível específico
/technical/help --level=starter
/technical/help --level=intermediate
/technical/help --level=advanced

# Listar todos os comandos
/technical/help --level=all
```

---

## 📋 Sistema de Níveis

O Sistema Onion organiza comandos em **3 níveis** baseados na frequência de uso:

| Nível | % Uso | Descrição | Onboarding |
|-------|-------|-----------|------------|
| **Starter** | 80% | Comandos essenciais para desenvolvimento diário | ~20 min |
| **Intermediate** | 15% | Workflows avançados e operações especializadas | ~40 min |
| **Advanced** | 5% | Automações complexas e casos edge | ~60 min |

---

## 📊 Comandos Disponíveis

Você me pediu para executar o comando help. Vou listar os comandos organizados por nível:

### 🌟 STARTER COMMANDS (8 comandos - 80% dos casos)
**⏱️ Tempo de onboarding: ~20 minutos**

Estes são os comandos que você usará no desenvolvimento diário:

1. **`/technical/work "task-id"`**
   - Continuar trabalho em feature ativa, lê sessão e identifica próxima fase
   - Use quando: Retomar desenvolvimento de uma task em progresso
   - Exemplo: `/technical/work "86adf8jj6"`

2. **`/technical/plan "feature"`**
   - Criar plano de desenvolvimento detalhado com fases
   - Use quando: Iniciar nova feature, precisa quebrar em etapas
   - Exemplo: `/technical/plan "user-authentication"`

3. **`/technical/pr`**
   - Criar Pull Request com descrição automática da sessão
   - Use quando: Finalizar feature e submeter para review
   - Exemplo: `/technical/pr`

4. **`/technical/warm-up`**
   - Preparar contexto técnico do projeto (stack, arquitetura, padrões)
   - Use quando: Iniciar desenvolvimento em nova sessão
   - Exemplo: `/technical/warm-up`

5. **`/technical/docs`**
   - Gerar/atualizar documentação técnica do projeto
   - Use quando: Documentar feature implementada ou arquitetura
   - Exemplo: `/technical/docs`

6. **`/technical/sync`**
   - Sincronizar branch local com remote, resolver conflitos
   - Use quando: Atualizar código antes de começar desenvolvimento
   - Exemplo: `/technical/sync`

7. **`/technical/init`**
   - Inicializar repositório git com gitflow ou outro workflow
   - Use quando: Setup inicial de novo projeto
   - Exemplo: `/technical/init`

8. **`/technical/help`**
   - Este comando! Lista comandos disponíveis por nível
   - Use quando: Descobrir comandos ou aprender sistema
   - Exemplo: `/technical/help --level=intermediate`

---

### 🔧 INTERMEDIATE COMMANDS (13 comandos - 15% dos casos)
**⏱️ Tempo de onboarding: ~40 minutos**

Comandos para workflows mais avançados:

1. **`/technical/start "feature"`** - Iniciar nova feature (cria sessão, branch, plan)
2. **`/technical/pre-pr`** - Validar código antes de criar PR (lint, tests, docs)
3. **`/technical/pr-update`** - Atualizar PR existente com novos commits e descrição
4. **`/technical/code-review`** - Realizar code review com checklist de qualidade
5. **`/technical/fast-commit`** - Commit rápido seguindo conventional commits
6. **`/technical/build-index`** - Construir índice de documentação técnica
7. **`/technical/build-tech-docs`** - Gerar documentação técnica completa
8. **`/technical/build-business-docs`** - Gerar documentação de negócio
9. **`/technical/validate-docs`** - Validar consistência da documentação
10. **`/technical/docs-health`** - Analisar saúde da documentação (cobertura, atualização)
11. **`/technical/sync-sessions`** - Sincronizar sessões de desenvolvimento
12. **`/technical/unit`** - Executar/criar testes unitários
13. **`/technical/integration`** - Executar/criar testes de integração

---

### ⚡ ADVANCED COMMANDS (14 comandos - 5% dos casos)
**⏱️ Tempo de onboarding: ~60 minutos**

Comandos especializados para casos específicos:

**Gestão de Releases:**
1. **`/technical/bump`** - Incrementar versão do projeto (semver)
2. **`/technical/hotfix`** - Criar branch de hotfix para correção urgente
3. **`/technical/validate-phase-sync`** - Validar sincronização entre fases de desenvolvimento

**Documentação Avançada:**
4. **`/technical/refine-vision`** - Refinar visão técnica do projeto
5. **`/technical/consolidate-documents`** - Consolidar múltiplos documentos
6. **`/technical/reverse-consolidate`** - Reverter consolidação de documentos

**Testes Avançados:**
7. **`/technical/e2e`** - Executar/criar testes end-to-end

**Git Workflows (Feature):**
8. **`/technical/feature-start`** - Iniciar branch de feature (gitflow)
9. **`/technical/feature-finish`** - Finalizar branch de feature
10. **`/technical/feature-publish`** - Publicar feature em remote

**Git Workflows (Hotfix):**
11. **`/technical/hotfix-start`** - Iniciar hotfix
12. **`/technical/hotfix-finish`** - Finalizar hotfix

**Git Workflows (Release):**
13. **`/technical/release-start`** - Iniciar release
14. **`/technical/release-finish`** - Finalizar release

---

## 🚀 Próximos Passos

### Se você é novo no Technical Context:

1. **Comece pelos Starter Commands** (os 8 primeiros)
   - Foque em `/technical/work` e `/technical/plan`
   - Pratique criando uma sessão de desenvolvimento
   - Tempo estimado: 20-30 minutos

2. **Explore Intermediate Commands**
   - Experimente `/technical/start` para workflow completo
   - Use `/technical/pre-pr` para validar qualidade
   - Tempo estimado: +40 minutos

3. **Descubra Agentes Especializados**
   ```bash
   @react-developer            # Desenvolvimento React/Frontend
   @nodejs-specialist          # Backend Node.js
   @postgres-specialist        # Database PostgreSQL
   @zen-engine-specialist      # ZenStack ORM
   @test-engineer              # Testes automatizados
   @code-reviewer              # Review de código
   ```

### Workflow Típico de Desenvolvimento:

```bash
# 1. Iniciar nova feature
/technical/start "user-dashboard"

# 2. Durante desenvolvimento
/technical/work "task-id"

# 3. Antes de finalizar
/technical/pre-pr

# 4. Criar Pull Request
/technical/pr

# 5. Após merge
/technical/sync
```

### Pronto para Business Context?

Para especificações e planejamento de produto:
```bash
/business/help               # Comandos de produto/negócio
/business/spec "feature"     # Criar especificação
```

---

## 📚 Documentação Relacionada

- **Sistema de Níveis**: `docs/onion/levels-system.md`
- **READMEs**: `.onion/contexts/technical/README.md`
- **Agentes**: `.onion/contexts/technical/agents/`
- **Configuração**: `.onion/contexts/technical/.context-config.yml`
- **Sessions**: `.cursor/sessions/` (rastreamento de desenvolvimento)

---

## 💡 Dicas Úteis

### Filosofia 80/15/5
- **80%** do seu tempo: Use apenas comandos **starter**
- **15%** do seu tempo: Use comandos **intermediate**
- **5%** do seu tempo: Use comandos **advanced**

### Descoberta Progressiva
Cada comando inclui seção "🚀 Próximos Passos" sugerindo o que fazer em seguida.

### Sessions & Context Management
O Onion v4 rastreia suas sessões de desenvolvimento:
- `.cursor/sessions/[feature]/` contém context.md, plan.md, architecture.md
- Comandos `/work` e `/start` gerenciam automaticamente
- Sessions são **CAMADA 5** do ciclo completo Onion

### Flags e Opções
```bash
--level=starter       # Filtrar por nível
--level=all          # Ver todos os níveis
```

---

## 🎓 Onboarding Recomendado

### Dia 1 (30 minutos)
1. Execute `/technical/warm-up`
2. Pratique `/technical/plan "test-feature"`
3. Teste `/technical/work` em uma task real

### Semana 1 (3 horas)
- Domine os 8 starter commands
- Experimente 4-5 intermediate commands
- Crie sua primeira feature completa (start → work → pr)

### Mês 1 (8 horas)
- Explore todos os intermediate commands
- Teste gitflow (feature/hotfix/release)
- Integre no workflow diário da equipe

---

## 🔄 Integração com Business Context

O Technical Context trabalha em conjunto com Business:

```bash
# 1. Business: Criar especificação
/business/spec "dashboard-analytics"

# 2. Business: Estimar complexidade
/business/estimate "dashboard-analytics"

# 3. Business: Criar task
/business/task "dashboard-analytics"

# 4. Technical: Iniciar desenvolvimento
/technical/start "dashboard-analytics"

# 5. Technical: Desenvolver
/technical/work "task-id"

# 6. Technical: Finalizar
/technical/pr
```

---

**📊 Estatísticas do Technical Context:**
- **Total**: 36 comandos (mais que business!)
- **Starter**: 8 (22%)
- **Intermediate**: 13 (36%)
- **Advanced**: 14 (39%)
- **Agentes**: 23 especializados
- **Tempo total onboarding**: ~120 minutos (todos os níveis)

---

## 🏗️ Arquitetura de Sessions

```
.cursor/sessions/
├── feature-x/
│   ├── context.md       # Objetivo, requisitos, decisões
│   ├── architecture.md  # Design técnico, trade-offs
│   ├── plan.md          # Fases de implementação
│   └── notes.md         # Notas de desenvolvimento
└── feature-y/
    └── ...
```

Comandos que gerenciam sessions automaticamente:
- `/technical/start` - Cria nova session
- `/technical/work` - Lê e atualiza session ativa
- `/technical/pr` - Usa session para gerar descrição

---

## 🆘 Precisa de Ajuda?

- **Help de outro contexto**: `/business/help`, `/customer-success/help`
- **Help global**: `/help`
- **Agente de ajuda**: `@onion` (orquestrador principal)
- **Documentação**: `docs/onion/`
- **Agentes especializados**: 
  - `@cursor-specialist` - Problemas com IDE
  - `@gitflow-specialist` - Workflows git
  - `@nx-monorepo-specialist` - Monorepo NX

---

**Sistema Onion v4.0** - Multi-Context Development Orchestrator 🧅

