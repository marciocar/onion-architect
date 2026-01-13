/**
 * Testes para core/config.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import {
  readConfig,
  createConfig,
  updateConfig,
  deleteConfig,
  configExists,
  addContext,
  removeContext,
  addIDE,
  removeIDE,
  createDefaultConfig
} from '../../src/core/config.js';

describe('core/config', () => {
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

  describe('createConfig', () => {
    it('deve criar arquivo de configuração', async () => {
      const config = {
        version: '4.0.0',
        contexts: ['business'],
        ides: ['cursor']
      };

      await createConfig(tempDir, config);

      const exists = await configExists(tempDir);
      expect(exists).toBe(true);
    });

    it('deve rejeitar se arquivo já existe', async () => {
      const config = {
        version: '4.0.0',
        contexts: [],
        ides: []
      };

      await createConfig(tempDir, config);

      await expect(createConfig(tempDir, config)).rejects.toThrow(/já existe/);
    });
  });

  describe('readConfig', () => {
    it('deve ler configuração válida', async () => {
      const original = {
        version: '4.0.0',
        contexts: ['business', 'technical'],
        ides: ['cursor']
      };

      await createConfig(tempDir, original);
      const read = await readConfig(tempDir);

      expect(read.version).toBe(original.version);
      expect(read.contexts).toEqual(original.contexts);
      expect(read.ides).toEqual(original.ides);
    });

    it('deve rejeitar se arquivo não existe', async () => {
      await expect(readConfig(tempDir)).rejects.toThrow(/não encontrado/);
    });
  });

  describe('updateConfig', () => {
    it('deve fazer merge de atualizações', async () => {
      const original = {
        version: '4.0.0',
        contexts: ['business'],
        ides: ['cursor']
      };

      await createConfig(tempDir, original);

      const updated = await updateConfig(tempDir, {
        contexts: ['technical'] // Será merged com ['business']
      });

      expect(updated.contexts).toContain('business');
      expect(updated.contexts).toContain('technical');
    });
  });

  describe('addContext', () => {
    it('deve adicionar contexto novo', async () => {
      await createConfig(tempDir, {
        version: '4.0.0',
        contexts: ['business'],
        ides: []
      });

      const updated = await addContext(tempDir, 'technical');

      expect(updated.contexts).toContain('business');
      expect(updated.contexts).toContain('technical');
    });

    it('deve rejeitar contexto duplicado', async () => {
      await createConfig(tempDir, {
        version: '4.0.0',
        contexts: ['business'],
        ides: []
      });

      await expect(addContext(tempDir, 'business')).rejects.toThrow(/já existe/);
    });
  });

  describe('removeContext', () => {
    it('deve remover contexto existente', async () => {
      await createConfig(tempDir, {
        version: '4.0.0',
        contexts: ['business', 'technical'],
        ides: []
      });

      const updated = await removeContext(tempDir, 'technical');

      expect(updated.contexts).toContain('business');
      expect(updated.contexts).not.toContain('technical');
    });
  });

  describe('addIDE', () => {
    it('deve adicionar IDE novo', async () => {
      await createConfig(tempDir, {
        version: '4.0.0',
        contexts: [],
        ides: ['cursor']
      });

      const updated = await addIDE(tempDir, 'windsurf');

      expect(updated.ides).toContain('cursor');
      expect(updated.ides).toContain('windsurf');
    });
  });

  describe('deleteConfig', () => {
    it('deve remover arquivo de configuração', async () => {
      await createConfig(tempDir, {
        version: '4.0.0',
        contexts: [],
        ides: []
      });

      await deleteConfig(tempDir);

      const exists = await configExists(tempDir);
      expect(exists).toBe(false);
    });
  });

  describe('createDefaultConfig', () => {
    it('deve criar configuração padrão', () => {
      const config = createDefaultConfig();

      expect(config.version).toBe('4.0.0');
      expect(config.ides).toContain('cursor');
      expect(config.created).toBeDefined();
    });

    it('deve aceitar opções customizadas', () => {
      const config = createDefaultConfig({
        contexts: ['business'],
        version: '5.0.0'
      });

      expect(config.version).toBe('5.0.0');
      expect(config.contexts).toContain('business');
    });
  });
});

