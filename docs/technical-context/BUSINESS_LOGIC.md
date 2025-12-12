# 💼 Business Logic Documentation - Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 🎯 Domain Concepts

### Core Entities

#### Knowbase (Base de Conhecimento)
**Definição:** Container de conhecimento temático organizado.

**Propriedades:**
- `id`: UUID v7 (chave primária)
- `tenantId`: UUID (multi-tenancy)
- `name`: String (nome da knowbase)
- `description`: String? (descrição opcional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Regras de Negócio:**
- Cada tenant pode ter múltiplas knowbases
- Nome deve ser único por tenant
- Knowbase não pode ser deletada se tiver agentes vinculados
- Conteúdo é armazenado como chunks no Qdrant

#### Agent (Agente)
**Definição:** Assistente de IA personalizado que conhece knowbases específicas.

**Propriedades:**
- `id`: UUID v7
- `tenantId`: UUID
- `knowbaseIds`: UUID[] (knowbases que o agente conhece)
- `name`: String
- `description`: String?
- `instructions`: String? (comportamento customizado)
- `model`: String? (GPT-4, Claude, etc. - BYOL)

**Regras de Negócio:**
- Agente deve ter pelo menos uma knowbase vinculada
- Agente pode conhecer múltiplas knowbases
- Instruções são opcionais mas recomendadas
- Model padrão é GPT-4 se não especificado

#### Command (Comando)
**Definição:** Workflow automatizado que executa uma sequência de ações.

**Propriedades:**
- `id`: UUID v7
- `tenantId`: UUID
- `name`: String (ex: `/daily-report`)
- `description`: String?
- `steps`: JSON (definição dos passos)
- `variables`: JSON? (variáveis do comando)
- `scheduled`: Boolean (se pode ser agendado)

**Regras de Negócio:**
- Nome deve seguir padrão `/kebab-case`
- Comandos podem referenciar outros comandos
- Variáveis são opcionais mas permitem reutilização
- Scheduler só disponível no plano Pro

#### Rule (Regra)
**Definição:** Padrão de comportamento que garante consistência.

**Propriedades:**
- `id`: UUID v7
- `tenantId`: UUID
- `name`: String
- `scope`: JSON (onde se aplica: agents, commands, global)
- `behavior`: JSON (o que a regra faz)
- `priority`: Number (1-100, maior = mais importante)
- `active`: Boolean

**Regras de Negócio:**
- Regras com maior prioridade sobrescrevem menores
- Regras podem ser desativadas sem deletar
- Escopo pode ser específico (agent X) ou global
- Regras críticas (priority 100) não podem ser desativadas

---

## 📋 Business Rules

### Knowbase Management

**Criação:**
1. Validar nome único por tenant
2. Criar knowbase no PostgreSQL
3. Inicializar collection no Qdrant
4. Retornar knowbase criada

**Atualização:**
1. Validar knowbase existe e pertence ao tenant
2. Atualizar campos permitidos
3. Não permitir mudança de `tenantId`

**Deleção:**
1. Validar knowbase não tem agentes vinculados
2. Deletar chunks do Qdrant
3. Deletar knowbase do PostgreSQL (soft delete?)

**Adição de Conteúdo:**
1. Processar conteúdo (texto, PDF, etc.)
2. Chunking (semantic chunks)
3. Gerar embeddings
4. Armazenar no Qdrant com metadata

### Agent Management

**Criação:**
1. Validar pelo menos uma knowbase vinculada
2. Validar knowbases pertencem ao tenant
3. Criar agente
4. Validar instruções (se fornecidas)

**Execução:**
1. Carregar knowbases vinculadas
2. Buscar contexto relevante no Qdrant
3. Construir prompt com contexto + instruções
4. Chamar LLM API (OpenAI, Claude, etc.)
5. Retornar resposta

**Limites por Plano:**
- Free: 1 agente
- Pro: 10 agentes
- Enterprise: Ilimitado

### Command Execution

**Execução Manual:**
1. Validar comando existe e pertence ao tenant
2. Resolver variáveis (se houver)
3. Executar passos em sequência
4. Retornar resultado

**Execução Agendada:**
1. Validar scheduler está ativo (Pro tier)
2. Criar job no BullMQ
3. Worker processa no horário agendado
4. Notificar usuário (email/in-app)

**Limites:**
- Free: 50 execuções/mês
- Pro: 1000 execuções/mês
- Enterprise: Ilimitado

### Rule Application

**Ordem de Aplicação:**
1. Regras globais (priority 1-50)
2. Regras de feature (priority 51-75)
3. Regras específicas (priority 76-99)
4. Regras críticas (priority 100)

**Conflitos:**
- Regra de maior prioridade vence
- Se mesma prioridade, mais específica vence
- Se ainda empate, mais recente vence

---

## 🔄 Workflow Processes

### Onboarding Flow

```
1. User signs up (Logto)
   ↓
2. Create default tenant
   ↓
3. Create welcome knowbase
   ↓
4. Create @onion agent (system agent)
   ↓
5. Show onboarding tutorial
   ↓
6. User creates first custom knowbase
   ↓
7. User asks first question
   ↓
8. ACTIVATED ✅
```

### Knowbase → Agent → Response Flow

```
1. User asks question to @agent
   ↓
2. System loads agent's knowbases
   ↓
3. Query Qdrant for relevant chunks
   ↓
4. Build prompt:
   - Agent instructions
   - Relevant chunks from knowbases
   - User question
   ↓
5. Call LLM API (streaming)
   ↓
6. Apply rules (formatting, tone, etc.)
   ↓
7. Stream response to user
   ↓
8. Log interaction (for analytics)
```

### Command Execution Flow

```
1. User executes /command-name
   ↓
2. System loads command definition
   ↓
3. Resolve variables (prompt user if needed)
   ↓
4. Execute steps sequentially:
   For each step:
     a. Validate step definition
     b. Execute action (call agent, query DB, etc.)
     c. Store result in context
   ↓
5. Return final result
   ↓
6. If scheduled, create BullMQ job
```

---

## ⚠️ Edge Cases

### Knowbase Edge Cases

**Caso 1: Knowbase vazia**
- **Problema:** Agente não tem contexto
- **Solução:** Sugerir adicionar conteúdo ou usar knowbases com conteúdo

**Caso 2: Knowbase muito grande**
- **Problema:** Performance degradada
- **Solução:** Limitar tamanho ou dividir em múltiplas knowbases

**Caso 3: Conteúdo duplicado**
- **Problema:** Chunks duplicados no Qdrant
- **Solução:** Deduplicação antes de inserir

### Agent Edge Cases

**Caso 1: Agente sem knowbases**
- **Problema:** Agente não tem conhecimento
- **Solução:** Validar na criação, não permitir

**Caso 2: Knowbase deletada**
- **Problema:** Agente referencia knowbase inexistente
- **Solução:** Validar na execução, remover knowbaseId ou erro

**Caso 3: LLM API falha**
- **Problema:** Resposta não disponível
- **Solução:** Retry com exponential backoff, fallback message

### Multi-tenancy Edge Cases

**Caso 1: Tenant não existe**
- **Problema:** Request com tenantId inválido
- **Solução:** Validar tenant existe antes de queries

**Caso 2: Usuário sem acesso ao tenant**
- **Problema:** Usuário tenta acessar tenant não autorizado
- **Solução:** Validar permissões no auth middleware

**Caso 3: RLS não aplicado**
- **Problema:** Query retorna dados de outro tenant
- **Solução:** Sempre setar `app.current_tenant` antes de queries

---

## 🔐 Validation Rules

### Input Validation (Zod)

**Knowbase:**
```typescript
- name: string, min 1, max 255
- description: string?, max 1000
- tenantId: UUID (validado mas não enviado pelo cliente)
```

**Agent:**
```typescript
- name: string, min 1, max 255
- knowbaseIds: UUID[], min 1
- instructions: string?, max 5000
- model: enum(['gpt-4', 'claude-3', 'custom'])
```

**Command:**
```typescript
- name: string, pattern: /^\/[a-z0-9-]+$/
- steps: JSON array, min 1
- variables: JSON object?
```

### Business Validation

**Knowbase:**
- Nome único por tenant
- Não deletar se tiver agentes

**Agent:**
- Pelo menos uma knowbase
- Knowbases pertencem ao tenant

**Command:**
- Nome único por tenant
- Steps válidos (validação de estrutura)

---

## 📊 State Machines

### Knowbase Lifecycle

```
CREATED → ACTIVE → ARCHIVED → DELETED
   ↓        ↓         ↓
   └────────┴─────────┘
      (can be reactivated)
```

### Agent Lifecycle

```
CREATED → ACTIVE → INACTIVE → DELETED
   ↓        ↓         ↓
   └────────┴─────────┘
      (can be reactivated)
```

### Command Execution State

```
PENDING → RUNNING → SUCCESS
              ↓
           FAILED
              ↓
          RETRYING → SUCCESS
```

---

## 🔗 Cross-Feature Dependencies

### Knowbase ↔ Agent
- Agente depende de knowbases para contexto
- Knowbase não pode ser deletada se referenciada por agentes

### Agent ↔ Command
- Comandos podem chamar agentes
- Agentes podem ser usados em workflows

### Rule ↔ All
- Regras aplicam a agents, commands, knowbases
- Regras globais afetam tudo

---

## 📚 References

- [Business Context](../business-context/)
- [Feature Catalog](../business-context/features/)

---

**Próximo documento:** [API Specification](API_SPECIFICATION.md)

