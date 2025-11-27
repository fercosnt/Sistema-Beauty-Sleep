/**
 * Button Stories
 * Beauty Smile Design System
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { ChevronRight, Download, Plus } from 'lucide-react'

const meta = {
  title: 'Components/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'accent',
        'destructive',
        'outline',
        'ghost',
        'link',
      ],
      description: 'Visual variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Size of the button',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state - shows spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// VARIANTS
// ============================================================================

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Accent Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

// ============================================================================
// SIZES
// ============================================================================

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const IconButton: Story = {
  args: {
    size: 'icon',
    variant: 'outline',
    children: <Plus className="h-4 w-4" />,
  },
}

// ============================================================================
// WITH ICONS
// ============================================================================

export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Download',
    leftIcon: <Download className="h-4 w-4" />,
  },
}

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Next',
    rightIcon: <ChevronRight className="h-4 w-4" />,
  },
}

export const WithBothIcons: Story = {
  args: {
    variant: 'accent',
    children: 'Continue',
    leftIcon: <Download className="h-4 w-4" />,
    rightIcon: <ChevronRight className="h-4 w-4" />,
  },
}

// ============================================================================
// STATES
// ============================================================================

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Loading...',
    isLoading: true,
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
}

// ============================================================================
// ALL VARIANTS SHOWCASE
// ============================================================================

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-8">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
}
