# Getting Started with Beauty Smile Design System

This guide will help you integrate the Beauty Smile Design System into your project, whether you're starting a new project or adding it to an existing one.

## Table of Contents

- [New Project Setup](#new-project-setup)
- [Existing Project Integration](#existing-project-integration)
- [Using Design Tokens](#using-design-tokens)
- [Using Components](#using-components)
- [Theming](#theming)
- [TypeScript Support](#typescript-support)
- [Troubleshooting](#troubleshooting)

---

## New Project Setup

### Option 1: Using Git Templates (Recommended for New Projects)

Clone one of our pre-configured templates:

```bash
# Admin Dashboard Template
git clone https://github.com/fercosnt/design-system.git --branch admin-template my-admin-app
cd my-admin-app
npm install

# Public Platform Template
git clone https://github.com/fercosnt/design-system.git --branch public-template my-public-app
cd my-public-app
npm install

# Hybrid Template (both themes)
git clone https://github.com/fercosnt/design-system.git --branch hybrid-template my-app
cd my-app
npm install
```

### Option 2: Create React App with Design System

```bash
# Create new React app
npx create-vite@latest my-app --template react-ts
cd my-app

# Install Design System
npm install @beautysmile/design-system

# Install peer dependencies
npm install react react-dom tailwindcss
```

Then follow the [Configuration](#configuration) steps below.

---

## Existing Project Integration

### Step 1: Install Package

```bash
npm install @beautysmile/design-system

# Or with yarn
yarn add @beautysmile/design-system

# Or with pnpm
pnpm add @beautysmile/design-system
```

### Step 2: Install Peer Dependencies

```bash
npm install react react-dom tailwindcss
```

### Step 3: Configure Tailwind CSS

If you don't have Tailwind CSS configured yet:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update your `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Include Design System components
    './node_modules/@beautysmile/design-system/**/*.{js,ts,jsx,tsx}',
  ],
  // Extend with Beauty Smile tokens
  presets: [
    require('@beautysmile/design-system/tailwind.config'),
  ],
  theme: {
    extend: {
      // Your custom overrides here
    },
  },
  plugins: [],
}

export default config
```

### Step 4: Import Global Styles

In your main entry file (`src/main.tsx` or `src/index.tsx`):

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Import Design System styles
import '@beautysmile/design-system/styles'

// Your app styles
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

In your `src/index.css`:

```css
@import 'tailwindcss';

/* Your custom styles */
```

### Step 5: Start Using Components

```tsx
import { Button, Card } from '@beautysmile/design-system/components'

function App() {
  return (
    <div className="p-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Hello Beauty Smile!
        </h1>
        <Button variant="primary" size="md">
          Get Started
        </Button>
      </Card>
    </div>
  )
}

export default App
```

---

## Using Design Tokens

### Importing Tokens

```typescript
import {
  colors,
  typography,
  spacing,
  shadows,
  animations,
} from '@beautysmile/design-system/tokens'
```

### JavaScript/TypeScript Usage

```typescript
// Colors
const primaryColor = colors.primary.DEFAULT // '#00109E'
const accentColor = colors.accent.DEFAULT // '#35BFAD'

// Typography
const h1Styles = typography.headings.h1
// { fontSize: '3rem', fontWeight: '700', ... }

// Spacing
const padding = spacing[4] // '16px'

// Shadows
const cardShadow = shadows.boxShadow.md

// Animations
const fadeInDuration = animations.duration.normal // '200ms'
```

### CSS Custom Properties

All tokens are available as CSS variables:

```css
.my-component {
  /* Colors */
  color: var(--color-primary);
  background: var(--color-accent);

  /* Typography */
  font-family: var(--font-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);

  /* Spacing */
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-8);
  border-radius: var(--radius-md);

  /* Shadows */
  box-shadow: var(--shadow-md);

  /* Animations */
  transition: var(--transition-all);
}
```

### Tailwind Utility Classes

```tsx
<div className="bg-primary text-white p-4 rounded-md shadow-md">
  <h1 className="font-heading text-2xl font-bold">
    Title
  </h1>
  <p className="font-sans text-base">
    Content
  </p>
</div>
```

---

## Using Components

### Basic Component Usage

```tsx
import {
  Button,
  Card,
  Input,
  Badge,
  Avatar,
} from '@beautysmile/design-system/components'

function MyComponent() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar src="/avatar.jpg" alt="User" />
        <div>
          <h3 className="font-semibold">John Doe</h3>
          <Badge variant="success">Active</Badge>
        </div>
      </div>

      <Input
        type="email"
        placeholder="Enter email"
        className="mb-4"
      />

      <Button variant="primary" size="lg" className="w-full">
        Submit
      </Button>
    </Card>
  )
}
```

### Component with Radix UI Primitives

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@beautysmile/design-system/components'

function MyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <p>Dialog content goes here</p>
      </DialogContent>
    </Dialog>
  )
}
```

### Tree-Shakeable Imports

Import only what you need for optimal bundle size:

```typescript
// Good: Tree-shakeable
import { Button } from '@beautysmile/design-system/components'

// Also good: Direct import
import { Button } from '@beautysmile/design-system/components/atoms/Button'

// Avoid: Imports entire library
import * as DS from '@beautysmile/design-system'
```

---

## Theming

### Admin Theme (Deep Blue)

Apply admin theme colors and styles:

```tsx
function AdminLayout() {
  return (
    <div className="min-h-screen bg-admin-bg">
      <aside className="bg-admin-sidebar text-white">
        {/* Sidebar content */}
      </aside>
      <main>
        <Button variant="primary">
          Admin Action
        </Button>
      </main>
    </div>
  )
}
```

### Public Theme (Turquoise)

Apply public theme with gradient backgrounds:

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
        <h1 className="text-white">Welcome</h1>
        <Button variant="accent">
          Get Started
        </Button>
      </div>
    </div>
  )
}
```

### Glass Morphism Effect

```tsx
<div className="glass p-6 rounded-xl backdrop-blur-md">
  <h2 className="text-white">Glass Card</h2>
  <p className="text-white/80">Content with frosted glass effect</p>
</div>
```

---

## TypeScript Support

### Importing Types

```typescript
import type { ButtonProps } from '@beautysmile/design-system/components'
import type { ColorToken } from '@beautysmile/design-system/tokens'

// Use in your components
interface MyComponentProps {
  button: ButtonProps
  color: ColorToken['primary']
}
```

### Type-Safe Component Props

```tsx
import { Button } from '@beautysmile/design-system/components'
import type { ButtonProps } from '@beautysmile/design-system/components'

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />
}

// TypeScript will enforce valid props
<MyButton variant="primary" size="md" /> // ✓ Valid
<MyButton variant="invalid" /> // ✗ Type error
```

---

## Troubleshooting

### Issue: Styles Not Loading

**Solution:** Ensure you've imported the global styles:

```typescript
import '@beautysmile/design-system/styles'
```

### Issue: Tailwind Classes Not Working

**Solution:** Add Design System path to Tailwind content:

```javascript
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  './node_modules/@beautysmile/design-system/**/*.{js,ts,jsx,tsx}',
]
```

### Issue: TypeScript Errors

**Solution:** Ensure TypeScript can find type definitions:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["@beautysmile/design-system"]
  }
}
```

### Issue: Build Errors with Vite

**Solution:** Configure Vite to handle Design System:

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['@beautysmile/design-system'],
  },
})
```

### Issue: CSS Variables Not Available

**Solution:** Import globals.css explicitly:

```css
/* In your main CSS file */
@import '@beautysmile/design-system/styles/globals.css';
```

---

## Next Steps

- **Browse Components** - Explore the [Storybook](https://beautysmile-design-system.vercel.app) for all available components
- **Read API Docs** - Check component props and usage in the Storybook docs
- **View Examples** - See real-world usage in the [examples](../examples/) directory
- **Join Community** - Get help on [GitHub Discussions](https://github.com/fercosnt/design-system/discussions)

---

## Additional Resources

- [README](../README.md) - Project overview
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute
- [Changelog](../CHANGELOG.md) - Version history
- [Storybook](https://beautysmile-design-system.vercel.app) - Interactive docs
- [GitHub](https://github.com/fercosnt/design-system) - Source code

---

Need help? Open an issue on [GitHub](https://github.com/fercosnt/design-system/issues) or email design-system@beautysmile.com
