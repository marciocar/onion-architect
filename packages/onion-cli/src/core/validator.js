/**
 * @fileoverview Core Validator - Validações reutilizáveis sem dependências
 * @module core/validator
 * 
 * Princípios:
 * - ZERO dependências externas
 * - Funções puras (sem side effects)
 * - Validações consistentes em todo CLI
 */

import { CONSTANTS } from '../constants.js';

/**
 * Valida nome de contexto
 * 
 * Regras:
 * - Lowercase
 * - Alfanumérico + hífens
 * - 3-20 caracteres
 * - Não pode ser palavra reservada
 * 
 * @param {string} name - Nome do contexto
 * @returns {boolean} true se válido
 * @throws {Error} se inválido com mensagem descritiva
 */
export function validateContextName(name) {
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
 * 
 * @param {string} ide - Nome do IDE
 * @returns {boolean} true se válido
 * @throws {Error} se inválido
 */
export function validateIDEName(ide) {
  if (!ide || typeof ide !== 'string') {
    throw new Error('Nome do IDE é obrigatório');
  }

  const supported = CONSTANTS.SUPPORTED_IDES || ['cursor', 'windsurf', 'claude'];
  
  if (!supported.includes(ide.toLowerCase())) {
    throw new Error(
      `IDE "${ide}" não é suportado. IDEs disponíveis: ${supported.join(', ')}`
    );
  }

  return true;
}

/**
 * Valida nome de integração
 * 
 * @param {string} integration - Nome da integração
 * @returns {boolean} true se válido
 * @throws {Error} se inválido
 */
export function validateIntegrationName(integration) {
  if (!integration || typeof integration !== 'string') {
    throw new Error('Nome da integração é obrigatório');
  }

  const supported = CONSTANTS.OPTIONAL_INTEGRATIONS || [
    'clickup',
    'asana',
    'linear',
    'github',
    'gitlab'
  ];

  if (!supported.includes(integration.toLowerCase())) {
    throw new Error(
      `Integração "${integration}" não é suportada. Disponíveis: ${supported.join(', ')}`
    );
  }

  return true;
}

/**
 * Valida estrutura mínima de projeto Onion
 * 
 * @param {Object} structure - Estrutura do projeto
 * @returns {boolean} true se válido
 * @throws {Error} se inválido
 */
export function validateProjectStructure(structure) {
  if (!structure || typeof structure !== 'object') {
    throw new Error('Estrutura do projeto inválida');
  }

  // Obrigatórios
  const required = ['root', 'version'];
  for (const field of required) {
    if (!structure[field]) {
      throw new Error(`Campo obrigatório ausente: ${field}`);
    }
  }

  // Versão válida
  if (!['v3', 'v4'].includes(structure.version)) {
    throw new Error(`Versão inválida: ${structure.version}`);
  }

  return true;
}

/**
 * Valida configuração .onion-config.yml
 * 
 * @param {Object} config - Objeto de configuração
 * @returns {boolean} true se válido
 * @throws {Error} se inválido
 */
export function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Configuração inválida');
  }

  // Campos obrigatórios
  const required = ['version', 'contexts', 'ides'];
  for (const field of required) {
    if (!config[field]) {
      throw new Error(`Campo obrigatório ausente no config: ${field}`);
    }
  }

  // Contextos deve ser array
  if (!Array.isArray(config.contexts)) {
    throw new Error('Campo "contexts" deve ser um array');
  }

  // IDEs deve ser array
  if (!Array.isArray(config.ides)) {
    throw new Error('Campo "ides" deve ser um array');
  }

  // Validar cada contexto
  for (const ctx of config.contexts) {
    try {
      validateContextName(ctx);
    } catch (err) {
      throw new Error(`Contexto inválido "${ctx}": ${err.message}`);
    }
  }

  // Validar cada IDE
  for (const ide of config.ides) {
    try {
      validateIDEName(ide);
    } catch (err) {
      throw new Error(`IDE inválido "${ide}": ${err.message}`);
    }
  }

  return true;
}

/**
 * Valida path de arquivo/diretório
 * 
 * @param {string} filePath - Path a validar
 * @returns {boolean} true se válido
 * @throws {Error} se inválido
 */
export function validatePath(filePath) {
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
 * 
 * @param {*} value - Valor a validar
 * @returns {boolean} true se é boolean
 */
export function isBoolean(value) {
  return typeof value === 'boolean';
}

/**
 * Valida se valor é string não-vazia
 * 
 * @param {*} value - Valor a validar
 * @returns {boolean} true se é string não-vazia
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Valida versão semântica
 * 
 * @param {string} version - Versão a validar (e.g., "4.0.0")
 * @returns {boolean} true se válido
 * @throws {Error} se inválido
 */
export function validateSemver(version) {
  if (!version || typeof version !== 'string') {
    throw new Error('Versão é obrigatória');
  }

  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
  if (!semverRegex.test(version)) {
    throw new Error(`Versão inválida: "${version}". Use formato semver (e.g., "4.0.0")`);
  }

  return true;
}

