---
name: transform-consolidated
description: |
  Transforma documentos consolidados (reuniões ou documentos) em contexto estruturado para criação de tasks.
  Interage com usuário de forma padronizada para extrair ações acionáveis e gerar contexto para /product/collect ou /product/task.
model: sonnet

parameters:
  - name: source
    description: Arquivo consolidado (de consolidate-meetings ou consolidate-documents) ou pasta contendo consolidações
    required: true
  - name: mode
    description: Modo de transformação (interactive|auto|tasks-only|context-only)
    required: false
  - name: output_format
    description: Formato de saída (tasks|context|both)
    required: false

category: product
tags:
  - knowledge-transformation
  - task-generation
  - consolidated-processing
  - interactive-refinement
  - product-workflow

version: "4.0.0"
updated: "2025-12-20"

related_commands:
  - /product/consolidate-meetings
  - /docs/consolidate-documents
  - /product/collect
  - /product/task
  - /product/estimate

related_agents:
  - product-agent
  - meeting-consolidator
  - extract-meeting-specialist
level: advanced
context: business
---

# 🔄 Transformar Documentos Consolidados

Comando para transformar conhecimento consolidado (de reuniões ou documentos) em contexto estruturado e tasks acionáveis.

## 🎯 Objetivo

Preencher o gap entre **conhecimento consolidado** e **tasks acionáveis**:

1. **Ler documentos consolidados** (output de `/product/consolidate-meetings` ou `/docs/consolidate-documents`)
2. **Interagir com usuário** de forma padronizada para refinar e priorizar
3. **Transformar conhecimento** em contexto estruturado
4. **Gerar contexto** pronto para `/product/collect` ou `/product/task`

## 🔍 Problema que Resolve

**Antes:**
```
Consolidar → [Documento rico em conhecimento] → ❓ Gap → Criar Task
```

**Depois:**
```
Consolidar → Transformar → [Contexto estruturado] → Criar Task
```

## ⚡ Fluxo de Execução

### Fase 1: Detecção e Carregamento

```bash
# Verificar se é arquivo ou pasta
if [ -f "$source" ]; then
  echo "📄 Arquivo consolidado detectado: $source"
  CONSOLIDATED_FILE="$source"
elif [ -d "$source" ]; then
  echo "📁 Pasta detectada: $source"
  # Buscar arquivos consolidados na pasta
  CONSOLIDATED_FILES=$(find "$source" -name "*consolidation*.md" -o -name "*consolidated*.md")
  # Se múltiplos, perguntar qual usar
else
  echo "❌ Erro: Source deve ser arquivo ou pasta"
  exit 1
fi
```

**Validar estrutura do documento:**
- Verificar se contém seções esperadas (Tarefas, Decisões, Gaps, Insights)
- Identificar tipo de consolidação (reuniões vs documentos)
- Extrair metadados (data, participantes, temas)

### Fase 2: Análise Automática (Sempre Executada)

**CRÍTICO:** Esta fase sempre executa automaticamente, independente do modo.

Extrair elementos acionáveis do documento de forma sistemática:

```markdown
@product-agent

Analise o seguinte documento consolidado e extraia TODOS os elementos acionáveis:

**1. Tarefas Identificadas:**
- Lista COMPLETA de todas as tarefas mencionadas
- Owner (se disponível, senão marcar como "TBD")
- Deadline (se disponível, senão marcar como "TBD")
- Prioridade sugerida (alta/média/baixa baseada em contexto)
- Dependências identificadas
- Contexto completo de cada tarefa

**2. Decisões que Requerem Ação:**
- Decisões que precisam ser implementadas (com rationale)
- Decisões que precisam ser comunicadas (com stakeholders)
- Decisões que precisam validação (com critérios)
- Nível de confiança de cada decisão

**3. Gaps e Ambiguidades:**
- Pontos que precisam esclarecimento (com impacto estimado)
- Informações faltantes que bloqueiam progresso (com criticidade)
- Contradições que precisam resolução (com partes envolvidas)
- Sugestão de priorização baseada em impacto

**4. Insights Acionáveis:**
- Oportunidades identificadas (com potencial de valor)
- Melhorias sugeridas (com esforço estimado)
- Próximos passos recomendados (com justificativa)
- Priorização sugerida baseada em valor/esforço

**5. Dependências e Conexões:**
- Mapeamento de dependências entre elementos
- Conexões identificadas entre tarefas/decisões/gaps
- Bloqueadores identificados

**Documento:**
{{conteudo_do_documento_consolidado}}

**Output Esperado:**
Estruture a resposta em formato YAML estruturado para facilitar validação posterior.
```

**Salvar resultado da análise:**

```bash
ANALYSIS_OUTPUT=".cursor/sessions/consolidated-transform/analysis-$(date +%Y%m%d-%H%M%S).yaml"
# Salvar análise completa em arquivo estruturado
```

### Fase 3: Validação Interativa (Modo Padrão)

**CRÍTICO:** No modo `interactive` (padrão), esta fase é obrigatória.

Apresentar análise ao usuário e validar/refinar:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ANÁLISE AUTOMÁTICA CONCLUÍDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 **Documento:** {{nome_arquivo}}
📅 **Data Consolidação:** {{data}}
📊 **Tipo:** {{tipo_consolidacao}}
🔍 **Elementos Extraídos:** {{total_elementos}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TAREFAS IDENTIFICADAS ({{total}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{lista_tarefas_completa_com_detalhes}}

**✅ VALIDAÇÃO NECESSÁRIA:**
1. ✅/❌ Quais tarefas devem ser criadas como tasks? (selecionar IDs)
2. 🔄 Ajustar prioridade de alguma tarefa?
3. 👤 Confirmar/ajustar owners?
4. 📅 Confirmar/ajustar deadlines?
5. 🔗 Validar dependências identificadas?
6. ✂️ Alguma tarefa precisa ser quebrada em subtasks?

**Resposta esperada:**
- Lista de IDs aprovados: [1, 3, 5, 7]
- Ajustes: {ID: 3, prioridade: "alta", owner: "João"}
- Quebrar: {ID: 5, subtasks: ["5.1", "5.2"]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DECISÕES QUE REQUEREM AÇÃO ({{total}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{lista_decisoes_completa}}

**✅ VALIDAÇÃO NECESSÁRIA:**
1. ✅/❌ Quais decisões precisam tasks de implementação? (selecionar IDs)
2. 📢 Quais precisam apenas comunicação/documentação? (selecionar IDs)
3. ✔️ Quais precisam validação antes de implementar? (selecionar IDs)
4. 🔄 Ajustar nível de confiança de alguma decisão?

**Resposta esperada:**
- Implementar: [1, 2]
- Comunicar: [3]
- Validar: [4]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ GAPS E AMBIGUIDADES ({{total}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{lista_gaps_completa}}

**✅ VALIDAÇÃO NECESSÁRIA:**
1. ✅/❌ Quais gaps bloqueiam progresso e precisam tasks? (selecionar IDs)
2. ⏭️ Quais podem ser resolvidos em refinamento futuro? (selecionar IDs)
3. 📅 Algum gap precisa reunião adicional? (selecionar IDs)
4. 🔄 Ajustar criticidade de algum gap?

**Resposta esperada:**
- Criar tasks: [1, 3]
- Refinamento futuro: [2, 4]
- Reunião necessária: [5]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 INSIGHTS ACIONÁVEIS ({{total}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{lista_insights_completa}}

**✅ VALIDAÇÃO NECESSÁRIA:**
1. ✅/❌ Quais insights devem virar features/tasks? (selecionar IDs)
2. 🎯 Algum insight é oportunidade estratégica? (marcar IDs)
3. 🔄 Ajustar priorização de insights?
4. 📝 Algum insight deve ser apenas documentado?

**Resposta esperada:**
- Criar tasks: [1, 2, 4]
- Oportunidade estratégica: [1]
- Apenas documentar: [3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 DEPENDÊNCIAS IDENTIFICADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{mapeamento_dependencias}}

**✅ VALIDAÇÃO NECESSÁRIA:**
1. ✅/❌ Confirmar dependências identificadas?
2. ➕ Adicionar dependências não identificadas?
3. 🔄 Ajustar ordem de execução sugerida?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONFIRMAÇÃO FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Resumo do que será criado:**
- Tasks: {{total_tasks_aprovadas}}
- Decisões para implementar: {{total_decisoes_implementar}}
- Gaps para resolver: {{total_gaps_tasks}}
- Insights para explorar: {{total_insights_tasks}}

**Confirma para prosseguir?** (sim/não)
```

### Fase 4: Modos de Processamento

#### Modo: `interactive` (Padrão)

**Fluxo completo:**
1. ✅ Análise automática (Fase 2)
2. ✅ Validação interativa (Fase 3)
3. ✅ Geração de contexto/tasks (Fase 5)

**Características:**
- Usuário valida e ajusta análise
- Máximo controle sobre o que será criado
- Recomendado para primeira vez ou documentos complexos

#### Modo: `auto`

**Fluxo simplificado:**
1. ✅ Análise automática (Fase 2)
2. ⏭️ Validação interativa (PULADA)
3. ✅ Geração automática de contexto/tasks (Fase 5)

**Características:**
- Usa análise automática sem validação
- Aplica heurísticas padrão para priorização
- Gera output completo automaticamente
- Recomendado para processamento em lote ou documentos simples

**Heurísticas aplicadas automaticamente:**
- Tarefas: Todas as tarefas identificadas viram tasks
- Decisões: Apenas decisões de implementação viram tasks
- Gaps: Apenas gaps de alta criticidade viram tasks
- Insights: Apenas insights de alto valor viram tasks

#### Modo: `tasks-only`

**Foco em tarefas:**
1. ✅ Análise automática (Fase 2) - apenas tarefas
2. ✅ Validação interativa (Fase 3) - apenas tarefas
3. ✅ Geração de tasks (Fase 5)

**Características:**
- Ignora decisões, gaps e insights
- Foca apenas em tarefas identificadas
- Mais rápido e direto

#### Modo: `context-only`

**Apenas contexto:**
1. ✅ Análise automática (Fase 2)
2. ✅ Validação interativa (Fase 3)
3. ✅ Geração de contexto estruturado (sem tasks)

**Características:**
- Não cria tasks
- Gera documento de contexto para uso futuro
- Útil para documentação e referência
- Preserva análise completa

### Fase 5: Gerar Output Final

Após validação (ou análise automática no modo `auto`), gerar outputs finais conforme `output_format`.

Criar documento de contexto padronizado com elementos validados:

```markdown
# Contexto para Tasks: {{tema}}

**Gerado em:** {{data_atual}}
**Origem:** {{arquivo_consolidado}}
**Tipo:** {{tipo_consolidacao}}
**Análise:** {{timestamp_analise}}

## 📋 Tarefas Aprovadas para Criar

{{lista_tarefas_aprovadas_completa_com_ajustes}}

## ✅ Decisões para Implementar

{{lista_decisoes_acionaveis_aprovadas}}

## ⚠️ Gaps para Resolver

{{lista_gaps_priorizados_aprovados}}

## 💡 Insights para Explorar

{{lista_insights_priorizados_aprovados}}

## 🔗 Dependências Validadas

{{mapeamento_de_dependencias_validado}}

## 📊 Priorização Final

{{matriz_de_prioridade_final}}
```

### Passo 5.2: Gerar Tasks (se solicitado)

**Se `output_format` incluir `tasks`:**

Para cada tarefa aprovada:

```markdown
@product-agent

Criar task usando /product/collect ou /product/task:

**Título:** {{titulo_tarefa}}
**Descrição:** {{descricao_completa_com_contexto}}
**Prioridade:** {{prioridade}}
**Owner:** {{owner}}
**Deadline:** {{deadline}}
**Dependências:** {{dependencias}}
**Tags:** {{tags_relevantes}}
**Contexto Original:** {{referencia_ao_documento_consolidado}}
```

**Ou gerar lista estruturada para processamento em lote:**

```yaml
tasks_to_create:
  - title: "{{titulo}}"
    description: "{{descricao}}"
    priority: "{{prioridade}}"
    owner: "{{owner}}"
    deadline: "{{deadline}}"
    dependencies: ["{{dep1}}", "{{dep2}}"]
    tags: ["{{tag1}}", "{{tag2}}"]
    source: "{{referencia_consolidado}}"
    context: "{{contexto_completo}}"
```

### Passo 5.3: Salvar Outputs

**Salvar todos os outputs gerados:**

```bash
OUTPUT_DIR=".cursor/sessions/consolidated-transform/"
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Análise completa (sempre salva)
ANALYSIS_FILE="${OUTPUT_DIR}analysis-${TIMESTAMP}.yaml"

# Contexto estruturado (se gerado)
if [ "$output_format" != "tasks" ]; then
  CONTEXT_FILE="${OUTPUT_DIR}context-${TIMESTAMP}.md"
fi

# Lista de tasks (se gerada)
if [ "$output_format" != "context" ]; then
  TASKS_FILE="${OUTPUT_DIR}tasks-${TIMESTAMP}.yaml"
fi

# Comandos prontos (se tasks geradas)
if [ "$output_format" != "context" ]; then
  COMMANDS_FILE="${OUTPUT_DIR}commands-${TIMESTAMP}.sh"
fi
```

## 📤 Outputs Esperados

### Output: Contexto Estruturado

Documento markdown com:
- ✅ Tarefas priorizadas e detalhadas
- ✅ Decisões que requerem ação
- ✅ Gaps priorizados por impacto
- ✅ Insights acionáveis
- ✅ Mapeamento de dependências
- ✅ Matriz de priorização

### Output: Lista de Tasks (Opcional)

Arquivo YAML/JSON com:
- ✅ Tasks prontas para criação
- ✅ Metadados completos
- ✅ Referências ao documento original
- ✅ Contexto preservado

### Output: Comandos Prontos (Opcional)

Lista de comandos prontos para execução:

```bash
# Tasks geradas automaticamente
/product/collect "{{titulo_task_1}}" --priority=high --owner={{owner}}
/product/collect "{{titulo_task_2}}" --priority=medium
/product/task "{{titulo_task_3}}" --deadline={{deadline}}
```

## 🎯 Casos de Uso

### Caso 1: Após Consolidar Reuniões

```bash
# 1. Consolidar reuniões
/product/consolidate-meetings "docs/meet/sprint-planning/"

# 2. Transformar em tasks
/product/transform-consolidated "docs/meet/consolidation-2025-12-02-sprint-planning.md" --mode=interactive

# 3. Criar tasks aprovadas
# (comandos gerados automaticamente)
```

### Caso 2: Após Consolidar Documentos

```bash
# 1. Consolidar documentos
/docs/consolidate-documents "docs/business-context/"

# 2. Transformar em contexto e tasks
/product/transform-consolidated "docs/consolidated/business-context/" --mode=auto --output_format=both

# 3. Revisar contexto gerado e criar tasks selecionadas
```

### Caso 3: Modo Automático para Processamento em Lote

```bash
# Transformar automaticamente sem interação
/product/transform-consolidated "docs/consolidated/" --mode=auto --output_format=tasks-only

# Gerar lista de tasks para revisão posterior
```

### Caso 4: Apenas Contexto para Documentação

```bash
# Gerar apenas contexto estruturado (sem tasks)
/product/transform-consolidated "docs/meet/consolidation-*.md" --mode=context-only

# Usar contexto gerado em refinamentos futuros
```

## 🔗 Integração com Outros Comandos

### Fluxo Completo

```bash
# 1. Extrair reunião individual
/product/extract-meeting "reuniao-01.txt"

# 2. Consolidar múltiplas reuniões
/product/consolidate-meetings "docs/meet/sprint-planning/"

# 3. Transformar consolidado em contexto/tasks
/product/transform-consolidated "docs/meet/consolidation-*.md" --mode=interactive

# 4. Criar tasks aprovadas
/product/collect "{{task_aprovada_1}}"
/product/task "{{task_aprovada_2}}"

# 5. Estimar story points (automático nos comandos acima)
/product/estimate "{{task}}"
```

### Integração com Task Manager

- ✅ Tasks criadas são automaticamente sincronizadas com Task Manager configurado
- ✅ Contexto preservado nos comentários das tasks
- ✅ Referências ao documento consolidado mantidas
- ✅ Dependências mapeadas entre tasks

## ⚙️ Parâmetros Detalhados

### `source`
- **Arquivo único**: Caminho para arquivo consolidado (.md)
- **Pasta**: Caminho para pasta contendo consolidações
- **Múltiplos arquivos**: Lista separada por espaço

### `mode`
- **`interactive`** (padrão): Interação guiada com usuário
- **`auto`**: Transformação automática sem interação
- **`tasks-only`**: Foca apenas em tarefas
- **`context-only`**: Gera apenas contexto, sem tasks

### `output_format`
- **`tasks`**: Gera lista de tasks prontas
- **`context`**: Gera contexto estruturado
- **`both`** (padrão): Gera ambos

## 💡 Boas Práticas

1. **Sempre revisar** consolidação antes de transformar
2. **Usar modo interativo** para primeira vez
3. **Modo automático** para processamento em lote conhecido
4. **Preservar contexto** nas tasks criadas
5. **Validar dependências** antes de criar tasks
6. **Priorizar gaps** que bloqueiam progresso

## ⚠️ Notas

- Documento consolidado deve seguir estrutura esperada
- Modo interativo requer confirmação do usuário
- Tasks geradas seguem padrão do Sistema Onion
- Contexto preservado para rastreabilidade completa
- Integração automática com Task Manager configurado

## 🔄 Relacionamentos

**Antes deste comando:**
- `/product/consolidate-meetings` - Consolida reuniões
- `/docs/consolidate-documents` - Consolida documentos

**Depois deste comando:**
- `/product/collect` - Criar tasks de ideias/bugs
- `/product/task` - Criar tasks estruturadas
- `/product/estimate` - Estimar story points
- `/product/refine` - Refinar tasks criadas

---

**Versão:** 3.0.0  
**Última atualização:** 2025-12-02



---

## 📚 Pré-requisitos

Domine comandos starter antes de usar este comando intermediate/advanced.

Consulte os comandos help para ver hierarquia completa e comandos relacionados:
- /business/help --level=starter
- /technical/help --level=starter

💡 Comandos intermediate/advanced assumem familiaridade com workflows básicos do contexto.
