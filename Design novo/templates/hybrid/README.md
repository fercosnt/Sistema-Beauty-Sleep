# Beauty Smile Hybrid Template

Template que combina funcionalidades Admin e Público em um único projeto.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📁 Estrutura

```
hybrid/
├── src/
│   ├── pages/
│   │   ├── admin/          # Páginas admin (tema azul)
│   │   │   ├── AdminLoginPage.tsx
│   │   │   └── AdminDashboardPage.tsx
│   │   └── public/         # Páginas públicas (tema turquesa)
│   │       ├── LandingPage.tsx
│   │       ├── LoginPage.tsx
│   │       └── DashboardPage.tsx
│   ├── lib/auth.ts         # Auth com roles (admin/user)
│   └── App.tsx             # Rotas admin + public
└── ...config files
```

## 🎨 Temas

- **Admin:** Deep Blue (#0A2463) - Rotas `/admin/*`
- **Public:** Turquoise (#00A8CC) - Rotas públicas

## 🔐 Autenticação

- **Admin:** Use email `admin@*` para login como admin
- **User:** Outros emails fazem login como usuário regular

## 📄 Rotas

**Públicas:**
- `/` - Landing page
- `/login` - Login público
- `/dashboard` - Dashboard do usuário

**Admin:**
- `/admin/login` - Login admin
- `/admin/dashboard` - Dashboard admin

## 📦 Tecnologias

React 18.3, TypeScript 5.6, Vite 6.3, React Router 6, Tailwind CSS 4, @beautysmile/design-system

## 📝 Licença

MIT
