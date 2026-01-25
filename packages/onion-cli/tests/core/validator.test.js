/**
 * Testes para core/validator.js
 */

import { describe, it, expect } from 'vitest';
import {
  validateContextName,
  validateIDEName,
  validateConfig,
  validatePath,
  validateSemver
} from '../../src/core/validator.js';

describe('core/validator', () => {
  describe('validateContextName', () => {
    it('deve aceitar nomes válidos', () => {
      expect(() => validateContextName('business')).not.toThrow();
      expect(() => validateContextName('technical')).not.toThrow();
      expect(() => validateContextName('customer-success')).not.toThrow();
    });

    it('deve rejeitar nomes muito curtos', () => {
      expect(() => validateContextName('ab')).toThrow(/entre 3 e 20/);
    });

    it('deve rejeitar nomes muito longos', () => {
      expect(() => validateContextName('a'.repeat(21))).toThrow(/entre 3 e 20/);
    });

    it('deve rejeitar nomes com caracteres inválidos', () => {
      expect(() => validateContextName('Business')).toThrow(/minúscula/);
      expect(() => validateContextName('business_context')).toThrow(/minúscula/);
      expect(() => validateContextName('business context')).toThrow(/minúscula/);
    });

    it('deve rejeitar nomes terminando com hífen', () => {
      expect(() => validateContextName('business-')).toThrow(/hífen/);
    });

    it('deve rejeitar palavras reservadas', () => {
      expect(() => validateContextName('core')).toThrow(/reservada/);
      expect(() => validateContextName('ide')).toThrow(/reservada/);
      expect(() => validateContextName('contexts')).toThrow(/reservada/);
    });
  });

  describe('validateIDEName', () => {
    it('deve aceitar IDEs suportados', () => {
      expect(() => validateIDEName('cursor')).not.toThrow();
      expect(() => validateIDEName('windsurf')).not.toThrow();
      expect(() => validateIDEName('claude')).not.toThrow();
    });

    it('deve rejeitar IDEs não suportados', () => {
      expect(() => validateIDEName('vscode')).toThrow(/não é suportado/);
      expect(() => validateIDEName('unknown')).toThrow(/não é suportado/);
    });
  });

  describe('validateConfig', () => {
    it('deve aceitar configuração válida', () => {
      const config = {
        version: '4.0.0',
        contexts: ['business', 'technical'],
        ides: ['cursor']
      };
      expect(() => validateConfig(config)).not.toThrow();
    });

    it('deve rejeitar config sem campos obrigatórios', () => {
      expect(() => validateConfig({})).toThrow(/obrigatório/);
      expect(() => validateConfig({ version: '4.0.0' })).toThrow(/obrigatório/);
    });

    it('deve rejeitar contexts inválidos', () => {
      const config = {
        version: '4.0.0',
        contexts: ['business', 'INVALID'],
        ides: ['cursor']
      };
      expect(() => validateConfig(config)).toThrow(/Contexto inválido/);
    });
  });

  describe('validateSemver', () => {
    it('deve aceitar versões válidas', () => {
      expect(() => validateSemver('4.0.0')).not.toThrow();
      expect(() => validateSemver('1.2.3')).not.toThrow();
      expect(() => validateSemver('10.20.30')).not.toThrow();
    });

    it('deve rejeitar versões inválidas', () => {
      expect(() => validateSemver('4.0')).toThrow(/inválida/);
      expect(() => validateSemver('v4.0.0')).toThrow(/inválida/);
      expect(() => validateSemver('invalid')).toThrow(/inválida/);
    });
  });
});

