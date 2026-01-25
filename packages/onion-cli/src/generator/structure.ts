/**
 * @fileoverview Structure Generator - Métodos atômicos e reutilizáveis
 * @module generator/structure
 *
 * Princípios:
 * - Métodos atômicos (1 responsabilidade cada)
 * - Reutilizáveis por init, add, migrate
 * - ES6 modules
 * - Minimal logging (caller decide)
 */

import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'yaml';

export interface ContextOptions {
  includeREADME?: boolean;
  includeConfig?: boolean;
  type?: string;
}

export interface IDELoaderConfig {
  contexts?: string[];
  [key: string]: unknown;
}

/**
 * Cria estrutura core completa (.onion/core/)
 */
export async function generateCoreStructure(projectRoot: string): Promise<void> {
  const onionRoot = path.join(projectRoot, '.onion');

  const corePaths = [
    'core/knowbase/concepts',
    'core/knowbase/frameworks',
    'core/knowbase/tools',
    'core/knowbase/learnings',
    'core/agents',
    'core/commands',
    'core/rules',
    'core/utils',
  ];

  for (const p of corePaths) {
    await fs.ensureDir(path.join(onionRoot, p));
  }
}

/**
 * Cria estrutura de um contexto específico
 */
export async function generateContextStructure(
  projectRoot: string,
  contextName: string,
  options: ContextOptions = {}
): Promise<void> {
  const onionRoot = path.join(projectRoot, '.onion');
  const contextRoot = path.join(onionRoot, 'contexts', contextName);

  // Estrutura base
  const basePaths = [
    'knowbase',
    'agents',
    'commands/starter',
    'commands/intermediate',
    'commands/advanced',
    'sessions',
  ];

  for (const p of basePaths) {
    await fs.ensureDir(path.join(contextRoot, p));
  }

  // README do contexto (opcional)
  if (options.includeREADME !== false) {
    await generateContextREADME(projectRoot, contextName);
  }

  // Config do contexto (opcional)
  if (options.includeConfig !== false) {
    await generateContextConfig(projectRoot, contextName, { type: options.type });
  }
}

/**
 * Cria README de contexto
 */
export async function generateContextREADME(
  projectRoot: string,
  contextName: string
): Promise<void> {
  const readmePath = path.join(projectRoot, '.onion/contexts', contextName, 'README.md');

  const content = `# ${capitalizeFirst(contextName)} Context

> **Onion v4.0** | Multi-Context Development Orchestrator

---

## 🎯 Sobre Este Contexto

O contexto **${contextName}** é dedicado a [descrever propósito].

## 🚀 Quick Start

### Comandos Starter (80% dos casos)

\`\`\`bash
/${contextName}/[comando-starter]
\`\`\`

### Ver todos os comandos

\`\`\`bash
/${contextName}/help
\`\`\`

---

**Versão**: 4.0.0  
**Criado**: ${new Date().toISOString().split('T')[0]}
`;

  await fs.writeFile(readmePath, content, 'utf-8');
}

/**
 * Cria config de contexto (.context-config.yml)
 */
export async function generateContextConfig(
  projectRoot: string,
  contextName: string,
  config: { type?: string; integrations?: Record<string, unknown> } = {}
): Promise<void> {
  const configPath = path.join(
    projectRoot,
    '.onion/contexts',
    contextName,
    '.context-config.yml'
  );

  const defaultConfig = {
    context: {
      name: contextName,
      version: '4.0.0',
      type: config.type || 'custom',
    },
    integrations: config.integrations || {},
  };

  await fs.writeFile(configPath, yaml.stringify(defaultConfig), 'utf-8');
}

/**
 * Cria comandos starter para um contexto
 */
export async function generateStarterCommands(
  projectRoot: string,
  contextName: string,
  contextType: string
): Promise<void> {
  const starterPath = path.join(
    projectRoot,
    '.onion/contexts',
    contextName,
    'commands/starter'
  );

  // Comandos básicos universais
  const starterCommands = [
    {
      name: 'help',
      description: `Show ${contextName} context help`,
      content: generateHelpCommandContent(contextName, contextType),
    },
    {
      name: 'warm-up',
      description: `Warm up ${contextName} context`,
      content: generateWarmUpCommandContent(contextName),
    },
  ];

  // Adicionar comandos específicos por tipo
  if (contextType === 'business') {
    starterCommands.push(
      {
        name: 'spec',
        description: 'Create product specification',
        content: generateBusinessSpecContent(),
      },
      {
        name: 'task',
        description: 'Create task with story points',
        content: generateBusinessTaskContent(),
      }
    );
  } else if (contextType === 'technical') {
    starterCommands.push(
      {
        name: 'plan',
        description: 'Create development plan',
        content: generateTechnicalPlanContent(),
      },
      {
        name: 'work',
        description: 'Continue work on feature',
        content: generateTechnicalWorkContent(),
      }
    );
  }

  // Criar arquivos
  for (const cmd of starterCommands) {
    const filePath = path.join(starterPath, `${cmd.name}.md`);
    await fs.writeFile(filePath, cmd.content, 'utf-8');
  }
}

/**
 * Gera estrutura de IDEs (.onion/ide/)
 */
export async function generateIDEStructure(
  projectRoot: string,
  ides: string[] = []
): Promise<void> {
  const idePath = path.join(projectRoot, '.onion/ide');
  await fs.ensureDir(idePath);

  // Universal fallback (sempre criar)
  await fs.ensureDir(path.join(idePath, 'universal'));

  // IDEs específicos
  for (const ide of ides) {
    if (ide !== 'universal') {
      await fs.ensureDir(path.join(idePath, ide));
    }
  }
}

/**
 * Gera loader para IDE específico
 */
export async function generateIDELoader(
  projectRoot: string,
  ideName: string,
  config: IDELoaderConfig = {}
): Promise<void> {
  const loaderPath = path.join(projectRoot, '.onion/ide', ideName);
  await fs.ensureDir(loaderPath);

  // Conteúdo do loader depende do IDE
  if (ideName === 'cursor') {
    await generateCursorLoader(projectRoot, config);
  } else if (ideName === 'windsurf') {
    await generateWindsurfLoader(projectRoot, config);
  } else if (ideName === 'claude') {
    await generateClaudeLoader(projectRoot, config);
  }
}

/**
 * Atualiza loader de IDE com novo contexto
 */
export async function updateIDELoader(
  projectRoot: string,
  ideName: string,
  _newContext: string
): Promise<void> {
  // TODO: Implementar atualização de loaders existentes
  // Por agora, regenerar loader completo
  const { readConfig } = await import('../core/config.js');
  const config = await readConfig(projectRoot);
  await generateIDELoader(projectRoot, ideName, config);
}

/**
 * Gera estrutura de documentação
 */
export async function generateDocsStructure(
  projectRoot: string,
  contexts: string[] = []
): Promise<void> {
  // docs/onion/ (documentação do sistema)
  await fs.ensureDir(path.join(projectRoot, 'docs/onion'));

  // docs/{context}-context/ (documentação por contexto)
  for (const ctx of contexts) {
    await fs.ensureDir(path.join(projectRoot, `docs/${ctx}-context`));
  }
}

// ============================================================================
// HELPERS PRIVADOS
// ============================================================================

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateHelpCommandContent(contextName: string, contextType: string): string {
  return `---
name: help
description: Show ${contextName} context commands by level
model: sonnet
category: ${contextType}
tags: [help, onboarding]
version: "4.0.0"
updated: "${new Date().toISOString().split('T')[0]}"
level: starter
context: ${contextName}
---

# ${capitalizeFirst(contextName)} Context Help

List all commands in ${contextName} context organized by level.

Run: \`/${contextName}/help\` or \`/${contextName}/help --level=starter\`
`;
}

function generateWarmUpCommandContent(contextName: string): string {
  return `---
name: warm-up
description: Warm up ${contextName} context with project information
model: sonnet
category: ${contextName}
tags: [context, warm-up]
version: "4.0.0"
updated: "${new Date().toISOString().split('T')[0]}"
level: starter
context: ${contextName}
---

# Warm Up ${capitalizeFirst(contextName)} Context

Load project context and recent activity.
`;
}

function generateBusinessSpecContent(): string {
  return `---
name: spec
description: Create product specification
model: sonnet
category: business
tags: [specification, product]
version: "4.0.0"
level: starter
context: business
---

# Create Product Specification

Create detailed product specification for a feature.
`;
}

function generateBusinessTaskContent(): string {
  return `---
name: task
description: Create task with story points
model: sonnet
category: business
tags: [task, story-points]
version: "4.0.0"
level: starter
context: business
---

# Create Task

Create task in task manager with story points and acceptance criteria.
`;
}

function generateTechnicalPlanContent(): string {
  return `---
name: plan
description: Create development plan
model: sonnet
category: technical
tags: [planning, development]
version: "4.0.0"
level: starter
context: technical
---

# Create Development Plan

Create structured development plan with phases and tasks.
`;
}

function generateTechnicalWorkContent(): string {
  return `---
name: work
description: Continue work on active feature
model: sonnet
category: technical
tags: [development, workflow]
version: "4.0.0"
level: starter
context: technical
---

# Continue Work

Continue development on active feature, reading session and identifying next phase.
`;
}

async function generateCursorLoader(
  projectRoot: string,
  config: IDELoaderConfig
): Promise<void> {
  // Criar .cursor/ na raiz (para Cursor reconhecer)
  const cursorRoot = path.join(projectRoot, '.cursor');
  await fs.ensureDir(cursorRoot);

  // Criar subpastas por contexto
  for (const ctx of config.contexts || []) {
    await fs.ensureDir(path.join(cursorRoot, 'commands', ctx));
    await fs.ensureDir(path.join(cursorRoot, 'agents', ctx));
  }

  // TODO: Criar symlinks de .onion/ → .cursor/
}

async function generateWindsurfLoader(
  _projectRoot: string,
  _config: IDELoaderConfig
): Promise<void> {
  // TODO: Implementar loader Windsurf quando disponível
  console.log('Windsurf loader: not implemented yet');
}

async function generateClaudeLoader(
  _projectRoot: string,
  _config: IDELoaderConfig
): Promise<void> {
  // TODO: Implementar loader Claude quando disponível
  console.log('Claude loader: not implemented yet');
}
