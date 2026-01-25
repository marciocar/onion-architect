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
import path from 'path';
import { detectOnionV3Structure } from '../core/detector.js';

/**
 * Detecta todos os comandos v3
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @returns {Promise<Array>} Lista de comandos com metadata
 */
export async function detectV3Commands(projectRoot) {
  const v3 = await detectOnionV3Structure(projectRoot);
  
  if (!v3) {
    return [];
  }
  
  const commands = [];
  
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
        metadata
      });
    }
  }
  
  return commands;
}

/**
 * Detecta todos os agentes v3
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @returns {Promise<Array>} Lista de agentes com metadata
 */
export async function detectV3Agents(projectRoot) {
  const v3 = await detectOnionV3Structure(projectRoot);
  
  if (!v3) {
    return [];
  }
  
  const agents = [];
  
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
        metadata
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
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @returns {Promise<Array>} Lista de arquivos customizados
 */
export async function detectV3CustomFiles(projectRoot) {
  const custom = [];
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
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @returns {Promise<Object>} Análise completa
 */
export async function analyzeV3Structure(projectRoot) {
  const commands = await detectV3Commands(projectRoot);
  const agents = await detectV3Agents(projectRoot);
  const customFiles = await detectV3CustomFiles(projectRoot);
  const v3 = await detectOnionV3Structure(projectRoot);
  
  // Estatísticas
  const stats = {
    totalCommands: commands.length,
    totalAgents: agents.length,
    totalCustomFiles: customFiles.length,
    commandsByCategory: {},
    agentsByCategory: {},
    hasRules: v3?.hasRules || false,
    hasSessions: v3?.hasSessions || false
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
    v3Structure: v3
  };
}

// ============================================================================
// HELPERS PRIVADOS
// ============================================================================

/**
 * Extrai metadata de comando
 * @private
 */
async function extractCommandMetadata(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!yamlMatch) {
      return { raw: true };
    }
    
    // Parse YAML header
    const yaml = await import('yaml');
    const metadata = yaml.default.parse(yamlMatch[1]);
    
    return {
      ...metadata,
      hasYAML: true,
      contentLength: content.length,
      linesCount: content.split('\n').length
    };
  } catch (error) {
    return {
      error: error.message,
      raw: true
    };
  }
}

/**
 * Extrai metadata de agente
 * @private
 */
async function extractAgentMetadata(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!yamlMatch) {
      return { raw: true };
    }
    
    // Parse YAML header
    const yaml = await import('yaml');
    const metadata = yaml.default.parse(yamlMatch[1]);
    
    return {
      ...metadata,
      hasYAML: true,
      contentLength: content.length,
      linesCount: content.split('\n').length
    };
  } catch (error) {
    return {
      error: error.message,
      raw: true
    };
  }
}

/**
 * Busca arquivos customizados recursivamente
 * @private
 */
async function findCustomFiles(dirPath, projectRoot) {
  const custom = [];
  
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
            modified: stats.mtime
          });
        }
      }
    }
  } catch (error) {
    // Ignorar erros de leitura
  }
  
  return custom;
}

