# ⚙️ Regras e Configurações - Sistema Onion

> **Versão**: 3.0.0 | **Última atualização**: 2025-12-16

Documentação completa das regras e configurações do workspace do Sistema Onion.

## 📑 Índice

- [Idiomas e Documentação](#idiomas-e-documentação)
- [Padrões de Nomenclatura](#padrões-de-nomenclatura)
- [Validações](#validações)
- [NX Rules](#nx-rules)
- [Formatação ClickUp](#formatação-clickup)

---

## Idiomas e Documentação

### Regras Fundamentais

#### ✅ SEMPRE em Inglês (en-US)
- **Nomes de variáveis, funções, classes e interfaces**
- **Nomes de arquivos e diretórios**
- **Commits no Git**
- **Nomes de branches**
- **Documentação técnica de API**

#### ✅ SEMPRE em Português (pt-BR)
- **Comentários no código**
- **Respostas e explicações do assistente IA**
- **Documentação de processos e workflows**
- **READMEs e guias de uso** (exceto código e comandos)
- **Mensagens de erro personalizadas**
- **Logs de aplicação**

### Exemplos

**Código (Inglês):**
```typescript
interface UserProfile {
  userName: string;
  createdAt: Date;
}

function getUserProfile(userId: string): Promise<UserProfile | null> {
  // ...
}
```

**Comentários (Português):**
```typescript
/**
 * Busca o perfil do usuário no banco de dados
 * @param userId - ID único do usuário
 * @returns Perfil completo ou null se não encontrado
 */
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // Valida se o ID é válido antes de fazer a consulta
  if (!isValidUUID(userId)) {
    return null;
  }
}
```

**Commits (Inglês):**
```bash
git commit -m "feat: add user authentication flow"
git commit -m "fix: resolve auth bug"
```

**Branches (Inglês):**
```bash
feature/user-dashboard
fix/authentication-bug
```

---

## Padrões de Nomenclatura

### Arquivos e Diretórios

```
✅ user-profile.component.tsx
✅ authentication-service.ts
✅ user-profile-card.tsx
❌ perfil-usuario.component.tsx
❌ servico-autenticacao.ts
```

### Estrutura de Projeto

```
projeto/
├── .cursor/              # Sistema Onion
│   ├── commands/         # Comandos Cursor
│   ├── agents/           # Agentes especializados
│   ├── docs/             # Documentação do sistema
│   └── rules/            # Regras do workspace
├── docs/                 # Documentação do projeto
│   ├── onion/            # Docs do Sistema Onion
│   ├── knowbase/         # Knowledge Bases
│   └── meta-specs/       # Meta Especificações
└── src/                  # Código fonte
```

---

## Validações

### Regras de Validação

#### Validação de Agentes
- Headers YAML obrigatórios
- Campos obrigatórios vs opcionais
- Convenções de nomenclatura
- Integração com MCPs

#### Validação de Comandos
- Estrutura obrigatória
- Limite de tamanho (~500 linhas)
- Modularização
- Integração com Task Manager

#### Validação de Integrações
- Gestão de credenciais (.env)
- Fallback quando indisponível
- MCPs suportados
- Agentes agnósticos vs especializados

### Processo de Validação

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    CHANGE       │────▶│  @metaspec-     │────▶│   APPROVED/     │
│    REQUEST      │     │  gate-keeper    │     │   REJECTED      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Proposta de mudança**: Desenvolvedor propõe alteração
2. **Validação**: `@metaspec-gate-keeper` verifica conformidade
3. **Decisão**: Aprovado se conforme, rejeitado com justificativa

---

## NX Rules

### Diretrizes Gerais

- Usar `nx_workspace` primeiro para entender arquitetura
- Usar `nx_docs` para questões de configuração Nx
- Usar `nx_workspace` para erros de configuração
- Usar `nx_visualize_graph` para demonstrar dependências

### Fluxo de Geração

1. Entender workspace com `nx_workspace` e `nx_project_details`
2. Obter generators com `nx_generators`
3. Decidir qual generator usar
4. Obter schema com `nx_generator_schema`
5. Usar `nx_docs` se necessário
6. Abrir UI com `nx_open_generate_ui`
7. Ler log com `nx_read_generator_log`

### CI Error Guidelines

1. Obter lista de CIPEs com `nx_cloud_cipe_details`
2. Usar `nx_cloud_fix_cipe_failure` para logs de falha
3. Usar logs para diagnosticar problema
4. Executar task para validar correção

---

## Formatação ClickUp

### Estratégia Dual

#### 📋 Task Descriptions (markdown_description)
- **USE**: Markdown nativo: `## Headers`, `| Tabelas |`, `**Bold**`, `- Listas`
- **QUANDO**: create_task, update_task descriptions
- **TEMPLATES**: `.cursor/utils/clickup-formatting.md` - seção DESCRIPTIONS

#### 💬 Task Comments (commentText)
- **USE**: Formatação visual Unicode: `━━━`, `∟`, `▶`, `◆`, `✅`
- **QUANDO**: create_task_comment, progress updates, PR comments
- **TEMPLATES**: `.cursor/utils/clickup-formatting.md` - seção COMMENTS
- **OBRIGATÓRIO**: Timestamp + status em todos os comments
- **ESTRUTURA**: Header + separador + conteúdo + footer

### Exemplo de Formatação

**Description (Markdown):**
```markdown
## Objetivo
Implementar sistema de autenticação OAuth2.

## Critérios de Aceitação
- [ ] Login com Google
- [ ] Login com GitHub
- [ ] Refresh token automático

## Tabela de Estimativas
| Tarefa | Estimativa |
|--------|------------|
| Setup OAuth2 | 3 pontos |
| Integração Google | 5 pontos |
```

**Comment (Unicode):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PROGRESS UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 2025-12-16 14:30

▶ Status: In Progress
∟ Fase atual: Setup OAuth2
∟ Progresso: 60%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Gestão de Configurações

### Variáveis de Ambiente (.env)

**Regras:**
- **NUNCA** commitar `.env` com valores sensíveis
- **SEMPRE** manter `.env.example` atualizado
- Usar prefixos para organização: `CLICKUP_`, `GITHUB_`, `DB_`

**Exemplo:**
```bash
# ✅ CORRETO - .env.example
CLICKUP_API_TOKEN=your_token_here
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# ❌ INCORRETO - Nunca no repositório
CLICKUP_API_TOKEN=pk_12345_secret
```

### Integrações Opcionais

- Comandos e agentes devem funcionar sem integrações quando possível
- Se integração não configurada: perguntar ao usuário ou abortar com mensagem clara
- Documentar variáveis necessárias no header do comando/agente

---

## Knowledge Bases

As Knowledge Bases do projeto estão em `docs/knowbase/`:

| KB | Propósito |
|----|-----|
| `cursor-commands-best-practices-2025.md` | Padrões de comandos Cursor |
| `spec-as-code-strategy.md` | Estratégia de especificações |
| `ai-agent-design-patterns.md` | Padrões de design de agentes |
| `context-window-optimization.md` | Otimização de contexto |
| `configuration-management.md` | Gestão de configurações |

---

## Checklist de Conformidade

Antes de finalizar qualquer tarefa, verificar:

- [ ] Todo código (variáveis, funções, classes) está em inglês
- [ ] Todos os comentários estão em português (pt-BR)
- [ ] Commits seguem padrão conventional em inglês
- [ ] Documentação foi atualizada quando necessário
- [ ] Sintaxe oficial das bibliotecas foi respeitada
- [ ] Próximo passo foi proposto ao usuário
- [ ] Comando de continuação foi sugerido

---

## 🔗 Recursos Relacionados

- [Regras Completas](../../.cursor/rules/)
- [Comandos .cursor/](./commands.md)
- [Agentes Especializados](./agents.md)
- [Ferramentas MCP](./mcps.md)

---

**Última atualização**: 2025-12-16  
**Versão**: 3.0.0  
**Mantido por**: Sistema Onion

