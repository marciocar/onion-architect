# 🧅 Onion App - Technical Context

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 📋 Project Context Profile

### Basic Project Information

**Project Name:** Onion App  
**Project Type:** Web Application (Full-Stack SaaS)  
**Repository:** `onion-app`  
**Team Size:** 3-5 developers (initial)  
**Experience Level:** Mixed team (Mid-level to Senior)  
**AI Tool Usage:** Cursor AI for development

---

## 🛠️ Technology Stack

### Primary Language & Runtime
- **Language:** TypeScript 5.7+
- **Runtime:** Node.js 22 LTS
- **Package Manager:** pnpm 9.x

### Backend Stack
- **Framework:** Fastify 5.x
- **ORM:** Prisma 6.x
- **Database:** PostgreSQL 16
- **Validation:** Zod 3.23+ (everywhere)
- **Authentication:** Logto (self-hosted)
- **Queue:** BullMQ 5.x + Redis 7.x
- **Storage:** MinIO (S3-compatible)
- **Vector DB:** Qdrant 1.9+

### Frontend Stack
- **Web Framework:** Next.js 15.x (App Router)
- **Mobile Framework:** React Native (Expo) 🆕
- **UI Library:** React 19.x
- **Design System:** Tamagui (universal components) 🆕
- **Styling:** Tailwind CSS 4.x (web) + Tamagui (mobile)
- **State Management:** Zustand 5.x
- **Data Fetching:** TanStack Query 5.x
- **Validation:** Zod 3.23+ (client-side)

### Monorepo & Tooling
- **Monorepo:** NX 19.x
- **Build Tool:** Turbopack (Next.js) + esbuild (Fastify)
- **Testing:** Vitest 2.x (unit/integration) + Playwright 1.50+ (E2E)
- **Linting:** ESLint 9.x
- **Formatting:** Prettier 3.x
- **Type Checking:** TypeScript strict mode

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions (future)
- **Deployment:** Docker Compose (development local)

---

## 🏗️ Architecture Overview

### Architecture Pattern
- **Type:** Monorepo Full-Stack (NX)
- **Organization:** Feature-based modular structure
- **Multi-tenancy:** Row-Level Security (RLS) in PostgreSQL
- **API Style:** RESTful APIs with OpenAPI documentation

### Key Architectural Decisions
- ✅ Multi-tenancy desde o início (RLS)
- ✅ AI-first architecture
- ✅ Zod everywhere (type-safe validation)
- ✅ Self-hosted Logto (auth control)
- ✅ BYOL support (Bring Your Own License for AI)
- ✅ UUID v7 for primary keys (time-ordered)

---

## 📁 Technical Context Architecture

### Layer 1: Core Project Context

- [Project Charter](project_charter.md) - Visão técnica, escopo e critérios de sucesso
- [Architecture Decision Records](adr/) - Decisões arquiteturais documentadas
  - [ADR-001: Monorepo com NX](adr/001-monorepo-nx.md)
  - [ADR-002: Fastify como Framework Backend](adr/002-fastify-backend.md)
  - [ADR-003: Prisma como ORM](adr/003-prisma-orm.md)
- [ADR-004: Multi-tenancy com RLS](adr/004-multi-tenancy-rls.md)
- [ADR-005: Zod Everywhere](adr/005-zod-everywhere.md)
- [ADR-006: Logto Self-Hosted](adr/006-logto-self-hosted.md)
- [ADR-007: Mobile com React Native](adr/007-mobile-react-native.md) 🆕
- [ADR-008: Design System Universal](adr/008-design-system.md) 🆕

### Layer 2: AI-Optimized Context Files

- [AI Development Guide](CURSOR.meta.md) - Guia para desenvolvimento com IA
- [Codebase Navigation Guide](CODEBASE_GUIDE.md) - Estrutura e navegação do código

### Layer 3: Domain-Specific Context

- [Business Logic Documentation](BUSINESS_LOGIC.md) - Lógica de negócio e regras
- [API Specifications](API_SPECIFICATION.md) - Especificação completa das APIs

### Layer 4: Development Workflow Context

- [Development Workflow Guide](CONTRIBUTING.md) - Processo de desenvolvimento
- [Troubleshooting Guide](TROUBLESHOOTING.md) - Resolução de problemas comuns
- [POC Plan](POC_PLAN.md) - Plano da Proof of Concept 🆕

---

## 🎯 Development Constraints

- ✅ High compliance requirements (LGPD, GDPR)
- ✅ Multi-tenant architecture (data isolation)
- ✅ Performance-critical (AI latency optimization)
- ✅ Rapid prototyping/MVP focus
- ✅ Long-term maintenance (5+ years)
- ✅ Multiple team collaboration
- ✅ External developer onboarding

---

## 📊 Project Structure

```
onion-app/
├── apps/
│   ├── api/              # Fastify backend API
│   ├── web/              # Next.js frontend
│   └── worker/           # BullMQ workers
├── libs/
│   ├── shared/           # Shared utilities
│   ├── database/         # Prisma schema & client
│   ├── auth/             # Auth utilities
│   ├── ai/               # AI integrations
│   └── features/         # Feature modules
├── tools/                # NX generators, scripts
├── docker/               # Docker configurations
└── docs/                 # Documentation
    ├── business-context/ # Business documentation
    └── technical-context/ # This documentation
```

---

## 🔗 Cross-References

- **Business Context:** [`docs/business-context/`](../business-context/)
- **Meta Specs:** [`docs/meta-specs/`](../meta-specs/)
- **Knowledge Bases:** [`docs/knowbase/`](../knowbase/)

---

**Responsável:** Onion App Tech Team  
**Última Atualização:** 2025-12-12  
**Versão:** 1.0.0

