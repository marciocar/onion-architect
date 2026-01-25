/**
 * onion help - Mostrar ajuda
 */
const chalk = require('chalk');

async function helpCommand(command) {
  if (!command) {
    // Ajuda geral
    console.log(`
${chalk.cyan.bold('━'.repeat(60))}
${chalk.magenta.bold('   🧅 ONION SYSTEM CLI')}
${chalk.cyan.bold('━'.repeat(60))}

${chalk.white.bold('Available Commands:')}

  ${chalk.cyan('onion init')}             Initialize Onion System
  ${chalk.cyan('onion add <type> <name>')} Add context or IDE
  ${chalk.cyan('onion migrate')}          Migrate from .cursor/ to .onion/
  ${chalk.cyan('onion validate')}         Validate .onion/ structure
  ${chalk.cyan('onion help [command]')}   Show help

${chalk.white.bold('Examples:')}

  ${chalk.gray('# Initialize new project')}
  ${chalk.cyan('$ onion init')}

  ${chalk.gray('# Add new context')}
  ${chalk.cyan('$ onion add context sales')}

  ${chalk.gray('# Migrate from legacy')}
  ${chalk.cyan('$ onion migrate --backup')}

${chalk.white.bold('Documentation:')}

  ${chalk.blue('https://github.com/your-org/onion-v4')}

${chalk.cyan.bold('━'.repeat(60))}
`);
  } else {
    // Ajuda específica
    console.log(chalk.yellow(`Help for '${command}' not implemented yet`));
  }
}

module.exports = helpCommand;

