# ADR-008: Design System Universal

**Status:** ✅ Aprovado  
**Data:** 2025-12-12  
**Decisores:** Tech Lead, Design Lead, Frontend Team

---

## Context

Precisamos de um design system que funcione tanto para web (Next.js) quanto mobile (React Native), garantindo consistência visual e compartilhamento de código.

**Requisitos:**
- Componentes funcionam em web e mobile
- Tokens de design compartilhados
- Temas (light/dark)
- TypeScript support
- Fácil manutenção

**Alternativas consideradas:**
1. Design system custom (web + mobile variants)
2. Tamagui (universal)
3. NativeBase
4. Gluestack UI

---

## Decision

Adotar **Design System custom** usando **Tamagui** como base para componentes universais, com variants específicos para web e mobile quando necessário.

**Estratégia:**
- Tokens compartilhados (cores, espaçamento, tipografia)
- Componentes base em Tamagui (universal)
- Variants específicos quando necessário (web.tsx, mobile.tsx)
- Temas compartilhados

---

## Rationale

### Por que Tamagui?

1. **Universal Components**
   - Mesmo componente funciona em web e mobile
   - Compilação otimizada para cada plataforma
   - Performance excelente

2. **Design Tokens**
   - Sistema de tokens robusto
   - Temas nativos
   - Type-safe

3. **Developer Experience**
   - TypeScript first
   - Hot reload
   - Documentação excelente

4. **Performance**
   - Compilação otimizada
   - Bundle size pequeno
   - Runtime eficiente

### Por que não apenas custom?

- ✅ Controle total
- ❌ Muito trabalho para criar tudo
- ❌ Manutenção complexa
- **Decisão:** Tamagui acelera desenvolvimento

### Por que não NativeBase/Gluestack?

- ✅ Componentes prontos
- ❌ Menos flexibilidade
- ❌ Bundle size maior
- **Decisão:** Tamagui mais flexível

---

## Consequences

### Positivas ✅

- **Consistency:** Mesmo visual em web e mobile
- **Code Sharing:** Tokens e lógica compartilhados
- **DX:** Componentes universais, menos duplicação
- **Performance:** Tamagui otimizado
- **Maintainability:** Um design system, múltiplas plataformas

### Negativas ⚠️

- **Learning Curve:** Tamagui tem conceitos próprios
- **Limitations:** Alguns componentes podem precisar variants específicos
- **Bundle Size:** Adiciona ao bundle (mas otimizado)

### Mitigações

- Documentação completa
- Exemplos práticos
- Code review focado em design system

---

## Implementation Details

### Estrutura

```
libs/design-system/
├── src/
│   ├── tokens/
│   │   ├── colors.ts          # Cores compartilhadas
│   │   ├── spacing.ts          # Espaçamento
│   │   ├── typography.ts      # Tipografia
│   │   └── index.ts
│   │
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx     # Universal (Tamagui)
│   │   │   └── Button.stories.tsx
│   │   ├── Input/
│   │   │   ├── Input.tsx      # Universal
│   │   │   └── Input.stories.tsx
│   │   └── ...
│   │
│   ├── themes/
│   │   ├── light.ts
│   │   ├── dark.ts
│   │   └── index.ts
│   │
│   └── hooks/
│       └── useTheme.ts
│
└── project.json
```

### Tokens Compartilhados

```typescript
// libs/design-system/src/tokens/colors.ts
export const colors = {
  primary: {
    50: '#f0f9ff',
    500: '#8b5cf6', // Onion purple
    900: '#581c87',
  },
  // ... outras cores
};

// Compartilhado entre web e mobile
```

### Componente Universal

```typescript
// libs/design-system/src/components/Button/Button.tsx
import { Button as TamaguiButton } from '@tamagui/core';

export const Button = TamaguiButton.styleable((props, ref) => {
  return (
    <TamaguiButton
      ref={ref}
      backgroundColor="$primary500"
      color="white"
      {...props}
    />
  );
});
```

### Variants Quando Necessário

```typescript
// Se precisar de comportamento específico por plataforma
// libs/design-system/src/components/Button/Button.web.tsx
export const ButtonWeb = (props) => {
  // Comportamento específico web
};

// libs/design-system/src/components/Button/Button.mobile.tsx
export const ButtonMobile = (props) => {
  // Comportamento específico mobile
};
```

---

## Design Principles

1. **Mobile-First**
   - Design pensado primeiro para mobile
   - Web adapta do mobile
   - Touch-friendly por padrão

2. **Simplicidade**
   - Componentes simples e focados
   - Menos é mais
   - Fácil de usar

3. **Consistência**
   - Mesmos tokens em todas plataformas
   - Comportamento previsível
   - Visual coeso

---

## References

- [Tamagui Documentation](https://tamagui.dev/)
- [Design Tokens](https://design-tokens.github.io/community-group/format/)

---

**Todos os ADRs concluídos!**

