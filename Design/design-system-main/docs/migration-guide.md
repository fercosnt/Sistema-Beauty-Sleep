# Migration Guide

Guide for adding Beauty Smile Design System to an existing project.

## Installation

```bash
npm install @beautysmile/design-system
```

## 1. Configure Tailwind CSS

### Install Tailwind (if not already installed)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Update `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@beautysmile/design-system/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        // Choose your theme: Admin (Deep Blue) or Public (Turquoise)

        // Option 1: Admin Theme
        primary: {
          DEFAULT: '#0A2463',
          50: '#E6EBF5',
          100: '#CCD7EB',
          // ... rest of scale
          900: '#020714',
        },

        // Option 2: Public Theme
        accent: {
          DEFAULT: '#00A8CC',
          50: '#E6F7FB',
          // ... rest of scale
          900: '#002329',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
```

## 2. Import Styles

In your main entry file (e.g., `main.tsx` or `App.tsx`):

```typescript
import '@beautysmile/design-system/styles'
import 'tailwindcss'
```

## 3. Start Using Components

```tsx
import { Button, Card, GlassCard } from '@beautysmile/design-system'

function MyPage() {
  return (
    <div>
      <Card>
        <Card.Header>
          <Card.Title>Hello</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Welcome to Beauty Smile!</p>
          <Button variant="primary">Get Started</Button>
        </Card.Content>
      </Card>
    </div>
  )
}
```

## 4. Gradual Migration Strategy

### Step 1: Install and Configure (Week 1)
- Install package
- Configure Tailwind
- Import styles

### Step 2: Migrate Simple Components (Week 2-3)
- Replace buttons
- Replace cards
- Replace inputs/forms

### Step 3: Migrate Complex Components (Week 4-5)
- Replace dialogs/modals
- Replace tables
- Replace navigation

### Step 4: Add Templates (Week 6+)
- Use pre-built templates for new pages
- Gradually replace existing pages

## 5. Coexistence with Legacy Code

The Design System can coexist with your existing components:

```tsx
// Old component
import { OldButton } from './old-components'

// New component
import { Button } from '@beautysmile/design-system'

function MixedPage() {
  return (
    <div>
      <OldButton>Legacy</OldButton>
      <Button variant="primary">New</Button>
    </div>
  )
}
```

## 6. TypeScript Support

The package includes full TypeScript definitions. No additional @types packages needed.

```tsx
import type { ButtonProps } from '@beautysmile/design-system'

const myButtonProps: ButtonProps = {
  variant: 'primary',
  size: 'lg',
}
```

## 7. Common Issues

### Issue: Styles not applying

**Solution:** Ensure Tailwind content paths include the design system:

```js
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  './node_modules/@beautysmile/design-system/dist/**/*.{js,mjs}', // ← Add this
]
```

### Issue: Icons not showing

**Solution:** Install lucide-react as a dependency:

```bash
npm install lucide-react
```

### Issue: Radix UI warnings

**Solution:** Radix UI components are included. No action needed.

## 8. Performance Tips

- Import only what you need:
  ```tsx
  // Good
  import { Button } from '@beautysmile/design-system'

  // Avoid (imports everything)
  import * as DS from '@beautysmile/design-system'
  ```

- Use code splitting for templates:
  ```tsx
  const Dashboard = lazy(() => import('./DashboardPage'))
  ```

## Need Help?

- Check [Component Documentation](./components/README.md)
- See [Git Templates](../templates/) for complete examples
- Open an issue on GitHub

