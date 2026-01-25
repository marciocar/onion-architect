/**
 * @fileoverview Config Generator - DEPRECATED
 * @deprecated Use core/config.js instead
 * 
 * Este módulo está deprecated. Use:
 * - `core/config.createConfig()` para criar config
 * - `core/config.updateConfig()` para atualizar
 * - `core/config.readConfig()` para ler
 * 
 * Mantido temporariamente para backward compatibility.
 */

import { createConfig, createDefaultConfig } from '../core/config.js';
import logger from '../utils/logger.js';

/**
 * @deprecated Use core/config.createConfig() instead
 */
export async function generateConfig(projectRoot, answers) {
  logger.warn('⚠️  generator/config.js is deprecated. Use core/config.js instead.');
  
  // Mapear answers do wizard para formato do config
  const configData = createDefaultConfig({
    version: '4.0.0',
    contexts: answers.contexts || [],
    ides: answers.ides || ['cursor'],
    integrations: {
      task_manager: answers.taskManager !== 'none' ? {
        provider: answers.taskManager,
        config_key: `${answers.taskManager.toUpperCase()}_API_TOKEN`
      } : null,
      transcription: answers.transcription !== 'none' ? {
        provider: answers.transcription
      } : null
    },
    project_type: answers.projectType,
    created: new Date().toISOString()
  });
  
  await createConfig(projectRoot, configData);
}

// Export default para compatibility
export default {
  generateConfig
};
