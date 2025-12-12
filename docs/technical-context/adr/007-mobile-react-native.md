# ADR-007: Mobile com React Native no Monorepo

**Status:** ✅ Aprovado  
**Data:** 2025-12-12  
**Decisores:** Tech Lead, Mobile Team

---

## Context

O Onion App precisa de aplicativo mobile (iOS + Android) desde V1, aproveitando o monorepo para compartilhar código com web.

**Requisitos:**
- iOS e Android nativos
- Compartilhamento de código com web
- Design system compartilhado
- Mesma API backend
- TypeScript support
- Hot reload em desenvolvimento

**Alternativas consideradas:**
1. React Native (Expo)
2. React Native (Bare)
3. Flutter
4. Native (Swift + Kotlin)

---

## Decision

Adotar **React Native com Expo** para o app mobile, integrado ao monorepo NX.

**Justificativa:**
- Compartilha código TypeScript com web
- Design system pode ser adaptado para mobile
- Expo facilita desenvolvimento e deploy
- NX suporta React Native
- Mesma linguagem (TypeScript) em todo stack

---

## Rationale

### Por que React Native + Expo?

1. **Compartilhamento de Código**
   - TypeScript compartilhado
   - Schemas Zod compartilhados
   - Lógica de negócio compartilhada
   - Design tokens compartilhados

2. **Developer Experience**
   - Hot reload rápido
   - Expo Go para testes rápidos
   - TypeScript nativo
   - Debugging fácil

3. **Monorepo Integration**
   - NX suporta React Native
   - Mesma estrutura de libs
   - Builds coordenados
   - Testes unificados

4. **Design System**
   - Componentes podem ser adaptados
   - Tokens compartilhados (cores, espaçamento)
   - Temas compartilhados

5. **Ecosystem**
   - Comunidade grande
   - Bibliotecas maduras
   - Suporte oficial

### Por que não Flutter?

- ✅ Performance excelente
- ❌ Dart (nova linguagem para aprender)
- ❌ Não compartilha código com web
- ❌ Design system precisa ser reescrito
- **Decisão:** React Native melhor para nosso caso

### Por que não Native (Swift + Kotlin)?

- ✅ Performance máxima
- ❌ Duplicação de código (2 codebases)
- ❌ Manutenção mais complexa
- ❌ Time-to-market maior
- **Decisão:** Overhead muito alto

---

## Consequences

### Positivas ✅

- **Code Sharing:** Lógica compartilhada entre web e mobile
- **DX:** Hot reload, TypeScript, debugging fácil
- **Time-to-market:** Desenvolvimento mais rápido
- **Manutenção:** Um codebase, menos duplicação
- **Design System:** Tokens e componentes compartilhados

### Negativas ⚠️

- **Performance:** Ligeiramente inferior a native
- **Native Features:** Algumas features podem precisar de native modules
- **Bundle Size:** App pode ser maior que native puro

### Mitigações

- Otimizar bundle size
- Usar native modules quando necessário
- Performance testing desde início

---

## Implementation Details

### NX Setup

```bash
# Criar app React Native no monorepo
nx generate @nx/react-native:application mobile
```

### Estrutura

```
apps/mobile/
├── src/
│   ├── screens/          # Mobile screens
│   ├── components/       # Mobile-specific components
│   ├── navigation/       # Navigation setup
│   └── lib/              # Utilities
├── app.json              # Expo config
├── ios/                  # iOS native (gerado)
├── android/              # Android native (gerado)
└── project.json          # NX config
```

### Design System Sharing

```typescript
// libs/design-system/src/components/Button/Button.mobile.tsx
import { Button as RNButton } from 'react-native';

export const Button = ({ children, variant, ...props }) => {
  const styles = useButtonStyles(variant); // Tokens compartilhados
  return <RNButton style={styles} {...props}>{children}</RNButton>;
};

// libs/design-system/src/components/Button/Button.web.tsx
export const Button = ({ children, variant, ...props }) => {
  const styles = useButtonStyles(variant); // Mesmos tokens
  return <button className={styles} {...props}>{children}</button>;
};
```

### API Sharing

```typescript
// libs/shared/api/src/client.ts
// Compartilhado entre web e mobile

export const apiClient = {
  chat: async (message: string) => {
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return response.json();
  },
};
```

---

## References

- [NX React Native Plugin](https://nx.dev/nx-api/react-native)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

---

**Próximo ADR:** [ADR-008: Design System](008-design-system.md)

