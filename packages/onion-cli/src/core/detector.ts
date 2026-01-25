/**
 * @fileoverview Core Detector - Detecta projetos Onion e suas versões
 * @module core/detector
 *
 * Princípios:
 * - Mínimas dependências (apenas fs-extra)
 * - Detecção robusta de v3 e v4
 * - Retorna estrutura completa para tomada de decisão
 */

import fs from 'fs-extra';
import path from 'node:path';

export interface OnionV4Structure {
  version: 'v4';
  root: string;
  onionDir: string;
  configFile: string;
  contextsDir: string;
  coreDir: string;
  ideDir: string;
  contexts: string[];
  ides: string[];
}

export interface OnionV3Structure {
  version: 'v3';
  root: string;
  cursorDir: string;
  commandsDir: string;
  agentsDir: string;
  commands: Record<string, string[]>;
  agents: Record<string, string[]>;
  hasRules: boolean;
  hasSessions: boolean;
}

export type OnionProject = OnionV4Structure | OnionV3Structure;

/**
 * Detecta se é projeto Onion e qual versão
 */
export async function detectOnionProject(projectRoot: string): Promise<OnionProject | null> {
  // Tentar v4 primeiro (mais recente)
  const v4 = await detectOnionV4Structure(projectRoot);
  if (v4) return v4;

  // Tentar v3
  const v3 = await detectOnionV3Structure(projectRoot);
  if (v3) return v3;

  return null;
}

/**
 * Detecta estrutura Onion v4
 *
 * Características v4:
 * - Pasta `.onion/` na raiz
 * - Arquivo `.onion-config.yml`
 * - Estrutura `.onion/contexts/`
 */
export async function detectOnionV4Structure(projectRoot: string): Promise<OnionV4Structure | null> {
  try {
    const onionDir = path.join(projectRoot, '.onion');
    const configFile = path.join(projectRoot, '.onion-config.yml');

    // Verificar .onion/ existe
    if (!(await fs.pathExists(onionDir))) {
      return null;
    }

    // Verificar .onion-config.yml existe
    if (!(await fs.pathExists(configFile))) {
      return null;
    }

    // Verificar .onion/contexts/ existe
    const contextsDir = path.join(onionDir, 'contexts');
    if (!(await fs.pathExists(contextsDir))) {
      return null;
    }

    // Ler estrutura
    const structure: OnionV4Structure = {
      version: 'v4',
      root: projectRoot,
      onionDir,
      configFile,
      contextsDir,
      coreDir: path.join(onionDir, 'core'),
      ideDir: path.join(onionDir, 'ide'),
      contexts: [],
      ides: [],
    };

    // Listar contextos
    try {
      const contextDirs = await fs.readdir(contextsDir);
      const validContexts: string[] = [];
      for (const name of contextDirs) {
        const stat = await fs.stat(path.join(contextsDir, name));
        if (stat.isDirectory()) {
          validContexts.push(name);
        }
      }
      structure.contexts = validContexts;
    } catch {
      structure.contexts = [];
    }

    // Listar IDEs
    const ideDir = path.join(onionDir, 'ide');
    if (await fs.pathExists(ideDir)) {
      try {
        const ideDirs = await fs.readdir(ideDir);
        const validIdes: string[] = [];
        for (const name of ideDirs) {
          const stat = await fs.stat(path.join(ideDir, name));
          if (stat.isDirectory()) {
            validIdes.push(name);
          }
        }
        structure.ides = validIdes;
      } catch {
        structure.ides = [];
      }
    }

    return structure;
  } catch {
    return null;
  }
}

/**
 * Detecta estrutura Onion v3
 *
 * Características v3:
 * - Pasta `.cursor/` na raiz
 * - Subpastas `.cursor/commands/` e `.cursor/agents/`
 * - Sem `.onion/` ou `.onion-config.yml`
 */
export async function detectOnionV3Structure(projectRoot: string): Promise<OnionV3Structure | null> {
  try {
    const cursorDir = path.join(projectRoot, '.cursor');
    const commandsDir = path.join(cursorDir, 'commands');
    const agentsDir = path.join(cursorDir, 'agents');

    // Verificar .cursor/ existe
    if (!(await fs.pathExists(cursorDir))) {
      return null;
    }

    // Verificar commands/ e agents/ existem
    const hasCommands = await fs.pathExists(commandsDir);
    const hasAgents = await fs.pathExists(agentsDir);

    if (!hasCommands && !hasAgents) {
      return null;
    }

    // Verificar que NÃO é v4 (não tem .onion/)
    const onionDir = path.join(projectRoot, '.onion');
    if (await fs.pathExists(onionDir)) {
      return null; // É v4, não v3
    }

    // Ler estrutura
    const structure: OnionV3Structure = {
      version: 'v3',
      root: projectRoot,
      cursorDir,
      commandsDir,
      agentsDir,
      commands: {},
      agents: {},
      hasRules: false,
      hasSessions: false,
    };

    // Listar categorias de comandos
    if (hasCommands) {
      try {
        const categories = await fs.readdir(commandsDir);
        for (const category of categories) {
          const categoryPath = path.join(commandsDir, category);
          const stat = await fs.stat(categoryPath);

          if (stat.isDirectory()) {
            const files = await fs.readdir(categoryPath);
            structure.commands[category] = files.filter((f) => f.endsWith('.md'));
          }
        }
      } catch {
        structure.commands = {};
      }
    }

    // Listar categorias de agentes
    if (hasAgents) {
      try {
        const categories = await fs.readdir(agentsDir);
        for (const category of categories) {
          const categoryPath = path.join(agentsDir, category);
          const stat = await fs.stat(categoryPath);

          if (stat.isDirectory()) {
            const files = await fs.readdir(categoryPath);
            structure.agents[category] = files.filter((f) => f.endsWith('.md'));
          }
        }
      } catch {
        structure.agents = {};
      }
    }

    // Verificar rules/
    const rulesDir = path.join(cursorDir, 'rules');
    structure.hasRules = await fs.pathExists(rulesDir);

    // Verificar sessions/
    const sessionsDir = path.join(cursorDir, 'sessions');
    structure.hasSessions = await fs.pathExists(sessionsDir);

    return structure;
  } catch {
    return null;
  }
}

/**
 * Verifica se path é projeto Onion (qualquer versão)
 */
export async function isOnionProject(projectRoot: string): Promise<boolean> {
  const project = await detectOnionProject(projectRoot);
  return project !== null;
}

/**
 * Obtém versão do projeto Onion
 */
export async function getOnionVersion(projectRoot: string): Promise<'v3' | 'v4' | null> {
  const project = await detectOnionProject(projectRoot);
  return project ? project.version : null;
}

/**
 * Detecta IDEs instalados no sistema
 */
export async function detectInstalledIDEs(): Promise<string[]> {
  const detected: string[] = [];

  // Cursor (verifica se .cursor/ existe no projeto atual)
  const cursorDir = path.join(process.cwd(), '.cursor');
  if (await fs.pathExists(cursorDir)) {
    detected.push('cursor');
  }

  // Windsurf (verifica configurações conhecidas)
  // TODO: Implementar detecção real quando Windsurf estiver disponível

  // Claude Code (verifica configurações conhecidas)
  // TODO: Implementar detecção real quando Claude Code estiver disponível

  // Fallback: sempre oferece Cursor como opção
  if (!detected.includes('cursor')) {
    detected.push('cursor');
  }

  return detected;
}

export interface MigrationEligibility {
  canMigrate: boolean;
  issues: string[];
}

/**
 * Valida se projeto pode ser migrado
 */
export function validateMigrationEligibility(v3Structure: OnionV3Structure | null): MigrationEligibility {
  const issues: string[] = [];

  if (!v3Structure || v3Structure.version !== 'v3') {
    return { canMigrate: false, issues: ['Não é um projeto Onion v3'] };
  }

  // Verificar se já tem .onion/ (seria v4)
  if (v3Structure.root) {
    const onionPath = path.join(v3Structure.root, '.onion');
    if (fs.existsSync(onionPath)) {
      issues.push('Projeto já tem estrutura .onion/ (possível v4)');
    }
  }

  // Verificar se tem comandos ou agentes
  const hasCommands = Object.keys(v3Structure.commands || {}).length > 0;
  const hasAgents = Object.keys(v3Structure.agents || {}).length > 0;

  if (!hasCommands && !hasAgents) {
    issues.push('Projeto não tem comandos nem agentes para migrar');
  }

  const canMigrate = issues.length === 0;

  return { canMigrate, issues };
}
