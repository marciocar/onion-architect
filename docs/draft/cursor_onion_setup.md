# Onion setup
_Exported on 1/1/2026 at 14:46:24 GMT-3 from Cursor (2.3.18)_

---

**User**

/onion/setup 

--- Cursor Command: onion/setup.md ---
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

```bash
if [ -f .onion-config.yml ]; then
  echo "🔍 Projeto já configurado detectado"
  # Perguntar o que fazer
fi
```

**Se já configurado:**
- Oferecer opções: Validar | Reconfigurar | Sair
- Se escolher validar → ir para MODO VALIDATE
- Se escolher reconfigurar → continuar wizard
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

Lógica de inferência:
- Se monorepo OU múltiplas equipes → **enterprise**
- Se LICENSE com MIT/Apache → **open-source**
- Senão → **startup** (default)

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Análise de Projeto
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Projeto Detectado:
  Nome: meu-projeto
  Tipo: enterprise
  Framework: Next.js
  Stack: JavaScript/TypeScript

Características:
  ✅ Monorepo (NX)
  ✅ CI/CD configurado (GitHub Actions)
  ✅ Docker
  ✅ Múltiplas equipes
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

```
? Detectamos um projeto enterprise. Está correto? (Y/n)
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

**9.1 Ativar Cursor Loader**
```bash
node .onion/ide/cursor/onion-loader.js
```

Verificar:
- `.cursorrules` gerado
- Symlinks criados em `.cursor/`

**9.2 Ativar Windsurf Loader**

Compilar bridge TypeScript (se disponível).

**9.3 Ativar Claude Loader**

Testar adapter Python (se disponível).

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

- Documentação: `docs/onion/comando-onion-setup.md`
- Spec Técnica: `docs/plans/tasks/comando-onion-setup.md`
- CLI Equivalente: `packages/onion-cli/src/commands/setup.js`

## ⚠️ Notas Importantes

**Detecção Automática:**
- Sempre executar análise de ambiente e projeto primeiro
- Usar detecções para gerar sugestões personalizadas
- Nunca assumir configuração, sempre detectar

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
- Gerar loaders para IDEs selecionadas
- Ativar e testar funcionamento
- Garantir que tudo está operacional antes de finalizar

--- End Command ---

---

**Cursor**

# 🧅 Setup do Onion - Wizard Inteligente

Iniciando wizard de configuração e ativação do Onion v4...

Perfeito! Detectei que você já tem o **Onion System v4 configurado**. Vou executar o setup no modo **wizard** com validação completa.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 **Projeto Já Configurado Detectado**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Encontrei uma instalação existente do Onion v4. Vou fazer uma **validação completa** e verificar se tudo está funcionando corretamente.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧅 Setup do Onion - Wizard Inteligente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🔍 Projeto Já Configurado Detectado

Encontrei uma configuração existente do Onion v4 no projeto!

**Configuração Atual:**
- **Version:** 4.0.0
- **Tipo de Projeto:** monorepo
- **Contextos Ativos:** business, technical
- **IDEs Configuradas:** cursor
- **Integrações:** Asana (task manager), Whisper Local (transcription)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Análise de Ambiente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Ambiente de Desenvolvimento:**
- ✅ Node.js v22.14.0
- ✅ pnpm 10.22.0
- ✅ Git 2.43.0

**IDEs Detectadas no Sistema:**
- ✅ Cursor (~/.cursor)
- ✅ Windsurf (~/.windsurf)
- ✅ Claude Code (~/.claude ou ~/.config/claude)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Análise de Estrutura do Projeto
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Status da Configuração:**
- ✅ `.onion-config.yml` existe
- ✅ Diretório `.onion/` criado
- ✅ Contextos configurados: business, technical
- ✅ IDE loader para Cursor existe (`.onion/ide/cursor/onion-loader.js`)
- ⚠️  **`.cursorrules` não encontrado** (precisa ser gerado)
- ✅ Diretórios `.cursor/` criados (agents, commands, rules)

---

## 🎯 O que deseja fazer?

**Opções disponíveis:**

1. **🔍 Validar** - Validar configuração atual e verificar problemas
2. **⚙️  Reconfigurar** - Ajustar contextos, IDEs ou integrações
3. **🚀 Ativar Loaders** - Ativar e testar loaders das IDEs (gerar .cursorrules, etc)
4. **➕ Adicionar IDE** - Configurar Windsurf ou Claude Code
5. **❌ Sair** - Manter como está

Qual opção você prefere? Recomendo começar com **Opção 3 (Ativar Loaders)** para gerar o `.cursorrules` e garantir que tudo está funcionando corretamente.

```plaintext

## 🔍 Projeto Já Configurado Detectado

Encontrei uma configuração existente do Onion v4 no projeto!

**Configuração Atual:**
- **Version:** 4.0.0
- **Tipo de Projeto:** monorepo
- **Contextos Ativos:** business, technical
- **IDEs Configuradas:** cursor
- **Integrações:** Asana (task manager), Whisper Local (transcription)

```

```plaintext

**Ambiente de Desenvolvimento:**
- ✅ Node.js v22.14.0
- ✅ pnpm 10.22.0
- ✅ Git 2.43.0

**IDEs Detectadas no Sistema:**
- ✅ Cursor (~/.cursor)
- ✅ Windsurf (~/.windsurf)
- ✅ Claude Code (~/.claude ou ~/.config/claude)

```

```plaintext

**Status da Configuração:**
- ✅ `.onion-config.yml` existe
- ✅ Diretório `.onion/` criado
- ✅ Contextos configurados: business, technical
- ✅ IDE loader para Cursor existe (`.onion/ide/cursor/onion-loader.js`)
- ⚠️  **`.cursorrules` não encontrado** (precisa ser gerado)
- ✅ Diretórios `.cursor/` criados (agents, commands, rules)

---

## 🎯 O que deseja fazer?

**Opções disponíveis:**

1. **🔍 Validar** - Validar configuração atual e verificar problemas
2. **⚙️  Reconfigurar** - Ajustar contextos, IDEs ou integrações
3. **🚀 Ativar Loaders** - Ativar e testar loaders das IDEs (gerar .cursorrules, etc)
4. **➕ Adicionar IDE** - Configurar Windsurf ou Claude Code
5. **❌ Sair** - Manter como está

Qual opção você prefere? Recomendo começar com **Opção 3 (Ativar Loaders)** para gerar o `.cursorrules` e garantir que tudo está funcionando corretamente.
```

---

**User**

3

---

**Cursor**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Ativando IDE Loaders
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Perfeito! Vou ativar os loaders das IDEs configuradas e garantir que tudo está operacional.

```plaintext
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Ativando IDE Loaders
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Detectei que o loader precisa de dependências. Vou verificar se existe um package.json no diretório `.onion/` ou instalar as dependências necessárias:

Identificado o problema! O loader precisa do módulo `yaml`, mas não há um `package.json` na raiz do projeto. Vou criar a estrutura necessária:

```json
{
  "name": "@onion/loaders",
  "version": "4.0.0",
  "private": true,
  "description": "Onion System IDE Loaders",
  "dependencies": {
    "yaml": "^2.3.4"
  }
}

```

Perfeito! Dependências instaladas. Agora vou atualizar o loader para usar o caminho correto do módulo e executá-lo:

```javascript
/**
 * Onion Loader for Cursor IDE
 * Auto-generated by @onion/cli v4.0.0-beta.1
 * 
 * Descobre e sincroniza recursos do Sistema Onion para o Cursor IDE
 */
const fs = require('fs');
const path = require('path');
const yaml = require('../../node_modules/yaml');

class CursorOnionLoader {
  constructor(projectRoot) {
    this.projectRoot = projectRoot || path.join(__dirname, '../../../');
    this.onionRoot = path.join(this.projectRoot, '.onion');
    this.cursorRoot = path.join(this.projectRoot, '.cursor');
    this.config = null;
    this.watchers = [];
  }
  
  /**
   * Carrega configuração .onion-config.yml
   */
  loadConfig() {
    const configPath = path.join(this.projectRoot, '.onion-config.yml');
    if (!fs.existsSync(configPath)) {
      throw new Error('❌ .onion-config.yml not found');
    }
    this.config = yaml.parse(fs.readFileSync(configPath, 'utf-8'));
    return this.config;
  }
  
  /**
   * Descobre contextos disponíveis
   */
  discoverContexts() {
    const contextsDir = path.join(this.onionRoot, 'contexts');
    if (!fs.existsSync(contextsDir)) {
      return [];
    }
    
    return fs.readdirSync(contextsDir).filter(name => {
      const contextPath = path.join(contextsDir, name);
      return fs.statSync(contextPath).isDirectory();
    });
  }
  
  /**
   * Descobre comandos por contexto e nível
   */
  discoverCommands(context, level = null) {
    const commands = [];
    const contextCommandsDir = path.join(this.onionRoot, 'contexts', context, 'commands');
    
    if (!fs.existsSync(contextCommandsDir)) {
      return commands;
    }
    
    // Se nível especificado, buscar apenas naquele nível
    if (level) {
      const levelDir = path.join(contextCommandsDir, level);
      if (fs.existsSync(levelDir)) {
        const files = fs.readdirSync(levelDir);
        files.forEach(file => {
          if (file.endsWith('.md')) {
            commands.push({
              name: file.replace('.md', ''),
              path: path.join(levelDir, file),
              context,
              level,
              relativePath: path.relative(this.projectRoot, path.join(levelDir, file))
            });
          }
        });
      }
    } else {
      // Buscar em todos os níveis
      const levels = ['starter', 'intermediate', 'advanced'];
      levels.forEach(lvl => {
        const levelDir = path.join(contextCommandsDir, lvl);
        if (fs.existsSync(levelDir)) {
          const files = fs.readdirSync(levelDir);
          files.forEach(file => {
            if (file.endsWith('.md')) {
              commands.push({
                name: file.replace('.md', ''),
                path: path.join(levelDir, file),
                context,
                level: lvl,
                relativePath: path.relative(this.projectRoot, path.join(levelDir, file))
              });
            }
          });
        }
      });
      
      // Comandos na raiz do contexto (ex: help.md)
      const rootFiles = fs.readdirSync(contextCommandsDir);
      rootFiles.forEach(file => {
        const filePath = path.join(contextCommandsDir, file);
        if (fs.statSync(filePath).isFile() && file.endsWith('.md')) {
          commands.push({
            name: file.replace('.md', ''),
            path: filePath,
            context,
            level: 'root',
            relativePath: path.relative(this.projectRoot, filePath)
          });
        }
      });
    }
    
    return commands;
  }
  
  /**
   * Descobre agentes por contexto
   */
  discoverAgents(context) {
    const agents = [];
    const contextAgentsDir = path.join(this.onionRoot, 'contexts', context, 'agents');
    
    if (!fs.existsSync(contextAgentsDir)) {
      return agents;
    }
    
    const files = fs.readdirSync(contextAgentsDir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        agents.push({
          name: file.replace('.md', ''),
          path: path.join(contextAgentsDir, file),
          context,
          relativePath: path.relative(this.projectRoot, path.join(contextAgentsDir, file))
        });
      }
    });
    
    return agents;
  }
  
  /**
   * Descobre comandos core
   */
  discoverCoreCommands() {
    const commands = [];
    const coreCommandsDir = path.join(this.onionRoot, 'core', 'commands');
    
    if (!fs.existsSync(coreCommandsDir)) {
      return commands;
    }
    
    const files = fs.readdirSync(coreCommandsDir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        commands.push({
          name: file.replace('.md', ''),
          path: path.join(coreCommandsDir, file),
          context: 'core',
          level: 'core',
          relativePath: path.relative(this.projectRoot, path.join(coreCommandsDir, file))
        });
      }
    });
    
    return commands;
  }
  
  /**
   * Descobre agentes core
   */
  discoverCoreAgents() {
    const agents = [];
    const coreAgentsDir = path.join(this.onionRoot, 'core', 'agents');
    
    if (!fs.existsSync(coreAgentsDir)) {
      return agents;
    }
    
    const files = fs.readdirSync(coreAgentsDir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        agents.push({
          name: file.replace('.md', ''),
          path: path.join(coreAgentsDir, file),
          context: 'core',
          relativePath: path.relative(this.projectRoot, path.join(coreAgentsDir, file))
        });
      }
    });
    
    return agents;
  }
  
  /**
   * Descobre todos os recursos
   */
  discover() {
    if (!this.config) {
      this.loadConfig();
    }
    
    const contexts = this.discoverContexts();
    const commands = [];
    const agents = [];
    
    // Comandos e agentes core
    commands.push(...this.discoverCoreCommands());
    agents.push(...this.discoverCoreAgents());
    
    // Comandos e agentes por contexto
    contexts.forEach(context => {
      commands.push(...this.discoverCommands(context));
      agents.push(...this.discoverAgents(context));
    });
    
    return {
      config: this.config,
      contexts,
      commands,
      agents
    };
  }
  
  /**
   * Cria symlink se não existir
   */
  createSymlink(target, linkPath) {
    const linkDir = path.dirname(linkPath);
    
    // Criar diretório se não existir
    if (!fs.existsSync(linkDir)) {
      fs.mkdirSync(linkDir, { recursive: true });
    }
    
    // Remover link existente se for diferente
    if (fs.existsSync(linkPath)) {
      try {
        const existingTarget = fs.readlinkSync(linkPath);
        if (existingTarget !== target) {
          fs.unlinkSync(linkPath);
        } else {
          return; // Já existe e aponta para o lugar certo
        }
      } catch (err) {
        // Não é symlink, remover arquivo
        fs.unlinkSync(linkPath);
      }
    }
    
    // Criar symlink
    try {
      fs.symlinkSync(target, linkPath, 'file');
    } catch (err) {
      // Em Windows, pode precisar de permissões administrativas
      console.warn('⚠️  Could not create symlink: ' + linkPath);
      console.warn('   Error: ' + err.message);
    }
  }
  
  /**
   * Sincroniza recursos para .cursor/
   */
  syncToCursor() {
    if (!fs.existsSync(this.cursorRoot)) {
      fs.mkdirSync(this.cursorRoot, { recursive: true });
    }
    
    const resources = this.discover();
    const commandsDir = path.join(this.cursorRoot, 'commands');
    const agentsDir = path.join(this.cursorRoot, 'agents');
    
    fs.mkdirSync(commandsDir, { recursive: true });
    fs.mkdirSync(agentsDir, { recursive: true });
    
    // Sincronizar comandos
    resources.commands.forEach(cmd => {
      const targetPath = path.resolve(this.projectRoot, cmd.relativePath);
      let linkPath;
      
      if (cmd.context === 'core') {
        linkPath = path.join(commandsDir, cmd.name + '.md');
      } else {
        const contextCommandsDir = path.join(commandsDir, cmd.context);
        fs.mkdirSync(contextCommandsDir, { recursive: true });
        linkPath = path.join(contextCommandsDir, cmd.name + '.md');
      }
      
      // Criar symlink relativo
      const relativeTarget = path.relative(path.dirname(linkPath), targetPath);
      this.createSymlink(relativeTarget, linkPath);
    });
    
    // Sincronizar agentes
    resources.agents.forEach(agent => {
      const targetPath = path.resolve(this.projectRoot, agent.relativePath);
      let linkPath;
      
      if (agent.context === 'core') {
        linkPath = path.join(agentsDir, agent.name + '.md');
      } else {
        const contextAgentsDir = path.join(agentsDir, agent.context);
        fs.mkdirSync(contextAgentsDir, { recursive: true });
        linkPath = path.join(contextAgentsDir, agent.name + '.md');
      }
      
      // Criar symlink relativo
      const relativeTarget = path.relative(path.dirname(linkPath), targetPath);
      this.createSymlink(relativeTarget, linkPath);
    });
    
    // Atualizar .cursorrules
    this.updateCursorRules(resources);
    
    return {
      commandsSynced: resources.commands.length,
      agentsSynced: resources.agents.length,
      contexts: resources.contexts
    };
  }
  
  /**
   * Atualiza .cursorrules com informações dos contextos
   */
  updateCursorRules(resources) {
    const cursorRulesPath = path.join(this.cursorRoot, '.cursorrules');
    
    let cursorRulesContent = '# Sistema Onion v4.0\n';
    cursorRulesContent += '# Auto-generated by @onion/cli\n\n';
    cursorRulesContent += 'Este projeto usa o Sistema Onion - Multi-Context Development Orchestrator.\n\n';
    cursorRulesContent += '## Estrutura\n\n';
    cursorRulesContent += '- **Comandos**: .cursor/commands/ (symlinks de .onion/)\n';
    cursorRulesContent += '- **Agentes**: .cursor/agents/ (symlinks de .onion/)\n';
    cursorRulesContent += '- **Fonte**: .onion/\n\n';
    cursorRulesContent += '## Contextos Disponíveis\n\n';
    
    resources.contexts.forEach(ctx => {
      cursorRulesContent += '- **' + ctx + '**: /' + ctx + '/*\n';
    });
    
    cursorRulesContent += '\n## Comandos Principais\n\n';
    
    resources.contexts.forEach(ctx => {
      const contextCommands = resources.commands.filter(c => c.context === ctx);
      const starterCommands = contextCommands.filter(c => c.level === 'starter');
      const ctxName = ctx.charAt(0).toUpperCase() + ctx.slice(1);
      
      cursorRulesContent += '### ' + ctxName + '\n';
      cursorRulesContent += '- /' + ctx + '/help - Ver comandos disponíveis\n';
      if (starterCommands.length > 0) {
        const cmdNames = starterCommands.slice(0, 3).map(c => '/' + ctx + '/' + c.name).join(', ');
        cursorRulesContent += '- Starter commands (' + starterCommands.length + '): ' + cmdNames + '\n';
      }
      cursorRulesContent += '\n';
    });
    
    cursorRulesContent += '## Core Commands\n\n';
    cursorRulesContent += '- /help - Help global do Sistema Onion\n';
    cursorRulesContent += '- /onion - Orquestrador principal\n\n';
    cursorRulesContent += '## Documentação\n\n';
    cursorRulesContent += 'Consulte .onion/README.md ou docs/onion/ para mais informações.\n\n';
    cursorRulesContent += '---\n\n';
    cursorRulesContent += '**Gerado por**: @onion/cli v4.0.0-beta.1\n';
    cursorRulesContent += '**Última atualização**: ' + new Date().toISOString() + '\n';
    
    fs.writeFileSync(cursorRulesPath, cursorRulesContent, 'utf-8');
  }
  
  /**
   * Watch para mudanças em .onion/
   */
  watch() {
    if (!fs.existsSync(this.onionRoot)) {
      return;
    }
    
    // Debounce para evitar múltiplas sincronizações
    let syncTimeout = null;
    const debouncedSync = () => {
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }
      syncTimeout = setTimeout(() => {
        try {
          this.syncToCursor();
          console.log('🔄 Onion resources synced to Cursor');
        } catch (err) {
          console.error('❌ Error syncing Onion resources:', err.message);
        }
      }, 1000); // 1 segundo de debounce
    };
    
    // Watch recursivo em .onion/
    const watchOptions = { recursive: true };
    
    try {
      const watcher = fs.watch(this.onionRoot, watchOptions, (eventType, filename) => {
        if (filename && (filename.endsWith('.md') || filename.includes('commands') || filename.includes('agents'))) {
          debouncedSync();
        }
      });
      
      this.watchers.push(watcher);
      
      // Watch também em .onion-config.yml
      const configWatcher = fs.watch(
        path.join(this.projectRoot, '.onion-config.yml'),
        (eventType) => {
          if (eventType === 'change') {
            this.loadConfig(); // Recarregar config
            debouncedSync();
          }
        }
      );
      
      this.watchers.push(configWatcher);
      
      console.log('👀 Watching .onion/ for changes...');
    } catch (err) {
      console.warn('⚠️  Could not start file watcher:', err.message);
      console.warn('   Changes will not be synced automatically');
    }
  }
  
  /**
   * Para watch
   */
  stopWatch() {
    this.watchers.forEach(watcher => watcher.close());
    this.watchers = [];
  }
}

// Singleton instance
let loaderInstance = null;

function getLoader(projectRoot) {
  if (!loaderInstance) {
    loaderInstance = new CursorOnionLoader(projectRoot);
  }
  return loaderInstance;
}

// Auto-sync na inicialização se executado diretamente
if (require.main === module) {
  const loader = getLoader();
  loader.syncToCursor();
  console.log('✅ Onion resources synced to Cursor');
  
  // Iniciar watch se --watch flag
  if (process.argv.includes('--watch')) {
    loader.watch();
    
    // Manter processo vivo
    process.on('SIGINT', () => {
      loader.stopWatch();
      process.exit(0);
    });
  }
}

module.exports = { CursorOnionLoader, getLoader };

```

Excelente! 🎉 Agora vou verificar se os arquivos foram gerados corretamente:

Ótimo! O `.cursorrules` foi gerado **dentro de `.cursor/`** (e não na raiz como esperado). Vou verificar o conteúdo e criar um symlink na raiz:

Perfeito! Agora vou fazer uma validação completa dos componentes:

Detectei que as rules estão em formato `.mdc`. Vou verificar o status completo e criar um relatório de testes:

Excelente! Agora vou verificar se há outras IDEs que poderiam ser configuradas e fazer uma análise de sugestões:

Perfeito! Agora vou gerar o relatório final completo:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Setup Concluído com Sucesso!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎉 Ativação do Onion System v4

O loader foi ativado com sucesso! Todos os componentes estão funcionando corretamente.

### 📊 Relatório de Ativação

**✅ Cursor IDE - ATIVO**
- `.cursorrules` gerado (39 linhas)
- Symlink criado na raiz do projeto
- 82 agentes sincronizados (11 categorias)
- 151 comandos sincronizados (14 categorias)
- 4 rules carregadas

**✅ Loader Funcional**
- Loader instalado em `.onion/ide/cursor/onion-loader.js`
- Dependências instaladas (yaml)
- Teste de execução: ✅ Sucesso

**✅ Estrutura do Projeto**
- Tipo: monorepo
- Contextos ativos: business, technical
- Integrações: Asana (task manager), Whisper Local (transcription)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Recursos Disponíveis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 🤖 Agentes (82 disponíveis)

**Categorias:**
- business - Agentes de negócio
- compliance - Conformidade e segurança
- deployment - Deploy e infraestrutura
- development - Desenvolvimento (Python, React, etc)
- git - Operações Git
- meta - Meta-agentes (Onion, etc)
- product - Gestão de produto
- research - Pesquisa e análise
- review - Code review
- technical - Agentes técnicos
- testing - Testes e QA

### 💻 Comandos (151 disponíveis)

**Principais Categorias:**
- `/business/*` - Gestão de negócio
- `/technical/*` - Desenvolvimento técnico
- `/engineer/*` - Fluxos de engenharia
- `/product/*` - Gestão de produto
- `/git/*` - Operações Git
- `/meta/*` - Meta-comandos
- `/onion/*` - Comandos Onion
- `/validate/*` - Validações

**Comandos Starter:**
- `/help` - Ajuda global
- `/onion/setup` - Este comando (setup)
- `/onion/validate` - Validar configuração
- `/business/estimate` - Estimativa de tarefas
- `/technical/docs` - Gerar documentação

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Sugestões de Melhoria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 🖥️  IDEs Adicionais Detectadas

Detectamos outras IDEs no seu sistema:

1. **✅ Windsurf** (~/.windsurf)
   - Status: Detectado mas NÃO configurado
   - Sugestão: Configure para usar Onion em outra IDE
   - Comando: `/onion/add-ide windsurf`

2. **✅ Claude Code** (~/.claude)
   - Status: Detectado mas NÃO configurado
   - Sugestão: Configure para usar Onion em outra IDE
   - Comando: `/onion/add-ide claude-code`

### 📊 Contextos Disponíveis

Você está usando apenas 2 contextos. Considere adicionar:

- **⚪ devops** - Ideal para CI/CD e infraestrutura
- **⚪ architecture** - Documentação arquitetural (recomendado para monorepos)
- **⚪ team** - Colaboração entre equipes
- **⚪ customer-success** - Gestão de clientes
- **⚪ community** - Projetos open source

**Adicionar contexto:** `/onion/add-context <nome>`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Próximos Passos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Para Cursor IDE:

1. **Recarregue o Cursor** para aplicar as mudanças:
   - `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
   - Digite: "Developer: Reload Window"
   - Ou simplesmente feche e reabra o Cursor

2. **Teste os recursos:**
   - Digite `@` para ver **agentes disponíveis**
   - Digite `/` para ver **comandos disponíveis**
   - Digite `/help` para ver **ajuda completa**

3. **Explore o sistema:**
   - `/business/estimate` - Estime tarefas
   - `/technical/docs` - Gere documentação
   - `@onion` - Fale com o orquestrador principal

### 🔧 Comandos Úteis

```bash
# Validar configuração
/onion/validate

# Reconfigurar projeto
/onion/setup reconfigure

# Adicionar nova IDE
/onion/add-ide <nome>

# Adicionar novo contexto
/onion/add-context <nome>

# Ver ajuda
/help
```

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Documentação
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- **README Principal:** `.onion/README.md`
- **Configuração:** `.onion-config.yml`
- **Documentação Onion:** `docs/onion/` (se existir)
- **Rules do Cursor:** `.cursor/rules/*.mdc`

---

**🎊 O Onion System v4 está pronto para uso!**

Recarregue o Cursor e comece a explorar os recursos disponíveis.

```plaintext
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Setup Concluído com Sucesso!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```plaintext
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Recursos Disponíveis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```plaintext
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Sugestões de Melhoria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```plaintext
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Próximos Passos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```shellscript
# Validar configuração
/onion/validate

# Reconfigurar projeto
/onion/setup reconfigure

# Adicionar nova IDE
/onion/add-ide <nome>

# Adicionar novo contexto
/onion/add-context <nome>

# Ver ajuda
/help
```

```plaintext
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Documentação
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

