

## Plano: Adicionar Setas de Navegação no Onboarding

### Problema
O onboarding atual só permite avançar pelo botão "Próximo" inferior. O usuário não consegue voltar para telas anteriores.

### Solução
Adicionar dois botões de seta laterais para navegação intuitiva.

---

### Alterações em `src/components/onboarding/OnboardingModal.tsx`

#### 1. Adicionar imports (linha 4)
- Incluir `ChevronLeft` e `ChevronRight` do lucide-react

#### 2. Adicionar estado `canScrollPrev` (linha 70)
- Novo estado para controlar visibilidade da seta esquerda

#### 3. Adicionar função `scrollPrev` (após linha 74)
- Função para voltar ao slide anterior

#### 4. Atualizar função `onSelect` (linhas 76-80)
- Incluir atualização do `canScrollPrev`

#### 5. Adicionar botões de seta laterais (após linha 122)
- Seta esquerda: visível a partir da tela 2
- Seta direita: visível até a tela 2
- Design: círculos glassmorphism (bg-white/10, backdrop-blur)
- Posição: centro vertical da tela, nas laterais

---

### Layout Visual

```text
+------------------------------------------+
|     [  o  ]  [  o  ]  [  o  ]            |
+------------------------------------------+
|                                          |
|  [<]                                [>]  |
|  seta     [ICONE/CONTEUDO]         seta  |
|  voltar                           avançar|
|                                          |
|         [ Próximo / Começar ]            |
+------------------------------------------+
```

---

### Comportamento

| Tela | Seta Esquerda | Seta Direita |
|------|---------------|--------------|
| 1 - Welcome | Oculta | Visível |
| 2 - Como usar | Visível | Visível |
| 3 - SOPH | Visível | Oculta |

---

### Estilo das Setas

- Tamanho: 48x48px
- Background: bg-white/10 com hover bg-white/20
- Borda: border-white/20
- Backdrop blur para efeito premium
- Ícone branco 24x24px

