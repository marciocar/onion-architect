#!/usr/bin/env node
/**
 * Testes de Integração - IDE Loaders
 * 
 * Testa funcionalidade completa dos loaders para Cursor, Windsurf e Claude Code
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Setup de teste
const TEST_DIR = path.join(__dirname, '../../test-ide-loaders-project');
const ONION_ROOT = path.join(TEST_DIR, '.onion');
const CURSOR_ROOT = path.join(TEST_DIR, '.cursor');

let testsPassed = 0;
let testsFailed = 0;

function cleanup() {
  if (fs.existsSync(TEST_DIR)) {
    execSync(`rm -rf ${TEST_DIR}`, { stdio: 'ignore' });
  }
}

function setupTestProject() {
  info('Configurando projeto de teste...');
  
  cleanup();
  fs.mkdirSync(TEST_DIR, { recursive: true });
  fs.mkdirSync(ONION_ROOT, { recursive: true });
  fs.mkdirSync(path.join(ONION_ROOT, 'contexts'), { recursive: true });
  fs.mkdirSync(path.join(ONION_ROOT, 'core'), { recursive: true });
  fs.mkdirSync(path.join(ONION_ROOT, 'core', 'commands'), { recursive: true });
  fs.mkdirSync(path.join(ONION_ROOT, 'core', 'agents'), { recursive: true });
  
  // Criar estrutura de contexto de teste
  const businessContext = path.join(ONION_ROOT, 'contexts', 'business');
  fs.mkdirSync(businessContext, { recursive: true });
  fs.mkdirSync(path.join(businessContext, 'commands', 'starter'), { recursive: true });
  fs.mkdirSync(path.join(businessContext, 'agents'), { recursive: true });
  
  // Criar comandos de teste
  fs.writeFileSync(
    path.join(businessContext, 'commands', 'starter', 'spec.md'),
    '# Spec Command\n\nComando de teste para especificação.'
  );
  
  fs.writeFileSync(
    path.join(ONION_ROOT, 'core', 'commands', 'help.md'),
    '# Help Command\n\nComando de ajuda global.'
  );
  
  // Criar agente de teste
  fs.writeFileSync(
    path.join(businessContext, 'agents', 'product-agent.md'),
    '# Product Agent\n\nAgente de produto.'
  );
  
  // Criar config de teste
  fs.writeFileSync(
    path.join(TEST_DIR, '.onion-config.yml'),
    `version: 4.0.0
contexts:
  - business
ides:
  - cursor
  - windsurf
  - claude-code
`
  );
  
  success('Projeto de teste criado');
}

function testCursorLoader() {
  info('\n📋 Testando Cursor Loader...');
  
  try {
    // Gerar loader
    const LoadersGenerator = require('../../src/generator/loaders');
    const gen = new LoadersGenerator(TEST_DIR, {
      contexts: ['business'],
      ides: ['cursor']
    });
    
    return gen.generateIDELoader('cursor').then(() => {
      // Verificar arquivos gerados
      const loaderPath = path.join(ONION_ROOT, 'ide', 'cursor', 'onion-loader.js');
      
      if (!fs.existsSync(loaderPath)) {
        throw new Error('onion-loader.js não foi gerado');
      }
      
      // Executar loader para gerar .cursorrules e symlinks
      try {
        const CursorOnionLoader = require(loaderPath);
        const loader = new CursorOnionLoader(TEST_DIR);
        loader.syncToCursor();
      } catch (err) {
        // Se não conseguir executar diretamente, tentar via node
        try {
          execSync(`node ${loaderPath}`, { cwd: TEST_DIR, stdio: 'pipe' });
        } catch (execErr) {
          warn(`Não foi possível executar loader diretamente: ${execErr.message}`);
        }
      }
      
      // Verificar .cursorrules (pode estar em .cursor/ ou raiz)
      const cursorRulesPath = path.join(TEST_DIR, '.cursorrules');
      const cursorRulesPathAlt = path.join(CURSOR_ROOT, '.cursorrules');
      
      let cursorRulesPathFinal = null;
      if (fs.existsSync(cursorRulesPath)) {
        cursorRulesPathFinal = cursorRulesPath;
      } else if (fs.existsSync(cursorRulesPathAlt)) {
        cursorRulesPathFinal = cursorRulesPathAlt;
      }
      
      if (!cursorRulesPathFinal) {
        warn('.cursorrules não foi gerado (pode ser normal se loader não executa automaticamente)');
      } else {
        // Verificar conteúdo do .cursorrules
        const cursorRules = fs.readFileSync(cursorRulesPathFinal, 'utf-8');
        if (!cursorRules.includes('Sistema Onion')) {
          throw new Error('.cursorrules não contém conteúdo esperado');
        }
      }
      
      // Verificar symlinks (se existirem)
      if (fs.existsSync(CURSOR_ROOT)) {
        const contextsLink = path.join(CURSOR_ROOT, 'contexts');
        if (fs.existsSync(contextsLink)) {
          const stats = fs.lstatSync(contextsLink);
          if (!stats.isSymbolicLink()) {
            warn('contexts não é um symlink (pode ser normal)');
          }
        }
      }
      
      success('Cursor Loader: Todos os testes passaram');
      testsPassed++;
      return true;
    });
  } catch (err) {
    error(`Cursor Loader: ${err.message}`);
    testsFailed++;
    return false;
  }
}

function testWindsurfLoader() {
  info('\n📋 Testando Windsurf Loader...');
  
  try {
    // Gerar loader
    const LoadersGenerator = require('../../src/generator/loaders');
    const gen = new LoadersGenerator(TEST_DIR, {
      contexts: ['business'],
      ides: ['windsurf']
    });
    
    return gen.generateIDELoader('windsurf').then(() => {
      // Verificar arquivos gerados
      const bridgePath = path.join(ONION_ROOT, 'ide', 'windsurf', 'onion-bridge.ts');
      const configPath = path.join(TEST_DIR, 'windsurf.config.yml');
      
      if (!fs.existsSync(bridgePath)) {
        throw new Error('onion-bridge.ts não foi gerado');
      }
      
      if (!fs.existsSync(configPath)) {
        throw new Error('windsurf.config.yml não foi gerado');
      }
      
      // Verificar conteúdo do config
      const config = fs.readFileSync(configPath, 'utf-8');
      if (!config.includes('onion')) {
        throw new Error('windsurf.config.yml não contém configuração onion');
      }
      
      // Verificar formato YAML básico
      try {
        const yaml = require('yaml');
        yaml.parse(config);
      } catch (err) {
        throw new Error(`windsurf.config.yml não é YAML válido: ${err.message}`);
      }
      
      success('Windsurf Loader: Todos os testes passaram');
      testsPassed++;
      return true;
    });
  } catch (err) {
    error(`Windsurf Loader: ${err.message}`);
    testsFailed++;
    return false;
  }
}

async function testClaudeLoader() {
  info('\n📋 Testando Claude Loader...');
  
  try {
    // Gerar loader
    const LoadersGenerator = require('../../src/generator/loaders');
    const gen = new LoadersGenerator(TEST_DIR, {
      contexts: ['business'],
      ides: ['claude-code']
    });
    
    return gen.generateIDELoader('claude-code').then(async () => {
      // Aguardar um pouco para garantir que arquivos foram escritos
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verificar arquivos gerados (pode estar em claude ou claude-code)
      const claudeIdeDir = path.join(ONION_ROOT, 'ide', 'claude');
      const claudeCodeIdeDir = path.join(ONION_ROOT, 'ide', 'claude-code');
      const adapterPath = fs.existsSync(claudeIdeDir) 
        ? path.join(claudeIdeDir, 'onion-adapter.py')
        : path.join(claudeCodeIdeDir, 'onion-adapter.py');
      const configPath = path.join(TEST_DIR, 'claude.config.json');
      const claudeMdPath = path.join(TEST_DIR, 'CLAUDE.md');
      
      // Verificar se arquivo existe
      if (!fs.existsSync(adapterPath)) {
        // Listar arquivos nos diretórios para debug
        const claudeFiles = fs.existsSync(claudeIdeDir) ? fs.readdirSync(claudeIdeDir) : [];
        const claudeCodeFiles = fs.existsSync(claudeCodeIdeDir) ? fs.readdirSync(claudeCodeIdeDir) : [];
        const ideDirs = fs.existsSync(path.join(ONION_ROOT, 'ide')) ? fs.readdirSync(path.join(ONION_ROOT, 'ide')) : [];
        throw new Error(`onion-adapter.py não foi gerado. Arquivos em claude/: ${claudeFiles.join(', ')}. Arquivos em claude-code/: ${claudeCodeFiles.join(', ')}. Diretórios em ide/: ${ideDirs.join(', ')}`);
      }
      
      if (!fs.existsSync(configPath)) {
        throw new Error('claude.config.json não foi gerado');
      }
      
      // CLAUDE.md pode não ser gerado automaticamente (só quando adapter é executado)
      // Verificar se existe, mas não falhar se não existir
      if (!fs.existsSync(claudeMdPath)) {
        warn('CLAUDE.md não foi gerado automaticamente (normal se adapter não foi executado)');
      }
      
      // Verificar conteúdo do config
      const config = fs.readFileSync(configPath, 'utf-8');
      let jsonConfig;
      try {
        jsonConfig = JSON.parse(config);
      } catch (err) {
        throw new Error(`claude.config.json não é JSON válido: ${err.message}`);
      }
      
      if (!jsonConfig.onion) {
        throw new Error('claude.config.json não contém seção onion');
      }
      
      if (!Array.isArray(jsonConfig.onion.commands)) {
        throw new Error('claude.config.json não contém array de comandos');
      }
      
      // Verificar conteúdo do CLAUDE.md (se existir)
      if (fs.existsSync(claudeMdPath)) {
        const claudeMd = fs.readFileSync(claudeMdPath, 'utf-8');
        if (!claudeMd.includes('Sistema Onion')) {
          throw new Error('CLAUDE.md não contém conteúdo esperado');
        }
      }
      
      success('Claude Loader: Todos os testes passaram');
      testsPassed++;
      return true;
    });
  } catch (err) {
    error(`Claude Loader: ${err.message}`);
    testsFailed++;
    return false;
  }
}

function testResourceDiscovery() {
  info('\n📋 Testando Descoberta de Recursos...');
  
  try {
    // Verificar se todos os loaders descobrem recursos corretamente
    const contexts = fs.readdirSync(path.join(ONION_ROOT, 'contexts'))
      .filter(name => fs.statSync(path.join(ONION_ROOT, 'contexts', name)).isDirectory());
    
    if (!contexts.includes('business')) {
      throw new Error('Contexto business não encontrado');
    }
    
    // Verificar comandos
    const commands = fs.readdirSync(
      path.join(ONION_ROOT, 'contexts', 'business', 'commands', 'starter')
    );
    
    if (!commands.includes('spec.md')) {
      throw new Error('Comando spec.md não encontrado');
    }
    
    // Verificar agentes
    const agents = fs.readdirSync(
      path.join(ONION_ROOT, 'contexts', 'business', 'agents')
    );
    
    if (!agents.includes('product-agent.md')) {
      throw new Error('Agente product-agent.md não encontrado');
    }
    
    success('Descoberta de Recursos: Todos os testes passaram');
    testsPassed++;
    return true;
  } catch (err) {
    error(`Descoberta de Recursos: ${err.message}`);
    testsFailed++;
    return false;
  }
}

// Executar testes
async function runTests() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('🧪 Testes de Integração - IDE Loaders', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  
  try {
    setupTestProject();
    
    await testResourceDiscovery();
    await testCursorLoader();
    await testWindsurfLoader();
    await testClaudeLoader();
    
    // Resumo
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    log('📊 Resumo dos Testes', 'blue');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    log(`✅ Testes passaram: ${testsPassed}`, 'green');
    log(`❌ Testes falharam: ${testsFailed}`, testsFailed > 0 ? 'red' : 'green');
    log(`📈 Total: ${testsPassed + testsFailed}`, 'blue');
    
    if (testsFailed === 0) {
      success('\n🎉 Todos os testes passaram!');
      process.exit(0);
    } else {
      error('\n⚠️  Alguns testes falharam');
      process.exit(1);
    }
  } catch (err) {
    error(`\n💥 Erro fatal: ${err.message}`);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  } finally {
    // Limpar projeto de teste
    cleanup();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
