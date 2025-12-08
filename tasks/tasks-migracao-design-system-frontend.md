# Tasks: Migração do Frontend para Beauty Smile Design System

> **Objetivo**: Migrar completamente o frontend do Sistema Beauty Sleep para usar o novo Beauty Smile Design System
> **Prazo Estimado**: 4-6 semanas
> **Prioridade**: Alta (após deploy de produção estável)
> **Baseado em**: Design System v0.1.0 em `Design novo/`

---

## 📋 Índice

1. [Preparação e Configuração](#1-preparação-e-configuração)
2. [Migração de Design Tokens](#2-migração-de-design-tokens)
3. [Migração de Componentes Base](#3-migração-de-componentes-base)
4. [Migração de Layouts e Templates](#4-migração-de-layouts-e-templates)
5. [Migração de Páginas](#5-migração-de-páginas)
6. [Componentes Específicos do Sistema](#6-componentes-específicos-do-sistema)
7. [Refinamentos e Polimento](#7-refinamentos-e-polimento)
8. [Testes e Validação](#8-testes-e-validação)

---

## 1. Preparação e Configuração

### 1.1 Instalar Design System como Dependência

**Descrição**: Integrar o Design System no projeto como pacote npm ou via import direto

**Tarefas**:
- [x] Decidir método de integração:
  - [x] Opção B: Importar diretamente da pasta `Design novo/src` via path alias ✅ **ESCOLHIDA**
  - [ ] Opção A: Instalar via npm `@beautysmile/design-system` (se publicado)
  - [ ] Opção C: Copiar componentes necessários para `components/ui` do projeto
- [x] Configurar path aliases no `tsconfig.json` para importar do Design System
- [x] Instalar dependências necessárias:
  - [x] `class-variance-authority`
  - [x] `clsx`
  - [x] `tailwind-merge`
  - [x] `@radix-ui/react-slot`
  - [x] `@radix-ui/react-label`
  - [x] `@radix-ui/react-checkbox`
- [x] Criar utilitário `cn()` em `utils/cn.ts` e `lib/utils/cn.ts`
- [x] Configurar webpack aliases no `next.config.js`
- [x] Atualizar `tailwind.config.ts` para incluir Design System no content

**Arquivos modificados**:
- ✅ `package.json` - Dependências instaladas
- ✅ `tsconfig.json` - Path aliases configurados
- ✅ `next.config.js` - Webpack aliases configurados
- ✅ `tailwind.config.ts` - Content atualizado
- ✅ `utils/cn.ts` - Criado
- ✅ `lib/utils/cn.ts` - Criado

**Critérios de Aceite**:
- ✅ Imports do Design System funcionam sem erros (path aliases configurados)
- ⚠️ TypeScript reconhece tipos do Design System (alguns erros nos templates, mas componentes principais OK)
- ⚠️ Build do projeto precisa ser testado (próximo passo)

---

### 1.2 Configurar Tailwind CSS com Preset do Design System

**Descrição**: Integrar os design tokens do Beauty Smile Design System no Tailwind

**Tarefas**:
- [x] Atualizar `tailwind.config.ts` para importar tokens do Design System diretamente (Tailwind 3.4.7 não suporta presets como v4)
- [x] Importar tokens: colors, typography, spacing, shadows, animations
- [x] Configurar cores do Design System (primary, secondary, accent, neutral, semantic colors)
- [x] Configurar tipografia (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing)
- [x] Configurar espaçamentos (spacing scale baseada em 4px, borderRadius, maxWidth, zIndex)
- [x] Configurar sombras (boxShadow, dropShadow, glass shadows, focus rings, colored shadows)
- [x] Configurar animações (keyframes, animation presets, transitionDuration, transitionTimingFunction)
- [x] Adicionar breakpoints do Design System
- [x] Adicionar backdropBlur para glass morphism
- [x] Manter cores antigas para compatibilidade durante migração gradual
- [ ] Verificar que todas as classes Tailwind do Design System funcionam (teste manual necessário)
- [ ] Testar cores, espaçamentos, tipografia, sombras em componentes reais

**Arquivos modificados**:
- ✅ `tailwind.config.ts` - Tokens do Design System integrados

**Critérios de Aceite**:
- ✅ Classes como `bg-primary`, `text-accent`, `shadow-glass` configuradas
- ✅ Cores do tema Admin (Deep Blue #00109E) aplicadas via `colors.primary.DEFAULT`
- ⚠️ Build do Tailwind precisa ser testado para validar geração de CSS
- ⚠️ Classes precisam ser testadas em componentes reais (próximas etapas)

---

### 1.3 Importar Estilos Globais do Design System

**Descrição**: Garantir que estilos globais do Design System sejam carregados

**Tarefas**:
- [x] Criar arquivo `app/design-system-variables.css` com variáveis CSS e keyframes do Design System (sem @import 'tailwindcss')
- [x] Atualizar `app/globals.css` para importar variáveis CSS do Design System:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  
  /* Importar variáveis CSS e keyframes do Design System */
  @import './design-system-variables.css';
  ```
- [x] Verificar que CSS custom properties (variáveis CSS) estão disponíveis
- [ ] Testar que animações e transições do Design System funcionam (teste manual necessário)

**Arquivos modificados**:
- ✅ `app/globals.css` - Import adicionado
- ✅ `app/design-system-variables.css` - Criado com todas as variáveis CSS e keyframes

**Critérios de Aceite**:
- ✅ Variáveis CSS como `--color-primary`, `--spacing-4` disponíveis (definidas em design-system-variables.css)
- ✅ Keyframes de animações definidos (fadeIn, slideInUp, scaleIn, etc.)
- ✅ Build funciona sem erros
- ⚠️ Animações precisam ser testadas em componentes reais (próximas etapas)
- ✅ Sem conflitos com estilos existentes (importado após @tailwind)

---

### 1.4 Verificar Compatibilidade de Versões

**Descrição**: Garantir compatibilidade entre dependências

**Tarefas**:
- [x] Verificar versões de React: ✅ **18.3.1** (compatível com Design System que requer 18.3+)
- [x] Verificar versão do Tailwind CSS: ⚠️ **3.4.7** (Design System espera 4.0, mas tokens foram adaptados manualmente)
- [x] Verificar compatibilidade de Radix UI: ✅ **Instalado e compatível**
  - `@radix-ui/react-dialog`: ^1.1.15 ✅
  - `@radix-ui/react-dropdown-menu`: ^2.1.16 ✅
  - `@radix-ui/react-select`: ^2.2.6 ✅
  - `@radix-ui/react-slot`: ^1.2.4 ✅
  - `@radix-ui/react-label`: ^2.1.8 ✅
  - `@radix-ui/react-checkbox`: ^1.3.3 ✅
- [x] Verificar dependências do Design System instaladas:
  - ✅ `class-variance-authority`: ^0.7.1
  - ✅ `clsx`: ^2.1.1
  - ✅ `tailwind-merge`: ^3.4.0
- [x] Build funciona sem erros ✅

**Arquivos verificados**:
- ✅ `package.json` - Todas as dependências compatíveis
- ✅ Build testado e funcionando

**Notas sobre Tailwind CSS**:
- ⚠️ Design System foi desenvolvido para Tailwind 4.0, mas o projeto usa 3.4.7
- ✅ Tokens foram importados manualmente no `tailwind.config.ts` (funciona perfeitamente)
- ✅ Não há necessidade de atualizar Tailwind agora (pode ser feito no futuro se necessário)

**Critérios de Aceite**:
- ✅ Todas as dependências compatíveis
- ✅ Sem warnings de peer dependencies críticos
- ✅ Build funciona sem erros
- ⚠️ Tailwind 3.4.7 funciona com tokens adaptados (não é bloqueador)

---

## 2. Migração de Design Tokens

### 2.1 Atualizar Cores do Sistema

**Descrição**: Substituir cores hardcoded pelas cores do Design System

**Tarefas**:
- [x] Mapear cores atuais para tokens do Design System: ✅ **CONCLUÍDO**
  - [x] `primary-600` → `primary` (#00109E Deep Blue) ✅
  - [x] `accent-500` → `accent` (#35BFAD Turquoise) ✅
  - [x] Cores de status (success, error, warning) → tokens semânticos ✅
- [x] Substituir cores em: ✅ **EM PROGRESSO**
  - [x] `app/globals.css` ✅
  - [x] `components/ui/Header.tsx` ✅
  - [x] `components/ui/Button.tsx` ✅
  - [x] `components/ui/BuscaGlobal.tsx` ✅
  - [x] `app/pacientes/components/PacientesTable.tsx` ✅
  - [x] `app/pacientes/[id]/components/HeaderPerfil.tsx` ✅
  - [x] `app/pacientes/[id]/components/TabHistoricoStatus.tsx` ✅
  - [ ] Componentes que usam cores inline (style={{}}) ⏳ **PENDENTE**
  - [ ] Classes Tailwind customizadas em outros arquivos ⏳ **PENDENTE**
- [x] Atualizar badges de status para usar cores semânticas: ✅ **CONCLUÍDO**
  - [x] Lead: `bg-info-50 text-info-800 border border-info-200` ✅
  - [x] Ativo: `bg-success-50 text-success-800 border border-success-200` ✅
  - [x] Finalizado: `bg-secondary-50 text-secondary-800 border border-secondary-200` ✅
  - [x] Inativo: `bg-neutral-200 text-neutral-700 border border-neutral-300` ✅

**Arquivos modificados**:
- ✅ `app/globals.css` - Cores atualizadas com comentários indicando tokens do Design System
- ✅ `components/ui/Header.tsx` - `bg-primary-600` → `bg-primary`
- ✅ `components/ui/Button.tsx` - Variantes atualizadas para usar tokens do Design System
- ✅ `components/ui/BuscaGlobal.tsx` - `text-primary-600` → `text-primary`
- ✅ `app/pacientes/components/PacientesTable.tsx` - Função `getStatusColor` atualizada
- ✅ `app/pacientes/[id]/components/HeaderPerfil.tsx` - Função `getStatusColor` atualizada
- ✅ `app/pacientes/[id]/components/TabHistoricoStatus.tsx` - Funções `getStatusColor` e `getStatusBadgeClass` atualizadas

**Arquivos pendentes** (com cores hardcoded encontradas):
- `app/usuarios/components/ModalNovoUsuario.tsx`
- `app/pacientes/components/ModalNovoPaciente.tsx`
- `app/usuarios/components/ModalEditarUsuario.tsx`
- `app/pacientes/[id]/components/TabEvolucao.tsx`
- `app/dashboard/components/DashboardRonco.tsx`
- `app/migracao/components/MilestoneCelebration.tsx`
- `app/not-found.tsx`
- `app/pacientes/[id]/page.tsx`
- `app/configuracoes/page.tsx`
- `app/migracao/leaderboard/page.tsx`
- `app/migracao/components/DailyUpdate.tsx`
- `app/perfil/page.tsx`
- E outros...

**Critérios de Aceite**:
- ⚠️ Cores principais migradas (`primary`, `accent`, badges de status)
- ⚠️ Build funciona sem erros após mudanças
- ⚠️ Migração parcial concluída (principais componentes)
- ⚠️ Algumas cores hardcoded ainda existem em outros arquivos (serão migradas gradualmente)

---

### 2.2 Migrar Tipografia

**Descrição**: Aplicar sistema de tipografia do Design System

**Tarefas**:
- [x] Atualizar fontes: ✅ **CONCLUÍDO**
  - [x] Verificar se Montserrat (headings) e Inter (body) estão configuradas ✅
  - [x] Atualizar `tailwind.config.ts` se necessário ✅ (já estava configurado)
- [x] Substituir fontes hardcoded em `app/globals.css`: ✅ **CONCLUÍDO**
  - [x] Helvetica → Inter (via `font-sans` do Design System) ✅
  - [x] Aplicar `font-heading` automaticamente para h1-h6 ✅
- [x] Aplicar `font-heading` para títulos principais: ✅ **CONCLUÍDO**
  - [x] Dashboard title ✅
  - [x] Pacientes page title ✅
  - [x] Usuários page title ✅
  - [x] Logs page title ✅
  - [x] HeaderPerfil CardTitle ✅
  - [x] CardTitle component (padrão) ✅

**Arquivos modificados**:
- ✅ `app/globals.css` - Atualizado para usar `font-sans` (Inter) e aplicar `font-heading` (Montserrat) automaticamente para h1-h6
- ✅ `app/dashboard/components/DashboardContent.tsx` - Adicionado `font-heading` ao título
- ✅ `app/pacientes/page.tsx` - Adicionado `font-heading` ao título
- ✅ `app/usuarios/page.tsx` - Adicionado `font-heading` ao título
- ✅ `app/logs/page.tsx` - Adicionado `font-heading` ao título
- ✅ `app/pacientes/[id]/components/HeaderPerfil.tsx` - Adicionado `font-heading` ao CardTitle
- ✅ `components/ui/Card.tsx` - Adicionado `font-heading` ao CardTitle por padrão

**Configuração no Tailwind**:
- ✅ `fontFamily.sans`: Inter (com fallbacks)
- ✅ `fontFamily.heading`: Montserrat (com fallbacks)
- ✅ `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`: Todos configurados via tokens do Design System

**Critérios de Aceite**:
- ✅ Tipografia consistente: Inter para corpo, Montserrat para títulos
- ✅ Hierarquia visual clara (h1 > h2 > h3) mantida via CSS global
- ✅ Legibilidade mantida
- ✅ Build funcionando sem erros

---

### 2.3 Migrar Espaçamentos

**Descrição**: Padronizar espaçamentos usando escala do Design System

**Tarefas**:
- [x] Revisar espaçamentos customizados (padding, margin, gap) ✅ **CONCLUÍDO**
- [x] Substituir por escala do Design System (baseada em 4px: 4, 8, 12, 16, 20, 24, etc.) ✅ **CONCLUÍDO**
- [x] Verificar componentes com espaçamentos muito customizados ✅ **CONCLUÍDO**

**Arquivos modificados**:
- ✅ `components/ui/Card.tsx` - Atualizado `space-y-1.5` (6px) para `space-y-2` (8px)
- ✅ `components/ui/Dialog.tsx` - Atualizado `space-y-1.5` (6px) para `space-y-2` (8px)
- ✅ `app/globals.css` - Ajustado `border-radius: 0.375rem` (6px) para `0.5rem` (8px) no Shepherd button

**Verificações realizadas**:
- ✅ Espaçamentos em `globals.css` já seguem a escala (1rem = 16px, 0.75rem = 12px, 0.5rem = 8px)
- ✅ Componentes UI usam classes Tailwind que já seguem a escala do Design System (p-6, p-4, gap-2, etc.)
- ✅ Configuração do Tailwind já inclui toda a escala de espaçamento (0-32) baseada em 4px
- ✅ Border radius ajustados para usar valores da escala padrão

**Critérios de Aceite**:
- ✅ Espaçamentos consistentes: Todos os componentes usam valores da escala baseada em 4px
- ✅ Usa escala do Design System: Configuração do Tailwind usa tokens do Design System
- ✅ Valores não-padrão corrigidos: `space-y-1.5` e `border-radius: 0.375rem` ajustados

---

### 2.4 Migrar Sombras e Efeitos

**Descrição**: Aplicar sistema de sombras do Design System

**Tarefas**:
- [x] Substituir `shadow-sm`, `shadow-md`, etc. por sistema do Design System ✅ **CONCLUÍDO**
  - [x] Verificado que as classes Tailwind (`shadow-sm`, `shadow-md`, `shadow-lg`) já estão configuradas com tokens do Design System ✅
- [x] Aplicar sombras glass morphism onde apropriado ✅ **CONCLUÍDO**
  - [x] Tokens de glass shadows configurados no Tailwind (`glass-sm`, `glass`, `glass-md`, `glass-lg`, `glass-xl`) ✅
- [x] Verificar focus rings (devem usar tokens do Design System) ✅ **CONCLUÍDO**
  - [x] Atualizados para usar `ring-primary`, `ring-accent`, `ring-error` do Design System ✅

**Arquivos modificados**:
- ✅ `components/ui/Input.tsx` - Atualizado `ring-primary-500` → `ring-primary`
- ✅ `components/ui/Textarea.tsx` - Atualizado `ring-primary-500` → `ring-primary`
- ✅ `components/ui/Select.tsx` - Atualizado `ring-primary-500` → `ring-primary`
- ✅ `components/ui/Dialog.tsx` - Atualizado `ring-primary-500` → `ring-primary`
- ✅ `components/ui/BuscaGlobal.tsx` - Atualizado `ring-primary-500` → `ring-primary`
- ✅ `components/ui/Toast.tsx` - Atualizado `danger-50` → `error-50` (correção de cor)

**Verificações realizadas**:
- ✅ Sombras já usam tokens do Design System: `shadow-sm`, `shadow-md`, `shadow-lg` configuradas via `tailwind.config.ts`
- ✅ Focus rings atualizados para usar cores DEFAULT do Design System (`ring-primary`, `ring-accent`, `ring-error`)
- ✅ Button já estava usando `ring-primary`, `ring-accent`, `ring-error` corretamente
- ✅ Tokens de glass shadows disponíveis para uso futuro
- ✅ Tokens de colored shadows disponíveis para botões e CTAs

**Configuração no Tailwind**:
- ✅ `boxShadow`: Todos os níveis (sm, DEFAULT, md, lg, xl, 2xl, inner) usando tokens do Design System
- ✅ `boxShadow` glass: Tokens disponíveis (`glass-sm`, `glass`, `glass-md`, `glass-lg`, `glass-xl`)
- ✅ `boxShadow` focus: Tokens disponíveis (`focus-primary`, `focus-accent`, `focus-error`, `focus-success`)
- ✅ `boxShadow` colored: Tokens disponíveis para primary, accent, secondary

**Critérios de Aceite**:
- ✅ Sombras consistentes: Todas usando tokens do Design System via Tailwind
- ✅ Estados de foco visíveis e acessíveis: Focus rings usando cores do Design System
- ✅ Glass morphism disponível: Tokens configurados para uso futuro

---

## 3. Migração de Componentes Base

### 3.1 Migrar Componente Button

**Descrição**: Substituir botões customizados pelo Button do Design System

**Tarefas**:
- [x] Identificar todos os usos de botões no sistema:
  - [x] `app/login/page.tsx` ✅ **MIGRADO**
  - [ ] Modais (ModalNovoPaciente, ModalNovaSessao, etc.)
  - [ ] Sidebar (botão logout)
  - [ ] Páginas de ações (criar, editar, deletar)
- [x] Substituir por `<Button>` do Design System - ✅ **Em progresso**
- [x] Mapear variantes:
  - [x] Botões primários → `variant="primary"` ✅
  - [x] Botões secundários → `variant="outline"` ✅
  - [x] Botões de link → `variant="link"` ✅
  - [ ] Botões de ação destrutiva → `variant="destructive"` (ainda não aplicado)
- [x] Adicionar `isLoading` state onde necessário - ✅ **Implementado no login**
- [ ] Adicionar ícones (`leftIcon`, `rightIcon`) onde apropriado

**Arquivos modificados**:
- ✅ `app/login/page.tsx` - **MIGRADO COMPLETAMENTE**: 
  - Todos os botões agora usam `<GlassButton>` do Design System
  - Design completo do template LoginPublicTemplate aplicado
  - Glass Card com efeito glass morphism
  - Background com gradiente (Turquoise → Deep Blue → Turquoise)
  - Logo SVG do Beauty Smile adicionado
  - Mensagens de erro traduzidas para português
  - Funcionalidade completa mantida (login, reset password, logout)

**Arquivos concluídos**:
- ✅ `app/login/page.tsx` - **MIGRADO COMPLETAMENTE**
- ✅ `components/ui/Sidebar.tsx` - **MIGRADO COMPLETAMENTE** (incluindo funcionalidade collapsed)

**Arquivos pendentes**:
- `app/pacientes/components/ModalNovoPaciente.tsx`
- `app/pacientes/components/ModalEditarSessao.tsx`
- `app/pacientes/components/ModalNovaSessao.tsx`
- `app/usuarios/components/ModalNovoUsuario.tsx`
- `app/usuarios/components/ModalEditarUsuario.tsx`
- Todos os outros componentes com botões

**Critérios de Aceite**:
- ✅ Build funciona sem erros após migração do login
- ✅ Variantes aplicadas corretamente no login
- ✅ Estados de loading funcionam
- ✅ Acessibilidade mantida (focus, keyboard navigation)
- ⚠️ Migração de outros componentes ainda pendente

---

### 3.2 Migrar Componente Card

**Descrição**: Substituir containers customizados pelo Card do Design System

**Tarefas**:
- [ ] Identificar usos de cards/containers:
  - [ ] Cards de KPI no dashboard
  - [ ] Cards de informações em páginas de perfil
  - [ ] Containers de formulários
- [ ] Substituir por `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`
- [ ] Aplicar estrutura semântica correta

**Arquivos a modificar**:
- `app/dashboard/components/KPICards.tsx`
- `app/pacientes/[id]/components/HeaderPerfil.tsx`
- Páginas com seções em cards

**Critérios de Aceite**:
- Cards consistentes visualmente
- Estrutura semântica correta
- Espaçamentos aplicados via subcomponentes

---

### 3.3 Migrar Componente Input

**Descrição**: Substituir inputs customizados pelo Input do Design System

**Tarefas**:
- [ ] Identificar todos os inputs:
  - [ ] Formulários de login
  - [ ] Formulários de criação/edição de paciente
  - [ ] Formulários de sessão
  - [ ] Busca global
- [ ] Substituir por `<Input>` do Design System
- [ ] Manter funcionalidades existentes:
  - [ ] Máscara de CPF
  - [ ] Validação visual
  - [ ] Estados de erro
- [ ] Usar `<Label>` do Design System para labels

**Arquivos a modificar**:
- `app/login/page.tsx`
- `app/pacientes/components/ModalNovoPaciente.tsx`
- `app/pacientes/components/ModalEditarSessao.tsx`
- `components/ui/BuscaGlobal.tsx`
- Todos os formulários

**Critérios de Aceite**:
- Inputs consistentes
- Validação visual mantida
- Acessibilidade (labels, focus) mantida

---

### 3.4 Migrar Componente Textarea

**Descrição**: Substituir textareas pelo componente do Design System

**Tarefas**:
- [ ] Identificar textareas:
  - [ ] Campo de notas clínicas
  - [ ] Campo de observações em sessões
- [ ] Substituir por `<Textarea>` do Design System

**Arquivos a modificar**:
- `app/pacientes/[id]/components/TabNotas.tsx`
- Formulários com textareas

**Critérios de Aceite**:
- Textareas consistentes com inputs
- Funcionalidade mantida

---

### 3.5 Migrar Componente Dialog/Modal

**Descrição**: Substituir modais customizados pelo Dialog do Design System

**Tarefas**:
- [ ] Identificar todos os modais:
  - [ ] ModalNovoPaciente
  - [ ] ModalEditarSessao
  - [ ] ModalNovaSessao
  - [ ] ModalDetalhesExame
  - [ ] ModalNovoUsuario
  - [ ] ModalEditarUsuario
- [ ] Substituir estrutura por:
  ```tsx
  <Dialog>
    <DialogTrigger>...</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>...</DialogTitle>
        <DialogDescription>...</DialogDescription>
      </DialogHeader>
      {/* conteúdo */}
    </DialogContent>
  </Dialog>
  ```
- [ ] Manter funcionalidades:
  - [ ] Estados de loading
  - [ ] Validação de formulários
  - [ ] Callbacks de sucesso/erro
- [ ] Aplicar animações do Design System

**Arquivos a modificar**:
- `app/pacientes/components/ModalNovoPaciente.tsx`
- `app/pacientes/components/ModalEditarSessao.tsx`
- `app/pacientes/components/ModalNovaSessao.tsx`
- `app/pacientes/components/ModalDetalhesExame.tsx`
- `app/usuarios/components/ModalNovoUsuario.tsx`
- `app/usuarios/components/ModalEditarUsuario.tsx`

**Critérios de Aceite**:
- Modais usam Dialog do Design System
- Animações de entrada/saída funcionam
- Acessibilidade (focus trap, escape key, backdrop) mantida
- Responsividade mantida

---

### 3.6 Migrar Componente Table

**Descrição**: Substituir tabelas customizadas pelo Table do Design System

**Tarefas**:
- [ ] Identificar todas as tabelas:
  - [ ] Lista de pacientes
  - [ ] Lista de exames
  - [ ] Lista de sessões
  - [ ] Lista de usuários
  - [ ] Logs de auditoria
- [ ] Substituir por estrutura do Table do Design System
- [ ] Manter funcionalidades:
  - [ ] Ordenação
  - [ ] Paginação
  - [ ] Filtros
  - [ ] Ações em linha

**Arquivos a modificar**:
- `app/pacientes/page.tsx`
- `app/pacientes/[id]/components/TabExames.tsx`
- `app/pacientes/[id]/components/TabSessoes.tsx`
- `app/usuarios/page.tsx`
- `app/logs/page.tsx`

**Critérios de Aceite**:
- Tabelas consistentes
- Funcionalidades mantidas
- Responsividade mantida

---

### 3.7 Migrar Componente Badge

**Descrição**: Substituir badges customizados pelo Badge do Design System

**Tarefas**:
- [ ] Identificar badges:
  - [ ] BadgeStatus (Lead/Ativo/Finalizado/Inativo)
  - [ ] BadgeAdesao
  - [ ] Badges de tags
- [ ] Substituir por `<Badge>` do Design System
- [ ] Mapear variantes:
  - [ ] Ativo → `variant="success"`
  - [ ] Lead → `variant="info"` ou custom
  - [ ] Finalizado → `variant="secondary"`
  - [ ] Inativo → `variant="neutral"` ou custom

**Arquivos a modificar**:
- `components/ui/BadgeStatus.tsx`
- `components/ui/BadgeAdesao.tsx`
- Componentes que usam badges

**Critérios de Aceite**:
- Badges consistentes
- Cores semânticas aplicadas
- Legibilidade mantida

---

### 3.8 Migrar Componente Alert

**Descrição**: Substituir mensagens de alerta/erro/sucesso pelo Alert do Design System

**Tarefas**:
- [ ] Identificar usos de mensagens:
  - [ ] Mensagens de erro em formulários
  - [ ] Toast notifications (considerar migrar para componente do Design System se houver)
  - [ ] Alertas na interface
- [ ] Substituir por `<Alert>` do Design System
- [ ] Aplicar variantes corretas (`success`, `error`, `warning`, `info`)

**Arquivos a modificar**:
- Componentes com mensagens de feedback
- Páginas com alertas

**Critérios de Aceite**:
- Alertas consistentes
- Variantes semânticas aplicadas
- Acessibilidade mantida

---

### 3.9 Migrar Componente Checkbox

**Descrição**: Substituir checkboxes pelo componente do Design System

**Tarefas**:
- [ ] Identificar checkboxes:
  - [ ] Filtros na lista de pacientes
  - [ ] Seleção múltipla em tabelas
  - [ ] Checkboxes em formulários
- [ ] Substituir por `<Checkbox>` do Design System
- [ ] Usar `<Label>` do Design System

**Arquivos a modificar**:
- Formulários com checkboxes
- Componentes de filtro

**Critérios de Aceite**:
- Checkboxes consistentes
- Acessibilidade mantida (keyboard navigation)

---

## 4. Migração de Layouts e Templates

### 4.1 Atualizar Layout Principal

**Descrição**: Aplicar tema Admin (Deep Blue) do Design System no layout principal

**Tarefas**:
- [ ] Atualizar `app/layout.tsx`:
  - [ ] Aplicar classes de tema Admin (`bg-admin-bg` para backgrounds)
  - [ ] Usar cores do Design System
  - [ ] Garantir que estrutura HTML está correta
- [ ] Verificar que Sidebar usa tema Admin (Deep Blue)
- [ ] Verificar que Header usa cores consistentes

**Arquivos a modificar**:
- `app/layout.tsx`
- `components/ui/Sidebar.tsx`
- `components/ui/Header.tsx`

**Critérios de Aceite**:
- Layout usa tema Admin (Deep Blue #00109E)
- Consistência visual em todo o sistema
- Sidebar escura conforme design

---

### 4.2 Migrar Sidebar

**Descrição**: Atualizar Sidebar para usar componentes e tokens do Design System

**Tarefas**:
- [x] Revisar `components/ui/Sidebar.tsx` ✅ **CONCLUÍDO**
- [x] Aplicar cores do tema Admin: ✅ **CONCLUÍDO**
  - [x] Background: `bg-primary-900` (Deep Blue escuro)
  - [x] Texto: `text-white` com opacidades (`text-white/70`, `text-white/90`)
  - [x] Hover: `hover:bg-white/5`, `hover:bg-primary-700` para ativo
- [x] Usar componentes do Design System onde possível ✅ **CONCLUÍDO**
  - [x] Logo SVG do Beauty Smile
  - [x] Isotipo 3D prateado quando colapsada
- [x] Garantir acessibilidade (navegação por teclado, ARIA labels) ✅ **MANTIDO**
- [x] Aplicar animações suaves do Design System ✅ **CONCLUÍDO**
  - [x] Transições de 300ms para colapsar/expandir
  - [x] Transições suaves em hover
- [x] **Implementar funcionalidade de colapsar/expandir** ✅ **NOVO - CONCLUÍDO**
  - [x] Botão toggle no desktop
  - [x] Estado salvo no localStorage
  - [x] Logo muda: horizontal quando expandida, isotipo 3D prateado quando colapsada
  - [x] Conteúdo principal ajusta margem automaticamente
  - [x] Context API para compartilhar estado (`SidebarProvider`)

**Arquivos modificados**:
- ✅ `components/ui/Sidebar.tsx` - **MIGRADO COMPLETAMENTE**
  - Design dark do DashboardAdminTemplate aplicado
  - Logo Beauty Smile SVG horizontal (expandida)
  - Isotipo 3D prateado quando colapsada
  - Botão de toggle com chevron
  - Seção de usuário com avatar
  - Navegação com estados ativos
  - Funcionalidade mobile mantida
- ✅ `components/providers/SidebarProvider.tsx` - **NOVO - CRIADO**
- ✅ `components/MobileLayoutClient.tsx` - **ATUALIZADO** (ajuste de margem baseado no estado)
- ✅ `app/layout.tsx` - **ATUALIZADO** (SidebarProvider adicionado)
- ✅ `public/beauty-smile-icon.svg` - **NOVO - CRIADO**

**Critérios de Aceite**:
- ✅ Sidebar usa tema Admin (bg-primary-900)
- ✅ Navegação funciona corretamente
- ✅ Estados hover/focus visíveis
- ✅ Responsividade mantida (mobile: menu hambúrguer)
- ✅ **Funcionalidade de colapsar/expandir implementada e funcionando**
- ✅ **Isotipo 3D prateado exibido quando colapsada**
- ✅ **Transições suaves entre estados**

---

### 4.3 Migrar Header

**Descrição**: Atualizar Header para usar componentes do Design System

**Tarefas**:
- [ ] Revisar `components/ui/Header.tsx`
- [ ] Usar componentes do Design System:
  - [ ] Input para busca
  - [ ] Button para ações
- [ ] Aplicar espaçamentos e cores do Design System
- [ ] Garantir responsividade

**Arquivos a modificar**:
- `components/ui/Header.tsx`

**Critérios de Aceite**:
- Header consistente com Design System
- Busca global funciona
- Responsividade mantida

---

### 4.4 Aplicar Tema Admin Consistente

**Descrição**: Garantir que todo o sistema usa tema Admin (Deep Blue) consistentemente

**Tarefas**:
- [ ] Revisar todas as páginas para garantir uso do tema Admin
- [ ] Verificar que **NÃO** há uso de glass morphism (reservado para tema público)
- [ ] Garantir backgrounds claros (#F8F9FA ou `bg-neutral-50`) para área de conteúdo
- [ ] Aplicar cores de texto apropriadas (`text-neutral-900` para texto principal)

**Arquivos a revisar**:
- Todas as páginas (`app/**/*.tsx`)

**Critérios de Aceite**:
- Tema Admin aplicado consistentemente
- Sem uso de glass morphism
- Legibilidade mantida (contraste adequado)

---

## 5. Migração de Páginas

### 5.1 Migrar Página de Login

**Descrição**: Atualizar página de login para usar componentes do Design System

**Tarefas**:
- [x] Revisar `app/login/page.tsx` ✅ **CONCLUÍDO**
- [x] Usar componentes: ✅ **CONCLUÍDO**
  - [x] `<Input>` do Design System para email e senha
  - [x] `<GlassButton>` do Design System para submit
  - [x] `<GlassCard>` para container do formulário (glass morphism)
  - [x] `<Label>` do Design System para labels
  - [x] `<Checkbox>` do Design System para "Lembrar de mim"
- [x] Aplicar design do template público (gradiente) ✅ **CONCLUÍDO**
  - [x] Background com gradiente (Turquoise → Deep Blue → Turquoise)
  - [x] Logo SVG do Beauty Smile
  - [x] Glass morphism effect
- [x] Manter funcionalidades: ✅ **CONCLUÍDO**
  - [x] Validação de formulário
  - [x] Estados de loading
  - [x] Mensagens de erro traduzidas para português
  - [x] Reset de senha
- [x] **Usar `LoginPublicTemplate` do Design System como referência** ✅ **CONCLUÍDO**

**Arquivos modificados**:
- ✅ `app/login/page.tsx` - **MIGRADO COMPLETAMENTE**
  - Design completo do LoginPublicTemplate aplicado
  - Todos os componentes do Design System integrados
  - Funcionalidades mantidas
  - Tradução de erros para português
  - SVG logo implementado

**Critérios de Aceite**:
- ✅ Login usa componentes do Design System
- ✅ Funcionalidade mantida (login, reset password, logout)
- ✅ Design moderno com glass morphism e gradiente
- ✅ Erros traduzidos para português
- ✅ Responsividade mantida
- ✅ Acessibilidade mantida

---

### 5.2 Migrar Dashboard

**Descrição**: Atualizar dashboard para usar componentes e tokens do Design System

**Tarefas**:
- [ ] Revisar `app/dashboard/page.tsx`
- [ ] Atualizar KPICards:
  - [ ] Usar `<Card>` do Design System
  - [ ] Aplicar espaçamentos e tipografia
- [ ] Atualizar gráficos:
  - [ ] Garantir que cores dos gráficos usam tokens do Design System (`colors.chart.*`)
  - [ ] Aplicar estilos consistentes
- [ ] Atualizar tabs:
  - [ ] Usar componente de Tabs do Design System (se disponível) ou manter custom
- [ ] Aplicar tema Admin

**Arquivos a modificar**:
- `app/dashboard/page.tsx`
- `app/dashboard/components/KPICards.tsx`
- `app/dashboard/components/DashboardGeral.tsx`
- `app/dashboard/components/DashboardRonco.tsx`
- `app/dashboard/components/DashboardApneia.tsx`
- `app/dashboard/components/GraficoTendencia.tsx`

**Critérios de Aceite**:
- Dashboard usa componentes do Design System
- Gráficos usam cores do Design System
- Visual consistente

---

### 5.3 Migrar Lista de Pacientes

**Descrição**: Atualizar página de lista de pacientes

**Tarefas**:
- [ ] Revisar `app/pacientes/page.tsx`
- [ ] Usar `<Table>` do Design System
- [ ] Usar componentes de filtro do Design System
- [ ] Usar `<Input>` para busca
- [ ] Usar `<Button>` para ações
- [ ] Usar `<Badge>` para status

**Arquivos a modificar**:
- `app/pacientes/page.tsx`

**Critérios de Aceite**:
- Lista usa componentes do Design System
- Filtros e busca funcionam
- Tabela responsiva

---

### 5.4 Migrar Perfil de Paciente

**Descrição**: Atualizar página de perfil do paciente

**Tarefas**:
- [ ] Revisar `app/pacientes/[id]/page.tsx`
- [ ] Atualizar HeaderPerfil:
  - [ ] Usar `<Card>` para seções
  - [ ] Usar `<Badge>` para status
- [ ] Atualizar tabs:
  - [ ] Usar componente de Tabs (se disponível)
  - [ ] Aplicar espaçamentos
- [ ] Atualizar cada tab:
  - [ ] TabExames: usar `<Table>`
  - [ ] TabSessoes: usar `<Table>`
  - [ ] TabEvolucao: atualizar gráficos com cores do Design System
  - [ ] TabPeso: usar componentes do Design System
  - [ ] TabNotas: usar `<Textarea>`, `<Card>`
  - [ ] TabHistoricoStatus: usar componentes do Design System

**Arquivos a modificar**:
- `app/pacientes/[id]/page.tsx`
- `app/pacientes/[id]/components/HeaderPerfil.tsx`
- `app/pacientes/[id]/components/TabExames.tsx`
- `app/pacientes/[id]/components/TabSessoes.tsx`
- `app/pacientes/[id]/components/TabEvolucao.tsx`
- `app/pacientes/[id]/components/TabPeso.tsx`
- `app/pacientes/[id]/components/TabNotas.tsx`
- `app/pacientes/[id]/components/TabHistoricoStatus.tsx`

**Critérios de Aceite**:
- Perfil usa componentes do Design System
- Todas as tabs funcionam
- Gráficos atualizados

---

### 5.5 Migrar Gestão de Usuários

**Descrição**: Atualizar páginas de gestão de usuários

**Tarefas**:
- [ ] Revisar `app/usuarios/page.tsx`
- [ ] Usar `<Table>` do Design System
- [ ] Atualizar modais:
  - [ ] ModalNovoUsuario: usar Dialog, Input, Button do Design System
  - [ ] ModalEditarUsuario: usar Dialog, Input, Button do Design System

**Arquivos a modificar**:
- `app/usuarios/page.tsx`
- `app/usuarios/components/ModalNovoUsuario.tsx`
- `app/usuarios/components/ModalEditarUsuario.tsx`

**Critérios de Aceite**:
- Páginas usam componentes do Design System
- Funcionalidade mantida

---

### 5.6 Migrar Página de Logs

**Descrição**: Atualizar página de logs de auditoria

**Tarefas**:
- [ ] Revisar `app/logs/page.tsx`
- [ ] Usar `<Table>` do Design System
- [ ] Aplicar tema Admin

**Arquivos a modificar**:
- `app/logs/page.tsx`
- `app/logs/components/LogsTable.tsx` (se existir)

**Critérios de Aceite**:
- Logs usam componentes do Design System
- Tabela funcional e responsiva

---

## 6. Componentes Específicos do Sistema

### 6.1 Atualizar BadgeStatus

**Descrição**: Refatorar BadgeStatus para usar Badge do Design System

**Tarefas**:
- [ ] Revisar `components/ui/BadgeStatus.tsx`
- [ ] Substituir implementação customizada por `<Badge>` do Design System
- [ ] Mapear status para variantes:
  - [ ] `lead` → `variant="info"` ou custom
  - [ ] `ativo` → `variant="success"`
  - [ ] `finalizado` → `variant="secondary"` ou custom
  - [ ] `inativo` → `variant="neutral"` ou custom
- [ ] Manter funcionalidade existente

**Arquivos a modificar**:
- `components/ui/BadgeStatus.tsx`

**Critérios de Aceite**:
- BadgeStatus usa Badge do Design System
- Cores semânticas aplicadas
- Compatibilidade mantida (mesma API)

---

### 6.2 Atualizar BadgeAdesao

**Descrição**: Refatorar BadgeAdesao para usar Badge do Design System

**Tarefas**:
- [ ] Revisar `components/ui/BadgeAdesao.tsx`
- [ ] Substituir por `<Badge>` do Design System
- [ ] Aplicar cores semânticas baseadas no percentual de adesão

**Arquivos a modificar**:
- `components/ui/BadgeAdesao.tsx`

**Critérios de Aceite**:
- BadgeAdesao usa Badge do Design System
- Funcionalidade mantida

---

### 6.3 Atualizar BuscaGlobal

**Descrição**: Refatorar BuscaGlobal para usar Input do Design System

**Tarefas**:
- [ ] Revisar `components/ui/BuscaGlobal.tsx`
- [ ] Substituir input customizado por `<Input>` do Design System
- [ ] Manter funcionalidade de busca
- [ ] Aplicar ícones apropriados (usar lucide-react se compatível)

**Arquivos a modificar**:
- `components/ui/BuscaGlobal.tsx`

**Critérios de Aceite**:
- BuscaGlobal usa Input do Design System
- Funcionalidade de busca mantida

---

### 6.4 Revisar OnboardingTour

**Descrição**: Garantir que o tour usa componentes atualizados do Design System

**Tarefas**:
- [ ] Revisar `components/OnboardingTour.tsx`
- [ ] Verificar que referências a elementos DOM ainda funcionam após migração
- [ ] Atualizar textos se necessário para refletir novos componentes
- [ ] Testar tour completo após migração

**Arquivos a modificar**:
- `components/OnboardingTour.tsx`

**Critérios de Aceite**:
- Tour funciona corretamente
- Referências a componentes atualizadas

---

## 7. Refinamentos e Polimento

### 7.1 Animações e Transições

**Descrição**: Aplicar animações do Design System onde apropriado

**Tarefas**:
- [ ] Aplicar animações de entrada em modais (usar animações do Design System)
- [ ] Aplicar transições suaves em hover/focus
- [ ] Verificar que animações não afetam performance
- [ ] Garantir que animações respeitam `prefers-reduced-motion`

**Arquivos a modificar**:
- Componentes com interações

**Critérios de Aceite**:
- Animações suaves e consistentes
- Performance mantida
- Acessibilidade (reduced motion) respeitada

---

### 7.2 Estados de Loading

**Descrição**: Padronizar estados de loading usando componentes do Design System

**Tarefas**:
- [ ] Verificar que todos os botões com loading usam `isLoading` do Button
- [ ] Padronizar spinners de loading (usar do Design System)
- [ ] Aplicar skeleton loaders onde apropriado (se disponível no Design System)

**Arquivos a modificar**:
- Componentes com estados de loading

**Critérios de Aceite**:
- Estados de loading consistentes
- UX melhorada

---

### 7.3 Estados de Erro e Validação

**Descrição**: Padronizar feedback de erros e validação

**Tarefas**:
- [ ] Garantir que inputs com erro mostram estado visual correto
- [ ] Usar `<Alert>` para mensagens de erro importantes
- [ ] Padronizar mensagens de validação
- [ ] Garantir acessibilidade (ARIA labels, live regions)

**Arquivos a modificar**:
- Formulários
- Componentes com validação

**Critérios de Aceite**:
- Feedback de erro consistente
- Acessibilidade mantida

---

### 7.4 Responsividade

**Descrição**: Garantir que todos os componentes são responsivos

**Tarefas**:
- [ ] Testar todas as páginas em:
  - [ ] Desktop (1024px+)
  - [ ] Tablet (768-1023px)
  - [ ] Mobile (< 768px)
- [ ] Ajustar breakpoints se necessário (usar breakpoints do Design System)
- [ ] Garantir que componentes do Design System são responsivos

**Arquivos a testar**:
- Todas as páginas

**Critérios de Aceite**:
- Sistema totalmente responsivo
- UX boa em todos os tamanhos de tela

---

### 7.5 Acessibilidade

**Descrição**: Garantir acessibilidade completa

**Tarefas**:
- [ ] Verificar contraste de cores (WCAG AA mínimo)
- [ ] Verificar navegação por teclado
- [ ] Verificar ARIA labels
- [ ] Testar com screen reader (opcional, mas recomendado)
- [ ] Verificar focus states visíveis

**Arquivos a revisar**:
- Todos os componentes

**Critérios de Aceite**:
- Acessibilidade WCAG AA
- Navegação por teclado funcional

---

### 7.6 Performance

**Descrição**: Garantir que migração não afeta performance

**Tarefas**:
- [ ] Verificar bundle size (não deve aumentar significativamente)
- [ ] Verificar tree-shaking (importar apenas componentes usados)
- [ ] Verificar que animações não causam jank
- [ ] Testar performance em dispositivos mais lentos

**Critérios de Aceite**:
- Performance mantida ou melhorada
- Bundle size controlado

---

## 8. Testes e Validação

### 8.1 Testes Visuais

**Descrição**: Validar visualmente todas as páginas

**Tarefas**:
- [ ] Revisar visualmente todas as páginas:
  - [ ] Login
  - [ ] Dashboard
  - [ ] Lista de pacientes
  - [ ] Perfil de paciente (todas as tabs)
  - [ ] Gestão de usuários
  - [ ] Logs
- [ ] Comparar com design do Design System (Storybook)
- [ ] Verificar consistência de cores, espaçamentos, tipografia
- [ ] Capturar screenshots para documentação (opcional)

**Critérios de Aceite**:
- Visual consistente com Design System
- Sem regressões visuais

---

### 8.2 Testes Funcionais

**Descrição**: Testar funcionalidades após migração

**Tarefas**:
- [ ] Testar fluxos principais:
  - [ ] Login/logout
  - [ ] Criar novo paciente
  - [ ] Editar paciente
  - [ ] Criar sessão
  - [ ] Editar sessão
  - [ ] Visualizar exames
  - [ ] Criar/editar usuário (admin)
  - [ ] Visualizar logs (admin)
- [ ] Testar validações de formulários
- [ ] Testar estados de loading
- [ ] Testar mensagens de erro/sucesso

**Critérios de Aceite**:
- Todas as funcionalidades funcionam
- Sem regressões funcionais

---

### 8.3 Testes de Integração

**Descrição**: Testar integração com backend (Supabase)

**Tarefas**:
- [ ] Testar todas as operações CRUD
- [ ] Testar sincronização com Biologix (se aplicável)
- [ ] Verificar que RLS policies ainda funcionam
- [ ] Testar autenticação e autorização

**Critérios de Aceite**:
- Integração com backend funciona
- Sem problemas de autenticação/autorização

---

### 8.4 Testes de Regressão

**Descrição**: Garantir que nada quebrou

**Tarefas**:
- [ ] Rodar testes existentes (se houver)
- [ ] Testar funcionalidades que não foram modificadas diretamente
- [ ] Verificar que APIs públicas de componentes não mudaram (se houver)

**Critérios de Aceite**:
- Sem regressões
- Testes passam

---

### 8.5 Documentação

**Descrição**: Documentar mudanças e como usar componentes do Design System

**Tarefas**:
- [ ] Atualizar README se necessário
- [ ] Documentar decisões importantes de migração
- [ ] Criar guia de contribuição para usar Design System em novos componentes
- [ ] Listar componentes do Design System disponíveis

**Arquivos a criar/modificar**:
- `README.md` (se necessário)
- `docs/DESIGN_SYSTEM.md` (novo arquivo de documentação)

**Critérios de Aceite**:
- Documentação clara
- Futuros desenvolvedores podem usar Design System facilmente

---

## 9. Checklist Final

### Antes de Finalizar

- [ ] Todas as tarefas das seções 1-8 completas
- [ ] Code review realizado
- [ ] Testes passando
- [ ] Sem regressões visuais ou funcionais
- [ ] Performance mantida
- [ ] Acessibilidade verificada
- [ ] Documentação atualizada
- [ ] Deploy em ambiente de staging/teste
- [ ] Validação com stakeholders

### Após Finalizar

- [ ] Deploy em produção
- [ ] Monitorar erros nas primeiras 24-48 horas
- [ ] Coletar feedback de usuários
- [ ] Criar issues para melhorias futuras (se necessário)

---

## 📝 Notas Importantes

### Decisões Arquiteturais

1. **Tema Admin**: Sistema usa tema Admin (Deep Blue #00109E). NÃO usar glass morphism.
2. **Importação**: Decidir método de importação (npm, path alias, ou cópia) baseado em necessidades do projeto.
3. **Compatibilidade**: Garantir compatibilidade com Next.js 14 App Router.
4. **Tree-shaking**: Importar componentes individualmente para otimizar bundle size.

### Riscos e Mitigações

- **Risco**: Componentes do Design System podem não ter todas as funcionalidades necessárias
  - **Mitigação**: Estender componentes quando necessário, mantendo compatibilidade
- **Risco**: Mudanças podem quebrar funcionalidades existentes
  - **Mitigação**: Testes extensivos, migração incremental, feature flags se necessário
- **Risco**: Bundle size pode aumentar
  - **Mitigação**: Tree-shaking, importar apenas componentes necessários

### Referências

- **Design System Storybook**: [https://beautysmile-design-system.vercel.app](https://beautysmile-design-system.vercel.app)
- **Design System Docs**: `Design novo/docs/`
- **Design System Source**: `Design novo/src/`

---

## 🎯 Próximos Passos Após Migração

1. Avaliar uso de templates do Design System para novas páginas
2. Considerar uso de glass morphism em futuras features públicas (se aplicável)
3. Avaliar componentes adicionais do Design System que podem ser úteis
4. Coletar métricas de performance e UX após migração
5. Planejar melhorias baseadas em feedback

---

**Última atualização**: 2025-01-22
**Versão do Design System**: v0.1.0

---

## 📊 Status Atual da Migração

### ✅ Concluído (Etapa 1 - Preparação)
- ✅ 1.1 - Instalar Design System como Dependência
- ✅ 1.2 - Configurar Tailwind CSS com Tokens do Design System
- ✅ 1.3 - Importar Estilos Globais do Design System
- ✅ 1.4 - Verificar Compatibilidade de Versões

### ✅ Concluído (Etapa 3 - Componentes Base)
- ✅ 3.1 - Migrar Componente Button (parcial - login page)
- ✅ 3.3 - Migrar Sidebar (completamente migrada com funcionalidade collapsed)

### ✅ Concluído (Etapa 4 - Layouts)
- ✅ 4.2 - Migrar Sidebar (design dark + collapsed + isotipo 3D prateado)

### ✅ Concluído (Etapa 5 - Páginas)
- ✅ 5.1 - Migrar Página de Login (completamente migrada)

### ⏳ Em Progresso / Pendente
- ⏳ 3.1 - Migrar Button em outros componentes (modais, etc.)
- ⏳ 3.2 - Migrar Componente Card
- ⏳ 3.3 - Migrar Componente Input (parcial - apenas login)
- ⏳ 3.4 - Migrar Componente Textarea
- ⏳ 3.5 - Migrar Componente Dialog/Modal
- ⏳ 3.6 - Migrar Componente Table
- ⏳ 3.7 - Migrar Componente Badge
- ⏳ 3.8 - Migrar Componente Alert
- ⏳ 3.9 - Migrar Componente Checkbox (parcial - apenas login)
- ⏳ 4.1 - Atualizar Layout Principal
- ⏳ 4.3 - Migrar Header
- ⏳ 4.4 - Aplicar Tema Admin Consistente
- ⏳ 5.2 a 5.6 - Migrar outras páginas (Dashboard, Pacientes, etc.)
- ⏳ Etapa 2 - Migração de Design Tokens
- ⏳ Etapa 6 - Componentes Específicos
- ⏳ Etapa 7 - Refinamentos
- ⏳ Etapa 8 - Testes

### 🎯 Próximos Passos Sugeridos
1. Migrar Header para Design System
2. Migrar modais (Dialog/Modal) para usar componentes do Design System
3. Migrar Cards no Dashboard
4. Migrar Inputs em outros formulários
5. Migrar Tabelas

