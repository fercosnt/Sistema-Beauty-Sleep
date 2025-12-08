/**
 * Alert Stories
 * Beauty Smile Design System
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Alert, AlertDescription, AlertTitle } from './Alert'
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info as InfoIcon,
} from 'lucide-react'

const meta = {
  title: 'Components/UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// VARIANTS
// ============================================================================

export const Default: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert variant="success" className="w-[400px]">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
}

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="w-[400px]">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action may have unintended consequences. Please review before
        proceeding.
      </AlertDescription>
    </Alert>
  ),
}

export const Error: Story = {
  render: () => (
    <Alert variant="error" className="w-[400px]">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again later.
      </AlertDescription>
    </Alert>
  ),
}

export const Info: Story = {
  render: () => (
    <Alert variant="info" className="w-[400px]">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        Check out our new features and updates.
      </AlertDescription>
    </Alert>
  ),
}

// ============================================================================
// WITHOUT TITLE
// ============================================================================

export const DescriptionOnly: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        Your session will expire in 5 minutes.
      </AlertDescription>
    </Alert>
  ),
}

// ============================================================================
// WITHOUT ICON
// ============================================================================

export const NoIcon: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertTitle>Simple Alert</AlertTitle>
      <AlertDescription>
        This alert doesn't have an icon.
      </AlertDescription>
    </Alert>
  ),
}

// ============================================================================
// ALL VARIANTS SHOWCASE
// ============================================================================

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 p-8 w-[500px]">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>
          This is the default variant of the alert component.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Operation completed successfully.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Please review this before continuing.
        </AlertDescription>
      </Alert>

      <Alert variant="error">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while processing your request.
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Here's some helpful information for you.
        </AlertDescription>
      </Alert>
    </div>
  ),
}
