/**
 * Background Image Stories
 * Beauty Smile Design System
 */

import type { Meta, StoryObj } from '@storybook/react'
import { BackgroundImage } from './BackgroundImage'
import { BeautySmileLogo } from './BeautySmileLogo'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from '../../components/glass/GlassCard'
import { GlassButton } from '../../components/glass/GlassButton'

const meta = {
  title: 'Assets/BackgroundImage',
  component: BackgroundImage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    background: {
      control: 'select',
      options: ['gradient1', 'gradient2'],
      description: 'Background image to display',
    },
    overlayColor: {
      control: 'color',
      description: 'Overlay color (CSS color)',
    },
    overlayOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Overlay opacity (0 to 1)',
    },
    backgroundSize: {
      control: 'select',
      options: ['cover', 'contain', 'auto'],
    },
  },
} satisfies Meta<typeof BackgroundImage>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// BASIC EXAMPLES
// ============================================================================

export const Gradient1: Story = {
  args: {
    background: 'gradient1',
    children: (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-white text-4xl font-bold">Background Gradient 1</h1>
      </div>
    ),
  },
}

export const Gradient2: Story = {
  args: {
    background: 'gradient2',
    children: (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-white text-4xl font-bold">Background Gradient 2</h1>
      </div>
    ),
  },
}

// ============================================================================
// WITH OVERLAY
// ============================================================================

export const WithDarkOverlay: Story = {
  args: {
    background: 'gradient1',
    overlayColor: '#000000',
    overlayOpacity: 0.4,
    children: (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-white text-5xl font-bold mb-4">
            Dark Overlay
          </h1>
          <p className="text-white/90 text-xl">
            40% black overlay for better text readability
          </p>
        </div>
      </div>
    ),
  },
}

export const WithLightOverlay: Story = {
  args: {
    background: 'gradient2',
    overlayColor: '#FFFFFF',
    overlayOpacity: 0.2,
    children: (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-white text-5xl font-bold mb-4">
            Light Overlay
          </h1>
          <p className="text-white/90 text-xl">
            20% white overlay for a softer look
          </p>
        </div>
      </div>
    ),
  },
}

export const WithColoredOverlay: Story = {
  args: {
    background: 'gradient1',
    overlayColor: '#00109E',
    overlayOpacity: 0.3,
    children: (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-white text-5xl font-bold mb-4">
            Colored Overlay
          </h1>
          <p className="text-white/90 text-xl">
            30% primary blue overlay
          </p>
        </div>
      </div>
    ),
  },
}

// ============================================================================
// REAL WORLD EXAMPLES
// ============================================================================

export const HeroSection: Story = {
  args: {
    background: 'gradient1',
    overlayColor: '#000000',
    overlayOpacity: 0.3,
    children: (
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          <h1 className="text-white text-6xl font-heading font-bold mb-6">
            Welcome to Beauty Smile
          </h1>
          <p className="text-white/90 text-xl mb-8 leading-relaxed">
            Transform your smile with our state-of-the-art dental care services.
            We're committed to providing exceptional treatment in a comfortable
            environment.
          </p>
          <div className="flex gap-4">
            <GlassButton variant="accent" size="lg">
              Get Started
            </GlassButton>
            <GlassButton variant="light" size="lg">
              Learn More
            </GlassButton>
          </div>
        </div>
      </div>
    ),
  },
}

export const LoginPage: Story = {
  args: {
    background: 'gradient2',
    overlayColor: '#000000',
    overlayOpacity: 0.2,
    children: (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard variant="light" blur="lg" padding="lg" className="w-full max-w-md">
          <GlassCardHeader className="text-center mb-6">
            <BeautySmileLogo type="horizontal" size="lg" className="mx-auto mb-4" />
            <GlassCardTitle>Welcome Back</GlassCardTitle>
            <GlassCardDescription>
              Sign in to your Beauty Smile account
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent className="space-y-4">
            <div>
              <label className="text-sm text-white/90 block mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-sm text-white/90 block mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="••••••••"
              />
            </div>
            <GlassButton variant="accent" className="w-full" size="lg">
              Sign In
            </GlassButton>
            <p className="text-center text-sm text-white/70">
              Don't have an account?{' '}
              <a href="#" className="text-white hover:text-white/90 underline">
                Sign up
              </a>
            </p>
          </GlassCardContent>
        </GlassCard>
      </div>
    ),
  },
}

export const LandingPage: Story = {
  args: {
    background: 'gradient1',
    overlayColor: '#00109E',
    overlayOpacity: 0.15,
    children: (
      <div className="min-h-screen">
        {/* Navbar */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <BeautySmileLogo type="horizontal" size="lg" />
            <div className="hidden md:flex gap-6">
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                Services
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                About
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                Contact
              </a>
            </div>
            <GlassButton variant="light">
              Book Appointment
            </GlassButton>
          </div>
        </nav>

        {/* Hero */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-6xl md:text-7xl font-heading font-bold mb-6">
              Your Perfect Smile Starts Here
            </h1>
            <p className="text-white/90 text-xl mb-12 leading-relaxed">
              Experience world-class dental care with our team of expert
              professionals dedicated to your oral health and beautiful smile.
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <GlassCard variant="light" padding="lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">🦷</div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    General Dentistry
                  </h3>
                  <p className="text-white/80 text-sm">
                    Comprehensive dental care for the whole family
                  </p>
                </div>
              </GlassCard>

              <GlassCard variant="light" padding="lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Cosmetic Dentistry
                  </h3>
                  <p className="text-white/80 text-sm">
                    Transform your smile with aesthetic treatments
                  </p>
                </div>
              </GlassCard>

              <GlassCard variant="light" padding="lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">🔬</div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Advanced Technology
                  </h3>
                  <p className="text-white/80 text-sm">
                    State-of-the-art equipment and techniques
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    ),
  },
}
