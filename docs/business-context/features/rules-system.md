# 📋 Rules System - Feature Catalog

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0 | **Status**: V1 Core

---

## 🎯 Purpose

Permitir que usuários definam regras que garantem consistência, padrões e comportamentos específicos em toda a plataforma, usando a metodologia Onion.

---

## 👤 User Benefit

| Benefício | Descrição |
|-----------|-----------|
| **Consistência** | Mesmos padrões sempre |
| **Governança** | Regras que não podem ser ignoradas |
| **Automação** | Aplicação automática de padrões |
| **Qualidade** | Menos erros, mais previsibilidade |

---

## 🔧 Core Features

### 1. Rule Creation

**Descrição:** Criar regras personalizadas

**Funcionalidades:**
- Criar regra via interface
- Criar via `/meta/create-rule`
- Templates de regras
- Ativar/desativar regras

**UX Flow:**
```
[+ Nova Regra] → Nome
              → Quando aplicar (escopo)
              → O que fazer (ação)
              → [Criar]
```

**Estrutura de Regra (.md):**
```markdown
---
name: resposta-formal
description: Garante tom formal em comunicações externas
scope:
  - agents: [customer-support, sales]
  - commands: [generate-email, create-proposal]
active: true
priority: high
---

# Regra: Tom Formal

## Quando Aplicar
- Em qualquer comunicação com clientes externos
- Quando gerando emails ou propostas
- Nos agentes de suporte e vendas

## Comportamento Esperado
- Usar linguagem formal (você, não tu)
- Evitar gírias e coloquialismos
- Incluir saudação e despedida
- Revisar gramática antes de enviar

## Exemplos

### ✅ Correto
"Prezado(a) [Nome], esperamos que esteja bem..."

### ❌ Incorreto
"E aí, tudo certo?"

## Exceções
- Comunicação interna (use regra casual-interno)
- Chats informais com clientes conhecidos
```

**Limitações por Plano:**
| Plano | Limite |
|-------|--------|
| Free | 3 regras |
| Pro | Ilimitado |
| Enterprise | Ilimitado + org-wide |

---

### 2. Rule Scopes

**Descrição:** Definir onde as regras se aplicam

**Escopos Disponíveis:**

| Escopo | Descrição | Exemplo |
|--------|-----------|---------|
| **Global** | Toda a plataforma | Idioma padrão |
| **Agentes** | Agentes específicos | Tom do @support |
| **Comandos** | Comandos específicos | Formato do /report |
| **Knowbases** | Knowbases específicas | Estrutura de docs |
| **Contexto** | Situações específicas | Quando falar de preço |

**Exemplo de Escopo:**
```yaml
scope:
  global: false
  agents:
    - customer-support
    - sales
  commands:
    - generate-proposal
    - send-email
  contexts:
    - external-communication
    - pricing-discussion
```

---

### 3. Regras do Sistema (System Rules)

**Descrição:** Regras que vêm com o Onion App

| Regra | Escopo | Comportamento |
|-------|--------|---------------|
| **language-ptbr** | Global | Responder em português |
| **safety-first** | Global | Não gerar conteúdo prejudicial |
| **source-citation** | Knowbases | Citar fontes nas respostas |
| **concise-responses** | Default | Respostas objetivas |
| **proactive-suggestions** | Default | Sugerir próximos passos |

**Regras Obrigatórias (não desativáveis):**
- Safety guidelines
- Privacy protection
- Terms compliance

---

### 4. Rule Priority & Conflicts

**Descrição:** Gerenciar conflitos entre regras

**Níveis de Prioridade:**
| Nível | Peso | Uso |
|-------|------|-----|
| **Critical** | 100 | Segurança, compliance |
| **High** | 75 | Padrões importantes |
| **Medium** | 50 | Preferências |
| **Low** | 25 | Nice-to-have |

**Resolução de Conflitos:**
1. Regra de maior prioridade vence
2. Se empate, regra mais específica vence
3. Se ainda empate, regra mais recente vence

**Exemplo:**
```
Regra A: "Seja conciso" (priority: medium, scope: global)
Regra B: "Seja detalhado" (priority: high, scope: agent:analyst)

→ No @analyst, Regra B vence (maior prioridade + mais específica)
→ Em outros agentes, Regra A aplica
```

---

### 5. Rule Testing & Preview

**Descrição:** Testar regras antes de ativar

**Funcionalidades:**
- Modo preview (simular sem aplicar)
- Test cases
- Dry-run em comandos
- Log de aplicação de regras

**UX de Teste:**
```
/test-rule resposta-formal

🧪 Testando regra: resposta-formal

📝 Input de teste:
"Gere um email para cliente sobre atraso"

📤 Output sem regra:
"Oi, vai atrasar, falou!"

📤 Output com regra:
"Prezado(a) Cliente, informamos que houve um 
atraso no prazo previsto. Pedimos desculpas 
pelo inconveniente..."

[✅ Ativar regra] [🔄 Ajustar] [❌ Descartar]
```

---

## 📊 Usage Patterns

### Casos de Uso Comuns

| Caso | Frequência | Regra Típica |
|------|------------|--------------|
| Tom de comunicação | 🔴 Alta | formal, casual, técnico |
| Formato de output | 🔴 Alta | bullet-points, markdown |
| Idioma | 🟡 Média | ptbr, english |
| Segurança | 🟡 Média | no-sensitive-data |
| Branding | 🟢 Baixa | voice-guidelines |

### Padrões de Adoção

| Métrica | Meta |
|---------|------|
| Regras ativas/usuário | 3+ |
| % usuários com custom rules | 35% |
| Conflitos resolvidos/semana | < 5 |

---

## ⚠️ Common Issues

| Issue | Causa | Solução |
|-------|-------|---------|
| "Regra não aplicou" | Escopo incorreto | Verificar escopo |
| "Conflito de regras" | Prioridades iguais | Ajustar prioridade |
| "Comportamento inesperado" | Regra muito ampla | Especificar escopo |
| "Limite atingido" | Free tier | Upsell |

---

## 🤖 AI Interaction Guidelines

### Como @onion deve falar sobre Regras

**Linguagem:**
- "Sua regra de [descrição]"
- "O padrão de [comportamento]"
- Nunca: "policy engine", "governance framework"

**Sugestões proativas:**
- "Notei que você sempre pede formato X. Quer criar uma regra para isso?"
- "Essa resposta seguiu a regra 'tom-formal' que você definiu."

**Transparência:**
- Indicar quando regra foi aplicada
- Explicar por que certa regra se aplica
- Permitir override temporário

---

## 📈 Success Metrics

| Métrica | Descrição | Meta |
|---------|-----------|------|
| Activation | % usuários com 1+ regra custom | 35% |
| Consistency | % outputs alinhados com regras | 95%+ |
| Conflicts | Conflitos/semana | < 5 |
| Satisfaction | Regras percebidas como úteis | 80%+ |

---

## 🔮 Roadmap

| Feature | Versão | Descrição |
|---------|--------|-----------|
| Rule templates | V1.5 | Templates prontos |
| Org-wide rules | V2 | Regras de organização |
| Rule inheritance | V2 | Herança de regras |
| Conditional rules | V2 | Se X então Y |
| Rule analytics | V3 | Métricas de aplicação |
| Rule marketplace | V3 | Compartilhar regras |

---

**Documentação relacionada:**
- [Agent Management](agent-management.md)
- [Command Workflows](command-workflows.md)

