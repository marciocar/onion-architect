/**
 * Pretty console logger
 */
import chalk from 'chalk';
import ora, { type Ora } from 'ora';

class Logger {
  private spinner: Ora | null = null;

  // Títulos
  title(text: string): void {
    console.log('\n' + chalk.cyan.bold('━'.repeat(60)));
    console.log(chalk.cyan.bold(`  ${text}`));
    console.log(chalk.cyan.bold('━'.repeat(60)));
  }

  // Seções
  section(text: string): void {
    console.log('\n' + chalk.white.bold(text));
  }

  // Sucesso
  success(text: string): void {
    console.log(chalk.green('✅ ') + text);
  }

  // Info
  info(text: string): void {
    console.log(chalk.blue('ℹ️  ') + text);
  }

  // Warning
  warn(text: string): void {
    console.log(chalk.yellow('⚠️  ') + text);
  }

  // Erro
  error(text: string): void {
    console.log(chalk.red('❌ ') + text);
  }

  // Spinner
  startSpinner(text: string): void {
    this.spinner = ora(text).start();
  }

  stopSpinner(success = true, text: string | null = null): void {
    if (!this.spinner) return;

    if (success) {
      this.spinner.succeed(text ?? undefined);
    } else {
      this.spinner.fail(text ?? undefined);
    }
    this.spinner = null;
  }

  // Lista
  list(items: string[], prefix = '  ∟'): void {
    items.forEach((item) => {
      console.log(chalk.gray(prefix) + ' ' + item);
    });
  }

  // Quebra
  break(): void {
    console.log();
  }
}

export const logger = new Logger();
export default logger;
