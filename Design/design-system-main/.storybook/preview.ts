/**
 * Storybook Preview Configuration
 * Beauty Smile Design System
 *
 * Global decorators, parameters, and styles for all stories
 */

import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'
import theme from './theme'

const preview: Preview = {
  parameters: {
    // Controls addon
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },

    // Actions addon
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Backgrounds addon
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'dark',
          value: '#2D2E30',
        },
        {
          name: 'admin',
          value: '#00109E', // Admin theme background
        },
        {
          name: 'public',
          value: 'linear-gradient(135deg, #35BFAD 0%, #00109E 100%)', // Public theme gradient
        },
        {
          name: 'neutral',
          value: '#F8F9F9', // neutral-50
        },
      ],
    },

    // Viewport addon
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        laptop: {
          name: 'Laptop',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
        desktopWide: {
          name: 'Desktop Wide',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },

    // Layout
    layout: 'centered',

    // Docs
    docs: {
      theme,
      toc: true,
      source: {
        state: 'open',
      },
    },

    // Options
    options: {
      storySort: {
        order: [
          'Introduction',
          'Design Tokens',
          [
            'Colors',
            'Typography',
            'Spacing',
            'Shadows',
            'Animations',
            'Overview',
          ],
          'Components',
          ['Atoms', 'Molecules', 'Organisms'],
          'Templates',
          ['Admin Dashboard', 'Public Platform', 'Hybrid'],
          'Examples',
        ],
      },
    },
  },

  // Global decorators
  decorators: [],

  // Global types
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
          { value: 'admin', icon: 'admin', title: 'Admin' },
          { value: 'public', icon: 'globe', title: 'Public' },
        ],
        dynamicTitle: true,
      },
    },
  },

  tags: ['autodocs'],
}

export default preview
