# 🔌 Ferramentas MCP (Model Context Protocol)

> **Versão**: 3.0.0 | **Última atualização**: 2025-12-16

Documentação completa de todas as integrações MCP disponíveis no Sistema Onion.

## 📑 Índice

- [ClickUp MCP](#clickup-mcp)
- [Asana MCP](#asana-mcp)
- [Postman MCP](#postman-mcp)
- [Nx MCP](#nx-mcp)
- [Context7 MCP](#context7-mcp)
- [Recursos MCP Gerais](#recursos-mcp-gerais)

---

## ClickUp MCP

### 🔍 Busca e Consulta

#### `mcp_ClickUp_clickup_search`
```typescript
function clickup_search(params: {
  keywords: string;
  workspace_id?: string;
  filters?: {
    asset_types?: Array<'task' | 'doc' | 'whiteboard' | 'dashboard' | 'attachment' | 'chat'>;
    assignees?: Array<string | number>;
    creators?: Array<string | number>;
    task_statuses?: Array<'unstarted' | 'active' | 'done' | 'closed' | 'archived'>;
    location?: {
      projects?: Array<string | number>;
      categories?: Array<string | number>;
      subcategories?: Array<string | number>;
    };
  };
  sort?: Array<{field: 'created_at' | 'updated_at'; direction: 'asc' | 'desc'}>;
  count?: number;
  cursor?: string;
}): SearchResults
// Propósito: Busca universal no workspace ClickUp (tasks, docs, dashboards, etc)
```

#### `mcp_ClickUp_clickup_get_workspace_hierarchy`
```typescript
function clickup_get_workspace_hierarchy(params: {
  workspace_id?: string;
  cursor?: string;
  limit?: number; // default: 10, max: 50
  max_depth?: 0 | 1 | 2; // 0=spaces, 1=spaces+folders, 2=spaces+folders+lists
  space_ids?: string[];
}): WorkspaceHierarchy
// Propósito: Obtém estrutura hierárquica do workspace (spaces, folders, lists)
```

### ✅ Gestão de Tasks

#### `mcp_ClickUp_clickup_create_task`
```typescript
function clickup_create_task(params: {
  name: string;
  list_id: string;
  workspace_id?: string;
  description?: string;
  markdown_description?: string;
  assignees?: string[]; // IDs, emails, usernames, ou "me"
  due_date?: string; // timestamp ou linguagem natural
  start_date?: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low' | '1' | '2' | '3' | '4';
  status?: string;
  tags?: string[];
  custom_fields?: Array<{id: string; value: any}>;
  parent?: string; // ID da task pai
  check_required_custom_fields?: boolean;
}): Task
// Propósito: Cria uma task em uma lista específica
```

#### `mcp_ClickUp_clickup_create_bulk_tasks`
```typescript
function clickup_create_bulk_tasks(params: {
  list_id: string;
  tasks: Array<{
    name: string;
    description?: string;
    markdown_description?: string;
    assignees?: string[];
    due_date?: string;
    priority?: 'urgent' | 'high' | 'normal' | 'low' | '1' | '2' | '3' | '4' | null;
    status?: string;
    tags?: string[];
    custom_fields?: Array<{id: string; value: any}>;
    parent?: string;
  }>;
  workspace_id?: string;
  options?: {
    batchSize?: number; // default: 10
    concurrency?: number; // default: 3
    continueOnError?: boolean;
    retryCount?: number;
  };
}): BulkTaskResults
// Propósito: Cria múltiplas tasks eficientemente em lote
```

#### `mcp_ClickUp_clickup_get_task`
```typescript
function clickup_get_task(params: {
  task_id: string;
  workspace_id?: string;
  subtasks?: boolean;
  detail_level?: 'summary' | 'detailed'; // auto-switch se >50k tokens
}): Task
// Propósito: Obtém detalhes completos de uma task (suporta custom IDs)
```

#### `mcp_ClickUp_clickup_update_task`
```typescript
function clickup_update_task(params: {
  task_id: string;
  workspace_id?: string;
  name?: string;
  description?: string;
  markdown_description?: string;
  status?: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low' | '1' | '2' | '3' | '4' | null;
  due_date?: string;
  start_date?: string;
  time_estimate?: string;
  assignees?: string[];
  custom_fields?: Array<{id: string; value: any}>;
}): Task
// Propósito: Atualiza propriedades de uma task existente
```

#### `mcp_ClickUp_clickup_update_bulk_tasks`
```typescript
function clickup_update_bulk_tasks(params: {
  tasks: Array<{
    task_id: string;
    name?: string;
    description?: string;
    markdown_description?: string;
    status?: string;
    priority?: 'urgent' | 'high' | 'normal' | 'low' | '1' | '2' | '3' | '4' | null;
    due_date?: string;
    start_date?: string;
    time_estimate?: string | number;
    assignees?: string[];
    custom_fields?: Array<{id: string; value: any}>;
  }>;
  workspace_id?: string;
  options?: {
    batchSize?: number;
    concurrency?: number;
    continueOnError?: boolean;
    retryCount?: number;
  };
}): BulkUpdateResults
// Propósito: Atualiza múltiplas tasks eficientemente
```

### 💬 Comentários

#### `mcp_ClickUp_clickup_get_task_comments`
```typescript
function clickup_get_task_comments(params: {
  task_id: string;
  workspace_id?: string;
  start?: number; // timestamp em milissegundos
  start_id?: string;
}): Comments
// Propósito: Obtém comentários de uma task (com paginação)
```

#### `mcp_ClickUp_clickup_create_task_comment`
```typescript
function clickup_create_task_comment(params: {
  task_id: string;
  comment_text: string;
  workspace_id?: string;
  notify_all?: boolean;
  assignee?: number;
}): Comment
// Propósito: Cria comentário em uma task
```

### ⏱️ Time Tracking

#### `mcp_ClickUp_clickup_start_time_tracking`
```typescript
function clickup_start_time_tracking(params: {
  task_id: string;
  workspace_id?: string;
  description?: string;
  billable?: boolean;
  tags?: string[];
}): TimeEntry
// Propósito: Inicia rastreamento de tempo em uma task
```

#### `mcp_ClickUp_clickup_stop_time_tracking`
```typescript
function clickup_stop_time_tracking(params: {
  workspace_id?: string;
  description?: string;
  tags?: string[];
}): TimeEntry
// Propósito: Para o timer de tempo atualmente ativo
```

### 📋 Listas e Folders

#### `mcp_ClickUp_clickup_create_list`
```typescript
function clickup_create_list(params: {
  name: string;
  space_name?: string;
  space_id?: string;
  workspace_id?: string;
}): List
// Propósito: Cria lista em um space
```

#### `mcp_ClickUp_clickup_get_list`
```typescript
function clickup_get_list(params: {
  list_id?: string;
  list_name?: string;
  workspace_id?: string;
}): List
// Propósito: Obtém detalhes de uma lista (por ID ou nome)
```

### 🏷️ Tags

#### `mcp_ClickUp_clickup_add_tag_to_task`
```typescript
function clickup_add_tag_to_task(params: {
  task_id: string;
  tag_name: string;
  workspace_id?: string;
}): void
// Propósito: Adiciona tag existente a uma task
```

### 👥 Membros

#### `mcp_ClickUp_clickup_get_workspace_members`
```typescript
function clickup_get_workspace_members(params: {
  workspace_id?: string;
}): Members[]
// Propósito: Lista todos os membros do workspace
```

---

## Asana MCP

### ✅ Gestão de Tasks

#### `mcp_asana_asana_create_task`
```typescript
function asana_create_task(params: {
  name: string;
  project_id?: string;
  workspace?: string;
  assignee?: string; // "me", email, ou GID
  due_on?: string; // YYYY-MM-DD
  notes?: string;
  html_notes?: string;
  parent?: string; // GID da task pai
  followers?: string; // Comma-separated list
}): Task
// Propósito: Cria task no Asana (requer project_id OU workspace+assignee)
```

#### `mcp_asana_asana_get_task`
```typescript
function asana_get_task(params: {
  task_id: string;
  opt_fields?: string; // Comma-separated list
}): Task
// Propósito: Obtém detalhes completos de uma task
```

#### `mcp_asana_asana_update_task`
```typescript
function asana_update_task(params: {
  task_id: string;
  name?: string;
  notes?: string;
  assignee?: string;
  completed?: boolean;
  due_on?: string; // YYYY-MM-DD
  custom_fields?: string; // JSON string
}): Task
// Propósito: Atualiza propriedades de uma task existente
```

#### `mcp_asana_asana_search_tasks`
```typescript
function asana_search_tasks(params: {
  workspace: string; // OBRIGATÓRIO
  text?: string;
  completed?: boolean;
  assignee_any?: string; // "me" ou comma-separated
  projects_any?: string; // Comma-separated project IDs
  due_on?: string; // YYYY-MM-DD ou null
  sort_by?: 'due_date' | 'created_at' | 'modified_at';
  limit?: number; // 1-100
}): Task[]
// Propósito: Busca avançada de tasks com múltiplos filtros
```

### 📋 Projetos

#### `mcp_asana_asana_get_projects`
```typescript
function asana_get_projects(params: {
  workspace: string; // OBRIGATÓRIO
  team?: string;
  archived?: boolean;
  limit?: number; // 1-100
}): Project[]
// Propósito: Lista projetos de um workspace
```

#### `mcp_asana_asana_get_project`
```typescript
function asana_get_project(params: {
  project_id: string;
  opt_fields?: string;
}): Project
// Propósito: Obtém detalhes completos de um projeto
```

#### `mcp_asana_asana_create_project`
```typescript
function asana_create_project(params: {
  name: string;
  workspace: string; // OBRIGATÓRIO
  team?: string; // OBRIGATÓRIO se workspace é organização
  notes?: string;
  color?: string; // dark-pink, dark-green, etc
  public?: boolean;
}): Project
// Propósito: Cria novo projeto no Asana
```

### 🎯 Goals

#### `mcp_asana_asana_get_goals`
```typescript
function asana_get_goals(params: {
  workspace?: string;
  project?: string;
  portfolio?: string;
  limit?: number; // 1-100
}): Goal[]
// Propósito: Lista goals filtrados por contexto
```

#### `mcp_asana_asana_create_goal`
```typescript
function asana_create_goal(params: {
  name: string;
  workspace: string; // OBRIGATÓRIO (ou team)
  time_period: string; // OBRIGATÓRIO
  due_on?: string; // YYYY-MM-DD
  owner?: string; // User ou team GID
}): Goal
// Propósito: Cria novo goal (OKR)
```

### 💬 Comentários

#### `mcp_asana_asana_create_task_story`
```typescript
function asana_create_task_story(params: {
  task_id: string;
  text: string;
  opt_fields?: string;
}): Story
// Propósito: Adiciona comentário a uma task
```

#### `mcp_asana_asana_get_stories_for_task`
```typescript
function asana_get_stories_for_task(params: {
  task_id: string;
  limit?: number; // 1-100
}): Story[]
// Propósito: Obtém histórico de atividade (comments, status changes)
```

### 👥 Workspaces e Usuários

#### `mcp_asana_asana_list_workspaces`
```typescript
function asana_list_workspaces(params?: {
  opt_fields?: string;
}): Workspace[]
// Propósito: Lista todos os workspaces acessíveis (SEMPRE chamar primeiro)
```

#### `mcp_asana_asana_get_user`
```typescript
function asana_get_user(params?: {
  user_id?: string; // "me", email, ou GID (default: "me")
}): User
// Propósito: Obtém informações do usuário (default: usuário autenticado)
```

---

## Postman MCP

### 📦 Collections

#### `mcp_Postman_createCollection`
```typescript
function createCollection(params: {
  workspace: string;
  collection: {
    info: {
      name: string;
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json';
    };
    item: Array<any>;
  };
}): Collection
// Propósito: Cria collection no Postman
```

#### `mcp_Postman_getCollection`
```typescript
function getCollection(params: {
  collectionId: string; // formato: OWNER_ID-UUID
}): Collection
// Propósito: Obtém informações de uma collection
```

### 🌍 Environments

#### `mcp_Postman_createEnvironment`
```typescript
function createEnvironment(params: {
  workspace: string;
  environment: {
    name: string;
    values?: Array<{
      key?: string;
      value?: string;
      type?: 'secret' | 'default';
    }>;
  };
}): Environment
// Propósito: Cria environment (max 30MB)
```

### 🔨 Mocks & Monitors

#### `mcp_Postman_createMock`
```typescript
function createMock(params: {
  workspace: string;
  mock: {
    collection: string; // UID: ownerId-collectionId
    name?: string;
  };
}): Mock
// Propósito: Cria mock server
```

#### `mcp_Postman_createMonitor`
```typescript
function createMonitor(params: {
  workspace: string;
  monitor: {
    name: string;
    collection: string;
    schedule: {
      cron: string;
    };
  };
}): Monitor
// Propósito: Cria monitor de collection
```

---

## Nx MCP

### 📊 Workspace

#### `nx_workspace`
```typescript
function nx_workspace(): WorkspaceInfo
// Propósito: Obtém visão geral do workspace Nx (projetos, erros, configuração)
```

#### `nx_project_details`
```typescript
function nx_project_details(params: {
  projectName: string;
}): ProjectDetails
// Propósito: Obtém detalhes específicos de um projeto Nx
```

### 🎨 Generators

#### `nx_generators`
```typescript
function nx_generators(params?: {
  pluginName?: string;
}): Generator[]
// Propósito: Lista generators disponíveis
```

#### `nx_generator_schema`
```typescript
function nx_generator_schema(params: {
  generatorName: string;
}): GeneratorSchema
// Propósito: Obtém schema de um generator específico
```

#### `nx_open_generate_ui`
```typescript
function nx_open_generate_ui(params: {
  generatorName: string;
  options?: Record<string, any>;
}): void
// Propósito: Abre UI do generator no Nx Console
```

### 📈 Visualização

#### `nx_visualize_graph`
```typescript
function nx_visualize_graph(params?: {
  target?: string;
  depth?: number;
}): void
// Propósito: Visualiza grafo de dependências do projeto
```

### 📚 Documentação

#### `nx_docs`
```typescript
function nx_docs(params: {
  query: string;
}): DocsResults
// Propósito: Busca documentação Nx relevante
```

---

## Context7 MCP

### 📚 Documentação de Bibliotecas

#### `mcp_context7_resolve-library-id`
```typescript
function resolve_library_id(params: {
  libraryName: string;
}): LibraryMatch[]
// Propósito: Resolve nome de biblioteca para ID compatível com Context7
// OBRIGATÓRIO antes de get-library-docs
```

#### `mcp_context7_get-library-docs`
```typescript
function get_library_docs(params: {
  context7CompatibleLibraryID: string; // Formato: /org/project ou /org/project/version
  mode?: 'code' | 'info'; // default: 'code'
  topic?: string; // Ex: 'hooks', 'routing'
  page?: number; // 1-10, default: 1
}): LibraryDocs
// Propósito: Obtém documentação atualizada de bibliotecas
// Use mode='code' para API references, mode='info' para guias conceituais
```

**Exemplo de uso**:
```typescript
// 1. Resolver library ID
const matches = await resolve_library_id({ libraryName: "next.js" });
// Retorna: [{ id: "/vercel/next.js", ... }]

// 2. Obter documentação
const docs = await get_library_docs({
  context7CompatibleLibraryID: "/vercel/next.js",
  mode: "code",
  topic: "routing"
});
```

---

## Recursos MCP Gerais

### `list_mcp_resources`
```typescript
function list_mcp_resources(params?: {
  server?: string; // Filtrar por servidor específico
}): MCPResources[]
// Propósito: Lista recursos disponíveis de servidores MCP configurados
```

### `fetch_mcp_resource`
```typescript
function fetch_mcp_resource(params: {
  server: string;
  uri: string;
  downloadPath?: string; // Caminho relativo para salvar recurso
}): ResourceContent
// Propósito: Busca recurso específico de servidor MCP
```

---

## 📊 Resumo

| Categoria | Ferramentas | Uso Principal |
|-----------|-------------|---------------|
| **ClickUp** | 50+ funções | Gestão de projeto, tasks, time tracking |
| **Asana** | 40+ funções | Gestão de projeto, goals (OKRs), portfolios |
| **Postman** | 30+ funções | APIs, collections, mocks, monitoring |
| **Nx** | 10+ funções | Monorepo, generators, CI/CD |
| **Context7** | 2 funções | Documentação atualizada de bibliotecas |

### 🎯 Dicas de Uso

1. **ClickUp**: Sempre use `workspace_id` automático, suporta linguagem natural em datas
2. **Asana**: SEMPRE chamar `asana_list_workspaces` primeiro para obter workspace IDs
3. **Postman**: Requer collection UID (ownerId-collectionId) para alguns endpoints
4. **Nx**: Use `nx_docs` quando incerto sobre configurações
5. **Context7**: Sempre usar `resolve-library-id` antes de `get-library-docs`

### 🔗 Recursos Relacionados

- [Agentes Especializados](./agents.md)
- [Comandos .cursor/](./commands.md)
- [Regras do Workspace](./rules.md)
- [Task Manager Abstraction](../../knowbase/concepts/task-manager-abstraction.md)

---

**Última atualização**: 2025-12-16  
**Versão**: 3.0.0  
**Mantido por**: Sistema Onion

