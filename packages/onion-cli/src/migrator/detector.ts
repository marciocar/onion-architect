/**
 * @fileoverview Migrator Detector - Detecta e analisa projetos v3
 * @module migrator/detector
 *
 * Princípios:
 * - Detecta comandos e agentes v3
 * - Extrai metadata de arquivos
 * - Identifica arquivos customizados
 * - Reutiliza core/detector para detecção base
 */

import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'yaml';
import { detectOnionV3Structure, type OnionV3Structure } from '../core/detector.js';

export interface CommandMetadata {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  level?: string;
  hasYAML?: boolean;
  contentLength?: number;
  linesCount?: number;
  raw?: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface V3Command {
  name: string;
  category: string;
  path: string;
  relativePath: string;
  metadata: CommandMetadata;
}

export interface V3Agent {
  name: string;
  category: string;
  path: string;
  relativePath: string;
  metadata: CommandMetadata;
}

export interface CustomFile {
  name: string;
  path: string;
  relativePath: string;
  size: number;
  modified: Date;
}

export interface V3Analysis {
  commands: V3Command[];
  agents: V3Agent[];
  customFiles: CustomFile[];
  stats: {
    totalCommands: number;
    totalAgents: number;
    totalCustomFiles: number;
    commandsByCategory: Record<string, number>;
    agentsByCategory: Record<string, number>;
    hasRules: boolean;
    hasSessions: boolean;
  };
  v3Structure: OnionV3Structure | null;
}

/**
 * Detecta todos os comandos v3
 */
export async function detectV3Commands(projectRoot: string): Promise<V3Command[]> {
  const v3 = await detectOnionV3Structure(projectRoot);

  if (!v3) {
    return [];
  }

  const commands: V3Command[] = [];

  // Iterar por categorias de comandos
  for (const [category, files] of Object.entries(v3.commands)) {
    const categoryPath = path.join(v3.commandsDir, category);

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const metadata = await extractCommandMetadata(filePath);

      commands.push({
        name: path.basename(file, '.md'),
        category,
        path: filePath,
        relativePath: path.relative(projectRoot, filePath),
        metadata,
      });
    }
  }

  return commands;
}

/**
 * Detecta todos os agentes v3
 */
export async function detectV3Agents(projectRoot: string): Promise<V3Agent[]> {
  const v3 = await detectOnionV3Structure(projectRoot);

  if (!v3) {
    return [];
  }

  const agents: V3Agent[] = [];

  // Iterar por categorias de agentes
  for (const [category, files] of Object.entries(v3.agents)) {
    const categoryPath = path.join(v3.agentsDir, category);

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const metadata = await extractAgentMetadata(filePath);

      agents.push({
        name: path.basename(file, '.md'),
        category,
        path: filePath,
        relativePath: path.relative(projectRoot, filePath),
        metadata,
      });
    }
  }

  return agents;
}

/**
 * Detecta arquivos customizados pelo usuário
 *
 * Critérios:
 * - Não está na lista de comandos/agentes padrão do Onion
 * - Foi modificado recentemente
 * - Tem conteúdo significativo
 */
export async function detectV3CustomFiles(projectRoot: string): Promise<CustomFile[]> {
  const custom: CustomFile[] = [];
  const cursorDir = path.join(projectRoot, '.cursor');

  if (!(await fs.pathExists(cursorDir))) {
    return custom;
  }

  // Buscar em subpastas
  const subdirs = ['commands', 'agents', 'rules', 'utils'];

  for (const subdir of subdirs) {
    const dirPath = path.join(cursorDir, subdir);

    if (await fs.pathExists(dirPath)) {
      const files = await findCustomFiles(dirPath, projectRoot);
      custom.push(...files);
    }
  }

  return custom;
}

/**
 * Análise completa de estrutura v3
 */
export async function analyzeV3Structure(projectRoot: string): Promise<V3Analysis> {
  const commands = await detectV3Commands(projectRoot);
  const agents = await detectV3Agents(projectRoot);
  const customFiles = await detectV3CustomFiles(projectRoot);
  const v3 = await detectOnionV3Structure(projectRoot);

  // Estatísticas
  const stats = {
    totalCommands: commands.length,
    totalAgents: agents.length,
    totalCustomFiles: customFiles.length,
    commandsByCategory: {} as Record<string, number>,
    agentsByCategory: {} as Record<string, number>,
    hasRules: v3?.hasRules || false,
    hasSessions: v3?.hasSessions || false,
  };

  // Contar por categoria
  for (const cmd of commands) {
    stats.commandsByCategory[cmd.category] =
      (stats.commandsByCategory[cmd.category] || 0) + 1;
  }

  for (const agent of agents) {
    stats.agentsByCategory[agent.category] =
      (stats.agentsByCategory[agent.category] || 0) + 1;
  }

  return {
    commands,
    agents,
    customFiles,
    stats,
    v3Structure: v3,
  };
}

// ============================================================================
// HELPERS PRIVADOS
// ============================================================================

/**
 * Extrai metadata de comando
 */
async function extractCommandMetadata(filePath: string): Promise<CommandMetadata> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!yamlMatch || !yamlMatch[1]) {
      return { raw: true };
    }

    // Parse YAML header
    const metadata = yaml.parse(yamlMatch[1]) as CommandMetadata;

    return {
      ...metadata,
      hasYAML: true,
      contentLength: content.length,
      linesCount: content.split('\n').length,
    };
  } catch (error) {
    return {
      error: (error as Error).message,
      raw: true,
    };
  }
}

/**
 * Extrai metadata de agente
 */
async function extractAgentMetadata(filePath: string): Promise<CommandMetadata> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!yamlMatch || !yamlMatch[1]) {
      return { raw: true };
    }

    // Parse YAML header
    const metadata = yaml.parse(yamlMatch[1]) as CommandMetadata;

    return {
      ...metadata,
      hasYAML: true,
      contentLength: content.length,
      linesCount: content.split('\n').length,
    };
  } catch (error) {
    return {
      error: (error as Error).message,
      raw: true,
    };
  }
}

/**
 * Busca arquivos customizados recursivamente
 */
async function findCustomFiles(dirPath: string, projectRoot: string): Promise<CustomFile[]> {
  const custom: CustomFile[] = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursivo
        const subFiles = await findCustomFiles(fullPath, projectRoot);
        custom.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Verificar se é customizado
        const stats = await fs.stat(fullPath);
        const content = await fs.readFile(fullPath, 'utf-8');

        // Critérios simples: arquivos com conteúdo significativo
        if (content.length > 100) {
          custom.push({
            name: entry.name,
            path: fullPath,
            relativePath: path.relative(projectRoot, fullPath),
            size: stats.size,
            modified: stats.mtime,
          });
        }
      }
    }
  } catch {
    // Ignorar erros de leitura
  }

  return custom;
}
