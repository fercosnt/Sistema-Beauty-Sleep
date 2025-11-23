# Beauty Smile Admin Dashboard

Template de projeto React + Vite para dashboard administrativo com tema azul escuro (Deep Blue).

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura do Projeto

```
admin-dashboard/
├── src/
│   ├── pages/           # Páginas da aplicação
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── SettingsPage.tsx
│   ├── lib/             # Utilitários e serviços
│   │   └── auth.ts      # Autenticação mockada
│   ├── styles/          # Estilos globais
│   │   └── globals.css
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Entry point
├── public/              # Assets estáticos
├── index.html
├── vite.config.ts       # Configuração do Vite
├── tailwind.config.ts   # Configuração do Tailwind (tema admin)
└── beautysmile.config.ts # Configuração do Beauty Smile
```

## 🎨 Tema e Customização

Este template usa o **tema Admin (Deep Blue)** do Beauty Smile Design System.

### Cores Principais

- **Primary:** `#0A2463` (Deep Blue)
- **Accent:** `#00A8CC` (Turquoise)

### Personalizar o Tema

Edite `tailwind.config.ts` para personalizar cores, tipografia, etc.

Edite `beautysmile.config.ts` para configurações específicas do Beauty Smile.

## 🔐 Autenticação

O template inclui um sistema de autenticação **mockado** em `src/lib/auth.ts`.

**Login de demonstração:**
- Email: qualquer email
- Senha: qualquer senha

### Implementar Autenticação Real

1. Substitua `src/lib/auth.ts` com sua lógica de autenticação real
2. Integre com seu backend (JWT, OAuth, etc.)
3. Atualize as páginas conforme necessário

## 📦 Tecnologias

- **React 18.3.1** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite 6.3** - Build tool
- **React Router 6** - Routing
- **Tailwind CSS 4** - Styling
- **@beautysmile/design-system** - Component library

## 🧩 Componentes Disponíveis

Todos os componentes e templates do Beauty Smile Design System estão disponíveis:

- **Templates Admin:** LoginAdminTemplate, DashboardAdminTemplate, CRUDTemplate, etc.
- **UI Components:** Button, Card, Input, Dialog, Alert, Table, etc.
- **Glass Morphism:** Glass, GlassCard, GlassButton, etc.
- **Assets:** BeautySmileLogo, BackgroundImage, etc.

Veja a documentação completa do Design System para mais detalhes.

## 📄 Páginas Incluídas

### Login (`/login`)
Página de login com glass morphism e tema azul escuro.

### Dashboard (`/dashboard`)
Dashboard principal com sidebar, métricas, e atividade recente.

### Settings (`/settings`)
Página de configurações com múltiplas seções.

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter

## 📚 Próximos Passos

1. **Implementar autenticação real** - Substituir mock por autenticação real
2. **Adicionar mais páginas** - Criar páginas específicas para seu caso de uso
3. **Integrar com backend** - Conectar com sua API
4. **Customizar tema** - Ajustar cores e estilos conforme sua marca
5. **Deploy** - Fazer deploy em Vercel, Netlify, ou outro serviço

## 📖 Documentação

- [Beauty Smile Design System](../../README.md)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📝 Licença

MIT
