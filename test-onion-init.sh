#!/bin/bash
# Script para executar onion init automaticamente

cd ~/openspec

# Limpar
rm -rf .cursor .onion .onion-config.yml docs/

# Executar onion init com respostas automáticas
# Responde: Monorepo → Business,Technical → Cursor → None,None
expect << 'EOF'
set timeout 30
spawn onion init

# Step 1: Project Type
expect "Select project type:"
send "\r"

# Step 2: Contexts
expect "Select contexts:"
send "\r"

# Step 3: IDEs
expect "Select additional IDEs:"
send "\r"

# Step 4: Task Manager
expect "Task Manager"
send "\033\[B\033\[B\033\[B\033\[B\r"

# Step 4: Transcription
expect "Transcription"
send "\033\[B\033\[B\033\[B\r"

expect eof
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ GERAÇÃO CONCLUÍDA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Estrutura .cursor/ criada:"
tree -L 3 .cursor/
echo ""
echo "📋 Comandos disponíveis:"
ls -la .cursor/commands/business/
ls -la .cursor/commands/technical/

