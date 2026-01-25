---
name: help
description: Lista comandos disponíveis do contexto Business organizados por nível de complexidade
model: sonnet
category: business
tags: [help, discovery, onboarding, levels]
version: "4.0.0"
updated: "2025-12-20"
level: starter
context: business
---

# Business Context - Help

Lista todos os comandos disponíveis no contexto **Business**, organizados por nível de complexidade (starter, intermediate, advanced).

---

## 🎯 Uso

```bash
# Listar comandos starter (padrão - 80% dos casos)
/business/help

# Listar comandos de um nível específico
/business/help --level=starter
/business/help --level=intermediate
/business/help --level=advanced

# Listar todos os comandos
/business/help --level=all
```

---

## 📋 Sistema de Níveis

O Sistema Onion organiza comandos em **3 níveis** baseados na frequência de uso:

| Nível | % Uso | Descrição | Onboarding |
|-------|-------|-----------|------------|
| **Starter** | 80% | Comandos essenciais para uso diário | ~15 min |
| **Intermediate** | 15% | Workflows avançados e especializados | ~30 min |
| **Advanced** | 5% | Casos específicos e automações complexas | ~45 min |

---

## 📊 Comandos Disponíveis

Você me pediu para executar o comando help. Vou listar os comandos organizados por nível:

### 🌟 STARTER COMMANDS (5 comandos - 80% dos casos)
**⏱️ Tempo de onboarding: ~15 minutos**

Estes são os comandos que você usará no dia a dia:

1. **`/business/spec "feature-name"`**
   - Criar especificação de produto a partir de requisitos iniciais
   - Use quando: Precisar documentar uma nova feature ou requisito
   - Exemplo: `/business/spec "dashboard-analytics"`

2. **`/business/task "task-description"`**
   - Criar task no gerenciador com estimativa de story points
   - Use quando: Converter especificação em task rastreável
   - Exemplo: `/business/task "implementar filtro de datas"`

3. **`/business/estimate "feature"`**
   - Estimar story points de uma feature usando framework estruturado
   - Use quando: Precisar dimensionar esforço de desenvolvimento
   - Exemplo: `/business/estimate "sistema de notificações"`

4. **`/business/refine "spec.md"`**
   - Refinar e validar especificação existente, identificar gaps
   - Use quando: Spec inicial precisa de mais detalhes ou clareza
   - Exemplo: `/business/refine "docs/specs/user-auth.md"`

5. **`/business/warm-up`**
   - Preparar contexto do projeto, carregar informações relevantes
   - Use quando: Iniciar trabalho em nova sessão ou projeto
   - Exemplo: `/business/warm-up`

---

### 🔧 INTERMEDIATE COMMANDS (10 comandos - 15% dos casos)
**⏱️ Tempo de onboarding: ~30 minutos**

Comandos para workflows mais avançados:

1. **`/business/collect`** - Coletar informações de múltiplas fontes
2. **`/business/light-arch`** - Criar arquitetura leve de solução
3. **`/business/extract-meeting`** - Extrair ações e decisões de reunião
4. **`/business/consolidate-meetings`** - Consolidar múltiplas reuniões
5. **`/business/convert-to-tasks`** - Converter especificações em tasks
6. **`/business/whisper`** - Transcrever áudio de reunião
7. **`/business/task-check`** - Validar completude de task
8. **`/business/validate-task`** - Validar task contra critérios
9. **`/business/check`** - Verificar conformidade de especificação
10. **`/business/feature`** - Criar feature completa (spec + tasks)

---

### ⚡ ADVANCED COMMANDS (5 comandos - 5% dos casos)
**⏱️ Tempo de onboarding: ~45 minutos**

Comandos especializados para casos específicos:

1. **`/business/transform-consolidated`** - Transformar reuniões consolidadas em docs estruturados
2. **`/business/presentation`** - Criar apresentação profissional via Gamma
3. **`/business/branding`** - Análise e estratégia de branding/posicionamento
4. **`/business/analyze-pain-price`** - Análise detalhada de dor vs preço
5. **`/business/checklist-sync`** - Sincronizar checklists com task manager

---

## 🚀 Próximos Passos

### Se você é novo no Business Context:

1. **Comece pelos Starter Commands** (os 5 primeiros)
   - Foque em `/business/spec` e `/business/task`
   - Pratique criando uma spec simples
   - Tempo estimado: 15-30 minutos

2. **Explore um Intermediate Command**
   - Experimente `/business/feature` para workflow completo
   - Ou `/business/extract-meeting` se trabalha com reuniões
   - Tempo estimado: +30 minutos

3. **Descubra Agentes Especializados**
   ```bash
   @product-agent              # Orquestração de produto
   @story-points-specialist    # Estimativas precisas
   @extract-meeting-specialist # Extração de reuniões
   ```

### Pronto para Technical Context?

Uma vez confortável com Business, explore:
```bash
/technical/help              # Comandos de desenvolvimento
/technical/work "task-id"    # Iniciar desenvolvimento
```

---

## 📚 Documentação Relacionada

- **Sistema de Níveis**: `docs/onion/levels-system.md`
- **READMEs**: `.onion/contexts/business/README.md`
- **Agentes**: `.onion/contexts/business/agents/`
- **Configuração**: `.onion/contexts/business/.context-config.yml`

---

## 💡 Dicas Úteis

### Filosofia 80/15/5
- **80%** do seu tempo: Use apenas comandos **starter**
- **15%** do seu tempo: Use comandos **intermediate**
- **5%** do seu tempo: Use comandos **advanced**

### Descoberta Progressiva
Cada comando inclui seção "🚀 Próximos Passos" sugerindo o que fazer em seguida.

### Flags e Opções
```bash
--level=starter       # Filtrar por nível
--level=all          # Ver todos os níveis
```

---

## 🎓 Onboarding Recomendado

### Dia 1 (30 minutos)
1. Execute `/business/warm-up`
2. Pratique `/business/spec "test-feature"`
3. Teste `/business/estimate "test-feature"`

### Semana 1 (2 horas)
- Domine os 5 starter commands
- Experimente 2-3 intermediate commands
- Crie specs reais do seu projeto

### Mês 1 (5 horas)
- Explore todos os intermediate commands
- Teste 1-2 advanced commands conforme necessidade
- Integre no workflow diário

---

**📊 Estatísticas do Business Context:**
- **Total**: 20 comandos
- **Starter**: 5 (25%)
- **Intermediate**: 10 (50%)
- **Advanced**: 5 (25%)
- **Agentes**: 12 especializados
- **Tempo total onboarding**: ~90 minutos (todos os níveis)

---

## 🆘 Precisa de Ajuda?

- **Help de outro contexto**: `/technical/help`, `/customer-success/help`
- **Help global**: `/help`
- **Agente de ajuda**: `@onion` (orquestrador principal)
- **Documentação**: `docs/onion/`

---

**Sistema Onion v4.0** - Multi-Context Development Orchestrator 🧅

