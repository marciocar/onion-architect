# 🧅 Onion App - Business Context

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 📋 Business Context Profile

### Fundação da Empresa e Produto

**Visão Geral da Empresa:**
- **Company Name:** Onion App
- **Industry:** SaaS / AI-powered Knowledge Management
- **Company Stage:** 
  - [x] Startup (Pre-Product Market Fit)
  - [ ] Growth (Post-PMF, Scaling)
  - [ ] Enterprise (Mature, Multiple Products)
  - [ ] Legacy (Established, Optimizing)

**Product Information:**
- **Primary Product:** Onion App - Plataforma de Gestão de Conhecimento com IA
- **Product Category:** Personal Knowledge Management (PKM) + AI Automation
- **Target Market Size:** Mercado global de PKM + AI Assistants (~$50B até 2028)
- **Business Model:** 
  - [x] SaaS Subscription
  - [ ] Marketplace
  - [ ] E-commerce
  - [x] Freemium
  - [x] Enterprise Licensing
  - [x] Other: Usage-based + BYOL (Bring Your Own License)

**Revenue and Scale (Projeção Ano 1):**
- **Annual Revenue Range:** `$0 - $500K` (MVP phase)
- **Customer Count:** `1,000 - 10,000` (target)
- **Team Size:** `3-5` people (initial)
- **Primary Growth Metrics:** MAU, NPS, Conversão Free→Paid

---

## 🎯 Visão do Produto

**Tagline:** *"A Alexa da Gestão de Conhecimento"*

**Visão de Longo Prazo (2-3 anos):**
Ser o assistente pessoal definitivo para gestão de conhecimento e automação de tarefas, permitindo que qualquer pessoa (não apenas desenvolvedores) expanda suas habilidades e produtividade usando IA estruturada.

**Exit Strategy:** 3 anos

**Proposta de Valor Única:**
A única plataforma que transforma a metodologia Onion (knowbase → agentes → comandos → regras) em um SaaS acessível para leigos, sem necessidade de conhecimento técnico.

---

## 🏗️ Business Context Architecture

### Layer 1: Customer Context Architecture

- [Customer Personas](CUSTOMER_PERSONAS.md) - 3 personas principais
- [Customer Journey](CUSTOMER_JOURNEY.md) - Jornada completa do cliente
- [Voice of Customer](VOICE_OF_CUSTOMER.md) - Feedback e linguagem do cliente

### Layer 2: Product Context Architecture

- [Product Strategy](PRODUCT_STRATEGY.md) - Estratégia de produto e roadmap
- [Product Metrics](PRODUCT_METRICS.md) - KPIs e métricas de sucesso
- [Features Catalog](features/) - Catálogo detalhado de funcionalidades
  - [Knowledge Management](features/knowledge-management.md)
  - [Agent Management](features/agent-management.md)
  - [Command Workflows](features/command-workflows.md)
  - [Rules System](features/rules-system.md)
  - [Integrations](features/integrations.md)

### Layer 3: Market and Competitive Context

- [Competitive Landscape](COMPETITIVE_LANDSCAPE.md) - Análise competitiva detalhada
- [Industry Trends](INDUSTRY_TRENDS.md) - Tendências de mercado e tecnologia

### Layer 4: Operational Business Context

- [Sales Process](SALES_PROCESS.md) - Processo de vendas e conversão
- [Messaging Framework](MESSAGING_FRAMEWORK.md) - Framework de mensagens e branding
- [Customer Communication](CUSTOMER_COMMUNICATION.md) - Diretrizes de comunicação com IA

---

## 🛠️ Stack Técnica

| Componente | Tecnologia | Propósito |
|------------|------------|-----------|
| **Autenticação** | Logto | Multi-tenant auth, SSO, social login |
| **Containers** | Docker | Deployment e isolamento de serviços |
| **Filas/Eventos** | BullMQ + Redis | Job scheduling, eventos assíncronos |
| **Armazenamento** | MinIO | Storage S3-compatible para arquivos |
| **Vetores** | Qdrant | Embeddings e busca semântica |
| **IDs** | UUID v7 | Chaves primárias ordenáveis por tempo |
| **Arquitetura** | AI-first, Multi-tenancy | Desde o início |

---

## 📊 Roadmap de Versões

### V1 (MVP) - Foco Individual
- ✅ Gestão de conhecimento (knowbases, agentes, comandos, regras)
- ✅ Editor textual de markdown colaborativo
- ✅ Agentes do Onion pré-configurados
- ✅ Scheduler de ações (cron jobs)
- ✅ Pesquisa na internet integrada
- ✅ Onboarding interativo via @onion
- ✅ Sessions para janelas de contexto

### V2 - Colaboração e Marketplace
- 📋 Auto-complete no editor
- 📋 Marketplace de comandos/agentes
- 📋 Task Manager integrations
- 📋 White-label para enterprise
- 📋 Ontologias

### V3 - Enterprise e Social
- 📋 Editor visual de workflows
- 📋 Gestão avançada de workspaces
- 📋 Conexão entre bases de conhecimento (social knowledge network)

---

## 📚 Referências

- **Documentação Técnica:** `docs/technical-context/` (a criar)
- **Sistema Onion Base:** `docs/onion/`
- **Knowledge Bases:** `docs/knowbase/`
- **Meta Specs:** `docs/meta-specs/`

---

**Responsável:** Onion App Team  
**Última Atualização:** 2025-12-12  
**Versão:** 1.0.0

