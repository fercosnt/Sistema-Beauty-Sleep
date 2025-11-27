# Contributing to Beauty Smile Design System

Thank you for your interest in contributing to the Beauty Smile Design System! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/beautysmile-design-system.git
   cd beautysmile-design-system
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/beautysmile/design-system.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start Storybook**
   ```bash
   npm run storybook
   ```

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/component-name
# or
git checkout -b fix/issue-description
```

### 2. Make Changes

- Write code following our [Coding Standards](#coding-standards)
- Add tests for new features
- Update documentation as needed
- Create Storybook stories for components

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build library
npm run build

# Test Storybook
npm run storybook
```

### 4. Commit Changes

Follow our [Commit Convention](#commit-convention):

```bash
git add .
git commit -m "feat(button): add loading state variant"
```

### 5. Push and Create PR

```bash
git push origin feature/component-name
```

Then create a Pull Request on GitHub.

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all code
- Define proper types for props and return values
- Avoid `any` type when possible
- Export types alongside components

```typescript
// Good
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ... }) => {
  // ...
}

// Bad
export const Button = (props: any) => {
  // ...
}
```

### React Components

- Use functional components with hooks
- Prefer named exports over default exports
- Use `React.forwardRef` for components that need refs
- Implement proper prop validation with TypeScript

```typescript
import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default' }, ref) => {
    return (
      <div ref={ref} className={cn('card', className, variantClasses[variant])}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
```

### Styling

- Use Tailwind CSS utility classes
- Reference design tokens from `src/tokens/`
- Use `cn()` utility for conditional classes
- Avoid inline styles

```typescript
import { cn } from '@/utils/cn'
import { colors } from '@/tokens/colors'

// Good
<button className={cn(
  'px-4 py-2 rounded-md',
  variant === 'primary' && 'bg-primary text-white',
  variant === 'secondary' && 'bg-secondary text-white'
)} />

// Bad
<button style={{ backgroundColor: '#00109E' }} />
```

### File Organization

```
src/components/atoms/Button/
├── Button.tsx           # Component implementation
├── Button.stories.tsx   # Storybook stories
├── Button.test.tsx      # Unit tests (if applicable)
└── index.ts             # Re-exports
```

## 🧩 Component Guidelines

### Component Checklist

When creating a new component:

- [ ] Component implementation with TypeScript
- [ ] Proper prop types and interfaces
- [ ] Accessibility attributes (ARIA, keyboard navigation)
- [ ] Responsive design
- [ ] Theme support (Admin/Public)
- [ ] Storybook stories with all variants
- [ ] JSDoc comments for props
- [ ] Export from appropriate index file

### Accessibility (A11y)

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios (WCAG AA minimum)
- Use Radix UI primitives for complex components

### Example Component Structure

```typescript
/**
 * Button Component
 *
 * A versatile button component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={() => {}}>
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost'
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
  /** Loading state */
  isLoading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Left icon */
  leftIcon?: React.ReactNode
  /** Right icon */
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    children,
    className,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'button',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {leftIcon && <span className="button-icon-left">{leftIcon}</span>}
        {isLoading ? <Spinner /> : children}
        {rightIcon && <span className="button-icon-right">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

## 📜 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Scopes

Use component names or areas: `button`, `card`, `tokens`, `storybook`, etc.

### Examples

```
feat(button): add loading state variant

Add isLoading prop to Button component with spinner animation.
Includes Storybook stories and TypeScript types.

Closes #42
```

```
fix(card): correct border radius on glass variant

The glass variant was using wrong border radius token.
Changed from radius-sm to radius-md.
```

```
docs(readme): update installation instructions

Add NPM installation steps and peer dependencies.
```

## 🔍 Pull Request Process

### Before Submitting

1. **Test thoroughly**
   - Run `npm run lint`
   - Run `npm run type-check`
   - Run `npm run build`
   - Test in Storybook

2. **Update documentation**
   - Add/update Storybook stories
   - Update README if needed
   - Add JSDoc comments

3. **Check diff**
   - Review your changes
   - Remove debug code
   - Ensure no unrelated changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Storybook stories added/updated
- [ ] Build passes
```

### Review Process

1. Maintainers will review your PR
2. Address feedback and requested changes
3. Once approved, a maintainer will merge

## 🐛 Reporting Issues

### Bug Reports

Include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment (OS, browser, Node version)
- Code samples if relevant

### Feature Requests

Include:
- Clear use case
- Proposed API/interface
- Examples of similar features in other libraries
- Willingness to implement (if applicable)

## 📚 Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Storybook](https://storybook.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Questions?

- Open a [Discussion](https://github.com/beautysmile/design-system/discussions)
- Join our [Discord](https://discord.gg/beautysmile)
- Email: design-system@beautysmile.com

---

Thank you for contributing to Beauty Smile Design System! 🎉
