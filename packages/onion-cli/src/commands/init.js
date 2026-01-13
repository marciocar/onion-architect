/**
 * onion init - Versão Completa com Wizard
 */
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const WizardSteps = require('../wizard/steps');
const LoadersGenerator = require('../generator/loaders');

async function init(options = {}) {
  try {
    const projectRoot = process.cwd();
    
    // 1. Verificar se já existe
    if (fs.existsSync(path.join(projectRoot, '.onion'))) {
      console.log(chalk.yellow('\n⚠️  .onion/ already exists!'));
      console.log(chalk.gray('Use "onion migrate" to upgrade from v3\n'));
      process.exit(1);
    }
    
    // 2. Executar wizard
    const wizard = new WizardSteps(projectRoot);
    const answers = await wizard.run();
    
    console.log('');
    console.log(chalk.magenta.bold('🧅 Creating Onion System...'));
    console.log('');
    
    // 3. Encontrar a raiz do onion-v4
    const onionRoot = path.resolve(__dirname, '../../../..');
    const sourceOnion = path.join(onionRoot, '.onion');
    
    if (!fs.existsSync(sourceOnion)) {
      console.log(chalk.red('❌ Could not find Onion source structure'));
      console.log(chalk.gray(`Expected: ${sourceOnion}`));
      process.exit(1);
    }
    
    // 4. Criar estrutura .onion/
    console.log(chalk.cyan('📁 Creating .onion/ structure...'));
    
    // Core
    fs.copySync(
      path.join(sourceOnion, 'core'),
      path.join(projectRoot, '.onion', 'core'),
      { dereference: true }
    );
    
    // Contexts selecionados
    fs.ensureDirSync(path.join(projectRoot, '.onion', 'contexts'));
    
    for (const contextName of answers.contexts) {
      const sourceContext = path.join(sourceOnion, 'contexts', contextName);
      if (fs.existsSync(sourceContext)) {
        fs.copySync(
          sourceContext,
          path.join(projectRoot, '.onion', 'contexts', contextName),
          { dereference: true }
        );
        console.log(chalk.green(`  ✓ ${contextName} context`));
      }
    }
    
    // 5. Criar .cursor/ se Cursor foi selecionado
    if (answers.ides.includes('cursor')) {
      console.log(chalk.cyan('🎯 Setting up Cursor IDE...'));
      
      const cursorDir = path.join(projectRoot, '.cursor');
      fs.ensureDirSync(cursorDir);
      
      // Copiar estrutura de comandos
      const sourceCursorCommands = path.join(onionRoot, '.cursor/commands');
      if (fs.existsSync(sourceCursorCommands)) {
        fs.copySync(
          sourceCursorCommands,
          path.join(cursorDir, 'commands'),
          { dereference: true }
        );
      }
      
      // Copiar agentes
      const sourceCursorAgents = path.join(onionRoot, '.cursor/agents');
      if (fs.existsSync(sourceCursorAgents)) {
        fs.copySync(
          sourceCursorAgents,
          path.join(cursorDir, 'agents'),
          { dereference: true }
        );
      }
      
      // Copiar regras
      const sourceCursorRules = path.join(onionRoot, '.cursor/rules');
      if (fs.existsSync(sourceCursorRules)) {
        fs.copySync(
          sourceCursorRules,
          path.join(cursorDir, 'rules'),
          { dereference: true }
        );
      }
      
      console.log(chalk.green('  ✓ Cursor integration'));
    }
    
    // 6. Criar .onion-config.yml
    console.log(chalk.cyan('⚙️  Creating configuration...'));
    
    const config = `# Onion System v4 Configuration
version: 4.0.0
created: ${new Date().toISOString()}
project_type: ${answers.projectType}

contexts:
${answers.contexts.map(ctx => `  - name: ${ctx}
    enabled: true`).join('\n')}

ides:
${answers.ides.map(ide => `  - name: ${ide}
    enabled: true`).join('\n')}

integrations:
  task_manager:
    provider: ${answers.taskManager}
${answers.taskManager !== 'none' ? `    config_key: ${answers.taskManager.toUpperCase()}_API_TOKEN` : ''}
  transcription:
    provider: ${answers.transcription}
`;

    fs.writeFileSync(
      path.join(projectRoot, '.onion-config.yml'),
      config,
      'utf8'
    );
    
    console.log(chalk.green('  ✓ Configuration created'));
    
    // 6.5. Gerar loaders de IDE
    if (answers.ides && answers.ides.length > 0) {
      console.log(chalk.cyan('🔌 Generating IDE loaders...'));
      try {
        const loaderConfig = {
          contexts: answers.contexts,
          ides: answers.ides
        };
        const loadersGen = new LoadersGenerator(projectRoot, loaderConfig);
        await loadersGen.generate();
        console.log(chalk.green('  ✓ IDE loaders created'));
      } catch (err) {
        console.log(chalk.yellow('  ⚠️  Could not generate IDE loaders: ' + err.message));
        if (options.debug) {
          console.error(err);
        }
      }
    }
    
    // 7. Criar README
    const readme = `# 🧅 Onion System v4

This project uses Onion System v4 with:
- **Contexts**: ${answers.contexts.join(', ')}
- **IDEs**: ${answers.ides.join(', ')}
- **Type**: ${answers.projectType}

## Quick Start

${answers.contexts.includes('business') ? `### Business Context
\`\`\`
/business/help      # Show all business commands
/business/spec      # Create product spec
/business/task      # Create task
\`\`\`
` : ''}
${answers.contexts.includes('technical') ? `### Technical Context
\`\`\`
/technical/help     # Show all technical commands
/technical/plan     # Plan development
/technical/work     # Start working
/technical/pr       # Create PR
\`\`\`
` : ''}
## Documentation

- Configuration: .onion-config.yml
- Docs: https://github.com/your-org/onion-v4
`;

    fs.writeFileSync(
      path.join(projectRoot, '.onion', 'README.md'),
      readme,
      'utf8'
    );
    
    // 8. Success!
    console.log('');
    console.log(chalk.green.bold('✅ Onion System initialized successfully!'));
    console.log('');
    console.log(chalk.cyan('📚 Next steps:'));
    console.log('');
    console.log('  1. ' + chalk.white('Restart your IDE') + chalk.gray(` (${answers.ides.join(', ')})`));
    console.log('  2. ' + chalk.white('Try a command:'));
    
    if (answers.contexts.includes('business')) {
      console.log(chalk.yellow('     /business/help'));
    }
    if (answers.contexts.includes('technical')) {
      console.log(chalk.yellow('     /technical/help'));
    }
    
    console.log('  3. ' + chalk.white('Read the docs:'));
    console.log(chalk.gray('     cat .onion/README.md'));
    console.log('');
    
    if (answers.taskManager !== 'none') {
      console.log(chalk.yellow('⚠️  Remember to set: ' + chalk.white(`${answers.taskManager.toUpperCase()}_API_TOKEN`)));
      console.log('');
    }
    
  } catch (error) {
    console.log('');
    console.log(chalk.red.bold('❌ Initialization failed:'));
    console.log(chalk.red(error.message));
    console.log('');
    if (options.debug) {
      console.error(error);
    }
    process.exit(1);
  }
}

module.exports = init;
