

## Plano: Substituir Ícone por Logo "25" no Onboarding

### Objetivo
Substituir o ícone `Building2` na primeira tela do onboarding pela logo "25" do app, ocupando 100% do espaço circular.

---

### Arquivo a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/onboarding/OnboardingModal.tsx` | Importar logo e substituir ícone |

---

### Alterações Detalhadas

#### 1. Adicionar import da logo (linha 6)
```tsx
import logo25Icon from '@/assets/logo-25-icon.png';
```

#### 2. Substituir ícone na Tela 1 (linhas 184-186)

**Antes:**
```tsx
<div className="mb-4 md:mb-6 inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-cyan-500/10 border border-cyan-500/30">
  <Building2 className="w-8 h-8 md:w-12 md:h-12 text-cyan-400" />
</div>
```

**Depois:**
```tsx
<div className="mb-4 md:mb-6 inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
  <img 
    src={logo25Icon} 
    alt="App Importadoras 25" 
    className="w-full h-full object-cover"
  />
</div>
```

---

### Detalhes Técnicos

| Propriedade | Valor |
|-------------|-------|
| Tamanho mobile | w-20 h-20 (80px) |
| Tamanho desktop | md:w-28 md:h-28 (112px) |
| Object-fit | `object-cover` para preencher 100% |
| Borda | `border-2 border-cyan-400/40` |
| Sombra | Glow cyan sutil |
| Overflow | `hidden` para cortar cantos |

---

### Resultado Visual

```text
+------------------------------------------+
|     [<]  [  o  ] [  o  ] [  o  ]  [>]    |
+------------------------------------------+
|                                          |
|              +----------+                |
|              |    25    |  <- Logo       |
|              |          |     100%       |
|              +----------+     círculo    |
|                                          |
|      Bem-vindo ao App Importadoras       |
|                                          |
|         [ Próximo ]                      |
+------------------------------------------+
```

---

### Resumo

1. Importar `logo-25-icon.png` de `src/assets/`
2. Substituir `<Building2>` por `<img>` com a logo
3. Ajustar container para `overflow-hidden` e tamanho maior
4. Aplicar `object-cover` para preencher 100% do círculo

