# Quick Start Guide

Get up and running with Beauty Smile Design System in 5 minutes.

## Option 1: Use a Starter Template (Fastest)

### 1. Clone and Copy Template

```bash
# Clone the repository
git clone https://github.com/fercosnt/design-system.git
cd design-system

# Copy the template you need
cp -r templates/admin-dashboard/ ../my-project
# OR
cp -r templates/public-platform/ ../my-project
# OR
cp -r templates/hybrid/ ../my-project
```

### 2. Install Dependencies

```bash
cd ../my-project
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Your app will be running at `http://localhost:5173`

### 4. Customize (Optional)

**Update Logo:**
- Replace logo files in `src/assets/`
- Or update `BeautySmileLogo` component props

**Change Theme Colors:**
Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#YOUR_COLOR',  // Change this
    // ... rest of scale
  },
}
```

**Update App Name:**
- Edit `index.html` title
- Update `package.json` name

---

## Option 2: Add to Existing Project

### 1. Install Package

```bash
npm install @beautysmile/design-system
npm install tailwindcss react react-dom
```

### 2. Import Styles

In your `main.tsx` or `App.tsx`:

```typescript
import '@beautysmile/design-system/styles'
```

### 3. Configure Tailwind

Create/update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@beautysmile/design-system/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A2463',
          50: '#E6EBF5',
          // ... add full scale
        },
        accent: {
          DEFAULT: '#00A8CC',
          // ... add full scale
        },
      },
    },
  },
  plugins: [],
} satisfies Config
```

### 4. Use Components

```tsx
import { Button, Card } from '@beautysmile/design-system/components'
import { GlassCard } from '@beautysmile/design-system/components'

function App() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Welcome</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>Start building with Beauty Smile!</p>
        <Button variant="primary">Get Started</Button>
      </Card.Content>
    </Card>
  )
}
```

---

## Next Steps

- **Explore Components**: Check out [Storybook](https://beautysmile-design-system.vercel.app)
- **Read Docs**: See [Component Reference](./components/README.md)
- **Migration Guide**: [Migrating existing projects](./migration-guide.md)
- **Contributing**: [How to contribute](./contributing.md)

## Troubleshooting

**Issue**: Tailwind styles not working
- ✅ Make sure you imported `@beautysmile/design-system/styles`
- ✅ Add design system path to Tailwind `content` array
- ✅ Restart your dev server

**Issue**: Components not found
- ✅ Check import path: `@beautysmile/design-system/components`
- ✅ Verify package is installed: `npm list @beautysmile/design-system`

**Issue**: TypeScript errors
- ✅ Make sure TypeScript is configured: `tsconfig.json`
- ✅ Install types: `npm install -D @types/react @types/react-dom`

---

**Need more help?** See the full [Documentation](../README.md)
