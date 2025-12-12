# ⚡ Command Workflows - Feature Catalog

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0 | **Status**: V1 Core

---

## 🎯 Purpose

Permitir que usuários criem comandos (workflows) que automatizam tarefas recorrentes, guiam execução de processos e orquestram interações com agentes, usando a metodologia Onion.

---

## 👤 User Benefit

| Benefício | Descrição |
|-----------|-----------|
| **Automação** | Tarefas repetitivas em um clique |
| **Consistência** | Mesmo processo toda vez |
| **Produtividade** | Horas economizadas |
| **Reutilização** | Criar uma vez, usar sempre |

---

## 🔧 Core Features

### 1. Command Creation

**Descrição:** Criar comandos personalizados

**Funcionalidades:**
- Criar comando via interface
- Criar via `/meta/create-command`
- Templates de comandos
- Clonar comandos existentes

**UX Flow:**
```
[+ Novo Comando] → Nome (/meu-comando)
                 → Descrição do que faz
                 → Passos/instruções
                 → Variáveis (opcional)
                 → [Criar]
```

**Estrutura de Comando (.md):**
```markdown
---
name: daily-report
description: Gera relatório diário de atividades
category: productivity
variables:
  - name: date
    type: date
    default: today
---

# Daily Report Generator

## Passos

1. Buscar atividades do dia {date} na knowbase "Atividades"
2. Categorizar por tipo (reunião, tarefa, comunicação)
3. Calcular tempo gasto por categoria
4. Gerar resumo formatado
5. Sugerir otimizações para amanhã

## Output esperado

- Resumo em bullet points
- Gráfico de tempo (se possível)
- Top 3 recomendações
```

**Limitações por Plano:**
| Plano | Limite |
|-------|--------|
| Free | 5 comandos |
| Pro | Ilimitado |
| Enterprise | Ilimitado + shared |

---

### 2. Command Execution

**Descrição:** Executar comandos

**Formas de Executar:**
| Método | Exemplo |
|--------|---------|
| Barra de comando | `/daily-report` |
| Menu de comandos | Clique no comando |
| Via @onion | "Execute o daily-report" |
| Scheduler | Automático (horário definido) |
| API | `POST /api/commands/execute` (V2) |

**Execução com Variáveis:**
```
/daily-report date=2025-12-10

ou

/daily-report
→ [Prompt] Data do relatório: [hoje]
→ [Executar]
```

**Progress Tracking:**
```
/deploy-checklist

⏳ Executando deploy-checklist...

✅ Passo 1: Verificar testes - OK
✅ Passo 2: Verificar build - OK
⏳ Passo 3: Criar PR - Em andamento...
⬜ Passo 4: Notificar time
⬜ Passo 5: Documentar

[Cancelar] [Pausar]
```

---

### 3. Comandos Pré-configurados (System Commands)

**Descrição:** Comandos que vêm com o Onion App

| Comando | Função | Categoria |
|---------|--------|-----------|
| `/onion` | Ponto de entrada inteligente | Meta |
| `/help` | Ajuda e orientação | Meta |
| `/create-knowbase` | Criar nova knowbase | Meta |
| `/create-agent` | Criar novo agente | Meta |
| `/create-command` | Criar novo comando | Meta |
| `/search` | Buscar nas knowbases | Productivity |
| `/summarize` | Resumir conteúdo | Productivity |
| `/translate` | Traduzir texto | Productivity |

---

### 4. Scheduler (Automação)

**Descrição:** Agendar execução de comandos

**Funcionalidades:**
- Execução única (data/hora)
- Execução recorrente (cron)
- Condições (se X então execute)
- Notificações de execução

**Opções de Agendamento:**
| Tipo | Exemplo |
|------|---------|
| Uma vez | 15/12/2025 às 09:00 |
| Diário | Todo dia às 08:00 |
| Semanal | Toda segunda às 09:00 |
| Mensal | Dia 1 de cada mês |
| Custom (cron) | `0 9 * * 1-5` (dias úteis 9h) |

**UX de Scheduler:**
```
/daily-report → [⏰ Agendar]

┌─────────────────────────────────┐
│ Agendar: daily-report           │
├─────────────────────────────────┤
│ ○ Uma vez                       │
│   Data: [___________] Hora: [__]│
│                                 │
│ ● Recorrente                    │
│   [Diário ▼] às [08:00]        │
│                                 │
│ Notificar: [✓] Email [✓] In-app│
│                                 │
│ [Cancelar] [Agendar]            │
└─────────────────────────────────┘
```

**Limitações por Plano:**
| Plano | Scheduler |
|-------|-----------|
| Free | ❌ Não disponível |
| Pro | ✅ 10 jobs ativos |
| Enterprise | ✅ Ilimitado |

---

### 5. Command Chaining

**Descrição:** Conectar comandos em sequência

**Funcionalidades V1:**
- Menção a outros comandos no corpo
- Execução manual em sequência

**Funcionalidades V2+:**
- Pipelines visuais
- Outputs como inputs
- Condicionais (if/then)
- Paralelização

**Exemplo de Chain (V1):**
```markdown
# Weekly Review Workflow

## Passos

1. Executar /daily-report para cada dia da semana
2. Consolidar resultados em um resumo semanal
3. Identificar padrões e tendências
4. Gerar recomendações para próxima semana
5. Executar /notify-team com o resumo

## Variáveis
- week_start: date
- team_channel: string
```

---

## 📊 Usage Patterns

### Casos de Uso Comuns

| Caso | Frequência | Comando Típico |
|------|------------|----------------|
| Relatórios | 🔴 Alta | /daily-report, /weekly-summary |
| Checklists | 🔴 Alta | /deploy-checklist, /review-pr |
| Notificações | 🟡 Média | /notify-team, /send-update |
| Transformações | 🟡 Média | /summarize, /translate |
| Integrações | 🟢 Baixa | /sync-calendar, /update-crm |

### Padrões de Adoção

| Métrica | Meta |
|---------|------|
| Comandos criados/usuário (30d) | 5+ |
| Execuções/semana | 20+ |
| Comandos agendados (Pro) | 3+ |

---

## ⚠️ Common Issues

| Issue | Causa | Solução |
|-------|-------|---------|
| "Comando falhou" | Erro na execução | Log detalhado + retry |
| "Não entendi o comando" | Sintaxe errada | Sugestões de correção |
| "Scheduler não executou" | Limite atingido | Notificação + upsell |
| "Resultado diferente" | Variáveis diferentes | Histórico de execuções |

---

## 🤖 AI Interaction Guidelines

### Como @onion deve falar sobre Comandos

**Linguagem:**
- "Seu comando de [descrição]"
- "Execute /nome para [ação]"
- Nunca: "workflow automation", "pipeline"

**Sugestões proativas:**
- "Você faz isso frequentemente. Quer criar um comando para automatizar?"
- "O comando /daily-report pode ajudar com isso."

---

## 📈 Success Metrics

| Métrica | Descrição | Meta |
|---------|-----------|------|
| Activation | % usuários com 1+ comando | 40% |
| Engagement | Execuções/semana | 20+ |
| Scheduler adoption (Pro) | % Pro com scheduler | 60% |
| Time saved | Horas economizadas (estimado) | 5h/semana |

---

## 🔮 Roadmap

| Feature | Versão | Descrição |
|---------|--------|-----------|
| Command templates | V1.5 | Templates prontos |
| Visual editor | V3 | Editor drag-and-drop |
| Conditionals | V2 | If/then logic |
| Command marketplace | V2 | Compartilhar comandos |
| Webhooks trigger | V2 | Executar via webhook |
| API access | V2 | REST API para comandos |

---

**Documentação relacionada:**
- [Knowledge Management](knowledge-management.md)
- [Rules System](rules-system.md)

