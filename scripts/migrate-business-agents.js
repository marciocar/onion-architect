#!/usr/bin/env node

/**
 * Script de migração de agentes business para Onion v4
 * 
 * Migra agentes de:
 * - .cursor/agents/product/
 * - .cursor/agents/development/ (alguns que são business-related)
 * 
 * Para: .onion/contexts/business/agents/
 */

const fs = require('fs-extra');
const path = require('path');

// Configuração
const PROJECT_ROOT = process.cwd();
const DEST_DIR = path.join(PROJECT_ROOT, '.onion/contexts/business/agents');

// Mapeamento de agentes para origem
const AGENT_MAP = {
  // Product agents (8 agentes)
  'product/product-agent.md': 'product-agent.md',
  'product/story-points-framework-specialist.md': 'story-points-specialist.md',
  'product/extract-meeting-specialist.md': 'extract-meeting-specialist.md',
  'product/meeting-consolidator.md': 'meeting-consolidator.md',
  'product/presentation-orchestrator.md': 'presentation-orchestrator.md',
  'product/branding-positioning-specialist.md': 'branding-specialist.md',
  'product/pain-price-specialist.md': 'pain-price-specialist.md',
  'product/storytelling-business-specialist.md': 'storytelling-specialist.md',
  
  // Development agents que são business-related (4 agentes)
  'development/clickup-specialist.md': 'clickup-specialist.md',
  'development/whisper-specialist.md': 'whisper-specialist.md',
  'development/task-specialist.md': 'task-specialist.md',
  'development/gamma-api-specialist.md': 'gamma-specialist.md',
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
    // Manter category original (product ou development)
    return line;
  });
  
  // Adicionar novo campo context
  const hasContext = updatedYamlLines.some(line => line.startsWith('context:'));
  if (!hasContext) updatedYamlLines.push(`context: business`);
  
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
  console.log('🤖 MIGRAÇÃO DE AGENTES BUSINESS');
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

