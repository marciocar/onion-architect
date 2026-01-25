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
import path from 'node:path';
import yaml from 'yaml';

export interface SymlinkMapping {
  oldPath: string;
  newPath: string;
}

/**
 * Transforma arquivo de comando v3 para v4
 *
 * Adiciona campos: context, level
 */
export async function transformCommandFile(
  sourceFilePath: string,
  targetFilePath: string,
  targetContext: string,
  targetLevel: string
): Promise<void> {
  // Ler arquivo original
  const content = await fs.readFile(sourceFilePath, 'utf-8');

  // Extrair YAML header e body
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!yamlMatch || !yamlMatch[1] || yamlMatch[2] === undefined) {
    // Sem YAML header - criar um
    const newContent =
      createCommandYAMLHeader(path.basename(sourceFilePath, '.md'), targetContext, targetLevel) +
      '\n\n' +
      content;

    // Escrever no destino
    await fs.ensureDir(path.dirname(targetFilePath));
    await fs.writeFile(targetFilePath, newContent, 'utf-8');
    return;
  }

  // Parse YAML existente
  const existingYAML = yaml.parse(yamlMatch[1]) as Record<string, unknown>;
  const body = yamlMatch[2];

  // Adicionar/atualizar campos
  const updatedYAML = {
    ...existingYAML,
    context: targetContext,
    level: targetLevel,
    version: existingYAML.version || '4.0.0',
    updated: new Date().toISOString().split('T')[0],
  };

  // Reconstruir arquivo
  const newContent = '---\n' + yaml.stringify(updatedYAML) + '---\n' + body;

  // Escrever no destino
  await fs.ensureDir(path.dirname(targetFilePath));
  await fs.writeFile(targetFilePath, newContent, 'utf-8');
}

/**
 * Transforma arquivo de agente v3 para v4
 *
 * Adiciona campo: context
 */
export async function transformAgentFile(
  sourceFilePath: string,
  targetFilePath: string,
  targetContext: string
): Promise<void> {
  // Ler arquivo original
  const content = await fs.readFile(sourceFilePath, 'utf-8');

  // Extrair YAML header e body
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!yamlMatch || !yamlMatch[1] || yamlMatch[2] === undefined) {
    // Sem YAML header - criar um
    const newContent =
      createAgentYAMLHeader(path.basename(sourceFilePath, '.md'), targetContext) + '\n\n' + content;

    // Escrever no destino
    await fs.ensureDir(path.dirname(targetFilePath));
    await fs.writeFile(targetFilePath, newContent, 'utf-8');
    return;
  }

  // Parse YAML existente
  const existingYAML = yaml.parse(yamlMatch[1]) as Record<string, unknown>;
  const body = yamlMatch[2];

  // Adicionar/atualizar campos
  const updatedYAML = {
    ...existingYAML,
    context: targetContext,
    version: existingYAML.version || '4.0.0',
    updated: new Date().toISOString().split('T')[0],
  };

  // Reconstruir arquivo
  const newContent = '---\n' + yaml.stringify(updatedYAML) + '---\n' + body;

  // Escrever no destino
  await fs.ensureDir(path.dirname(targetFilePath));
  await fs.writeFile(targetFilePath, newContent, 'utf-8');
}

/**
 * Cria symlinks de v3 para v4 (backward compatibility)
 */
export async function createBackwardCompatSymlink(
  projectRoot: string,
  v3Path: string,
  v4Path: string
): Promise<void> {
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
  } catch {
    // Ignorar erros de symlink (pode não ser suportado no Windows)
    console.warn(`Warning: Could not create symlink ${v3Path} → ${v4Path}`);
  }
}

/**
 * Cria múltiplos symlinks
 */
export async function createSymlinks(
  projectRoot: string,
  mappings: SymlinkMapping[]
): Promise<number> {
  let created = 0;

  for (const mapping of mappings) {
    try {
      await createBackwardCompatSymlink(projectRoot, mapping.oldPath, mapping.newPath);
      created++;
    } catch {
      // Continuar mesmo se um symlink falhar
    }
  }

  return created;
}

/**
 * Preserva customizações do usuário
 *
 * Compara arquivo original com padrão e mantém diferenças
 */
export async function preserveCustomizations(
  originalFile: string,
  migratedFile: string
): Promise<boolean> {
  // TODO: Implementar diff e merge de customizações
  // Por agora, simplesmente copiar o arquivo
  const content = await fs.readFile(originalFile, 'utf-8');
  await fs.writeFile(migratedFile, content, 'utf-8');
  return true;
}

/**
 * Copia regras v3 para v4
 */
export async function copyRules(projectRoot: string): Promise<number> {
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
      await fs.copy(path.join(v3RulesPath, file), path.join(v4RulesPath, file));
      copied++;
    }
  }

  return copied;
}

/**
 * Copia sessions v3 para v4
 */
export async function copySessions(
  projectRoot: string,
  targetContext = 'technical'
): Promise<number> {
  const v3SessionsPath = path.join(projectRoot, '.cursor/sessions');
  const v4SessionsPath = path.join(projectRoot, `.onion/contexts/${targetContext}/sessions`);

  if (!(await fs.pathExists(v3SessionsPath))) {
    return 0;
  }

  // Copiar toda a pasta
  await fs.copy(v3SessionsPath, v4SessionsPath);

  // Contar subpastas
  const dirs = await fs.readdir(v3SessionsPath);
  let count = 0;
  for (const name of dirs) {
    const stat = await fs.stat(path.join(v3SessionsPath, name));
    if (stat.isDirectory()) {
      count++;
    }
  }

  return count;
}

// ============================================================================
// HELPERS PRIVADOS
// ============================================================================

/**
 * Cria YAML header para comando
 */
function createCommandYAMLHeader(name: string, context: string, level: string): string {
  const header = {
    name,
    description: `${name} command`,
    model: 'sonnet',
    category: context,
    tags: [level],
    version: '4.0.0',
    updated: new Date().toISOString().split('T')[0],
    level,
    context,
  };

  return '---\n' + yaml.stringify(header) + '---';
}

/**
 * Cria YAML header para agente
 */
function createAgentYAMLHeader(name: string, context: string): string {
  const header = {
    name,
    description: `${name} agent`,
    model: 'sonnet',
    category: context,
    tags: ['agent'],
    expertise: [],
    version: '4.0.0',
    updated: new Date().toISOString().split('T')[0],
    context,
  };

  return '---\n' + yaml.stringify(header) + '---';
}
