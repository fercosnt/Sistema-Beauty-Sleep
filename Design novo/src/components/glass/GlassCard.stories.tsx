/**
 * Glass Card Stories
 * Beauty Smile Design System
 */

import type { Meta, StoryObj } from '@storybook/react'
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
} from './GlassCard'
import { GlassButton } from './GlassButton'

const meta = {
  title: 'Components/Glass/GlassCard',
  component: GlassCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'gradient',
      values: [
        {
          name: 'gradient',
          value: 'linear-gradient(135deg, #35BFAD 0%, #00109E 100%)',
        },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['light', 'dark'],
    },
    blur: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof GlassCard>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// BASIC EXAMPLES
// ============================================================================

export const Default: Story = {
  args: {
    variant: 'light',
    blur: 'md',
    padding: 'md',
    className: 'w-[350px]',
    children: (
      <>
        <GlassCardHeader>
          <GlassCardTitle>Glass Card</GlassCardTitle>
          <GlassCardDescription>
            A beautiful card with glass morphism effect
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent>
          <p className="text-sm text-white/80">
            This card has a frosted glass appearance that works best on gradient
            or image backgrounds.
          </p>
        </GlassCardContent>
      </>
    ),
  },
}

export const DarkVariant: Story = {
  args: {
    ...Default.args,
    variant: 'dark',
  },
}

export const WithFooter: Story = {
  args: {
    variant: 'light',
    blur: 'md',
    padding: 'lg',
    className: 'w-[400px]',
    children: (
      <>
        <GlassCardHeader>
          <GlassCardTitle>Welcome to Beauty Smile</GlassCardTitle>
          <GlassCardDescription>
            Create your account to get started
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent>
          <p className="text-sm text-white/80 mb-4">
            Join our platform and unlock amazing features.
          </p>
        </GlassCardContent>
        <GlassCardFooter className="gap-2">
          <GlassButton variant="light" className="flex-1">
            Learn More
          </GlassButton>
          <GlassButton variant="accent" className="flex-1">
            Sign Up
          </GlassButton>
        </GlassCardFooter>
      </>
    ),
  },
}

// ============================================================================
// BLUR VARIATIONS
// ============================================================================

export const LightBlur: Story = {
  args: {
    ...Default.args,
    blur: 'sm',
  },
}

export const HeavyBlur: Story = {
  args: {
    ...Default.args,
    blur: 'xl',
  },
}

// ============================================================================
// SHOWCASE
// ============================================================================

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <GlassCard variant="light" padding="md" className="w-[300px]">
        <GlassCardHeader>
          <GlassCardTitle className="text-lg">Light Glass</GlassCardTitle>
          <GlassCardDescription>
            15% white background
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent>
          <p className="text-sm text-white/80">
            Perfect for bright, clean interfaces
          </p>
        </GlassCardContent>
      </GlassCard>

      <GlassCard variant="dark" padding="md" className="w-[300px]">
        <GlassCardHeader>
          <GlassCardTitle className="text-lg">Dark Glass</GlassCardTitle>
          <GlassCardDescription>
            30% black background
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent>
          <p className="text-sm text-white/80">
            Great for darker, more mysterious themes
          </p>
        </GlassCardContent>
      </GlassCard>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'gradient',
    },
  },
}

// ============================================================================
// REAL WORLD EXAMPLE
// ============================================================================

export const LoginCard: Story = {
  render: () => (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #35BFAD 0%, #00109E 100%)'
      }}
    >
      <GlassCard variant="light" blur="md" padding="lg" className="w-full max-w-md">
        <GlassCardHeader>
          <GlassCardTitle>Sign In</GlassCardTitle>
          <GlassCardDescription>
            Enter your credentials to access your account
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4">
          <div>
            <label className="text-sm text-white/90 block mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="m@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-white/90 block mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="••••••••"
            />
          </div>
        </GlassCardContent>
        <GlassCardFooter className="flex-col gap-2">
          <GlassButton variant="accent" className="w-full">
            Sign In
          </GlassButton>
          <GlassButton variant="light" className="w-full">
            Create Account
          </GlassButton>
        </GlassCardFooter>
      </GlassCard>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
