/**
 * Pretty console logger
 */
const chalk = require('chalk');
const ora = require('ora');

class Logger {
  constructor() {
    this.spinner = null;
  }
  
  // Títulos
  title(text) {
    console.log('\n' + chalk.cyan.bold('━'.repeat(60)));
    console.log(chalk.cyan.bold(`  ${text}`));
    console.log(chalk.cyan.bold('━'.repeat(60)));
  }
  
  // Seções
  section(text) {
    console.log('\n' + chalk.white.bold(text));
  }
  
  // Sucesso
  success(text) {
    console.log(chalk.green('✅ ') + text);
  }
  
  // Info
  info(text) {
    console.log(chalk.blue('ℹ️  ') + text);
  }
  
  // Warning
  warn(text) {
    console.log(chalk.yellow('⚠️  ') + text);
  }
  
  // Erro
  error(text) {
    console.log(chalk.red('❌ ') + text);
  }
  
  // Spinner
  startSpinner(text) {
    this.spinner = ora(text).start();
  }
  
  stopSpinner(success = true, text = null) {
    if (!this.spinner) return;
    
    if (success) {
      this.spinner.succeed(text);
    } else {
      this.spinner.fail(text);
    }
    this.spinner = null;
  }
  
  // Lista
  list(items, prefix = '  ∟') {
    items.forEach(item => {
      console.log(chalk.gray(prefix) + ' ' + item);
    });
  }
  
  // Quebra
  break() {
    console.log();
  }
}

module.exports = new Logger();

