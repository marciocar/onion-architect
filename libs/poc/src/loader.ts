/**
 * Loader para dados fixos da POC
 * 
 * Carrega arquivos .md (knowbases, agentes, comandos, regras) e os prepara
 * para serem seedados no banco de dados.
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';

export interface KnowbaseData {
  id: string;
  name: string;
  content: string;
  tenantId: string;
}

export interface AgentData {
  id: string;
  name: string;
  description: string;
  knowbaseIds: string[];
  agentIds?: string[];
  instructions: string;
  model: string;
  tenantId: string;
  metadata: {
    version: string;
    updated: string;
  };
}

export interface CommandData {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: Array<{
    type: string;
    [key: string]: any;
  }>;
  variables?: Array<{
    name: string;
    type: string;
    default?: string;
    prompt?: string;
  }>;
  tenantId: string;
  metadata: {
    version: string;
    updated: string;
  };
}

export interface RuleData {
  id: string;
  name: string;
  description: string;
  active: boolean;
  scope: {
    global: boolean;
    agents?: string[];
  };
  priority: number;
  content: string;
  tenantId: string;
  metadata: {
    version: string;
    updated: string;
  };
}

const DATA_DIR = path.join(__dirname, '../data');

/**
 * Parse YAML frontmatter de arquivo .md
 */
function parseFrontmatter(content: string): { frontmatter: any; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatter = parse(match[1]);
  const body = match[2].trim();

  return { frontmatter, body };
}

/**
 * Carrega knowbases fixas
 */
export function loadKnowbases(tenantId: string): KnowbaseData[] {
  const knowbasesDir = path.join(DATA_DIR, 'knowbases');
  const files = fs.readdirSync(knowbasesDir).filter(f => f.endsWith('.md'));

  return files.map((file, index) => {
    const filePath = path.join(knowbasesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const name = file.replace('.md', '').replace(/-/g, ' ');

    return {
      id: `knowbase-${name.replace(/\s+/g, '-').toLowerCase()}-id`,
      name,
      content,
      tenantId,
    };
  });
}

/**
 * Carrega agentes fixos
 */
export function loadAgents(tenantId: string): AgentData[] {
  const agentsDir = path.join(DATA_DIR, 'agents');
  const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));

  return files.map((file) => {
    const filePath = path.join(agentsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    return {
      id: `agent-${frontmatter.name}-id`,
      name: frontmatter.name,
      description: frontmatter.description,
      knowbaseIds: frontmatter.knowbaseIds || [],
      agentIds: frontmatter.agentIds || [],
      instructions: frontmatter.instructions || '',
      model: frontmatter.model || 'gpt-4',
      tenantId,
      metadata: {
        version: frontmatter.version || '1.0.0',
        updated: frontmatter.updated || new Date().toISOString().split('T')[0],
      },
    };
  });
}

/**
 * Carrega comandos fixos
 */
export function loadCommands(tenantId: string): CommandData[] {
  const commandsDir = path.join(DATA_DIR, 'commands');
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'));

  return files.map((file) => {
    const filePath = path.join(commandsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    return {
      id: `command-${frontmatter.name}-id`,
      name: frontmatter.name,
      description: frontmatter.description,
      category: frontmatter.category || 'general',
      steps: frontmatter.steps || [],
      variables: frontmatter.variables || [],
      tenantId,
      metadata: {
        version: frontmatter.version || '1.0.0',
        updated: frontmatter.updated || new Date().toISOString().split('T')[0],
      },
    };
  });
}

/**
 * Carrega regras fixas
 */
export function loadRules(tenantId: string): RuleData[] {
  const rulesDir = path.join(DATA_DIR, 'rules');
  const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.md'));

  return files.map((file) => {
    const filePath = path.join(rulesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    return {
      id: `rule-${frontmatter.name}-id`,
      name: frontmatter.name,
      description: frontmatter.description,
      active: frontmatter.active !== false,
      scope: frontmatter.scope || { global: true },
      priority: frontmatter.priority || 50,
      content: body,
      tenantId,
      metadata: {
        version: frontmatter.version || '1.0.0',
        updated: frontmatter.updated || new Date().toISOString().split('T')[0],
      },
    };
  });
}

/**
 * Carrega todos os dados fixos da POC
 */
export function loadAllPocData(tenantId: string = 'poc-tenant-id') {
  return {
    knowbases: loadKnowbases(tenantId),
    agents: loadAgents(tenantId),
    commands: loadCommands(tenantId),
    rules: loadRules(tenantId),
  };
}

