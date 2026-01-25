/**
 * @fileoverview onion migrate - Migrar projeto Onion v3 para v4
 * @module commands/migrate
 *
 * Princípios:
 * - Reutiliza migrator/* e core/* e generator/*
 * - Workflow completo v3 → v4
 * - Preview antes de executar
 * - Backup automático
 * - Symlinks para backward compatibility
 */

import inquirer from 'inquirer';
import path from 'node:path';
import fs from 'fs-extra';
import { logger } from '../utils/logger.js';
import {
  detectOnionV3Structure,
  validateMigrationEligibility,
} from '../core/detector.js';
import * as coreConfig from '../core/config.js';
import * as generatorStructure from '../generator/structure.js';
import * as migrator from '../migrator/index.js';

export interface MigrateOptions {
  debug?: boolean;
  noBackup?: boolean;
}

/**
 * Comando migrate - Migração v3 → v4
 */
export async function migrate(options: MigrateOptions = {}): Promise<void> {
  try {
    const projectRoot = process.cwd();

    logger.title('🧅 Onion Migration: v3 → v4');
    logger.break();

    // 1. Detectar projeto v3
    const v3 = await detectOnionV3Structure(projectRoot);

    if (!v3) {
      logger.error('❌ This is not an Onion v3 project');
      logger.info('Looking for .cursor/ structure with commands/ and agents/');
      logger.break();
      logger.info('To initialize a new Onion v4 project, run: onion init');
      process.exit(1);
    }

    logger.success('✅ Onion v3 project detected');
    logger.break();

    // 2. Validar elegibilidade
    const eligibility = validateMigrationEligibility(v3);

    if (!eligibility.canMigrate) {
      logger.error('❌ Cannot migrate this project:');
      for (const issue of eligibility.issues) {
        logger.error(`  • ${issue}`);
      }
      process.exit(1);
    }

    // 3. Analisar estrutura v3
    logger.startSpinner('Analyzing v3 structure...');
    const analysis = await migrator.analyzeV3Structure(projectRoot);
    logger.stopSpinner(true, 'Analysis complete');

    logger.break();
    logger.info('📊 Found:');
    logger.info(`  • ${analysis.stats.totalCommands} commands`);
    logger.info(`  • ${analysis.stats.totalAgents} agents`);
    if (analysis.stats.hasRules) logger.info('  • Rules directory');
    if (analysis.stats.hasSessions) logger.info('  • Sessions directory');
    logger.break();

    // 4. Construir plano de migração
    const plan = migrator.buildMigrationPlan(analysis);

    // Validar plano
    const planValidation = migrator.validateMigrationPlan(plan);
    if (!planValidation.valid) {
      logger.error('❌ Migration plan has issues:');
      for (const issue of planValidation.issues) {
        logger.error(`  • ${issue}`);
      }
      process.exit(1);
    }

    // 5. Mostrar preview
    logger.title('🗺️  Migration Plan:');
    logger.break();

    logger.info(`📦 Contexts to create: ${plan.contexts.join(', ')}`);
    logger.break();

    logger.info('📝 Commands:');
    for (const [context, count] of Object.entries(plan.summary.commandsByContext)) {
      logger.info(`  • ${context}: ${count} commands`);
    }
    logger.break();

    logger.info('🤖 Agents:');
    for (const [context, count] of Object.entries(plan.summary.agentsByContext)) {
      logger.info(`  • ${context}: ${count} agents`);
    }
    logger.break();

    // 6. Confirmar migração
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Proceed with migration?',
        default: false,
      },
    ]);

    if (!confirm) {
      logger.warn('❌ Migration cancelled');
      return;
    }

    logger.break();
    logger.title('🚀 Starting migration...');
    logger.break();

    // 7. Criar backup (opcional)
    if (!options.noBackup) {
      logger.startSpinner('Creating backup...');
      const backupPath = path.join(projectRoot, '.cursor-backup');
      await fs.copy(path.join(projectRoot, '.cursor'), backupPath);
      logger.stopSpinner(true, `Backup created: .cursor-backup/`);
    }

    // 8. Gerar estrutura v4
    logger.startSpinner('Creating v4 structure...');

    // Core
    await generatorStructure.generateCoreStructure(projectRoot);

    // Contexts
    for (const contextName of plan.contexts) {
      await generatorStructure.generateContextStructure(projectRoot, contextName, {
        includeREADME: true,
        includeConfig: true,
      });
    }

    // IDEs
    await generatorStructure.generateIDELoader(projectRoot, 'cursor', {
      contexts: plan.contexts,
    });

    // Docs
    await generatorStructure.generateDocsStructure(projectRoot, plan.contexts);

    logger.stopSpinner(true, 'Structure created');

    // 9. Migrar comandos
    logger.startSpinner(`Migrating ${plan.commands.length} commands...`);

    for (const mapping of plan.commands) {
      const targetPath = path.join(projectRoot, mapping.newPath);
      await migrator.transformCommandFile(
        mapping.oldPath,
        targetPath,
        mapping.context,
        mapping.level
      );
    }

    logger.stopSpinner(true, `${plan.commands.length} commands migrated`);

    // 10. Migrar agentes
    logger.startSpinner(`Migrating ${plan.agents.length} agents...`);

    for (const mapping of plan.agents) {
      const targetPath = path.join(projectRoot, mapping.newPath);
      await migrator.transformAgentFile(mapping.oldPath, targetPath, mapping.context);
    }

    logger.stopSpinner(true, `${plan.agents.length} agents migrated`);

    // 11. Copiar rules e sessions
    if (analysis.stats.hasRules) {
      logger.startSpinner('Copying rules...');
      const copied = await migrator.copyRules(projectRoot);
      logger.stopSpinner(true, `${copied} rules copied`);
    }

    if (analysis.stats.hasSessions) {
      logger.startSpinner('Copying sessions...');
      await migrator.copySessions(projectRoot, 'technical');
      logger.stopSpinner(true, `Sessions copied`);
    }

    // 12. Criar symlinks (backward compatibility)
    logger.startSpinner('Creating symlinks for backward compatibility...');

    const symlinkMappings = [
      ...plan.commands.map((m) => ({
        oldPath: path.relative(projectRoot, m.oldPath),
        newPath: m.newPath,
      })),
      ...plan.agents.map((m) => ({
        oldPath: path.relative(projectRoot, m.oldPath),
        newPath: m.newPath,
      })),
    ];

    const symlinkCount = await migrator.createSymlinks(projectRoot, symlinkMappings);
    logger.stopSpinner(true, `${symlinkCount} symlinks created`);

    // 13. Criar configuração v4
    logger.startSpinner('Creating .onion-config.yml...');

    const configData = coreConfig.createDefaultConfig({
      version: '4.0.0',
      contexts: plan.contexts,
      ides: ['cursor'],
      migrated: true,
      migratedFrom: 'v3',
      migratedAt: new Date().toISOString(),
      migration: {
        commandsMigrated: plan.commands.length,
        agentsMigrated: plan.agents.length,
        backupPath: options.noBackup ? null : '.cursor-backup/',
      },
    });

    await coreConfig.createConfig(projectRoot, configData);
    logger.stopSpinner(true, 'Config created');

    // 14. Salvar relatório
    const reportPath = path.join(projectRoot, 'docs/onion/MIGRATION-REPORT.md');
    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeFile(reportPath, migrator.generateMigrationReport(plan), 'utf-8');

    // 15. Success!
    logger.break();
    logger.title('✅ Migration completed successfully!');
    logger.break();

    logger.success('Summary:');
    logger.info(`  • ${plan.commands.length} commands migrated`);
    logger.info(`  • ${plan.agents.length} agents migrated`);
    logger.info(`  • ${plan.contexts.length} contexts created`);
    logger.info(`  • ${symlinkCount} symlinks for backward compatibility`);
    if (!options.noBackup) {
      logger.info('  • Backup saved: .cursor-backup/');
    }
    logger.break();

    logger.success('Next steps:');
    logger.info('  1. Review migration report: docs/onion/MIGRATION-REPORT.md');
    logger.info('  2. Test your commands (they still work via symlinks)');
    logger.info('  3. Explore new structure: .onion/contexts/');
    logger.info('  4. Read system guide: docs/onion/levels-system.md');
    logger.info('  5. Use new help commands: /business/help, /technical/help');
    logger.break();

    logger.warn('⚠️  Important:');
    logger.info('  • .cursor/ is now deprecated (kept for backward compatibility)');
    logger.info('  • New commands/agents should be added to .onion/contexts/');
    logger.info('  • Backup can be removed after validation: rm -rf .cursor-backup');
    logger.break();
  } catch (error) {
    logger.break();
    logger.error('❌ Migration failed:');
    logger.error((error as Error).message);
    if (options.debug) {
      console.error(error);
    }

    logger.break();
    logger.info('💡 Troubleshooting:');
    logger.info('  • Backup preserved: .cursor-backup/');
    logger.info('  • Review error above');
    logger.info('  • Run with --debug for more details');
    logger.info('  • Report issue: https://github.com/onion-system/onion/issues');
    logger.break();

    process.exit(1);
  }
}

export default migrate;
