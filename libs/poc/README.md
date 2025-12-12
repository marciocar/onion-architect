# POC (Proof of Concept) - Onion App

Estrutura de dados fixos para validação da arquitetura do Onion App antes da implementação completa.

## 📁 Estrutura

```
libs/poc/
├── data/
│   ├── knowbases/          # 2 knowbases fixas
│   ├── agents/             # 3 agentes fixos
│   ├── commands/            # 2 comandos fixos
│   └── rules/               # 1 arquivo de regras
└── src/
    ├── loader.ts           # Carrega arquivos .md
    ├── seed.ts             # Popula banco de dados
    └── fixtures.ts         # Fixtures para testes
```

## 📋 Elementos da POC

### Knowbases (2)
- `marketing-digital.md` - Estratégias de marketing digital 2025
- `vendas-negociacao.md` - Processo de vendas e negociação

### Agentes (3)
- `marketing.md` - Especialista em Marketing Digital
- `vendas.md` - Especialista em Vendas e Negociação
- `onion.md` - Orquestrador master (conhece os outros dois)

### Comandos (2)
- `estrategia-marketing.md` - Gera estratégia de marketing
- `preparar-venda.md` - Prepara apresentação de vendas

### Regras (1)
- `poc-rules.md` - Regras padrão de comportamento

## 🚀 Uso

### Carregar dados

```typescript
import { loadAllPocData } from '@onion/poc/src/loader';

const data = loadAllPocData('tenant-id');
console.log(data.knowbases);
console.log(data.agents);
console.log(data.commands);
console.log(data.rules);
```

### Seed no banco

```typescript
import { seedPocData } from '@onion/poc/src/seed';

await seedPocData('tenant-id');
```

### Usar em testes

```typescript
import { getPocFixtures } from '@onion/poc/src/fixtures';

const fixtures = getPocFixtures('test-tenant-id');
```

## 📚 Referências

- [POC Plan](../../docs/technical-context/POC_PLAN.md) - Plano completo da POC

