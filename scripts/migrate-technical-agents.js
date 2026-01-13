#!/usr/bin/env node

/**
 * Script de migração de agentes technical para Onion v4
 * 
 * Migra agentes de:
 * - .cursor/agents/development/ (maioria)
 * - .cursor/agents/testing/
 * - .cursor/agents/review/
 * - .cursor/agents/git/
 * 
 * Para: .onion/contexts/technical/agents/
 */

const fs = require('fs-extra');
const path = require('path');

// Configuração
const PROJECT_ROOT = process.cwd();
const DEST_DIR = path.join(PROJECT_ROOT, '.onion/contexts/technical/agents');

// Mapeamento de agentes para origem
const AGENT_MAP = {
  // Development agents (15 agentes technical)
  'development/react-developer.md': 'react-developer.md',
  'development/nodejs-specialist.md': 'nodejs-specialist.md',
  'development/postgres-specialist.md': 'postgres-specialist.md',
  'development/zen-engine-specialist.md': 'zen-engine-specialist.md',
  'development/nx-monorepo-specialist.md': 'nx-monorepo-specialist.md',
  'development/nx-migration-specialist.md': 'nx-migration-specialist.md',
  'development/gitflow-specialist.md': 'gitflow-specialist.md',
  'development/cursor-specialist.md': 'cursor-specialist.md',
  'development/c4-architecture-specialist.md': 'c4-architecture-specialist.md',
  'development/c4-documentation-specialist.md': 'c4-documentation-specialist.md',
  'development/mermaid-specialist.md': 'mermaid-specialist.md',
  'development/system-documentation-orchestrator.md': 'system-doc-orchestrator.md',
  'development/docs-reverse-engineer.md': 'docs-reverse-engineer.md',
  'development/linux-security-specialist.md': 'linux-security-specialist.md',
  'development/runflow-specialist.md': 'runflow-specialist.md',
  
  // Testing agents (3 agentes)
  'testing/test-engineer.md': 'test-engineer.md',
  'testing/test-planner.md': 'test-planner.md',
  'testing/test-agent.md': 'test-agent.md',
  
  // Review agents (1 agente)
  'review/code-reviewer.md': 'code-reviewer.md',
  
  // Git agents (4 agentes)
  'git/branch-code-reviewer.md': 'branch-code-reviewer.md',
  'git/branch-documentation-writer.md': 'branch-doc-writer.md',
  'git/branch-metaspec-checker.md': 'branch-metaspec-checker.md',
  'git/branch-test-planner.md': 'branch-test-planner.md',
};

/**
 * Atualiza header YAML
 */
function updateYamlHeader(content) {
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
  
  // Adicionar novo campo context
  const hasContext = updatedYamlLines.some(line => line.startsWith('context:'));
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
 * Migra um agente
 */
async function migrateAgent(sourceRelative, destFilename) {
  const sourcePath = path.join(PROJECT_ROOT, '.cursor/agents', sourceRelative);
  const destPath = path.join(DEST_DIR, destFilename);
  const symlinkPath = sourcePath;
  
  console.log(`  ∟ Migrando ${sourceRelative} → ${destFilename}`);
  
  if (!await fs.pathExists(sourcePath)) {
    console.log(`    ⚠️ Arquivo não encontrado, pulando...`);
    return false;
  }
  
  const content = await fs.readFile(sourcePath, 'utf8');
  const updatedContent = updateYamlHeader(content);
  
  await fs.writeFile(destPath, updatedContent, 'utf8');
  
  // Criar symlink
  await fs.remove(sourcePath);
  const relativeSymlink = path.relative(path.dirname(sourcePath), destPath);
  await fs.symlink(relativeSymlink, symlinkPath, 'file');
  
  console.log(`    ✅ Migrado e symlink criado`);
  return true;
}

/**
 * Main
 */
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🤖 MIGRAÇÃO DE AGENTES TECHNICAL');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  let migrated = 0;
  
  for (const [sourceRelative, destFilename] of Object.entries(AGENT_MAP)) {
    try {
      const success = await migrateAgent(sourceRelative, destFilename);
      if (success) migrated++;
    } catch (error) {
      console.error(`  ❌ Erro ao migrar ${sourceRelative}:`, error.message);
    }
  }
  
  // Resumo
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ MIGRAÇÃO COMPLETA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`📊 ESTATÍSTICAS:`);
  console.log(`  ∟ Agentes migrados: ${migrated}`);
  console.log(`  ∟ Esperados: ${Object.keys(AGENT_MAP).length}\n`);
}

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

