# 🤖 Agent Management - Feature Catalog

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0 | **Status**: V1 Core

---

## 🎯 Purpose

Permitir que usuários criem assistentes de IA personalizados (agentes) que conhecem suas knowbases e seguem instruções específicas, usando a metodologia Onion.

---

## 👤 User Benefit

| Benefício | Descrição |
|-----------|-----------|
| **Especialização** | Agentes focados em áreas específicas |
| **Contexto persistente** | Agentes lembram seu conhecimento |
| **Personalização** | Comportamento customizado |
| **Escalabilidade** | Múltiplos assistentes para diferentes tarefas |

---

## 🔧 Core Features

### 1. Agent Creation

**Descrição:** Criar agentes personalizados

**Funcionalidades:**
- Criar agente via interface
- Criar via comando `/meta/create-agent`
- Templates de agentes pré-configurados
- Clonagem de agentes existentes

**UX Flow:**
```
[+ Novo Agente] → Nome + Descrição
                → Selecionar Knowbases
                → Definir personalidade/instruções
                → [Criar]
```

**Campos de Configuração:**
| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| Nome | ✅ | Identificador do agente |
| Descrição | ✅ | O que o agente faz |
| Knowbases | ⚠️ Recomendado | Fontes de conhecimento |
| Instruções | ⚠️ Recomendado | Como o agente deve se comportar |
| Modelo IA | ❌ Opcional | GPT-4, Claude, etc. (BYOL) |

**Limitações por Plano:**
| Plano | Limite |
|-------|--------|
| Free | 1 agente |
| Pro | 10 agentes |
| Enterprise | Ilimitado |

---

### 2. Agentes Pré-configurados (System Agents)

**Descrição:** Agentes que vêm com o Onion App

**Agentes Inclusos:**

| Agente | Função | Knowbases |
|--------|--------|-----------|
| **@onion** | Orquestrador master | Todas |
| **@helper** | Ajuda geral e onboarding | Docs do sistema |
| **@writer** | Assistente de escrita | Nenhuma específica |
| **@researcher** | Pesquisa na web | Web search |

**@onion - Agente Principal:**
- Conhece todos os outros agentes
- Orquestra tarefas complexas
- Sugere quando usar qual agente
- Sempre disponível

---

### 3. Agent Customization

**Descrição:** Personalizar comportamento do agente

**Opções de Personalização:**

| Aspecto | Opções |
|---------|--------|
| **Tom** | Formal, Casual, Técnico, Amigável |
| **Verbosidade** | Conciso, Detalhado, Adaptativo |
| **Proatividade** | Alta (sugere), Média, Baixa (só responde) |
| **Idioma** | PT-BR, EN, ES |
| **Formato** | Markdown, Plain text, Bullet points |

**Exemplo de Instruções:**
```markdown
Você é um assistente de marketing digital.

COMPORTAMENTO:
- Responda sempre com exemplos práticos
- Use métricas quando disponível
- Sugira A/B tests quando relevante
- Tom: profissional mas acessível

CONHECIMENTO:
- Use a knowbase "Marketing 2025" como principal
- Combine com "Cases de Sucesso" para exemplos

LIMITAÇÕES:
- Não recomende orçamentos específicos
- Encaminhe questões jurídicas para @legal
```

---

### 4. Agent Interaction

**Descrição:** Conversar com agentes

**Funcionalidades:**
- Chat em linguagem natural
- Histórico de conversa por sessão
- Menção a outros agentes
- Upload de arquivos na conversa
- Ações sugeridas

**Exemplo de Interação:**
```
Usuário: @marketing, me ajude a criar uma campanha de lançamento

@marketing: Claro! Baseado na sua knowbase de Marketing, vou sugerir:

📋 **Estrutura da Campanha:**

1. **Pré-lançamento (2 semanas antes)**
   - Teaser nas redes sociais
   - Lista de early-access

2. **Lançamento (D-Day)**
   - Email para base
   - Post completo nas redes
   - Webinar de demonstração

3. **Pós-lançamento (1 semana depois)**
   - Cases de primeiros usuários
   - FAQ baseado em dúvidas

Quer que eu detalhe alguma fase? Ou prefere que eu crie 
um comando para automatizar parte disso?
```

---

### 5. Agent Collaboration

**Descrição:** Agentes trabalhando juntos

**Funcionalidades V1:**
- Mencionar outro agente na conversa
- @onion encaminha para agente especializado

**Funcionalidades V2+:**
- Agentes se comunicam entre si
- Pipelines de agentes
- Delegation automática

**Exemplo:**
```
Usuário: Preciso de um relatório de marketing com análise financeira

@onion: Ótimo! Vou coordenar isso:
1. @marketing vai gerar o relatório de campanha
2. @finance vai adicionar a análise de ROI
3. Vou consolidar e entregar para você

[Processando...]

📊 Relatório consolidado pronto! [Ver relatório]
```

---

## 📊 Usage Patterns

### Casos de Uso Comuns

| Caso | Frequência | Agente Típico |
|------|------------|---------------|
| Assistente de área | 🔴 Alta | @marketing, @vendas |
| Especialista em projeto | 🔴 Alta | @projeto-x |
| Assistente de pesquisa | 🟡 Média | @researcher |
| Coach/mentor | 🟡 Média | @mentor |
| Assistente pessoal | 🟢 Baixa | @personal |

### Padrões de Adoção

| Métrica | Meta |
|---------|------|
| Agentes criados/usuário (30d) | 2+ |
| Interações/agente/semana | 10+ |
| % usuários com agente custom | 40% |

---

## ⚠️ Common Issues

| Issue | Causa | Solução |
|-------|-------|---------|
| "Agente não sabe X" | Knowbase não vinculada | Sugerir vincular |
| "Resposta genérica" | Instruções vagas | Dicas de instruções |
| "Agente confuso" | Muitas knowbases | Focar knowbases |
| "Limite atingido" | Free tier | Upsell |

---

## 🤖 AI Interaction Guidelines

### Como @onion deve falar sobre Agentes

**Linguagem:**
- "Seu assistente de [área]"
- "O agente @nome"
- Nunca: "AI agent", "LLM wrapper"

**Sugestões proativas:**
- "Você faz muitas perguntas sobre marketing. Que tal criar um @marketing dedicado?"
- "O @finance poderia ajudar com essa análise de ROI."

---

## 📈 Success Metrics

| Métrica | Descrição | Meta |
|---------|-----------|------|
| Activation | % usuários com 1+ agente custom | 40% |
| Engagement | Interações/agente/semana | 10+ |
| Quality | % respostas úteis | 85%+ |
| Delegation | % queries via agente (não @onion) | 50%+ |

---

## 🔮 Roadmap

| Feature | Versão | Descrição |
|---------|--------|-----------|
| Agent templates gallery | V1.5 | Templates prontos |
| Agent sharing | V2 | Compartilhar com time |
| Multi-agent pipelines | V2 | Agentes em sequência |
| Agent marketplace | V2 | Vender/comprar agentes |
| Voice agents | V3 | Interação por voz |

---

**Documentação relacionada:**
- [Knowledge Management](knowledge-management.md)
- [Command Workflows](command-workflows.md)

