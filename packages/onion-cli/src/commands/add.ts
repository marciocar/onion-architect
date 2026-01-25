/**
 * @fileoverview onion add - Adicionar contextos ou IDEs ao projeto
 * @module commands/add
 *
 * Princípios:
 * - Reutiliza core/* e generator/*
 * - ZERO acoplamento com init
 * - Suporta múltiplos tipos de adições
 */

import inquirer from 'inquirer';
import path from 'node:path';
import fs from 'fs-extra';
import { logger } from '../utils/logger.js';
import {
  detectOnionV4Structure,
  type OnionV4Structure,
} from '../core/detector.js';
import * as coreConfig from '../core/config.js';
import * as coreValidator from '../core/validator.js';
import * as generatorStructure from '../generator/structure.js';
import { LoadersGenerator } from '../generator/loaders.js';

export interface AddOptions {
  debug?: boolean;
}

/**
 * Comando add - Menu principal
 */
export async function add(options: AddOptions = {}): Promise<void> {
  try {
    const projectRoot = process.cwd();

    // 1. Detectar projeto v4
    const project = await detectOnionV4Structure(projectRoot);

    if (!project) {
      logger.error('❌ This is not an Onion v4 project');
      logger.info('Run "onion init" first to initialize the system');
      process.exit(1);
    }

    logger.title('🧅 Add to Onion System');
    logger.break();

    // 2. Menu de opções
    const { type } = await inquirer.prompt<{ type: string }>([
      {
        type: 'list',
        name: 'type',
        message: 'What would you like to add?',
        choices: [
          { name: '📦 New Context', value: 'context' },
          { name: '💻 New IDE Integration', value: 'ide' },
          { name: '❌ Cancel', value: 'cancel' },
        ],
      },
    ]);

    if (type === 'cancel') {
      logger.info('Cancelled');
      return;
    }

    // 3. Executar ação escolhida
    if (type === 'context') {
      await addContext(project);
    } else if (type === 'ide') {
      await addIDE(project);
    }
  } catch (error) {
    logger.break();
    logger.error('❌ Add command failed:');
    logger.error((error as Error).message);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Adiciona novo contexto
 */
async function addContext(project: OnionV4Structure): Promise<void> {
  const { contextName } = await inquirer.prompt<{ contextName: string }>([
    {
      type: 'input',
      name: 'contextName',
      message: 'Context name (lowercase, e.g., "customer-success"):',
      validate: (input: string) => {
        try {
          coreValidator.validateContextName(input);
          return true;
        } catch (err) {
          return (err as Error).message;
        }
      },
    },
  ]);

  // Ler config atual
  const config = await coreConfig.readConfig(project.root);

  // Verificar se já existe
  if (config.contexts.includes(contextName)) {
    logger.error(`❌ Context "${contextName}" already exists`);
    process.exit(1);
  }

  // Perguntar tipo de contexto
  const { contextType } = await inquirer.prompt<{ contextType: string }>([
    {
      type: 'list',
      name: 'contextType',
      message: 'Context type:',
      choices: [
        { name: '📊 Business/Product', value: 'business' },
        { name: '⚙️  Technical/Engineering', value: 'technical' },
        { name: '🎨 Custom', value: 'custom' },
      ],
    },
  ]);

  logger.break();
  logger.startSpinner(`Creating context "${contextName}"...`);

  try {
    // 1. Gerar estrutura do contexto
    await generatorStructure.generateContextStructure(project.root, contextName, {
      includeREADME: true,
      includeConfig: true,
    });

    // 2. Gerar comandos starter
    await generatorStructure.generateStarterCommands(project.root, contextName, contextType);

    // 3. Atualizar config
    await coreConfig.addContext(project.root, contextName);

    // 4. Atualizar loaders dos IDEs configurados
    for (const ide of config.ides) {
      // Regenerar loader com novo contexto
      const loaderConfig = {
        contexts: config.contexts,
        ides: [ide],
      };
      const loadersGen = new LoadersGenerator(project.root, loaderConfig);
      await loadersGen.generateIDELoader(ide);

      // Executar loader para sincronizar imediatamente (Cursor)
      if (ide === 'cursor') {
        try {
          const loaderPath = path.join(project.root, '.onion/ide/cursor/onion-loader.js');
          if (fs.existsSync(loaderPath)) {
            // Dynamic import for the loader
            const loaderModule = await import(loaderPath);
            const loader = loaderModule.getLoader(project.root);
            loader.syncToCursor();
          }
        } catch {
          // Silencioso - loader pode não estar disponível ainda
        }
      }
    }

    logger.stopSpinner(true, `Context "${contextName}" created successfully`);
    logger.break();

    // Next steps
    logger.success('Next steps:');
    logger.info(`  1. Explore: /${contextName}/help`);
    logger.info(`  2. Add commands: .onion/contexts/${contextName}/commands/`);
    logger.info(`  3. Add agents: .onion/contexts/${contextName}/agents/`);
    logger.break();
  } catch (error) {
    logger.stopSpinner(false, 'Failed to create context');
    throw error;
  }
}

/**
 * Adiciona novo IDE
 */
async function addIDE(project: OnionV4Structure): Promise<void> {
  // Ler config atual
  const config = await coreConfig.readConfig(project.root);

  // IDEs disponíveis
  const availableIDEs = ['cursor', 'windsurf', 'claude'];
  const notConfigured = availableIDEs.filter((ide) => !config.ides.includes(ide));

  if (notConfigured.length === 0) {
    logger.warn('⚠️  All supported IDEs are already configured');
    logger.info('Configured IDEs: ' + config.ides.join(', '));
    return;
  }

  const { ideName } = await inquirer.prompt<{ ideName: string }>([
    {
      type: 'list',
      name: 'ideName',
      message: 'Which IDE would you like to add?',
      choices: notConfigured.map((ide) => ({
        name: capitalizeFirst(ide),
        value: ide,
      })),
    },
  ]);

  logger.break();
  logger.startSpinner(`Configuring ${ideName}...`);

  try {
    // 1. Gerar loader do IDE usando LoadersGenerator
    const loaderConfig = {
      contexts: config.contexts,
      ides: [ideName],
    };
    const loadersGen = new LoadersGenerator(project.root, loaderConfig);
    await loadersGen.generateIDELoader(ideName);

    // 2. Atualizar config
    await coreConfig.addIDE(project.root, ideName);

    // 3. Executar loader para sincronizar (Cursor)
    if (ideName === 'cursor') {
      try {
        const loaderPath = path.join(project.root, '.onion/ide/cursor/onion-loader.js');
        if (fs.existsSync(loaderPath)) {
          const loaderModule = await import(loaderPath);
          const loader = loaderModule.getLoader(project.root);
          const result = loader.syncToCursor();
          logger.info(`   Synced ${result.commandsSynced} commands and ${result.agentsSynced} agents`);
        }
      } catch (err) {
        logger.warn(`   Could not sync: ${(err as Error).message}`);
      }
    }

    logger.stopSpinner(true, `IDE "${ideName}" configured successfully`);
    logger.break();

    // Next steps
    logger.success('Next steps:');
    if (ideName === 'cursor') {
      logger.info('  1. Restart Cursor to load commands');
      logger.info('  2. Test: Run any command like /business/help');
    } else if (ideName === 'windsurf') {
      logger.info('  1. Restart Windsurf');
      logger.info('  2. Commands will be available via Windsurf interface');
    } else if (ideName === 'claude') {
      logger.info('  1. Restart Claude Code');
      logger.info('  2. Commands available via @onion agent');
    }
    logger.break();
  } catch (error) {
    logger.stopSpinner(false, 'Failed to configure IDE');
    throw error;
  }
}

/**
 * Helper: Capitalizar primeira letra
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default add;
