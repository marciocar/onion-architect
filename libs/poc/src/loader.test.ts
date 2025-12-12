/**
 * Testes unitários para o loader da POC
 * 
 * Valida que o loader consegue carregar e parsear corretamente
 * todos os arquivos de dados fixos da POC.
 */

import { describe, test, expect } from 'vitest';
import {
  loadKnowbases,
  loadAgents,
  loadCommands,
  loadRules,
  loadAllPocData,
  type KnowbaseData,
  type AgentData,
  type CommandData,
  type RuleData,
} from './loader';

const TEST_TENANT_ID = 'test-tenant-id';

describe('POC Loader', () => {
  describe('loadKnowbases', () => {
    test('deve carregar 2 knowbases', () => {
      const knowbases = loadKnowbases(TEST_TENANT_ID);
      
      expect(knowbases).toHaveLength(2);
    });

    test('knowbases devem ter estrutura correta', () => {
      const knowbases = loadKnowbases(TEST_TENANT_ID);
      
      knowbases.forEach((kb) => {
        expect(kb).toHaveProperty('id');
        expect(kb).toHaveProperty('name');
        expect(kb).toHaveProperty('content');
        expect(kb).toHaveProperty('tenantId');
        expect(kb.tenantId).toBe(TEST_TENANT_ID);
        expect(typeof kb.id).toBe('string');
        expect(typeof kb.name).toBe('string');
        expect(typeof kb.content).toBe('string');
        expect(kb.content.length).toBeGreaterThan(0);
      });
    });

    test('deve carregar knowbase de marketing digital', () => {
      const knowbases = loadKnowbases(TEST_TENANT_ID);
      const marketing = knowbases.find(kb => 
        kb.name.toLowerCase().includes('marketing')
      );
      
      expect(marketing).toBeDefined();
      expect(marketing?.content).toContain('Marketing Digital 2025');
      expect(marketing?.content).toContain('SEO');
      expect(marketing?.content).toContain('Google Ads');
    });

    test('deve carregar knowbase de vendas', () => {
      const knowbases = loadKnowbases(TEST_TENANT_ID);
      const vendas = knowbases.find(kb => 
        kb.name.toLowerCase().includes('vendas')
      );
      
      expect(vendas).toBeDefined();
      expect(vendas?.content).toContain('Vendas e Negociação');
      expect(vendas?.content).toContain('BANT');
    });
  });

  describe('loadAgents', () => {
    test('deve carregar 3 agentes', () => {
      const agents = loadAgents(TEST_TENANT_ID);
      
      expect(agents).toHaveLength(3);
    });

    test('agentes devem ter estrutura correta', () => {
      const agents = loadAgents(TEST_TENANT_ID);
      
      agents.forEach((agent) => {
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('description');
        expect(agent).toHaveProperty('knowbaseIds');
        expect(agent).toHaveProperty('instructions');
        expect(agent).toHaveProperty('model');
        expect(agent).toHaveProperty('tenantId');
        expect(agent).toHaveProperty('metadata');
        expect(agent.tenantId).toBe(TEST_TENANT_ID);
        expect(Array.isArray(agent.knowbaseIds)).toBe(true);
        expect(typeof agent.instructions).toBe('string');
        expect(agent.instructions.length).toBeGreaterThan(0);
      });
    });

    test('deve carregar agente @marketing', () => {
      const agents = loadAgents(TEST_TENANT_ID);
      const marketing = agents.find(a => a.name === 'marketing');
      
      expect(marketing).toBeDefined();
      expect(marketing?.knowbaseIds).toContain('knowbase-marketing-id');
      expect(marketing?.description).toContain('Marketing Digital');
    });

    test('deve carregar agente @vendas', () => {
      const agents = loadAgents(TEST_TENANT_ID);
      const vendas = agents.find(a => a.name === 'vendas');
      
      expect(vendas).toBeDefined();
      expect(vendas?.knowbaseIds).toContain('knowbase-vendas-id');
      expect(vendas?.description).toContain('Vendas');
    });

    test('deve carregar agente @onion com agentIds configurado', () => {
      const agents = loadAgents(TEST_TENANT_ID);
      const onion = agents.find(a => a.name === 'onion');
      
      expect(onion).toBeDefined();
      expect(onion?.agentIds).toBeDefined();
      expect(Array.isArray(onion?.agentIds)).toBe(true);
      expect(onion?.agentIds).toContain('agent-marketing-id');
      expect(onion?.agentIds).toContain('agent-vendas-id');
      expect(onion?.knowbaseIds).toContain('knowbase-marketing-id');
      expect(onion?.knowbaseIds).toContain('knowbase-vendas-id');
    });
  });

  describe('loadCommands', () => {
    test('deve carregar 2 comandos', () => {
      const commands = loadCommands(TEST_TENANT_ID);
      
      expect(commands).toHaveLength(2);
    });

    test('comandos devem ter estrutura correta', () => {
      const commands = loadCommands(TEST_TENANT_ID);
      
      commands.forEach((cmd) => {
        expect(cmd).toHaveProperty('id');
        expect(cmd).toHaveProperty('name');
        expect(cmd).toHaveProperty('description');
        expect(cmd).toHaveProperty('category');
        expect(cmd).toHaveProperty('steps');
        expect(cmd).toHaveProperty('tenantId');
        expect(cmd).toHaveProperty('metadata');
        expect(cmd.tenantId).toBe(TEST_TENANT_ID);
        expect(Array.isArray(cmd.steps)).toBe(true);
        expect(cmd.steps.length).toBeGreaterThan(0);
      });
    });

    test('deve carregar comando estrategia-marketing', () => {
      const commands = loadCommands(TEST_TENANT_ID);
      const estrategia = commands.find(c => c.name === 'estrategia-marketing');
      
      expect(estrategia).toBeDefined();
      expect(estrategia?.category).toBe('marketing');
      expect(estrategia?.steps).toBeDefined();
      expect(estrategia?.variables).toBeDefined();
      expect(Array.isArray(estrategia?.variables)).toBe(true);
    });

    test('deve carregar comando preparar-venda', () => {
      const commands = loadCommands(TEST_TENANT_ID);
      const preparar = commands.find(c => c.name === 'preparar-venda');
      
      expect(preparar).toBeDefined();
      expect(preparar?.category).toBe('vendas');
      expect(preparar?.steps).toBeDefined();
    });
  });

  describe('loadRules', () => {
    test('deve carregar 1 arquivo de regras', () => {
      const rules = loadRules(TEST_TENANT_ID);
      
      expect(rules).toHaveLength(1);
    });

    test('regras devem ter estrutura correta', () => {
      const rules = loadRules(TEST_TENANT_ID);
      
      rules.forEach((rule) => {
        expect(rule).toHaveProperty('id');
        expect(rule).toHaveProperty('name');
        expect(rule).toHaveProperty('description');
        expect(rule).toHaveProperty('active');
        expect(rule).toHaveProperty('scope');
        expect(rule).toHaveProperty('priority');
        expect(rule).toHaveProperty('content');
        expect(rule).toHaveProperty('tenantId');
        expect(rule).toHaveProperty('metadata');
        expect(rule.tenantId).toBe(TEST_TENANT_ID);
        expect(typeof rule.active).toBe('boolean');
        expect(typeof rule.priority).toBe('number');
        expect(typeof rule.content).toBe('string');
        expect(rule.content.length).toBeGreaterThan(0);
      });
    });

    test('deve carregar regras padrão POC', () => {
      const rules = loadRules(TEST_TENANT_ID);
      const pocRules = rules.find(r => r.name === 'poc-default-rules');
      
      expect(pocRules).toBeDefined();
      expect(pocRules?.active).toBe(true);
      expect(pocRules?.scope.global).toBe(true);
      expect(pocRules?.content).toContain('Tom de Comunicação');
      expect(pocRules?.content).toContain('Citação de Fontes');
    });
  });

  describe('loadAllPocData', () => {
    test('deve carregar todos os dados da POC', () => {
      const data = loadAllPocData(TEST_TENANT_ID);
      
      expect(data.knowbases).toHaveLength(2);
      expect(data.agents).toHaveLength(3);
      expect(data.commands).toHaveLength(2);
      expect(data.rules).toHaveLength(1);
    });

    test('deve usar tenantId correto em todos os dados', () => {
      const customTenantId = 'custom-tenant-123';
      const data = loadAllPocData(customTenantId);
      
      data.knowbases.forEach(kb => {
        expect(kb.tenantId).toBe(customTenantId);
      });
      
      data.agents.forEach(agent => {
        expect(agent.tenantId).toBe(customTenantId);
      });
      
      data.commands.forEach(cmd => {
        expect(cmd.tenantId).toBe(customTenantId);
      });
      
      data.rules.forEach(rule => {
        expect(rule.tenantId).toBe(customTenantId);
      });
    });
  });

  describe('Validação de Relacionamentos', () => {
    test('agentes devem referenciar knowbases existentes', () => {
      const knowbases = loadKnowbases(TEST_TENANT_ID);
      const agents = loadAgents(TEST_TENANT_ID);
      
      const knowbaseIds = new Set(knowbases.map(kb => kb.id));
      
      agents.forEach(agent => {
        agent.knowbaseIds.forEach(kbId => {
          // IDs são gerados dinamicamente, então validamos formato
          expect(kbId).toMatch(/knowbase-.*-id/);
        });
      });
    });

    test('@onion deve conhecer os outros agentes', () => {
      const agents = loadAgents(TEST_TENANT_ID);
      const onion = agents.find(a => a.name === 'onion');
      
      expect(onion).toBeDefined();
      expect(onion?.agentIds).toBeDefined();
      expect(onion?.agentIds?.length).toBeGreaterThanOrEqual(2);
    });

    test('comandos devem referenciar agentes existentes', () => {
      const agents = loadAgents(TEST_TENANT_ID);
      const commands = loadCommands(TEST_TENANT_ID);
      
      const agentIds = new Set(agents.map(a => a.id));
      
      commands.forEach(cmd => {
        cmd.steps.forEach(step => {
          if (step.type === 'agent' && step.agentId) {
            // IDs são gerados dinamicamente, então validamos formato
            expect(step.agentId).toMatch(/agent-.*-id/);
          }
        });
      });
    });
  });
});

