# 📋 Project Charter: Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 🌟 Vision Statement

**Technical Vision:**
Construir uma plataforma SaaS de gestão de conhecimento AI-first, multi-tenant, escalável e segura, que permite qualquer pessoa criar e gerenciar assistentes de IA personalizados sem conhecimento técnico.

**Why This Project Exists:**
Democratizar o acesso à gestão de conhecimento com IA, transformando a metodologia Onion (knowbase → agentes → comandos → regras) em uma plataforma acessível e poderosa.

---

## ✅ Success Criteria

### Technical Success Metrics

| Métrica | Meta V1 | Meta V2 |
|---------|---------|---------|
| **Uptime** | 99.5% | 99.9% |
| **API Response Time** | < 200ms (p95) | < 100ms (p95) |
| **AI Response Time** | < 5s (p95) | < 3s (p95) |
| **Test Coverage** | 60% | 80% |
| **Build Time** | < 5 min | < 3 min |
| **Deploy Time** | < 10 min | < 5 min |

### Product Success Metrics
- **MAU:** 10,000 (Year 1)
- **Activation Rate:** 60% (signup → first value)
- **NPS:** > 40
- **Churn Rate:** < 5% monthly

---

## 📐 Scope Boundaries

### ✅ IN Scope (V1)

**Core Features:**
- ✅ Knowbase management (CRUD)
- ✅ Agent creation and management
- ✅ Command workflows
- ✅ Rules system
- ✅ Scheduler (Pro tier)
- ✅ Web search integration
- ✅ Markdown editor
- ✅ @onion orchestrator
- ✅ **Mobile app (iOS + Android)** 🆕
- ✅ **Design System** 🆕

**Technical Requirements:**
- ✅ Multi-tenancy with RLS
- ✅ Self-hosted Logto authentication
- ✅ BYOL support for AI providers
- ✅ Docker Compose for local development
- ✅ TypeScript strict mode
- ✅ Zod validation everywhere
- ✅ **Shared components (web + mobile)** 🆕
- ✅ **Design system library** 🆕

**Infrastructure:**
- ✅ PostgreSQL 16
- ✅ Redis 7 (BullMQ)
- ✅ MinIO (S3-compatible storage)
- ✅ Qdrant (vector database)

**POC Requirements (Pre-V1):**
- ✅ **2 knowbases fixas** (dados de exemplo)
- ✅ **3 agentes fixos** (1 conhecedor dos outros 2)
- ✅ **2 comandos fixos** (workflows de exemplo)
- ✅ **1 arquivo de regras fixo** (padrões de comportamento)

### ❌ OUT of Scope (V1)

**Features:**
- ❌ Visual workflow editor (V3)
- ❌ Marketplace (V2)
- ❌ White-label (V2)
- ❌ Advanced analytics (V2)
- ❌ API for external developers (V2)

**Technical:**
- ❌ Kubernetes deployment (future)
- ❌ Multi-region deployment (future)
- ❌ Real-time collaboration (V2)
- ❌ WebSocket support (V2)

---

## 👥 Key Stakeholders

### Primary Users
- **Alex (Individual):** Usuário individual que quer expandir habilidades com IA
- **Marina (Team Lead):** Líder de time que precisa centralizar conhecimento
- **Roberto (Executive):** Executivo que precisa de memória institucional

### Technical Stakeholders
- **Development Team:** 3-5 desenvolvedores full-stack
- **Product Owner:** Define prioridades e roadmap
- **DevOps:** Infraestrutura e deployment (future)

### Business Stakeholders
- **Founders:** Visão estratégica e funding
- **Early Adopters:** Feedback e validação

---

## 🔒 Technical Constraints

### Non-Negotiable Requirements

| Constraint | Requirement | Rationale |
|------------|-------------|-----------|
| **Multi-tenancy** | RLS desde V1 | Isolamento de dados crítico |
| **Type Safety** | TypeScript strict + Zod | Prevenir bugs em produção |
| **AI Latency** | < 5s response time | UX aceitável |
| **Data Privacy** | LGPD/GDPR compliant | Regulamentação |
| **Self-hosted Auth** | Logto self-hosted | Controle de dados |
| **Exportability** | Tudo em .md | Sem vendor lock-in |

### Performance Constraints
- **Database:** PostgreSQL deve suportar 10K+ tenants
- **API:** P95 latency < 200ms
- **AI:** Streaming responses quando possível
- **Storage:** MinIO deve escalar para TBs

### Security Constraints
- ✅ Criptografia em trânsito (TLS 1.3)
- ✅ Criptografia em repouso (database)
- ✅ Row-Level Security obrigatório
- ✅ Secrets management (env vars, future: Vault)
- ✅ Rate limiting em todas as APIs
- ✅ Input validation (Zod) em todas as camadas

### Compliance Constraints
- ✅ LGPD (Brasil)
- ✅ GDPR (Europa)
- ✅ SOC2 Type II (future, V2)

---

## 🎯 Technical Principles

### Core Principles

1. **AI-First**
   - IA não é feature, é core da arquitetura
   - @onion em toda interação
   - Streaming quando possível

2. **Type Safety**
   - TypeScript strict mode
   - Zod em todas as camadas
   - Runtime validation sempre

3. **Multi-Tenancy First**
   - RLS desde o início
   - Tenant isolation obrigatório
   - Escalabilidade horizontal

4. **Developer Experience**
   - Fast feedback loops
   - Hot reload em desenvolvimento
   - Testes rápidos e confiáveis

5. **Simplicity**
   - Menos abstrações, mais clareza
   - Code over configuration quando possível
   - Documentação sempre atualizada

---

## 📅 Timeline & Milestones

### POC (Proof of Concept) - Week 1-2

**Objetivo:** Validar arquitetura e fluxos com dados fixos

**Deliverables:**
- [ ] 2 knowbases pré-populadas (exemplos reais)
- [ ] 3 agentes fixos:
  - [ ] Agente 1: Especialista em Knowbase A
  - [ ] Agente 2: Especialista em Knowbase B
  - [ ] Agente 3: Orquestrador (conhece Agente 1 e 2)
- [ ] 2 comandos fixos (workflows funcionais)
- [ ] 1 arquivo de regras (padrões de comportamento)
- [ ] Interface simplificada (web + mobile básico)
- [ ] Fluxo completo funcionando end-to-end

**Critérios de Sucesso POC:**
- ✅ Agente orquestrador consegue delegar para outros agentes
- ✅ Comandos executam workflows completos
- ✅ Regras aplicam comportamento consistente
- ✅ Mobile acessa mesma API e dados
- ✅ Design system básico funcionando

### V1 (MVP) - Q1-Q2 2025

**Milestone 0: POC (Week 1-2)** 🆕
- [ ] POC com dados fixos (ver acima)
- [ ] Validação de arquitetura
- [ ] Design system básico

**Milestone 1: Foundation (Week 3-6)**
- [ ] NX monorepo setup completo
- [ ] Docker Compose infra
- [ ] Prisma schema + migrations
- [ ] Logto self-hosted setup
- [ ] Basic auth flow
- [ ] Design system library

**Milestone 2: Core Features (Week 7-14)**
- [ ] Knowbase CRUD (dinâmico)
- [ ] Agent creation (dinâmico)
- [ ] Command workflows (dinâmico)
- [ ] Rules system (dinâmico)
- [ ] @onion orchestrator
- [ ] Mobile app (iOS + Android)

**Milestone 3: Polish (Week 15-18)**
- [ ] Frontend UI/UX (web + mobile)
- [ ] Design system completo
- [ ] Testing (60% coverage)
- [ ] Documentation
- [ ] Performance optimization

**Milestone 4: Launch Prep (Week 19-22)**
- [ ] Beta testing
- [ ] Bug fixes
- [ ] Security audit
- [ ] Public launch

---

## 🚨 Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **AI costs scaling** | High | High | BYOL, caching, usage limits |
| **Multi-tenancy complexity** | High | Medium | RLS patterns, extensive testing |
| **Performance degradation** | Medium | Medium | Monitoring, load testing |
| **Team velocity** | Medium | Low | Clear docs, good DX |
| **Security vulnerabilities** | High | Low | Security reviews, audits |

---

## 📚 Related Documentation

- **Business Context:** [`../business-context/`](../business-context/)
- **Architecture Decisions:** [`adr/`](adr/)
- **API Specs:** [`API_SPECIFICATION.md`](API_SPECIFICATION.md)

---

**Responsável:** Tech Lead  
**Aprovado por:** Product Owner  
**Data:** 2025-12-12

