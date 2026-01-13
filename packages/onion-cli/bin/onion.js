#!/usr/bin/env node

/**
 * Onion CLI - Entry Point
 */

const { program } = require('commander');
const chalk = require('chalk');
const pkg = require('../package.json');

// Logo
console.log('');
console.log(chalk.magenta('🧅 Onion System CLI'));
console.log(chalk.gray(`v${pkg.version} - Multi-Context Development Orchestrator`));
console.log('');

// Configure CLI
program
  .name('onion')
  .description('CLI for Onion System - Multi-Context Development Orchestrator')
  .version(pkg.version);

// Commands
program
  .command('init')
  .description('Initialize new Onion project with interactive wizard')
  .option('-d, --debug', 'Enable debug mode')
  .action(async (options) => {
    const init = require('../src/commands/init');
    await init(options);
  });

program
  .command('add')
  .description('Add context or IDE to existing project')
  .option('-d, --debug', 'Enable debug mode')
  .action(async (options) => {
    try {
      const add = require('../src/commands/add');
      await add(options);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      if (options.debug) {
        console.error(error);
      }
      process.exit(1);
    }
  });

program
  .command('migrate')
  .description('Migrate from Onion v3 to v4')
  .option('--no-backup', 'Skip backup creation')
  .option('-d, --debug', 'Enable debug mode')
  .action(async (options) => {
    try {
      const migrate = require('../src/commands/migrate');
      await migrate(options);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      if (options.debug) {
        console.error(error);
      }
      process.exit(1);
    }
  });

// Parse arguments
program.parse(process.argv);
