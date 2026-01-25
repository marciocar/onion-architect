/**
 * @fileoverview Migrator Transformer - Transforma arquivos v3 para v4
 * @module migrator/transformer
 * 
 * Princípios:
 * - Adiciona campos ao YAML header
 * - Preserva conteúdo original
 * - Cria symlinks para backward compatibility
 * - Mantém customizações do usuário
 */

import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';

/**
 * Transforma arquivo de comando v3 para v4
 * 
 * Adiciona campos: context, level
 * 
 * @param {string} sourceFilePath - Path do arquivo v3
 * @param {string} targetFilePath - Path do arquivo v4
 * @param {string} targetContext - Contexto de destino
 * @param {string} targetLevel - Nível de destino
 * @returns {Promise<void>}
 */
export async function transformCommandFile(sourceFilePath, targetFilePath, targetContext, targetLevel) {
  // Ler arquivo original
  const content = await fs.readFile(sourceFilePath, 'utf-8');
  
  // Extrair YAML header e body
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!yamlMatch) {
    // Sem YAML header - criar um
    const newContent = createCommandYAMLHeader(
      path.basename(sourceFilePath, '.md'),
      targetContext,
      targetLevel
    ) + '\n\n' + content;
    
    // Escrever no destino
    await fs.ensureDir(path.dirname(targetFilePath));
    await fs.writeFile(targetFilePath, newContent, 'utf-8');
    return;
  }
  
  // Parse YAML existente
  const existingYAML = yaml.parse(yamlMatch[1]);
  const body = yamlMatch[2];
  
  // Adicionar/atualizar campos
  const updatedYAML = {
    ...existingYAML,
    context: targetContext,
    level: targetLevel,
    version: existingYAML.version || '4.0.0',
    updated: new Date().toISOString().split('T')[0]
  };
  
  // Reconstruir arquivo
  const newContent = '---\n' + 
                     yaml.stringify(updatedYAML) + 
                     '---\n' + 
                     body;
  
  // Escrever no destino
  await fs.ensureDir(path.dirname(targetFilePath));
  await fs.writeFile(targetFilePath, newContent, 'utf-8');
}

/**
 * Transforma arquivo de agente v3 para v4
 * 
 * Adiciona campo: context
 * 
 * @param {string} sourceFilePath - Path do arquivo v3
 * @param {string} targetFilePath - Path do arquivo v4
 * @param {string} targetContext - Contexto de destino
 * @returns {Promise<void>}
 */
export async function transformAgentFile(sourceFilePath, targetFilePath, targetContext) {
  // Ler arquivo original
  const content = await fs.readFile(sourceFilePath, 'utf-8');
  
  // Extrair YAML header e body
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!yamlMatch) {
    // Sem YAML header - criar um
    const newContent = createAgentYAMLHeader(
      path.basename(sourceFilePath, '.md'),
      targetContext
    ) + '\n\n' + content;
    
    // Escrever no destino
    await fs.ensureDir(path.dirname(targetFilePath));
    await fs.writeFile(targetFilePath, newContent, 'utf-8');
    return;
  }
  
  // Parse YAML existente
  const existingYAML = yaml.parse(yamlMatch[1]);
  const body = yamlMatch[2];
  
  // Adicionar/atualizar campos
  const updatedYAML = {
    ...existingYAML,
    context: targetContext,
    version: existingYAML.version || '4.0.0',
    updated: new Date().toISOString().split('T')[0]
  };
  
  // Reconstruir arquivo
  const newContent = '---\n' + 
                     yaml.stringify(updatedYAML) + 
                     '---\n' + 
                     body;
  
  // Escrever no destino
  await fs.ensureDir(path.dirname(targetFilePath));
  await fs.writeFile(targetFilePath, newContent, 'utf-8');
}

/**
 * Cria symlinks de v3 para v4 (backward compatibility)
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {string} v3Path - Path v3 (relativo)
 * @param {string} v4Path - Path v4 (relativo)
 * @returns {Promise<void>}
 */
export async function createBackwardCompatSymlink(projectRoot, v3Path, v4Path) {
  const v3FullPath = path.join(projectRoot, v3Path);
  const v4FullPath = path.join(projectRoot, v4Path);
  
  // Garantir que diretório v3 existe
  await fs.ensureDir(path.dirname(v3FullPath));
  
  // Calcular path relativo de v3 para v4
  const relativePath = path.relative(path.dirname(v3FullPath), v4FullPath);
  
  // Criar symlink (v3 aponta para v4)
  try {
    // Remover se já existe
    if (await fs.pathExists(v3FullPath)) {
      await fs.remove(v3FullPath);
    }
    
    await fs.symlink(relativePath, v3FullPath);
  } catch (error) {
    // Ignorar erros de symlink (pode não ser suportado no Windows)
    console.warn(`Warning: Could not create symlink ${v3Path} → ${v4Path}`);
  }
}

/**
 * Cria múltiplos symlinks
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {Array} mappings - Lista de { oldPath, newPath }
 * @returns {Promise<number>} Número de symlinks criados
 */
export async function createSymlinks(projectRoot, mappings) {
  let created = 0;
  
  for (const mapping of mappings) {
    try {
      await createBackwardCompatSymlink(
        projectRoot,
        mapping.oldPath,
        mapping.newPath
      );
      created++;
    } catch (error) {
      // Continuar mesmo se um symlink falhar
    }
  }
  
  return created;
}

/**
 * Preserva customizações do usuário
 * 
 * Compara arquivo original com padrão e mantém diferenças
 * 
 * @param {string} originalFile - Arquivo original
 * @param {string} migratedFile - Arquivo migrado
 * @returns {Promise<boolean>} true se teve customizações
 */
export async function preserveCustomizations(originalFile, migratedFile) {
  // TODO: Implementar diff e merge de customizações
  // Por agora, simplesmente copiar o arquivo
  const content = await fs.readFile(originalFile, 'utf-8');
  await fs.writeFile(migratedFile, content, 'utf-8');
  return true;
}

/**
 * Copia regras v3 para v4
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @returns {Promise<number>} Número de regras copiadas
 */
export async function copyRules(projectRoot) {
  const v3RulesPath = path.join(projectRoot, '.cursor/rules');
  const v4RulesPath = path.join(projectRoot, '.onion/core/rules');
  
  if (!(await fs.pathExists(v3RulesPath))) {
    return 0;
  }
  
  // Copiar todos os arquivos .mdc
  const files = await fs.readdir(v3RulesPath);
  let copied = 0;
  
  for (const file of files) {
    if (file.endsWith('.mdc') || file.endsWith('.md')) {
      await fs.copy(
        path.join(v3RulesPath, file),
        path.join(v4RulesPath, file)
      );
      copied++;
    }
  }
  
  return copied;
}

/**
 * Copia sessions v3 para v4
 * 
 * @param {string} projectRoot - Raiz do projeto
 * @param {string} targetContext - Contexto de destino (default: technical)
 * @returns {Promise<number>} Número de sessions copiadas
 */
export async function copySessions(projectRoot, targetContext = 'technical') {
  const v3SessionsPath = path.join(projectRoot, '.cursor/sessions');
  const v4SessionsPath = path.join(projectRoot, `.onion/contexts/${targetContext}/sessions`);
  
  if (!(await fs.pathExists(v3SessionsPath))) {
    return 0;
  }
  
  // Copiar toda a pasta
  await fs.copy(v3SessionsPath, v4SessionsPath);
  
  // Contar subpastas
  const dirs = await fs.readdir(v3SessionsPath);
  const sessions = dirs.filter(async (name) => {
    const stat = await fs.stat(path.join(v3SessionsPath, name));
    return stat.isDirectory();
  });
  
  return sessions.length;
}

// ============================================================================
// HELPERS PRIVADOS
// ============================================================================

/**
 * Cria YAML header para comando
 * @private
 */
function createCommandYAMLHeader(name, context, level) {
  const header = {
    name,
    description: `${name} command`,
    model: 'sonnet',
    category: context,
    tags: [level],
    version: '4.0.0',
    updated: new Date().toISOString().split('T')[0],
    level,
    context
  };
  
  return '---\n' + yaml.stringify(header) + '---';
}

/**
 * Cria YAML header para agente
 * @private
 */
function createAgentYAMLHeader(name, context) {
  const header = {
    name,
    description: `${name} agent`,
    model: 'sonnet',
    category: context,
    tags: ['agent'],
    expertise: [],
    version: '4.0.0',
    updated: new Date().toISOString().split('T')[0],
    context
  };
  
  return '---\n' + yaml.stringify(header) + '---';
}

