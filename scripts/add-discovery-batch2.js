#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');

const ROOT = process.cwd();

const files = [
  'business/commands/intermediate/consolidate-meetings.md',
  'business/commands/intermediate/convert-to-tasks.md',
  'business/commands/intermediate/light-arch.md',
  'business/commands/advanced/transform-consolidated.md',
  'business/commands/advanced/analyze-pain-price.md',
  'technical/commands/intermediate/build-index.md',
  'technical/commands/intermediate/unit.md',
  'technical/commands/intermediate/integration.md',
  'technical/commands/advanced/bump.md',
  'technical/commands/advanced/e2e.md'
];

const prereqs = `

---

## 📚 Pré-requisitos

Domine comandos starter antes de usar este comando intermediate/advanced.

Consulte os comandos help para ver hierarquia completa e comandos relacionados:
- /business/help --level=starter
- /technical/help --level=starter

💡 Comandos intermediate/advanced assumem familiaridade com workflows básicos do contexto.
`;

async function main() {
  console.log('Adicionando pré-requisitos (batch 2)...\n');
  let count = 0;
  
  for (const file of files) {
    const filePath = path.join(ROOT, '.onion/contexts', file);
    try {
      let content = await fs.readFile(filePath, 'utf8');
      if (!content.includes('Pré-requisitos')) {
        content += prereqs;
        await fs.writeFile(filePath, content, 'utf8');
        console.log('✅', file);
        count++;
      } else {
        console.log('⏭️ ', file, '(já tem)');
      }
    } catch (e) {
      console.log('⚠️ ', file, e.message);
    }
  }
  
  console.log(`\nTotal: ${count} novos arquivos atualizados`);
}

main();
