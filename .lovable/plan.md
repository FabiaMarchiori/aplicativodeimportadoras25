

## Plano: Onboarding de Primeiro Acesso - 3 Telas

### Visao Geral

Criar um onboarding modal/fullscreen de 3 telas exibido apenas no primeiro login do usuario, seguindo o design premium dark-mode existente (gradiente azul petroleo, particulas cyan, glassmorphism).

---

### Arquitetura da Solucao

```text
+------------------+     +---------------------+     +------------------+
|   Home.tsx       | --> | OnboardingModal.tsx | --> | localStorage +   |
|   (trigger)      |     | (3 telas carousel)  |     | Supabase flag    |
+------------------+     +---------------------+     +------------------+
                               |
                               v
                    +---------------------+
                    | Tela 1: O que e     |
                    | Tela 2: Como usar   |
                    | Tela 3: SOPH        |
                    +---------------------+
```

---

### Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/components/onboarding/OnboardingModal.tsx` | Componente principal do onboarding com 3 telas |
| `src/hooks/useOnboarding.ts` | Hook para gerenciar estado do onboarding (localStorage + Supabase sync) |

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Home.tsx` | Importar e renderizar `OnboardingModal` condicionalmente |

---

### Detalhes de Implementacao

#### 1. Hook `useOnboarding.ts`

```text
- Verifica localStorage: 'onboarding_completed_{userId}'
- Sincroniza com Supabase user_metadata (opcional backup)
- Retorna: { showOnboarding, completeOnboarding }
- Funcao completeOnboarding: salva flag e fecha modal
```

#### 2. Componente `OnboardingModal.tsx`

**Estrutura Visual:**
- Modal fullscreen com design premium dark-mode
- Gradiente: `from-[#0a1628] via-[#0d2847] to-[#0a1a2e]`
- Particulas cyan flutuantes (igual Home.tsx)
- Glassmorphism cards

**Navegacao:**
- Indicador de progresso (3 bolinhas)
- Botao "Proximo" / "Concluir"
- Swipe gesture para mobile (usando Embla Carousel existente)

**Tela 1 - O que e o App:**
```text
Icone: Package/Building (lucide)
Titulo: "Bem-vindo ao App Importadoras"
Texto: O App Importadoras reune importadoras reais da 25 de Marco, 
organizadas por categoria, permitindo comprar direto da fonte 
com mais seguranca e menos risco de golpe.
```

**Tela 2 - Como usar:**
```text
Icone: Compass/Search (lucide)
Titulo: "Como usar o App"
Lista visual com icones:
- Search: Buscar fornecedores
- LayoutGrid: Navegar por categorias  
- Heart: Favoritar importadoras
- Phone: Acessar contatos confiaveis
```

**Tela 3 - SOPH:**
```text
Imagem: soph-avatar-transparent.png (ja existe em src/assets)
Titulo: "Conheca a SOPH"
Subtitulo: "Sua socia digital inclusa"
Texto: A SOPH ensina passo a passo como:
- Abrir MEI
- Registrar marca
- Criar logo e site
- Precificar corretamente

Sempre utilizando ferramentas gratuitas!
```

**CTA Final (Tela 3):**
```text
Botao: "Escolha uma categoria e encontre seus primeiros fornecedores"
Acao: Fecha onboarding + Navega para /categorias
```

#### 3. Modificacao em `Home.tsx`

```text
// Importar hook e componente
import { useOnboarding } from "@/hooks/useOnboarding";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

// No componente:
const { showOnboarding, completeOnboarding } = useOnboarding();

// No return, adicionar:
{showOnboarding && (
  <OnboardingModal onComplete={completeOnboarding} />
)}
```

---

### Design das 3 Telas (Mockup Visual)

```text
+------------------------------------------+
|  [    ]  [    ]  [    ]  <- Indicadores  |
+------------------------------------------+
|                                          |
|         [ICONE/IMAGEM GRANDE]            |
|                                          |
|           TITULO PRINCIPAL               |
|                                          |
|     Texto descritivo centralizado        |
|     com informacoes da tela atual        |
|                                          |
|                                          |
|         [ Proximo / Comecar ]            |
|                                          |
+------------------------------------------+
```

---

### Fluxo do Usuario

1. Usuario faz primeiro login
2. E redirecionado para `/home`
3. Hook verifica se `onboarding_completed` existe no localStorage
4. Se NAO existe: exibe OnboardingModal em fullscreen
5. Usuario navega pelas 3 telas
6. Ao clicar no CTA final:
   - Salva flag no localStorage
   - Fecha modal
   - Navega para `/categorias`
7. Proximo acesso: onboarding nao aparece mais

---

### Detalhes Tecnicos

**Dependencias utilizadas (ja instaladas):**
- `embla-carousel-react`: Para swipe entre telas
- `lucide-react`: Icones (Package, Search, LayoutGrid, Heart, Phone, Sparkles)
- `@radix-ui/react-dialog`: Base do modal (opcional, pode ser div fullscreen)

**Persistencia da flag:**
- Primario: `localStorage.setItem('onboarding_completed_' + userId, 'true')`
- Beneficio: Funciona offline e instantaneo

**Animacoes:**
- Entrada: `animate-fade-in` (ja existe em index.css)
- Transicao entre telas: Slide horizontal via Embla
- Botao: `hover:scale-[1.02]` com `transition-all duration-300`

---

### Conteudo das Telas (Texto Final)

**Tela 1:**
> **Bem-vindo ao App Importadoras**
> 
> O App Importadoras reune importadoras reais da 25 de Marco, organizadas por categoria, permitindo comprar direto da fonte com mais seguranca e menos risco de golpe.

**Tela 2:**
> **Como usar o App**
> 
> - Buscar fornecedores pelo nome ou produto
> - Navegar por categorias de interesse
> - Favoritar as melhores importadoras
> - Acessar contatos confiaveis verificados

**Tela 3:**
> **Conheca a SOPH**
> 
> Sua socia digital inclusa que ensina passo a passo como:
> - Abrir MEI
> - Registrar marca
> - Criar logo e site
> - Precificar corretamente
> 
> Sempre utilizando ferramentas gratuitas, ajudando voce a economizar e estruturar o negocio.

**CTA:** "Escolha uma categoria e encontre seus primeiros fornecedores"

---

### Resumo das Alteracoes

| Acao | Arquivo |
|------|---------|
| Criar | `src/hooks/useOnboarding.ts` |
| Criar | `src/components/onboarding/OnboardingModal.tsx` |
| Modificar | `src/pages/Home.tsx` (adicionar import e renderizacao condicional) |

### Resultado Esperado

- Onboarding aparece apenas no primeiro acesso apos login
- 3 telas com design premium consistente com o app
- Sem mencao a garantia, cancelamento ou reembolso
- CTA direciona para categorias
- Flag salva impede reexibicao

