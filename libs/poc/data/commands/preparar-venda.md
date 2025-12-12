---
name: preparar-venda
description: Prepara apresentação de vendas para um cliente
category: vendas
steps:
  - type: query
    query: "Buscar informações sobre {empresa} na knowbase de vendas"
  
  - type: agent
    agentId: agent-vendas-id
    prompt: |
      Prepare uma apresentação de vendas para {empresa}.
      Inclua:
      - Qualificação BANT
      - Proposta customizada
      - Resposta a objeções comuns
      - Próximos passos
  
  - type: output
    format: markdown
variables:
  - name: empresa
    type: string
    prompt: "Nome da empresa?"
version: "1.0.0"
updated: "2025-12-12"
---

# Comando /preparar-venda

Prepara uma apresentação completa de vendas para um cliente específico, incluindo 
qualificação BANT, proposta customizada, tratamento de objeções e próximos passos.

## Exemplo de uso

```
/preparar-venda empresa="Acme Corp"
```
