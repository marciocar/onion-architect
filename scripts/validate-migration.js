#!/usr/bin/env node

/**
 * Script de Validação - Onion v4 FASE 2
 * 
 * Testa:
 * 1. Todos os symlinks estão corretos
 * 2. Todos os arquivos têm headers YAML válidos
 * 3. Estrutura de diretórios está correta
 * 4. Configs estão presentes
 */

const fs = require('fs-extra');
const path = require('path');

const PROJECT_ROOT = process.cwd();

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

let errors = [];
let warnings = [];
let passed = 0;

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function test(description, assertion) {
  if (assertion) {
    passed++;
    log(`  ✅ ${description}`, 'green');
    return true;
  } else {
    errors.push(description);
    log(`  ❌ ${description}`, 'red');
    return false;
  }
}

function warn(description) {
  warnings.push(description);
  log(`  ⚠️  ${description}`, 'yellow');
}

async function validateSymlinks() {
  log('\n📦 Validando Symlinks...', 'cyan');
  
  const symlinksToCheck = [
    // Business commands
    '.cursor/commands/product/spec.md',
    '.cursor/commands/product/task.md',
    '.cursor/commands/product/estimate.md',
    '.cursor/commands/product/collect.md',
    '.cursor/commands/product/presentation.md',
    
    // Technical commands
    '.cursor/commands/engineer/work.md',
    '.cursor/commands/engineer/plan.md',
    '.cursor/commands/engineer/start.md',
    '.cursor/commands/git/sync.md',
    '.cursor/commands/docs/build-index.md',
    
    // Business agents
    '.cursor/agents/product/product-agent.md',
    '.cursor/agents/product/story-points-framework-specialist.md',
    
    // Technical agents
    '.cursor/agents/development/react-developer.md',
    '.cursor/agents/testing/test-engineer.md',
  ];
  
  for (const symlinkPath of symlinksToCheck) {
    const fullPath = path.join(PROJECT_ROOT, symlinkPath);
    
    try {
      const stats = await fs.lstat(fullPath);
      test(`${symlinkPath} é um symlink`, stats.isSymbolicLink());
      
      if (stats.isSymbolicLink()) {
        // Verificar se o alvo existe
        const target = await fs.readlink(fullPath);
        const targetPath = path.resolve(path.dirname(fullPath), target);
        const targetExists = await fs.pathExists(targetPath);
        test(`  └─ alvo existe: ${target}`, targetExists);
      }
    } catch (error) {
      test(`${symlinkPath} existe`, false);
    }
  }
}

async function validateYamlHeaders() {
  log('\n📝 Validando Headers YAML...', 'cyan');
  
  const filesToCheck = [
    '.onion/contexts/business/commands/starter/spec.md',
    '.onion/contexts/business/commands/intermediate/collect.md',
    '.onion/contexts/business/commands/advanced/presentation.md',
    '.onion/contexts/business/agents/product-agent.md',
    '.onion/contexts/technical/commands/starter/work.md',
    '.onion/contexts/technical/commands/intermediate/start.md',
    '.onion/contexts/technical/commands/advanced/bump.md',
    '.onion/contexts/technical/agents/react-developer.md',
  ];
  
  for (const filePath of filesToCheck) {
    const fullPath = path.join(PROJECT_ROOT, filePath);
    
    try {
      const content = await fs.readFile(fullPath, 'utf8');
      const lines = content.split('\n');
      
      const startIndex = lines.findIndex(line => line.trim() === '---');
      const endIndex = lines.findIndex((line, index) => index > startIndex && line.trim() === '---');
      
      if (startIndex !== -1 && endIndex !== -1) {
        const yamlLines = lines.slice(startIndex + 1, endIndex);
        const yamlContent = yamlLines.join('\n');
        
        test(`${path.basename(filePath)} tem header YAML`, true);
        test(`  └─ version: "4.0.0"`, yamlContent.includes('version: "4.0.0"'));
        test(`  └─ updated: "2025-12-20"`, yamlContent.includes('updated: "2025-12-20"'));
        
        // Verificar campos específicos baseado no path
        if (filePath.includes('/commands/')) {
          test(`  └─ level: presente`, yamlContent.includes('level:'));
          test(`  └─ context: presente`, yamlContent.includes('context:'));
        }
        if (filePath.includes('/agents/')) {
          test(`  └─ context: presente`, yamlContent.includes('context:'));
        }
      } else {
        test(`${path.basename(filePath)} tem header YAML`, false);
      }
    } catch (error) {
      test(`${path.basename(filePath)} é legível`, false);
    }
  }
}

async function validateStructure() {
  log('\n🏗️  Validando Estrutura de Diretórios...', 'cyan');
  
  const dirsToCheck = [
    '.onion/contexts/business',
    '.onion/contexts/business/commands/starter',
    '.onion/contexts/business/commands/intermediate',
    '.onion/contexts/business/commands/advanced',
    '.onion/contexts/business/agents',
    '.onion/contexts/technical',
    '.onion/contexts/technical/commands/starter',
    '.onion/contexts/technical/commands/intermediate',
    '.onion/contexts/technical/commands/advanced',
    '.onion/contexts/technical/agents',
  ];
  
  for (const dir of dirsToCheck) {
    const fullPath = path.join(PROJECT_ROOT, dir);
    const exists = await fs.pathExists(fullPath);
    test(`${dir}/ existe`, exists);
  }
}

async function validateConfigs() {
  log('\n⚙️  Validando Configs...', 'cyan');
  
  const configs = [
    {
      path: '.onion/contexts/business/.context-config.yml',
      checks: [
        content => content.includes('name: business'),
        content => content.includes('version: "4.0.0"'),
        content => content.includes('starter: 5'),
        content => content.includes('intermediate: 10'),
        content => content.includes('advanced: 5'),
      ]
    },
    {
      path: '.onion/contexts/technical/.context-config.yml',
      checks: [
        content => content.includes('name: technical'),
        content => content.includes('version: "4.0.0"'),
        content => content.includes('starter: 10'),
        content => content.includes('intermediate: 15'),
        content => content.includes('advanced: 7'),
      ]
    },
  ];
  
  for (const { path: configPath, checks } of configs) {
    const fullPath = path.join(PROJECT_ROOT, configPath);
    
    try {
      const content = await fs.readFile(fullPath, 'utf8');
      test(`${configPath} existe`, true);
      
      for (const check of checks) {
        test(`  └─ conteúdo válido`, check(content));
      }
    } catch (error) {
      test(`${configPath} existe`, false);
    }
  }
}

async function validateCounts() {
  log('\n🔢 Validando Contagens...', 'cyan');
  
  const counts = [
    {
      path: '.onion/contexts/business/commands/starter',
      expected: 5,
      name: 'Business starter commands'
    },
    {
      path: '.onion/contexts/business/commands/intermediate',
      expected: 10,
      name: 'Business intermediate commands'
    },
    {
      path: '.onion/contexts/business/commands/advanced',
      expected: 5,
      name: 'Business advanced commands'
    },
    {
      path: '.onion/contexts/business/agents',
      expected: 12,
      name: 'Business agents'
    },
    {
      path: '.onion/contexts/technical/commands/starter',
      expected: 8, // Nota: git/help.md e docs/help.md sobrescrevem (esperado)
      name: 'Technical starter commands'
    },
    {
      path: '.onion/contexts/technical/commands/intermediate',
      expected: 13,
      name: 'Technical intermediate commands'
    },
    {
      path: '.onion/contexts/technical/commands/advanced',
      expected: 14,
      name: 'Technical advanced commands'
    },
    {
      path: '.onion/contexts/technical/agents',
      expected: 23,
      name: 'Technical agents'
    },
  ];
  
  for (const { path: dirPath, expected, name } of counts) {
    const fullPath = path.join(PROJECT_ROOT, dirPath);
    
    try {
      const files = await fs.readdir(fullPath);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      test(`${name}: ${mdFiles.length}/${expected}`, mdFiles.length === expected);
      
      if (mdFiles.length !== expected) {
        warn(`  └─ Esperado: ${expected}, Encontrado: ${mdFiles.length}`);
      }
    } catch (error) {
      test(`${name} é legível`, false);
    }
  }
}

async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║  🧪 ONION V4 - VALIDAÇÃO FASE 2                          ║');
  console.log('║  Multi-Context Development Orchestrator                  ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n');
  
  const startTime = Date.now();
  
  await validateStructure();
  await validateConfigs();
  await validateCounts();
  await validateSymlinks();
  await validateYamlHeaders();
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log(`║  ${errors.length === 0 ? '✅ VALIDAÇÃO COMPLETA!' : '⚠️  VALIDAÇÃO COM ERROS'}                         ║`);
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n');
  
  log(`✅ Testes passaram: ${passed}`, 'green');
  if (errors.length > 0) log(`❌ Testes falharam: ${errors.length}`, 'red');
  if (warnings.length > 0) log(`⚠️  Avisos: ${warnings.length}`, 'yellow');
  log(`⏱️  Tempo: ${elapsed}s`, 'cyan');
  
  if (errors.length > 0) {
    console.log('\n❌ Erros encontrados:');
    errors.forEach(err => log(`  • ${err}`, 'red'));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Avisos:');
    warnings.forEach(warn => log(`  • ${warn}`, 'yellow'));
  }
  
  console.log('\n');
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('\n❌ Erro fatal na validação:', error);
  process.exit(1);
});

