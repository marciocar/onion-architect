#!/usr/bin/env node

/**
 * Script de migração de comandos business para Onion v4
 * 
 * Este script:
 * 1. Lê comandos de .cursor/commands/product/
 * 2. Classifica por nível (starter/intermediate/advanced)
 * 3. Copia para .onion/contexts/business/commands/{level}/
 * 4. Atualiza headers YAML (adiciona level, context, atualiza version/updated)
 * 5. Cria symlinks para retrocompatibilidade
 */

const fs = require('fs-extra');
const path = require('path');

// Configuração
const PROJECT_ROOT = process.cwd();
const SOURCE_DIR = path.join(PROJECT_ROOT, '.cursor/commands/product');
const DEST_BASE = path.join(PROJECT_ROOT, '.onion/contexts/business/commands');

// Mapeamento de comandos para níveis
const COMMAND_LEVELS = {
  // Starter (5 comandos) - 80% dos casos
  'spec.md': 'starter',
  'task.md': 'starter',
  'estimate.md': 'starter',
  'refine.md': 'starter',
  'warm-up.md': 'starter',
  
  // Intermediate (10 comandos) - 15% dos casos
  'collect.md': 'intermediate',
  'light-arch.md': 'intermediate',
  'extract-meeting.md': 'intermediate',
  'consolidate-meetings.md': 'intermediate',
  'convert-to-tasks.md': 'intermediate',
  'whisper.md': 'intermediate',
  'task-check.md': 'intermediate',
  'validate-task.md': 'intermediate',
  'check.md': 'intermediate',
  'feature.md': 'intermediate',
  
  // Advanced (5 comandos) - 5% dos casos
  'transform-consolidated.md': 'advanced',
  'presentation.md': 'advanced',
  'branding.md': 'advanced',
  'analyze-pain-price.md': 'advanced',
  'checklist-sync.md': 'advanced',
};

/**
 * Atualiza header YAML de um arquivo (sem biblioteca yaml)
 */
function updateYamlHeader(content, level) {
  const lines = content.split('\n');
  
  // Encontrar início e fim do YAML header
  const startIndex = lines.findIndex(line => line.trim() === '---');
  const endIndex = lines.findIndex((line, index) => index > startIndex && line.trim() === '---');
  
  if (startIndex === -1 || endIndex === -1) {
    console.error('❌ YAML header não encontrado');
    return content;
  }
  
  // Processar linha por linha do YAML
  const yamlLines = lines.slice(startIndex + 1, endIndex);
  const updatedYamlLines = yamlLines.map(line => {
    // Atualizar version
    if (line.startsWith('version:')) {
      return 'version: "4.0.0"';
    }
    // Atualizar updated
    if (line.startsWith('updated:')) {
      return 'updated: "2025-12-20"';
    }
    // Atualizar category de product para business (manter compatibilidade)
    if (line.startsWith('category:') && line.includes('product')) {
      return line; // Manter 'product' por enquanto
    }
    return line;
  });
  
  // Adicionar novos campos se não existirem
  const hasLevel = updatedYamlLines.some(line => line.startsWith('level:'));
  const hasContext = updatedYamlLines.some(line => line.startsWith('context:'));
  
  if (!hasLevel) {
    updatedYamlLines.push(`level: ${level}`);
  }
  if (!hasContext) {
    updatedYamlLines.push(`context: business`);
  }
  
  // Reconstruir arquivo
  const beforeYaml = lines.slice(0, startIndex + 1);
  const afterYaml = lines.slice(endIndex);
  
  return [
    ...beforeYaml,
    ...updatedYamlLines,
    ...afterYaml
  ].join('\n');
}

/**
 * Migra um comando
 */
async function migrateCommand(filename, level) {
  const sourcePath = path.join(SOURCE_DIR, filename);
  const destPath = path.join(DEST_BASE, level, filename);
  const symlinkPath = path.join(SOURCE_DIR, filename);
  
  console.log(`  ∟ Migrando ${filename} → ${level}/`);
  
  // Verificar se arquivo existe
  if (!await fs.pathExists(sourcePath)) {
    console.log(`    ⚠️ Arquivo não encontrado, pulando...`);
    return false;
  }
  
  // Ler arquivo original
  const content = await fs.readFile(sourcePath, 'utf8');
  
  // Atualizar header YAML
  const updatedContent = updateYamlHeader(content, level);
  
  // Escrever no destino
  await fs.writeFile(destPath, updatedContent, 'utf8');
  
  // Criar symlink (remover original primeiro)
  await fs.remove(sourcePath);
  const relativePath = path.relative(SOURCE_DIR, destPath);
  await fs.symlink(relativePath, symlinkPath, 'file');
  
  console.log(`    ✅ Migrado e symlink criado`);
  return true;
}

/**
 * Main
 */
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 MIGRAÇÃO DE COMANDOS BUSINESS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Estatísticas
  let migrated = { starter: 0, intermediate: 0, advanced: 0 };
  
  // Migrar por nível
  for (const level of ['starter', 'intermediate', 'advanced']) {
    console.log(`\n📦 ${level.toUpperCase()}:\n`);
    
    const commandsInLevel = Object.entries(COMMAND_LEVELS)
      .filter(([_, l]) => l === level)
      .map(([filename]) => filename);
    
    for (const filename of commandsInLevel) {
      try {
        const success = await migrateCommand(filename, level);
        if (success) migrated[level]++;
      } catch (error) {
        console.error(`  ❌ Erro ao migrar ${filename}:`, error.message);
      }
    }
  }
  
  // Resumo
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ MIGRAÇÃO COMPLETA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`📊 ESTATÍSTICAS:`);
  console.log(`  ∟ Starter: ${migrated.starter} comandos`);
  console.log(`  ∟ Intermediate: ${migrated.intermediate} comandos`);
  console.log(`  ∟ Advanced: ${migrated.advanced} comandos`);
  console.log(`  ∟ Total: ${Object.values(migrated).reduce((a, b) => a + b, 0)} comandos\n`);
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

