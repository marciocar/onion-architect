# Business Context

> **Onion v4.0** | Multi-Context Development Orchestrator

**📚 Sistema de Níveis**: Leia `docs/onion/levels-system.md` para entender a filosofia 80/15/5

---

## 🎯 Sobre Este Contexto

O **Business Context** é dedicado a Product Managers, Strategy Analysts, e todos os profissionais que trabalham com:

- 📋 **Especificações de features**
- 📊 **Estimativas e planejamento**
- 🎯 **Gerenciamento de tarefas**
- 📝 **Extração e consolidação de reuniões**
- 🎤 **Transcrição de áudio (Whisper)**
- 📈 **Apresentações e storytelling**

---

## 🚀 Quick Start

### Comandos Starter (80% dos casos)

Use estes comandos para 80% das suas necessidades diárias:

```bash
/business/spec "minha-feature"      # Criar especificação de feature
/business/task "minha-task"         # Criar tarefa no ClickUp/Asana
/business/estimate "feature-x"      # Estimar story points
/business/refine "spec.md"          # Refinar especificação
/business/warm-up                   # Warm-up do contexto business
```

### Comandos Intermediate (15% dos casos)

Para workflows mais avançados:

```bash
/business/collect                   # Coletar informações
/business/light-arch                # Criar arquitetura leve
/business/extract-meeting           # Extrair insights de reunião
/business/consolidate-meetings      # Consolidar múltiplas reuniões
/business/whisper "audio.mp3"       # Transcrever áudio
```

### Comandos Advanced (5% dos casos)

Para casos especializados:

```bash
/business/presentation              # Criar apresentação
/business/branding                  # Análise de branding
/business/analyze-pain-price        # Análise Pain vs Price
```

---

## 🤖 Agentes Especializados

Invoque agentes especializados com `@nome-agente`:

| Agente | Especialidade | Uso |
|--------|--------------|-----|
| @product-agent | Gestão de produto completa | Coordenação geral |
| @story-points-specialist | Estimativas ágeis | Validação de story points |
| @extract-meeting-specialist | Extração de reuniões | Processar transcrições |
| @meeting-consolidator | Consolidação de reuniões | Unificar múltiplas reuniões |
| @clickup-specialist | Integração ClickUp | Gerenciar tasks no ClickUp |
| @whisper-specialist | Transcrição de áudio | Processar áudio com Whisper |
| @presentation-orchestrator | Apresentações | Criar slides e storytelling |

---

## 📚 Estrutura

```
business/
├── commands/
│   ├── starter/          # 5 comandos essenciais (80%)
│   ├── intermediate/     # 10 comandos avançados (15%)
│   └── advanced/         # 5 comandos especializados (5%)
├── agents/               # 12 agentes especializados
├── knowbase/             # Knowledge bases específicas
└── sessions/             # Sessions de desenvolvimento
```

---

## 🔗 Integrações

### Task Manager (configurável)
- ✅ **ClickUp** (default)
- ✅ Asana
- ✅ Linear
- ✅ None (local)

### Transcription (configurável)
- ✅ **Whisper Local** (default)
- ✅ Whisper Cloud
- ✅ None

### Presentation (configurável)
- ✅ **Gamma API** (default)
- ✅ None

---

## 📖 Onboarding

**Tempo estimado**: 30 minutos

### Passo 1: Entenda os Comandos Starter (10 min)
Leia e teste os 5 comandos starter:
```bash
/business/spec
/business/task
/business/estimate
/business/refine
/business/warm-up
```

### Passo 2: Conheça os Agentes (10 min)
Invoque e converse com:
```bash
@product-agent
@story-points-specialist
@clickup-specialist
```

### Passo 3: Primeiro Workflow Completo (10 min)
Execute um workflow end-to-end:
```bash
1. /business/spec "minha-primeira-feature"
2. /business/estimate
3. /business/task
```

---

## 🎯 Workflows Comuns

### Workflow 1: Nova Feature (5 min)
```bash
/business/spec "nome-da-feature"     # Criar spec
/business/estimate                   # Estimar
/business/task                       # Criar task
```

### Workflow 2: Reunião → Tasks (15 min)
```bash
/business/whisper "reuniao.mp3"      # Transcrever
/business/extract-meeting            # Extrair insights
/business/convert-to-tasks           # Criar tasks
```

### Workflow 3: Consolidação de Múltiplas Reuniões (20 min)
```bash
/business/extract-meeting "reuniao1.md"
/business/extract-meeting "reuniao2.md"
/business/consolidate-meetings       # Unificar
```

---

## 🔧 Configuração

O arquivo `.context-config.yml` define integrações e preferências:

```yaml
context:
  name: business
  version: "4.0.0"

integrations:
  task_manager:
    provider: clickup      # ou asana, linear, none
    config_key: CLICKUP_API_TOKEN
  transcription:
    provider: whisper-local
  presentation:
    provider: gamma
    config_key: GAMMA_API_TOKEN
```

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Comandos Totais** | 20 |
| **Agentes** | 12 |
| **Tempo Onboarding** | 30 min |
| **Casos de Uso** | Product, Strategy, Planning |

---

## 🆘 Ajuda

### Comandos Não Funcionam?
1. Verifique se está no contexto correto: `/business/help`
2. Teste com warm-up: `/business/warm-up`
3. Consulte agente: `@product-agent "help with X"`

### Integrações Não Funcionam?
1. Verifique `.env` no projeto
2. Consulte `.context-config.yml`
3. Use `@clickup-specialist` ou `@whisper-specialist`

### Dúvidas?
- 📖 Leia: `docs/onion/`
- 🤖 Pergunte: `@product-agent`
- 🔧 CLI: `onion help business`

---

**Versão**: 4.0.0  
**Última Atualização**: 2025-12-20  
**Migrado em**: FASE 2

