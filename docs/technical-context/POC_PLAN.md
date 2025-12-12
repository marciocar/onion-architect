# 🧪 POC (Proof of Concept) Plan - Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 🎯 Objetivo da POC

Validar a arquitetura técnica e fluxos de negócio do Onion App com **dados fixos** antes de implementar a versão dinâmica completa.

**Por que POC primeiro?**
- Validar arquitetura antes de investir em features dinâmicas
- Testar integração entre componentes (knowbases → agentes → comandos → regras)
- Validar multi-tenancy e RLS funcionando
- Testar mobile compartilhando código com web
- Validar design system funcionando

---

## 📋 Elementos da POC

### 1. Knowbases (2 fixas)

#### Knowbase A: "Marketing Digital 2025"
**Conteúdo:**
```markdown
# Marketing Digital 2025

## Estratégias Principais

### SEO
- Foco em conteúdo orgânico
- Keywords: marketing digital, inbound marketing
- Meta descriptions otimizadas

### Google Ads
- Budget: R$ 5.000/mês
- Foco em conversão, não apenas tráfego
- Landing pages otimizadas

### Conteúdo
- Blog posts semanais
- E-books para lead generation
- Webinars mensais

## Métricas de Sucesso
- CAC: R$ 50
- LTV: R$ 500
- ROI: 10:1
```

#### Knowbase B: "Vendas e Negociação"
**Conteúdo:**
```markdown
# Vendas e Negociação

## Processo de Vendas

### Qualificação
- BANT framework (Budget, Authority, Need, Timeline)
- Score mínimo: 70/100

### Apresentação
- Demo personalizada
- Foco em ROI
- Case studies relevantes

### Fechamento
- Trial de 14 dias
- Proposta customizada
- Follow-up em 24h

## Objeções Comuns
- "Muito caro" → Mostrar ROI e economia de tempo
- "Não temos tempo" → Mostrar automação
- "Já temos solução" → Comparativo de features
```

---

### 2. Agentes (3 fixos)

#### Agente 1: @marketing
**Arquivo:** `libs/poc/data/agents/marketing.md`
```markdown
---
name: marketing
description: Especialista em Marketing Digital
knowbaseIds:
  - knowbase-marketing-id
instructions: |
  Você é um especialista em marketing digital.
  Use a knowbase de Marketing Digital 2025 como fonte de conhecimento.
  Sempre forneça respostas práticas e acionáveis.
  Inclua métricas quando relevante.
model: gpt-4
version: "1.0.0"
updated: "2025-12-12"
---

# Agente @marketing

Especialista em Marketing Digital que utiliza a knowbase de Marketing Digital 2025 
para fornecer respostas práticas e acionáveis sobre estratégias de marketing, SEO, 
Google Ads, conteúdo e métricas.
```

#### Agente 2: @vendas
**Arquivo:** `libs/poc/data/agents/vendas.md`
```markdown
---
name: vendas
description: Especialista em Vendas e Negociação
knowbaseIds:
  - knowbase-vendas-id
instructions: |
  Você é um especialista em vendas B2B.
  Use a knowbase de Vendas e Negociação como fonte.
  Ajude a qualificar leads, preparar apresentações e lidar com objeções.
  Sempre foque em fechar negócios.
model: gpt-4
version: "1.0.0"
updated: "2025-12-12"
---

# Agente @vendas

Especialista em Vendas e Negociação B2B que utiliza a knowbase de Vendas e Negociação 
para ajudar com qualificação de leads, preparação de apresentações, tratamento de 
objeções e fechamento de negócios.
```

#### Agente 3: @onion (Orquestrador)
**Arquivo:** `libs/poc/data/agents/onion.md`
```markdown
---
name: onion
description: Orquestrador Master - Conhece todos os agentes
knowbaseIds:
  - knowbase-marketing-id
  - knowbase-vendas-id
agentIds:
  - agent-marketing-id
  - agent-vendas-id
instructions: |
  Você é o @onion, orquestrador master do sistema.
  
  Você conhece dois agentes especializados:
  1. @marketing - Especialista em Marketing Digital
  2. @vendas - Especialista em Vendas e Negociação
  
  Quando receber uma pergunta:
  - Se for sobre marketing → delegue para @marketing
  - Se for sobre vendas → delegue para @vendas
  - Se for sobre ambos → consolide respostas dos dois agentes
  - Se não souber qual agente usar → pergunte ao usuário ou use seu conhecimento geral
  
  Sempre indique qual agente está respondendo.
model: gpt-4
version: "1.0.0"
updated: "2025-12-12"
---

# Agente @onion

Orquestrador master do sistema que coordena e delega tarefas para agentes 
especializados (@marketing e @vendas), garantindo que cada pergunta seja respondida 
pelo agente mais adequado.
```

**Comportamento esperado:**
```
Usuário: "Qual estratégia de marketing para Q1?"

@onion: Vou consultar o @marketing sobre isso...

[@onion consulta @marketing internamente]

@onion: Baseado na knowbase de Marketing Digital 2025, aqui está a estratégia:

📊 **Estratégias para Q1:**
- SEO: Foco em conteúdo orgânico...
- Google Ads: Budget de R$ 5.000/mês...
- Conteúdo: Blog posts semanais...

[Fonte: @marketing]
```

---

### 3. Comandos (2 fixos)

#### Comando 1: `/estrategia-marketing`
**Arquivo:** `libs/poc/data/commands/estrategia-marketing.md`
```markdown
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
```

#### Comando 2: `/preparar-venda`
**Arquivo:** `libs/poc/data/commands/preparar-venda.md`
```markdown
---
name: preparar-venda
description: Prepara apresentação de vendas para um cliente
category: vendas
steps:
  - type: query
    query: "Buscar informações sobre {empresa} na knowbase de vendas"
  
  - type: agent
    agentId: agent-vendas-id
    prompt: |
      Prepare uma apresentação de vendas para {empresa}.
      Inclua:
      - Qualificação BANT
      - Proposta customizada
      - Resposta a objeções comuns
      - Próximos passos
  
  - type: output
    format: markdown
variables:
  - name: empresa
    type: string
    prompt: "Nome da empresa?"
version: "1.0.0"
updated: "2025-12-12"
---

# Comando /preparar-venda

Prepara uma apresentação completa de vendas para um cliente específico, incluindo 
qualificação BANT, proposta customizada, tratamento de objeções e próximos passos.

## Exemplo de uso

```
```
/preparar-venda empresa="Acme Corp"
```

---

### 4. Regras (1 arquivo fixo)

#### Arquivo: `libs/poc/data/rules/poc-rules.md`
```markdown
---
name: poc-default-rules
description: Regras padrão para POC
active: true
scope:
  global: true
  agents:
    - agent-marketing-id
    - agent-vendas-id
    - agent-onion-id
priority: 50
version: "1.0.0"
updated: "2025-12-12"
---

# Regras Padrão POC

## Regra 1: Tom de Comunicação

**Escopo:** Global (todos agentes)  
**Prioridade:** 50

**Comportamento:**
- Tom: Profissional mas acessível
- Idioma: Português brasileiro
- Formato: Markdown com seções claras
- Emojis: Moderados (máximo 2 por resposta)

## Regra 2: Citação de Fontes

**Escopo:** Todos agentes  
**Prioridade:** 75

**Comportamento:**
- Sempre citar knowbase usada
- Formato: `[Fonte: @nome-agente]` ou `[Knowbase: Nome]`
- Se usar múltiplas fontes, listar todas

## Regra 3: Respostas Práticas

**Escopo:** @marketing, @vendas  
**Prioridade:** 60

**Comportamento:**
- Sempre incluir exemplos práticos
- Incluir métricas quando disponível
- Sugerir próximos passos acionáveis

## Regra 4: Orquestração Transparente

**Escopo:** @onion  
**Prioridade:** 80

**Comportamento:**
- Sempre indicar qual agente está respondendo
- Se delegar, explicar por quê
- Consolidar respostas quando usar múltiplos agentes
```

---

## 🏗️ Arquitetura da POC

### Estrutura de Dados Fixos

```
libs/poc/
├── data/
│   ├── knowbases/
│   │   ├── marketing-digital.md
│   │   └── vendas-negociacao.md
│   ├── agents/
│   │   ├── marketing.md      # Agente com cabeçalho YAML
│   │   ├── vendas.md         # Agente com cabeçalho YAML
│   │   └── onion.md          # Agente com cabeçalho YAML
│   ├── commands/
│   │   ├── estrategia-marketing.md  # Comando com cabeçalho YAML
│   │   └── preparar-venda.md        # Comando com cabeçalho YAML
│   └── rules/
│       └── poc-rules.md      # Regras com cabeçalho YAML
└── src/
    ├── loader.ts          # Carrega dados fixos (.md files)
    ├── seed.ts            # Popula DB com dados fixos
    └── fixtures.ts        # Fixtures para testes
```

### Fluxo de Setup da POC

```
1. Setup infraestrutura (Docker Compose)
   ↓
2. Setup database (Prisma migrations)
   ↓
3. Seed dados fixos (todos arquivos .md):
   - Carregar 2 knowbases (.md) → Criar no PostgreSQL + embeddings no Qdrant
   - Carregar 3 agentes (.md com YAML header) → Criar no PostgreSQL
   - Carregar 2 comandos (.md com YAML header) → Criar no PostgreSQL
   - Carregar 1 arquivo de regras (.md com YAML header) → Aplicar regras
   ↓
4. Validar fluxos:
   - Perguntar ao @onion
   - @onion delega para @marketing/@vendas
   - Executar comandos
   - Verificar regras aplicadas
   ↓
5. Testar mobile:
   - Mesma API
   - Mesmos dados
   - Design system funcionando
```

---

## ✅ Critérios de Sucesso da POC

### Funcionalidades

| Critério | Como Validar |
|----------|--------------|
| **Knowbases funcionam** | Buscar conteúdo e receber resposta relevante |
| **Agentes especializados** | @marketing responde sobre marketing, @vendas sobre vendas |
| **Orquestração funciona** | @onion delega corretamente para agentes |
| **Comandos executam** | `/estrategia-marketing` gera estratégia completa |
| **Regras aplicam** | Respostas seguem tom e formato definidos |
| **Multi-tenancy isolado** | Dados não vazam entre tenants (teste com 2 tenants) |

### Técnico

| Critério | Como Validar |
|----------|--------------|
| **RLS funcionando** | Queries retornam apenas dados do tenant |
| **Mobile funciona** | App mobile acessa mesma API e dados |
| **Design system** | Componentes compartilhados entre web e mobile |
| **Performance** | Respostas de IA < 5s |
| **Type safety** | TypeScript strict, Zod validation funcionando |

---

## 🧪 Testes da POC

### Testes Funcionais

```typescript
describe('POC - Fluxo Completo', () => {
  it('@onion deve delegar para @marketing quando perguntar sobre marketing', async () => {
    const response = await askOnion('Qual estratégia de SEO?');
    expect(response).toContain('@marketing');
    expect(response).toContain('conteúdo orgânico');
  });
  
  it('@onion deve delegar para @vendas quando perguntar sobre vendas', async () => {
    const response = await askOnion('Como qualificar um lead?');
    expect(response).toContain('@vendas');
    expect(response).toContain('BANT');
  });
  
  it('Comando /estrategia-marketing deve gerar estratégia completa', async () => {
    const result = await executeCommand('/estrategia-marketing', { periodo: 'Q1' });
    expect(result).toHaveProperty('resumo');
    expect(result).toHaveProperty('estrategias');
    expect(result).toHaveProperty('metricas');
  });
  
  it('Regras devem aplicar tom e formato corretos', async () => {
    const response = await askOnion('Teste');
    expect(response).toMatch(/\[Fonte:/); // Citação de fonte
    expect(response).not.toMatch(/emoji emoji emoji/); // Máximo 2 emojis
  });
});
```

### Testes de Multi-tenancy

```typescript
describe('POC - Multi-tenancy', () => {
  it('Tenant A não deve ver dados do Tenant B', async () => {
    await setTenant('tenant-a');
    const knowbases = await getKnowbases();
    expect(knowbases).toHaveLength(2); // Knowbases da POC
    
    await setTenant('tenant-b');
    const knowbasesB = await getKnowbases();
    expect(knowbasesB).toHaveLength(0); // Tenant B não tem dados ainda
  });
});
```

---

## 📱 Mobile na POC

### Escopo Mobile (POC)

**Screens básicos:**
- Login/Auth
- Chat com @onion
- Lista de knowbases (read-only)
- Visualizar knowbase
- Executar comandos (lista)

**Design System:**
- Componentes básicos: Button, Input, Card, Text
- Tema simplificado (light apenas)
- Navegação básica (stack navigation)

### Compartilhamento de Código

```
libs/design-system/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.web.tsx      # Web (Next.js)
│   │   │   └── Button.mobile.tsx   # Mobile (React Native)
│   │   └── ...
│   └── tokens/
│       └── colors.ts               # Compartilhado
```

---

## 📅 Timeline da POC

### Week 1: Setup e Infraestrutura

**Day 1-2: Infraestrutura**
- [ ] Docker Compose setup
- [ ] PostgreSQL + Prisma schema básico
- [ ] Qdrant setup
- [ ] Logto self-hosted

**Day 3-4: Dados Fixos**
- [ ] Criar estrutura de dados POC
- [ ] Seed knowbases no PostgreSQL
- [ ] Criar embeddings no Qdrant
- [ ] Seed agentes, comandos, regras

**Day 5: Backend API**
- [ ] Rotas básicas (chat, knowbases)
- [ ] Integração com agentes fixos
- [ ] Execução de comandos fixos

### Week 2: Frontend e Mobile

**Day 1-2: Design System**
- [ ] Setup design system library
- [ ] Componentes básicos (Button, Input, Card)
- [ ] Tokens de design

**Day 3-4: Web App**
- [ ] Tela de chat com @onion
- [ ] Lista de knowbases
- [ ] Execução de comandos

**Day 5: Mobile App**
- [ ] Setup React Native no monorepo
- [ ] Screens básicos usando design system
- [ ] Integração com mesma API

---

## 🎯 Validações da POC

### Arquitetura

- [ ] Multi-tenancy com RLS funcionando
- [ ] Knowbases → Agentes → Comandos → Regras integrados
- [ ] Mobile compartilha código com web
- [ ] Design system funciona em ambos

### Negócio

- [ ] @onion orquestra corretamente
- [ ] Agentes especializados funcionam
- [ ] Comandos executam workflows completos
- [ ] Regras aplicam comportamento consistente

### Performance

- [ ] Respostas de IA < 5s
- [ ] Mobile responsivo
- [ ] Queries otimizadas

---

## 🚀 Próximos Passos Após POC

**Se POC bem-sucedida:**
1. Evoluir para versão dinâmica (CRUD completo)
2. Adicionar mais features
3. Expandir design system
4. Adicionar mais screens mobile

**Se POC identificar problemas:**
1. Ajustar arquitetura
2. Refatorar componentes problemáticos
3. Re-executar POC até validar

---

## 📚 Referências

- [Project Charter](project_charter.md)
- [Business Logic](BUSINESS_LOGIC.md)
- [Codebase Guide](CODEBASE_GUIDE.md)

---

**Status:** 📋 Planejado  
**Início:** Week 1 do projeto  
**Duração:** 2 semanas

