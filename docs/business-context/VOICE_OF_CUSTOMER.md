# 🗣️ Voice of Customer - Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 🎯 Visão Geral

Este documento captura a "voz do cliente" - como clientes descrevem suas necessidades, frustrações e expectativas em suas próprias palavras. Essencial para que a IA do Onion App comunique de forma ressonante.

---

## ⭐ Temas de Elogio Comuns

### O Que Clientes Amam (Esperado)

| Tema | Citação Típica | Frequência |
|------|----------------|------------|
| **Simplicidade** | "Finalmente algo que não preciso de tutorial!" | 🔴 Alta |
| **Memória contextual** | "Ele lembra do que eu disse ontem!" | 🔴 Alta |
| **Organização** | "Meu conhecimento parou de se perder" | 🔴 Alta |
| **Autonomia** | "Criei meu próprio assistente sem código" | 🟡 Média |
| **Velocidade** | "Economizo horas toda semana" | 🟡 Média |
| **Onboarding** | "O @onion me guiou como um mentor" | 🟡 Média |

### Citações de Impacto (Para Marketing)

> "É como ter um assistente que leu tudo que eu já escrevi e lembra de cada detalhe."
> — Alex, Consultor de Marketing

> "Antes eu explicava meu contexto pro ChatGPT todo dia. Agora o Onion já sabe quem eu sou."
> — Marina, Freelancer

> "Criei um agente especialista no meu nicho em 10 minutos. Antes isso levaria semanas de configuração."
> — Roberto, Empreendedor

---

## 😤 Reclamações Frequentes (Antecipadas)

### Problemas Comuns e Soluções

| Reclamação | Causa Raiz | Solução |
|------------|------------|---------|
| "Não entendi o que é knowbase" | Terminologia nova | Usar "base de conhecimento" + tooltip |
| "O agente não respondeu bem" | Knowbase mal estruturada | Dicas de estruturação proativas |
| "Demora para gerar resposta" | Latência de IA | Cache + indicador de progresso |
| "Não sei por onde começar" | Overwhelm inicial | Onboarding mais guiado |
| "Perdi meus dados" | Falta de backup | Auto-save + histórico |
| "Preço alto para o que uso" | Percepção de valor | Mostrar métricas de uso |

### Citações de Frustração (Para Priorização)

> "Passei 30 minutos tentando entender a diferença entre comando e agente."
> — Prioridade: Simplificar nomenclatura

> "A IA é boa, mas às vezes 'alucina' coisas que não estão na minha knowbase."
> — Prioridade: Melhorar grounding

> "Queria compartilhar com meu time, mas só posso no plano caro."
> — Prioridade: Plano Team acessível

---

## 📋 Padrões de Solicitação de Features

### Features Mais Pedidas (Antecipadas)

| Feature | Demanda | Versão Planejada |
|---------|---------|------------------|
| Mobile app | 🔴 Alta | V2 |
| Integrações (Notion, Google) | 🔴 Alta | V2 |
| Templates prontos | 🔴 Alta | V1 |
| Editor visual de workflows | 🟡 Média | V3 |
| Voz (falar com @onion) | 🟡 Média | V3 |
| API para devs | 🟡 Média | V2 |
| Modo offline | 🟢 Baixa | V3 |
| White-label | 🟢 Baixa | V3 |

### Como Clientes Descrevem Features

| O que pedem | O que realmente querem |
|-------------|------------------------|
| "Quero app no celular" | Acesso rápido em qualquer lugar |
| "Integração com Notion" | Não perder dados que já tenho |
| "Editor visual" | Menor curva de aprendizado |
| "Modo offline" | Segurança de não perder acesso |

---

## ⚔️ Comparações Competitivas

### Como Clientes Comparam

| Comparação | Percepção do Cliente | Nossa Resposta |
|------------|---------------------|----------------|
| vs ChatGPT | "ChatGPT não lembra de nada" | "Onion é sua memória persistente" |
| vs Notion AI | "Notion AI só funciona dentro do Notion" | "Onion centraliza qualquer conhecimento" |
| vs Obsidian | "Obsidian é muito técnico" | "Onion é para quem não programa" |
| vs Zapier | "Zapier é para automação, não conhecimento" | "Onion une conhecimento + automação" |
| vs Mem.ai | "Mem foca só em notas" | "Onion tem agentes e workflows" |

### Objeções Competitivas

| Objeção | Resposta |
|---------|----------|
| "ChatGPT é grátis" | "Mas não organiza nem lembra seu contexto" |
| "Notion já tem IA" | "Limitada ao que está no Notion, Onion centraliza tudo" |
| "n8n é mais poderoso" | "n8n é para devs, Onion é para todos" |
| "Posso fazer isso com prompts" | "Pode, mas perde horas organizando - Onion faz isso por você" |

---

## 🗣️ Linguagem e Terminologia

### Palavras Que Clientes Usam

| Termo Técnico | Como Cliente Fala | Usar em UI/Marketing |
|---------------|-------------------|---------------------|
| Knowledge base | "Minhas anotações", "minha base" | "Base de conhecimento" |
| AI Agent | "Meu assistente", "o bot" | "Assistente" ou "Agente" |
| Workflow | "Meu processo", "rotina" | "Fluxo de trabalho" |
| Prompt | "O que eu peço pra IA" | "Instrução" ou "Comando" |
| Embedding | (não conhecem) | Evitar |
| Vector database | (não conhecem) | Evitar |
| Context window | "Memória da IA" | "Contexto" ou "Memória" |
| RAG | (não conhecem) | "Busca inteligente" |

### Terminologia a Evitar

| ❌ Evitar | ✅ Usar |
|----------|--------|
| "Embeddings vetoriais" | "Busca inteligente" |
| "LLM" | "IA" ou "assistente" |
| "Token limit" | "Limite de contexto" |
| "API integration" | "Conexão com apps" |
| "YAML configuration" | "Configuração simples" |
| "Chunking strategy" | "Organização automática" |

### Tom de Voz por Contexto

| Contexto | Tom | Exemplo |
|----------|-----|---------|
| Onboarding | Acolhedor, paciente | "Vamos juntos! Seu primeiro passo é..." |
| Erro | Empático, solucionador | "Ops! Isso acontece. Veja como resolver..." |
| Sucesso | Celebratório | "🎉 Incrível! Você criou seu primeiro agente!" |
| Upgrade | Não-pushy | "Quando estiver pronto, há mais recursos para você" |
| Suporte | Profissional, rápido | "Entendi o problema. Aqui está a solução..." |

---

## 📞 Padrões de Comunicação

### Preferências por Canal

| Canal | Quando Usar | Tom |
|-------|-------------|-----|
| **In-app** | Onboarding, nudges, celebrações | Casual, curto |
| **Email** | Updates, re-engajamento | Pessoal, storytelling |
| **Chat/Suporte** | Problemas, dúvidas | Profissional, objetivo |
| **Social Media** | Comunidade, showcases | Inspirador, visual |

### Preferências de Formato

| Tipo de Usuário | Prefere |
|-----------------|---------|
| Visual learner | GIFs, vídeos curtos, screenshots |
| Text-oriented | Bullet points, passo-a-passo |
| Busy professional | TL;DR + link para detalhes |
| Explorer | Links para documentação completa |

### Frequência de Comunicação

| Tipo | Frequência | Canal |
|------|------------|-------|
| Product updates | Mensal | Email + in-app |
| Tips & tricks | Semanal | In-app (opt-in) |
| Re-engagement | Após 7 dias inativo | Email |
| Transactional | Imediato | Email |

---

## 🎯 Diretrizes para IA (@onion)

### Como @onion Deve Comunicar

**Princípios:**
1. **Ser humano, não robótico** - Use "você" e "seu", não "o usuário"
2. **Celebrar progressos** - Reconhecer cada conquista
3. **Sugerir proativamente** - Não esperar perguntas
4. **Simplificar sempre** - Se pode ser mais simples, deve ser
5. **Admitir limitações** - "Não tenho essa informação, mas posso ajudar com..."

**Exemplos de Respostas:**

```markdown
# ✅ BOM
"Ótima pergunta! Baseado na sua base de conhecimento sobre marketing, 
aqui está o que encontrei: [resposta]. Quer que eu expanda algum ponto?"

# ❌ RUIM  
"De acordo com os embeddings vetoriais da sua knowledge base, 
o RAG retornou os seguintes chunks relevantes: [resposta técnica]"
```

### Respostas por Situação

| Situação | Resposta Ideal |
|----------|----------------|
| Primeira interação | "Olá! Sou seu @onion 🧅 Estou aqui para ajudar você a organizar seu conhecimento. Por onde quer começar?" |
| Pergunta sem resposta | "Não encontrei isso na sua base de conhecimento. Quer adicionar essa informação agora?" |
| Usuário confuso | "Sem problema! Vamos por partes. Primeiro, [passo simples]. Consegue fazer isso?" |
| Tarefa completada | "🎉 Feito! Você criou [X]. Próximo passo sugerido: [Y]" |
| Erro técnico | "Ops, algo deu errado do nosso lado. Estou tentando novamente... [solução]" |

### Personalização por Uso

| Perfil de Uso | Adaptação da IA |
|---------------|-----------------|
| Novo usuário | Mais explicativo, mais sugestões |
| Usuário ativo | Mais direto, menos onboarding |
| Power user | Mostrar atalhos, features avançadas |
| Usuário inativo retornando | Recap do que mudou, welcome back |

---

## 📊 Métricas de Voz do Cliente

### KPIs de Satisfação

| Métrica | Meta | Frequência |
|---------|------|------------|
| NPS | > 50 | Trimestral |
| CSAT (suporte) | > 4.5/5 | Por ticket |
| CSAT (onboarding) | > 4.0/5 | Pós-onboarding |
| Feature satisfaction | > 4.0/5 | Por feature |

### Coleta de Feedback

| Momento | Método | Pergunta |
|---------|--------|----------|
| Pós-onboarding | In-app survey | "Como foi sua experiência inicial? (1-5)" |
| Primeira semana | Email | "O que você mais gostou até agora?" |
| Mensal | In-app NPS | "Recomendaria o Onion? (0-10)" |
| Pós-suporte | Email | "Resolvemos seu problema? (1-5)" |
| Churn | Exit survey | "Por que está saindo?" |

---

## 🔄 Atualização Contínua

Este documento deve ser atualizado:
- ✅ Mensalmente com novos padrões de feedback
- ✅ Após cada pesquisa de NPS
- ✅ Quando nova feature é lançada
- ✅ Quando padrões de suporte mudam

---

**Próximo documento:** [Product Strategy](PRODUCT_STRATEGY.md)

