# 🔌 Integrations - Feature Catalog

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0 | **Status**: V1 Core + V2 Expansion

---

## 🎯 Purpose

Permitir que o Onion App se conecte com outras ferramentas e serviços, expandindo suas capacidades e integrando-se ao workflow existente do usuário.

---

## 👤 User Benefit

| Benefício | Descrição |
|-----------|-----------|
| **Centralização** | Um lugar para tudo |
| **Automação** | Conectar ferramentas automaticamente |
| **Flexibilidade** | Usar ferramentas preferidas |
| **Produtividade** | Menos alt-tab, mais foco |

---

## 🔧 Core Integrations (V1)

### 1. Web Search

**Descrição:** Buscar informações na internet

**Funcionalidades:**
- Busca em tempo real
- Citação de fontes
- Filtros por tipo (notícias, artigos, etc.)
- Integração com agentes

**Uso:**
```
Usuário: @onion, qual a cotação do dólar hoje?

@onion: 🔍 Buscando informação atualizada...

💵 Cotação do Dólar (hoje, 12/12/2025):
- Comercial: R$ 5,42
- Turismo: R$ 5,65

📌 Fonte: Banco Central (atualizado há 5 min)

Quer que eu salve isso na sua knowbase de Finanças?
```

**Limitações por Plano:**
| Plano | Limite |
|-------|--------|
| Free | 10 buscas/dia |
| Pro | 100 buscas/dia |
| Enterprise | Ilimitado |

---

### 2. File Storage (MinIO)

**Descrição:** Upload e gerenciamento de arquivos

**Funcionalidades:**
- Upload de arquivos
- Processamento automático (PDF → texto)
- Versionamento
- Compartilhamento (V2)

**Formatos Suportados:**
| Formato | Processamento | Status |
|---------|---------------|--------|
| PDF | Extração de texto | ✅ V1 |
| Markdown | Nativo | ✅ V1 |
| TXT | Nativo | ✅ V1 |
| DOCX | Conversão | 📋 V2 |
| Imagens | OCR | 📋 V2 |
| Audio | Transcrição | 📋 V3 |

**Limitações por Plano:**
| Plano | Storage |
|-------|---------|
| Free | 100 MB |
| Pro | 5 GB |
| Enterprise | Ilimitado |

---

### 3. Authentication (Logto)

**Descrição:** Sistema de autenticação

**Funcionalidades:**
- Email/senha
- Social login (Google, GitHub)
- SSO/SAML (Enterprise)
- MFA (V2)

**Providers Suportados:**
| Provider | Status | Plano |
|----------|--------|-------|
| Email/Senha | ✅ V1 | Todos |
| Google | ✅ V1 | Todos |
| GitHub | ✅ V1 | Todos |
| Microsoft | 📋 V2 | Enterprise |
| SAML | 📋 V2 | Enterprise |

---

### 4. BYOL (Bring Your Own License)

**Descrição:** Usar sua própria chave de API de IA

**Funcionalidades:**
- Configurar chave própria
- Escolher provider
- Controlar custos
- Usar modelos custom

**Providers Suportados:**
| Provider | Modelos | Status |
|----------|---------|--------|
| OpenAI | GPT-4, GPT-3.5 | ✅ V1 |
| Anthropic | Claude 3 | ✅ V1 |
| Google | Gemini | 📋 V2 |
| Local | Ollama, LMStudio | 📋 V2 |

**UX de Configuração:**
```
⚙️ Configurações → Integrações → BYOL

┌─────────────────────────────────┐
│ Bring Your Own License          │
├─────────────────────────────────┤
│                                 │
│ Provider: [OpenAI ▼]            │
│                                 │
│ API Key: [sk-...••••••••••••]  │
│                                 │
│ Modelo padrão: [GPT-4 ▼]        │
│                                 │
│ [Testar conexão] [Salvar]       │
│                                 │
└─────────────────────────────────┘
```

---

## 📅 Planned Integrations (V2)

### Task Managers

| Integração | Descrição | Status |
|------------|-----------|--------|
| **Linear** | Sync de tasks | 📋 V2 |
| **ClickUp** | Gestão de projetos | 📋 V2 |
| **Asana** | Tasks e projetos | 📋 V2 |
| **Todoist** | Tasks pessoais | 📋 V2 |

**Funcionalidades Planejadas:**
- Criar tasks de comandos
- Sincronizar knowbases
- Atualizar status automaticamente
- Bidirecional sync

---

### Calendars

| Integração | Descrição | Status |
|------------|-----------|--------|
| **Google Calendar** | Eventos e agenda | 📋 V2 |
| **Outlook** | Calendário Microsoft | 📋 V2 |

**Funcionalidades Planejadas:**
- Ver agenda no @onion
- Criar eventos de comandos
- Preparação automática para reuniões
- Resumo de dia

---

### Communication

| Integração | Descrição | Status |
|------------|-----------|--------|
| **Slack** | Mensagens e notificações | 📋 V2 |
| **Discord** | Comunidade | 📋 V2 |
| **Email** | Envio de emails | 📋 V2 |

**Funcionalidades Planejadas:**
- Notificações de scheduler
- Comandos via Slack
- Resumos por email

---

### Knowledge Sources

| Integração | Descrição | Status |
|------------|-----------|--------|
| **Notion** | Import de pages | 📋 V2 |
| **Google Drive** | Arquivos | 📋 V2 |
| **Confluence** | Wiki corporativo | 📋 V3 |
| **GitHub** | Repos e docs | 📋 V2 |

**Funcionalidades Planejadas:**
- Import automático
- Sync bidirecional
- Versionamento

---

## 🏗️ Integration Architecture

### Adapter Pattern

Todas as integrações seguem o padrão Adapter:

```
┌─────────────────────────────────────────────────────────┐
│                    ONION APP                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │           Integration Abstraction Layer          │   │
│  │                                                  │   │
│  │   interface TaskManager {                        │   │
│  │     createTask(data)                             │   │
│  │     updateTask(id, data)                         │   │
│  │     getTask(id)                                  │   │
│  │   }                                              │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                               │
│          ┌───────────────┼───────────────┐              │
│          ▼               ▼               ▼              │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│    │  Linear  │    │ ClickUp  │    │  Asana   │        │
│    │ Adapter  │    │ Adapter  │    │ Adapter  │        │
│    └──────────┘    └──────────┘    └──────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Benefícios:**
- Trocar provider sem mudar código
- Adicionar novos providers facilmente
- Fallback quando offline
- Consistência de interface

---

## ⚙️ Configuration

### Gerenciamento de Integrações

**UX:**
```
⚙️ Configurações → Integrações

┌─────────────────────────────────────────────┐
│ Integrações Ativas                          │
├─────────────────────────────────────────────┤
│                                             │
│ 🔍 Web Search         [✓] Ativo    [Config] │
│ 🤖 OpenAI (BYOL)      [✓] Ativo    [Config] │
│ 📁 Storage            [✓] Ativo    [Config] │
│                                             │
│ ─────────────────────────────────────────── │
│                                             │
│ Disponíveis (upgrade para Pro)              │
│                                             │
│ 📋 Linear             [🔒]          [Ver]   │
│ 📅 Google Calendar    [🔒]          [Ver]   │
│ 💬 Slack              [🔒]          [Ver]   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📊 Usage Patterns

### Integrações Mais Usadas (Projeção)

| Integração | Prioridade | Razão |
|------------|------------|-------|
| Web Search | 🔴 Alta | Core feature |
| BYOL | 🔴 Alta | Controle de custos |
| Task Managers | 🟡 Média | Produtividade |
| Calendar | 🟡 Média | Organização |
| Notion | 🟡 Média | Import de dados |

---

## ⚠️ Common Issues

| Issue | Causa | Solução |
|-------|-------|---------|
| "Conexão falhou" | Token expirado | Reconectar |
| "Limite de API" | Rate limit | Caching + retry |
| "Dados não sincronizam" | Conflito | Resolução manual |
| "Integração lenta" | Latência | Background sync |

---

## 📈 Success Metrics

| Métrica | Descrição | Meta |
|---------|-----------|------|
| Adoption | % usuários com 1+ integração | 60% |
| Usage | Chamadas de integração/dia | 100+ |
| BYOL adoption | % Pro com BYOL | 30% |
| Satisfaction | Integração funciona bem | 90%+ |

---

## 🔮 Roadmap

| Feature | Versão | Descrição |
|---------|--------|-----------|
| Webhooks | V2 | Receber eventos externos |
| Custom integrations | V2 | Criar integrações próprias |
| Integration marketplace | V3 | Comunidade de integrações |
| Zapier/n8n connector | V2 | Conectar com automações |
| Enterprise integrations | V3 | SAP, Salesforce, etc. |

---

**Documentação relacionada:**
- [Command Workflows](command-workflows.md)
- [Product Strategy](../PRODUCT_STRATEGY.md)

