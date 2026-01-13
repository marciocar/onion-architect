/**
 * @fileoverview Core Config - CRUD para .onion-config.yml
 * @module core/config
 * 
 * Princípios:
 * - CRUD completo (Create, Read, Update, Delete)
 * - Merge inteligente em updates
 * - Validação via core/validator
 * - Dependências: fs-extra, yaml, core/validator
 */

import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';
import { validateConfig } from './validator.js';

const CONFIG_FILENAME = '.onion-config.yml';

/**
 * Lê configuração .onion-config.yml
 * 
 * @param {string} projectRoot - Caminho raiz do projeto
 * @returns {Promise<Object>} Configuração parseada
 * @throws {Error} se arquivo não existe ou é inválido
 */
export async function readConfig(projectRoot) {
  const configPath = path.join(projectRoot, CONFIG_FILENAME);

  if (!(await fs.pathExists(configPath))) {
    throw new Error(`Arquivo ${CONFIG_FILENAME} não encontrado em ${projectRoot}`);
  }

  try {
    const content = await fs.readFile(configPath, 'utf8');
    const config = yaml.parse(content);

    // Validar estrutura
    validateConfig(config);

    return config;
  } catch (error) {
    if (error.message.includes('não encontrado')) {
      throw error;
    }
    throw new Error(`Erro ao ler ${CONFIG_FILENAME}: ${error.message}`);
  }
}

/**
 * Cria novo arquivo .onion-config.yml
 * 
 * @param {string} projectRoot - Caminho raiz do projeto
 * @param {Object} data - Dados iniciais da configuração
 * @returns {Promise<void>}
 * @throws {Error} se arquivo já existe ou dados inválidos
 */
export async function createConfig(projectRoot, data) {
  const configPath = path.join(projectRoot, CONFIG_FILENAME);

  // Verificar se já existe
  if (await fs.pathExists(configPath)) {
    throw new Error(`Arquivo ${CONFIG_FILENAME} já existe. Use updateConfig() para modificar.`);
  }

  // Validar dados
  validateConfig(data);

  try {
    // Gerar YAML
    const yamlContent = yaml.stringify(data, {
      indent: 2,
      lineWidth: 0 // Sem quebra de linha
    });

    // Escrever arquivo
    await fs.writeFile(configPath, yamlContent, 'utf8');
  } catch (error) {
    throw new Error(`Erro ao criar ${CONFIG_FILENAME}: ${error.message}`);
  }
}

/**
 * Atualiza configuração existente (merge)
 * 
 * Faz merge inteligente:
 * - Arrays: concatena e remove duplicatas
 * - Objetos: merge profundo
 * - Primitivos: substitui
 * 
 * @param {string} projectRoot - Caminho raiz do projeto
 * @param {Object} updates - Atualizações a aplicar
 * @returns {Promise<Object>} Configuração atualizada
 * @throws {Error} se arquivo não existe ou update é inválido
 */
export async function updateConfig(projectRoot, updates) {
  // Ler config atual
  const current = await readConfig(projectRoot);

  // Merge inteligente
  const merged = deepMerge(current, updates);

  // Validar resultado
  validateConfig(merged);

  // Escrever de volta
  const configPath = path.join(projectRoot, CONFIG_FILENAME);
  const yamlContent = yaml.stringify(merged, {
    indent: 2,
    lineWidth: 0
  });

  await fs.writeFile(configPath, yamlContent, 'utf8');

  return merged;
}

/**
 * Remove configuração
 * 
 * @param {string} projectRoot - Caminho raiz do projeto
 * @returns {Promise<void>}
 */
export async function deleteConfig(projectRoot) {
  const configPath = path.join(projectRoot, CONFIG_FILENAME);

  if (await fs.pathExists(configPath)) {
    await fs.remove(configPath);
  }
}

/**
 * Verifica se configuração existe
 * 
 * @param {string} projectRoot - Caminho raiz do projeto
 * @returns {Promise<boolean>} true se existe
 */
export async function configExists(projectRoot) {
  const configPath = path.join(projectRoot, CONFIG_FILENAME);
  return await fs.pathExists(configPath);
}

/**
 * Obtém caminho da configuração
 * 
 * @param {string} projectRoot - Caminho raiz do projeto
 * @returns {string} Caminho completo do config
 */
export function getConfigPath(projectRoot) {
  return path.join(projectRoot, CONFIG_FILENAME);
}

/**
 * Adiciona contexto à configuração
 * 
 * @param {string} projectRoot - Caminho raiz do projeto
 * @param {string} contextName - Nome do contexto
 * @returns {Promise<Object>} Configuração atualizada
 */
export async function addContext(projectRoot, contextName) {
  const config = await readConfig(projectRoot);

  // Verificar se já existe
  if (config.contexts.includes(contextName)) {
    throw new Error(`Contexto "${contextName}" já existe na configuração`);
  }

  // Adicionar
  return await updateConfig(projectRoot, {
    contexts: [...config.contexts, contextName]
  });
}

/**
 * Remove contexto da configuração
 * 
 * @param {string} projectRoot - Caminho raiz do projeto
 * @param {string} contextName - Nome do contexto
 * @returns {Promise<Object>} Configuração atualizada
 */
export async function removeContext(projectRoot, contextName) {
  const config = await readConfig(projectRoot);

  // Verificar se existe
  if (!config.contexts.includes(contextName)) {
    throw new Error(`Contexto "${contextName}" não existe na configuração`);
  }

  // Remover
  return await updateConfig(projectRoot, {
    contexts: config.contexts.filter(c => c !== contextName)
  });
}

/**
 * Adiciona IDE à configuração
 * 
 * @param {string} projectRoot - Caminho raiz do projeto
 * @param {string} ideName - Nome do IDE
 * @returns {Promise<Object>} Configuração atualizada
 */
export async function addIDE(projectRoot, ideName) {
  const config = await readConfig(projectRoot);

  // Verificar se já existe
  if (config.ides.includes(ideName)) {
    throw new Error(`IDE "${ideName}" já existe na configuração`);
  }

  // Adicionar
  return await updateConfig(projectRoot, {
    ides: [...config.ides, ideName]
  });
}

/**
 * Remove IDE da configuração
 * 
 * @param {string} projectRoot - Caminho raiz do projeto
 * @param {string} ideName - Nome do IDE
 * @returns {Promise<Object>} Configuração atualizada
 */
export async function removeIDE(projectRoot, ideName) {
  const config = await readConfig(projectRoot);

  // Verificar se existe
  if (!config.ides.includes(ideName)) {
    throw new Error(`IDE "${ideName}" não existe na configuração`);
  }

  // Remover
  return await updateConfig(projectRoot, {
    ides: config.ides.filter(i => i !== ideName)
  });
}

/**
 * Merge profundo de objetos
 * 
 * @private
 * @param {Object} target - Objeto alvo
 * @param {Object} source - Objeto fonte
 * @returns {Object} Objeto merged
 */
function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = result[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        // Arrays: concatenar e remover duplicatas
        result[key] = [...new Set([...targetValue, ...sourceValue])];
      } else if (
        typeof targetValue === 'object' &&
        targetValue !== null &&
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(targetValue) &&
        !Array.isArray(sourceValue)
      ) {
        // Objetos: merge recursivo
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        // Primitivos: substituir
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

/**
 * Cria configuração padrão
 * 
 * @param {Object} options - Opções para configuração
 * @returns {Object} Configuração padrão
 */
export function createDefaultConfig(options = {}) {
  return {
    version: options.version || '4.0.0',
    contexts: options.contexts || [],
    ides: options.ides || ['cursor'],
    integrations: options.integrations || {},
    created: options.created || new Date().toISOString(),
    ...options
  };
}

