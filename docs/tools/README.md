# 🛠️ Documentação de Ferramentas - Sistema Onion

> **Versão**: 3.0.0 | **Última atualização**: 2025-12-16  
> Documentação completa de todas as ferramentas disponíveis no contexto do Cursor IDE organizadas por categoria.

## 📑 Índice Geral

### 🔌 [Ferramentas MCP](./mcps.md)
Integrações com Model Context Protocol - ClickUp, Asana, Nx, Context7
- **50+ funções** para gestão de projeto e workflow
- Integração completa com ClickUp (tasks, time tracking, docs)
- Integração completa com Asana (tasks, goals, portfolios)
- Nx monorepo tools (generators, CI/CD)
- Context7 para documentação de bibliotecas

### 🤖 [Agentes Especializados](./agents.md)
46 agentes de IA especializados para tarefas específicas
- Gestão de Produto (@product-agent, @clickup-specialist)
- Desenvolvimento (@react-developer, @python-developer, @nodejs-specialist)
- Qualidade (@code-reviewer, @test-engineer)
- Arquitetura (@metaspec-gate-keeper, @c4-architecture-specialist)
- Compliance (@iso-27001-specialist, @soc2-specialist)

### 📋 [Comandos .cursor/](./commands.md)
90 comandos organizados em workflows automatizados
- **Product Workflow** (21 comandos) - Feature planning, specs, estimativas
- **Engineer Workflow** (11 comandos) - Development, PR, versioning
- **Git Workflow** (13 comandos) - Feature/Release/Hotfix flows
- **Documentation** (11 comandos) - Docs generation & validation
- **Meta** (9 comandos) - Criadores e ferramentas meta

### ⚙️ [Regras e Configurações](./rules.md)
Regras do workspace, padrões e convenções
- Convenções de linguagem (EN code, PT-BR docs)
- Estrutura de projeto
- Formatação ClickUp (Markdown vs Unicode)
- Padrões de código e testes
- Validações e compliance

### 🛠️ [Ferramentas Core do Cursor](./cursor.md)
Ferramentas fundamentais do Cursor IDE
- Operações de codebase (search, read, edit)
- File operations (create, update, delete)
- Terminal commands
- Grep/search avançado
- Linting & validation
- Jupyter notebooks

---

## 🎯 Guia Rápido de Uso

### Por Tipo de Tarefa

| Preciso... | Use... |
|-----------|--------|
| 🎯 Planejar feature | `@product-agent` + `/product/feature` |
| ✅ Criar task ClickUp | `mcp_ClickUp_clickup_create_task` |
| ✅ Criar task Asana | `mcp_asana_asana_create_task` |
| 💻 Desenvolver código | `@react-developer` ou `@python-developer` |
| 🔍 Buscar no código | `codebase_search` (semântico) ou `grep` (exato) |
| 🧪 Criar testes | `@test-engineer` + `/test/unit` |
| 📚 Gerar documentação | `/docs/build-tech-docs` |
| 🌿 Criar branch | `/git/feature/start "nome-feature"` |
| 🔄 Criar PR | `/engineer/pr` |
| 🏗️ Decisão arquitetural | `@metaspec-gate-keeper` |
| 📊 Estimar story points | `/product/estimate` ou `@story-points-framework-specialist` |
| 🎤 Transcrever áudio | `/product/whisper` ou `@whisper-specialist` |
| 📋 Extrair reunião | `/product/extract-meeting` ou `@extract-meeting-specialist` |

### Por Categoria

#### 🔧 Desenvolvimento
```bash
# Iniciar desenvolvimento
/engineer/start

# Trabalhar em feature
/engineer/work

# Criar PR
/engineer/pr

# Agentes especializados
@react-developer "criar componente UserProfile"
@python-developer "implementar endpoint de autenticação"
@nodejs-specialist "otimizar performance da API"
```

#### 📋 Produto
```bash
# Criar task com estimativas automáticas
/product/task "Implementar autenticação"

# Estimar story points
/product/estimate "Implementar OAuth2" --assignee_level=senior

# Especificação técnica
/product/spec

# Extrair conhecimento de reunião
/product/extract-meeting source=reuniao.txt

# Consolidar múltiplas reuniões
/product/consolidate-meetings source=docs/meet/

# Converter em tasks
/product/convert-to-tasks source=docs/meet/consolidation-*.md
```

#### 🌿 Git
```bash
# Iniciar feature branch
/git/feature/start "user-auth"

# Publicar branch
/git/feature/publish

# Finalizar feature
/git/feature/finish

# Sincronizar após merge
/git/sync
```

#### 📚 Documentação
```bash
# Gerar documentação técnica
/docs/build-tech-docs

# Gerar documentação de negócio
/docs/build-business-docs

# Consolidar documentos
/docs/consolidate-documents source=docs/business-context/

# Reconstruir índice
/docs/build-index
```

#### ⚙️ Meta
```bash
# Listar todas as ferramentas
/meta/all-tools

# Criar novo agente
/meta/create-agent

# Criar novo comando
/meta/create-command

# Configurar integração
/meta/setup-integration
```

---

## 📊 Estatísticas

### Ferramentas por Categoria

| Categoria | Quantidade | Descrição |
|-----------|------------|-----------|
| 🔌 **MCPs** | 50+ funções | ClickUp, Asana, Nx, Context7 |
| 🤖 **Agentes** | 46 agentes | Especializados em 9 categorias |
| 📋 **Comandos** | 90 comandos | Organizados em 8 categorias |
| ⚙️ **Regras** | 4 arquivos | Padrões e convenções |
| 🛠️ **Cursor Core** | 20+ funções | Operações fundamentais |

### Distribuição de Agentes

- 🔵 **Desenvolvimento**: 18 agentes
- 🟡 **Produto**: 8 agentes
- 🛡️ **Compliance**: 5 agentes
- 🌲 **Git**: 4 agentes
- 🔴 **Meta**: 4 agentes
- 🧪 **Testes**: 3 agentes
- 🟢 **Review**: 2 agentes
- 🟣 **Pesquisa**: 1 agente
- ⚙️ **Deployment**: 1 agente

### Distribuição de Comandos

- 📋 **Produto**: 21 comandos
- 🌿 **Git**: 13 comandos
- 🔧 **Engenharia**: 11 comandos
- 📚 **Documentação**: 11 comandos
- ⚙️ **Meta**: 9 comandos
- ✅ **Validação**: 6 comandos
- 🧪 **Testes**: 3 comandos
- ⚡ **Quick**: 1 comando
- 🧅 **Global**: 2 comandos (`onion`, `warm-up`)

---

## 🔗 Links Rápidos

### Documentação Relacionada
- [Guia de Comandos](../onion/commands-guide.md) - Todos os comandos em detalhes
- [Referência de Agentes](../onion/agents-reference.md) - Todos os agentes em detalhes
- [Referência de Ferramentas](../onion/tools-reference.md) - Ferramentas core do Cursor
- [Configuração Inicial](../onion/getting-started.md) - Setup completo

### Knowledge Bases
- [Task Manager Abstraction](../knowbase/concepts/task-manager-abstraction.md)
- [Framework de Story Points](../knowbase/frameworks/framework_story_points.md)
- [Framework de Testes](../knowbase/frameworks/framework_testes.md)
- [Whisper](../knowbase/tools/whisper.md)

---

## 🆕 Novidades v3.0

### Novos Comandos
- `/product/whisper` - Facilitador para transcrição de áudio
- `/product/extract-meeting` - Extração estruturada de conhecimento
- `/product/consolidate-meetings` - Consolidação de múltiplas reuniões
- `/product/convert-to-tasks` - Conversão automática em tasks
- `/docs/consolidate-documents` - Consolidação de documentos

### Novos Agentes
- `@whisper-specialist` - Especialista em transcrição de áudio
- `@extract-meeting-specialist` - Extração de conhecimento de reuniões
- `@meeting-consolidator` - Consolidação avançada de reuniões

### Novas Integrações
- **Asana MCP** - Suporte completo via Task Manager Abstraction
- **Context7 MCP** - Documentação de bibliotecas

---

## 📞 Suporte

### Comandos de Ajuda
```bash
# Ajuda geral do sistema
/onion "ajuda"

# Listar todas as ferramentas
/meta/all-tools

# Ajuda de documentação
/docs/help

# Ajuda Git
/git/help
```

### Agentes de Suporte
- `@onion` - Orquestrador master (ponto de entrada)
- `@cursor-specialist` - Troubleshooting do IDE
- `@clickup-specialist` - Problemas específicos do ClickUp

---

**Última atualização**: 2025-12-16  
**Versão**: 3.0.0  
**Mantido por**: Sistema Onion

