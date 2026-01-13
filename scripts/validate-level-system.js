#!/usr/bin/env node

/**
 * Script de Validação - Sistema de Níveis Onion v4
 * 
 * Valida:
 * 1. Help commands existem e estão corretos
 * 2. Comandos starter têm "Próximos Passos"
 * 3. Comandos inter/adv têm "Pré-requisitos"
 * 4. Documentação existe e está completa
 * 5. READMEs referenciam sistema de níveis
 */

const fs = require('fs-extra');
const path = require('path');

const ROOT = process.cwd();
let errors = [];
let warnings = [];
let passed = 0;

function test(description, condition) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${description}`);
    return true;
  } else {
    errors.push(description);
    console.log(`  ❌ ${description}`);
    return false;
  }
}

function warn(description) {
  warnings.push(description);
  console.log(`  ⚠️  ${description}`);
}

async function validateHelpCommands() {
  console.log('\n📋 Validando Help Commands...\n');
  
  const helps = [
    '.onion/core/commands/help.md',
    '.onion/contexts/business/commands/help.md',
    '.onion/contexts/technical/commands/help.md'
  ];
  
  for (const helpPath of helps) {
    const fullPath = path.join(ROOT, helpPath);
    const exists = await fs.pathExists(fullPath);
    test(`${helpPath} existe`, exists);
    
    if (exists) {
      const content = await fs.readFile(fullPath, 'utf8');
      test(`  └─ Tem seção "Sistema de Níveis"`, content.includes('Sistema de Níveis') || content.includes('Níveis'));
      test(`  └─ Tem referência a filosofia 80/15/5`, content.includes('80') && content.includes('15') && content.includes('5'));
      test(`  └─ Tem tempos de onboarding`, content.includes('min') || content.includes('minutos'));
    }
  }
}

async function validateStarterCommands() {
  console.log('\n🌟 Validando Comandos Starter...\n');
  
  const starters = [
    'business/commands/starter/spec.md',
    'business/commands/starter/task.md',
    'business/commands/starter/estimate.md',
    'business/commands/starter/refine.md',
    'business/commands/starter/warm-up.md',
    'technical/commands/starter/work.md',
    'technical/commands/starter/plan.md',
    'technical/commands/starter/pr.md',
    'technical/commands/starter/warm-up.md',
    'technical/commands/starter/docs.md',
    'technical/commands/starter/sync.md',
    'technical/commands/starter/init.md',
    'technical/commands/starter/help.md'
  ];
  
  let startersWithNextSteps = 0;
  
  for (const starter of starters) {
    const fullPath = path.join(ROOT, '.onion/contexts', starter);
    if (await fs.pathExists(fullPath)) {
      const content = await fs.readFile(fullPath, 'utf8');
      if (content.includes('🚀 Próximos Passos')) {
        startersWithNextSteps++;
        test(`${path.basename(starter)} tem "Próximos Passos"`, true);
      } else {
        test(`${path.basename(starter)} tem "Próximos Passos"`, false);
      }
    } else {
      warn(`${starter} não encontrado`);
    }
  }
  
  console.log(`\n  📊 ${startersWithNextSteps}/${starters.length} starters com descoberta progressiva`);
}

async function validateIntermediateAdvanced() {
  console.log('\n🔧 Validando Comandos Intermediate/Advanced...\n');
  
  const interAdv = [
    'business/commands/intermediate/feature.md',
    'business/commands/intermediate/extract-meeting.md',
    'business/commands/intermediate/consolidate-meetings.md',
    'business/commands/intermediate/convert-to-tasks.md',
    'business/commands/intermediate/light-arch.md',
    'business/commands/advanced/presentation.md',
    'business/commands/advanced/transform-consolidated.md',
    'business/commands/advanced/analyze-pain-price.md',
    'technical/commands/intermediate/start.md',
    'technical/commands/intermediate/pre-pr.md',
    'technical/commands/intermediate/build-index.md',
    'technical/commands/intermediate/unit.md',
    'technical/commands/intermediate/integration.md',
    'technical/commands/advanced/bump.md',
    'technical/commands/advanced/e2e.md'
  ];
  
  let withPrereqs = 0;
  
  for (const cmd of interAdv) {
    const fullPath = path.join(ROOT, '.onion/contexts', cmd);
    if (await fs.pathExists(fullPath)) {
      const content = await fs.readFile(fullPath, 'utf8');
      if (content.includes('📚 Pré-requisitos')) {
        withPrereqs++;
        test(`${path.basename(cmd)} tem "Pré-requisitos"`, true);
      } else {
        test(`${path.basename(cmd)} tem "Pré-requisitos"`, false);
      }
    } else {
      warn(`${cmd} não encontrado`);
    }
  }
  
  console.log(`\n  📊 ${withPrereqs}/${interAdv.length} comandos com pré-requisitos`);
}

async function validateDocumentation() {
  console.log('\n📚 Validando Documentação...\n');
  
  // levels-system.md
  const levelsPath = path.join(ROOT, 'docs/onion/levels-system.md');
  const levelsExists = await fs.pathExists(levelsPath);
  test('docs/onion/levels-system.md existe', levelsExists);
  
  if (levelsExists) {
    const content = await fs.readFile(levelsPath, 'utf8');
    test('  └─ Explica filosofia 80/15/5', content.includes('80/15/5'));
    test('  └─ Tem guia de onboarding', content.includes('Onboarding') || content.includes('onboarding'));
    test('  └─ Tem FAQ', content.includes('FAQ'));
    test('  └─ Tem exemplos de progressão', content.includes('Dia 1') || content.includes('Semana 1'));
    test('  └─ Tem >375 linhas', content.split('\n').length > 375);
  }
  
  // READMEs
  const businessReadme = path.join(ROOT, '.onion/contexts/business/README.md');
  const technicalReadme = path.join(ROOT, '.onion/contexts/technical/README.md');
  
  if (await fs.pathExists(businessReadme)) {
    const content = await fs.readFile(businessReadme, 'utf8');
    test('business/README.md referencia levels-system', content.includes('levels-system'));
  }
  
  if (await fs.pathExists(technicalReadme)) {
    const content = await fs.readFile(technicalReadme, 'utf8');
    test('technical/README.md referencia levels-system', content.includes('levels-system'));
  }
}

async function validateSymlinks() {
  console.log('\n🔗 Validando Symlinks...\n');
  
  const symlinks = [
    '.cursor/commands/product/help.md',
    '.cursor/commands/engineer/help.md',
    '.cursor/commands/global/help.md'
  ];
  
  for (const symlink of symlinks) {
    const fullPath = path.join(ROOT, symlink);
    try {
      const stats = await fs.lstat(fullPath);
      test(`${symlink} é symlink`, stats.isSymbolicLink());
      
      if (stats.isSymbolicLink()) {
        const target = await fs.readlink(fullPath);
        const targetPath = path.resolve(path.dirname(fullPath), target);
        const targetExists = await fs.pathExists(targetPath);
        test(`  └─ alvo existe`, targetExists);
      }
    } catch (e) {
      warn(`${symlink} não encontrado`);
    }
  }
}

async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║  🧪 VALIDAÇÃO - SISTEMA DE NÍVEIS                        ║');
  console.log('║  Onion v4.0 - Multi-Context Orchestrator                 ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  
  const startTime = Date.now();
  
  await validateHelpCommands();
  await validateStarterCommands();
  await validateIntermediateAdvanced();
  await validateDocumentation();
  await validateSymlinks();
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log(`║  ${errors.length === 0 ? '✅ VALIDAÇÃO COMPLETA!' : '⚠️  VALIDAÇÃO COM ERROS'}                         ║`);
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n');
  
  console.log(`✅ Testes passaram: ${passed}`);
  if (errors.length > 0) console.log(`❌ Testes falharam: ${errors.length}`);
  if (warnings.length > 0) console.log(`⚠️  Avisos: ${warnings.length}`);
  console.log(`⏱️  Tempo: ${elapsed}s`);
  
  if (errors.length > 0) {
    console.log('\n❌ Erros:');
    errors.forEach(err => console.log(`  • ${err}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Avisos:');
    warnings.forEach(w => console.log(`  • ${w}`));
  }
  
  console.log('\n');
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});

