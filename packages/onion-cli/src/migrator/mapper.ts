/**
 * @fileoverview Migrator Mapper - Mapeia estrutura v3 para v4
 * @module migrator/mapper
 *
 * Princípios:
 * - Lógica pura (sem I/O)
 * - Mapeamento de categorias v3 → contextos v4
 * - Inferência de níveis (starter/intermediate/advanced)
 * - Geração de plano de migração
 */

import type { V3Command, V3Agent, V3Analysis } from './detector.js';

/**
 * Mapeamento de categorias v3 para contextos v4
 */
const CATEGORY_TO_CONTEXT: Record<string, string> = {
  // Commands
  product: 'business',
  business: 'business',
  engineer: 'technical',
  git: 'technical',
  docs: 'technical',
  test: 'technical',
  meta: 'core',
  validate: 'core',
  quick: 'core',
  global: 'core',

  // Agents
  development: 'technical',
  compliance: 'business',
  review: 'technical',
  testing: 'technical',
  research: 'business',
};

/**
 * Comandos starter conhecidos (por nome)
 */
const KNOWN_STARTER_COMMANDS = [
  'spec',
  'task',
  'estimate',
  'refine',
  'warm-up',
  'work',
  'plan',
  'pr',
  'docs',
  'sync',
  'init',
  'help',
];

/**
 * Comandos advanced conhecidos (por nome)
 */
const KNOWN_ADVANCED_COMMANDS = [
  'bump',
  'hotfix',
  'e2e',
  'presentation',
  'branding',
  'analyze-pain-price',
  'transform-consolidated',
  'release-start',
  'release-finish',
  'feature-start',
  'feature-finish',
];

export interface CommandMapping {
  context: string;
  level: string;
  newPath: string;
  oldPath: string;
  name: string;
  category: string;
}

export interface AgentMapping {
  context: string;
  newPath: string;
  oldPath: string;
  name: string;
  category: string;
}

export interface MigrationPlan {
  commands: CommandMapping[];
  agents: AgentMapping[];
  contexts: string[];
  summary: {
    totalCommands: number;
    totalAgents: number;
    commandsByContext: Record<string, number>;
    agentsByContext: Record<string, number>;
    commandsByLevel: {
      starter: number;
      intermediate: number;
      advanced: number;
    };
  };
}

export interface MigrationPlanValidation {
  valid: boolean;
  issues: string[];
}

/**
 * Mapeia comando v3 para estrutura v4
 */
export function mapCommandToContext(command: V3Command): CommandMapping {
  // Determinar contexto
  const context = CATEGORY_TO_CONTEXT[command.category] || 'custom';

  // Inferir nível
  const level = inferCommandLevel(command);

  // Construir novo path
  const newPath = `.onion/contexts/${context}/commands/${level}/${command.name}.md`;

  return {
    context,
    level,
    newPath,
    oldPath: command.path,
    name: command.name,
    category: command.category,
  };
}

/**
 * Mapeia agente v3 para estrutura v4
 */
export function mapAgentToContext(agent: V3Agent): AgentMapping {
  // Determinar contexto
  const context = CATEGORY_TO_CONTEXT[agent.category] || 'custom';

  // Agentes meta vão para core
  if (agent.name.includes('onion') || agent.name.includes('metaspec')) {
    return {
      context: 'core',
      newPath: `.onion/core/agents/${agent.name}.md`,
      oldPath: agent.path,
      name: agent.name,
      category: agent.category,
    };
  }

  // Construir novo path
  const newPath = `.onion/contexts/${context}/agents/${agent.name}.md`;

  return {
    context,
    newPath,
    oldPath: agent.path,
    name: agent.name,
    category: agent.category,
  };
}

/**
 * Infere nível de comando baseado em metadata
 */
export function inferCommandLevel(command: V3Command): string {
  const name = command.name.toLowerCase();

  // Verificar listas conhecidas
  if (KNOWN_STARTER_COMMANDS.includes(name)) {
    return 'starter';
  }

  if (KNOWN_ADVANCED_COMMANDS.includes(name)) {
    return 'advanced';
  }

  // Inferir por metadata
  if (command.metadata) {
    // Se já tem level definido, usar
    if (command.metadata.level) {
      return command.metadata.level;
    }

    // Heurísticas
    const tags = command.metadata.tags || [];
    const description = (command.metadata.description || '').toLowerCase();

    // Starter: comandos básicos, help, warm-up
    if (
      tags.includes('starter') ||
      tags.includes('basic') ||
      name.includes('help') ||
      name.includes('warm-up')
    ) {
      return 'starter';
    }

    // Advanced: release, bump, complex workflows
    if (
      tags.includes('advanced') ||
      tags.includes('release') ||
      name.includes('release') ||
      name.includes('hotfix') ||
      description.includes('advanced') ||
      description.includes('complex')
    ) {
      return 'advanced';
    }
  }

  // Default: intermediate
  return 'intermediate';
}

/**
 * Constrói plano completo de migração
 */
export function buildMigrationPlan(analysis: V3Analysis): MigrationPlan {
  const contextsSet = new Set<string>();
  const commands: CommandMapping[] = [];
  const agents: AgentMapping[] = [];

  const summary = {
    totalCommands: analysis.commands.length,
    totalAgents: analysis.agents.length,
    commandsByContext: {} as Record<string, number>,
    agentsByContext: {} as Record<string, number>,
    commandsByLevel: {
      starter: 0,
      intermediate: 0,
      advanced: 0,
    },
  };

  // Mapear comandos
  for (const command of analysis.commands) {
    const mapping = mapCommandToContext(command);
    commands.push(mapping);
    contextsSet.add(mapping.context);

    // Estatísticas
    summary.commandsByContext[mapping.context] =
      (summary.commandsByContext[mapping.context] || 0) + 1;

    const level = mapping.level as keyof typeof summary.commandsByLevel;
    if (level in summary.commandsByLevel) {
      summary.commandsByLevel[level]++;
    }
  }

  // Mapear agentes
  for (const agent of analysis.agents) {
    const mapping = mapAgentToContext(agent);
    agents.push(mapping);
    contextsSet.add(mapping.context);

    // Estatísticas
    summary.agentsByContext[mapping.context] =
      (summary.agentsByContext[mapping.context] || 0) + 1;
  }

  return {
    commands,
    agents,
    contexts: Array.from(contextsSet),
    summary,
  };
}

/**
 * Valida plano de migração
 */
export function validateMigrationPlan(plan: MigrationPlan): MigrationPlanValidation {
  const issues: string[] = [];

  // Verificar se tem contextos
  if (plan.contexts.length === 0) {
    issues.push('Nenhum contexto identificado');
  }

  // Verificar se tem comandos ou agentes
  if (plan.commands.length === 0 && plan.agents.length === 0) {
    issues.push('Nenhum comando ou agente para migrar');
  }

  // Verificar paths duplicados
  const newPaths = new Set<string>();
  for (const cmd of plan.commands) {
    if (newPaths.has(cmd.newPath)) {
      issues.push(`Path duplicado: ${cmd.newPath}`);
    }
    newPaths.add(cmd.newPath);
  }

  for (const agent of plan.agents) {
    if (newPaths.has(agent.newPath)) {
      issues.push(`Path duplicado: ${agent.newPath}`);
    }
    newPaths.add(agent.newPath);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Gera relatório de migração
 */
export function generateMigrationReport(plan: MigrationPlan): string {
  const lines: string[] = [];

  lines.push('# Plano de Migração Onion v3 → v4\n');

  // Resumo
  lines.push('## 📊 Resumo\n');
  lines.push(`- **Comandos**: ${plan.summary.totalCommands}`);
  lines.push(`- **Agentes**: ${plan.summary.totalAgents}`);
  lines.push(`- **Contextos**: ${plan.contexts.join(', ')}\n`);

  // Comandos por contexto
  lines.push('## 📦 Comandos por Contexto\n');
  for (const [context, count] of Object.entries(plan.summary.commandsByContext)) {
    lines.push(`- **${context}**: ${count} comandos`);
  }
  lines.push('');

  // Comandos por nível
  lines.push('## 📊 Comandos por Nível\n');
  lines.push(`- **Starter**: ${plan.summary.commandsByLevel.starter}`);
  lines.push(`- **Intermediate**: ${plan.summary.commandsByLevel.intermediate}`);
  lines.push(`- **Advanced**: ${plan.summary.commandsByLevel.advanced}\n`);

  // Agentes por contexto
  if (plan.summary.totalAgents > 0) {
    lines.push('## 🤖 Agentes por Contexto\n');
    for (const [context, count] of Object.entries(plan.summary.agentsByContext)) {
      lines.push(`- **${context}**: ${count} agentes`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
