---
name: docs
description: Invocar agente de documentação para branch atual.
model: sonnet
category: engineer
tags: [documentation, branch]
version: "4.0.0"
updated: "2025-12-20"
level: starter
context: technical
---

Por favor, invoque o agente branch-documentation-writer

---

## 🚀 Próximos Passos

Após gerar/atualizar documentação:

1. **Validar consistência**:
   ```bash
   /technical/validate-docs
   ```
   Verifica links quebrados, seções faltando, etc.

2. **Construir índice completo**:
   ```bash
   /technical/build-index
   ```
   Gera índice navegável de toda documentação técnica.

3. **Verificar saúde da docs**:
   ```bash
   /technical/docs-health
   ```
   Analisa cobertura, atualização e qualidade geral.

💡 **Dica**: Documente enquanto implementa, não depois! Contexto fresco = docs melhores.
