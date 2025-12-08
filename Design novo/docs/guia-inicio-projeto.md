# Guia Completo: Como Começar um Novo Projeto

Este guia passo a passo vai te ajudar a criar um novo projeto usando o **Beauty Smile Design System** do zero.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Escolhendo o Método de Início](#escolhendo-o-método-de-início)
- [Método 1: Usando Templates Prontos (Recomendado)](#método-1-usando-templates-prontos-recomendado)
- [Método 2: Criar Projeto do Zero](#método-2-criar-projeto-do-zero)
- [Escolhendo o Tema](#escolhendo-o-tema)
- [Primeiros Passos](#primeiros-passos)
- [Próximos Passos](#próximos-passos)
- [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18 ou superior
- **npm** ou **yarn** ou **pnpm**
- **Git** (para clonar templates)

Verifique suas versões:

```bash
node --version  # Deve ser >= 18
npm --version
```

---

## Escolhendo o Método de Início

Você tem duas opções principais:

### 🚀 **Método 1: Templates Prontos** (Mais Rápido - Recomendado)
- Projeto completo pré-configurado
- Configuração automática do Tailwind
- Exemplos de páginas incluídos
- **Tempo estimado: 5 minutos**

### 🛠️ **Método 2: Projeto do Zero** (Mais Controle)
- Você configura tudo manualmente
- Mais flexibilidade para personalização
- **Tempo estimado: 15-20 minutos**

---

## Método 1: Usando Templates Prontos (Recomendado)

### Passo 1: Escolher o Template

O Design System oferece 3 templates prontos:

1. **Admin Dashboard** - Para aplicações administrativas (tema Deep Blue)
2. **Public Platform** - Para plataformas públicas (tema Turquoise)
3. **Hybrid** - Combina ambos os temas com roteamento baseado em roles

### Passo 2: Clonar e Copiar o Template

```bash
# 1. Clone o repositório do design system
git clone https://github.com/fercosnt/design-system.git
cd design-system

# 2. Escolha e copie o template que você precisa:

# Para Admin Dashboard (tema Deep Blue)
cp -r templates/admin-dashboard/ ../meu-projeto-admin
cd ../meu-projeto-admin

# OU para Public Platform (tema Turquoise)
cp -r templates/public-platform/ ../meu-projeto-publico
cd ../meu-projeto-publico

# OU para Hybrid (ambos os temas)
cp -r templates/hybrid/ ../meu-projeto-hybrid
cd ../meu-projeto-hybrid
```

### Passo 3: Instalar Dependências

```bash
npm install
```

### Passo 4: Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Seu projeto estará rodando em `http://localhost:5173` 🎉

### Passo 5: Personalizar (Opcional)

**Alterar o Logo:**
- Substitua os arquivos de logo em `src/assets/`
- Ou atualize as props do componente `BeautySmileLogo`

**Alterar Cores do Tema:**
Edite `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#SUA_COR',  // Altere aqui
    // ... resto da escala
  },
}
```

**Alterar Nome do App:**
- Edite o título em `index.html`
- Atualize o nome em `package.json`

---

## Método 2: Criar Projeto do Zero

### Passo 1: Criar Novo Projeto React

```bash
# Criar projeto React com Vite e TypeScript
npx create-vite@latest meu-projeto --template react-ts
cd meu-projeto
```

### Passo 2: Instalar o Design System

```bash
# Instalar o Design System
npm install @beautysmile/design-system

# Instalar dependências peer (necessárias)
npm install react react-dom tailwindcss
```

### Passo 3: Configurar Tailwind CSS

#### 3.1 Instalar Tailwind CSS (se ainda não estiver instalado)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 3.2 Configurar `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Incluir componentes do Design System
    './node_modules/@beautysmile/design-system/**/*.{js,ts,jsx,tsx}',
  ],
  // Estender com tokens do Beauty Smile
  presets: [
    require('@beautysmile/design-system/tailwind.config'),
  ],
  theme: {
    extend: {
      // Suas personalizações aqui (opcional)
    },
  },
  plugins: [],
}

export default config
```

### Passo 4: Importar Estilos Globais

#### 4.1 No arquivo principal (`src/main.tsx` ou `src/index.tsx`):

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Importar estilos do Design System (IMPORTANTE!)
import '@beautysmile/design-system/styles'

// Seus estilos customizados
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

#### 4.2 No arquivo `src/index.css`:

```css
@import 'tailwindcss';

/* Seus estilos customizados aqui */
```

### Passo 5: Usar Componentes

Agora você pode começar a usar os componentes:

```tsx
import { Button, Card } from '@beautysmile/design-system/components'

function App() {
  return (
    <div className="p-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Olá Beauty Smile!
        </h1>
        <Button variant="primary" size="md">
          Começar
        </Button>
      </Card>
    </div>
  )
}

export default App
```

---

## Escolhendo o Tema

O Design System oferece dois temas principais:

### 🎨 Tema Admin (Deep Blue #0A2463)

**Quando usar:**
- Dashboards administrativos
- Ferramentas internas
- Aplicações back-office
- Interfaces para funcionários
- Aplicações com muitos dados

**Características:**
- Profissional e autoritário
- Alto contraste para legibilidade
- Sidebar escura
- Ênfase em funcionalidade

**Exemplo:**

```tsx
function AdminLayout() {
  return (
    <div className="min-h-screen bg-admin-bg">
      <aside className="bg-admin-sidebar text-white">
        {/* Conteúdo da sidebar */}
      </aside>
      <main>
        <Button variant="primary">
          Ação Admin
        </Button>
      </main>
    </div>
  )
}
```

### 🌊 Tema Public (Turquoise #00A8CC)

**Quando usar:**
- Plataformas públicas
- Portais de candidatos/usuários
- Landing pages
- Sites de marketing
- Aplicações voltadas ao cliente

**Características:**
- Moderno e acessível
- Fundos com gradiente
- Efeitos de glass morphism
- Vibrante e energético

**Exemplo:**

```tsx
function PublicLayout() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #35BFAD 0%, #00109E 100%)',
      }}
    >
      <div className="glass p-6 rounded-lg">
        <h1 className="text-white">Bem-vindo</h1>
        <Button variant="accent">
          Começar
        </Button>
      </div>
    </div>
  )
}
```

### 🔀 Aplicação Híbrida

Para aplicações que servem usuários internos e externos:

```tsx
// Roteamento baseado em tema
function App() {
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className={isAdminRoute ? 'theme-admin' : 'theme-public'}>
      <Routes />
    </div>
  )
}
```

---

## Primeiros Passos

### 1. Explorar Componentes Disponíveis

O Design System inclui mais de 26 componentes React:

**Componentes UI:**
- Button, Card, Input, Form, Table
- Alert, Badge, Dialog, Avatar
- E muitos outros...

**Componentes Glass Morphism:**
- Glass, GlassCard, GlassPanel
- GlassButton, GlassNavbar

**Componentes de Assets:**
- BeautySmileLogo
- BackgroundImage
- ImageWithFallback

### 2. Usar Design Tokens

**Via JavaScript/TypeScript:**

```typescript
import {
  colors,
  typography,
  spacing,
  shadows,
  animations,
} from '@beautysmile/design-system/tokens'

// Cores
const primaryColor = colors.primary.DEFAULT // '#0A2463'
const accentColor = colors.accent.DEFAULT // '#00A8CC'

// Tipografia
const h1Styles = typography.headings.h1

// Espaçamento
const padding = spacing[4] // '16px'

// Sombras
const cardShadow = shadows.boxShadow.md
```

**Via CSS Custom Properties:**

```css
.meu-componente {
  color: var(--color-primary);
  background: var(--color-accent);
  font-family: var(--font-heading);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-md);
}
```

**Via Classes Tailwind:**

```tsx
<div className="bg-primary text-white p-4 rounded-md shadow-md">
  <h1 className="font-heading text-2xl font-bold">
    Título
  </h1>
</div>
```

### 3. Usar Templates de Páginas

O Design System inclui 12 templates pré-construídos:

**Templates Admin (7):**
- LoginAdmin
- DashboardAdmin
- CRUD
- ListWithFilters
- DetailView
- Settings
- Profile

**Templates Public (5):**
- LandingPage
- LoginPublic
- DashboardClient
- MultiStepForm
- PublicProfile

**Exemplo de uso:**

```tsx
import { LoginAdmin } from '@beautysmile/design-system/templates'

function LoginPage() {
  return <LoginAdmin onSubmit={handleLogin} />
}
```

### 4. Aplicar Glass Morphism

**Quando usar:**
- ✅ Interfaces do tema público
- ✅ Modais e diálogos overlay
- ✅ Cards sobre fundos com gradiente
- ✅ Elementos de navegação sobre imagens

**Quando evitar:**
- ❌ Interfaces do tema admin
- ❌ Áreas com muito texto
- ❌ Tabelas e grids de dados
- ❌ Inputs de formulário (pode reduzir legibilidade)

**Exemplo:**

```tsx
<div className="glass p-6 rounded-xl backdrop-blur-md">
  <h2 className="text-white">Card Glass</h2>
  <p className="text-white/80">
    Conteúdo com efeito de vidro fosco
  </p>
</div>
```

---

## Próximos Passos

### 📚 Documentação Adicional

- **Storybook Interativo** - [https://beautysmile-design-system.vercel.app](https://beautysmile-design-system.vercel.app)
  - Explore todos os componentes
  - Veja exemplos de uso
  - Teste diferentes variações

- **Guia de Componentes** - [docs/components/README.md](./components/README.md)
  - Referência completa de componentes
  - Props e APIs

- **Princípios de Design** - [docs/design-principles.md](./design-principles.md)
  - Diretrizes de uso
  - Boas práticas
  - Hierarquia tipográfica

- **Guia de Migração** - [docs/migration-guide.md](./migration-guide.md)
  - Para projetos existentes

### 🎯 Recursos Úteis

- **GitHub** - [https://github.com/fercosnt/design-system](https://github.com/fercosnt/design-system)
- **NPM** - [https://www.npmjs.com/package/@beautysmile/design-system](https://www.npmjs.com/package/@beautysmile/design-system)
- **Contribuir** - Veja [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## Troubleshooting

### Problema: Estilos não estão carregando

**Solução:**
1. Certifique-se de importar os estilos globais:
   ```typescript
   import '@beautysmile/design-system/styles'
   ```
2. Verifique se o arquivo está no ponto de entrada correto (`main.tsx` ou `index.tsx`)

### Problema: Classes Tailwind não funcionam

**Solução:**
1. Adicione o caminho do Design System no `content` do Tailwind:
   ```typescript
   content: [
     './src/**/*.{js,ts,jsx,tsx}',
     './node_modules/@beautysmile/design-system/**/*.{js,ts,jsx,tsx}',
   ]
   ```
2. Reinicie o servidor de desenvolvimento

### Problema: Componentes não encontrados

**Solução:**
1. Verifique o caminho de importação:
   ```typescript
   import { Button } from '@beautysmile/design-system/components'
   ```
2. Verifique se o pacote está instalado:
   ```bash
   npm list @beautysmile/design-system
   ```

### Problema: Erros TypeScript

**Solução:**
1. Certifique-se de que o TypeScript está configurado corretamente
2. Instale os tipos necessários:
   ```bash
   npm install -D @types/react @types/react-dom
   ```
3. Verifique o `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler"
     }
   }
   ```

### Problema: Variáveis CSS não disponíveis

**Solução:**
Importe explicitamente o CSS global:

```css
/* No seu arquivo CSS principal */
@import '@beautysmile/design-system/styles/globals.css';
```

### Problema: Erros de build com Vite

**Solução:**
Configure o Vite para lidar com o Design System:

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['@beautysmile/design-system'],
  },
})
```

---

## Resumo Rápido

### Checklist de Início Rápido

- [ ] Escolher método (Template ou do Zero)
- [ ] Instalar dependências
- [ ] Configurar Tailwind CSS
- [ ] Importar estilos globais
- [ ] Escolher tema (Admin ou Public)
- [ ] Criar primeiro componente
- [ ] Explorar Storybook
- [ ] Personalizar conforme necessário

### Comandos Essenciais

```bash
# Instalar
npm install @beautysmile/design-system react react-dom tailwindcss

# Desenvolvimento
npm run dev

# Build
npm run build

# Ver documentação
# Acesse: https://beautysmile-design-system.vercel.app
```

---

## Conclusão

Agora você está pronto para começar a construir com o **Beauty Smile Design System**! 🎉

**Dicas finais:**
- Use o Storybook como referência visual
- Siga os princípios de design para consistência
- Comece simples e vá adicionando complexidade
- Personalize conforme suas necessidades

**Precisa de ajuda?**
- Abra uma issue no [GitHub](https://github.com/fercosnt/design-system/issues)
- Consulte a documentação completa
- Explore os exemplos no repositório

Boa sorte com seu projeto! 🚀

