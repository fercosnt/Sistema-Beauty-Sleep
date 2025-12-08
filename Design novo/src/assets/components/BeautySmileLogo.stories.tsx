/**
 * Beauty Smile Logo Stories
 * Beauty Smile Design System
 */

import type { Meta, StoryObj } from '@storybook/react'
import { BeautySmileLogo } from './BeautySmileLogo'

const meta = {
  title: 'Assets/BeautySmileLogo',
  component: BeautySmileLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['icon', 'horizontal', 'vertical'],
      description: 'Logo type to display',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: 'Logo size',
    },
  },
} satisfies Meta<typeof BeautySmileLogo>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// LOGO TYPES
// ============================================================================

export const Icon: Story = {
  args: {
    type: 'icon',
    size: 'md',
  },
}

export const Horizontal: Story = {
  args: {
    type: 'horizontal',
    size: 'md',
  },
}

export const Vertical: Story = {
  args: {
    type: 'vertical',
    size: 'md',
  },
}

// ============================================================================
// SIZES
// ============================================================================

export const ExtraSmall: Story = {
  args: {
    type: 'horizontal',
    size: 'xs',
  },
}

export const Small: Story = {
  args: {
    type: 'horizontal',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    type: 'horizontal',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    type: 'horizontal',
    size: 'lg',
  },
}

export const ExtraLarge: Story = {
  args: {
    type: 'horizontal',
    size: 'xl',
  },
}

export const XXLarge: Story = {
  args: {
    type: 'horizontal',
    size: '2xl',
  },
}

// ============================================================================
// ALL VARIATIONS SHOWCASE
// ============================================================================

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">
          Icon Logo
        </h3>
        <BeautySmileLogo type="icon" size="lg" />
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">
          Horizontal Logo
        </h3>
        <BeautySmileLogo type="horizontal" size="lg" />
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">
          Vertical Logo
        </h3>
        <BeautySmileLogo type="vertical" size="lg" />
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      <div className="flex items-center gap-4">
        <span className="text-xs text-neutral-500 w-16">XS</span>
        <BeautySmileLogo type="horizontal" size="xs" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-neutral-500 w-16">SM</span>
        <BeautySmileLogo type="horizontal" size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-neutral-500 w-16">MD</span>
        <BeautySmileLogo type="horizontal" size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-neutral-500 w-16">LG</span>
        <BeautySmileLogo type="horizontal" size="lg" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-neutral-500 w-16">XL</span>
        <BeautySmileLogo type="horizontal" size="xl" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-neutral-500 w-16">2XL</span>
        <BeautySmileLogo type="horizontal" size="2xl" />
      </div>
    </div>
  ),
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

export const InNavbar: Story = {
  render: () => (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex items-center justify-between">
        <BeautySmileLogo type="horizontal" size="md" />
        <div className="flex gap-4 text-white">
          <a href="#" className="hover:text-accent transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            About
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

export const OnGradientBackground: Story = {
  render: () => (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #35BFAD 0%, #00109E 100%)',
      }}
    >
      <div className="text-center">
        <BeautySmileLogo type="horizontal" size="2xl" className="mb-4" />
        <p className="text-white text-lg">Welcome to Beauty Smile</p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

export const InFooter: Story = {
  render: () => (
    <footer className="bg-neutral-900 text-white p-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <BeautySmileLogo type="horizontal" size="lg" />
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-700 text-center text-sm text-neutral-400">
          © 2024 Beauty Smile. All rights reserved.
        </div>
      </div>
    </footer>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
