/**
 * Storybook Main Configuration
 * Beauty Smile Design System
 *
 * Configures Storybook with Vite, React, and essential addons
 */

import type { StorybookConfig } from '@storybook/react-vite'
import { join, dirname } from 'path'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  // Stories location
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  // Addons
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'), // Accessibility testing
  ],

  // Framework
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  // Documentation
  docs: {},

  // TypeScript configuration
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },

  // Core options
  core: {
    disableTelemetry: true,
  },

  // Static directories for assets
  staticDirs: ['../src/assets'],

  // Vite options
  viteFinal: async (config) => {
    // Customize Vite config here
    return config
  },
}

export default config
