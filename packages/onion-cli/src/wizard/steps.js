/**
 * Wizard steps para onion init - VERSÃO COMMONJS
 */
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

// Import constants
const AVAILABLE_CONTEXTS = [
  {
    id: 'business',
    name: 'Business',
    description: 'Product specs, features, tasks',
    default: true
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Development, architecture, PR',
    default: true
  },
  {
    id: 'customer-success',
    name: 'Customer Success',
    description: 'Support, docs, onboarding',
    default: false
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description: 'Audit, security, legal',
    default: false
  }
];

const SUPPORTED_IDES = [
  {
    id: 'cursor',
    name: 'Cursor',
    detector: '.cursor'
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    detector: '.windsurf'
  }
];

const PROJECT_TYPES = [
  {
    id: 'monorepo',
    name: 'Monorepo',
    description: 'Multiple contexts (business, technical, CS)',
    defaultContexts: ['business', 'technical']
  },
  {
    id: 'single-app',
    name: 'Single App',
    description: 'One context only',
    defaultContexts: ['technical']
  }
];

class WizardSteps {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.answers = {};
  }
  
  // Logo
  showWelcome() {
    console.clear();
    console.log(chalk.magenta.bold('\n   🧅 ONION SYSTEM SETUP\n'));
    console.log(chalk.cyan('━'.repeat(60)));
    console.log();
  }
  
  // Step 1/4: Project Type
  async askProjectType() {
    const { projectType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'projectType',
        message: '1/4 What type of project is this?',
        choices: PROJECT_TYPES.map(type => ({
          name: `${type.name} - ${type.description}`,
          value: type.id
        })),
        default: 'monorepo'
      }
    ]);
    
    this.answers.projectType = projectType;
    const selectedType = PROJECT_TYPES.find(t => t.id === projectType);
    return selectedType.defaultContexts;
  }
  
  // Step 2/4: Contexts
  async askContexts(defaultContexts) {
    const { contexts } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'contexts',
        message: '2/4 Which contexts do you need?',
        choices: AVAILABLE_CONTEXTS.map(ctx => ({
          name: `${ctx.name} - ${ctx.description}`,
          value: ctx.id,
          checked: defaultContexts.includes(ctx.id)
        })),
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must choose at least one context.';
          }
          return true;
        }
      }
    ]);
    
    this.answers.contexts = contexts;
    return contexts;
  }
  
  // Step 3/4: IDEs
  async askIDEs() {
    // Detect installed IDEs
    const installedIDEs = [];
    for (const ide of SUPPORTED_IDES) {
      if (fs.existsSync(path.join(this.projectRoot, ide.detector))) {
        installedIDEs.push(ide.id);
      }
    }
    
    const { ides } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'ides',
        message: '3/4 Which IDEs do you use?',
        choices: SUPPORTED_IDES.map(ide => ({
          name: `${ide.name}${installedIDEs.includes(ide.id) ? ' (detected)' : ''}`,
          value: ide.id,
          checked: installedIDEs.includes(ide.id) || ide.id === 'cursor'
        })),
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must choose at least one IDE.';
          }
          return true;
        }
      }
    ]);
    
    this.answers.ides = ides;
    return ides;
  }
  
  // Step 4/4: Integrations
  async askIntegrations() {
    const { taskManager } = await inquirer.prompt([
      {
        type: 'list',
        name: 'taskManager',
        message: '4/4 Task Manager (optional):',
        choices: [
          { name: 'ClickUp', value: 'clickup' },
          { name: 'Asana', value: 'asana' },
          { name: 'Linear', value: 'linear' },
          { name: 'None (skip)', value: 'none' }
        ],
        default: 'none'
      }
    ]);
    
    const { transcription } = await inquirer.prompt([
      {
        type: 'list',
        name: 'transcription',
        message: '    Transcription (optional):',
        choices: [
          { name: 'Whisper (local)', value: 'whisper-local' },
          { name: 'None (skip)', value: 'none' }
        ],
        default: 'none'
      }
    ]);
    
    this.answers.taskManager = taskManager;
    this.answers.transcription = transcription;
    
    return { taskManager, transcription };
  }
  
  // Run full wizard
  async run() {
    this.showWelcome();
    
    const defaultContexts = await this.askProjectType();
    await this.askContexts(defaultContexts);
    await this.askIDEs();
    await this.askIntegrations();
    
    return this.answers;
  }
}

module.exports = WizardSteps;
