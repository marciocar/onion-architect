---
name: task
description: |
  Criação de tasks com decomposição hierárquica inteligente.
  Use para criar tasks estruturadas com subtasks e action items.
  Suporta: ClickUp, Asana, Linear (via TASK_MANAGER_PROVIDER).
model: sonnet

parameters:
  - name: description
    description: Descrição da task
    required: true
  - name: project_name
    description: Nome do projeto/lista (opcional)
    required: false

category: product
tags:
  - task
  - task-manager
  - decomposition

version: "4.0.0"
updated: "2025-12-20"

related_commands:
  - /product/spec
  - /product/estimate
  - /engineer/start

related_agents:
  - task-specialist
  - product-agent
  - story-points-framework-specialist
level: starter
context: business
---

# 🚀 Criação de Task com Decomposição

Criar tasks estruturadas no gerenciador de tarefas configurado.

## 🚨 AÇÃO OBRIGATÓRIA PRIMEIRO: Detectar Provedor

**⚠️ CRÍTICO - EXECUTAR ANTES DE QUALQUER OUTRA AÇÃO:**

**PASSO 0 (OBRIGATÓRIO):** Ler arquivo `.env` para detectar `TASK_MANAGER_PROVIDER`

```bash
# EXECUTAR PRIMEIRO: Ler .env usando read_file
read_file .env
```

**APÓS LER .env, EXTRAIR:**
- Valor de `TASK_MANAGER_PROVIDER` (pode ser: `clickup`, `asana`, `linear`, ou `none`)
- Se `TASK_MANAGER_PROVIDER=clickup`: verificar se `CLICKUP_API_TOKEN` existe
- Se `TASK_MANAGER_PROVIDER=asana`: verificar se `ASANA_ACCESS_TOKEN` existe
- Se `TASK_MANAGER_PROVIDER=linear`: verificar se `LINEAR_API_KEY` existe
- Se `TASK_MANAGER_PROVIDER=none` ou não existe: modo offline

**⚠️ NUNCA ASSUMIR O PROVEDOR - SEMPRE LER .env PRIMEIRO**

## 🔧 Pré-requisito: Verificar Provedor

Antes de criar tasks, verificar configuração:
1. ✅ **LER `.env` usando `read_file .env`** (OBRIGATÓRIO)
2. Extrair `TASK_MANAGER_PROVIDER` do conteúdo lido
3. Se não configurado ou "none":
   - Avisar: "⚠️ Nenhum gerenciador configurado. Execute /meta/setup-integration"
   - Continuar com estrutura local (sem sincronização)
4. Se configurado:
   - Usar adapter correspondente de `.cursor/utils/task-manager/adapters/`
   - **SE `TASK_MANAGER_PROVIDER=asana`: usar ferramentas `mcp_asana_*`**
   - **SE `TASK_MANAGER_PROVIDER=clickup`: usar ferramentas `mcp_ClickUp_*`**

## 🎯 Objetivo

Estabelecer base sólida para desenvolvimento com decomposição Task → Subtask → Action Item.

## ⚡ Fluxo de Execução

### Passo 1: Detectar Provedor e Configuração

**CRÍTICO:** Executar estas ações na ordem EXATA:

1. **OBRIGATÓRIO - Ler `.env` para detectar provedor:**
   ```bash
   # EXECUTAR PRIMEIRO: Ler arquivo .env
   read_file .env
   
   # EXTRAIR do conteúdo lido:
   # - TASK_MANAGER_PROVIDER=??? (clickup, asana, linear, ou none)
   # - Verificar variáveis obrigatórias correspondentes:
   #   * Se clickup: CLICKUP_API_TOKEN
   #   * Se asana: ASANA_ACCESS_TOKEN  
   #   * Se linear: LINEAR_API_KEY
   ```

2. **Validar configuração baseado no valor EXTRAÍDO:**
   ```markdown
   SE TASK_MANAGER_PROVIDER extraído = 'clickup':
     ✅ Verificar CLICKUP_API_TOKEN existe no .env lido
     ✅ Se não existe: avisar e continuar em modo offline
     ✅ Usar ferramentas mcp_ClickUp_* para criar tasks
     
   SE TASK_MANAGER_PROVIDER extraído = 'asana':
     ✅ Verificar ASANA_ACCESS_TOKEN existe no .env lido
     ✅ Se não existe: avisar e continuar em modo offline
     ✅ Usar ferramentas mcp_asana_* para criar tasks
     
   SE TASK_MANAGER_PROVIDER extraído = 'linear':
     ✅ Verificar LINEAR_API_KEY existe no .env lido
     ✅ Se não existe: avisar e continuar em modo offline
     
   SE TASK_MANAGER_PROVIDER extraído = 'none' ou não encontrado:
     ⚠️ Modo offline - tasks não serão sincronizadas
     💡 Avisar: Execute /meta/setup-integration para configurar
   ```

3. **Resolver projeto/lista (se `project_name` fornecido):**
   ```markdown
   SE project_name fornecido:
     - ClickUp: usar mcp_ClickUp_clickup_get_list com list_name
     - Asana: usar mcp_asana_asana_get_projects e buscar por nome
     - Se não encontrado: perguntar ao usuário ou usar padrão
   
   SE project_name não fornecido:
     - ClickUp: usar CLICKUP_DEFAULT_LIST_ID do .env
     - Asana: usar ASANA_DEFAULT_PROJECT_ID do .env
     - Se não configurado: listar opções e perguntar ao usuário
   ```

### Passo 2: Análise de Contexto

```bash
# Revisar documentação do projeto
read_file README.md
ls docs/*.md

# Entender estrutura existente
list_dir src/
```

### Passo 3: Análise Profunda e Compreensão

**SEMPRE siga esta sequência obrigatória:**

#### 📚 Revisão de Documentação (OBRIGATÓRIO)
1. **Revise PRIMEIRO a documentação atual do projeto**: README.md e arquivos .md na pasta `docs/`
2. **Analise estrutura existente** baseado na documentação revisada
3. **Identifique padrões e tecnologias** já estabelecidos no projeto

#### 🤔 Compreensão da Tarefa
1. **Leia cuidadosamente** a descrição da tarefa fornecida: `{{description}}`
2. **Formule perguntas internas** para esclarecer ambiguidades ou informações faltantes
3. **Analise como a tarefa se encaixa** na estrutura existente do projeto
4. **Identifique complexidade, dependências e padrões aplicáveis**:
   - Simples (1-3 dias): 2-3 subtasks
   - Média (4-7 dias): 3-4 subtasks
   - Complexa (1-2 sem): 4-6 subtasks
   - Épico (>2 sem): Quebrar em múltiplas tasks

#### ✅ Confirmação e Esclarecimento (OBRIGATÓRIO)
1. **Antes de proceder**, confirme seu entendimento da tarefa
2. **Se precisar de mais informações**, declare quais detalhes adicionais seriam úteis
3. **SEMPRE apresente seu plano** ao usuário antes de criar a task
4. **Peça confirmação explícita** antes de executar criação no Task Manager

### Passo 4: Apresentação do Plano Final (OBRIGATÓRIO ANTES DE CRIAR)

**⚠️ CRÍTICO: NUNCA criar task sem apresentar plano e obter confirmação**

**OBRIGATÓRIO: Apresente seu plano ao usuário e peça confirmação antes de criar:**

```markdown
## 🎯 PLANO DE TASK PROPOSTO

### **📋 Task Principal**
**Nome**: [NOME_DA_TASK]
**Tipo**: [Feature/Bug/Improvement/Research]
**Complexidade**: [Simples/Média/Alta]
**Estimativa**: [TEMPO_ESTIMADO]

### **📝 Descrição Funcional**
[DESCRIÇÃO_CLARA_DO_OBJETIVO]

### **🏗️ Arquitetura Técnica** 
[DETALHAMENTO_TÉCNICO_E_IMPLEMENTAÇÃO]

### **📚 Bibliotecas/Dependências Sugeridas**
[LISTA_DE_DEPENDÊNCIAS_PRIORIZANDO_CONHECIDAS]

### **🔧 Componentes Afetados**
[COMPONENTES_QUE_SERÃO_MODIFICADOS]

### **✅ Critérios de Aceitação**
- [ ] [CRITÉRIO_1]
- [ ] [CRITÉRIO_2]  
- [ ] [CRITÉRIO_3]

### **🧪 Pontos de Atenção para Teste**
[ESTRATÉGIA_DE_TESTES_E_VALIDAÇÃO]

❓ **Este plano está correto? Posso proceder com a criação da task no Task Manager?** [Y/n]
```

**⚠️ IMPORTANTE:** 
- **AGUARDAR confirmação explícita do usuário** antes de prosseguir
- **NÃO criar task** até receber confirmação
- **Se usuário pedir ajustes**, revisar plano e apresentar novamente

### Passo 5: Decompor Hierarquicamente (APÓS CONFIRMAÇÃO)

Consultar @task-specialist para estrutura:

```
📋 TASK (Objetivo de Alto Nível)
├── 🔧 Subtask 1 (Componente Funcional)  
│   ├── ✅ Action Item 1.1 (1-4h)
│   ├── ✅ Action Item 1.2 (1-4h)
│   └── ✅ Action Item 1.3 (1-4h)
└── 🔧 Subtask 2 (Componente Funcional)
    ├── ✅ Action Item 2.1 (1-4h)
    └── ✅ Action Item 2.2 (1-4h)
```

### Passo 6: Estimar Story Points (Automático)

**CRÍTICO:** Após decomposição, SEMPRE estimar story points para task principal e cada subtask.

#### 6.1. Estimar Task Principal

```markdown
@story-points-framework-specialist

Por favor, analise e estime a seguinte tarefa:

**Tarefa Principal:** {{description}}
**Subtasks identificadas:** [lista de subtasks]
**Complexidade inicial:** [simples/média/complexa]

Forneça:
1. Story points para task principal
2. Análise de complexidade, risco e incerteza
3. Recomendações (quebra, riscos, dependências)
```

**Output esperado:**
- Story points da task principal
- Análise completa de fatores
- Recomendações

#### 6.2. Estimar Cada Subtask

```markdown
Para cada subtask identificada:

@story-points-framework-specialist

**Subtask:** [nome da subtask]
**Descrição:** [descrição da subtask]
**Action items:** [lista de action items]

Estime story points para esta subtask.
```

**Armazenar:**
- Story points por subtask
- Total de pontos (soma das subtasks)

#### 6.3. Validar Consistência

```markdown
SE soma(subtasks) > task_principal:
  ⚠️ AVISO: Soma das subtasks maior que task principal
  Ajustar task principal para: soma(subtasks)
  
SE task_principal > 13 pontos:
  ⚠️ ALERTA: Task identificada como ÉPICO
  Propor quebra em múltiplas tasks menores
```

### Passo 7: Criar no Gerenciador (APÓS CONFIRMAÇÃO DO USUÁRIO)

**🚨 ORDEM CRÍTICA DE EXECUÇÃO:**

**⚠️ SEMPRE SEGUIR ESTA ORDEM:**
1. **PRIMEIRO**: Criar task no Task Manager (registrar o que VAI ser feito)
2. **DEPOIS**: Se a task envolve trabalho imediato (ex: deletar arquivos, fazer mudanças), executar o trabalho
3. **POR ÚLTIMO**: Atualizar task com resultado (comentários, status, evidências)

**❌ NUNCA FAZER:**
- Executar trabalho antes de criar a task
- Criar task depois que o trabalho já foi feito
- Assumir que o trabalho já foi feito antes de criar a task

**✅ SEMPRE:**
- Criar task primeiro para registrar intenção
- Executar trabalho após task criada (se aplicável)
- Atualizar task com progresso e resultado

**CRÍTICO:** 
- ✅ Usar ferramentas MCP diretamente (`mcp_ClickUp_*`, `mcp_asana_*`)
- ✅ Seguir padrão de abstração do Task Manager para normalizar entrada/saída
- ✅ Consultar `.cursor/utils/task-manager/interface.md` para formato de dados
- ✅ Consultar `.cursor/utils/task-manager/adapters/{provedor}.md` para mapeamentos específicos

**IMPORTANTE:** Mesmo usando MCP diretamente, os dados devem seguir o padrão da abstração:
- Entrada normalizada (priority: urgent/high/normal/low)
- Saída normalizada (TaskOutput com campos padronizados)
- Mapeamento de status conforme interface

#### 6.1. Preparar Dados Normalizados (Padrão Abstração)

```markdown
Preparar estrutura normalizada seguindo interface ITaskManager:

**Task Principal:**
- name: "{{description}}"
- markdownDescription: [formato markdown com objetivo, critérios, story points]
- priority: 'high' (normalizado: urgent/high/normal/low)
- tags: ['feature']
- projectId: [resolvido no Passo 1]

**Cada Subtask:**
- name: [nome da subtask]
- markdownDescription: [descrição + story points]
- priority: [herdar da task principal ou 'normal']
- tags: [tags da subtask se houver]
```

#### 6.2. Criar Task Principal (Executar MCP)

**SE provedor = 'clickup':**
```markdown
1. Chamar mcp_ClickUp_clickup_create_task com:
   - list_id: [projectId resolvido]
   - name: [nome normalizado]
   - markdown_description: [descrição markdown completa]
   - priority: 'high' (mapear: high → 'high' no ClickUp)
   - tags: ['feature']
   - workspace_id: [CLICKUP_WORKSPACE_ID do .env, se disponível]

2. Extrair task.id da resposta
3. Armazenar task.url para output final
```

**SE provedor = 'asana':**
```markdown
1. Chamar mcp_asana_asana_create_task com:
   - name: [nome normalizado]
   - html_notes: [descrição markdown convertida para HTML]
   - project_id: [projectId resolvido]
   - workspace: [ASANA_WORKSPACE_ID do .env, se disponível]

2. Extrair task.gid da resposta (data.gid)
3. Construir URL: https://app.asana.com/0/0/{gid}
```

**SE provedor = 'none' ou não configurado:**
```markdown
⚠️ Modo offline - criar apenas estrutura local
- Gerar ID local: local-{timestamp}
- Criar documento em .cursor/sessions/tasks/{id}.md
- Avisar que não será sincronizado
```

#### 6.3. Criar Subtasks (Executar MCP)

**Para cada subtask da decomposição:**

**SE provedor = 'clickup':**
```markdown
Chamar mcp_ClickUp_clickup_create_task com:
- list_id: [mesmo list_id da task principal]
- parent: [task.id da task principal criada]
- name: [nome da subtask]
- markdown_description: [descrição + story points]
- priority: [mapear para ClickUp]
- tags: [tags da subtask]
```

**SE provedor = 'asana':**
```markdown
Chamar mcp_asana_asana_create_task com:
- name: [nome da subtask]
- html_notes: [descrição + story points em HTML]
- parent: [task.gid da task principal]
- workspace: [ASANA_WORKSPACE_ID]
```

**SE provedor = 'none':**
```markdown
Criar documento local: .cursor/sessions/tasks/{parent-id}/subtasks/{subtask-id}.md
```

#### 6.4. Adicionar Comentário Inicial (Executar MCP)

**Preparar comentário formatado:**
```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 TASK CRIADA VIA /product/task
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 COMPLEXIDADE: ${complexity}
🎲 STORY POINTS:
∟ Task Principal: ${mainTaskStoryPoints} pontos
∟ Subtasks: ${subtasksPoints} pontos (${subtasks.length} subtasks)
∟ Total: ${totalPoints} pontos

⚡ FATORES:
${factorsSummary}

💡 RECOMENDAÇÕES:
${recommendations}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**SE provedor = 'clickup':**
```markdown
Chamar mcp_ClickUp_clickup_create_task_comment com:
- task_id: [task.id]
- comment_text: [comentário formatado acima]
```

**SE provedor = 'asana':**
```markdown
Chamar mcp_asana_asana_create_task_story com:
- task_id: [task.gid]
- text: [comentário formatado acima]
```

**SE provedor = 'none':**
```markdown
Adicionar comentário ao documento local
```

#### 6.5. Normalizar Saída (Padrão Abstração)

```markdown
Após criar, normalizar resposta para formato padrão:

**TaskOutput normalizado:**
- id: [task.id ou task.gid]
- provider: [clickup/asana/none]
- name: [nome da task]
- url: [URL completa da task]
- status: 'todo' (padrão inicial)
- createdAt: [timestamp ISO]
- projectId: [ID do projeto/lista]
- storyPoints: [story points da task principal]
- subtasks: [array de subtasks normalizadas]
```

### Passo 8: Executar Trabalho (Se Aplicável)

**⚠️ APENAS se a task envolve trabalho imediato:**

Se a descrição da task indica trabalho que deve ser executado imediatamente (ex: "Remover arquivos X", "Criar estrutura Y", "Atualizar configuração Z"):

1. **APÓS criar a task no Task Manager**, executar o trabalho descrito
2. **Documentar o que foi feito** durante a execução
3. **Atualizar a task** com comentário detalhado do resultado

**Se a task é apenas para planejamento/desenvolvimento futuro:**
- Pular este passo
- Task fica como "To Do" para execução posterior

### Passo 9: Atualizar Task com Resultado

**Se trabalho foi executado no Passo 8:**

1. **Adicionar comentário detalhado** na task com:
   - O que foi feito
   - Arquivos modificados/criados/deletados
   - Resultado da execução
   - Próximos passos (se houver)

2. **Atualizar status** se apropriado:
   - Se trabalho completo: status → "Done"
   - Se parcial: status → "In Progress"
   - Se apenas planejamento: manter "To Do"

### Passo 10: Apresentar Resultado

## 📤 Output Esperado

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TASK CRIADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Task: {{description}}
🔗 URL: [url do provedor]
📊 Provedor: [clickup/asana/linear/local]

🎲 STORY POINTS:
∟ Task Principal: [X] pontos
∟ Subtasks: [Y] pontos ([N] subtasks)
∟ Total: [Z] pontos

📊 ANÁLISE:
∟ Complexidade: [alta/média/baixa]
∟ Risco: [alto/médio/baixo]
∟ Incerteza: [alta/média/baixa]

🔧 ESTRUTURA:
├── Subtask 1: [nome] - [X] pontos
│   ├── ✅ Item 1.1
│   └── ✅ Item 1.2
└── Subtask 2: [nome] - [Y] pontos
    └── ✅ Item 2.1

💡 RECOMENDAÇÕES:
${recommendations}

🚀 Próximo: /engineer/start [feature-slug]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 📏 Regras de Decomposição

| Tipo | Duração | Subtasks | Action Items/Subtask |
|------|---------|----------|---------------------|
| Simples | 1-3d | 2-3 | 2-3 |
| Média | 4-7d | 3-4 | 3-4 |
| Complexa | 1-2sem | 4-6 | 3-5 |
| Épico | >2sem | Quebrar | - |

## 🔗 Referências

### Task Manager Abstraction
- **Interface:** `.cursor/utils/task-manager/interface.md` - Formato de entrada/saída normalizado
- **Detector:** `.cursor/utils/task-manager/detector.md` - Como detectar provedor do .env
- **Adapters (Guias de Mapeamento):**
  - `.cursor/utils/task-manager/adapters/clickup.md` - Mapeamento ClickUp MCP
  - `.cursor/utils/task-manager/adapters/asana.md` - Mapeamento Asana MCP
  - `.cursor/utils/task-manager/types.md` - Tipos compartilhados

### Decomposição e Estimativas
- **Decomposição:** @task-specialist
- **Estimativas:** @story-points-framework-specialist, /product/estimate
- **Framework:** `docs/knowbase/frameworks/framework_story_points.md`

### Padrões de Formatação
- **ClickUp:** `.cursor/commands/common/prompts/clickup-patterns.md`
- **Formatação:** `.cursor/docs/clickup/clickup-formatting.md`

## ⚠️ Notas

- **OBRIGATÓRIO:** SEMPRE apresentar plano e pedir confirmação antes de criar task
- **OBRIGATÓRIO:** Criar task PRIMEIRO, depois executar trabalho (se aplicável)
- Action items: máximo 4h cada
- Se épico: sugerir quebrar em múltiplas tasks
- Se provedor não configurado: funciona em modo local
- **Estimativas automáticas:** Story points calculados automaticamente para task principal e todas subtasks
- **Validação:** Se soma(subtasks) > task principal, ajustar task principal
- **Épicos:** Se task > 13 pontos, alertar e propor quebra


---

## 🚀 Próximos Passos

Agora que você criou uma task, considere:

1. **Validar completude da task**:
   ```bash
   /business/task-check "task-id"
   ```
   Verifica se a task tem todos os campos necessários e critérios claros.

2. **Iniciar desenvolvimento**:
   ```bash
   /technical/start "feature-name"
   ```
   Começa o trabalho técnico com sessão estruturada.

3. **Acompanhar progresso**:
   ```bash
   /technical/work "task-id"
   ```
   Continua desenvolvimento e atualiza task automaticamente.

💡 **Dica**: O Sistema Onion sincroniza automaticamente o progresso com seu task manager (ClickUp, Asana, Linear).
