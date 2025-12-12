# 🔧 Troubleshooting Guide - Onion App

> **Última atualização**: 2025-12-12 | **Versão**: 1.0.0

---

## 🐛 Common Development Issues

### Database Connection Issues

**Sintoma:** `Can't reach database server`

**Soluções:**
```bash
# 1. Verificar Docker está rodando
docker ps

# 2. Verificar PostgreSQL está up
docker-compose ps postgres

# 3. Verificar DATABASE_URL no .env
echo $DATABASE_URL

# 4. Testar conexão
docker exec -it onion-postgres psql -U user -d onion -c "SELECT 1;"

# 5. Reiniciar se necessário
docker-compose restart postgres
```

**Causas comuns:**
- Docker não está rodando
- Porta 5432 já em uso
- Credenciais incorretas no `.env`

---

### Prisma Migration Issues

**Sintoma:** `Migration failed` ou `Schema drift detected`

**Soluções:**
```bash
# 1. Verificar estado do banco
nx run database:migrate:status

# 2. Reset database (DEV ONLY)
nx run database:migrate:reset

# 3. Criar migration manualmente
nx run database:migrate:dev --create-only

# 4. Editar migration se necessário
# libs/database/prisma/migrations/XXX_xxx/migration.sql

# 5. Aplicar migration
nx run database:migrate:dev
```

**Causas comuns:**
- Schema.prisma desatualizado
- Migrations fora de ordem
- Banco de dados fora de sync

---

### Multi-tenancy Data Leak

**Sintoma:** Query retorna dados de outro tenant

**Diagnóstico:**
```typescript
// Verificar se tenant context está setado
const result = await prisma.$queryRaw`
  SELECT current_setting('app.current_tenant', true);
`;
console.log('Current tenant:', result);
```

**Soluções:**
1. Verificar auth plugin está aplicando tenant
2. Verificar RLS policies estão ativas
3. Verificar Prisma middleware está setando context

**Prevenção:**
- Sempre usar `request.tenantId` (nunca do body)
- Testes de isolamento em CI/CD
- Code review focado em multi-tenancy

---

### TypeScript Errors

**Sintoma:** `Type 'X' is not assignable to type 'Y'`

**Soluções:**
```bash
# 1. Verificar tipos
nx type-check

# 2. Limpar cache
rm -rf .nx node_modules
pnpm install

# 3. Verificar tsconfig
cat tsconfig.base.json

# 4. Regenerar Prisma types
nx run database:generate
```

**Causas comuns:**
- Types desatualizados (Prisma)
- Zod schema não match TypeScript type
- Path mappings incorretos

---

### Fastify Route Not Found

**Sintoma:** `404 Not Found` em rota que deveria existir

**Diagnóstico:**
```typescript
// Verificar rotas registradas
fastify.printRoutes();
```

**Soluções:**
1. Verificar route está registrada em `src/index.ts`
2. Verificar path está correto
3. Verificar método HTTP (GET vs POST)
4. Verificar plugin está carregado

---

## 🌍 Environment-Specific Issues

### Local Development

**Issue:** Services não conseguem se comunicar

**Solução:**
```bash
# Verificar Docker network
docker network ls
docker network inspect onion-app_default

# Verificar serviços estão na mesma network
docker-compose ps
```

**Issue:** Porta já em uso

**Solução:**
```bash
# Encontrar processo usando porta
lsof -i :3000

# Matar processo ou mudar porta no .env
```

### Staging/Production

**Issue:** Migrations falham em produção

**Solução:**
1. Sempre testar migrations em staging primeiro
2. Backup antes de migrations críticas
3. Ter plano de rollback
4. Usar `migrate deploy` (não `migrate dev`)

---

## ⚡ Performance Issues

### Slow API Responses

**Diagnóstico:**
```typescript
// Adicionar timing logs
const start = Date.now();
const result = await someOperation();
fastify.log.info({ duration: Date.now() - start }, 'Operation completed');
```

**Soluções:**
1. Verificar N+1 queries
2. Adicionar índices no Prisma schema
3. Implementar caching (Redis)
4. Otimizar queries complexas

### Slow AI Responses

**Soluções:**
1. Implementar streaming
2. Cache de respostas similares
3. Otimizar prompts (menor contexto quando possível)
4. Usar modelos mais rápidos para casos simples

---

## 🔌 Integration Issues

### Logto Authentication Fails

**Sintoma:** `401 Unauthorized` mesmo com token válido

**Soluções:**
```bash
# 1. Verificar Logto está rodando
curl http://localhost:3001/api/.well-known/openid-configuration

# 2. Verificar APP_ID e APP_SECRET
echo $LOGTO_APP_ID
echo $LOGTO_APP_SECRET

# 3. Verificar token
# Decodificar JWT em jwt.io

# 4. Verificar token não expirou
```

### Qdrant Connection Issues

**Sintoma:** `Can't connect to Qdrant`

**Soluções:**
```bash
# 1. Verificar Qdrant está rodando
curl http://localhost:6333/health

# 2. Verificar QDRANT_URL no .env
echo $QDRANT_URL

# 3. Reiniciar Qdrant
docker-compose restart qdrant
```

### MinIO Storage Issues

**Sintoma:** `File upload fails`

**Soluções:**
```bash
# 1. Verificar MinIO está rodando
curl http://localhost:9000/minio/health/live

# 2. Verificar credenciais
echo $MINIO_ACCESS_KEY
echo $MINIO_SECRET_KEY

# 3. Verificar bucket existe
# Acessar MinIO console: http://localhost:9001
```

---

## 🚨 Emergency Procedures

### Database Corruption

**Sintoma:** Queries retornam dados inconsistentes

**Procedimento:**
1. **STOP** todas as escritas
2. Backup imediato
3. Investigar causa
4. Restaurar backup se necessário
5. Aplicar fix
6. Validar integridade

### Security Incident

**Sintoma:** Suspeita de vazamento de dados

**Procedimento:**
1. **STOP** sistema imediatamente
2. Isolar ambiente afetado
3. Notificar equipe de segurança
4. Investigar logs
5. Identificar causa
6. Aplicar fix
7. Notificar afetados (se necessário)
8. Documentar incidente

### Performance Degradation

**Sintoma:** Sistema muito lento ou indisponível

**Procedimento:**
1. Verificar métricas (CPU, memória, DB)
2. Identificar gargalo
3. Escalar recursos se necessário
4. Aplicar hotfix
5. Investigar causa raiz
6. Implementar fix permanente

---

## 📊 Debugging Tools

### Backend

**Logs:**
```bash
# Ver logs do API
nx serve api | tee api.log

# Filtrar por tenant
grep "tenant-id" api.log

# Filtrar erros
grep "ERROR" api.log
```

**Database:**
```bash
# Prisma Studio (GUI)
nx run database:studio

# Query direto
docker exec -it onion-postgres psql -U user -d onion
```

### Frontend

**React DevTools:**
- Instalar extensão
- Inspect components
- Ver state e props

**Next.js Debug:**
```bash
# Node.js debugger
NODE_OPTIONS='--inspect' nx serve web

# Conectar Chrome DevTools
chrome://inspect
```

---

## 🔍 Common Error Messages

### `P2002: Unique constraint failed`

**Causa:** Tentando criar registro com valor único duplicado

**Solução:** Verificar se registro já existe antes de criar

### `P2025: Record not found`

**Causa:** Tentando atualizar/deletar registro inexistente

**Solução:** Verificar registro existe antes de operação

### `RLS policy violation`

**Causa:** Query tentando acessar dados de outro tenant

**Solução:** Verificar `app.current_tenant` está setado

### `Zod validation error`

**Causa:** Input não passa validação Zod

**Solução:** Verificar schema e input, ajustar conforme necessário

---

## 📞 Getting Help

### Internal Resources

1. **Documentação:** `docs/technical-context/`
2. **ADRs:** `docs/technical-context/adr/`
3. **Code Examples:** `CURSOR.meta.md`

### External Resources

- [Fastify Discord](https://discord.gg/fastify)
- [Prisma Discord](https://pris.ly/discord)
- [Next.js Discord](https://nextjs.org/discord)

---

## 🔄 Maintenance Tasks

### Weekly

- [ ] Verificar logs de erros
- [ ] Review métricas de performance
- [ ] Verificar dependências desatualizadas

### Monthly

- [ ] Security audit
- [ ] Performance optimization
- [ ] Database maintenance (vacuum, analyze)

### Quarterly

- [ ] Dependency updates
- [ ] Architecture review
- [ ] Documentation update

---

**Referências:**
- [Contributing Guide](CONTRIBUTING.md)
- [API Specification](API_SPECIFICATION.md)

---

**Documentação técnica completa!** 🎉

