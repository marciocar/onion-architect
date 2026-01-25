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
import path from 'node:path';
import yaml from 'yaml';
import { validateConfig, type OnionConfig } from './validator.js';

const CONFIG_FILENAME = '.onion-config.yml';

/**
 * Lê configuração .onion-config.yml
 */
export async function readConfig(projectRoot: string): Promise<OnionConfig> {
  const configPath = path.join(projectRoot, CONFIG_FILENAME);

  if (!(await fs.pathExists(configPath))) {
    throw new Error(`Arquivo ${CONFIG_FILENAME} não encontrado em ${projectRoot}`);
  }

  try {
    const content = await fs.readFile(configPath, 'utf8');
    const config = yaml.parse(content) as unknown;

    // Validar estrutura
    validateConfig(config);

    return config as OnionConfig;
  } catch (error) {
    if ((error as Error).message.includes('não encontrado')) {
      throw error;
    }
    throw new Error(`Erro ao ler ${CONFIG_FILENAME}: ${(error as Error).message}`);
  }
}

/**
 * Cria novo arquivo .onion-config.yml
 */
export async function createConfig(projectRoot: string, data: OnionConfig): Promise<void> {
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
      lineWidth: 0, // Sem quebra de linha
    });

    // Escrever arquivo
    await fs.writeFile(configPath, yamlContent, 'utf8');
  } catch (error) {
    throw new Error(`Erro ao criar ${CONFIG_FILENAME}: ${(error as Error).message}`);
  }
}

/**
 * Atualiza configuração existente (merge)
 *
 * Faz merge inteligente:
 * - Arrays: concatena e remove duplicatas
 * - Objetos: merge profundo
 * - Primitivos: substitui
 */
export async function updateConfig(
  projectRoot: string,
  updates: Partial<OnionConfig>
): Promise<OnionConfig> {
  // Ler config atual
  const current = await readConfig(projectRoot);

  // Merge inteligente
  const merged = deepMerge(
    current as unknown as Record<string, DeepMergeValue>,
    updates as unknown as Record<string, DeepMergeValue>
  ) as unknown as OnionConfig;

  // Validar resultado
  validateConfig(merged);

  // Escrever de volta
  const configPath = path.join(projectRoot, CONFIG_FILENAME);
  const yamlContent = yaml.stringify(merged, {
    indent: 2,
    lineWidth: 0,
  });

  await fs.writeFile(configPath, yamlContent, 'utf8');

  return merged;
}

/**
 * Remove configuração
 */
export async function deleteConfig(projectRoot: string): Promise<void> {
  const configPath = path.join(projectRoot, CONFIG_FILENAME);

  if (await fs.pathExists(configPath)) {
    await fs.remove(configPath);
  }
}

/**
 * Verifica se configuração existe
 */
export async function configExists(projectRoot: string): Promise<boolean> {
  const configPath = path.join(projectRoot, CONFIG_FILENAME);
  return await fs.pathExists(configPath);
}

/**
 * Obtém caminho da configuração
 */
export function getConfigPath(projectRoot: string): string {
  return path.join(projectRoot, CONFIG_FILENAME);
}

/**
 * Adiciona contexto à configuração
 */
export async function addContext(projectRoot: string, contextName: string): Promise<OnionConfig> {
  const config = await readConfig(projectRoot);

  // Verificar se já existe
  if (config.contexts.includes(contextName)) {
    throw new Error(`Contexto "${contextName}" já existe na configuração`);
  }

  // Adicionar
  return await updateConfig(projectRoot, {
    contexts: [...config.contexts, contextName],
  });
}

/**
 * Remove contexto da configuração
 */
export async function removeContext(projectRoot: string, contextName: string): Promise<OnionConfig> {
  const config = await readConfig(projectRoot);

  // Verificar se existe
  if (!config.contexts.includes(contextName)) {
    throw new Error(`Contexto "${contextName}" não existe na configuração`);
  }

  // Remover
  return await updateConfig(projectRoot, {
    contexts: config.contexts.filter((c) => c !== contextName),
  });
}

/**
 * Adiciona IDE à configuração
 */
export async function addIDE(projectRoot: string, ideName: string): Promise<OnionConfig> {
  const config = await readConfig(projectRoot);

  // Verificar se já existe
  if (config.ides.includes(ideName)) {
    throw new Error(`IDE "${ideName}" já existe na configuração`);
  }

  // Adicionar
  return await updateConfig(projectRoot, {
    ides: [...config.ides, ideName],
  });
}

/**
 * Remove IDE da configuração
 */
export async function removeIDE(projectRoot: string, ideName: string): Promise<OnionConfig> {
  const config = await readConfig(projectRoot);

  // Verificar se existe
  if (!config.ides.includes(ideName)) {
    throw new Error(`IDE "${ideName}" não existe na configuração`);
  }

  // Remover
  return await updateConfig(projectRoot, {
    ides: config.ides.filter((i) => i !== ideName),
  });
}

type DeepMergeValue = string | number | boolean | null | undefined | DeepMergeValue[] | { [key: string]: DeepMergeValue };

/**
 * Merge profundo de objetos
 */
function deepMerge(
  target: Record<string, DeepMergeValue>,
  source: Record<string, DeepMergeValue>
): Record<string, DeepMergeValue> {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = result[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        // Arrays: concatenar e remover duplicatas
        result[key] = [...new Set([...targetValue, ...sourceValue])] as DeepMergeValue[];
      } else if (
        typeof targetValue === 'object' &&
        targetValue !== null &&
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(targetValue) &&
        !Array.isArray(sourceValue)
      ) {
        // Objetos: merge recursivo
        result[key] = deepMerge(
          targetValue as Record<string, DeepMergeValue>,
          sourceValue as Record<string, DeepMergeValue>
        );
      } else {
        // Primitivos: substituir
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

export interface DefaultConfigOptions {
  version?: string;
  contexts?: string[];
  ides?: string[];
  integrations?: Record<string, unknown>;
  created?: string;
  [key: string]: unknown;
}

/**
 * Cria configuração padrão
 */
export function createDefaultConfig(options: DefaultConfigOptions = {}): OnionConfig {
  return {
    version: options.version || '4.0.0',
    contexts: options.contexts || [],
    ides: options.ides || ['cursor'],
    integrations: options.integrations || {},
    created: options.created || new Date().toISOString(),
    ...options,
  };
}
