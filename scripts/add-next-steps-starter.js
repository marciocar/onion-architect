#!/usr/bin/env node

/**
 * Script para adicionar seção "Próximos Passos" em comandos starter
 * 
 * Adiciona descoberta progressiva em:
 * - 5 comandos business starter
 * - 8 comandos technical starter
 */

const fs = require('fs-extra');
const path = require('path');

const PROJECT_ROOT = process.cwd();

// Mapeamento: arquivo → próximos passos
const NEXT_STEPS = {
  // ===== BUSINESS STARTER =====
  'business/commands/starter/spec.md': `

---

## 🚀 Próximos Passos

Agora que você criou uma especificação, considere:

1. **Estimar complexidade da feature**:
   \`\`\`bash
   /business/estimate "sua-feature"
   \`\`\`
   Use o framework de story points para dimensionar o esforço necessário.

2. **Criar task no gerenciador**:
   \`\`\`bash
   /business/task "sua-feature"
   \`\`\`
   Converte a spec em task rastreável com story points e critérios de aceitação.

3. **Iniciar desenvolvimento**:
   \`\`\`bash
   /technical/start "sua-feature"
   \`\`\`
   Cria sessão de desenvolvimento, branch git e plano técnico.

💡 **Dica**: Use \`@story-points-specialist\` para estimativas mais precisas e \`@product-agent\` para validar sua especificação.
`,

  'business/commands/starter/task.md': `

---

## 🚀 Próximos Passos

Agora que você criou uma task, considere:

1. **Validar completude da task**:
   \`\`\`bash
   /business/task-check "task-id"
   \`\`\`
   Verifica se a task tem todos os campos necessários e critérios claros.

2. **Iniciar desenvolvimento**:
   \`\`\`bash
   /technical/start "feature-name"
   \`\`\`
   Começa o trabalho técnico com sessão estruturada.

3. **Acompanhar progresso**:
   \`\`\`bash
   /technical/work "task-id"
   \`\`\`
   Continua desenvolvimento e atualiza task automaticamente.

💡 **Dica**: O Sistema Onion sincroniza automaticamente o progresso com seu task manager (ClickUp, Asana, Linear).
`,

  'business/commands/starter/estimate.md': `

---

## 🚀 Próximos Passos

Agora que você estimou a feature, considere:

1. **Criar task com a estimativa**:
   \`\`\`bash
   /business/task "feature-name"
   \`\`\`
   Inclui automaticamente os story points na task.

2. **Refinar especificação se necessário**:
   \`\`\`bash
   /business/refine "spec.md"
   \`\`\`
   Se a estimativa foi alta, talvez a spec precise de mais detalhes.

3. **Planejar desenvolvimento**:
   \`\`\`bash
   /technical/plan "feature-name"
   \`\`\`
   Quebra a feature em fases de implementação.

💡 **Dica**: Story points altos (8+) indicam que a feature deve ser quebrada em subtasks menores.
`,

  'business/commands/starter/refine.md': `

---

## 🚀 Próximos Passos

Agora que você refinou a especificação, considere:

1. **Re-estimar após refinamento**:
   \`\`\`bash
   /business/estimate "feature-name"
   \`\`\`
   Especificações mais detalhadas geram estimativas mais precisas.

2. **Validar com stakeholders**:
   Use \`@product-agent\` para revisar a spec refinada e identificar possíveis gaps.

3. **Criar task atualizada**:
   \`\`\`bash
   /business/task "feature-name"
   \`\`\`
   Gera task com a especificação refinada e estimativa atualizada.

💡 **Dica**: Refinamento iterativo é normal - specs evoluem conforme aprendemos mais sobre o problema.
`,

  'business/commands/starter/warm-up.md': `

---

## 🚀 Próximos Passos

Agora que você preparou o contexto, comece o trabalho:

1. **Criar nova especificação**:
   \`\`\`bash
   /business/spec "feature-name"
   \`\`\`
   O contexto carregado ajudará a criar specs mais completas.

2. **Extrair informações de reunião**:
   \`\`\`bash
   /business/extract-meeting
   \`\`\`
   Use para documentar decisões e ações de meetings recentes.

3. **Explorar comandos intermediate**:
   \`\`\`bash
   /business/help --level=intermediate
   \`\`\`
   Descubra workflows mais avançados como \`/business/feature\` (spec + tasks em um comando).

💡 **Dica**: Warm-up é especialmente útil ao retomar trabalho após pausas ou ao entrar em novo projeto.
`,

  // ===== TECHNICAL STARTER =====
  'technical/commands/starter/work.md': `

---

## 🚀 Próximos Passos

Durante o desenvolvimento, você pode precisar de:

1. **Validar antes de finalizar**:
   \`\`\`bash
   /technical/pre-pr
   \`\`\`
   Executa linting, testes e validações antes de criar PR.

2. **Criar Pull Request**:
   \`\`\`bash
   /technical/pr
   \`\`\`
   Gera PR com descrição automática baseada na sessão de desenvolvimento.

3. **Consultar agentes especializados**:
   - \`@react-developer\` para dúvidas de frontend
   - \`@nodejs-specialist\` para backend
   - \`@test-engineer\` para testes

💡 **Dica**: O comando \`/work\` rastreia automaticamente seu progresso e atualiza o task manager configurado.
`,

  'technical/commands/starter/plan.md': `

---

## 🚀 Próximos Passos

Agora que você tem um plano, execute:

1. **Iniciar desenvolvimento**:
   \`\`\`bash
   /technical/work "feature-name"
   \`\`\`
   Começa implementação seguindo o plano criado.

2. **Se precisar de estrutura completa**:
   \`\`\`bash
   /technical/start "feature-name"
   \`\`\`
   Cria sessão, branch git e documentação de arquitetura além do plano.

3. **Documentar decisões técnicas**:
   Edite \`.cursor/sessions/[feature]/architecture.md\` conforme implementa para registrar trade-offs.

💡 **Dica**: Planeje antes de implementar! Um bom plano reduz retrabalho e facilita code review.
`,

  'technical/commands/starter/pr.md': `

---

## 🚀 Próximos Passos

Após criar o PR:

1. **Sincronizar após merge**:
   \`\`\`bash
   /technical/sync
   \`\`\`
   Atualiza sua branch local com as mudanças mergeadas.

2. **Iniciar próxima feature**:
   \`\`\`bash
   /technical/start "proxima-feature"
   \`\`\`
   Começa novo ciclo de desenvolvimento.

3. **Documentar em \`/technical/docs\`**:
   Se a feature mudou arquitetura ou adicionou APIs, atualize docs técnicos.

💡 **Dica**: O PR inclui automaticamente informações da sessão (context.md, architecture.md, plan.md) na descrição.
`,

  'technical/commands/starter/warm-up.md': `

---

## 🚀 Próximos Passos

Agora que você preparou o contexto técnico:

1. **Planejar nova feature**:
   \`\`\`bash
   /technical/plan "feature-name"
   \`\`\`
   Cria plano de desenvolvimento estruturado.

2. **Ou retomar trabalho existente**:
   \`\`\`bash
   /technical/work "task-id"
   \`\`\`
   Continua desenvolvimento de feature em progresso.

3. **Resolver conflitos se necessário**:
   \`\`\`bash
   /technical/sync
   \`\`\`
   Sincroniza com remote antes de começar novo trabalho.

💡 **Dica**: Warm-up carrega contexto sobre stack, arquitetura e padrões do projeto - essencial após pausas longas.
`,

  'technical/commands/starter/docs.md': `

---

## 🚀 Próximos Passos

Após gerar/atualizar documentação:

1. **Validar consistência**:
   \`\`\`bash
   /technical/validate-docs
   \`\`\`
   Verifica links quebrados, seções faltando, etc.

2. **Construir índice completo**:
   \`\`\`bash
   /technical/build-index
   \`\`\`
   Gera índice navegável de toda documentação técnica.

3. **Verificar saúde da docs**:
   \`\`\`bash
   /technical/docs-health
   \`\`\`
   Analisa cobertura, atualização e qualidade geral.

💡 **Dica**: Documente enquanto implementa, não depois! Contexto fresco = docs melhores.
`,

  'technical/commands/starter/sync.md': `

---

## 🚀 Próximos Passos

Após sincronizar:

1. **Iniciar novo trabalho**:
   \`\`\`bash
   /technical/start "feature-name"
   \`\`\`
   Começa nova feature com código atualizado.

2. **Ou retomar trabalho pausado**:
   \`\`\`bash
   /technical/work "task-id"
   \`\`\`
   Continua desenvolvimento existente.

3. **Se houve conflitos complexos**:
   \`\`\`bash
   /technical/pre-pr
   \`\`\`
   Valida que tudo ainda funciona após resolução.

💡 **Dica**: Sincronize frequentemente (manhã, antes de PRs) para minimizar conflitos.
`,

  'technical/commands/starter/init.md': `

---

## 🚀 Próximos Passos

Após inicializar o repositório:

1. **Preparar primeiro commit**:
   \`\`\`bash
   /technical/fast-commit
   \`\`\`
   Cria commit inicial seguindo conventional commits.

2. **Configurar documentação**:
   \`\`\`bash
   /technical/docs
   \`\`\`
   Gera README e docs técnicos iniciais.

3. **Começar primeira feature**:
   \`\`\`bash
   /technical/start "setup-inicial"
   \`\`\`
   Inicia desenvolvimento estruturado desde o início.

💡 **Dica**: Gitflow é recomendado para projetos colaborativos. Para solo dev, trunk-based pode ser mais simples.
`,

  'technical/commands/starter/help.md': `

---

## 🚀 Próximos Passos

Após explorar os comandos disponíveis:

1. **Comece com um workflow completo**:
   \`\`\`bash
   /technical/start "test-feature"
   \`\`\`
   Experimenta o ciclo completo: start → work → pr.

2. **Explore agentes especializados**:
   - \`@react-developer\` para desenvolvimento frontend
   - \`@test-engineer\` para estratégia de testes
   - \`@code-reviewer\` para análise de qualidade

3. **Veja comandos intermediate**:
   \`\`\`bash
   /technical/help --level=intermediate
   \`\`\`
   Descubra workflows mais avançados conforme ganha experiência.

💡 **Dica**: Foque nos 8 starter commands primeiro - eles cobrem 80% do desenvolvimento diário.
`
};

/**
 * Adiciona próximos passos em um arquivo
 */
async function addNextSteps(relativePath, nextStepsContent) {
  const filePath = path.join(PROJECT_ROOT, '.onion/contexts', relativePath);
  
  console.log(`  ∟ Atualizando ${relativePath}`);
  
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // Verificar se já tem seção de próximos passos
    if (content.includes('## 🚀 Próximos Passos')) {
      console.log(`    ⚠️  Já tem próximos passos, pulando...`);
      return false;
    }
    
    // Adicionar no final do arquivo
    content += nextStepsContent;
    
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`    ✅ Próximos Passos adicionado`);
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
  console.log('🚀 ADICIONANDO DESCOBERTA PROGRESSIVA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  let updated = { business: 0, technical: 0 };
  
  console.log('📦 BUSINESS STARTER COMMANDS:\n');
  for (const [file, steps] of Object.entries(NEXT_STEPS)) {
    if (file.startsWith('business/')) {
      const success = await addNextSteps(file, steps);
      if (success) updated.business++;
    }
  }
  
  console.log('\n📦 TECHNICAL STARTER COMMANDS:\n');
  for (const [file, steps] of Object.entries(NEXT_STEPS)) {
    if (file.startsWith('technical/')) {
      const success = await addNextSteps(file, steps);
      if (success) updated.technical++;
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ DESCOBERTA PROGRESSIVA ADICIONADA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`📊 ESTATÍSTICAS:`);
  console.log(`  ∟ Business: ${updated.business} comandos atualizados`);
  console.log(`  ∟ Technical: ${updated.technical} comandos atualizados`);
  console.log(`  ∟ Total: ${updated.business + updated.technical} comandos\n`);
}

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

