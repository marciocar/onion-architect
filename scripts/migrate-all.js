#!/usr/bin/env node

/**
 * Script Master de Migração - Onion v4 FASE 2
 * 
 * Executa todos os scripts de migração em sequência:
 * 1. Comandos Business
 * 2. Agentes Business
 * 3. Comandos Technical
 * 4. Agentes Technical
 * 
 * Também cria os .context-config.yml para cada contexto
 */

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const PROJECT_ROOT = process.cwd();

/**
 * Executa um script
 */
function runScript(scriptName) {
  console.log(`\n🎬 Executando: ${scriptName}\n`);
  console.log('═'.repeat(60));
  
  try {
    execSync(`node ${path.join(PROJECT_ROOT, 'scripts', scriptName)}`, {
      stdio: 'inherit',
      cwd: PROJECT_ROOT
    });
    console.log('═'.repeat(60));
    console.log(`✅ ${scriptName} concluído!\n`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao executar ${scriptName}:`, error.message);
    return false;
  }
}

/**
 * Cria .context-config.yml para business
 */
async function createBusinessConfig() {
  console.log('📝 Criando .context-config.yml para business...');
  
  const config = `# Business Context Configuration
# Onion v4.0 - Multi-Context Development Orchestrator

context:
  name: business
  description: Product, Strategy, Planning workflows
  version: "4.0.0"
  created: "2025-12-20"

commands:
  prefix: /business
  levels:
    starter: 5       # 80% dos casos de uso
    intermediate: 10 # 15% dos casos de uso
    advanced: 5      # 5% dos casos de uso

agents:
  - product-agent
  - story-points-specialist
  - extract-meeting-specialist
  - meeting-consolidator
  - presentation-orchestrator
  - branding-specialist
  - pain-price-specialist
  - storytelling-specialist
  - clickup-specialist
  - whisper-specialist
  - task-specialist
  - gamma-specialist

integrations:
  task_manager:
    provider: clickup  # ou asana, linear, none
    config_key: CLICKUP_API_TOKEN
  transcription:
    provider: whisper-local
    config_key: null
  presentation:
    provider: gamma
    config_key: GAMMA_API_TOKEN
  
onboarding:
  estimated_time: 30 minutes
  required_reading:
    - .onion/contexts/business/README.md
    - docs/knowbase/frameworks/framework_story_points.md
  starter_commands:
    - /business/spec "feature-name"
    - /business/task "task-description"
    - /business/estimate "feature"
    - /business/refine "spec.md"
    - /business/warm-up
`;

  const configPath = path.join(PROJECT_ROOT, '.onion/contexts/business/.context-config.yml');
  await fs.writeFile(configPath, config, 'utf8');
  console.log('  ✅ .context-config.yml criado para business\n');
}

/**
 * Cria .context-config.yml para technical
 */
async function createTechnicalConfig() {
  console.log('📝 Criando .context-config.yml para technical...');
  
  const config = `# Technical Context Configuration
# Onion v4.0 - Multi-Context Development Orchestrator

context:
  name: technical
  description: Development, Testing, Git, Documentation workflows
  version: "4.0.0"
  created: "2025-12-20"

commands:
  prefix: /technical
  levels:
    starter: 10      # 80% dos casos de uso
    intermediate: 15 # 15% dos casos de uso
    advanced: 7      # 5% dos casos de uso

agents:
  - react-developer
  - nodejs-specialist
  - postgres-specialist
  - zen-engine-specialist
  - nx-monorepo-specialist
  - nx-migration-specialist
  - gitflow-specialist
  - cursor-specialist
  - c4-architecture-specialist
  - c4-documentation-specialist
  - mermaid-specialist
  - system-doc-orchestrator
  - docs-reverse-engineer
  - linux-security-specialist
  - runflow-specialist
  - test-engineer
  - test-planner
  - test-agent
  - code-reviewer
  - branch-code-reviewer
  - branch-doc-writer
  - branch-metaspec-checker
  - branch-test-planner

integrations:
  version_control:
    provider: git
    strategy: gitflow
  testing:
    unit: jest
    integration: supertest
    e2e: playwright
  documentation:
    format: c4-model
    generator: mermaid
  
onboarding:
  estimated_time: 30 minutes
  required_reading:
    - .onion/contexts/technical/README.md
    - docs/meta-specs/
  starter_commands:
    - /technical/work "task-id"
    - /technical/plan "feature"
    - /technical/pr
    - /technical/sync
    - /technical/docs
`;

  const configPath = path.join(PROJECT_ROOT, '.onion/contexts/technical/.context-config.yml');
  await fs.writeFile(configPath, config, 'utf8');
  console.log('  ✅ .context-config.yml criado para technical\n');
}

/**
 * Main
 */
async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║  🧅 ONION V4 - FASE 2 MIGRATION                          ║');
  console.log('║  Multi-Context Development Orchestrator                  ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n');
  console.log('Este script irá migrar:');
  console.log('  • 20 comandos business (5 starter + 10 intermediate + 5 advanced)');
  console.log('  • 12 agentes business');
  console.log('  • 32 comandos technical (10 starter + 15 intermediate + 7 advanced)');
  console.log('  • 23 agentes technical');
  console.log('  • Criar .context-config.yml para ambos os contextos');
  console.log('\n');
  console.log('Total: 87 arquivos + 2 configs\n');
  console.log('⚠️  IMPORTANTE: Symlinks serão criados automaticamente\n');
  console.log('Pressione Ctrl+C para cancelar ou aguarde 3 segundos...\n');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const startTime = Date.now();
  let success = true;
  
  // 1. Comandos Business
  console.log('\n🎯 ETAPA 1/6: Comandos Business\n');
  if (!runScript('migrate-business-commands.js')) {
    success = false;
  }
  
  // 2. Agentes Business
  console.log('\n🎯 ETAPA 2/6: Agentes Business\n');
  if (!runScript('migrate-business-agents.js')) {
    success = false;
  }
  
  // 3. Config Business
  console.log('\n🎯 ETAPA 3/6: Config Business\n');
  await createBusinessConfig();
  
  // 4. Comandos Technical
  console.log('\n🎯 ETAPA 4/6: Comandos Technical\n');
  if (!runScript('migrate-technical-commands.js')) {
    success = false;
  }
  
  // 5. Agentes Technical
  console.log('\n🎯 ETAPA 5/6: Agentes Technical\n');
  if (!runScript('migrate-technical-agents.js')) {
    success = false;
  }
  
  // 6. Config Technical
  console.log('\n🎯 ETAPA 6/6: Config Technical\n');
  await createTechnicalConfig();
  
  // Resumo Final
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log(`║  ${success ? '✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!' : '⚠️  MIGRAÇÃO CONCLUÍDA COM ERROS'}                 ║`);
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n');
  console.log(`⏱️  Tempo total: ${elapsed}s\n`);
  
  if (success) {
    console.log('🚀 PRÓXIMOS PASSOS:\n');
    console.log('  1. Testar comandos:');
    console.log('     /business/spec "test-feature"');
    console.log('     /technical/work "test-task"');
    console.log('');
    console.log('  2. Testar agentes:');
    console.log('     @product-agent');
    console.log('     @react-developer');
    console.log('');
    console.log('  3. Verificar symlinks:');
    console.log('     ls -la .cursor/commands/product/');
    console.log('     ls -la .cursor/agents/product/');
    console.log('');
  } else {
    console.log('⚠️  Alguns erros ocorreram. Revise os logs acima.\n');
  }
}

main().catch(error => {
  console.error('\n❌ Erro fatal na migração:', error);
  process.exit(1);
});

