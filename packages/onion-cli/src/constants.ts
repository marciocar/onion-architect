/**
 * Constantes do Sistema Onion
 */

export const ONION_VERSION = '4.1.0-beta.2';
export const CONFIG_VERSION = '1.0.0';

export const ONION_ROOT = '.onion';
export const CONFIG_FILE = '.onion-config.yml';

// Tipos para contextos
export interface ContextDefinition {
  id: string;
  name: string;
  description: string;
  default: boolean;
}

// Contextos disponíveis
export const AVAILABLE_CONTEXTS: ContextDefinition[] = [
  {
    id: 'business',
    name: 'Business',
    description: 'Product specs, features, tasks',
    default: true,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Development, architecture, PR',
    default: true,
  },
  {
    id: 'customer-success',
    name: 'Customer Success',
    description: 'Support, docs, onboarding',
    default: false,
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description: 'Audit, security, legal',
    default: false,
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Proposals, demos, pipeline',
    default: false,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Campaigns, content, analytics',
    default: false,
  },
];

// Tipos para IDEs
export interface IDEDefinition {
  id: string;
  name: string;
  detector: string;
  loader: string;
  configFile: string;
}

// IDEs suportados
export const SUPPORTED_IDES: IDEDefinition[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    detector: '.cursor',
    loader: 'cursor.js',
    configFile: 'settings.json',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    detector: '.windsurf',
    loader: 'windsurf.ts',
    configFile: 'settings.yml',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    detector: '.claude',
    loader: 'claude.py',
    configFile: 'config.json',
  },
  {
    id: 'vscode',
    name: 'VS Code (GitHub Copilot)',
    detector: '.vscode',
    loader: 'vscode.js',
    configFile: 'settings.json',
  },
  {
    id: 'cline',
    name: 'Cline (VS Code)',
    detector: '.vscode/extensions',
    loader: 'cline.js',
    configFile: 'cline-config.json',
  },
];

// Tipos para integrações
export interface IntegrationOption {
  id: string;
  name: string;
}

export interface OptionalIntegrations {
  taskManager: IntegrationOption[];
  transcription: IntegrationOption[];
}

// Integrações opcionais
export const OPTIONAL_INTEGRATIONS: OptionalIntegrations = {
  taskManager: [
    { id: 'clickup', name: 'ClickUp' },
    { id: 'asana', name: 'Asana' },
    { id: 'linear', name: 'Linear' },
    { id: 'jira', name: 'Jira' },
    { id: 'none', name: 'None (skip)' },
  ],
  transcription: [
    { id: 'whisper-local', name: 'Whisper (local)' },
    { id: 'assemblyai', name: 'AssemblyAI (API)' },
    { id: 'deepgram', name: 'Deepgram (API)' },
    { id: 'none', name: 'None (skip)' },
  ],
};

// Tipos para project types
export interface ProjectType {
  id: string;
  name: string;
  description: string;
  defaultContexts: string[];
}

// Templates
export const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'monorepo',
    name: 'Monorepo',
    description: 'Multiple contexts (business, technical, CS)',
    defaultContexts: ['business', 'technical'],
  },
  {
    id: 'single-app',
    name: 'Single App',
    description: 'One context only',
    defaultContexts: ['technical'],
  },
  {
    id: 'library',
    name: 'Library',
    description: 'No contexts, just core',
    defaultContexts: [],
  },
];

// Export all as CONSTANTS object for backward compatibility
export const CONSTANTS = {
  ONION_VERSION,
  CONFIG_VERSION,
  ONION_ROOT,
  CONFIG_FILE,
  AVAILABLE_CONTEXTS,
  SUPPORTED_IDES,
  OPTIONAL_INTEGRATIONS,
  PROJECT_TYPES,
} as const;
