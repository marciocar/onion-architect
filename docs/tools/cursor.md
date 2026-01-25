# 🛠️ Ferramentas Core do Cursor

> **Versão**: 3.0.0 | **Última atualização**: 2025-12-16

Documentação completa das ferramentas fundamentais do Cursor IDE disponíveis para agentes de IA.

## 📑 Índice

- [Busca e Exploração de Código](#busca-e-exploração-de-código)
- [Manipulação de Arquivos](#manipulação-de-arquivos)
- [Terminal e Execução](#terminal-e-execução)
- [Jupyter Notebooks](#jupyter-notebooks)
- [Linting](#linting)
- [Busca na Web](#busca-na-web)
- [Memórias](#memórias)
- [Gestão de Tarefas](#gestão-de-tarefas)

---

## Busca e Exploração de Código

### `codebase_search`
```typescript
function codebase_search(
  query: string,
  target_directories: string[],
  explanation: string,
  search_only_prs?: boolean
): Promise<SearchResults>
// Propósito: Busca semântica por significado no código, não por texto exato
```
**Quando usar**: Explorar codebases desconhecidas, perguntas sobre "como/onde/o que" funciona

**Exemplo**:
```typescript
codebase_search(
  "como funciona autenticação de usuários",
  ["src/auth"],
  "Encontrar fluxo de autenticação"
)
```

### `grep`
```typescript
function grep(
  pattern: string,
  path?: string,
  output_mode?: "content" | "files_with_matches" | "count",
  type?: string,
  glob?: string,
  multiline?: boolean,
  head_limit?: number,
  A?: number, // context after
  B?: number, // context before
  C?: number, // context both
  i?: boolean // case insensitive
): Promise<GrepResults>
// Propósito: Busca poderosa baseada em ripgrep com regex completo
```
**Quando usar**: Busca exata de símbolos/strings, padrões regex complexos

**Exemplo**:
```typescript
grep("function getUserProfile", "src/", "content", "ts", undefined, false, 10, 5, 5)
```

### `glob_file_search`
```typescript
function glob_file_search(
  glob_pattern: string,
  target_directory?: string
): Promise<FileList>
// Propósito: Busca arquivos por padrões glob
```
**Quando usar**: Encontrar arquivos por padrão de nome

**Exemplo**:
```typescript
glob_file_search("**/*.test.ts") // Todos arquivos de teste TypeScript
glob_file_search("**/*.md", "docs/") // Todos markdown em docs/
```

---

## Manipulação de Arquivos

### `read_file`
```typescript
function read_file(
  target_file: string,
  offset?: number,
  limit?: number
): Promise<FileContent>
// Propósito: Leitura de arquivos do sistema local com numeração de linha
```
**Quando usar**: Ler arquivos completos ou seções específicas

**Exemplo**:
```typescript
read_file("src/auth/user.ts") // Arquivo completo
read_file("src/auth/user.ts", 10, 50) // Linhas 10-60
```

### `write`
```typescript
function write(
  file_path: string,
  contents: string
): Promise<WriteResult>
// Propósito: Escrita/sobrescrever arquivos no sistema local
```
**Quando usar**: Criar novos arquivos ou sobrescrever existentes

**Exemplo**:
```typescript
write("src/auth/user.ts", "export interface User { ... }")
```

### `search_replace`
```typescript
function search_replace(
  file_path: string,
  old_string: string,
  new_string: string,
  replace_all?: boolean
): Promise<ReplaceResult>
// Propósito: Substituição exata de strings em arquivos
```
**Quando usar**: Edições pontuais, substituições simples

**Exemplo**:
```typescript
search_replace("src/auth/user.ts", "interface User", "interface UserProfile")
search_replace("src/auth/user.ts", "User", "UserProfile", true) // Todas ocorrências
```

### `MultiEdit`
```typescript
interface EditOperation {
  old_string: string;
  new_string: string;
  replace_all?: boolean;
}

function MultiEdit(
  file_path: string,
  edits: EditOperation[]
): Promise<MultiEditResult>
// Propósito: Múltiplas edições em um único arquivo de forma atômica
```
**Quando usar**: Múltiplas mudanças relacionadas no mesmo arquivo

**Exemplo**:
```typescript
MultiEdit("src/auth/user.ts", [
  { old_string: "interface User", new_string: "interface UserProfile" },
  { old_string: "getUser()", new_string: "getUserProfile()" }
])
```

### `delete_file`
```typescript
function delete_file(
  target_file: string,
  explanation: string
): Promise<DeleteResult>
// Propósito: Deletar arquivos do sistema
```
**Quando usar**: Remover arquivos obsoletos ou temporários

**Exemplo**:
```typescript
delete_file("temp/old-file.ts", "Arquivo obsoleto removido")
```

### `list_dir`
```typescript
function list_dir(
  target_directory: string,
  ignore_globs?: string[]
): Promise<DirectoryListing>
// Propósito: Listar arquivos e diretórios
```
**Quando usar**: Explorar estrutura de diretórios

**Exemplo**:
```typescript
list_dir("src/")
list_dir("src/", ["**/*.test.ts", "**/node_modules/**"])
```

---

## Terminal e Execução

### `run_terminal_cmd`
```typescript
function run_terminal_cmd(
  command: string,
  is_background?: boolean
): Promise<CommandResult>
// Propósito: Executar comandos no terminal
```
**Quando usar**: Executar scripts, comandos shell, builds, testes

**Exemplo**:
```typescript
run_terminal_cmd("npm install")
run_terminal_cmd("npm run build", false)
run_terminal_cmd("npm run dev", true) // Background
```

**Diretrizes**:
- Não usar para comandos interativos (use flags `--yes`, `--non-interactive`)
- Para pagers, adicionar `| cat`
- Para jobs longos, usar `is_background: true`

---

## Jupyter Notebooks

### `edit_notebook`
```typescript
function edit_notebook(
  target_notebook: string,
  cell_idx: number,
  is_new_cell: boolean,
  cell_language: 'python' | 'markdown' | 'javascript' | 'typescript' | 'r' | 'sql' | 'shell' | 'raw' | 'other',
  old_string: string,
  new_string: string
): Promise<NotebookEditResult>
// Propósito: Editar células de notebooks Jupyter
```
**Quando usar**: Trabalhar com notebooks Jupyter

**Exemplo**:
```typescript
edit_notebook("analysis.ipynb", 0, false, "python", 
  "print('old')", "print('new')")
edit_notebook("analysis.ipynb", 1, true, "markdown", 
  "", "# Nova célula")
```

---

## Linting

### `read_lints`
```typescript
function read_lints(
  paths?: string[]
): Promise<LintResults>
// Propósito: Ler erros de linting do workspace
```
**Quando usar**: Verificar erros de lint após edições

**Exemplo**:
```typescript
read_lints() // Todos os arquivos
read_lints(["src/auth/user.ts"]) // Arquivo específico
read_lints(["src/"]) // Diretório específico
```

---

## Busca na Web

### `web_search`
```typescript
function web_search(
  search_term: string
): Promise<SearchResults>
// Propósito: Buscar informações atualizadas na web
```
**Quando usar**: Informações atualizadas, verificação de fatos, documentação oficial

**Exemplo**:
```typescript
web_search("React 19 new features")
web_search("TypeScript 5.0 breaking changes")
```

---

## Memórias

### `update_memory`
```typescript
function update_memory(
  action: "create" | "update" | "delete",
  memory: {
    id?: string;
    content: string;
    embedding?: number[];
  }
): Promise<MemoryResult>
// Propósito: Gerenciamento de memórias persistentes
```
**Quando usar**: Salvar informações importantes para referência futura

**Exemplo**:
```typescript
update_memory("create", {
  content: "O usuário prefere TypeScript sobre JavaScript"
})
```

---

## Gestão de Tarefas

### `todo_write`
```typescript
interface TodoItem {
  id: string;
  content: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

function todo_write(
  todos: TodoItem[],
  merge: boolean
): Promise<TodoResult>
// Propósito: Criação e gerenciamento de listas de tarefas estruturadas
```
**Quando usar**: Planejamento de tarefas, tracking de progresso

**Exemplo**:
```typescript
todo_write([
  { id: "1", content: "Implementar autenticação", status: "in_progress" },
  { id: "2", content: "Criar testes", status: "pending" }
], false)
```

---

## 📊 Resumo por Categoria

| Categoria | Ferramentas | Uso Principal |
|-----------|-------------|---------------|
| **Busca** | 3 | codebase_search, grep, glob_file_search |
| **Arquivos** | 6 | read_file, write, search_replace, MultiEdit, delete_file, list_dir |
| **Terminal** | 1 | run_terminal_cmd |
| **Notebooks** | 1 | edit_notebook |
| **Linting** | 1 | read_lints |
| **Web** | 1 | web_search |
| **Memórias** | 1 | update_memory |
| **Tarefas** | 1 | todo_write |

---

## 🎯 Quando Usar Cada Ferramenta

### Busca de Código
- **`codebase_search`**: Perguntas semânticas ("como funciona X?")
- **`grep`**: Busca exata de símbolos, padrões regex
- **`glob_file_search`**: Encontrar arquivos por padrão

### Edição de Código
- **`search_replace`**: Mudanças simples e pontuais
- **`MultiEdit`**: Múltiplas mudanças relacionadas no mesmo arquivo
- **`write`**: Criar novos arquivos ou reescrever completamente

### Execução
- **`run_terminal_cmd`**: Scripts, builds, testes, comandos shell
- **`read_lints`**: Verificar erros após edições

### Exploração
- **`list_dir`**: Explorar estrutura de diretórios
- **`read_file`**: Ler arquivos para análise

---

## 🔗 Recursos Relacionados

- [Referência Completa de Ferramentas](../../onion/tools-reference.md)
- [Comandos .cursor/](./commands.md)
- [Agentes Especializados](./agents.md)
- [Ferramentas MCP](./mcps.md)

---

**Última atualização**: 2025-12-16  
**Versão**: 3.0.0  
**Mantido por**: Sistema Onion

