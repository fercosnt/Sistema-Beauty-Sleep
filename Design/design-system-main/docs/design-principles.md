# Design Principles

This document outlines the core design principles and guidelines for using the Beauty Smile Design System effectively.

## Table of Contents

- [Theme Selection](#theme-selection)
- [Glass Morphism Guidelines](#glass-morphism-guidelines)
- [Typography Hierarchy](#typography-hierarchy)
- [Grid System & Spacing](#grid-system--spacing)
- [Color Usage](#color-usage)
- [Accessibility](#accessibility)

---

## Theme Selection

### Admin Theme (Deep Blue #00109E)

**When to use:**
- HR and Admin dashboards
- Internal management tools
- Back-office applications
- Employee-facing interfaces
- Data-heavy applications

**Characteristics:**
- Professional and authoritative
- High contrast for readability
- Dark sidebar navigation
- Emphasis on functionality over aesthetics
- Minimal use of gradients

**Example Applications:**
- HR dashboard for managing candidates
- Admin panel for system configuration
- Internal reporting tools
- Employee management systems

```tsx
// Admin Theme Example
<div className="bg-admin-bg min-h-screen">
  <Sidebar className="bg-admin-sidebar" />
  <Main>
    <Button variant="primary">Admin Action</Button>
  </Main>
</div>
```

---

### Public Theme (Turquoise #35BFAD)

**When to use:**
- Public-facing platforms
- Candidate/user portals
- Landing pages
- Marketing sites
- Customer-facing applications

**Characteristics:**
- Modern and approachable
- Gradient backgrounds
- Glass morphism effects
- Vibrant and energetic
- Emphasis on visual appeal

**Example Applications:**
- Candidate portal for job applications
- Public company website
- Customer onboarding flows
- Marketing landing pages

```tsx
// Public Theme Example
<div
  className="min-h-screen"
  style={{
    background: 'linear-gradient(135deg, #35BFAD 0%, #00109E 100%)'
  }}
>
  <Card className="glass">
    <Button variant="accent">Get Started</Button>
  </Card>
</div>
```

---

### Hybrid Applications

For applications that serve both internal and external users:

1. **Route-based theming** - Different themes for different sections
2. **User role theming** - Theme based on user type
3. **Context switching** - Allow users to toggle themes

```tsx
// Route-based theming
function App() {
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className={isAdminRoute ? 'theme-admin' : 'theme-public'}>
      <Routes />
    </div>
  )
}
```

---

## Glass Morphism Guidelines

### When to Use Glass Morphism

**Appropriate:**
- Public theme interfaces
- Overlay modals and dialogs
- Cards on gradient backgrounds
- Navigation elements on images
- Feature highlights

**Avoid:**
- Admin theme interfaces (use solid backgrounds)
- Text-heavy content areas
- Data tables and grids
- Form inputs (can reduce readability)

### Glass Morphism Rules

1. **Background Requirements**
   - Only use on gradient or image backgrounds
   - Ensure sufficient contrast between glass and background

2. **Opacity Levels**
   - Use `rgba(255, 255, 255, 0.15)` for light glass
   - Use `rgba(255, 255, 255, 0.25)` for hover states
   - Use `rgba(0, 0, 0, 0.30)` for dark glass

3. **Backdrop Blur**
   - Standard: `backdrop-filter: blur(12px)`
   - Heavy: `backdrop-filter: blur(16px)`
   - Subtle: `backdrop-filter: blur(8px)`

4. **Borders**
   - Always include subtle border: `1px solid rgba(255, 255, 255, 0.2)`
   - Increases definition against background

5. **Content Contrast**
   - Ensure text is white or very light on glass elements
   - Avoid low-contrast color combinations

```css
/* Correct Glass Morphism */
.glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

/* With dark variant */
.glass-dark {
  background: rgba(0, 0, 0, 0.30);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## Typography Hierarchy

### Font Families

1. **Headings** - Montserrat (bold, professional)
2. **Body Text** - Inter (readable, modern)
3. **Code** - JetBrains Mono (monospace)

### Heading Scales

```
H1: 48px / 3rem    - Page titles
H2: 36px / 2.25rem - Section titles
H3: 30px / 1.875rem - Subsection titles
H4: 24px / 1.5rem  - Card titles
H5: 20px / 1.25rem - Small headings
H6: 18px / 1.125rem - Tiny headings
```

### Hierarchy Rules

1. **One H1 per page** - Main page title only
2. **Logical nesting** - Don't skip heading levels (H1 → H3)
3. **Font weight progression**
   - H1-H2: Bold (700)
   - H3-H4: Semibold (600)
   - H5-H6: Medium (500)

### Line Height Guidelines

- **Headings** - Tight (1.25)
- **Body text** - Normal (1.5)
- **Long-form content** - Relaxed (1.625)
- **Captions** - Normal (1.5)

### Text Styles

```tsx
// Page Title
<h1 className="font-heading text-5xl font-bold text-primary">
  Page Title
</h1>

// Section Heading
<h2 className="font-heading text-4xl font-bold text-neutral-900">
  Section Title
</h2>

// Body Text
<p className="font-sans text-base text-neutral-700 leading-relaxed">
  Body content with comfortable reading experience.
</p>

// Small Text / Caption
<span className="text-sm text-neutral-500">
  Secondary information
</span>
```

---

## Grid System & Spacing

### Spacing Scale

All spacing uses a **4px base unit** (0-32):

```
1  = 4px   (0.25rem)
2  = 8px   (0.5rem)
4  = 16px  (1rem)     ← Most common
6  = 24px  (1.5rem)
8  = 32px  (2rem)
12 = 48px  (3rem)
16 = 64px  (4rem)
```

### Spacing Usage

**Component Internal Spacing:**
- Buttons: `padding: spacing[4]` (16px)
- Cards: `padding: spacing[6]` (24px)
- Inputs: `padding: spacing[3]` (12px)

**Layout Spacing:**
- Between elements: `gap: spacing[4]` (16px)
- Between sections: `margin: spacing[16]` (64px)
- Page padding: `padding: spacing[6]` or `spacing[8]`

**Responsive Spacing:**

```tsx
<div className="p-4 md:p-6 lg:p-8">
  {/* Responsive padding: 16px → 24px → 32px */}
</div>
```

### Grid System

**Breakpoints:**
```
xs: 475px   - Large phones
sm: 640px   - Tablets
md: 768px   - Small laptops
lg: 1024px  - Desktops
xl: 1280px  - Large desktops
2xl: 1536px - Ultra-wide
```

**Container Widths:**
- Mobile: 100%
- Tablet (sm): 640px
- Desktop (lg): 1024px
- Wide (xl): 1280px

**Grid Columns:**

```tsx
// 12-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive: 1 col → 2 cols → 3 cols */}
</div>

// Asymmetric layout
<div className="grid grid-cols-12 gap-4">
  <aside className="col-span-3">Sidebar</aside>
  <main className="col-span-9">Content</main>
</div>
```

---

## Color Usage

### Primary Colors

- **Deep Blue (#00109E)** - Admin theme, primary CTAs, headers
- **Turquoise (#35BFAD)** - Public theme, accents, interactive elements
- **Gold (#BB965B)** - Premium features, highlights (use sparingly)

### Semantic Colors

- **Success (#10B981)** - Success messages, confirmations
- **Warning (#F59E0B)** - Warnings, alerts
- **Error (#EF4444)** - Errors, destructive actions
- **Info (#35BFAD)** - Information, neutral notifications

### Neutral Scale

Use neutral colors for:
- Text: neutral-900 (dark) to neutral-700 (muted)
- Backgrounds: neutral-50 (light) to neutral-100
- Borders: neutral-300
- Disabled states: neutral-400

### Color Contrast Rules

1. **Text on background** - Minimum 4.5:1 contrast ratio (WCAG AA)
2. **Large text** (18px+) - Minimum 3:1 contrast ratio
3. **Interactive elements** - Must be distinguishable from surroundings

```tsx
// Good contrast
<div className="bg-primary text-white">High contrast</div>

// Bad contrast (avoid)
<div className="bg-neutral-200 text-neutral-300">Low contrast</div>
```

---

## Accessibility

### Focus States

All interactive elements must have visible focus states:

```css
.button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(53, 191, 173, 0.3);
}
```

### Keyboard Navigation

- All interactive elements accessible via Tab
- Modals trap focus until closed
- Skip links for main content
- Logical tab order

### Screen Readers

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Include ARIA labels where needed
- Don't rely on color alone for meaning
- Provide text alternatives for images

### Motion Sensitivity

Respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Summary

1. **Choose the right theme** for your audience (Admin vs Public)
2. **Use glass morphism sparingly** - Only on gradients/images in Public theme
3. **Follow typography hierarchy** - Logical heading structure, appropriate sizes
4. **Maintain consistent spacing** - Use 4px-based scale throughout
5. **Ensure accessibility** - Focus states, keyboard navigation, screen readers
6. **Test with real users** - Validate design decisions with user feedback

For more detailed component usage, see the [Storybook documentation](https://beautysmile-design-system.vercel.app).
