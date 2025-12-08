# Beauty Smile Design System

A comprehensive React component library and design system for Beauty Smile projects, featuring modern UI components, design tokens, and two distinct themes (Admin and Public).

## ✨ Features

- **26+ React Components** - Built with Radix UI primitives for accessibility
  - 10+ UI components (Button, Card, Form, Table, Alert, Badge, Dialog, etc.)
  - 5 Glass morphism components (Glass, GlassCard, GlassPanel, GlassButton, GlassNavbar)
  - 3 Asset components (BeautySmileLogo, BackgroundImage, ImageWithFallback)
- **12 Page Templates** - Pre-built templates for common pages
  - 7 Admin templates (Login, Dashboard, CRUD, List, Detail, Settings, Profile)
  - 5 Public templates (Landing, Login, Dashboard, Multi-step Form, Profile)
- **3 Starter Projects** - Complete React + Vite projects ready to clone
  - Admin Dashboard template (Deep Blue theme)
  - Public Platform template (Turquoise theme)
  - Hybrid template (Both themes with role-based routing)
- **Design Tokens** - Colors, typography, spacing, shadows, and animations
- **Dual Themes** - Admin (Deep Blue #0A2463) and Public (Turquoise #00A8CC)
- **Glass Morphism** - Modern frosted glass UI effects
- **TypeScript** - Full type safety and IntelliSense support
- **Storybook** - Interactive component documentation
- **Tailwind CSS 4.x** - Utility-first styling with custom tokens
- **Tree-shakeable** - Import only what you need

## 📦 Installation

### Via NPM (Recommended)

```bash
npm install @beautysmile/design-system

# Peer dependencies
npm install react react-dom tailwindcss
```

### Via Starter Template

Copy one of the complete starter projects from the `templates/` directory:

```bash
# Clone the repository
git clone https://github.com/fercosnt/design-system.git
cd design-system

# Copy the template you need
cp -r templates/admin-dashboard/ ../my-admin-project
# OR
cp -r templates/public-platform/ ../my-public-project
# OR
cp -r templates/hybrid/ ../my-hybrid-project

# Install dependencies and start
cd ../my-admin-project
npm install
npm run dev
```

Each starter template includes:
- Complete React + Vite setup
- Pre-configured Tailwind CSS with theme
- Mock authentication service
- Example pages with routing
- TypeScript configuration
- ESLint and Prettier

## 🚀 Quick Start

### 1. Import Styles

In your app's entry point (e.g., `main.tsx` or `App.tsx`):

```tsx
import '@beautysmile/design-system/styles'
```

### 2. Configure Tailwind CSS

Extend your `tailwind.config.ts`:

```typescript
import { tokens } from '@beautysmile/design-system/tokens'

export default {
  presets: [
    require('@beautysmile/design-system/tailwind.config'),
  ],
  // Your custom config...
}
```

### 3. Use Components

```tsx
import { Button, Card } from '@beautysmile/design-system/components'
import { colors } from '@beautysmile/design-system/tokens'

function App() {
  return (
    <Card>
      <Button variant="primary">
        Get Started
      </Button>
    </Card>
  )
}
```

## 📚 Documentation

- **Quick Start (5 min)** - [docs/quick-start.md](docs/quick-start.md) ⚡
- **Guia Completo: Como Começar um Novo Projeto** - [docs/guia-inicio-projeto.md](docs/guia-inicio-projeto.md) 🇧🇷
- **Storybook** - [https://beautysmile-design-system.vercel.app](https://beautysmile-design-system.vercel.app)
- **Getting Started Guide** - [docs/getting-started.md](docs/getting-started.md)
- **Component Reference** - [docs/components/README.md](docs/components/README.md)
- **Migration Guide** - [docs/migration-guide.md](docs/migration-guide.md)
- **Contributing Guide** - [docs/contributing.md](docs/contributing.md)
- **Component API** - See individual component stories in Storybook
- **Design Tokens** - [src/tokens/](src/tokens/)

## 🎨 Design Tokens

Access design tokens via JavaScript/TypeScript:

```typescript
import { colors, typography, spacing } from '@beautysmile/design-system/tokens'

// Colors
colors.primary.DEFAULT // '#0A2463' (Admin Deep Blue)
colors.accent.DEFAULT  // '#00A8CC' (Public Turquoise)

// Typography
typography.headings.h1 // { fontSize: '3rem', fontWeight: '700', ... }

// Spacing
spacing[4] // '16px'
```

Or via CSS custom properties:

```css
.my-element {
  color: var(--color-primary);
  font-family: var(--font-heading);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-md);
}
```

## 🏗️ Project Structure

```
beautysmile-design-system/
├── src/
│   ├── tokens/           # Design tokens (colors, typography, etc.)
│   ├── components/       # React components
│   │   ├── ui/           # Base UI components (Button, Card, etc.)
│   │   └── glass/        # Glass morphism components
│   ├── templates/        # Page templates
│   │   ├── admin/        # Admin templates (7 templates)
│   │   └── public/       # Public templates (5 templates)
│   ├── assets/           # Logo and image components
│   │   ├── logos/        # SVG logo files
│   │   ├── backgrounds/  # PNG background images
│   │   └── components/   # Asset React components
│   ├── utils/            # Utility functions (cn, etc.)
│   └── styles/           # Global CSS
├── templates/            # Git starter templates
│   ├── admin-dashboard/  # Complete admin project
│   ├── public-platform/  # Complete public project
│   └── hybrid/           # Combined admin + public project
├── .storybook/           # Storybook configuration
└── docs/                 # Documentation
    ├── components/       # Component reference
    ├── getting-started.md
    ├── migration-guide.md
    └── contributing.md
```

## 🎯 Themes

### Admin Theme (Deep Blue)
- Primary Color: #0A2463 (Deep Blue)
- Use Case: HR/Admin dashboards, internal tools
- Features: Dark sidebar, professional aesthetic
- Templates: LoginAdmin, DashboardAdmin, CRUD, ListWithFilters, DetailView, Settings, Profile

### Public Theme (Turquoise)
- Primary Color: #00A8CC (Turquoise)
- Use Case: Public platforms, candidate areas, landing pages
- Features: Gradient backgrounds, glass morphism effects
- Templates: LandingPage, LoginPublic, DashboardClient, MultiStepForm, PublicProfile

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/fercosnt/design-system.git
cd design-system

# Install dependencies
npm install

# Start Storybook
npm run storybook

# Build library
npm run build

# Lint
npm run lint

# Format
npm run format
```

### Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build library for production
- `npm run storybook` - Start Storybook dev server
- `npm run build-storybook` - Build static Storybook
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **GitHub** - [https://github.com/fercosnt/design-system](https://github.com/fercosnt/design-system)
- **NPM** - [https://www.npmjs.com/package/@beautysmile/design-system](https://www.npmjs.com/package/@beautysmile/design-system)
- **Storybook** - [https://beautysmile-design-system.vercel.app](https://beautysmile-design-system.vercel.app)
- **Beauty Smile** - [https://beautysmile.com](https://beautysmile.com)

---

Made with ❤️ by the Beauty Smile team
