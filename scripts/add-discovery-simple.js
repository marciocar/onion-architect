#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');

const ROOT = process.cwd();

const files = [
  'business/commands/intermediate/feature.md',
  'business/commands/intermediate/extract-meeting.md',
  'business/commands/advanced/presentation.md',
  'technical/commands/intermediate/start.md',
  'technical/commands/intermediate/pre-pr.md'
];

const prereqs = `

---

## 📚 Pré-requisitos

Domine comandos starter antes de usar este comando intermediate/advanced.

Consulte os comandos help para ver hierarquia completa:
- /business/help --level=starter
- /technical/help --level=starter

💡 Comandos intermediate/advanced assumem familiaridade com workflows básicos.
`;

async function main() {
  console.log('Adicionando pré-requisitos...\n');
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
      }
    } catch (e) {
      console.log('⚠️ ', file, e.message);
    }
  }
  
  console.log(`\nTotal: ${count} arquivos atualizados`);
}

main();
