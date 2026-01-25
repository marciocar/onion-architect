/**
 * Testes para core/detector.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import {
  detectOnionProject,
  detectOnionV4Structure,
  detectOnionV3Structure,
  isOnionProject,
  getOnionVersion,
  validateMigrationEligibility
} from '../../src/core/detector.js';

describe('core/detector', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `onion-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.remove(tempDir);
    }
  });

  describe('detectOnionV4Structure', () => {
    it('deve detectar projeto v4 válido', async () => {
      // Criar estrutura v4
      await fs.ensureDir(path.join(tempDir, '.onion/contexts'));
      await fs.ensureDir(path.join(tempDir, '.onion/core'));
      await fs.writeFile(
        path.join(tempDir, '.onion-config.yml'),
        'version: "4.0.0"\ncontexts: []\nides: []'
      );

      const result = await detectOnionV4Structure(tempDir);

      expect(result).not.toBeNull();
      expect(result.version).toBe('v4');
      expect(result.root).toBe(tempDir);
    });

    it('deve retornar null se não é v4', async () => {
      const result = await detectOnionV4Structure(tempDir);
      expect(result).toBeNull();
    });
  });

  describe('detectOnionV3Structure', () => {
    it('deve detectar projeto v3 válido', async () => {
      // Criar estrutura v3
      await fs.ensureDir(path.join(tempDir, '.cursor/commands/product'));
      await fs.ensureDir(path.join(tempDir, '.cursor/agents/product'));

      const result = await detectOnionV3Structure(tempDir);

      expect(result).not.toBeNull();
      expect(result.version).toBe('v3');
      expect(result.root).toBe(tempDir);
    });

    it('deve retornar null se tem .onion/ (é v4)', async () => {
      // Criar estruturas v3 E v4
      await fs.ensureDir(path.join(tempDir, '.cursor/commands'));
      await fs.ensureDir(path.join(tempDir, '.onion'));

      const result = await detectOnionV3Structure(tempDir);
      expect(result).toBeNull();
    });
  });

  describe('detectOnionProject', () => {
    it('deve detectar v4 primeiro', async () => {
      await fs.ensureDir(path.join(tempDir, '.onion/contexts'));
      await fs.writeFile(
        path.join(tempDir, '.onion-config.yml'),
        'version: "4.0.0"\ncontexts: []\nides: []'
      );

      const result = await detectOnionProject(tempDir);
      expect(result.version).toBe('v4');
    });

    it('deve detectar v3 se não é v4', async () => {
      await fs.ensureDir(path.join(tempDir, '.cursor/commands'));

      const result = await detectOnionProject(tempDir);
      expect(result.version).toBe('v3');
    });

    it('deve retornar null se não é Onion', async () => {
      const result = await detectOnionProject(tempDir);
      expect(result).toBeNull();
    });
  });

  describe('isOnionProject', () => {
    it('deve retornar true para projeto Onion', async () => {
      await fs.ensureDir(path.join(tempDir, '.onion/contexts'));
      await fs.writeFile(
        path.join(tempDir, '.onion-config.yml'),
        'version: "4.0.0"\ncontexts: []\nides: []'
      );

      const result = await isOnionProject(tempDir);
      expect(result).toBe(true);
    });

    it('deve retornar false para não-Onion', async () => {
      const result = await isOnionProject(tempDir);
      expect(result).toBe(false);
    });
  });

  describe('validateMigrationEligibility', () => {
    it('deve aprovar v3 válido', () => {
      const v3 = {
        version: 'v3',
        root: tempDir,
        commands: { product: ['spec.md'] },
        agents: {}
      };

      const result = validateMigrationEligibility(v3);
      expect(result.canMigrate).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('deve rejeitar não-v3', () => {
      const result = validateMigrationEligibility({ version: 'v4' });
      expect(result.canMigrate).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });
});

