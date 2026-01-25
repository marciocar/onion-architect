/**
 * @fileoverview Core Validator - Validações reutilizáveis sem dependências
 * @module core/validator
 *
 * Princípios:
 * - ZERO dependências externas
 * - Funções puras (sem side effects)
 * - Validações consistentes em todo CLI
 */

import { SUPPORTED_IDES, OPTIONAL_INTEGRATIONS } from '../constants.js';

/**
 * Valida nome de contexto
 *
 * Regras:
 * - Lowercase
 * - Alfanumérico + hífens
 * - 3-20 caracteres
 * - Não pode ser palavra reservada
 */
export function validateContextName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    throw new Error('Nome do contexto é obrigatório');
  }

  const trimmed = name.trim();

  // Comprimento
  if (trimmed.length < 3 || trimmed.length > 20) {
    throw new Error('Nome do contexto deve ter entre 3 e 20 caracteres');
  }

  // Formato: lowercase, alfanumérico + hífens
  if (!/^[a-z][a-z0-9-]*$/.test(trimmed)) {
    throw new Error(
      'Nome do contexto deve começar com letra minúscula e conter apenas letras, números e hífens'
    );
  }

  // Não pode terminar com hífen
  if (trimmed.endsWith('-')) {
    throw new Error('Nome do contexto não pode terminar com hífen');
  }

  // Palavras reservadas
  const reserved = ['core', 'ide', 'contexts', 'config', 'help'];
  if (reserved.includes(trimmed)) {
    throw new Error(`"${trimmed}" é uma palavra reservada do sistema`);
  }

  return true;
}

/**
 * Valida nome de IDE
 */
export function validateIDEName(ide: string): boolean {
  if (!ide || typeof ide !== 'string') {
    throw new Error('Nome do IDE é obrigatório');
  }

  const supportedIds = SUPPORTED_IDES.map((i) => i.id);

  if (!supportedIds.includes(ide.toLowerCase())) {
    throw new Error(
      `IDE "${ide}" não é suportado. IDEs disponíveis: ${supportedIds.join(', ')}`
    );
  }

  return true;
}

/**
 * Valida nome de integração
 */
export function validateIntegrationName(integration: string): boolean {
  if (!integration || typeof integration !== 'string') {
    throw new Error('Nome da integração é obrigatório');
  }

  const supported = OPTIONAL_INTEGRATIONS.taskManager.map((i) => i.id);

  if (!supported.includes(integration.toLowerCase())) {
    throw new Error(
      `Integração "${integration}" não é suportada. Disponíveis: ${supported.join(', ')}`
    );
  }

  return true;
}

export interface ProjectStructure {
  root: string;
  version: 'v3' | 'v4';
  [key: string]: unknown;
}

/**
 * Valida estrutura mínima de projeto Onion
 */
export function validateProjectStructure(structure: unknown): structure is ProjectStructure {
  if (!structure || typeof structure !== 'object') {
    throw new Error('Estrutura do projeto inválida');
  }

  const struct = structure as Record<string, unknown>;

  // Obrigatórios
  const required = ['root', 'version'];
  for (const field of required) {
    if (!struct[field]) {
      throw new Error(`Campo obrigatório ausente: ${field}`);
    }
  }

  // Versão válida
  if (!['v3', 'v4'].includes(struct.version as string)) {
    throw new Error(`Versão inválida: ${struct.version}`);
  }

  return true;
}

export interface OnionConfig {
  version: string;
  contexts: string[];
  ides: string[];
  integrations?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Valida configuração .onion-config.yml
 */
export function validateConfig(config: unknown): config is OnionConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('Configuração inválida');
  }

  const cfg = config as Record<string, unknown>;

  // Campos obrigatórios
  const required = ['version', 'contexts', 'ides'];
  for (const field of required) {
    if (!cfg[field]) {
      throw new Error(`Campo obrigatório ausente no config: ${field}`);
    }
  }

  // Contextos deve ser array
  if (!Array.isArray(cfg.contexts)) {
    throw new Error('Campo "contexts" deve ser um array');
  }

  // IDEs deve ser array
  if (!Array.isArray(cfg.ides)) {
    throw new Error('Campo "ides" deve ser um array');
  }

  // Validar cada contexto
  for (const ctx of cfg.contexts as string[]) {
    try {
      validateContextName(ctx);
    } catch (err) {
      throw new Error(`Contexto inválido "${ctx}": ${(err as Error).message}`);
    }
  }

  // Validar cada IDE
  for (const ide of cfg.ides as string[]) {
    try {
      validateIDEName(ide);
    } catch (err) {
      throw new Error(`IDE inválido "${ide}": ${(err as Error).message}`);
    }
  }

  return true;
}

/**
 * Valida path de arquivo/diretório
 */
export function validatePath(filePath: string): boolean {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Path é obrigatório');
  }

  // Não pode conter caracteres inválidos
  const invalidChars = ['<', '>', ':', '"', '|', '?', '*'];
  for (const char of invalidChars) {
    if (filePath.includes(char)) {
      throw new Error(`Path contém caractere inválido: "${char}"`);
    }
  }

  // Não pode ser path absoluto com null bytes
  if (filePath.includes('\0')) {
    throw new Error('Path contém null bytes');
  }

  return true;
}

/**
 * Valida se valor é booleano
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Valida se valor é string não-vazia
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Valida versão semântica
 */
export function validateSemver(version: string): boolean {
  if (!version || typeof version !== 'string') {
    throw new Error('Versão é obrigatória');
  }

  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
  if (!semverRegex.test(version)) {
    throw new Error(`Versão inválida: "${version}". Use formato semver (e.g., "4.0.0")`);
  }

  return true;
}
