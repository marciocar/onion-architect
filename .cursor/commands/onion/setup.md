---
name: setup
description: |
  Wizard inteligente de configuração e validação do Onion v4.
  Use após onion init para configurar, validar e ativar automaticamente.
model: sonnet

parameters:
  - name: mode
    description: Modo de operação (wizard|validate|reconfigure|force)
    required: false
    default: wizard

category: onion
tags:
  - setup
  - configuration
  - validation
  - wizard
  - intelligent

version: "4.0.0"
updated: "2026-01-01"

related_commands:
  - /onion/init
  - /onion/validate
  - /engineer/warm-up

related_agents:
  - onion
  - cursor-specialist
---

# 🧅 Setup do Onion - Wizard Inteligente

Wizard de configuração pós-inicialização com detecção automática, sugestões inteligentes e ativação completa.

## 🎯 Objetivo

Guiar o usuário através de configuração, validação e ativação completa do Onion v4, **sem depender de conhecimento prévio**, detectando automaticamente ambiente, projeto e sugerindo configurações apropriadas.

## 📚 Contexto Necessário

**SEMPRE carregar antes de começar:**

### Documentação Onion
- `docs/onion/getting-started.md` - Guia inicial
- `docs/onion/commands-guide.md` - Referência de comandos
- `docs/onion/agents-reference.md` - Referência de agentes
- `docs/onion/ide-integration-complete.md` - Integração IDEs

### Knowledge Bases Relevantes
- `docs/knowbase/concepts/ai-agent-design-patterns.md`
- `docs/knowbase/concepts/context-window-optimization.md`
- `docs/knowbase/concepts/configuration-management.md`
- `docs/knowbase/frameworks/onion-multi-context-orchestrator-vision.md`
- `docs/knowbase/frameworks/onion-ide-integration-strategy.md`

**IMPORTANTE:** Ler estes arquivos ANTES de executar qualquer passo do wizard.

## ⚡ Fluxo de Execução

### Modo de Operação

Determinar modo baseado em `{{mode}}`:

- **wizard** (padrão): Wizard completo com detecção e configuração
- **validate**: Apenas validação sem alterações
- **reconfigure**: Reconfiguração de projeto existente
- **force**: Forçar wizard mesmo se já configurado

---

## 📋 MODO WIZARD (Padrão)

### Passo 1: Verificar Configuração Existente

**1.1 Buscar arquivo de configuração**
```bash
# Verificar se existe .onion-config.yml no projeto
ls -la .onion-config.yml 2>/dev/null

# Se não existir na raiz, pode estar em subdiretório
find . -maxdepth 2 -name ".onion-config.yml" -o -name "onion-config.yml"
```

**1.2 Se encontrado, ler configuração atual**
```bash
cat .onion-config.yml
```

**1.3 Extrair informações da configuração existente:**
- `project.type` - Tipo de projeto (startup, enterprise, open-source, agency)
- `project.name` - Nome do projeto
- `contexts` - Lista de contextos ativos
- `ides` - Lista de IDEs configuradas
- `integrations` - Integrações configuradas

**CRÍTICO:** NÃO assumir valores! Se o arquivo existir, SEMPRE ler e usar os valores reais.

**Se já configurado:**
- Mostrar configuração atual (valores REAIS do arquivo)
- Oferecer opções: Validar | Reconfigurar | Ativar Loaders | Sair
- Se escolher validar → ir para MODO VALIDATE
- Se escolher reconfigurar → continuar wizard
- Se escolher ativar → ir para Passo 9
- Se escolher sair → finalizar

**Se não configurado:**
- Continuar para Passo 2

### Passo 2: Análise de Ambiente

**2.1 Detectar Node.js**
```bash
node --version  # Verificar v18+
```

**2.2 Detectar Package Manager**
```bash
npm --version 2>/dev/null || pnpm --version 2>/dev/null || yarn --version 2>/dev/null
```

**2.3 Detectar Git**
```bash
git --version
```

**2.4 Detectar IDEs Instaladas**

Verificar existência de:
- `~/.cursor/` → Cursor IDE
- `~/.windsurf/` → Windsurf IDE  
- `~/.claude/` ou `~/.config/claude/` → Claude Code

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Análise de Ambiente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ambiente de Desenvolvimento:
  ✅ Node.js v22.14.0
  ✅ npm 11.1.0
  ✅ Git 2.43.0

IDEs Detectadas:
  ✅ Cursor (/home/user/.cursor)
  ✅ Windsurf (/home/user/.windsurf)
```

### Passo 3: Análise de Projeto

**3.1 Detectar Framework**

Verificar `package.json` para:
- `next` → Next.js
- `react` → React
- `vue` → Vue.js
- `@angular/core` → Angular
- `svelte` → Svelte
- `express` → Express
- `fastify` → Fastify
- `nestjs` → NestJS

**3.2 Detectar Stack**

- Se existe `package.json` → JavaScript/TypeScript
- Se existe `requirements.txt` ou `pyproject.toml` → Python
- Se existe `Gemfile` → Ruby

**3.3 Detectar Monorepo**

- `nx.json` → NX
- `lerna.json` → Lerna
- `pnpm-workspace.yaml` → pnpm workspaces

**3.4 Detectar CI/CD**

- `.github/workflows/` → GitHub Actions
- `.gitlab-ci.yml` → GitLab CI
- `azure-pipelines.yml` → Azure Pipelines
- `.circleci/config.yml` → Circle CI

**3.5 Detectar Docker**

- `Dockerfile` existe
- `docker-compose.yml` existe

**3.6 Inferir Tipo de Projeto**

**IMPORTANTE:** Se `.onion-config.yml` já existe, usar o valor de `project.type` dele!

**Lógica de inferência (apenas se NÃO houver config):**
- Se monorepo detectado (nx.json, lerna.json, pnpm-workspace.yaml) → **enterprise**
- Se LICENSE com MIT/Apache/GPL → **open-source**
- Se múltiplas referências a "cliente" ou "projeto" → **agency**
- Senão → **startup** (default)

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Análise de Projeto
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Projeto Detectado:
  Nome: onion-v4
  Tipo: enterprise (inferido: monorepo NX detectado)
  Framework: React, Node.js
  Stack: JavaScript/TypeScript

Características:
  ✅ Monorepo (NX)
  ✅ CI/CD configurado (GitHub Actions)
  ❌ Docker
  ✅ Múltiplos pacotes
```

### Passo 4: Sugestões Inteligentes de Contextos

**Regras de Sugestão:**

**Sempre Recomendar:**
- `business` - Gestão de produto, estratégia e roadmap
- `technical` - Desenvolvimento, arquitetura e documentação técnica

**Baseado em Tipo:**

| Tipo | Contextos Sugeridos |
|------|---------------------|
| **startup** | customer-success (foco em crescimento) |
| **enterprise** | team (workflows colaborativos) |
| **open-source** | community (gestão de comunidade) |
| **agency** | team (múltiplos projetos/clientes) |

**Baseado em Características:**

| Característica | Contexto Sugerido | Motivo |
|----------------|-------------------|--------|
| Monorepo | architecture | Documentação arquitetural crucial |
| CI/CD ou Docker | devops | Infraestrutura detectada |
| Múltiplas equipes | team | Colaboração necessária |

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Contextos Sugeridos para seu Projeto
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Business Context (recomendado)
     Gestão de produto, estratégia e roadmap

  ✅ Technical Context (recomendado)
     Desenvolvimento, arquitetura e documentação técnica

  ✅ Team Collaboration Context (recomendado)
     Projetos enterprise precisam de workflows colaborativos

  ✅ DevOps Context (recomendado)
     Detectamos CI/CD (GitHub Actions) e Docker

  ✅ Architecture Context (recomendado)
     Monorepos requerem documentação arquitetural detalhada
```

### Passo 5: Wizard Interativo

**5.1 Confirmar Tipo de Projeto**

**Se existe configuração:**
```
📋 Configuração Atual:
  Tipo: [VALOR REAL DO .onion-config.yml]

? O tipo está correto? (Y/n)
```

**Se NÃO existe configuração:**
```
? Detectamos um projeto [TIPO INFERIDO]. Está correto? (Y/n)
```

Se não:
```
? Selecione o tipo de projeto:
  🚀 Startup - Produto em desenvolvimento rápido
  🏢 Enterprise - Empresa com múltiplas equipes
  📖 Open Source - Projeto de código aberto
  🎨 Agency - Agência desenvolvendo para clientes
  ⚙️  Custom - Configuração personalizada
```

**5.2 Selecionar Contextos**

```
? Selecione os contextos a ativar: (Use setas e espaço)
 ◉ Business Context (recomendado)
 ◉ Technical Context (recomendado)
 ◉ Team Collaboration Context (recomendado)
 ◉ DevOps Context (recomendado)
 ◉ Architecture Context (recomendado)
 ◯ Customer Success Context
 ◯ Community Context
```

**VALIDAÇÃO:** Mínimo 1 contexto deve ser selecionado.

**5.3 Selecionar IDEs**

```
🖥️  IDEs detectadas no sistema:
  ✅ Cursor (/home/user/.cursor)
  ✅ Windsurf (/home/user/.windsurf)

? Selecione as IDEs a configurar:
 ◉ Cursor (detectada)
 ◉ Windsurf (detectada)
 ◯ Claude Code
```

**VALIDAÇÃO:** Mínimo 1 IDE deve ser selecionada.

**5.4 Integrações (Opcional)**

```
? Deseja configurar integrações externas (ClickUp, GitHub, etc)? (y/N)
```

Se sim:
```
? Selecione as integrações:
 ◯ ClickUp - Task Management
 ◯ GitHub - Version Control
 ◯ Slack - Notifications
```

**5.5 Resumo e Confirmação**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Resumo da Configuração
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Tipo: enterprise
  Contextos: business, technical, team, devops, architecture
  IDEs: cursor, windsurf
  Integrações: clickup, github

? Confirma a configuração? (Y/n)
```

### Passo 6: Aplicar Configurações

**6.1 Criar/Atualizar `.onion-config.yml`**

```yaml
version: '4.0'
project:
  name: meu-projeto
  type: enterprise
contexts:
  - business
  - technical
  - team
  - devops
  - architecture
ides:
  - cursor
  - windsurf
integrations:
  clickup:
    enabled: true
  github:
    enabled: true
```

**6.2 Criar Estrutura de Diretórios**

```bash
mkdir -p .onion/contexts
mkdir -p .onion/ide
```

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Aplicando Configurações
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ .onion-config.yml atualizado
  ✅ Diretórios criados
```

### Passo 7: Gerar IDE Loaders

Para cada IDE selecionada, gerar loader apropriado:

**7.1 Cursor Loader**

Criar `.onion/ide/cursor/onion-loader.js` com funcionalidades:
- Discovery de recursos (.onion/)
- Sincronização para .cursor/
- Geração de .cursorrules
- File watcher

**7.2 Windsurf Loader**

Criar `.onion/ide/windsurf/onion-bridge.ts` e `windsurf.config.yml`

**7.3 Claude Code Loader**

Criar `.onion/ide/claude-code/onion-adapter.py` e `claude.config.json`

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Gerando IDE Loaders
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✔ Created cursor loader
✔ Created windsurf loader
✔ Loaders gerados com sucesso!
```

### Passo 8: Validação Final

Executar validação completa (ver MODO VALIDATE).

Se houver problemas não críticos:
- Listar problemas
- Oferecer correções automáticas
- Aplicar se usuário aceitar

### Passo 9: Ativação de Loaders

**IMPORTANTE:** Verificar dependências ANTES de executar!

**9.1 Verificar dependências do loader**
```bash
# Verificar se package.json existe em .onion/ ou raiz
ls -la .onion/package.json package.json

# Se .onion/package.json não existir, criar
if [ ! -f .onion/package.json ]; then
  cat > .onion/package.json << 'EOF'
{
  "name": "@onion/loaders",
  "version": "4.0.0",
  "private": true,
  "description": "Onion System IDE Loaders",
  "dependencies": {
    "yaml": "^2.3.4"
  }
}
EOF
  
  # Instalar dependências
  cd .onion && npm install && cd ..
fi
```

**9.2 Ativar Cursor Loader**
```bash
# Executar loader
node .onion/ide/cursor/onion-loader.js
```

Verificar:
- `.cursorrules` gerado (pode estar em `.cursor/.cursorrules` ou raiz)
- Symlinks criados em `.cursor/`

**TRATAMENTO DE ERROS:**
- Se erro "Cannot find module 'yaml'" → instalar dependências (ver 9.1)
- Se erro de path → verificar se `.onion-config.yml` existe
- Se erro de permissão → verificar permissões de escrita

**9.3 Ativar Windsurf Loader**

Verificar se existe TypeScript/ts-node antes de compilar.

**9.4 Ativar Claude Loader**

Verificar se existe Python antes de executar adapter.

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Ativação
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Ativando IDE loaders...

  ✅ cursor ativado
  ✅ windsurf ativado
```

### Passo 10: Testes Finais

Testar se loaders estão funcionando:

**Cursor:**
- ✅ `.cursorrules` existe
- ✅ Symlinks em `.cursor/` existem

**Windsurf:**
- ✅ `windsurf.config.yml` existe

**Claude:**
- ✅ `claude.config.json` existe

**Output:**
```
  ✅ cursor: .cursorrules gerado
  ✅ windsurf: windsurf.config.yml gerado
```

### Passo 11: Sugestões de Melhoria

Analisar projeto e sugerir melhorias:

**Sugestões por Característica:**

- Monorepo detectado → "Considere adicionar contexto Architecture"
- CI/CD + Docker → "Adicione contexto DevOps para workflows de infra"
- Múltiplas equipes → "Contexto Team ajuda em colaboração"

**Output (se houver sugestões):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Sugestões de Melhoria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Contexto Architecture
     Monorepos se beneficiam de documentação arquitetural

? Aplicar sugestões? (y/N)
```

### Passo 12: Próximos Passos

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Setup Concluído com Sucesso!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Próximos Passos:

Cursor:
  1. Recarregue o Cursor (Ctrl+Shift+P → "Reload Window")
  2. Digite @ para ver agentes disponíveis
  3. Digite / para ver comandos disponíveis

Windsurf:
  1. Reabra o Windsurf para carregar configurações
  2. Confira o arquivo windsurf.config.yml

🔧 Comandos Úteis:

  /onion/validate             Validar configuração
  /onion/setup reconfigure    Ajustar configurações
  /onion/add-context          Adicionar novo contexto
  /onion/add-ide              Adicionar nova IDE
```

---

## 📋 MODO VALIDATE

Executar apenas validação sem alterações.

### Passo 1: Validação de Ambiente

**Verificar:**
- ✅ Node.js v18+ instalado
- ✅ Package manager disponível
- ✅ Git instalado

**Output:**
```
Ambiente de Desenvolvimento:
  ✅ Ambiente válido
```

### Passo 2: Validação de Projeto

**Verificar:**
- ✅ `.onion-config.yml` existe e é válido (YAML válido)
- ✅ Campos obrigatórios: version, project, contexts, ides
- ✅ Diretórios `.onion/` existem

**Output:**
```
Configuração do Projeto:
  ✅ Configuração válida
  ⚠️  2 avisos
```

### Passo 3: Validação de IDEs

Para cada IDE em `.onion-config.yml`:

**Cursor:**
- ✅ Loader `.onion/ide/cursor/onion-loader.js` existe
- ⚠️ `.cursorrules` não encontrado (será gerado na ativação)
- ⚠️ `.cursor/` não encontrado (symlinks serão criados na ativação)

**Windsurf:**
- ✅ Bridge `.onion/ide/windsurf/onion-bridge.ts` existe
- ⚠️ `windsurf.config.yml` não encontrado

**Claude:**
- ✅ Adapter `.onion/ide/claude-code/onion-adapter.py` existe
- ⚠️ `claude.config.json` não encontrado

**Output:**
```
Integração com IDEs:
  ❌ Problemas nas IDEs (1)
```

### Passo 4: Relatório de Validação

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Relatório de Validação
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ambiente de Desenvolvimento:
  ✅ Ambiente válido

Configuração do Projeto:
  ✅ Configuração válida
  ⚠️  2 avisos

Integração com IDEs:
  ❌ Problemas nas IDEs (1 erro)

⚠️  Projeto com problemas. Veja detalhes abaixo.
```

### Passo 5: Listar Problemas

**Erros Críticos:**
```
❌ Erros de IDE:

  1. Loader para cursor não encontrado em .onion/ide/cursor
```

**Avisos:**
```
⚠️  Avisos de Configuração:

  1. Campo "project.name" não definido
  2. Diretório .onion/contexts/ não encontrado
```

### Passo 6: Oferecer Correções

Se houver erros que podem ser corrigidos automaticamente:

```
🔧 Correções Disponíveis:

  1. Gerar loader para cursor
     Será gerado loader em .onion/ide/cursor/

  2. Criar diretórios faltantes
     Serão criados: .onion/contexts/, .onion/ide/

? Deseja aplicar as correções automáticas? (Y/n)
```

Se aceitar:
- Aplicar correções
- Re-validar
- Mostrar novo resultado

---

## 📋 MODO RECONFIGURE

Reconfiguração guiada de projeto existente.

### Passo 1: Carregar Configuração Atual

```bash
cat .onion-config.yml
```

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️  Reconfiguração do Onion System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Configuração atual:
version: '4.0'
project:
  type: startup
  name: meu-projeto
contexts:
  - business
  - technical
ides:
  - cursor
integrations: {}
```

### Passo 2: Selecionar o que Reconfigurar

```
? O que deseja reconfigurar:
 ◯ Tipo de projeto
 ◉ Contextos
 ◉ IDEs
 ◯ Integrações
```

### Passo 3: Executar Wizard Parcial

Para cada item selecionado:
- Executar seção correspondente do wizard completo
- Manter valores não selecionados

### Passo 4: Aplicar Nova Configuração

Salvar `.onion-config.yml` atualizado e regenerar loaders se necessário.

---

## 📤 Output Esperado

**Wizard Completo:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Setup Concluído com Sucesso!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Configurado:
  • Tipo: enterprise
  • Contextos: 5 (business, technical, team, devops, architecture)
  • IDEs: 2 (cursor, windsurf)
  • Loaders: ativados e testados

📋 Próximos Passos:
  1. Recarregue sua IDE
  2. Digite @ para ver agentes
  3. Digite / para ver comandos

🔧 Comandos úteis:
  /onion/validate
  /onion/setup reconfigure
```

**Validação:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Relatório de Validação
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Ambiente: Válido
✅ Projeto: Válido
❌ IDEs: 1 erro, 2 avisos

Problemas encontrados e correções oferecidas.
```

## 🔗 Referências

**SEMPRE consultar ANTES de executar:**

### Documentação Principal
- `docs/onion/getting-started.md` - Como começar
- `docs/onion/commands-guide.md` - Guia de comandos
- `docs/onion/agents-reference.md` - Guia de agentes
- `docs/onion/ide-integration-complete.md` - Integração IDEs completa
- `docs/onion/comando-onion-setup.md` - Este comando (guia de usuário)

### Knowledge Bases
**Conceitos:**
- `docs/knowbase/concepts/ai-agent-design-patterns.md`
- `docs/knowbase/concepts/context-window-optimization.md`
- `docs/knowbase/concepts/configuration-management.md`
- `docs/knowbase/concepts/spec-as-code-strategy.md`

**Frameworks:**
- `docs/knowbase/frameworks/onion-multi-context-orchestrator-vision.md`
- `docs/knowbase/frameworks/onion-ide-integration-strategy.md`
- `docs/knowbase/frameworks/onion-complete-cycle-understanding.md`

### Especificações Técnicas
- `docs/plans/onion-v4-epic.md` - Epic completo
- `docs/plans/tasks/fase-05-ide-loaders.md` - IDE Loaders (Fase 5)
- `packages/onion-cli/README.md` - CLI Reference

## ⚠️ Notas Importantes

**Contexto e Documentação:**
- **SEMPRE ler os arquivos de referência** listados na seção 📚 Contexto Necessário ANTES de iniciar
- Carregar knowledge bases relevantes para decisões informadas
- Consultar documentação Onion para entender padrões e convenções

**Detecção Automática:**
- Sempre executar análise de ambiente e projeto primeiro
- **NÃO assumir valores** - sempre detectar ou ler da configuração existente
- Se `.onion-config.yml` existe, **USAR os valores reais** do arquivo
- Nunca fixar tipo de projeto - sempre inferir ou perguntar

**Sugestões Inteligentes:**
- Baseadas em tipo de projeto + características detectadas
- Sempre explicar o motivo de cada sugestão
- Pré-selecionar recomendações mas permitir mudanças

**Validação:**
- 3 camadas: Ambiente, Projeto, IDEs
- Distinguir erros críticos de avisos
- Sempre oferecer correções automáticas quando possível

**Experiência Zero-Config:**
- Usuário nunca deve ficar travado
- Sempre mostrar próximos passos claros
- Feedback visual constante (✅ ❌ ⚠️ 💡)

**Integração com IDE Loaders:**
- **Verificar dependências** antes de executar loaders
- Se `yaml` não estiver instalado, criar `.onion/package.json` e instalar
- Gerar loaders para IDEs selecionadas
- Ativar e testar funcionamento
- Garantir que tudo está operacional antes de finalizar

**Tratamento de Erros Comuns:**

| Erro | Causa | Solução |
|------|-------|---------|
| `Cannot find module 'yaml'` | Dependência faltando | Criar `.onion/package.json` e `npm install` |
| `.onion-config.yml not found` | Config não existe | Executar `onion init` primeiro |
| Path relativos incorretos | CWD errado | Sempre usar paths absolutos ou relativos à raiz |
| Tipo fixo em "monorepo" | Não leu config | Ler `.onion-config.yml` e usar valor real |
| Symlink errors (Windows) | Permissões | Avisar usuário, continuar sem symlinks |
