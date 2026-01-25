#!/usr/bin/env node

/**
 * Script de migração de comandos technical para Onion v4
 * 
 * Migra comandos de:
 * - .cursor/commands/engineer/
 * - .cursor/commands/git/
 * - .cursor/commands/docs/
 * - .cursor/commands/test/
 * 
 * Para: .onion/contexts/technical/commands/{level}/
 */

const fs = require('fs-extra');
const path = require('path');

// Configuração
const PROJECT_ROOT = process.cwd();
const DEST_BASE = path.join(PROJECT_ROOT, '.onion/contexts/technical/commands');

// Mapeamento de comandos para níveis e origem
const COMMAND_MAP = {
  // ===== ENGINEER =====
  // Starter (5 comandos)
  'engineer/work.md': 'starter',
  'engineer/plan.md': 'starter',
  'engineer/pr.md': 'starter',
  'engineer/warm-up.md': 'starter',
  'engineer/docs.md': 'starter',
  
  // Intermediate (3 comandos)
  'engineer/start.md': 'intermediate',
  'engineer/pre-pr.md': 'intermediate',
  'engineer/pr-update.md': 'intermediate',
  
  // Advanced (3 comandos)
  'engineer/bump.md': 'advanced',
  'engineer/hotfix.md': 'advanced',
  'engineer/validate-phase-sync.md': 'advanced',
  
  // ===== GIT =====
  // Starter (3 comandos)
  'git/sync.md': 'starter',
  'git/init.md': 'starter',
  'git/help.md': 'starter',
  
  // Intermediate (2 comandos)
  'git/code-review.md': 'intermediate',
  'git/fast-commit.md': 'intermediate',
  
  // Advanced (subdiretórios - tratados separadamente)
  // 'git/feature/*', 'git/hotfix/*', 'git/release/*'
  
  // ===== DOCS =====
  // Starter (1 comando)
  'docs/help.md': 'starter',
  
  // Intermediate (6 comandos)
  'docs/build-index.md': 'intermediate',
  'docs/build-tech-docs.md': 'intermediate',
  'docs/build-business-docs.md': 'intermediate',
  'docs/validate-docs.md': 'intermediate',
  'docs/docs-health.md': 'intermediate',
  'docs/sync-sessions.md': 'intermediate',
  
  // Advanced (3 comandos)
  'docs/refine-vision.md': 'advanced',
  'docs/consolidate-documents.md': 'advanced',
  'docs/reverse-consolidate.md': 'advanced',
  
  // ===== TEST =====
  // Intermediate (2 comandos)
  'test/unit.md': 'intermediate',
  'test/integration.md': 'intermediate',
  
  // Advanced (1 comando)
  'test/e2e.md': 'advanced',
};

/**
 * Atualiza header YAML
 */
function updateYamlHeader(content, level, originalCategory) {
  const lines = content.split('\n');
  
  const startIndex = lines.findIndex(line => line.trim() === '---');
  const endIndex = lines.findIndex((line, index) => index > startIndex && line.trim() === '---');
  
  if (startIndex === -1 || endIndex === -1) {
    console.error('❌ YAML header não encontrado');
    return content;
  }
  
  const yamlLines = lines.slice(startIndex + 1, endIndex);
  const updatedYamlLines = yamlLines.map(line => {
    if (line.startsWith('version:')) return 'version: "4.0.0"';
    if (line.startsWith('updated:')) return 'updated: "2025-12-20"';
    return line;
  });
  
  // Adicionar novos campos
  const hasLevel = updatedYamlLines.some(line => line.startsWith('level:'));
  const hasContext = updatedYamlLines.some(line => line.startsWith('context:'));
  
  if (!hasLevel) updatedYamlLines.push(`level: ${level}`);
  if (!hasContext) updatedYamlLines.push(`context: technical`);
  
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
async function migrateCommand(relativePath, level) {
  const sourcePath = path.join(PROJECT_ROOT, '.cursor/commands', relativePath);
  const filename = path.basename(relativePath);
  const destPath = path.join(DEST_BASE, level, filename);
  const symlinkPath = sourcePath;
  
  console.log(`  ∟ Migrando ${relativePath} → ${level}/${filename}`);
  
  if (!await fs.pathExists(sourcePath)) {
    console.log(`    ⚠️ Arquivo não encontrado, pulando...`);
    return false;
  }
  
  const content = await fs.readFile(sourcePath, 'utf8');
  const category = relativePath.split('/')[0];
  const updatedContent = updateYamlHeader(content, level, category);
  
  await fs.writeFile(destPath, updatedContent, 'utf8');
  
  // Criar symlink
  await fs.remove(sourcePath);
  const relativeSymlink = path.relative(path.dirname(sourcePath), destPath);
  await fs.symlink(relativeSymlink, symlinkPath, 'file');
  
  console.log(`    ✅ Migrado e symlink criado`);
  return true;
}

/**
 * Migra subdiretórios do Git (feature, hotfix, release)
 */
async function migrateGitSubdirs() {
  console.log(`\n📦 GIT SUBDIRECTORIES (advanced):\n`);
  
  let count = 0;
  const subdirs = ['feature', 'hotfix', 'release'];
  
  for (const subdir of subdirs) {
    const sourceDir = path.join(PROJECT_ROOT, '.cursor/commands/git', subdir);
    
    if (!await fs.pathExists(sourceDir)) {
      console.log(`  ⚠️ ${subdir}/ não encontrado, pulando...`);
      continue;
    }
    
    const files = await fs.readdir(sourceDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    console.log(`  ∟ ${subdir}/ (${mdFiles.length} arquivos)`);
    
    for (const file of mdFiles) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(DEST_BASE, 'advanced', `${subdir}-${file}`);
      
      try {
        const content = await fs.readFile(sourcePath, 'utf8');
        const updatedContent = updateYamlHeader(content, 'advanced', 'git');
        
        await fs.writeFile(destPath, updatedContent, 'utf8');
        
        // Symlink
        await fs.remove(sourcePath);
        const relativeSymlink = path.relative(path.dirname(sourcePath), destPath);
        await fs.symlink(relativeSymlink, sourcePath, 'file');
        
        count++;
        console.log(`    ✅ ${subdir}/${file}`);
      } catch (error) {
        console.error(`    ❌ Erro em ${file}:`, error.message);
      }
    }
  }
  
  return count;
}

/**
 * Main
 */
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 MIGRAÇÃO DE COMANDOS TECHNICAL');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  let migrated = { starter: 0, intermediate: 0, advanced: 0 };
  
  // Migrar comandos mapeados
  for (const level of ['starter', 'intermediate', 'advanced']) {
    console.log(`\n📦 ${level.toUpperCase()}:\n`);
    
    const commandsInLevel = Object.entries(COMMAND_MAP)
      .filter(([_, l]) => l === level)
      .map(([path]) => path);
    
    for (const commandPath of commandsInLevel) {
      try {
        const success = await migrateCommand(commandPath, level);
        if (success) migrated[level]++;
      } catch (error) {
        console.error(`  ❌ Erro ao migrar ${commandPath}:`, error.message);
      }
    }
  }
  
  // Migrar subdiretórios do Git
  const gitSubdirCount = await migrateGitSubdirs();
  migrated.advanced += gitSubdirCount;
  
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

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

