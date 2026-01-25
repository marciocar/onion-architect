/**
 * Gerador de loaders por IDE
 */
import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'yaml';
import { logger } from '../utils/logger.js';

export interface LoaderConfig {
  contexts: string[];
  ides: string[];
}

export class LoadersGenerator {
  private projectRoot: string;
  private config: LoaderConfig;

  constructor(projectRoot: string, config: LoaderConfig) {
    this.projectRoot = projectRoot;
    this.config = config;
  }

  async generate(): Promise<void> {
    for (const ide of this.config.ides) {
      if (ide === 'universal') {
        await this.generateUniversalAgentsMd();
      } else {
        await this.generateIDELoader(ide);
        // Criar estrutura na raiz para o IDE reconhecer
        await this.createIDERootStructure(ide);
      }
    }
  }

  async generateIDELoader(ide: string): Promise<void> {
    logger.startSpinner(`Generating ${ide} loader...`);

    const loaderPath = path.join(this.projectRoot, '.onion', 'ide', ide);
    await fs.ensureDir(loaderPath);

    if (ide === 'cursor') {
      await this.generateCursorLoader(loaderPath);
    } else if (ide === 'windsurf') {
      await this.generateWindsurfLoader(loaderPath);
    } else if (ide === 'claude-code' || ide === 'claude') {
      await this.generateClaudeLoader(loaderPath);
    }

    logger.stopSpinner(true, `Created ${ide} loader`);
  }

  private async generateCursorLoader(loaderPath: string): Promise<void> {
    // Settings.json
    const settings = {
      onion: {
        enabled: true,
        root: '.onion',
        loader: '.onion/ide/cursor/onion-loader.js',
        version: '4.0.0-beta.1',
      },
    };

    await fs.writeJson(path.join(loaderPath, 'settings.json'), settings, { spaces: 2 });

    // Create a simple loader README
    const readme = `# Cursor IDE Loader

This loader syncs Onion resources to Cursor IDE.

## Usage

The loader automatically syncs commands and agents from \`.onion/\` to \`.cursor/\`.

## Manual Sync

Run: \`node .onion/ide/cursor/onion-loader.js\`
`;

    await fs.writeFile(path.join(loaderPath, 'README.md'), readme, 'utf-8');
  }

  private async generateWindsurfLoader(loaderPath: string): Promise<void> {
    // Gerar windsurf.config.yml inicial
    const windsurfConfig = {
      onion: {
        version: '4.0.0-beta.1',
        generated: new Date().toISOString(),
        contexts: this.config.contexts,
      },
    };

    const configPath = path.join(this.projectRoot, 'windsurf.config.yml');
    await fs.writeFile(configPath, yaml.stringify(windsurfConfig), 'utf-8');

    // README
    const readme = `# Windsurf IDE Integration

This loader generates windsurf.config.yml for Windsurf IDE.

## Files

- \`windsurf.config.yml\` - Configuration file (in project root)

## Usage

The config is auto-generated during \`onion init\` or \`onion add windsurf\`.
`;

    await fs.writeFile(path.join(loaderPath, 'README.md'), readme, 'utf-8');
  }

  private async generateClaudeLoader(loaderPath: string): Promise<void> {
    // Gerar claude.config.json inicial
    const claudeConfig = {
      onion: {
        version: '4.0.0-beta.1',
        generated: new Date().toISOString(),
        contexts: this.config.contexts,
      },
    };

    const configPath = path.join(this.projectRoot, 'claude.config.json');
    await fs.writeJson(configPath, claudeConfig, { spaces: 2 });

    // README
    const readme = `# Claude Code IDE Integration

This loader generates claude.config.json for Claude Code IDE.

## Files

- \`claude.config.json\` - Configuration file (in project root)

## Usage

The config is auto-generated during \`onion init\` or \`onion add claude-code\`.
`;

    await fs.writeFile(path.join(loaderPath, 'README.md'), readme, 'utf-8');
  }

  private async generateUniversalAgentsMd(): Promise<void> {
    logger.startSpinner('Generating universal AGENTS.md...');

    const agentsMdContent = `# Sistema Onion - Universal Agents

Este arquivo serve como fallback para IDEs que não possuem suporte nativo ao Sistema Onion.

## Comandos Disponíveis

### Core Commands
- \`/onion\` - Orquestrador principal
- \`/warm-up\` - Preparar contexto

${this.config.contexts
  .map(
    (ctx) => `
### ${ctx.charAt(0).toUpperCase() + ctx.slice(1)} Context
- \`/${ctx}/spec\` - Criar especificação
- \`/${ctx}/help\` - Ajuda do contexto
`
  )
  .join('')}

## Como Usar

Mencione os comandos acima no chat do seu IDE.

## Configuração

Este projeto usa Sistema Onion v4.0. Para melhor experiência, use:
- Cursor IDE
- Windsurf
- Claude Code

Ou acesse a documentação em \`.onion/README.md\`
`;

    const universalPath = path.join(this.projectRoot, '.onion', 'ide', 'universal');
    await fs.ensureDir(universalPath);

    await fs.writeFile(path.join(universalPath, 'AGENTS.md'), agentsMdContent, 'utf-8');

    logger.stopSpinner(true, 'Created universal AGENTS.md');
  }

  // Criar estrutura na raiz do projeto para o IDE reconhecer
  private async createIDERootStructure(ide: string): Promise<void> {
    if (ide === 'cursor') {
      await this.createCursorRootStructure();
    }
    // windsurf and claude create config files in root, already handled
  }

  private async createCursorRootStructure(): Promise<void> {
    logger.startSpinner('Creating .cursor/ structure...');

    const cursorRoot = path.join(this.projectRoot, '.cursor');
    await fs.ensureDir(cursorRoot);

    // Criar subpastas de comandos e agentes
    const commandsPath = path.join(cursorRoot, 'commands');
    const agentsPath = path.join(cursorRoot, 'agents');

    await fs.ensureDir(commandsPath);
    await fs.ensureDir(agentsPath);

    // Criar pastas por contexto
    for (const context of this.config.contexts) {
      await fs.ensureDir(path.join(commandsPath, context));
      await fs.ensureDir(path.join(agentsPath, context));

      // Criar comandos básicos
      await this.createStarterCommands(context, path.join(commandsPath, context));
    }

    // Criar .cursorrules básico
    const cursorRulesContent = `# Sistema Onion v4.0

Este projeto usa o Sistema Onion - Multi-Context Development Orchestrator.

## Estrutura

- **Comandos**: .cursor/commands/
- **Agentes**: .cursor/agents/
- **Fonte**: .onion/

## Contextos Disponíveis

${this.config.contexts.map((ctx) => `- **${ctx}**: /${ctx}/*`).join('\n')}

## Documentação

Consulte \`.onion/README.md\` para mais informações.

---

**Gerado por**: @onion/cli v4.0.0
`;

    await fs.writeFile(path.join(cursorRoot, '.cursorrules'), cursorRulesContent, 'utf-8');

    logger.stopSpinner(true, 'Created .cursor/ structure');
  }

  private async createStarterCommands(context: string, commandsPath: string): Promise<void> {
    // Help command
    const helpContent = `---
name: help
description: Ajuda do contexto ${context}
category: ${context}
version: "4.0.0"
---

# 📚 ${context.charAt(0).toUpperCase() + context.slice(1)} Context - Help

Comandos disponíveis neste contexto.

## 🟢 Starter Commands (essenciais)

- \`/${context}/help\` - Esta ajuda

## 📖 Documentação

Veja documentação completa em \`docs/${context}-context/\`

---

**Fonte**: .onion/contexts/${context}/commands/starter/help.md  
**Auto-gerado por**: @onion/cli
`;

    await fs.writeFile(path.join(commandsPath, 'help.md'), helpContent, 'utf-8');
  }
}

export default LoadersGenerator;
