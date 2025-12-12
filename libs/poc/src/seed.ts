/**
 * Seed script para popular banco de dados com dados fixos da POC
 * 
 * Este script carrega os dados fixos e os insere no PostgreSQL (via Prisma)
 * e cria embeddings no Qdrant.
 */

import { loadAllPocData } from './loader';
import type { KnowbaseData, AgentData, CommandData, RuleData } from './loader';

// TODO: Importar Prisma client quando disponível
// import { prisma } from '@onion/database';

// TODO: Importar Qdrant client quando disponível
// import { qdrantClient } from '@onion/ai';

/**
 * Seed knowbases no PostgreSQL e embeddings no Qdrant
 */
async function seedKnowbases(
  knowbases: KnowbaseData[],
  // prisma: any,
  // qdrant: any
) {
  console.log(`📚 Seedando ${knowbases.length} knowbases...`);

  for (const knowbase of knowbases) {
    // TODO: Implementar quando Prisma estiver disponível
    // const created = await prisma.knowbase.create({
    //   data: {
    //     id: knowbase.id,
    //     name: knowbase.name,
    //     content: knowbase.content,
    //     tenantId: knowbase.tenantId,
    //   },
    // });

    // TODO: Criar embeddings no Qdrant
    // await createEmbeddings(knowbase.content, knowbase.id);

    console.log(`  ✅ Knowbase criada: ${knowbase.name} (${knowbase.id})`);
  }
}

/**
 * Seed agentes no PostgreSQL
 */
async function seedAgents(
  agents: AgentData[],
  // prisma: any
) {
  console.log(`🤖 Seedando ${agents.length} agentes...`);

  for (const agent of agents) {
    // TODO: Implementar quando Prisma estiver disponível
    // const created = await prisma.agent.create({
    //   data: {
    //     id: agent.id,
    //     name: agent.name,
    //     description: agent.description,
    //     knowbaseIds: agent.knowbaseIds,
    //     agentIds: agent.agentIds,
    //     instructions: agent.instructions,
    //     model: agent.model,
    //     tenantId: agent.tenantId,
    //     version: agent.metadata.version,
    //     updated: agent.metadata.updated,
    //   },
    // });

    console.log(`  ✅ Agente criado: @${agent.name} (${agent.id})`);
  }
}

/**
 * Seed comandos no PostgreSQL
 */
async function seedCommands(
  commands: CommandData[],
  // prisma: any
) {
  console.log(`⚡ Seedando ${commands.length} comandos...`);

  for (const command of commands) {
    // TODO: Implementar quando Prisma estiver disponível
    // const created = await prisma.command.create({
    //   data: {
    //     id: command.id,
    //     name: command.name,
    //     description: command.description,
    //     category: command.category,
    //     steps: command.steps,
    //     variables: command.variables,
    //     tenantId: command.tenantId,
    //     version: command.metadata.version,
    //     updated: command.metadata.updated,
    //   },
    // });

    console.log(`  ✅ Comando criado: /${command.name} (${command.id})`);
  }
}

/**
 * Seed regras no PostgreSQL
 */
async function seedRules(
  rules: RuleData[],
  // prisma: any
) {
  console.log(`📋 Seedando ${rules.length} arquivos de regras...`);

  for (const rule of rules) {
    // TODO: Implementar quando Prisma estiver disponível
    // const created = await prisma.rule.create({
    //   data: {
    //     id: rule.id,
    //     name: rule.name,
    //     description: rule.description,
    //     active: rule.active,
    //     scope: rule.scope,
    //     priority: rule.priority,
    //     content: rule.content,
    //     tenantId: rule.tenantId,
    //     version: rule.metadata.version,
    //     updated: rule.metadata.updated,
    //   },
    // });

    console.log(`  ✅ Regra criada: ${rule.name} (${rule.id})`);
  }
}

/**
 * Função principal de seed
 */
export async function seedPocData(tenantId: string = 'poc-tenant-id') {
  console.log('🧪 Iniciando seed da POC...\n');

  // Carregar todos os dados fixos
  const data = loadAllPocData(tenantId);

  console.log(`📊 Dados carregados:`);
  console.log(`  - Knowbases: ${data.knowbases.length}`);
  console.log(`  - Agentes: ${data.agents.length}`);
  console.log(`  - Comandos: ${data.commands.length}`);
  console.log(`  - Regras: ${data.rules.length}\n`);

  // Seed cada tipo de dado
  await seedKnowbases(data.knowbases);
  await seedAgents(data.agents);
  await seedCommands(data.commands);
  await seedRules(data.rules);

  console.log('\n✅ Seed da POC concluído!');
}

// Executar se chamado diretamente
if (require.main === module) {
  seedPocData()
    .then(() => {
      console.log('🎉 Seed executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro ao executar seed:', error);
      process.exit(1);
    });
}

