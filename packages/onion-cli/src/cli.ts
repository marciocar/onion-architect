#!/usr/bin/env node

/**
 * Onion CLI - Entry Point
 * Sistema Onion v4 - Multi-Context Development Orchestrator
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { init } from './commands/init.js';
import { ONION_VERSION } from './constants.js';

// Criar instância do programa
const program = new Command();

// Logo
console.log('');
console.log(chalk.magenta('🧅 Onion System CLI'));
console.log(chalk.gray(`v${ONION_VERSION} - Multi-Context Development Orchestrator`));
console.log('');

// Configurar CLI
program
  .name('onion')
  .description('CLI for Onion System - Multi-Context Development Orchestrator')
  .version(ONION_VERSION);

// Comando: init
program
  .command('init')
  .description('Initialize new Onion project')
  .option('-d, --debug', 'Enable debug mode')
  .action(async (options: { debug?: boolean }) => {
    await init(options);
  });

// Comando: add
program
  .command('add')
  .description('Add context or IDE to existing project')
  .option('-d, --debug', 'Enable debug mode')
  .action(() => {
    console.log(chalk.yellow('⚠️  Command implementation in progress'));
  });

// Comando: migrate
program
  .command('migrate')
  .description('Migrate from Onion v3 to v4')
  .option('--no-backup', 'Skip backup creation')
  .option('-d, --debug', 'Enable debug mode')
  .action(() => {
    console.log(chalk.yellow('⚠️  Command implementation in progress'));
  });

// Comando: validate
program
  .command('validate')
  .description('Validate Onion structure (coming soon)')
  .action(() => {
    console.log(chalk.yellow('⚠️  Command coming soon in next release!'));
  });

// Parse arguments
program.parse(process.argv);
