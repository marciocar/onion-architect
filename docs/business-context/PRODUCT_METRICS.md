# 📊 Product Metrics - Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 🎯 Visão Geral

Este documento define as métricas-chave de sucesso do Onion App, organizadas em frameworks que permitem medir saúde do produto, engajamento de usuários e performance de negócio.

---

## ⭐ North Star Metric

### Métrica Principal

> **"Perguntas respondidas com sucesso por semana"**

**Por que esta métrica?**
- Captura **valor entregue** (resposta útil)
- Indica **conhecimento organizado** (precisa de knowbase)
- Mostra **engajamento** (uso ativo)
- Correlaciona com **retenção** (uso semanal)

**Fórmula:**
```
NSM = Σ (perguntas com feedback positivo ou sem rejeição) / semana
```

**Meta por Fase:**
| Fase | Meta NSM | Significado |
|------|----------|-------------|
| Beta | 5 perguntas/usuário/semana | Validação de valor |
| V1 | 10 perguntas/usuário/semana | Hábito formado |
| V2 | 20 perguntas/usuário/semana | Power usage |

---

## 📈 AARRR Funnel Metrics

### Acquisition (Aquisição)

| Métrica | Descrição | Meta V1 | Ferramenta |
|---------|-----------|---------|------------|
| **Signups/semana** | Novos cadastros | 200 | Analytics |
| **Source attribution** | De onde vêm | - | UTM tracking |
| **CAC** | Custo por aquisição | < $10 | Finance |
| **Signup rate** | Visitors → Signup | 5% | Analytics |

**Fontes de Tráfego (Meta):**
| Fonte | % do Total |
|-------|------------|
| Orgânico (SEO) | 40% |
| Social (Twitter, LinkedIn) | 25% |
| Referral | 20% |
| Paid | 15% |

### Activation (Ativação)

| Métrica | Descrição | Meta V1 | Ferramenta |
|---------|-----------|---------|------------|
| **Time to first value** | Signup → Primeira pergunta respondida | < 10 min | Analytics |
| **Activation rate** | % que atinge primeiro valor | 60% | Analytics |
| **Onboarding completion** | % que completa onboarding | 80% | Analytics |
| **First knowbase created** | % com 1+ knowbase | 70% | DB |
| **First agent created** | % com 1+ agente | 40% | DB |

**Funnel de Ativação:**
```
Signup (100%)
    ↓
Onboarding Start (95%)
    ↓
First Knowbase (70%)
    ↓
First Question (65%)
    ↓
First Agent (40%)
    ↓
ACTIVATED (40%)
```

### Retention (Retenção)

| Métrica | Descrição | Meta V1 | Ferramenta |
|---------|-----------|---------|------------|
| **D1 Retention** | Voltou dia seguinte | 50% | Analytics |
| **D7 Retention** | Voltou após 7 dias | 35% | Analytics |
| **D30 Retention** | Voltou após 30 dias | 25% | Analytics |
| **Weekly Active Rate** | WAU/MAU | 60% | Analytics |
| **Stickiness** | DAU/MAU | 25% | Analytics |

**Cohort Retention (Meta):**
```
Week    | 0    | 1    | 2    | 3    | 4    | 8    | 12   |
--------|------|------|------|------|------|------|------|
Meta    | 100% | 45%  | 35%  | 32%  | 30%  | 25%  | 22%  |
```

### Revenue (Receita)

| Métrica | Descrição | Meta V1 | Ferramenta |
|---------|-----------|---------|------------|
| **MRR** | Receita mensal recorrente | $10K | Finance |
| **ARR** | Receita anual recorrente | $120K | Finance |
| **ARPU** | Receita por usuário | $15 | Finance |
| **Conversion rate** | Free → Paid | 5% | Analytics |
| **LTV** | Lifetime value | $180 | Finance |
| **LTV:CAC** | Ratio | > 3:1 | Finance |

**Revenue by Plan (Projeção):**
| Plano | % Usuários | % Revenue |
|-------|------------|-----------|
| Free | 90% | 0% |
| Pro ($19) | 8% | 70% |
| Enterprise | 2% | 30% |

### Referral (Indicação)

| Métrica | Descrição | Meta V1 | Ferramenta |
|---------|-----------|---------|------------|
| **NPS** | Net Promoter Score | > 40 | Survey |
| **Referral rate** | % que indica | 15% | Analytics |
| **Viral coefficient** | Indicações por usuário | 0.3 | Analytics |
| **Organic mentions** | Menções em social | 50/mês | Social listening |

---

## 🎮 Engagement Metrics

### Métricas de Uso

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **Sessions/week** | Sessões por usuário | 5 |
| **Session duration** | Tempo médio | 15 min |
| **Questions/session** | Perguntas por sessão | 5 |
| **Features used** | Features distintas/semana | 3 |

### Métricas por Feature

| Feature | Métrica | Meta |
|---------|---------|------|
| **Knowbases** | Knowbases criadas/usuário | 3 |
| **Knowbases** | Conteúdo adicionado/semana | 5 items |
| **Agentes** | Agentes criados/usuário | 2 |
| **Agentes** | Uso de agente/semana | 10 |
| **Comandos** | Comandos criados/usuário | 5 |
| **Comandos** | Execuções/semana | 20 |
| **Regras** | Regras ativas/usuário | 3 |
| **Scheduler** | Jobs agendados/usuário | 2 |
| **Search** | Buscas web/semana | 5 |

### Feature Adoption Curve

```
Feature Adoption (Meta após 30 dias):

Knowbase Creation   ████████████████████████░░░░░░  80%
First Question      ██████████████████████░░░░░░░░  70%
Agent Creation      ████████████████░░░░░░░░░░░░░░  50%
Command Creation    ████████████░░░░░░░░░░░░░░░░░░  40%
Rules Setup         ██████████░░░░░░░░░░░░░░░░░░░░  35%
Scheduler Use       ████████░░░░░░░░░░░░░░░░░░░░░░  25%
Integrations        ██████░░░░░░░░░░░░░░░░░░░░░░░░  20%
```

---

## 🔴 Health Metrics

### Sinais de Saúde do Produto

| Sinal | Métrica | Saudável | Atenção | Crítico |
|-------|---------|----------|---------|---------|
| **Engagement** | WAU/MAU | > 60% | 40-60% | < 40% |
| **Retention** | D30 | > 25% | 15-25% | < 15% |
| **Satisfaction** | NPS | > 40 | 20-40 | < 20 |
| **Growth** | MoM Growth | > 10% | 5-10% | < 5% |
| **Revenue** | Churn Rate | < 5% | 5-10% | > 10% |

### Leading vs Lagging Indicators

| Leading (Previsão) | Lagging (Resultado) |
|--------------------|---------------------|
| Onboarding completion | D30 Retention |
| Features used/week | NPS |
| Session frequency | Churn Rate |
| First week activity | LTV |
| Support tickets | Revenue Growth |

---

## 💼 Business Metrics

### Unit Economics

| Métrica | Valor Meta | Fórmula |
|---------|------------|---------|
| **CAC** | $10 | Marketing spend / New customers |
| **LTV** | $180 | ARPU × Average lifetime (months) |
| **LTV:CAC** | 18:1 | LTV / CAC |
| **Payback Period** | < 2 meses | CAC / Monthly margin |
| **Gross Margin** | 70% | (Revenue - COGS) / Revenue |

### Custos por Usuário

| Componente | Custo/usuário/mês |
|------------|-------------------|
| **LLM (tokens)** | $0.50 - $2.00 |
| **Storage** | $0.10 |
| **Compute** | $0.20 |
| **Support** | $0.30 |
| **Total COGS** | ~$1.50 - $3.00 |

### Revenue Metrics

| Métrica | Meta Ano 1 | Meta Ano 2 |
|---------|------------|------------|
| **MRR** | $10K | $100K |
| **ARR** | $120K | $1.2M |
| **Paying Customers** | 1,000 | 10,000 |
| **ARPU** | $15 | $20 |
| **Net Revenue Retention** | 100% | 110% |

---

## 📉 Churn Analysis

### Métricas de Churn

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **Monthly Churn Rate** | Cancelamentos/mês | < 5% |
| **Revenue Churn** | MRR perdido/mês | < 3% |
| **Net Churn** | Churn - Expansion | < 0% (crescimento) |
| **Time to Churn** | Dias até cancelar | > 90 dias |

### Churn por Segmento

| Segmento | Churn Esperado | Ação |
|----------|----------------|------|
| Free (30 dias inativo) | 70% | Esperado, re-engagement |
| Pro (< 3 meses) | 15% | Onboarding, quick wins |
| Pro (> 6 meses) | 5% | Engajamento, novidades |
| Enterprise | 2% | Relacionamento, roadmap |

### Churn Prediction Signals

| Sinal | Peso | Threshold |
|-------|------|-----------|
| Dias sem login | 🔴 Alto | > 7 dias |
| Queda em uso | 🔴 Alto | -50% WoW |
| Ticket de frustração | 🟡 Médio | Qualquer |
| Downgrade request | 🔴 Alto | Qualquer |
| Export de dados | 🔴 Alto | Qualquer |

---

## 📊 Dashboard Structure

### Executive Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                    ONION APP DASHBOARD                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MAU          MRR           NPS          D30 Retention       │
│  ┌─────┐      ┌─────┐       ┌─────┐      ┌─────┐            │
│  │ 5K  │      │ $8K │       │ 45  │      │ 28% │            │
│  │ ↑12%│      │ ↑8% │       │ ↑5  │      │ ↑3% │            │
│  └─────┘      └─────┘       └─────┘      └─────┘            │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Signups This Week: 180  │  Activation Rate: 58%            │
│  Churn Rate: 4.2%        │  Questions/User: 12              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Product Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCT METRICS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Feature Adoption (30d)                                      │
│  ───────────────────────────────────────────────────────────│
│  Knowbases    ████████████████████████████░░  82%           │
│  Questions    ██████████████████████████░░░░  75%           │
│  Agents       ████████████████░░░░░░░░░░░░░░  48%           │
│  Commands     ██████████████░░░░░░░░░░░░░░░░  42%           │
│  Scheduler    ████████░░░░░░░░░░░░░░░░░░░░░░  23%           │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Avg Session Duration: 14 min                                │
│  Sessions/Week/User: 4.2                                     │
│  North Star (Q/week): 8.5                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Measurement Cadence

### Frequência de Revisão

| Métrica | Frequência | Owner |
|---------|------------|-------|
| North Star | Diária | Product |
| Engagement | Diária | Product |
| Acquisition | Semanal | Growth |
| Retention | Semanal | Product |
| Revenue | Semanal | Finance |
| NPS | Mensal | Product |
| Cohort Analysis | Mensal | Product |
| Unit Economics | Trimestral | Finance |

### Alertas Automáticos

| Evento | Threshold | Ação |
|--------|-----------|------|
| D1 Retention queda | < 40% | Review onboarding |
| Churn spike | > 8% | Análise de causa |
| NPS queda | < 30 | Survey follow-up |
| Feature adoption baixa | < 20% | UX review |
| Error rate alta | > 1% | Hotfix |

---

## 📈 Growth Model

### Projeção de Crescimento (Ano 1)

| Mês | MAU | Paying | MRR |
|-----|-----|--------|-----|
| 1 | 100 | 5 | $95 |
| 2 | 300 | 15 | $285 |
| 3 | 700 | 35 | $665 |
| 4 | 1,200 | 60 | $1,140 |
| 5 | 2,000 | 100 | $1,900 |
| 6 | 3,000 | 150 | $2,850 |
| 7 | 4,500 | 225 | $4,275 |
| 8 | 6,000 | 300 | $5,700 |
| 9 | 7,500 | 375 | $7,125 |
| 10 | 9,000 | 450 | $8,550 |
| 11 | 10,000 | 500 | $9,500 |
| 12 | 12,000 | 600 | $11,400 |

**Premissas:**
- Conversion Free→Paid: 5%
- ARPU: $19
- Monthly churn: 5%
- Organic growth: 40% MoM

---

**Próximo documento:** [Competitive Landscape](COMPETITIVE_LANDSCAPE.md)

