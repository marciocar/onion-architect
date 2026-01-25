# 🧅 Onion System v4.0 Beta

> **Status**: Beta Release | **Version**: 4.1.0-beta.1 | **Progress**: 71% Complete

**Multi-Context Development Orchestrator** - Transform your development workflow with intelligent context separation and progressive command discovery.

---

## ⚠️ Beta Status Notice

This is a **beta release** focused on:
- ✅ **Documentation** - Complete architectural specs, migration guides, and planning
- ✅ **Structure** - Full `.onion/` multi-context architecture implemented
- ✅ **Migration Scripts** - 91 files successfully migrated from v3 to v4
- ⚠️ **CLI** - Work in Progress (basic functionality, full implementation in beta.2)

**Current Focus**: Gathering feedback on architecture and documentation before finalizing CLI implementation.

---

## 🎯 What's New in v4.0

### Multi-Context Architecture

```
.onion/
├── core/               # Universal commands, agents, knowledge bases
├── contexts/
│   ├── business/       # Product, specs, tasks
│   └── technical/      # Development, PRs, releases
└── ide/                # IDE loaders (Cursor, Windsurf, Claude)
```

### Key Improvements

| Feature | v3.0 | v4.0 Beta | Improvement |
|---------|------|-----------|-------------|
| **Onboarding** | 4-8 hours | 15-30 min/context | **90% faster** ⬇️ |
| **Primary Commands** | 90 mixed | 5 starter + discovery | **80% simpler** ⬇️ |
| **IDE Support** | Cursor only | Cursor + ready for 3+ | **Multi-IDE** ✅ |
| **Context Separation** | ❌ Mixed | ✅ Clear separation | **Organized** ✅ |
| **Setup** | Manual | CLI `onion init` | **Automated** ✅ |

---

## 📚 Documentation

### 📖 Read First

- **[Release Notes](docs/onion/RELEASE-NOTES-v4.0-beta.md)** - What's new in v4.0
- **[Epic Overview](docs/plans/onion-v4-epic.md)** - Complete roadmap (71% done)
- **[Installation Guide](docs/onion/INSTALLATION.md)** - Setup instructions
- **[Migration Plan](docs/plans/onion-v4-migration-plan.md)** - v3→v4 migration

### 🏗️ Architecture

- **[Multi-Context Vision](docs/knowbase/frameworks/onion-multi-context-orchestrator-vision.md)** - Design philosophy
- **[Complete Cycle](docs/knowbase/frameworks/onion-complete-cycle-understanding.md)** - 5-layer system
- **[IDE Integration](docs/knowbase/frameworks/onion-ide-integration-strategy.md)** - Multi-IDE strategy
- **[Level System](docs/onion/levels-system.md)** - Progressive discovery

### 📋 Implementation

- **[FASE 2 Summary](.cursor/sessions/fase-02-migration-commands/SUMMARY.md)** - Migration complete
- **[FASE 3 Summary](.cursor/sessions/fase-03-level-system/SUMMARY.md)** - Levels implemented
- **[FASE 4 Summary](.cursor/sessions/fase-04-cli-enhancements/SUMMARY.md)** - CLI enhanced
- **[FASE 5 Planning](docs/plans/tasks/fase-05-ide-loaders.md)** - Next phase

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0
- Cursor IDE (recommended)
- Existing Onion v3 project OR new project

### Current Usage (v4.0-beta.1)

Since CLI is WIP, you can:

#### Option 1: Explore Structure

```bash
# Clone the repository
git clone https://github.com/your-org/onion-v4.git
cd onion-v4

# Explore the .onion/ structure
ls -la .onion/
cat .onion/contexts/business/README.md
cat .onion/contexts/technical/README.md
```

#### Option 2: Use Cursor Commands (Current Structure)

```bash
# Open in Cursor
cursor .

# Commands are available:
/business/help      # Business context commands
/technical/help     # Technical context commands
/help               # Global help

# Example workflows:
/business/spec "feature-name"
/technical/work
/technical/pr
```

#### Option 3: CLI

```bash
# Clone and install dependencies
git clone https://github.com/your-org/onion-v4.git
cd onion-v4
pnpm install

# Build the CLI
pnpm build

# Link globally for local use
cd packages/onion-cli && pnpm link --global

# Verify installation
onion --version
# Expected: 4.1.0-beta.1

# See available commands
onion --help

# Initialize a new project
onion init
```

**Available Commands:**
- `onion init` - Initialize new Onion project
- `onion add` - Add context or IDE (coming soon)
- `onion migrate` - Migrate from v3 to v4 (coming soon)
- `onion validate` - Validate structure (coming soon)

---

## 📊 Progress

### Completed (71% - 39.5 SP)

- ✅ **FASE 1**: CLI Base & Structure (8 SP)
- ✅ **FASE 2**: Migration of 91 files (21 SP)
- ✅ **FASE 3**: Level System (8 SP)
- ✅ **FASE 4**: CLI Enhancements (2.5 SP)

### In Progress

- 🚧 **FASE 5**: IDE Loaders (8 SP) - Next
- 📋 **FASE 6-9**: Abstractions, Docs (8 SP) - Planned

---

## 🎓 Key Concepts

### Multi-Context Development

Separate concerns by context:

- **Business Context**: Product specs, features, tasks, story points
- **Technical Context**: Development, architecture, PRs, releases
- **Customer Success**: Support docs, onboarding (future)
- **Compliance**: Audit, security, legal (future)

### Progressive Discovery

Instead of learning 90 commands:

1. **Start with 5 starter commands** (80% of needs)
2. **Discover intermediate** as you need them
3. **Access advanced** for complex cases

### Level System

- 🟢 **Starter** (80% use cases): `/business/spec`, `/technical/work`
- 🟡 **Intermediate** (15% use cases): `/business/refine`, `/technical/docs`
- 🔴 **Advanced** (5% use cases): `/technical/release-start`, `/business/analyze-pain-price`

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas for Contribution

- 📝 **Documentation**: Improve guides, add examples
- 🐛 **Bug Reports**: Test and report issues
- 💡 **Feature Ideas**: Suggest improvements
- 🔧 **CLI Implementation**: Help complete CLI commands
- 🧪 **Testing**: Add E2E tests

---

## 🐛 Known Issues (Beta)

1. **CLI Commands**: `add`, `migrate`, `validate` implementation in progress
2. **IDE Support**: Only Cursor fully supported (Windsurf/Claude in FASE 5)
3. **Contexts**: Only Business/Technical implemented (others in FASE 6+)
4. **Tests**: Missing E2E integration tests

See [GitHub Issues](#) for complete list.

---

## 📅 Roadmap

### v4.0.0-beta.2 (Est. 1-2 weeks)

- ✅ CLI migrated to TypeScript with pnpm workspaces
- Complete `add`, `migrate`, `validate` commands
- Add E2E tests

### v4.0.0-beta.3 (Est. 3-4 weeks)

- Windsurf IDE loader
- Claude Code loader
- Multi-IDE testing

### v4.0.0 (Est. 6-8 weeks)

- All 9 phases complete
- Full documentation
- npm package published
- Production ready

---

## 📞 Support & Feedback

### Report Issues

- **GitHub Issues**: [link](#)
- **Include**: OS, Node version, command executed, error message

### Get Help

- **GitHub Discussions**: [link](#)
- **Discord**: Coming soon
- **Email**: suporte@onion-system.dev (coming soon)

### Share Feedback

As a **beta release**, your feedback is crucial:
- What works well?
- What's confusing?
- What's missing?
- How can we improve?

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

This release represents:
- 🕐 ~23 hours of development
- 📊 39.5 story points delivered
- 📁 91 files migrated
- 📝 2500+ lines of documentation
- 🧪 45+ unit tests
- 🏗️ Zero unnecessary coupling

**Thank you** to all contributors and beta testers! 🚀

---

## 🛠️ Development

This is a **pnpm workspace** monorepo with TypeScript.

### Workspace Commands

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Run CLI in dev mode (watch)
pnpm dev

# Type check
pnpm --filter @onion/cli typecheck

# Lint
pnpm --filter @onion/cli lint
```

### Project Structure

```
onion-architect/
├── package.json              # Workspace root
├── pnpm-workspace.yaml       # Workspace config
├── tsconfig.base.json        # Shared TypeScript config
└── packages/
    └── onion-cli/            # CLI package (@onion/cli)
        ├── src/              # TypeScript source
        ├── dist/             # Compiled output
        └── bin/onion.js      # CLI entry point
```

---

## 🔗 Links

- **Documentation**: [docs/](docs/)
- **Knowledge Base**: [docs/knowbase/](docs/knowbase/)
- **Planning**: [docs/plans/](docs/plans/)
- **Sessions**: [.cursor/sessions/](.cursor/sessions/)
- **CLI Package**: [packages/onion-cli/](packages/onion-cli/)

---

**🧅 Onion v4: Orchestrating contexts, simplifying development** 🚀

---

**Last Updated**: 2026-01-25  
**Version**: 4.1.0-beta.1  
**Status**: Beta - TypeScript CLI with pnpm workspaces
