# 📋 Comandos .cursor/ - Sistema Onion

> **Versão**: 3.0.0 | **Última atualização**: 2025-12-16 | **Total**: 90 comandos

Documentação completa de todos os comandos Cursor disponíveis no Sistema Onion.

## 📑 Índice

- [📋 Comandos de Produto](#-comandos-de-produto) (21)
- [🌿 Comandos Git](#-comandos-git) (13)
- [🔧 Comandos de Engenharia](#-comandos-de-engenharia) (11)
- [📚 Comandos de Documentação](#-comandos-de-documentação) (11)
- [⚙️ Meta Comandos](#️-meta-comandos) (9)
- [✅ Comandos de Validação](#-comandos-de-validação) (6)
- [🧪 Comandos de Testes](#-comandos-de-testes) (3)
- [⚡ Comandos Quick](#-comandos-quick) (1)
- [🧅 Comandos Globais](#-comandos-globais) (2)

---

## 📋 Comandos de Produto

### `/product/task`
```typescript
function product_task(description: string): TaskCreationResult
// Propósito: Criar nova task com estimativas automáticas de story points
```
**Quando usar**: Criar tasks estruturadas no Task Manager configurado

### `/product/estimate`
```typescript
function product_estimate(description: string, options?: {assignee_level?: string}): EstimationResult
// Propósito: Estimar story points manualmente para tarefas
```
**Quando usar**: Estimar esforço de desenvolvimento, planejamento ágil

### `/product/spec`
```typescript
function product_spec(requirements: string): SpecificationResult
// Propósito: Criar especificação técnica detalhada
```
**Quando usar**: Especificações técnicas completas, documentação de features

### `/product/collect`
```typescript
function product_collect(idea: string): CollectionResult
// Propósito: Coletar e salvar ideias/bugs no backlog
```
**Quando usar**: Capturar ideias, bugs, melhorias para o backlog

### `/product/refine`
```typescript
function product_refine(taskId?: string): RefinementResult
// Propósito: Refinar requisitos e recalcular estimativas automaticamente
```
**Quando usar**: Refinar requisitos, atualizar estimativas após mudanças

### `/product/light-arch`
```typescript
function product_light_arch(requirements: string): ArchitectureResult
// Propósito: Esboçar arquitetura inicial da funcionalidade
```
**Quando usar**: Decisões arquiteturais iniciais, design de features

### `/product/task-check`
```typescript
function product_task_check(taskId: string): TaskStatusResult
// Propósito: Verificar status e detalhes de uma task
```
**Quando usar**: Verificar status de tasks, validar informações

### `/product/validate-task`
```typescript
function product_validate_task(taskId: string): ValidationResult
// Propósito: Validar qualidade e completude dos requisitos
```
**Quando usar**: Validação de requisitos antes de desenvolvimento

### `/product/check`
```typescript
function product_check(requirements: string): QualityCheckResult
// Propósito: Verificar qualidade e completude dos requisitos
```
**Quando usar**: Checklist de qualidade de requisitos

### `/product/feature`
```typescript
function product_feature(description: string): FeaturePlanningResult
// Propósito: Planejamento completo de feature do zero
```
**Quando usar**: Planejamento completo de features novas

### `/product/extract-meeting`
```typescript
function product_extract_meeting(params: {
  source: string;
  level?: 'compact' | 'executive' | 'complete' | 'graph';
  focus?: 'all' | 'decisions' | 'tasks' | 'gaps';
}): ExtractionResult
// Propósito: Extrair conhecimento estruturado de reuniões (Framework EXTRACT)
```
**Quando usar**: Processar transcrições de reuniões, extrair conhecimento

### `/product/consolidate-meetings`
```typescript
function product_consolidate_meetings(params: {
  source: string;
  focus?: 'all' | 'divergences' | 'convergences' | 'insights' | 'gaps';
}): ConsolidationResult
// Propósito: Consolidar múltiplas reuniões com análise profunda
```
**Quando usar**: Consolidar múltiplas reuniões relacionadas

### `/product/convert-to-tasks`
```typescript
function product_convert_to_tasks(source: string): TaskConversionResult
// Propósito: Converter documentos consolidados em tasks hierárquicas
```
**Quando usar**: Transformar conhecimento consolidado em tasks acionáveis

### `/product/whisper`
```typescript
function product_whisper(params: {
  audio_file?: string;
  platform?: string;
  query?: string;
}): TranscriptionResult
// Propósito: Facilitador para uso do Whisper (transcrição de áudio)
```
**Quando usar**: Transcrever áudio de reuniões, instalação Whisper

### `/product/analyze-pain-price`
```typescript
function product_analyze_pain_price(description: string): AnalysisResult
// Propósito: Analisar dor do cliente e precificação
```
**Quando usar**: Análise de produto, pricing, identificação de dores

### `/product/branding`
```typescript
function product_branding(description: string): BrandingResult
// Propósito: Estratégias de branding e posicionamento
```
**Quando usar**: Estratégias de marca, posicionamento

### `/product/presentation`
```typescript
function product_presentation(description: string): PresentationResult
// Propósito: Criar apresentações via Gamma.App
```
**Quando usar**: Apresentações automatizadas, integração Gamma

### `/product/checklist-sync`
```typescript
function product_checklist_sync(taskId: string): SyncResult
// Propósito: Sincronizar checklists entre sistemas
```
**Quando usar**: Sincronização de checklists, validações

### `/product/transform-consolidated`
```typescript
function product_transform_consolidated(source: string): TransformationResult
// Propósito: Transformar documentos consolidados
```
**Quando usar**: Transformação de documentos consolidados

### `/product/warm-up`
```typescript
function product_warm_up(): ContextResult
// Propósito: Aquecimento do contexto de produto
```
**Quando usar**: Preparação para trabalho de produto

### `/product/README`
```typescript
function product_readme(): DocumentationResult
// Propósito: Documentação dos comandos de produto
```
**Quando usar**: Referência dos comandos de produto

---

## 🌿 Comandos Git

### `/git/init`
```typescript
function git_init(): GitFlowSetupResult
// Propósito: Setup inicial do GitFlow no projeto
```
**Quando usar**: Configuração inicial do GitFlow

### `/git/feature/start`
```typescript
function git_feature_start(name: string): BranchCreationResult
// Propósito: Criar e iniciar feature branch
```
**Quando usar**: Iniciar desenvolvimento de nova feature

### `/git/feature/publish`
```typescript
function git_feature_publish(): PublishResult
// Propósito: Publicar feature branch no remote
```
**Quando usar**: Publicar branch para colaboração

### `/git/feature/finish`
```typescript
function git_feature_finish(): MergeResult
// Propósito: Finalizar feature e fazer merge
```
**Quando usar**: Finalizar feature após PR aprovado

### `/git/release/start`
```typescript
function git_release_start(version: string): ReleaseBranchResult
// Propósito: Iniciar branch de release
```
**Quando usar**: Preparar release de versão

### `/git/release/finish`
```typescript
function git_release_finish(): ReleaseResult
// Propósito: Finalizar release e criar tag
```
**Quando usar**: Finalizar release e criar tag de versão

### `/git/hotfix/start`
```typescript
function git_hotfix_start(description: string): HotfixBranchResult
// Propósito: Criar branch de hotfix
```
**Quando usar**: Correções urgentes em produção

### `/git/hotfix/finish`
```typescript
function git_hotfix_finish(): HotfixResult
// Propósito: Finalizar hotfix e fazer merge
```
**Quando usar**: Finalizar correção urgente

### `/git/sync`
```typescript
function git_sync(): SyncResult
// Propósito: Sincronizar após merge (cleanup, atualiza gerenciador)
```
**Quando usar**: Após merge de PR, limpeza e sincronização

### `/git/code-review`
```typescript
function git_code_review(): ReviewResult
// Propósito: Code review de branch atual
```
**Quando usar**: Review de código antes de PR

### `/git/fast-commit`
```typescript
function git_fast_commit(message: string): CommitResult
// Propósito: Commit rápido com mensagem
```
**Quando usar**: Commits rápidos durante desenvolvimento

### `/git/help`
```typescript
function git_help(): DocumentationResult
// Propósito: Ajuda dos comandos Git
```
**Quando usar**: Referência dos comandos Git

### `/git/README`
```typescript
function git_readme(): DocumentationResult
// Propósito: Documentação dos comandos Git
```
**Quando usar**: Documentação completa dos comandos Git

---

## 🔧 Comandos de Engenharia

### `/engineer/start`
```typescript
function engineer_start(): DevelopmentSetupResult
// Propósito: Iniciar desenvolvimento de funcionalidade (valida story points)
```
**Quando usar**: Iniciar desenvolvimento, valida estimativas antes

### `/engineer/work`
```typescript
function engineer_work(description?: string): DevelopmentResult
// Propósito: Trabalhar em funcionalidade específica
```
**Quando usar**: Loop de desenvolvimento, continuar trabalho

### `/engineer/pr`
```typescript
function engineer_pr(): PRCreationResult
// Propósito: Criar Pull Request (testes, build, PR)
```
**Quando usar**: Criar PR após desenvolvimento completo

### `/engineer/pr-update`
```typescript
function engineer_pr_update(): PRUpdateResult
// Propósito: Atualizar PR existente com mudanças adicionais
```
**Quando usar**: Atualizar PR após feedback ou mudanças

### `/engineer/pre-pr`
```typescript
function engineer_pre_pr(): ValidationResult
// Propósito: Validações antes do Pull Request
```
**Quando usar**: Validações antes de criar PR

### `/engineer/plan`
```typescript
function engineer_plan(description: string): PlanResult
// Propósito: Criar ou revisar plano de desenvolvimento
```
**Quando usar**: Planejamento detalhado de implementação

### `/engineer/docs`
```typescript
function engineer_docs(): DocumentationResult
// Propósito: Gerar documentação técnica da implementação
```
**Quando usar**: Documentar código implementado

### `/engineer/bump`
```typescript
function engineer_bump(type: 'major' | 'minor' | 'patch'): VersionResult
// Propósito: Atualizar versão e preparar release
```
**Quando usar**: Versionamento, preparação de release

### `/engineer/hotfix`
```typescript
function engineer_hotfix(description: string): HotfixResult
// Propósito: Criar hotfix para correção urgente
```
**Quando usar**: Correções urgentes em produção

### `/engineer/validate-phase-sync`
```typescript
function engineer_validate_phase_sync(): SyncValidationResult
// Propósito: Validar sincronização entre fases e subtasks
```
**Quando usar**: Validar sincronização de fases e subtasks

### `/engineer/warm-up`
```typescript
function engineer_warm_up(): ContextResult
// Propósito: Aquecimento do ambiente de engenharia
```
**Quando usar**: Preparação para trabalho de engenharia

---

## 📚 Comandos de Documentação

### `/docs/build-tech-docs`
```typescript
function docs_build_tech_docs(): TechnicalDocsResult
// Propósito: Gerar documentação técnica abrangente
```
**Quando usar**: Documentação técnica completa do projeto

### `/docs/build-business-docs`
```typescript
function docs_build_business_docs(): BusinessDocsResult
// Propósito: Gerar documentação de negócio
```
**Quando usar**: Documentação de negócio e produto

### `/docs/build-compliance-docs`
```typescript
function docs_build_compliance_docs(frameworks?: string[]): ComplianceDocsResult
// Propósito: Gerar documentação de compliance (ISO 27001, ISO 22301, SOC2, PMBOK)
```
**Quando usar**: Documentação de compliance, auditorias

### `/docs/build-index`
```typescript
function docs_build_index(section?: string): IndexResult
// Propósito: Reconstruir índice central de documentação
```
**Quando usar**: Atualizar índice de documentação

### `/docs/consolidate-documents`
```typescript
function docs_consolidate_documents(params: {
  source: string;
  focus?: 'all' | 'divergences' | 'convergences' | 'insights' | 'gaps' | 'structure';
}): ConsolidationResult
// Propósito: Consolidar múltiplos documentos relacionados
```
**Quando usar**: Consolidar documentos relacionados, identificar padrões

### `/docs/reverse-consolidate`
```typescript
function docs_reverse_consolidate(source: string): ReverseEngineeringResult
// Propósito: Engenharia reversa de código para documentação
```
**Quando usar**: Documentar código existente, análise de codebase

### `/docs/refine-vision`
```typescript
function docs_refine_vision(): VisionRefinementResult
// Propósito: Refinar visão e estratégia do projeto
```
**Quando usar**: Refinamento de visão estratégica

### `/docs/validate-docs`
```typescript
function docs_validate_docs(): ValidationResult
// Propósito: Validar qualidade e completude da documentação
```
**Quando usar**: Validação de documentação

### `/docs/docs-health`
```typescript
function docs_docs_health(): HealthCheckResult
// Propósito: Verificar saúde da documentação
```
**Quando usar**: Análise de saúde da documentação

### `/docs/sync-sessions`
```typescript
function docs_sync_sessions(): SyncResult
// Propósito: Sincronizar sessões de desenvolvimento
```
**Quando usar**: Sincronização de sessões

### `/docs/help`
```typescript
function docs_help(): DocumentationResult
// Propósito: Ajuda dos comandos de documentação
```
**Quando usar**: Referência dos comandos de documentação

---

## ⚙️ Meta Comandos

### `/meta/all-tools`
```typescript
function meta_all_tools(): ToolsDocumentationResult
// Propósito: Documentar todas as ferramentas disponíveis
```
**Quando usar**: Listar todas as ferramentas do sistema

### `/meta/create-agent`
```typescript
function meta_create_agent(description: string): AgentCreationResult
// Propósito: Criar novo agente especializado
```
**Quando usar**: Criar novos agentes especializados

### `/meta/create-command`
```typescript
function meta_create_command(description: string): CommandCreationResult
// Propósito: Criar novo comando Cursor
```
**Quando usar**: Criar novos comandos Cursor

### `/meta/create-agent-express`
```typescript
function meta_create_agent_express(description: string): AgentCreationResult
// Propósito: Criação rápida de agente (modo express)
```
**Quando usar**: Criação rápida de agentes simples

### `/meta/setup-integration`
```typescript
function meta_setup_integration(integration?: string): IntegrationSetupResult
// Propósito: Configurar integrações (Task Manager, Gamma, etc)
```
**Quando usar**: Configurar integrações do sistema

### `/meta/create-knowledge-base`
```typescript
function meta_create_knowledge_base(description: string): KnowledgeBaseResult
// Propósito: Criar nova knowledge base
```
**Quando usar**: Criar knowledge bases estruturadas

### `/meta/create-abstraction`
```typescript
function meta_create_abstraction(description: string): AbstractionResult
// Propósito: Criar abstração SDAAL (Specification-Driven AI Abstraction Layer)
```
**Quando usar**: Criar abstrações usando padrão SDAAL

### `/meta/create-task-structure`
```typescript
function meta_create_task_structure(description: string): TaskStructureResult
// Propósito: Criar estrutura hierárquica de tasks
```
**Quando usar**: Criar estruturas complexas de tasks

### `/meta/analyze-complex-problem`
```typescript
function meta_analyze_complex_problem(description: string): AnalysisResult
// Propósito: Análise sistemática de problemas complexos
```
**Quando usar**: Análise de problemas complexos, troubleshooting

---

## ✅ Comandos de Validação

### `/validate/test-strategy/create`
```typescript
function validate_test_strategy_create(description: string): TestStrategyResult
// Propósito: Criar estratégia completa de testes
```
**Quando usar**: Planejar estratégia de testes para projeto

### `/validate/test-strategy/analyze`
```typescript
function validate_test_strategy_analyze(): AnalysisResult
// Propósito: Analisar estratégia de testes existente
```
**Quando usar**: Análise de estratégia de testes atual

### `/validate/qa-points/estimate`
```typescript
function validate_qa_points_estimate(description: string): QAEstimationResult
// Propósito: Estimar QA points para validação
```
**Quando usar**: Estimativas de esforço de QA

### `/validate/collab/three-amigos`
```typescript
function validate_collab_three_amigos(description: string): CollaborationResult
// Propósito: Sessão colaborativa Three Amigos (Dev, QA, PO)
```
**Quando usar**: Sessões colaborativas de validação

### `/validate/collab/pair-testing`
```typescript
function validate_collab_pair_testing(description: string): PairTestingResult
// Propósito: Teste em par (pair testing)
```
**Quando usar**: Testes colaborativos em par

### `/validate/workflow`
```typescript
function validate_workflow(): WorkflowValidationResult
// Propósito: Validar workflows do projeto
```
**Quando usar**: Validação de workflows

---

## 🧪 Comandos de Testes

### `/test/unit`
```typescript
function test_unit(component?: string): UnitTestResult
// Propósito: Criar testes unitários (White-box)
```
**Quando usar**: Testes unitários, white-box testing

### `/test/integration`
```typescript
function test_integration(component?: string): IntegrationTestResult
// Propósito: Criar testes de integração (Grey-box)
```
**Quando usar**: Testes de integração, grey-box testing

### `/test/e2e`
```typescript
function test_e2e(scenario?: string): E2ETestResult
// Propósito: Criar testes end-to-end (Black-box)
```
**Quando usar**: Testes E2E, black-box testing

---

## ⚡ Comandos Quick

### `/quick/analisys`
```typescript
function quick_analysis(description: string): AnalysisResult
// Propósito: Análise rápida de código ou problema
```
**Quando usar**: Análises rápidas, insights imediatos

---

## 🧅 Comandos Globais

### `/onion`
```typescript
function onion(query?: string): OrchestrationResult
// Propósito: Ponto de entrada inteligente para o Sistema Onion
```
**Quando usar**: Navegação, recomendações, orquestração geral

### `/warm-up`
```typescript
function warm_up(): ContextResult
// Propósito: Preparação geral do projeto - contexto completo
```
**Quando usar**: Preparação inicial, estabelecer contexto

---

## 📊 Resumo por Categoria

| Categoria | Quantidade | Comandos Principais |
|-----------|------------|---------------------|
| 📋 **Produto** | 21 | `/product/task`, `/product/estimate`, `/product/extract-meeting` |
| 🌿 **Git** | 13 | `/git/feature/start`, `/git/sync`, `/git/release/start` |
| 🔧 **Engenharia** | 11 | `/engineer/start`, `/engineer/work`, `/engineer/pr` |
| 📚 **Documentação** | 11 | `/docs/build-tech-docs`, `/docs/build-business-docs` |
| ⚙️ **Meta** | 9 | `/meta/all-tools`, `/meta/create-agent` |
| ✅ **Validação** | 6 | `/validate/test-strategy/create`, `/validate/collab/three-amigos` |
| 🧪 **Testes** | 3 | `/test/unit`, `/test/integration`, `/test/e2e` |
| ⚡ **Quick** | 1 | `/quick/analisys` |
| 🧅 **Global** | 2 | `/onion`, `/warm-up` |

---

## 🎯 Fluxos de Trabalho Comuns

### Desenvolvimento Completo
```bash
1. /product/task "Implementar feature X"        # Criar task
2. /product/estimate "Feature X"                # Estimar
3. /engineer/start                               # Iniciar (valida estimativas)
4. /engineer/work                                # Desenvolver
5. /test/unit                                    # Testes
6. /engineer/pr                                  # Criar PR
7. /git/sync                                     # Sincronizar após merge
```

### Extração de Reunião → Tasks
```bash
1. /product/whisper audio_file=reuniao.m4a      # Transcrever
2. /product/extract-meeting source=reuniao.txt   # Extrair conhecimento
3. /product/consolidate-meetings source=docs/meet/ # Consolidar
4. /product/convert-to-tasks source=consolidation.md # Converter em tasks
```

### Documentação Completa
```bash
1. /docs/build-tech-docs                         # Docs técnicas
2. /docs/build-business-docs                     # Docs de negócio
3. /docs/build-compliance-docs                   # Docs de compliance
4. /docs/build-index                             # Reconstruir índice
```

---

## 🔗 Recursos Relacionados

- [Guia Completo de Comandos](../../onion/commands-guide.md)
- [Agentes Especializados](./agents.md)
- [Ferramentas MCP](./mcps.md)
- [Regras do Workspace](./rules.md)

---

**Última atualização**: 2025-12-16  
**Versão**: 3.0.0  
**Mantido por**: Sistema Onion

