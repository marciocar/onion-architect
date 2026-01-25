---
name: help
description: Help global do Sistema Onion - lista contextos disponíveis e sistema de níveis
model: sonnet
category: core
tags: [help, discovery, onboarding, global]
version: "4.0.0"
updated: "2025-12-20"
level: starter
context: core
---

# 🧅 Sistema Onion - Help Global

Bem-vindo ao **Sistema Onion v4.0** - Multi-Context Development Orchestrator!

---

## 🎯 O Que é o Sistema Onion?

O Onion é um **orquestrador de desenvolvimento multi-contexto** que organiza comandos, agentes e workflows para diferentes áreas da sua equipe, tudo em um único repositório monorepo.

### 🌟 Principais Características

- **Multi-Contexto**: Business, Technical, Customer Success, Compliance, Sales, Marketing
- **Sistema de Níveis**: Comandos organizados em starter/intermediate/advanced (80/15/5)
- **Descoberta Progressiva**: Comandos sugerem próximos passos automaticamente
- **IDE Agnóstico**: Funciona em Cursor, Windsurf, Claude Code
- **Onboarding Rápido**: 15-30 minutos vs 4-8 horas tradicional (90% redução)

---

## 📊 Contextos Disponíveis

O Sistema Onion organiza comandos em **contextos especializados**:

### 🎯 Business Context
**Para**: Product Managers, Business Analysts, Stakeholders  
**Comandos**: 20 (5 starter + 10 intermediate + 5 advanced)  
**Agentes**: 12 especializados  
**Onboarding**: ~90 minutos

**Use para**:
- Criar especificações de produto
- Estimar story points
- Gerenciar tasks e workflows de negócio
- Extrair e consolidar reuniões
- Análise de branding e posicionamento

**Começar**:
```bash
/business/help           # Ver comandos disponíveis
/business/spec "feature" # Criar especificação
/business/task "task"    # Criar task
```

---

### 💻 Technical Context
**Para**: Developers, Tech Leads, DevOps  
**Comandos**: 36 (8 starter + 13 intermediate + 14 advanced)  
**Agentes**: 23 especializados  
**Onboarding**: ~120 minutos

**Use para**:
- Desenvolvimento de features
- Gestão de git workflows (gitflow)
- Code review e testes
- Documentação técnica
- Releases e hotfixes

**Começar**:
```bash
/technical/help              # Ver comandos disponíveis
/technical/work "task-id"    # Continuar desenvolvimento
/technical/start "feature"   # Iniciar nova feature
```

---

### 👥 Customer Success Context
**Para**: CS Managers, Support Team  
**Comandos**: Em desenvolvimento  
**Agentes**: Em desenvolvimento

**Use para**:
- Onboarding de clientes
- Gestão de tickets
- Knowledge base
- Health scores

**Começar**:
```bash
/customer-success/help       # Ver comandos disponíveis
```

---

### 📋 Outros Contextos (Em Desenvolvimento)

- **Compliance**: Auditorias, LGPD, regulamentações
- **Sales**: Pipeline, proposals, contratos
- **Marketing**: Campanhas, conteúdo, analytics

---

## 📚 Sistema de Níveis

Todos os contextos organizam comandos em **3 níveis**:

| Nível | % Uso | Quando Usar | Onboarding |
|-------|-------|-------------|------------|
| **🌟 Starter** | 80% | Comandos essenciais do dia a dia | 15-20 min |
| **🔧 Intermediate** | 15% | Workflows avançados e especializados | 30-40 min |
| **⚡ Advanced** | 5% | Casos específicos e automações complexas | 45-60 min |

### Filosofia 80/15/5

- **80%** do seu tempo: Use apenas comandos **starter**
- **15%** do seu tempo: Use comandos **intermediate**
- **5%** do seu tempo: Use comandos **advanced**

Isso garante que você aprenda apenas o essencial e descubra o resto conforme necessidade.

---

## 🚀 Como Começar?

### 1️⃣ Identifique Seu Contexto Principal

**Se você é**:
- Product Manager / Business → `/business/help`
- Developer / Tech Lead → `/technical/help`
- Customer Success → `/customer-success/help`

### 2️⃣ Aprenda os Comandos Starter

Foque nos 5-8 comandos starter do seu contexto. São suficientes para 80% do trabalho.

**Tempo estimado**: 15-30 minutos

### 3️⃣ Descubra Conforme Necessidade

Cada comando inclui seção "🚀 Próximos Passos" sugerindo comandos relacionados.

---

## 🎓 Onboarding Recomendado

### Novos Usuários (Dia 1 - 1 hora)

```bash
# 1. Ver comandos do seu contexto
/[seu-contexto]/help

# 2. Business: Criar sua primeira spec
/business/spec "test-feature"

# 3. Technical: Planejar desenvolvimento
/technical/plan "test-feature"

# 4. Technical: Trabalhar em uma task
/technical/work "task-id"
```

### Primeira Semana (5 horas)

- Domine todos os **starter commands** do seu contexto
- Experimente 2-3 **intermediate commands**
- Explore agentes especializados (ex: `@product-agent`, `@react-developer`)

### Primeiro Mês (20 horas)

- Use todos os **intermediate commands** conforme necessidade
- Teste 1-2 **advanced commands** específicos
- Integre no workflow diário da equipe

---

## 🤖 Agentes Especializados

O Onion inclui **35+ agentes IA especializados**:

### Business Agents
```bash
@product-agent                  # Orquestração de produto
@story-points-specialist        # Estimativas precisas
@extract-meeting-specialist     # Extração de reuniões
@presentation-orchestrator      # Criação de apresentações
```

### Technical Agents
```bash
@react-developer                # Frontend React
@nodejs-specialist              # Backend Node.js
@postgres-specialist            # Database
@test-engineer                  # Testes automatizados
@code-reviewer                  # Code review
@gitflow-specialist             # Git workflows
```

### Core Agents
```bash
@onion                          # Orquestrador principal (ajuda com tudo)
```

---

## 💡 Conceitos Importantes

### 🔄 Ciclo Completo Onion (5 Camadas)

```
CAMADA 1: Knowledge Bases → Documentação estruturada
CAMADA 2: Agentes IA      → Especialistas automatizados
CAMADA 3: Comandos        → Workflows executáveis
CAMADA 4: Regras          → Padrões e convenções
CAMADA 5: Sessions        → Rastreamento de contexto
```

### 📁 Sessions (CAMADA 5)

O Onion rastreia suas sessões de desenvolvimento:

```
.cursor/sessions/
├── feature-x/
│   ├── context.md       # Objetivo, requisitos
│   ├── architecture.md  # Design técnico
│   ├── plan.md          # Fases de implementação
│   └── notes.md         # Notas de desenvolvimento
```

Comandos como `/technical/start` e `/technical/work` gerenciam automaticamente.

### 🔗 Descoberta Progressiva

Cada comando inclui:
- **🚀 Próximos Passos**: Comandos relacionados sugeridos
- **📚 Pré-requisitos**: O que aprender antes (intermediate/advanced)
- **💡 Dicas**: Melhores práticas e insights

---

## 📖 Documentação

### Guias Principais
- **Sistema de Níveis**: `docs/onion/levels-system.md`
- **Multi-Context Vision**: `docs/knowbase/frameworks/onion-multi-context-orchestrator-vision.md`
- **Ciclo Completo**: `docs/knowbase/frameworks/onion-complete-cycle-understanding.md`

### Por Contexto
- **Business**: `.onion/contexts/business/README.md`
- **Technical**: `.onion/contexts/technical/README.md`

### Configuração
- **Global**: `.onion-config.yml`
- **Por Contexto**: `.onion/contexts/[contexto]/.context-config.yml`

---

## 🛠️ Estrutura do Projeto

```
.onion/                          # Universal (agnóstica de IDE)
├── core/                        # Núcleo (agentes, comandos globais)
├── contexts/                    # 6 contextos especializados
│   ├── business/
│   ├── technical/
│   ├── customer-success/
│   ├── compliance/
│   ├── sales/
│   └── marketing/
├── ide/                         # Loaders por IDE
└── .onion-config.yml            # Configuração central

.cursor/                         # Compatibilidade Cursor
├── commands/                    # Symlinks para .onion/
├── agents/                      # Symlinks para .onion/
└── sessions/                    # Rastreamento de desenvolvimento
```

---

## 🆘 Precisa de Ajuda?

### Por Contexto
```bash
/business/help         # Comandos business
/technical/help        # Comandos technical
/customer-success/help # Comandos CS
```

### Agente Universal
```bash
@onion "Como faço para [sua dúvida]?"
```

O `@onion` é o orquestrador principal e pode ajudar com:
- Escolher contexto apropriado
- Recomendar comandos para sua necessidade
- Explicar conceitos do sistema
- Navegar documentação

---

## 📊 Estatísticas do Sistema

| Métrica | Valor |
|---------|-------|
| **Contextos** | 6 (2 ativos, 4 em desenvolvimento) |
| **Comandos** | 56+ (20 business + 36 technical) |
| **Agentes** | 35+ especializados |
| **Níveis** | 3 (starter/intermediate/advanced) |
| **Onboarding** | 15-30min (vs 4-8h tradicional) |
| **Redução** | 90% no tempo de aprendizado |

---

## 🎯 Workflows Comuns

### Workflow: Business → Technical

```bash
# 1. Business: Criar especificação
/business/spec "user-dashboard"

# 2. Business: Estimar
/business/estimate "user-dashboard"

# 3. Business: Criar task
/business/task "user-dashboard"

# 4. Technical: Iniciar desenvolvimento
/technical/start "user-dashboard"

# 5. Technical: Desenvolver
/technical/work "task-id"

# 6. Technical: Finalizar
/technical/pr
```

### Workflow: Solo Development

```bash
# 1. Planejar
/technical/plan "feature"

# 2. Implementar
/technical/work "feature"

# 3. Testar
/technical/unit

# 4. Documentar
/technical/docs

# 5. Criar PR
/technical/pr
```

---

## 🚀 Próximos Passos

1. **Escolha seu contexto principal**
   - Product/Business? → `/business/help`
   - Development? → `/technical/help`

2. **Aprenda comandos starter (15-30 min)**
   - Foque nos 5-8 essenciais
   - Pratique com exemplos reais

3. **Descubra conforme necessidade**
   - Use "Próximos Passos" em cada comando
   - Peça ajuda ao `@onion` quando precisar

4. **Explore outros contextos**
   - Após dominar seu contexto principal
   - Entenda integração entre contextos

---

**🧅 Sistema Onion v4.0** - Multi-Context Development Orchestrator

**Versão**: 4.0.0 | **Atualizado**: 2025-12-20 | **Licença**: MIT

