/**
 * Input & Textarea Stories
 * Beauty Smile Design System
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Label } from './Label'

const inputMeta = {
  title: 'Components/UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default inputMeta
type InputStory = StoryObj<typeof inputMeta>

//============================================================================
// INPUT STORIES
// ============================================================================

export const Default: InputStory = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="m@example.com" />
    </div>
  ),
}

export const WithValue: InputStory = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" defaultValue="John Doe" />
    </div>
  ),
}

export const Disabled: InputStory = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="disabled">Disabled</Label>
      <Input id="disabled" disabled placeholder="Disabled input" />
    </div>
  ),
}

export const FileUpload: InputStory = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="file">Upload File</Label>
      <Input id="file" type="file" />
    </div>
  ),
}

export const PasswordInput: InputStory = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" placeholder="Enter password" />
    </div>
  ),
}

export const SearchInput: InputStory = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="search">Search</Label>
      <Input id="search" type="search" placeholder="Search..." />
    </div>
  ),
}

// ============================================================================
// TEXTAREA STORIES
// ============================================================================

const textareaMeta = {
  title: 'Components/UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>

type TextareaStory = StoryObj<typeof textareaMeta>

export const TextareaDefault: TextareaStory = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  ),
}

export const TextareaWithValue: TextareaStory = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        defaultValue="I am a passionate developer who loves building amazing products."
      />
    </div>
  ),
}

export const TextareaDisabled: TextareaStory = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="disabled-textarea">Disabled</Label>
      <Textarea
        id="disabled-textarea"
        disabled
        placeholder="This textarea is disabled"
      />
    </div>
  ),
}

export const TextareaLarge: TextareaStory = {
  render: () => (
    <div className="w-[500px] space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        className="min-h-[150px]"
        placeholder="Enter a detailed description..."
      />
    </div>
  ),
}

// Export Textarea meta for Storybook
export { textareaMeta }
