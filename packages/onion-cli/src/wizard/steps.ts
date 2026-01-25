/**
 * Wizard steps para onion init
 */
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'node:path';
import {
  AVAILABLE_CONTEXTS,
  SUPPORTED_IDES,
  PROJECT_TYPES,
  type ContextDefinition,
  type IDEDefinition,
  type ProjectType,
} from '../constants.js';

export interface WizardAnswers {
  projectType: string;
  contexts: string[];
  ides: string[];
  taskManager: string;
  transcription: string;
}

export class WizardSteps {
  private projectRoot: string;
  private answers: Partial<WizardAnswers> = {};

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  // Logo
  showWelcome(): void {
    console.clear();
    console.log(chalk.magenta.bold('\n   🧅 ONION SYSTEM SETUP\n'));
    console.log(chalk.cyan('━'.repeat(60)));
    console.log();
  }

  // Step 1/4: Project Type
  async askProjectType(): Promise<string[]> {
    const { projectType } = await inquirer.prompt<{ projectType: string }>([
      {
        type: 'list',
        name: 'projectType',
        message: '1/4 What type of project is this?',
        choices: PROJECT_TYPES.map((type: ProjectType) => ({
          name: `${type.name} - ${type.description}`,
          value: type.id,
        })),
        default: 'monorepo',
      },
    ]);

    this.answers.projectType = projectType;
    const selectedType = PROJECT_TYPES.find((t) => t.id === projectType);
    return selectedType?.defaultContexts || [];
  }

  // Step 2/4: Contexts
  async askContexts(defaultContexts: string[]): Promise<string[]> {
    const { contexts } = await inquirer.prompt<{ contexts: string[] }>([
      {
        type: 'checkbox',
        name: 'contexts',
        message: '2/4 Which contexts do you need?',
        choices: AVAILABLE_CONTEXTS.map((ctx: ContextDefinition) => ({
          name: `${ctx.name} - ${ctx.description}`,
          value: ctx.id,
          checked: defaultContexts.includes(ctx.id),
        })),
        validate: (answer: string[]) => {
          if (answer.length < 1) {
            return 'You must choose at least one context.';
          }
          return true;
        },
      },
    ]);

    this.answers.contexts = contexts;
    return contexts;
  }

  // Step 3/4: IDEs
  async askIDEs(): Promise<string[]> {
    // Detect installed IDEs
    const installedIDEs: string[] = [];
    for (const ide of SUPPORTED_IDES) {
      if (fs.existsSync(path.join(this.projectRoot, ide.detector))) {
        installedIDEs.push(ide.id);
      }
    }

    const { ides } = await inquirer.prompt<{ ides: string[] }>([
      {
        type: 'checkbox',
        name: 'ides',
        message: '3/4 Which IDEs do you use?',
        choices: SUPPORTED_IDES.map((ide: IDEDefinition) => ({
          name: `${ide.name}${installedIDEs.includes(ide.id) ? ' (detected)' : ''}`,
          value: ide.id,
          checked: installedIDEs.includes(ide.id) || ide.id === 'cursor',
        })),
        validate: (answer: string[]) => {
          if (answer.length < 1) {
            return 'You must choose at least one IDE.';
          }
          return true;
        },
      },
    ]);

    this.answers.ides = ides;
    return ides;
  }

  // Step 4/4: Integrations
  async askIntegrations(): Promise<{ taskManager: string; transcription: string }> {
    const { taskManager } = await inquirer.prompt<{ taskManager: string }>([
      {
        type: 'list',
        name: 'taskManager',
        message: '4/4 Task Manager (optional):',
        choices: [
          { name: 'ClickUp', value: 'clickup' },
          { name: 'Asana', value: 'asana' },
          { name: 'Linear', value: 'linear' },
          { name: 'None (skip)', value: 'none' },
        ],
        default: 'none',
      },
    ]);

    const { transcription } = await inquirer.prompt<{ transcription: string }>([
      {
        type: 'list',
        name: 'transcription',
        message: '    Transcription (optional):',
        choices: [
          { name: 'Whisper (local)', value: 'whisper-local' },
          { name: 'None (skip)', value: 'none' },
        ],
        default: 'none',
      },
    ]);

    this.answers.taskManager = taskManager;
    this.answers.transcription = transcription;

    return { taskManager, transcription };
  }

  // Run full wizard
  async run(): Promise<WizardAnswers> {
    this.showWelcome();

    const defaultContexts = await this.askProjectType();
    await this.askContexts(defaultContexts);
    await this.askIDEs();
    await this.askIntegrations();

    return this.answers as WizardAnswers;
  }
}

export default WizardSteps;
