# @onion/cli

CLI para Sistema Onion - Multi-Context Development Orchestrator

## 🎯 Instalação

```bash
# Global
npm install -g @onion/cli

# Local (development)
cd packages/onion-cli
npm install
npm link
```

## 🚀 Uso

```bash
# Inicializar Sistema Onion
onion init

# Adicionar contexto
onion add context

# Adicionar IDE
onion add ide

# Migrar de v3
onion migrate

# Ajuda
onion help
```

## 📋 Comandos

| Comando | Descrição | Status |
|---------|-----------|--------|
| `onion init` | Wizard interativo para criar projeto | ✅ |
| `onion add <type>` | Adicionar contexto ou IDE | ✅ |
| `onion migrate` | Migrar de v3 para v4 | ✅ |
| `onion help` | Mostrar ajuda | ✅ |

**Nota:** Para configuração e validação pós-init, use o comando Cursor `/onion/setup`

## 🧙 Wizard `onion init`

O comando `onion init` executa um wizard de 4 passos:

1. **Project Type**: Monorepo, Single App, ou Library
2. **Contexts**: Selecionar contextos (business, technical, CS, etc)
3. **IDEs**: Detecção automática + seleção manual
4. **Integrations**: Task manager, transcription, etc

## 📚 Documentação

Veja documentação completa em [docs/onion/](../../docs/onion/)

---

**Versão**: 1.0.0  
**License**: MIT

