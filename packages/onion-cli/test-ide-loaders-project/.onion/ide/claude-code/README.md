# Claude Code IDE Integration

Este diretório contém o adapter Python que conecta o Sistema Onion ao Claude Code IDE.

## Arquivos

- `onion-adapter.py` - Adapter Python que descobre recursos Onion
- `claude.config.json` - Configuração gerada automaticamente (na raiz do projeto)
- `CLAUDE.md` - Instruções para Claude Code (na raiz do projeto)

## Como Funciona

1. O adapter descobre todos os recursos Onion (comandos, agentes, contextos)
2. Gera `claude.config.json` na raiz do projeto
3. Gera `CLAUDE.md` com instruções para Claude Code
4. Claude Code lê os arquivos e disponibiliza comandos/agentes

## Pré-requisitos

- Python 3.7+
- PyYAML (opcional, mas recomendado): `pip install pyyaml`

## Uso

### Gerar Config Manualmente

```bash
# Executar adapter diretamente
python3 .onion/ide/claude/onion-adapter.py

# Ou especificar raiz do projeto
python3 .onion/ide/claude/onion-adapter.py /path/to/project
```

### Auto-geração

O config é gerado automaticamente quando você executa:
- `onion init` - Inicialização do projeto
- `onion add claude-code` - Adicionar suporte Claude Code

## Estrutura do Config

```json
{
  "onion": {
    "version": "4.0.0-beta.1",
    "contexts": ["business", "technical"],
    "commands": [...],
    "agents": [...]
  },
  "commands": [
    {
      "name": "business/spec",
      "path": ".onion/contexts/business/commands/starter/spec.md",
      "metadata": {
        "context": "business",
        "level": "starter"
      }
    }
  ],
  "agents": [...]
}
```

## Integração com MCP (Model Context Protocol)

O adapter pode ser usado com MCP para expor comandos Onion via protocolo MCP.

### Exemplo de Uso MCP

```python
from .onion.ide.claude.onion_adapter import get_adapter

adapter = get_adapter()
resources = adapter.discover()

# Expor via MCP
# (implementação específica depende do servidor MCP)
```

## Troubleshooting

### Erro: PyYAML not installed

Instale PyYAML:
```bash
pip install pyyaml
```

O adapter funciona sem PyYAML, mas com funcionalidade limitada.

### Config não é gerado

Verifique se `.onion-config.yml` existe na raiz do projeto.

### Comandos não aparecem no Claude Code

1. Verifique se `claude.config.json` existe na raiz
2. Verifique se `CLAUDE.md` existe na raiz
3. Reinicie o Claude Code
4. Verifique logs do Claude Code para erros

## Documentação

Para mais informações, consulte:
- [Arquitetura IDE Loaders](../../../docs/onion/ide-loaders-architecture.md)
- [Sistema Onion v4](../../../docs/onion/README.md)
- [Claude Code Documentation](https://claude.ai/docs)
