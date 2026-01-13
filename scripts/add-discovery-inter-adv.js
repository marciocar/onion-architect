#!/usr/bin/env node

/**
 * Script para adicionar "Pré-requisitos" e "Próximos Passos" em comandos intermediate/advanced
 * 
 * Adiciona navegação reversa em 15 comandos selecionados:
 * - 5 business intermediate
 * - 3 business advanced
 * - 5 technical intermediate
 * - 2 technical advanced
 */

const fs = require('fs-extra');
const path = require('path');

const PROJECT_ROOT = process.cwd();

// Mapeamento: arquivo → conteúdo de descoberta
const DISCOVERY_CONTENT = {
  // ===== BUSINESS INTERMEDIATE =====
  'business/commands/intermediate/feature.md': `

---

## 📚 Pré-requisitos

Antes de usar este comando, você deve estar confortável com:

1. **\`/business/spec "feature"\`** (Starter)
   - Criar especificações básicas
   - Entender estrutura de requisitos

2. **\`/business/estimate "feature"\`** (Starter)
   - Estimar story points
   - Dimensionar complexidade

3. **\`/business/task "feature"\`** (Starter)
   - Criar tasks individuais
   - Estruturar critérios de aceitação

💡 **Este comando é um "meta-comando"** que executa spec + estimate + task em sequência. Use quando quiser criar uma feature completa de uma vez.

---

## 🚀 Próximos Passos

Após criar a feature completa:

1. **Iniciar desenvolvimento**:
   \`\`\`bash
   /technical/start "feature-name"
   \`\`\`
   Começa implementação técnica com sessão estruturada.

2. **Validar tasks criadas**:
   \`\`\`bash
   /business/task-check "task-id"
   \`\`\`
   Verifica se todas as tasks têm informação necessária.

3. **Acompanhar no task manager**:
   Acompanhe progresso das subtasks criadas automaticamente.
`,

  'business/commands/intermediate/extract-meeting.md': `

---

## 📚 Pré-requisitos

Antes de usar este comando:

1. **`/business/warm-up`** (Starter)
   - Carregar contexto do projeto
   - Entender objetivos atuais

2. **Ter transcrição ou notas da reunião**
   - Texto, áudio (via \`/business/whisper\`), ou anotações
   - Quanto mais detalhado, melhor a extração

💡 **Framework EXTRACT** extrai 7 dimensões: Decisões, Ações, Riscos, Contexto, Stakeholders, Timeline, Dependências.

---

## 🚀 Próximos Passos

Após extrair a reunião:

1. **Consolidar com outras reuniões**:
   \`\`\`bash
   /business/consolidate-meetings
   \`\`\`
   Agrupa decisões de múltiplos meetings relacionados.

2. **Converter em tasks**:
   \`\`\`bash
   /business/convert-to-tasks
   \`\`\`
   Transforma ações identificadas em tasks rastreáveis.

3. **Transformar em documento estruturado**:
   \`\`\`bash
   /business/transform-consolidated
   \`\`\`
   Gera PRD ou spec formal a partir das reuniões.
`,

  'business/commands/intermediate/consolidate-meetings.md': `

---

## 📚 Pré-requisitos

Este comando requer:

1. **Reuniões já extraídas**:
   Use \`/business/extract-meeting\` em cada reunião primeiro.

2. **Framework EXTRACT compreendido**:
   Entenda as 7 dimensões: Decisões, Ações, Riscos, Contexto, Stakeholders, Timeline, Dependências.

💡 **Consolidação** é especialmente útil para features que levaram múltiplas reuniões para definir.

---

## 🚀 Próximos Passos

Após consolidar:

1. **Transformar em especificação**:
   \`\`\`bash
   /business/transform-consolidated
   \`\`\`
   Converte reuniões consolidadas em spec formal.

2. **Ou converter diretamente em tasks**:
   \`\`\`bash
   /business/convert-to-tasks
   \`\`\`
   Pula especificação e vai direto para tasks executáveis.
`,

  'business/commands/intermediate/convert-to-tasks.md': `

---

## 📚 Pré-requisitos

Antes de converter:

1. **Ter especificação ou reuniões consolidadas**:
   - Via \`/business/spec\` (Starter)
   - Ou \`/business/consolidate-meetings\` (Intermediate)

2. **Estimar complexidade** (recomendado):
   \`\`\`bash
   /business/estimate "feature"
   \`\`\`
   Ajuda a quebrar em tasks de tamanho apropriado.

💡 **Conversão automática** usa IA para quebrar specs em subtasks lógicas e rastreáveis.

---

## 🚀 Próximos Passos

Após criar tasks:

1. **Validar tasks geradas**:
   \`\`\`bash
   /business/task-check "task-id"
   \`\`\`
   Verifica completude de cada task criada.

2. **Iniciar desenvolvimento**:
   \`\`\`bash
   /technical/start "primeira-task"
   \`\`\`
   Começa implementação da primeira subtask.
`,

  'business/commands/intermediate/light-arch.md': `

---

## 📚 Pré-requisitos

Antes de criar arquitetura leve:

1. **Especificação clara**:
   Use \`/business/spec\` (Starter) para definir requisitos primeiro.

2. **Estimativa de complexidade**:
   \`/business/estimate\` ajuda a entender se arquitetura é necessária.

💡 **Light Arch** é ponte entre business e technical - não substitui arquitetura técnica completa.

---

## 🚀 Próximos Passos

Após criar arquitetura leve:

1. **Criar plano técnico detalhado**:
   \`\`\`bash
   /technical/plan "feature"
   \`\`\`
   Expande arquitetura leve em fases de implementação.

2. **Iniciar sessão de desenvolvimento**:
   \`\`\`bash
   /technical/start "feature"
   \`\`\`
   Cria arquitetura técnica completa + plano + branch git.

3. **Validar com agente especializado**:
   Use \`@c4-architecture-specialist\` para review de decisões arquiteturais.
`,

  // ===== BUSINESS ADVANCED =====
  'business/commands/advanced/presentation.md': `

---

## 📚 Pré-requisitos

Antes de criar apresentação:

1. **Conteúdo estruturado**:
   - Especificação via \`/business/spec\`
   - Ou reuniões consolidadas via \`/business/consolidate-meetings\`

2. **Gamma API Key configurada**:
   Variável \`GAMMA_API_TOKEN\` no .env

⚠️ **Advanced Use Case**: Este comando é para apresentações profissionais externas (stakeholders, clientes, investors).

---

## 🚀 Próximos Passos

Após gerar apresentação:

1. **Refinar manualmente no Gamma**:
   Link gerado permite edição visual e customização.

2. **Criar versão branding-compliant**:
   \`\`\`bash
   /business/branding
   \`\`\`
   Garante alinhamento com identidade da marca.

💡 **Dica**: Gamma gera apresentações profissionais em minutos, mas sempre revise antes de apresentar.
`,

  'business/commands/advanced/transform-consolidated.md': `

---

## 📚 Pré-requisitos

Este comando requer:

1. **Múltiplas reuniões consolidadas**:
   Via \`/business/consolidate-meetings\` (Intermediate).

2. **Framework EXTRACT dominado**:
   Entender todas as 7 dimensões e como consolidar.

⚠️ **Advanced Workflow**: Use quando feature foi discutida em 3+ reuniões e precisa de documento único e formal.

---

## 🚀 Próximos Passos

Após transformar:

1. **Criar tasks a partir do documento**:
   \`\`\`bash
   /business/convert-to-tasks
   \`\`\`
   Converte especificação formal em subtasks.

2. **Ou iniciar desenvolvimento direto**:
   \`\`\`bash
   /technical/start "feature"
   \`\`\`
   Se doc já tem clareza suficiente.

💡 **Documento gerado** serve como PRD (Product Requirements Document) formal.
`,

  'business/commands/advanced/analyze-pain-price.md': `

---

## 📚 Pré-requisitos

Antes de análise Pain vs Price:

1. **Pesquisa de mercado ou feedback de usuários**:
   Dados qualitativos sobre dores dos clientes.

2. **Entendimento de pricing**:
   Estrutura atual de preços ou proposta de monetização.

⚠️ **Metodologia Específica**: Pain-Price Analysis é framework avançado de priorização de features baseado em impacto vs custo.

---

## 🚀 Próximos Passos

Após análise:

1. **Priorizar features no backlog**:
   Resultados da análise guiam priorização de roadmap.

2. **Criar specs para features high-pain/low-price**:
   \`\`\`bash
   /business/spec "high-priority-feature"
   \`\`\`
   Começar pelas features de maior ROI.

💡 **Framework Pain-Price** ajuda a tomar decisões de produto baseadas em dados, não opinião.
`,

  // ===== TECHNICAL INTERMEDIATE =====
  'technical/commands/intermediate/start.md': `

---

## 📚 Pré-requisitos

Antes de iniciar nova feature:

1. **Especificação clara** (recomendado):
   Via \`/business/spec\` para features de produto.

2. **Repositório sincronizado**:
   \`\`\`bash
   /technical/sync
   \`\`\`
   Evita conflitos no início.

3. **Branch limpa**:
   Sem trabalho uncommitted na branch atual.

💡 **\`/start\` cria estrutura completa**: sessão + branch git + plano + arquitetura.

---

## 🚀 Próximos Passos

Após iniciar:

1. **Desenvolver iterativamente**:
   \`\`\`bash
   /technical/work "feature-name"
   \`\`\`
   Continua desenvolvimento seguindo o plano criado.

2. **Consultar agentes durante implementação**:
   - \`@react-developer\` para frontend
   - \`@nodejs-specialist\` para backend
   - \`@postgres-specialist\` para database

3. **Finalizar com PR**:
   \`\`\`bash
   /technical/pr
   \`\`\`
   Cria pull request com contexto da sessão.
`,

  'technical/commands/intermediate/pre-pr.md': `

---

## 📚 Pré-requisitos

Antes de validar para PR:

1. **Feature implementada**:
   Via workflow \`/technical/start\` → \`/technical/work\`.

2. **Testes escritos** (recomendado):
   Via \`/technical/unit\` e/ou \`/technical/integration\`.

3. **Commits realizados**:
   Mudanças commitadas com \`/technical/fast-commit\` ou manualmente.

💡 **Validação automática** executa: linting, testes, build, validação de docs.

---

## 🚀 Próximos Passos

Se validação passou:

1. **Criar Pull Request**:
   \`\`\`bash
   /technical/pr
   \`\`\`
   Gera PR com descrição automática.

2. **Se validação falhou**:
   - Corrigir erros de lint
   - Consertar testes quebrados
   - Atualizar documentação faltando

💡 **Sempre execute \`/pre-pr\` antes de \`/pr\`** - evita PRs rejeitados.
`,

  'technical/commands/intermediate/build-index.md': `

---

## 📚 Pré-requisitos

Antes de construir índice:

1. **Documentação existente**:
   Via \`/technical/docs\` (Starter) ou manualmente.

2. **Estrutura de docs estabelecida**:
   \`docs/\`, \`README.md\`, etc.

💡 **Índice automático** descobre e organiza toda documentação técnica do projeto.

---

## 🚀 Próximos Passos

Após construir índice:

1. **Validar consistência**:
   \`\`\`bash
   /technical/validate-docs
   \`\`\`
   Verifica links quebrados e seções faltando.

2. **Analisar saúde da documentação**:
   \`\`\`bash
   /technical/docs-health
   \`\`\`
   Métricas de cobertura e atualização.

💡 **Índice gerado** facilita navegação e descoberta de docs para novos membros da equipe.
`,

  'technical/commands/intermediate/unit.md': `

---

## 📚 Pré-requisitos

Antes de criar testes unitários:

1. **Feature implementada**:
   Código a ser testado deve existir.

2. **Framework de testes configurado**:
   Jest, Vitest, ou similar no projeto.

💡 **Testes unitários** testam funções isoladas - rápidos e focados.

---

## 🚀 Próximos Passos

Após escrever unit tests:

1. **Testes de integração**:
   \`\`\`bash
   /technical/integration
   \`\`\`
   Testa interação entre componentes.

2. **Validar antes de PR**:
   \`\`\`bash
   /technical/pre-pr
   \`\`\`
   Executa todos os testes automaticamente.

💡 **Pirâmide de testes**: Mais unit tests, menos integration, menos e2e.
`,

  'technical/commands/intermediate/integration.md': `

---

## 📚 Pré-requisitos

Antes de integration tests:

1. **Unit tests escritos**:
   Via \`/technical/unit\` (Intermediate).

2. **Feature funcional**:
   Componentes integrados e funcionando.

3. **Ambiente de teste configurado**:
   Database de teste, mocks de APIs, etc.

💡 **Testes de integração** testam fluxos completos - mais lentos mas mais realistas.

---

## 🚀 Próximos Passos

Se precisar de coverage completa:

1. **E2E tests** (opcional):
   \`\`\`bash
   /technical/e2e
   \`\`\`
   Testes end-to-end para fluxos críticos.

2. **Validar e criar PR**:
   \`\`\`bash
   /technical/pre-pr
   /technical/pr
   \`\`\`

💡 **Balance**: Integration tests cobrem casos importantes sem ser excessivos.
`,

  // ===== TECHNICAL ADVANCED =====
  'technical/commands/advanced/bump.md': `

---

## 📚 Pré-requisitos

Antes de incrementar versão:

1. **Convenção semver entendida**:
   MAJOR.MINOR.PATCH (ex: 2.3.1).

2. **Changelog atualizado**:
   Documentar mudanças da versão atual.

3. **Branch correta**:
   Geralmente \`main\` ou \`develop\`.

⚠️ **Versionamento** afeta deployments e compatibilidade - use com cuidado.

---

## 🚀 Próximos Passos

Após bump:

1. **Criar release**:
   \`\`\`bash
   /technical/release-start
   /technical/release-finish
   \`\`\`
   Workflow gitflow de release.

2. **Deploy**:
   Seguir processo de CI/CD do projeto.

💡 **Semver**: MAJOR (breaking), MINOR (features), PATCH (bugfixes).
`,

  'technical/commands/advanced/e2e.md': `

---

## 📚 Pré-requisitos

Antes de E2E tests:

1. **Unit e Integration tests** existentes:
   Via \`/technical/unit\` e \`/technical/integration\`.

2. **Aplicação deployável**:
   Ambiente completo (frontend + backend + database).

3. **Playwright ou Cypress configurado**:
   Framework E2E no projeto.

⚠️ **E2E são lentos e frágeis** - use apenas para fluxos críticos do usuário.

---

## 🚀 Próximos Passos

Após E2E tests:

1. **Integrar no CI/CD**:
   Executar E2E automaticamente antes de deploy.

2. **Manter atualizados**:
   E2E quebram facilmente com mudanças de UI - manutenção constante.

💡 **Regra 70/20/10**: 70% unit, 20% integration, 10% e2e.
`
};

/**
 * Adiciona descoberta em arquivo
 */
async function addDiscovery(relativePath, content) {
  const filePath = path.join(PROJECT_ROOT, '.onion/contexts', relativePath);
  
  console.log(`  ∟ Atualizando ${relativePath}`);
  
  try {
    let fileContent = await fs.readFile(filePath, 'utf8');
    
    // Verificar se já tem pré-requisitos
    if (fileContent.includes('## 📚 Pré-requisitos')) {
      console.log(`    ⚠️  Já tem descoberta, pulando...`);
      return false;
    }
    
    // Adicionar no final
    fileContent += content;
    
    await fs.writeFile(filePath, fileContent, 'utf8');
    console.log(`    ✅ Descoberta adicionada`);
    return true;
    
  } catch (error) {
    console.error(`    ❌ Erro: ${error.message}`);
    return false;
  }
}

/**
 * Main
 */
async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 DESCOBERTA PROGRESSIVA - INTER/ADV');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  let updated = { 
    business_inter: 0, 
    business_adv: 0,
    technical_inter: 0,
    technical_adv: 0
  };
  
  console.log('📦 BUSINESS INTERMEDIATE:\n');
  for (const [file, content] of Object.entries(DISCOVERY_CONTENT)) {
    if (file.includes('business/commands/intermediate/')) {
      const success = await addDiscovery(file, content);
      if (success) updated.business_inter++;
    }
  }
  
  console.log('\n📦 BUSINESS ADVANCED:\n');
  for (const [file, content] of Object.entries(DISCOVERY_CONTENT)) {
    if (file.includes('business/commands/advanced/')) {
      const success = await addDiscovery(file, content);
      if (success) updated.business_adv++;
    }
  }
  
  console.log('\n📦 TECHNICAL INTERMEDIATE:\n');
  for (const [file, content] of Object.entries(DISCOVERY_CONTENT)) {
    if (file.includes('technical/commands/intermediate/')) {
      const success = await addDiscovery(file, content);
      if (success) updated.technical_inter++;
    }
  }
  
  console.log('\n📦 TECHNICAL ADVANCED:\n');
  for (const [file, content] of Object.entries(DISCOVERY_CONTENT)) {
    if (file.includes('technical/commands/advanced/')) {
      const success = await addDiscovery(file, content);
      if (success) updated.technical_adv++;
    }
  }
  
  const total = Object.values(updated).reduce((a, b) => a + b, 0);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ DESCOBERTA PROGRESSIVA COMPLETA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`📊 ESTATÍSTICAS:`);
  console.log(`  ∟ Business Intermediate: ${updated.business_inter}`);
  console.log(`  ∟ Business Advanced: ${updated.business_adv}`);
  console.log(`  ∟ Technical Intermediate: ${updated.technical_inter}`);
  console.log(`  ∟ Technical Advanced: ${updated.technical_adv}`);
  console.log(`  ∟ Total: ${total} comandos\n`);
}

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

