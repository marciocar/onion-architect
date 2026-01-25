# 🤖 Agentes Especializados - Sistema Onion

> **Versão**: 3.0.0 | **Última atualização**: 2025-12-16 | **Total**: 46 agentes

Documentação completa de todos os agentes de IA especializados disponíveis no Sistema Onion.

## 📑 Índice

- [🔵 Agentes de Desenvolvimento](#-agentes-de-desenvolvimento) (18)
- [🟡 Agentes de Produto](#-agentes-de-produto) (8)
- [🛡️ Agentes de Compliance](#️-agentes-de-compliance) (5)
- [🌲 Agentes Git](#-agentes-git) (4)
- [🔴 Agentes Meta](#-agentes-meta) (4)
- [🧪 Agentes de Testes](#-agentes-de-testes) (3)
- [🟢 Agentes de Review](#-agentes-de-review) (2)
- [🟣 Agentes de Pesquisa](#-agentes-de-pesquisa) (1)
- [⚙️ Agentes de Deployment](#️-agentes-de-deployment) (1)

---

## 🔵 Agentes de Desenvolvimento

### `@react-developer`
```typescript
function react_developer(query: string): DevelopmentResult
// Propósito: Especialista em React moderno, shadcn/ui, TypeScript, acessibilidade
```
**Quando usar**: Componentes React/Next.js, frontend TypeScript, design systems

### `@python-developer`
```typescript
function python_developer(query: string): DevelopmentResult
// Propósito: Python idiomático, AI/ML, backend, performance, type hints
```
**Quando usar**: APIs REST/GraphQL em Python, projetos ML, scripts Python

### `@nodejs-specialist`
```typescript
function nodejs_specialist(query: string): DevelopmentResult
// Propósito: Backend Node.js, APIs, performance, arquitetura
```
**Quando usar**: Desenvolvimento backend Node.js, otimização de APIs

### `@clickup-specialist`
```typescript
function clickup_specialist(query: string): ClickUpOptimizationResult
// Propósito: ClickUp MCP técnico, automações avançadas, performance, workflows
```
**Quando usar**: Otimizações técnicas do ClickUp, bulk operations, automações

### `@cursor-specialist`
```typescript
function cursor_specialist(query: string): CursorConfigResult
// Propósito: Configuração e troubleshooting do Cursor IDE
```
**Quando usar**: Problemas de IDE, configuração, otimização de performance

### `@nx-monorepo-specialist`
```typescript
function nx_monorepo_specialist(query: string): NxWorkspaceResult
// Propósito: Especialista em monorepos Nx, generators, CI/CD
```
**Quando usar**: Configuração de monorepos, generators, otimização de builds

### `@zen-engine-specialist`
```typescript
function zen_engine_specialist(query: string): ZenStackResult
// Propósito: ZenStack, Prisma, access control policies, schema design
```
**Quando usar**: Modelagem de dados, políticas de acesso, schemas ZenStack

### `@postgres-specialist`
```typescript
function postgres_specialist(query: string): DatabaseResult
// Propósito: PostgreSQL, otimização de queries, migrations, performance
```
**Quando usar**: Otimização de queries, migrations, performance de banco

### `@whisper-specialist`
```typescript
function whisper_specialist(query: string): TranscriptionResult
// Propósito: Transcrição de áudio com OpenAI Whisper, multi-plataforma
```
**Quando usar**: Transcrição de áudio, instalação Whisper, troubleshooting

### `@mermaid-specialist`
```typescript
function mermaid_specialist(query: string): DiagramResult
// Propósito: Criação de diagramas Mermaid (flowcharts, sequence, etc)
```
**Quando usar**: Documentação visual, diagramas técnicos, arquitetura

### `@c4-architecture-specialist`
```typescript
function c4_architecture_specialist(query: string): ArchitectureResult
// Propósito: Arquitetura C4 Model, diagramas de contexto e containers
```
**Quando usar**: Documentação arquitetural, diagramas C4, design de sistemas

### `@c4-documentation-specialist`
```typescript
function c4_documentation_specialist(query: string): DocumentationResult
// Propósito: Documentação técnica usando C4 Model
```
**Quando usar**: Criação de documentação arquitetural estruturada

### `@docs-reverse-engineer`
```typescript
function docs_reverse_engineer(query: string): ReverseEngineeringResult
// Propósito: Engenharia reversa de código para documentação
```
**Quando usar**: Documentar código existente, análise de codebase

### `@system-documentation-orchestrator`
```typescript
function system_documentation_orchestrator(query: string): DocumentationResult
// Propósito: Orquestração de documentação técnica completa
```
**Quando usar**: Documentação abrangente de sistemas, coordenação de docs

### `@gitflow-specialist`
```typescript
function gitflow_specialist(query: string): GitWorkflowResult
// Propósito: GitFlow, branching strategies, workflows Git
```
**Quando usar**: Estratégias de branching, GitFlow, workflows Git

### `@linux-security-specialist`
```typescript
function linux_security_specialist(query: string): SecurityResult
// Propósito: Segurança Linux, hardening, best practices
```
**Quando usar**: Configuração de segurança, hardening de servidores

### `@runflow-specialist`
```typescript
function runflow_specialist(query: string): RunflowResult
// Propósito: Plataforma Runflow, workflows, automações
```
**Quando usar**: Integração com Runflow, workflows automatizados

### `@gamma-api-specialist`
```typescript
function gamma_api_specialist(query: string): GammaResult
// Propósito: Gamma.App API, apresentações automatizadas
```
**Quando usar**: Criação de apresentações via API, integração Gamma

### `@task-specialist`
```typescript
function task_specialist(query: string): TaskManagementResult
// Propósito: Gestão de tasks, Task Manager Abstraction
```
**Quando usar**: Operações com tasks, abstração de gerenciadores

---

## 🟡 Agentes de Produto

### `@product-agent`
```typescript
function product_agent(query: string): ProductStrategyResult
// Propósito: Gestão estratégica de produto, coordenação de projetos
```
**Quando usar**: Planejamento estratégico, coordenação de features, especificações

### `@story-points-framework-specialist`
```typescript
function story_points_framework_specialist(query: string): EstimationResult
// Propósito: Estimativas ágeis, story points, framework completo
```
**Quando usar**: Estimativas de tasks, story points, planejamento ágil

### `@extract-meeting-specialist`
```typescript
function extract_meeting_specialist(query: string): ExtractionResult
// Propósito: Extração estruturada de conhecimento de reuniões (Framework EXTRACT)
```
**Quando usar**: Processar transcrições, extrair conhecimento estruturado

### `@meeting-consolidator`
```typescript
function meeting_consolidator(query: string): ConsolidationResult
// Propósito: Consolidação de múltiplas reuniões com análise profunda
```
**Quando usar**: Consolidar reuniões, identificar divergências/convergências

### `@storytelling-business-specialist`
```typescript
function storytelling_business_specialist(query: string): NarrativeResult
// Propósito: Narrativas de negócio, storytelling estratégico
```
**Quando usar**: Comunicação estratégica, narrativas de produto

### `@branding-positioning-specialist`
```typescript
function branding_positioning_specialist(query: string): BrandingResult
// Propósito: Branding, posicionamento de marca, estratégias de mercado
```
**Quando usar**: Estratégias de marca, posicionamento, marketing

### `@pain-price-specialist`
```typescript
function pain_price_specialist(query: string): ProductAnalysisResult
// Propósito: Identificar e precificar dor do cliente, análise de produto
```
**Quando usar**: Análise de produto, pricing, identificação de dores

### `@presentation-orchestrator`
```typescript
function presentation_orchestrator(query: string): PresentationResult
// Propósito: Orquestração de apresentações, Gamma.App integration
```
**Quando usar**: Criação de apresentações, integração com Gamma

---

## 🛡️ Agentes de Compliance

### `@security-information-master`
```typescript
function security_information_master(query: string): ComplianceResult
// Propósito: Orquestração de compliance multi-framework (ISO 27001, ISO 22301, SOC2, PMBOK)
```
**Quando usar**: Documentação de compliance, auditorias, certificações

### `@iso-27001-specialist`
```typescript
function iso_27001_specialist(query: string): ISO27001Result
// Propósito: ISO 27001:2022, segurança da informação
```
**Quando usar**: Conformidade ISO 27001, segurança da informação

### `@iso-22301-specialist`
```typescript
function iso_22301_specialist(query: string): ISO22301Result
// Propósito: ISO 22301:2019, continuidade de negócios
```
**Quando usar**: Continuidade de negócios, disaster recovery

### `@soc2-specialist`
```typescript
function soc2_specialist(query: string): SOC2Result
// Propósito: SOC2 Type II, controles de segurança
```
**Quando usar**: Conformidade SOC2, controles de segurança

### `@corporate-compliance-specialist`
```typescript
function corporate_compliance_specialist(query: string): ComplianceResult
// Propósito: Compliance corporativo, regulamentações gerais
```
**Quando usar**: Compliance corporativo, regulamentações diversas

---

## 🌲 Agentes Git

### `@branch-code-reviewer`
```typescript
function branch_code_reviewer(query: string): ReviewResult
// Propósito: Code review específico para branches Git
```
**Quando usar**: Review de código em branches, análise de PRs

### `@branch-documentation-writer`
```typescript
function branch_documentation_writer(query: string): DocumentationResult
// Propósito: Documentação específica para branches Git
```
**Quando usar**: Documentar mudanças em branches, changelogs

### `@branch-metaspec-checker`
```typescript
function branch_metaspec_checker(query: string): ValidationResult
// Propósito: Validação de conformidade com metaspecs em branches
```
**Quando usar**: Validar branches contra metaspecs, conformidade

### `@branch-test-planner`
```typescript
function branch_test_planner(query: string): TestPlanResult
// Propósito: Planejamento de testes específico para branches
```
**Quando usar**: Planejar testes para features em branches

---

## 🔴 Agentes Meta

### `@onion`
```typescript
function onion(query: string): OrchestrationResult
// Propósito: Orquestrador master do Sistema Onion, conhece todo o sistema
```
**Quando usar**: Ponto de entrada inteligente, navegação, orquestração

### `@metaspec-gate-keeper`
```typescript
function metaspec_gate_keeper(query: string): ValidationResult
// Propósito: Validação de integridade arquitetural, metaspecs, design principles
```
**Quando usar**: Validar alinhamento arquitetural, decisões estruturais

### `@agent-creator-specialist`
```typescript
function agent_creator_specialist(query: string): AgentCreationResult
// Propósito: Criação de novos agentes especializados
```
**Quando usar**: Criar novos agentes, templates de agentes

### `@command-creator-specialist`
```typescript
function command_creator_specialist(query: string): CommandCreationResult
// Propósito: Criação de novos comandos Cursor
```
**Quando usar**: Criar novos comandos, templates de comandos

---

## 🧪 Agentes de Testes

### `@test-engineer`
```typescript
function test_engineer(query: string): TestResult
// Propósito: Unit testing com Jest/Vitest, behavior verification
```
**Quando usar**: Escrever testes unitários, verificar comportamento

### `@test-agent`
```typescript
function test_agent(query: string): TestStrategyResult
// Propósito: Estratégias completas de teste, planejamento
```
**Quando usar**: Estratégias de teste, planejamento abrangente

### `@test-planner`
```typescript
function test_planner(query: string): TestPlanResult
// Propósito: Planejamento de testes, análise de cobertura
```
**Quando usar**: Planejar testes, análise de cobertura

---

## 🟢 Agentes de Review

### `@code-reviewer`
```typescript
function code_reviewer(query: string): ReviewResult
// Propósito: Code review, melhores práticas, detecção de bugs
```
**Quando usar**: Review de código antes de PR, análise de qualidade

### `@corporate-compliance-specialist`
```typescript
function corporate_compliance_specialist(query: string): ComplianceResult
// Propósito: Compliance corporativo, regulamentações
```
**Quando usar**: Review de compliance, conformidade regulatória

---

## 🟣 Agentes de Pesquisa

### `@research-agent`
```typescript
function research_agent(query: string): ResearchResult
// Propósito: Pesquisa multi-fonte, web search, Context7, análise semântica
```
**Quando usar**: Pesquisar tecnologias, melhores práticas, documentação

---

## ⚙️ Agentes de Deployment

### `@docker-specialist`
```typescript
function docker_specialist(query: string): DockerResult
// Propósito: Docker, containers, deployment, orchestration
```
**Quando usar**: Configuração Docker, containers, deployment

---

## 📊 Resumo por Categoria

| Categoria | Quantidade | Agentes Principais |
|-----------|------------|-------------------|
| 🔵 **Desenvolvimento** | 18 | @react-developer, @python-developer, @nodejs-specialist |
| 🟡 **Produto** | 8 | @product-agent, @story-points-framework-specialist |
| 🛡️ **Compliance** | 5 | @security-information-master, @iso-27001-specialist |
| 🌲 **Git** | 4 | @branch-code-reviewer, @branch-documentation-writer |
| 🔴 **Meta** | 4 | @onion, @metaspec-gate-keeper |
| 🧪 **Testes** | 3 | @test-engineer, @test-agent |
| 🟢 **Review** | 2 | @code-reviewer |
| 🟣 **Pesquisa** | 1 | @research-agent |
| ⚙️ **Deployment** | 1 | @docker-specialist |

---

## 🎯 Como Escolher o Agente Certo

### Por Tipo de Tarefa

| Tarefa | Agente Recomendado |
|--------|-------------------|
| Desenvolver componente React | `@react-developer` |
| Criar API Python | `@python-developer` |
| Otimizar ClickUp | `@clickup-specialist` |
| Planejar feature | `@product-agent` |
| Estimar story points | `@story-points-framework-specialist` |
| Transcrever áudio | `@whisper-specialist` |
| Extrair reunião | `@extract-meeting-specialist` |
| Review de código | `@code-reviewer` |
| Criar testes | `@test-engineer` |
| Validar arquitetura | `@metaspec-gate-keeper` |
| Pesquisar tecnologia | `@research-agent` |
| Navegação geral | `@onion` |

### Por Fluxo de Trabalho

**Desenvolvimento Completo:**
1. `@product-agent` → Planejamento
2. `@react-developer` / `@python-developer` → Desenvolvimento
3. `@test-engineer` → Testes
4. `@code-reviewer` → Review
5. `@metaspec-gate-keeper` → Validação arquitetural

**Gestão de Produto:**
1. `@extract-meeting-specialist` → Extrair reuniões
2. `@meeting-consolidator` → Consolidar conhecimento
3. `@product-agent` → Planejar features
4. `@story-points-framework-specialist` → Estimar

---

## 🔗 Recursos Relacionados

- [Referência Completa de Agentes](../../onion/agents-reference.md)
- [Comandos .cursor/](./commands.md)
- [Ferramentas MCP](./mcps.md)
- [Regras do Workspace](./rules.md)

---

**Última atualização**: 2025-12-16  
**Versão**: 3.0.0  
**Mantido por**: Sistema Onion

