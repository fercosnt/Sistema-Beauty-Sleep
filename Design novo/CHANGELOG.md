# Changelog

All notable changes to the Beauty Smile Design System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial design system setup
- Design tokens (colors, typography, spacing, shadows, animations)
- Tailwind CSS configuration with custom tokens
- Storybook 8.x setup with custom theme
- ESLint and Prettier configuration
- Project documentation (README, CONTRIBUTING)

## [0.1.0] - 2025-01-22

### Added

#### Fase 1: Fundação e Estrutura
- **Design Tokens**
  - Color palette (primary, secondary, accent, neutral, semantic, chart)
  - Typography system (fonts, sizes, weights, line heights, heading styles)
  - Spacing scale (1-32 based on 4px)
  - Shadow system (5 levels: sm, md, lg, xl, 2xl)
  - Animation keyframes (fadeIn, slideIn, scaleIn, pulse, spin, shimmer)
  - Glass morphism styles (bg-glass-white, bg-glass-dark)
- **Build System**
  - Vite 6.3 based library build
  - TypeScript 5.6 with strict mode
  - Dual module formats (ESM + CommonJS)
  - Modular exports (tokens, components, templates, assets, styles)
  - Type declarations (.d.ts) generation
- **Development Tools**
  - Storybook 8.x with custom Beauty Smile theme
  - ESLint configuration for TypeScript/React
  - Prettier with Tailwind CSS plugin
  - NPM scripts (dev, build, storybook, lint, format)
- **Documentation**
  - Comprehensive README with quickstart
  - Design principles guide
  - Getting started guide
  - LICENSE (MIT)

#### Fase 2: Componentização
- **UI Components (18+ components)**
  - Button (7 variants, 4 sizes, loading state, icons)
  - Card with subcomponents (Header, Title, Description, Content, Footer)
  - Input, Textarea, Label, Checkbox
  - Alert (5 variants), Badge (7 variants)
  - Dialog with Radix UI primitives
  - Table with full structure
  - All components with TypeScript + JSDoc
- **Glass Morphism Components (5 components)**
  - Glass (base component, 2 variants, 4 blur levels)
  - GlassCard with subcomponents
  - GlassPanel (6 sizes)
  - GlassButton (4 variants)
  - GlassNavbar with Brand, Nav, Link subcomponents
- **Asset Components (3 components)**
  - BeautySmileLogo (3 types: icon, horizontal, vertical; 7 sizes)
  - BackgroundImage (with overlay system)
  - ImageWithFallback (with loading and fallback states)
  - 3 SVG logos + 2 PNG backgrounds integrated
- **Utilities**
  - cn() function for className merging
  - useIsMobile() hook for mobile detection
- **Storybook Stories**
  - 12+ stories with comprehensive examples

#### Fase 3: Templates
- **Admin Templates (7 templates)** - Deep Blue Theme
  - LoginAdminTemplate (glass morphism login)
  - DashboardAdminTemplate (sidebar, metrics grid)
  - CRUDTemplate (generic form with validation)
  - ListWithFiltersTemplate (table, filters, pagination, bulk actions)
  - DetailViewTemplate (tabs/sections)
  - SettingsTemplate (multiple sections, tabs/stacked layouts)
  - ProfileTemplate (with edit mode, avatar upload)
- **Public Templates (5 templates)** - Turquoise Theme
  - LandingPageTemplate (hero, features, CTAs)
  - LoginPublicTemplate (login/signup with glass)
  - DashboardClientTemplate (client dashboard with metrics)
  - MultiStepFormTemplate (wizard with stepper, progress bar)
  - PublicProfileTemplate (public user profile)
- **Template Features**
  - All fully typed with TypeScript and JSDoc
  - Comprehensive prop interfaces
  - Support for both admin (Deep Blue) and public (Turquoise) themes
  - 2 Storybook stories with multiple variations

#### Fase 4: Git Templates
- **Admin Dashboard Template** (15 files)
  - Complete React + Vite project with Deep Blue theme
  - Pages: Login, Dashboard, Settings
  - Mock authentication service
  - Full TypeScript, Tailwind CSS 4 config
  - beautysmile.config.ts
  - Comprehensive README
- **Public Platform Template** (14 files)
  - Complete React + Vite project with Turquoise theme
  - Pages: Landing, Login, Dashboard
  - Mock authentication
  - Tailwind CSS 4 with public theme
- **Hybrid Template** (17 files)
  - Combined admin + public project
  - Separate routes: /admin/* and /public/*
  - Role-based authentication (admin/user)
  - Both themes in one project
  - Role-based access control

#### Fase 5: Build Configuration & Documentation
- **Build Configuration**
  - Vite library mode with multiple entry points
  - CSS extraction to styles/globals.css
  - Source maps generation
  - ESBuild minification
  - External peer dependencies
- **NPM Package Configuration**
  - Modular exports: ./, ./tokens, ./components, ./templates, ./assets, ./styles
  - Peer dependencies: React 18.3+, Tailwind CSS 4+
  - Package metadata (keywords, author, license, repository)
  - Files included: dist, README, LICENSE
- **Documentation**
  - Component documentation guide (docs/components/README.md)
  - Migration guide for existing projects (docs/migration-guide.md)
  - Contributing guide (docs/contributing.md)
  - Asset type declarations (src/assets.d.ts)

### Infrastructure
- GitHub repository setup
- NPM package configuration (@beautysmile/design-system)
- 3 Git starter templates (admin-dashboard, public-platform, hybrid)
- Complete development environment

---

## Release Types

### Major Version (X.0.0)
- Breaking changes
- Major API changes
- Significant architectural changes

### Minor Version (0.X.0)
- New features
- New components
- Non-breaking enhancements
- New design tokens

### Patch Version (0.0.X)
- Bug fixes
- Documentation updates
- Performance improvements
- Dependency updates

---

## Categories

### Added
New features, components, or capabilities

### Changed
Changes to existing functionality

### Deprecated
Features marked for removal in future versions

### Removed
Removed features or capabilities

### Fixed
Bug fixes

### Security
Security-related changes

---

[Unreleased]: https://github.com/beautysmile/design-system/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/beautysmile/design-system/releases/tag/v0.1.0
