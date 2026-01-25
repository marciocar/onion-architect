/**
 * @fileoverview onion add - Adicionar contextos ou IDEs ao projeto
 * @module commands/add
 * 
 * Princípios:
 * - Reutiliza core/* e generator/*
 * - ZERO acoplamento com init
 * - Suporta múltiplos tipos de adições
 */

const inquirer = require('inquirer');
const logger = require('../utils/logger');
const LoadersGenerator = require('../generator/loaders');
const path = require('path');
const fs = require('fs');

// Dynamic imports para módulos ES6 (carregados no topo)
let coreDetector, coreConfig, coreValidator, generatorStructure;

async function loadES6Modules() {
  if (!coreDetector) {
    coreDetector = await import('../core/detector.js');
    coreConfig = await import('../core/config.js');
    coreValidator = await import('../core/validator.js');
    generatorStructure = await import('../generator/structure.js');
  }
}

/**
 * Comando add - Menu principal
 * 
 * @param {Object} options - Opções do comando
 * @returns {Promise<void>}
 */
async function add(options = {}) {
  try {
    // Carregar módulos ES6
    await loadES6Modules();
    
    const projectRoot = process.cwd();
    
    // 1. Detectar projeto v4
    const project = await coreDetector.detectOnionV4Structure(projectRoot);
    
    if (!project) {
      logger.error('❌ This is not an Onion v4 project');
      logger.info('Run "onion init" first to initialize the system');
      process.exit(1);
    }
    
    logger.title('🧅 Add to Onion System');
    logger.break();
    
    // 2. Menu de opções
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What would you like to add?',
        choices: [
          { name: '📦 New Context', value: 'context' },
          { name: '💻 New IDE Integration', value: 'ide' },
          { name: '❌ Cancel', value: 'cancel' }
        ]
      }
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
    logger.error(error.message);
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Adiciona novo contexto
 * 
 * @private
 * @param {Object} project - Estrutura do projeto detectada
 * @returns {Promise<void>}
 */
async function addContext(project) {
  const { contextName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'contextName',
      message: 'Context name (lowercase, e.g., "customer-success"):',
      validate: (input) => {
        try {
          coreValidator.validateContextName(input);
          return true;
        } catch (err) {
          return err.message;
        }
      }
    }
  ]);
  
  // Ler config atual
  const config = await coreConfig.readConfig(project.root);
  
  // Verificar se já existe
  if (config.contexts.includes(contextName)) {
    logger.error(`❌ Context "${contextName}" already exists`);
    process.exit(1);
  }
  
  // Perguntar tipo de contexto
  const { contextType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'contextType',
      message: 'Context type:',
      choices: [
        { name: '📊 Business/Product', value: 'business' },
        { name: '⚙️  Technical/Engineering', value: 'technical' },
        { name: '🎨 Custom', value: 'custom' }
      ]
    }
  ]);
  
  logger.break();
  logger.startSpinner(`Creating context "${contextName}"...`);
  
  try {
    // 1. Gerar estrutura do contexto
    await generatorStructure.generateContextStructure(project.root, contextName, {
      includeREADME: true,
      includeConfig: true
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
        ides: [ide]
      };
      const loadersGen = new LoadersGenerator(project.root, loaderConfig);
      await loadersGen.generateIDELoader(ide);
      
      // Executar loader para sincronizar imediatamente (Cursor)
      if (ide === 'cursor') {
        try {
          const loaderPath = path.join(project.root, '.onion/ide/cursor/onion-loader.js');
          if (fs.existsSync(loaderPath)) {
            const { getLoader } = require(loaderPath);
            const loader = getLoader(project.root);
            loader.syncToCursor();
          }
        } catch (err) {
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
 * 
 * @private
 * @param {Object} project - Estrutura do projeto detectada
 * @returns {Promise<void>}
 */
async function addIDE(project) {
  // Ler config atual
  const config = await coreConfig.readConfig(project.root);
  
  // IDEs disponíveis
  const availableIDEs = ['cursor', 'windsurf', 'claude'];
  const notConfigured = availableIDEs.filter(ide => !config.ides.includes(ide));
  
  if (notConfigured.length === 0) {
    logger.warn('⚠️  All supported IDEs are already configured');
    logger.info('Configured IDEs: ' + config.ides.join(', '));
    return;
  }
  
  const { ideName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'ideName',
      message: 'Which IDE would you like to add?',
      choices: notConfigured.map(ide => ({
        name: capitalizeFirst(ide),
        value: ide
      }))
    }
  ]);
  
  logger.break();
  logger.startSpinner(`Configuring ${ideName}...`);
  
  try {
    // 1. Gerar loader do IDE usando LoadersGenerator
    const loaderConfig = {
      contexts: config.contexts,
      ides: [ideName]
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
          const { getLoader } = require(loaderPath);
          const loader = getLoader(project.root);
          const result = loader.syncToCursor();
          logger.info(`   Synced ${result.commandsSynced} commands and ${result.agentsSynced} agents`);
        }
      } catch (err) {
        logger.warn(`   Could not sync: ${err.message}`);
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
 * @private
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = add;
