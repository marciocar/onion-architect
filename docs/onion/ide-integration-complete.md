# 🧅 Sistema Onion v4.0 - Integração Multi-IDE Completa

## 📋 Visão Geral

O Sistema Onion v4.0 suporta múltiplos IDEs através de **loaders especializados** que descobrem e integram recursos Onion (comandos, agentes, contextos) em cada ambiente de desenvolvimento.

### IDEs Suportados

| IDE | Loader | Status | Recursos |
|-----|--------|--------|----------|
| **Cursor** | JavaScript | ✅ Completo | Symlinks, `.cursorrules`, Watch |
| **Windsurf** | TypeScript | ✅ Completo | Bridge TS, `windsurf.config.yml` |
| **Claude Code** | Python | ✅ Completo | Adapter Python, `claude.config.json`, `CLAUDE.md` |

### Arquitetura

```
.onion/
├── contexts/              # Contextos do projeto
│   ├── business/
│   ├── technical/
│   └── ...
├── core/                 # Recursos core
│   ├── commands/
│   └── agents/
└── ide/                  # Loaders por IDE
    ├── cursor/
    │   ├── onion-loader.js
    │   └── README.md
    ├── windsurf/
    │   ├── onion-bridge.ts
    │   └── README.md
    └── claude/
        ├── onion-adapter.py
        └── README.md
```

---

## 🚀 Instalação por IDE

### Cursor IDE

#### Pré-requisitos

- Node.js 18+ instalado
- Cursor IDE instalado
- Projeto Onion inicializado (`onion init`)

#### Instalação Automática

```bash
# Durante onion init, selecione "cursor" como IDE
onion init

# Ou adicione depois
onion add cursor
```

#### Instalação Manual

1. **Gerar loader:**
   ```bash
   cd seu-projeto
   node .onion/ide/cursor/onion-loader.js
   ```

2. **Verificar symlinks:**
   ```bash
   ls -la .cursor/
   # Deve mostrar symlinks para .onion/contexts, .onion/core, etc.
   ```

3. **Verificar `.cursorrules`:**
   ```bash
   cat .cursorrules
   # Deve mostrar regras geradas automaticamente
   ```

#### Como Funciona

- **Symlinks**: Cria links simbólicos de `.onion/` → `.cursor/` para descoberta automática
- **`.cursorrules`**: Gera arquivo de regras com todos os comandos e agentes disponíveis
- **Watch**: Monitora mudanças e atualiza automaticamente (opcional)

#### Verificação

1. Abra o Cursor IDE no projeto
2. Digite `/` no chat para ver comandos disponíveis
3. Digite `@` para ver agentes disponíveis
4. Comandos devem aparecer como `/business/spec`, `/technical/debug`, etc.

---

### Windsurf IDE

#### Pré-requisitos

- Node.js 18+ instalado
- TypeScript instalado (`npm install -g typescript`)
- Windsurf IDE instalado
- Projeto Onion inicializado

#### Instalação Automática

```bash
# Durante onion init, selecione "windsurf" como IDE
onion init

# Ou adicione depois
onion add windsurf
```

#### Instalação Manual

1. **Gerar bridge:**
   ```bash
   cd seu-projeto
   npx ts-node .onion/ide/windsurf/onion-bridge.ts
   ```

2. **Verificar configuração:**
   ```bash
   cat windsurf.config.yml
   # Deve mostrar configuração com comandos e agentes
   ```

#### Como Funciona

- **Bridge TypeScript**: Classe `WindsurfOnionBridge` que descobre recursos
- **`windsurf.config.yml`**: Configuração YAML na raiz com todos os recursos mapeados
- **Descoberta**: Windsurf lê o config e disponibiliza comandos/agentes

#### Verificação

1. Abra o Windsurf IDE no projeto
2. Verifique se `windsurf.config.yml` está na raiz
3. Comandos devem aparecer no autocomplete do Windsurf
4. Agentes devem estar disponíveis via `@nome-agente`

---

### Claude Code

#### Pré-requisitos

- Python 3.7+ instalado
- PyYAML instalado (`pip install pyyaml`) - opcional mas recomendado
- Claude Code instalado
- Projeto Onion inicializado

#### Instalação Automática

```bash
# Durante onion init, selecione "claude-code" como IDE
onion init

# Ou adicione depois
onion add claude-code
```

#### Instalação Manual

1. **Gerar adapter:**
   ```bash
   cd seu-projeto
   python3 .onion/ide/claude/onion-adapter.py
   ```

2. **Verificar arquivos gerados:**
   ```bash
   ls -la claude.config.json CLAUDE.md
   # Ambos devem existir na raiz do projeto
   ```

#### Como Funciona

- **Adapter Python**: Classe `ClaudeOnionAdapter` que descobre recursos
- **`claude.config.json`**: Configuração JSON na raiz com todos os recursos
- **`CLAUDE.md`**: Instruções para Claude Code sobre como usar o Sistema Onion

#### Verificação

1. Abra o Claude Code no projeto
2. Verifique se `claude.config.json` e `CLAUDE.md` existem na raiz
3. Claude Code deve ler esses arquivos e disponibilizar comandos
4. Use `/contexto/comando` para executar comandos
5. Use `@nome-agente` para invocar agentes

---

## 🔧 Troubleshooting Comum

### Cursor IDE

#### Problema: Comandos não aparecem

**Sintomas:**
- Digite `/` no Cursor mas não vê comandos
- Symlinks não existem em `.cursor/`

**Solução:**
```bash
# Regenerar loader
node .onion/ide/cursor/onion-loader.js

# Verificar symlinks
ls -la .cursor/

# Se symlinks não existem, criar manualmente:
ln -s ../.onion/contexts .cursor/contexts
ln -s ../.onion/core .cursor/core
```

#### Problema: `.cursorrules` não atualiza

**Sintomas:**
- Mudanças em comandos não refletem no `.cursorrules`

**Solução:**
```bash
# Regenerar .cursorrules
node .onion/ide/cursor/onion-loader.js

# Ou usar watch mode (se implementado)
node .onion/ide/cursor/onion-loader.js --watch
```

#### Problema: Erro "Cannot find module 'yaml'"

**Sintomas:**
- Erro ao executar loader

**Solução:**
```bash
npm install yaml
# Ou globalmente
npm install -g yaml
```

---

### Windsurf IDE

#### Problema: `windsurf.config.yml` não é gerado

**Sintomas:**
- Arquivo não existe na raiz
- Windsurf não encontra comandos

**Solução:**
```bash
# Regenerar bridge
npx ts-node .onion/ide/windsurf/onion-bridge.ts

# Verificar se arquivo foi criado
cat windsurf.config.yml
```

#### Problema: Erro TypeScript

**Sintomas:**
- Erros de compilação TypeScript
- Bridge não executa

**Solução:**
```bash
# Instalar TypeScript
npm install -g typescript

# Verificar sintaxe
npx tsc --noEmit .onion/ide/windsurf/onion-bridge.ts
```

#### Problema: Comandos não aparecem no Windsurf

**Sintomas:**
- Config existe mas comandos não aparecem

**Solução:**
1. Verificar formato YAML:
   ```bash
   # Validar YAML
   python3 -c "import yaml; yaml.safe_load(open('windsurf.config.yml'))"
   ```

2. Reiniciar Windsurf IDE
3. Verificar se Windsurf está lendo o config da raiz

---

### Claude Code

#### Problema: `claude.config.json` não é gerado

**Sintomas:**
- Arquivo não existe na raiz
- Claude Code não encontra comandos

**Solução:**
```bash
# Regenerar adapter
python3 .onion/ide/claude/onion-adapter.py

# Verificar se arquivo foi criado
cat claude.config.json
```

#### Problema: Erro "PyYAML not installed"

**Sintomas:**
- Warning sobre PyYAML
- Funcionalidade limitada

**Solução:**
```bash
# Instalar PyYAML
pip install pyyaml

# Ou com pip3
pip3 install pyyaml
```

#### Problema: `CLAUDE.md` não é gerado

**Sintomas:**
- Arquivo não existe na raiz

**Solução:**
```bash
# Regenerar adapter (gera ambos os arquivos)
python3 .onion/ide/claude/onion-adapter.py
```

#### Problema: Claude Code não lê configuração

**Sintomas:**
- Arquivos existem mas Claude Code não usa

**Solução:**
1. Verificar se arquivos estão na raiz do projeto
2. Verificar formato JSON:
   ```bash
   python3 -c "import json; json.load(open('claude.config.json'))"
   ```
3. Reiniciar Claude Code
4. Verificar logs do Claude Code para erros

---

## 📊 Comparação de Recursos por IDE

| Recurso | Cursor | Windsurf | Claude Code |
|---------|--------|----------|-------------|
| **Descoberta Automática** | ✅ Symlinks | ✅ Config YAML | ✅ Config JSON |
| **Watch de Mudanças** | ✅ (opcional) | ❌ | ❌ |
| **Regras Customizadas** | ✅ `.cursorrules` | ✅ `windsurf.config.yml` | ✅ `CLAUDE.md` |
| **Suporte a Contextos** | ✅ | ✅ | ✅ |
| **Suporte a Níveis** | ✅ | ✅ | ✅ |
| **Suporte a Agentes** | ✅ | ✅ | ✅ |
| **Suporte a Core** | ✅ | ✅ | ✅ |
| **Geração Automática** | ✅ | ✅ | ✅ |
| **Regeneração Manual** | ✅ | ✅ | ✅ |

---

## 🔄 Fluxo de Trabalho

### Inicialização de Projeto

```bash
# 1. Inicializar projeto Onion
onion init

# 2. Selecionar IDEs durante init
# Ou adicionar depois:
onion add cursor
onion add windsurf
onion add claude-code

# 3. Verificar loaders gerados
ls -la .onion/ide/
```

### Adicionar Novo IDE

```bash
# Adicionar suporte a novo IDE
onion add <ide-name>

# Loader será gerado automaticamente
```

### Atualizar Recursos

```bash
# Quando adicionar novos comandos/agentes:

# Cursor: Regenerar symlinks e .cursorrules
node .onion/ide/cursor/onion-loader.js

# Windsurf: Regenerar config
npx ts-node .onion/ide/windsurf/onion-bridge.ts

# Claude: Regenerar config e MD
python3 .onion/ide/claude/onion-adapter.py
```

---

## 📚 Documentação Adicional

- [Instalação do Sistema Onion](./INSTALLATION.md)
- [Arquitetura de Loaders](./ide-loaders-architecture.md)
- [Guia de Comandos](../commands/README.md)
- [Guia de Agentes](../agents/README.md)

---

## 🆘 Suporte

Se encontrar problemas não cobertos neste guia:

1. Verifique logs do loader específico
2. Consulte README do loader em `.onion/ide/<ide>/README.md`
3. Abra issue no repositório do projeto
4. Consulte documentação oficial do IDE

---

**Última atualização**: 2025-01-XX  
**Versão**: 4.0.0-beta.1  
**Mantido por**: Sistema Onion
