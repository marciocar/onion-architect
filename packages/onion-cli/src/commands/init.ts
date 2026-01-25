/**
 * onion init - Inicializar Sistema Onion v4
 * Versão simplificada funcional com TypeScript
 */

import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';

export interface InitOptions {
  debug?: boolean;
}

/**
 * Executa o comando init para criar estrutura Onion v4
 */
export async function init(options: InitOptions = {}): Promise<void> {
  try {
    const projectRoot = process.cwd();

    console.log('');
    console.log(chalk.magenta.bold('🧅 Initializing Onion System v4...'));
    console.log('');

    // 1. Verificar se já existe
    if (fs.existsSync(path.join(projectRoot, '.onion'))) {
      console.log(chalk.yellow('⚠️  .onion/ already exists!'));
      console.log(chalk.gray('Use "onion migrate" to upgrade from v3'));
      process.exit(1);
    }

    // 2. Encontrar a raiz do onion-v4
    const onionRoot = path.resolve(import.meta.dirname, '../../../..');
    const sourceOnion = path.join(onionRoot, '.onion');

    if (!fs.existsSync(sourceOnion)) {
      console.log(chalk.red('❌ Could not find Onion source structure'));
      console.log(chalk.gray(`Expected: ${sourceOnion}`));
      process.exit(1);
    }

    console.log(chalk.cyan('📁 Creating .onion/ structure...'));

    // 3. Copiar estrutura .onion/
    fs.copySync(sourceOnion, path.join(projectRoot, '.onion'), {
      dereference: true, // Resolve symlinks
    });

    console.log(chalk.green('✓ Created .onion/'));

    // 4. Criar .cursor/ para Cursor IDE
    console.log(chalk.cyan('🎯 Setting up Cursor IDE integration...'));

    const cursorDir = path.join(projectRoot, '.cursor');
    fs.ensureDirSync(cursorDir);

    // Copiar estrutura de comandos
    const sourceCursorCommands = path.join(onionRoot, '.cursor/commands');
    if (fs.existsSync(sourceCursorCommands)) {
      fs.copySync(sourceCursorCommands, path.join(cursorDir, 'commands'), {
        dereference: true,
      });
    }

    // Copiar agentes
    const sourceCursorAgents = path.join(onionRoot, '.cursor/agents');
    if (fs.existsSync(sourceCursorAgents)) {
      fs.copySync(sourceCursorAgents, path.join(cursorDir, 'agents'), {
        dereference: true,
      });
    }

    // Copiar regras
    const sourceCursorRules = path.join(onionRoot, '.cursor/rules');
    if (fs.existsSync(sourceCursorRules)) {
      fs.copySync(sourceCursorRules, path.join(cursorDir, 'rules'), {
        dereference: true,
      });
    }

    console.log(chalk.green('✓ Created .cursor/'));

    // 5. Criar .onion-config.yml
    console.log(chalk.cyan('⚙️  Creating configuration...'));

    const config = `# Onion System v4 Configuration
version: 4.0.0
created: ${new Date().toISOString()}
project_type: monorepo

contexts:
  - name: business
    enabled: true
    description: Product specs, features, tasks
  - name: technical
    enabled: true
    description: Development, architecture, PRs

ides:
  - name: cursor
    enabled: true
    path: .cursor/

integrations:
  task_manager:
    provider: none
  transcription:
    provider: none
`;

    fs.writeFileSync(path.join(projectRoot, '.onion-config.yml'), config, 'utf8');

    console.log(chalk.green('✓ Created .onion-config.yml'));

    // 6. Criar README básico
    const readme = `# 🧅 Onion System v4

This project uses Onion System v4 for development.

## Quick Start

### Available Commands

**Business Context:**
\`\`\`
/business/help      # Show all business commands
/business/spec      # Create product spec
/business/task      # Create task
/business/estimate  # Estimate story points
\`\`\`

**Technical Context:**
\`\`\`
/technical/help     # Show all technical commands
/technical/plan     # Plan development
/technical/work     # Start working on task
/technical/pr       # Create pull request
\`\`\`

**Global:**
\`\`\`
/help               # Show global help
\`\`\`

## Documentation

- Full docs: https://github.com/your-org/onion-v4
- Configuration: .onion-config.yml
- Structure: .onion/

## Learn More

- [Installation Guide](https://github.com/your-org/onion-v4/docs/onion/INSTALLATION.md)
- [Release Notes](https://github.com/your-org/onion-v4/docs/onion/RELEASE-NOTES-v4.0-beta.md)
`;

    fs.writeFileSync(path.join(projectRoot, '.onion', 'README.md'), readme, 'utf8');

    // 7. Success!
    console.log('');
    console.log(chalk.green.bold('✅ Onion System initialized successfully!'));
    console.log('');
    console.log(chalk.cyan('📚 Next steps:'));
    console.log('');
    console.log('  1. Restart Cursor IDE');
    console.log('  2. Try a command:');
    console.log(chalk.yellow('     /business/help'));
    console.log(chalk.yellow('     /technical/help'));
    console.log('  3. Start developing:');
    console.log(chalk.yellow('     /business/spec "my-feature"'));
    console.log(chalk.yellow('     /technical/work'));
    console.log('');
    console.log(chalk.gray('Need help? Run: /help'));
    console.log('');
  } catch (error) {
    console.log('');
    console.log(chalk.red.bold('❌ Initialization failed:'));
    console.log(chalk.red(error instanceof Error ? error.message : String(error)));
    console.log('');
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

export default init;
