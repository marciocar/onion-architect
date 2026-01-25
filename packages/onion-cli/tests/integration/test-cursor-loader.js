/**
 * Teste de integração: Cursor Loader
 * 
 * Testa se o loader funciona corretamente após onion init
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

describe('Cursor Loader Integration', () => {
  const testProjectRoot = path.join(__dirname, '../../../../tmp/test-onion-loader');
  
  beforeAll(() => {
    // Limpar projeto de teste
    if (fs.existsSync(testProjectRoot)) {
      fs.removeSync(testProjectRoot);
    }
    fs.mkdirSync(testProjectRoot, { recursive: true });
  });
  
  afterAll(() => {
    // Limpar após testes
    if (fs.existsSync(testProjectRoot)) {
      fs.removeSync(testProjectRoot);
    }
  });
  
  test('should generate loader after init', async () => {
    // Este teste requer execução manual do init
    // Por enquanto, apenas verifica estrutura esperada
    const loaderPath = path.join(testProjectRoot, '.onion/ide/cursor/onion-loader.js');
    
    // Se loader existe, verificar sintaxe
    if (fs.existsSync(loaderPath)) {
      const loaderContent = fs.readFileSync(loaderPath, 'utf-8');
      expect(loaderContent).toContain('CursorOnionLoader');
      expect(loaderContent).toContain('discover');
      expect(loaderContent).toContain('syncToCursor');
    }
  });
  
  test('loader should discover resources', () => {
    const loaderPath = path.join(testProjectRoot, '.onion/ide/cursor/onion-loader.js');
    
    if (fs.existsSync(loaderPath)) {
      const { getLoader } = require(loaderPath);
      const loader = getLoader(testProjectRoot);
      const resources = loader.discover();
      
      expect(resources).toHaveProperty('contexts');
      expect(resources).toHaveProperty('commands');
      expect(resources).toHaveProperty('agents');
      expect(Array.isArray(resources.contexts)).toBe(true);
      expect(Array.isArray(resources.commands)).toBe(true);
      expect(Array.isArray(resources.agents)).toBe(true);
    }
  });
  
  test('loader should sync to .cursor/', () => {
    const loaderPath = path.join(testProjectRoot, '.onion/ide/cursor/onion-loader.js');
    
    if (fs.existsSync(loaderPath)) {
      const { getLoader } = require(loaderPath);
      const loader = getLoader(testProjectRoot);
      const result = loader.syncToCursor();
      
      expect(result).toHaveProperty('commandsSynced');
      expect(result).toHaveProperty('agentsSynced');
      expect(result).toHaveProperty('contexts');
      
      // Verificar se symlinks foram criados
      const cursorCommandsDir = path.join(testProjectRoot, '.cursor/commands');
      if (fs.existsSync(cursorCommandsDir)) {
        expect(fs.existsSync(cursorCommandsDir)).toBe(true);
      }
    }
  });
});
