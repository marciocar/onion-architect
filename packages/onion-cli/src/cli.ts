#!/usr/bin/env node

/**
 * Onion CLI - Entry Point
 * Sistema Onion v4 - Multi-Context Development Orchestrator
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { init } from './commands/init.js';
import { add } from './commands/add.js';
import { migrate } from './commands/migrate.js';
import { validate } from './commands/validate.js';
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
  .option('-f, --force', 'Force reinitialize, overwriting existing files')
  .action(async (options: { debug?: boolean; force?: boolean }) => {
    await init(options);
  });

// Comando: add
program
  .command('add')
  .description('Add context or IDE to existing project')
  .option('-d, --debug', 'Enable debug mode')
  .action(async (options: { debug?: boolean }) => {
    await add(options);
  });

// Comando: migrate
program
  .command('migrate')
  .description('Migrate from Onion v3 to v4')
  .option('--no-backup', 'Skip backup creation')
  .option('-d, --debug', 'Enable debug mode')
  .action(async (options: { debug?: boolean; noBackup?: boolean }) => {
    await migrate(options);
  });

// Comando: validate
program
  .command('validate')
  .description('Validate Onion structure')
  .option('-d, --debug', 'Enable debug mode')
  .action(async (options: { debug?: boolean }) => {
    await validate(options);
  });

// Parse arguments
program.parse(process.argv);
