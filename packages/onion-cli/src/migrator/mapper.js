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

/**
 * Mapeamento de categorias v3 para contextos v4
 */
const CATEGORY_TO_CONTEXT = {
  // Commands
  'product': 'business',
  'business': 'business',
  'engineer': 'technical',
  'git': 'technical',
  'docs': 'technical',
  'test': 'technical',
  'meta': 'core',
  'validate': 'core',
  'quick': 'core',
  'global': 'core',
  
  // Agents
  'development': 'technical',
  'product': 'business',
  'compliance': 'business',
  'review': 'technical',
  'testing': 'technical',
  'research': 'business',
  'git': 'technical'
};

/**
 * Comandos starter conhecidos (por nome)
 */
const KNOWN_STARTER_COMMANDS = [
  'spec', 'task', 'estimate', 'refine', 'warm-up',
  'work', 'plan', 'pr', 'docs', 'sync', 'init', 'help'
];

/**
 * Comandos advanced conhecidos (por nome)
 */
const KNOWN_ADVANCED_COMMANDS = [
  'bump', 'hotfix', 'e2e', 'presentation', 'branding',
  'analyze-pain-price', 'transform-consolidated',
  'release-start', 'release-finish', 'feature-start', 'feature-finish'
];

/**
 * Mapeia comando v3 para estrutura v4
 * 
 * @param {Object} command - Comando v3 { name, category, path, metadata }
 * @returns {Object} Mapeamento { context, level, newPath }
 */
export function mapCommandToContext(command) {
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
    category: command.category
  };
}

/**
 * Mapeia agente v3 para estrutura v4
 * 
 * @param {Object} agent - Agente v3 { name, category, path, metadata }
 * @returns {Object} Mapeamento { context, newPath }
 */
export function mapAgentToContext(agent) {
  // Determinar contexto
  const context = CATEGORY_TO_CONTEXT[agent.category] || 'custom';
  
  // Agentes meta vão para core
  if (agent.name.includes('onion') || agent.name.includes('metaspec')) {
    return {
      context: 'core',
      newPath: `.onion/core/agents/${agent.name}.md`,
      oldPath: agent.path,
      name: agent.name,
      category: agent.category
    };
  }
  
  // Construir novo path
  const newPath = `.onion/contexts/${context}/agents/${agent.name}.md`;
  
  return {
    context,
    newPath,
    oldPath: agent.path,
    name: agent.name,
    category: agent.category
  };
}

/**
 * Infere nível de comando baseado em metadata
 * 
 * @param {Object} command - Comando com metadata
 * @returns {string} 'starter' | 'intermediate' | 'advanced'
 */
export function inferCommandLevel(command) {
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
    if (tags.includes('starter') || 
        tags.includes('basic') ||
        name.includes('help') ||
        name.includes('warm-up')) {
      return 'starter';
    }
    
    // Advanced: release, bump, complex workflows
    if (tags.includes('advanced') ||
        tags.includes('release') ||
        name.includes('release') ||
        name.includes('hotfix') ||
        description.includes('advanced') ||
        description.includes('complex')) {
      return 'advanced';
    }
  }
  
  // Default: intermediate
  return 'intermediate';
}

/**
 * Constrói plano completo de migração
 * 
 * @param {Object} analysis - Análise v3 completa
 * @returns {Object} Plano de migração
 */
export function buildMigrationPlan(analysis) {
  const plan = {
    commands: [],
    agents: [],
    contexts: new Set(),
    summary: {
      totalCommands: analysis.commands.length,
      totalAgents: analysis.agents.length,
      commandsByContext: {},
      agentsByContext: {},
      commandsByLevel: {
        starter: 0,
        intermediate: 0,
        advanced: 0
      }
    }
  };
  
  // Mapear comandos
  for (const command of analysis.commands) {
    const mapping = mapCommandToContext(command);
    plan.commands.push(mapping);
    plan.contexts.add(mapping.context);
    
    // Estatísticas
    plan.summary.commandsByContext[mapping.context] = 
      (plan.summary.commandsByContext[mapping.context] || 0) + 1;
    plan.summary.commandsByLevel[mapping.level]++;
  }
  
  // Mapear agentes
  for (const agent of analysis.agents) {
    const mapping = mapAgentToContext(agent);
    plan.agents.push(mapping);
    plan.contexts.add(mapping.context);
    
    // Estatísticas
    plan.summary.agentsByContext[mapping.context] = 
      (plan.summary.agentsByContext[mapping.context] || 0) + 1;
  }
  
  // Converter Set para Array
  plan.contexts = Array.from(plan.contexts);
  
  return plan;
}

/**
 * Valida plano de migração
 * 
 * @param {Object} plan - Plano gerado
 * @returns {Object} { valid: boolean, issues: string[] }
 */
export function validateMigrationPlan(plan) {
  const issues = [];
  
  // Verificar se tem contextos
  if (plan.contexts.length === 0) {
    issues.push('Nenhum contexto identificado');
  }
  
  // Verificar se tem comandos ou agentes
  if (plan.commands.length === 0 && plan.agents.length === 0) {
    issues.push('Nenhum comando ou agente para migrar');
  }
  
  // Verificar paths duplicados
  const newPaths = new Set();
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
    issues
  };
}

/**
 * Gera relatório de migração
 * 
 * @param {Object} plan - Plano de migração
 * @returns {string} Relatório formatado
 */
export function generateMigrationReport(plan) {
  const lines = [];
  
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

