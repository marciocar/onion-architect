# Windsurf IDE Integration

Este diretório contém o bridge TypeScript que conecta o Sistema Onion ao Windsurf IDE.

## Arquivos

- `onion-bridge.ts` - Bridge TypeScript que descobre recursos Onion
- `windsurf.config.yml` - Configuração gerada automaticamente (na raiz do projeto)

## Como Funciona

1. O bridge descobre todos os recursos Onion (comandos, agentes, contextos)
2. Gera `windsurf.config.yml` na raiz do projeto
3. Windsurf lê o config e disponibiliza comandos/agentes

## Uso

### Gerar Config Manualmente

```bash
# Compilar TypeScript (se necessário)
npx ts-node .onion/ide/windsurf/onion-bridge.ts

# Ou usar via Node.js diretamente
node -r ts-node/register .onion/ide/windsurf/onion-bridge.ts
```

### Auto-geração

O config é gerado automaticamente quando você executa:
- `onion init` - Inicialização do projeto
- `onion add windsurf` - Adicionar suporte Windsurf

## Estrutura do Config

```yaml
onion:
  version: 4.0.0-beta.1
  contexts: [business, technical]
  commands: [...]
  agents: [...]

commands:
  - name: business/spec
    path: .onion/contexts/business/commands/starter/spec.md
    metadata:
      context: business
      level: starter

agents:
  - name: business/product-agent
    path: .onion/contexts/business/agents/product-agent.md
    metadata:
      context: business
```

## Troubleshooting

### Config não é gerado

Verifique se `.onion-config.yml` existe na raiz do projeto.

### Comandos não aparecem no Windsurf

1. Verifique se `windsurf.config.yml` existe na raiz
2. Reinicie o Windsurf IDE
3. Verifique logs do Windsurf para erros

## Documentação

Para mais informações, consulte:
- [Arquitetura IDE Loaders](../../../docs/onion/ide-loaders-architecture.md)
- [Sistema Onion v4](../../../docs/onion/README.md)
