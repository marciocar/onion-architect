/**
 * Fixtures para testes da POC
 * 
 * Fornece dados de teste baseados nos dados fixos da POC.
 */

import { loadAllPocData } from './loader';

/**
 * Retorna dados de fixture para testes
 */
export function getPocFixtures(tenantId: string = 'test-tenant-id') {
  return loadAllPocData(tenantId);
}

/**
 * Retorna fixture de knowbase específica
 */
export function getKnowbaseFixture(name: string, tenantId: string = 'test-tenant-id') {
  const data = loadAllPocData(tenantId);
  return data.knowbases.find(kb => kb.name.toLowerCase().includes(name.toLowerCase()));
}

/**
 * Retorna fixture de agente específico
 */
export function getAgentFixture(name: string, tenantId: string = 'test-tenant-id') {
  const data = loadAllPocData(tenantId);
  return data.agents.find(agent => agent.name === name);
}

/**
 * Retorna fixture de comando específico
 */
export function getCommandFixture(name: string, tenantId: string = 'test-tenant-id') {
  const data = loadAllPocData(tenantId);
  return data.commands.find(cmd => cmd.name === name);
}

/**
 * Retorna fixture de regras
 */
export function getRulesFixture(tenantId: string = 'test-tenant-id') {
  const data = loadAllPocData(tenantId);
  return data.rules;
}

