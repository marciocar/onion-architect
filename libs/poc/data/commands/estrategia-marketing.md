---
name: estrategia-marketing
description: Gera estratégia completa de marketing para um período
category: marketing
steps:
  - type: agent
    agentId: agent-marketing-id
    prompt: "Crie uma estratégia de marketing para {periodo} incluindo SEO, Google Ads e conteúdo"
  
  - type: transform
    action: format
    format: markdown
    sections:
      - Resumo Executivo
      - Estratégias por Canal
      - Métricas Esperadas
  
  - type: output
    format: markdown
variables:
  - name: periodo
    type: string
    default: "Q1 2025"
    prompt: "Para qual período? (ex: Q1 2025)"
version: "1.0.0"
updated: "2025-12-12"
---

# Comando /estrategia-marketing

Gera uma estratégia completa de marketing digital para um período específico, 
incluindo SEO, Google Ads, conteúdo e métricas esperadas.

## Exemplo de uso

```
/estrategia-marketing periodo="Q1 2025"
```

## Fluxo de execução

1. Chama @marketing com prompt sobre o período especificado
2. Formata resposta em markdown estruturado
3. Retorna estratégia completa com resumo executivo, estratégias por canal e métricas
