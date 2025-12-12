# 📚 Knowledge Management - Feature Catalog

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0 | **Status**: V1 Core

---

## 🎯 Purpose

Permitir que usuários organizem, armazenem e acessem seu conhecimento de forma estruturada, usando a metodologia Onion de bases de conhecimento (knowbases).

---

## 👤 User Benefit

| Benefício | Descrição |
|-----------|-----------|
| **Memória persistente** | Seu conhecimento nunca mais se perde |
| **Acesso instantâneo** | Perguntas respondidas em segundos |
| **Organização automática** | IA estrutura o conteúdo |
| **Portabilidade** | Tudo exportável em .md |

---

## 🔧 Core Features

### 1. Knowbase Creation

**Descrição:** Criar bases de conhecimento temáticas

**Funcionalidades:**
- Criar knowbase vazia
- Criar a partir de template
- Criar a partir de upload (PDF, TXT, MD)
- Criar via comando `/meta/create-knowbase`

**UX Flow:**
```
[+ Nova Knowbase] → Nome + Descrição → Criar
                  → Escolher template → Personalizar → Criar
                  → Upload arquivo → Processar → Criar
```

**Limitações por Plano:**
| Plano | Limite |
|-------|--------|
| Free | 3 knowbases |
| Pro | Ilimitado |
| Enterprise | Ilimitado + shared |

---

### 2. Content Management

**Descrição:** Adicionar e gerenciar conteúdo nas knowbases

**Funcionalidades:**
- Adicionar texto livre
- Upload de arquivos (MD, TXT, PDF)
- Importar de URL
- Editar conteúdo existente
- Versionamento automático

**Formatos Suportados:**
| Formato | Status | Processamento |
|---------|--------|---------------|
| Markdown (.md) | ✅ V1 | Nativo |
| Texto (.txt) | ✅ V1 | Nativo |
| PDF | ✅ V1 | Extração de texto |
| URL | ✅ V1 | Web scraping |
| Doc/Docx | 📋 V2 | Conversão |
| Notion | 📋 V2 | API import |

---

### 3. Semantic Search

**Descrição:** Buscar informações nas knowbases usando linguagem natural

**Funcionalidades:**
- Busca por significado (não só palavras-chave)
- Busca cross-knowbase
- Filtros por knowbase
- Highlights nos resultados
- Ranking de relevância

**Tecnologia:**
- Embeddings via OpenAI/local
- Vector DB: Qdrant
- Chunk strategy: Semantic

---

### 4. Knowledge Retrieval

**Descrição:** Fazer perguntas e receber respostas baseadas no conhecimento

**Funcionalidades:**
- Perguntas em linguagem natural
- Respostas contextualizadas
- Citação de fontes
- Nível de confiança
- Sugestões de follow-up

**Exemplo:**
```
Usuário: "O que eu decidi sobre o orçamento de marketing?"

@onion: Baseado na sua knowbase "Planejamento 2025":

💡 Você definiu um orçamento de R$ 50.000/mês para marketing digital,
com foco em:
- 60% para Google Ads
- 30% para conteúdo orgânico
- 10% para influencers

📌 Fonte: "Reunião de planejamento - 15/11/2024"

Quer mais detalhes sobre algum desses pontos?
```

---

## 📊 Usage Patterns

### Casos de Uso Comuns

| Caso | Frequência | Exemplo |
|------|------------|---------|
| PKM pessoal | 🔴 Alta | Notas, aprendizados, referências |
| Documentação de projetos | 🔴 Alta | Decisões, contexto, histórico |
| Base de conhecimento profissional | 🟡 Média | Procedimentos, políticas |
| Pesquisa e estudos | 🟡 Média | Artigos, papers, resumos |
| CRM pessoal | 🟢 Baixa | Contatos, interações |

### Padrões de Adoção

| Métrica | Meta |
|---------|------|
| Knowbases/usuário (30d) | 3+ |
| Items/knowbase | 20+ |
| Perguntas/semana | 10+ |

---

## ⚠️ Common Issues

| Issue | Causa | Solução |
|-------|-------|---------|
| "Resposta imprecisa" | Knowbase mal estruturada | Dicas de estruturação |
| "Não encontrou" | Informação não adicionada | Sugerir adicionar |
| "Demora para processar" | Arquivo grande | Progress indicator |
| "Limite atingido" | Free tier | Upsell para Pro |

---

## 🤖 AI Interaction Guidelines

### Como @onion deve falar sobre Knowbases

**Linguagem:**
- "Sua base de conhecimento" ou "sua knowbase"
- "Seu conhecimento sobre [tema]"
- Nunca: "vector database", "embeddings", "chunks"

**Sugestões proativas:**
- "Vi que você mencionou [tema]. Quer adicionar à sua knowbase?"
- "Baseado no que você perguntou, talvez queira organizar isso em uma knowbase própria."

---

## 📈 Success Metrics

| Métrica | Descrição | Meta |
|---------|-----------|------|
| Activation | % usuários com 1+ knowbase | 70% |
| Engagement | Perguntas/usuário/semana | 10+ |
| Quality | % respostas úteis (feedback) | 80%+ |
| Retention | D30 de usuários com knowbases ativas | 30% |

---

## 🔮 Roadmap

| Feature | Versão | Descrição |
|---------|--------|-----------|
| Knowbase sharing | V2 | Compartilhar com time |
| Collaborative editing | V2 | Edição simultânea |
| Notion import | V2 | Importar de Notion |
| Knowledge graph | V3 | Visualização de conexões |
| Auto-categorization | V3 | IA organiza automaticamente |

---

**Documentação relacionada:**
- [Agent Management](agent-management.md)
- [Command Workflows](command-workflows.md)

