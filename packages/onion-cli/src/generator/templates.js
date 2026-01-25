/**
 * Gerador de templates (comandos, agentes, etc)
 */
const fs = require('fs-extra');
const path = require('path');
const logger = require('../utils/logger');

class TemplatesGenerator {
  constructor(projectRoot, config) {
    this.projectRoot = projectRoot;
    this.config = config;
  }
  
  async generate() {
    await this.generateReadme();
    await this.generateCoreAgents();
    await this.generateStarterCommands();
  }
  
  async generateReadme() {
    logger.startSpinner('Generating README.md...');
    
    const readmeContent = `# Sistema Onion v3.0

Multi-Context Development Orchestrator

## 🎯 Quick Start

### Configuração

- **Project Type**: ${this.config.projectType}
- **Contexts**: ${this.config.contexts.join(', ')}
- **IDEs**: ${this.config.ides.join(', ')}

### Comandos Starter

${this.config.contexts.map(ctx => `
#### ${ctx.charAt(0).toUpperCase() + ctx.slice(1)} Context

\`\`\`bash
/${ctx}/spec "feature-name"    # Criar especificação
/${ctx}/help                    # Ajuda do contexto
\`\`\`
`).join('')}

## 📚 Documentação

- [Getting Started](docs/onion/getting-started.md)
- [Complete Cycle](docs/knowbase/frameworks/onion-complete-cycle-understanding.md)
- [IDE Integration](docs/knowbase/frameworks/onion-ide-integration-strategy.md)

## 🔧 CLI Commands

\`\`\`bash
onion add context <name>    # Adicionar novo contexto
onion add ide <name>        # Adicionar suporte a IDE
onion validate              # Validar estrutura
onion help                  # Ajuda
\`\`\`

---

**Última atualização**: ${new Date().toISOString().split('T')[0]}  
**Versão**: 3.0.0  
**Gerado por**: @onion/cli
`;
    
    await fs.writeFile(
      path.join(this.projectRoot, '.onion', 'README.md'),
      readmeContent,
      'utf-8'
    );
    
    logger.stopSpinner(true, 'Created .onion/README.md');
  }
  
  async generateCoreAgents() {
    logger.startSpinner('Generating core agents...');
    
    // Agente Onion principal
    const onionAgentContent = `---
name: onion
description: Orquestrador principal do Sistema Onion
model: sonnet
category: meta
version: "3.0.0"
---

# 🧅 Agente Onion - Orquestrador Principal

Orquestrador inteligente do Sistema Onion v3.0.

## 🎯 Responsabilidades

1. **Roteamento de Contextos**: Direcionar para o contexto apropriado
2. **Discovery**: Ajudar usuário a descobrir comandos
3. **Coordenação**: Orquestrar workflows cross-context

## 🔄 Fluxo

\`\`\`
Usuário → @onion → Analisa intenção → Roteia para contexto → Executa
\`\`\`

## 📋 Comandos Principais

${this.config.contexts.map(ctx => `- \`/${ctx}/*\``).join('\n')}
- \`/onion\`
- \`/warm-up\`

---

**Auto-gerado por @onion/cli**
`;
    
    await fs.writeFile(
      path.join(this.projectRoot, '.onion', 'core', 'agents', 'onion.md'),
      onionAgentContent,
      'utf-8'
    );
    
    logger.stopSpinner(true, 'Created core agents');
  }
  
  async generateStarterCommands() {
    for (const context of this.config.contexts) {
      await this.generateContextStarterCommands(context);
    }
  }
  
  async generateContextStarterCommands(context) {
    logger.startSpinner(`Generating ${context} starter commands...`);
    
    const starterPath = path.join(
      this.projectRoot,
      '.onion',
      'contexts',
      context,
      'commands',
      'starter'
    );
    
    // Comando help
    const helpContent = `---
name: help
description: Ajuda do contexto ${context}
category: ${context}
version: "3.0.0"
---

# 📚 ${context.charAt(0).toUpperCase() + context.slice(1)} Context - Help

Comandos disponíveis neste contexto.

## 🟢 Starter Commands (5 essenciais)

- \`/${context}/help\` - Esta ajuda

## 📖 Documentação

Veja documentação completa em \`docs/${context}-context/\`

---

**Auto-gerado por @onion/cli**
`;
    
    await fs.writeFile(
      path.join(starterPath, 'help.md'),
      helpContent,
      'utf-8'
    );
    
    logger.stopSpinner(true, `Created ${context} starter commands`);
  }
}

module.exports = TemplatesGenerator;

