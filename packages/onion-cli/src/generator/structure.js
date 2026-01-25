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
import path from 'path';

/**
 * Cria estrutura core completa (.onion/core/)
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @returns {Promise<void>}
 */
export async function generateCoreStructure(projectRoot) {
  const onionRoot = path.join(projectRoot, '.onion');
  
  const corePaths = [
    'core/knowbase/concepts',
    'core/knowbase/frameworks',
    'core/knowbase/tools',
    'core/knowbase/learnings',
    'core/agents',
    'core/commands',
    'core/rules',
    'core/utils'
  ];
  
  for (const p of corePaths) {
    await fs.ensureDir(path.join(onionRoot, p));
  }
}

/**
 * Cria estrutura de um contexto específico
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {string} contextName - Nome do contexto
 * @param {Object} options - Opções de geração
 * @returns {Promise<void>}
 */
export async function generateContextStructure(projectRoot, contextName, options = {}) {
  const onionRoot = path.join(projectRoot, '.onion');
  const contextRoot = path.join(onionRoot, 'contexts', contextName);
  
  // Estrutura base
  const basePaths = [
    'knowbase',
    'agents',
    'commands/starter',
    'commands/intermediate',
    'commands/advanced',
    'sessions'
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
    await generateContextConfig(projectRoot, contextName);
  }
}

/**
 * Cria README de contexto
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {string} contextName - Nome do contexto
 * @returns {Promise<void>}
 */
export async function generateContextREADME(projectRoot, contextName) {
  const readmePath = path.join(
    projectRoot,
    '.onion/contexts',
    contextName,
    'README.md'
  );
  
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
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {string} contextName - Nome do contexto
 * @param {Object} config - Configuração do contexto
 * @returns {Promise<void>}
 */
export async function generateContextConfig(projectRoot, contextName, config = {}) {
  const yaml = (await import('yaml')).default;
  
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
      type: config.type || 'custom'
    },
    integrations: config.integrations || {}
  };
  
  await fs.writeFile(configPath, yaml.stringify(defaultConfig), 'utf-8');
}

/**
 * Cria comandos starter para um contexto
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {string} contextName - Nome do contexto
 * @param {string} contextType - Tipo do contexto (business, technical, custom)
 * @returns {Promise<void>}
 */
export async function generateStarterCommands(projectRoot, contextName, contextType) {
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
      content: generateHelpCommandContent(contextName, contextType)
    },
    {
      name: 'warm-up',
      description: `Warm up ${contextName} context`,
      content: generateWarmUpCommandContent(contextName)
    }
  ];
  
  // Adicionar comandos específicos por tipo
  if (contextType === 'business') {
    starterCommands.push(
      {
        name: 'spec',
        description: 'Create product specification',
        content: generateBusinessSpecContent()
      },
      {
        name: 'task',
        description: 'Create task with story points',
        content: generateBusinessTaskContent()
      }
    );
  } else if (contextType === 'technical') {
    starterCommands.push(
      {
        name: 'plan',
        description: 'Create development plan',
        content: generateTechnicalPlanContent()
      },
      {
        name: 'work',
        description: 'Continue work on feature',
        content: generateTechnicalWorkContent()
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
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {string[]} ides - Lista de IDEs
 * @returns {Promise<void>}
 */
export async function generateIDEStructure(projectRoot, ides = []) {
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
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {string} ideName - Nome do IDE
 * @param {Object} config - Configuração (contexts, commands)
 * @returns {Promise<void>}
 */
export async function generateIDELoader(projectRoot, ideName, config = {}) {
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
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {string} ideName - Nome do IDE
 * @param {string} newContext - Novo contexto a adicionar
 * @returns {Promise<void>}
 */
export async function updateIDELoader(projectRoot, ideName, newContext) {
  // TODO: Implementar atualização de loaders existentes
  // Por agora, regenerar loader completo
  const { readConfig } = await import('../core/config.js');
  const config = await readConfig(projectRoot);
  await generateIDELoader(projectRoot, ideName, config);
}

/**
 * Gera estrutura de documentação
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {string[]} contexts - Lista de contextos
 * @returns {Promise<void>}
 */
export async function generateDocsStructure(projectRoot, contexts = []) {
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

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateHelpCommandContent(contextName, contextType) {
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

function generateWarmUpCommandContent(contextName) {
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

function generateBusinessSpecContent() {
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

function generateBusinessTaskContent() {
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

function generateTechnicalPlanContent() {
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

function generateTechnicalWorkContent() {
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

async function generateCursorLoader(projectRoot, config) {
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

async function generateWindsurfLoader(projectRoot, config) {
  // TODO: Implementar loader Windsurf quando disponível
  console.log('Windsurf loader: not implemented yet');
}

async function generateClaudeLoader(projectRoot, config) {
  // TODO: Implementar loader Claude quando disponível
  console.log('Claude loader: not implemented yet');
}
