# Contributing Guide

Thank you for considering contributing to Beauty Smile Design System!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/fercosnt/design-system.git
cd design-system

# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook
npm run storybook
```

## Project Structure

```
beautysmile-design-system/
├── src/
│   ├── tokens/          # Design tokens (colors, typography, etc.)
│   ├── components/      # React components
│   │   ├── ui/          # Base UI components
│   │   └── glass/       # Glass morphism components
│   ├── templates/       # Page templates
│   │   ├── admin/       # Admin templates
│   │   └── public/      # Public templates
│   ├── assets/          # Logo, images, asset components
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles
├── templates/           # Git starter templates
│   ├── admin-dashboard/
│   ├── public-platform/
│   └── hybrid/
├── docs/                # Documentation
└── .storybook/          # Storybook configuration
```

## Adding a New Component

### 1. Create Component File

Create `src/components/ui/MyComponent.tsx`:

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const myComponentVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'default-classes',
        special: 'special-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {}

export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(myComponentVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

MyComponent.displayName = 'MyComponent'
```

### 2. Export Component

Add to `src/components/ui/index.ts`:

```tsx
export * from './MyComponent'
```

### 3. Create Storybook Story

Create `src/components/ui/MyComponent.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MyComponent } from './MyComponent'

const meta: Meta<typeof MyComponent> = {
  title: 'Components/UI/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {
    children: 'My Component',
  },
}
```

### 4. Add Documentation

Add JSDoc comments to your component and create docs in `docs/components/`.

### 5. Test Your Component

- Visual test in Storybook
- Check TypeScript types
- Test responsive behavior
- Test accessibility (screen reader, keyboard navigation)

## Code Style

- Use TypeScript with strict mode
- Use React.forwardRef for all components
- Use class-variance-authority for variants
- Follow existing naming conventions
- Add JSDoc comments
- Use Tailwind CSS classes

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(components): add MyComponent
fix(button): correct hover state
docs(migration): update installation steps
chore(deps): update dependencies
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run linter: `npm run lint`
5. Test in Storybook: `npm run storybook`
6. Commit changes: `git commit -m "feat: add my feature"`
7. Push to your fork: `git push origin feature/my-feature`
8. Open a Pull Request

## Review Process

- PRs require at least one approval
- All checks must pass (linting, type checking)
- Storybook stories must be included for UI changes
- Documentation must be updated

## Questions?

Open an issue or discussion on GitHub.

Thank you for contributing! 🎉
