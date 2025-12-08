# Components Documentation

Complete reference for all Beauty Smile Design System components.

## Component Categories

### UI Components (Shadcn/UI)
Base UI components built with Radix UI primitives.

- **[Button](./button.md)** - Versatile button with 7 variants
- **[Card](./card.md)** - Container with header, content, footer
- **[Input](./input.md)** - Text input field
- **[Textarea](./textarea.md)** - Multi-line text input
- **[Label](./label.md)** - Form label
- **[Checkbox](./checkbox.md)** - Checkbox input
- **[Alert](./alert.md)** - Alert messages (5 variants)
- **[Badge](./badge.md)** - Status badges (7 variants)
- **[Dialog](./dialog.md)** - Modal dialogs
- **[Table](./table.md)** - Data tables

### Glass Morphism Components
Components with frosted glass aesthetic.

- **[Glass](./glass.md)** - Base glass component
- **[GlassCard](./glass-card.md)** - Card with glass effect
- **[GlassPanel](./glass-panel.md)** - Large panel with glass
- **[GlassButton](./glass-button.md)** - Button with glass effect
- **[GlassNavbar](./glass-navbar.md)** - Navigation with glass

### Asset Components
Logo and image components.

- **[BeautySmileLogo](./logo.md)** - Logo component (3 types, 7 sizes)
- **[BackgroundImage](./background.md)** - Full-screen backgrounds with overlay
- **[ImageWithFallback](./image.md)** - Image with error handling

## Usage Examples

### Basic Button

```tsx
import { Button } from '@beautysmile/design-system'

function MyComponent() {
  return (
    <Button variant="primary" size="lg">
      Click Me
    </Button>
  )
}
```

### Glass Card

```tsx
import { GlassCard } from '@beautysmile/design-system'

function Hero() {
  return (
    <div className="bg-gradient-to-br from-accent to-primary p-12">
      <GlassCard variant="light" blur="lg">
        <h1 className="text-white text-4xl font-bold">Welcome</h1>
        <p className="text-white/90">Beautiful glass morphism effect</p>
      </GlassCard>
    </div>
  )
}
```

### Logo

```tsx
import { BeautySmileLogo } from '@beautysmile/design-system'

function Header() {
  return (
    <header>
      <BeautySmileLogo type="horizontal" size="md" />
    </header>
  )
}
```

## Component Props

All components are fully typed with TypeScript and include comprehensive JSDoc documentation. Use your IDE's autocomplete to explore available props.

## Accessibility

All components follow WCAG 2.1 AA guidelines and include proper ARIA attributes for screen readers.

## Customization

Components use Tailwind CSS classes and can be customized via className prop or by modifying the Tailwind theme in your project.

