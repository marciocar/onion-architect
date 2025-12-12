# 💰 Sales Process - Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 🎯 Visão Geral

Este documento define o processo de vendas e conversão do Onion App, desde aquisição até expansão, com foco inicial em PLG (Product-Led Growth).

---

## 📊 Modelo de Go-to-Market

### Estratégia Primária: Product-Led Growth (PLG)

```
┌─────────────────────────────────────────────────────────────┐
│                    PLG FUNNEL                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AWARENESS          ACQUISITION        ACTIVATION           │
│  ─────────          ───────────        ──────────           │
│  Content            Free Signup        First Value          │
│  SEO                No Credit Card     < 10 min             │
│  Social             Email Only         @onion Welcome       │
│                                                              │
│  REVENUE            RETENTION          REFERRAL             │
│  ───────            ─────────          ────────             │
│  Self-Serve         Engagement         NPS > 40             │
│  Upgrade            Re-engagement      Viral Loops          │
│  In-app             Notifications      Invite Friends       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Por que PLG?**
- Target é indivíduos (V1)
- Custo de aquisição baixo
- Produto se vende sozinho
- Viral potential

### Estratégia Secundária: Sales-Assisted (V2+)

Para teams e enterprise:
- Demos personalizadas
- Trials estendidos
- Onboarding dedicado
- Account management

---

## 🔄 Processo de Conversão

### Estágios do Funil

```
VISITORS
    │
    ▼ (5% conversion)
SIGNUPS (Free)
    │
    ▼ (60% activation)
ACTIVATED (First Value)
    │
    ▼ (30% retention)
RETAINED (Week 4)
    │
    ▼ (10% conversion)
PAYING (Pro)
    │
    ▼ (5% expansion)
EXPANDED (Enterprise / More Seats)
```

### Métricas por Estágio

| Estágio | Entrada | Conversão | Saída |
|---------|---------|-----------|-------|
| Visitor → Signup | 100% | 5% | 5% |
| Signup → Activated | 100% | 60% | 60% |
| Activated → Retained | 100% | 30% | 30% |
| Retained → Paying | 100% | 10% | 10% |
| Paying → Expanded | 100% | 5% | 5% |

### Ações por Estágio

| Estágio | Ação Automática | Trigger |
|---------|-----------------|---------|
| Signup | Welcome email + in-app tour | Imediato |
| D1 | "Complete seu primeiro agente" | 24h sem ação |
| D3 | Tips & tricks email | 3 dias |
| D7 | "Veja o que você pode fazer" | 7 dias |
| D14 | Oferta upgrade | 14 dias + uso ativo |
| D30 | Re-engagement | 30 dias inativo |

---

## 💳 Modelo de Pricing

### Estrutura de Planos

```
┌────────────────────────────────────────────────────────────┐
│                         PRICING V1                          │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  FREE                PRO                   ENTERPRISE       │
│  ────                ───                   ──────────       │
│  $0/mês              $19/mês               Custom           │
│                      (Anual: $15/mês)      (Contato)        │
│                                                             │
│  Limites:            Limites:              Limites:         │
│  • 3 knowbases       • Ilimitado           • Tudo ilimitado │
│  • 1 agente          • 10 agentes          • BYOL           │
│  • 5 comandos        • Ilimitado           • SSO/SAML       │
│  • 100MB storage     • 5GB storage         • Dedicated      │
│  • 50 exec/mês       • 1000 exec/mês       • SLA            │
│                                                             │
│  Features:           Features:              Features:       │
│  ✓ @onion            ✓ Tudo do Free        ✓ Tudo do Pro   │
│  ✓ Sessions          ✓ Scheduler           ✓ White-label   │
│  ✓ Editor MD         ✓ Integrações         ✓ API access    │
│  ✓ Web search        ✓ Priority support    ✓ Onboarding    │
│  ✗ Scheduler         ✓ Export avançado     ✓ Success Mgr   │
│  ✗ Integrações                                              │
│                                                             │
│  Target:             Target:               Target:          │
│  Experimentação      Usuário ativo         Times/Empresas  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Estratégia de Preço

| Elemento | Estratégia |
|----------|------------|
| **Free tier** | Generoso para viralização |
| **Pro tier** | Valor claro vs Free |
| **Annual discount** | 20% para lock-in |
| **Enterprise** | Custom para deal size |

### Triggers de Upgrade

| Trigger | Do | Para | Ação |
|---------|-----|------|------|
| Limite de knowbases | Free | Pro | Modal de upgrade |
| Limite de agentes | Free | Pro | Modal de upgrade |
| Limite de execuções | Free/Pro | Pro/Enterprise | Warning + upgrade |
| Precisa de scheduler | Free | Pro | Feature gate |
| Precisa de SSO | Pro | Enterprise | Sales contact |

---

## 🛒 Self-Service Flow

### Upgrade Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    UPGRADE FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. TRIGGER                                                  │
│     └─ Usuário atinge limite OU clica em "Upgrade"          │
│                                                              │
│  2. VALUE PRESENTATION                                       │
│     └─ Modal mostrando benefícios do Pro                    │
│     └─ Comparativo Free vs Pro                              │
│     └─ "Usuários Pro economizam 5h/semana"                  │
│                                                              │
│  3. PRICING OPTIONS                                          │
│     └─ Mensal: $19/mês                                      │
│     └─ Anual: $15/mês (economize $48)                       │
│                                                              │
│  4. CHECKOUT                                                 │
│     └─ Stripe Checkout (1-click)                            │
│     └─ Métodos: Cartão, PIX (Brasil)                        │
│                                                              │
│  5. CONFIRMATION                                             │
│     └─ Celebração 🎉                                        │
│     └─ Onboarding Pro features                              │
│     └─ Email de confirmação                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Objeções e Respostas

| Objeção | Resposta In-App |
|---------|-----------------|
| "Muito caro" | "Quanto vale 5h/semana do seu tempo?" |
| "Não preciso de mais" | "Desbloqueie scheduler e automações" |
| "Quero testar antes" | "7 dias de trial Pro grátis" |
| "Vou pensar" | "Ative lembrete para 7 dias" |

---

## 👥 Sales-Assisted (V2+)

### Qualificação de Leads

**BANT Framework:**

| Critério | Pergunta | Qualificado |
|----------|----------|-------------|
| **Budget** | "Qual budget para ferramentas?" | > $1K/ano |
| **Authority** | "Quem decide compras?" | Fala com decisor |
| **Need** | "Qual problema resolve?" | PKM/automação claro |
| **Timeline** | "Quando precisa resolver?" | < 3 meses |

### Processo de Enterprise

```
LEAD GENERATION
    │
    ▼ (Marketing/Inbound)
QUALIFICATION (SDR)
    │
    ▼ (BANT check)
DISCOVERY (AE)
    │
    ▼ (Entender necessidades)
DEMO (AE)
    │
    ▼ (Mostrar valor)
PROPOSAL (AE)
    │
    ▼ (Pricing customizado)
NEGOTIATION (AE)
    │
    ▼ (Termos, SLA)
CLOSE (AE)
    │
    ▼ (Contrato)
ONBOARDING (CS)
    │
    ▼ (Implementação)
SUCCESS (CS)
```

### Objeções Enterprise

| Objeção | Resposta |
|---------|----------|
| "Preciso de SSO" | "Enterprise inclui SSO/SAML" |
| "Onde ficam os dados?" | "Cloud criptografado ou on-premise" |
| "E o SLA?" | "99.9% uptime garantido" |
| "Quero trial" | "POC de 30 dias com suporte" |
| "Preciso de compliance" | "SOC2 Type II em andamento" |

---

## 📈 Customer Success

### Onboarding por Plano

| Plano | Onboarding | Duração |
|-------|------------|---------|
| **Free** | Self-service (in-app) | 10 min |
| **Pro** | Self-service + email drip | 7 dias |
| **Enterprise** | Dedicated + calls | 30 dias |

### Métricas de Sucesso

| Métrica | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Time to value | < 10 min | < 5 min | < 1 dia |
| Activation rate | 60% | 80% | 95% |
| NPS | > 30 | > 50 | > 70 |
| Churn | - | < 5% | < 2% |

### Health Score

```
HEALTH SCORE (0-100)

Componentes:
├─ Usage frequency (30%)
│   └─ Logins/semana, ações/sessão
├─ Feature adoption (25%)
│   └─ % features usadas
├─ Value realization (25%)
│   └─ Perguntas respondidas, automações
└─ Engagement (20%)
    └─ Tempo na plataforma, interações

Score Interpretation:
├─ 80-100: 🟢 Healthy - Expand potential
├─ 60-79:  🟡 At risk - Engagement needed
├─ 40-59:  🟠 Unhealthy - Intervention
└─ 0-39:   🔴 Critical - Save or churn
```

---

## 🔄 Expansion Revenue

### Oportunidades de Upsell

| De | Para | Trigger | Valor |
|----|------|---------|-------|
| Free | Pro | Limite atingido | $19/mês |
| Pro | Pro Annual | Uso consistente | $48 economia |
| Pro | Enterprise | Adiciona team | Custom |
| Enterprise | More seats | Time cresce | $X/seat |

### Net Revenue Retention

**Meta: > 100%** (expansion > churn)

| Componente | Meta |
|------------|------|
| Gross retention | 95% |
| Expansion | +10% |
| Net retention | 105% |

---

## 📊 Sales Metrics

### KPIs de Vendas

| Métrica | Meta V1 | Meta V2 |
|---------|---------|---------|
| **MRR** | $10K | $100K |
| **Conversion (Free→Pro)** | 5% | 7% |
| **ARPU** | $19 | $25 |
| **CAC** | $10 | $20 |
| **LTV** | $180 | $300 |
| **LTV:CAC** | 18:1 | 15:1 |
| **Payback period** | < 1 mês | < 2 meses |

### Funil Metrics

| Estágio | Volume/mês | Conv. | Saída |
|---------|------------|-------|-------|
| Visitors | 20,000 | 5% | 1,000 |
| Signups | 1,000 | 60% | 600 |
| Activated | 600 | 30% | 180 |
| Retained (W4) | 180 | 10% | 18 |
| Paying | 18 | - | 18 |

---

## 🛠️ Ferramentas de Vendas

### Stack Recomendado

| Função | Ferramenta | Custo |
|--------|------------|-------|
| **Billing** | Stripe | % transação |
| **Analytics** | PostHog/Mixpanel | Free → Paid |
| **Email** | Resend/Loops | Free tier |
| **Chat** | Intercom/Crisp | Free → Paid |
| **CRM** | HubSpot Free | Free |

### Automações

| Trigger | Ação | Ferramenta |
|---------|------|------------|
| Signup | Welcome sequence | Email |
| D7 sem ativação | Re-engagement | Email + In-app |
| Limite atingido | Upgrade prompt | In-app |
| Trial ending | Reminder | Email + In-app |
| Churn risk | Intervention | Email + Chat |

---

**Próximo documento:** [Messaging Framework](MESSAGING_FRAMEWORK.md)

