/**
 * Dialog Stories
 * Beauty Smile Design System
 */

import type { Meta, StoryObj } from '@storybook/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog'
import { Button } from './Button'
import { Input } from './Input'
import { Label } from './Label'

const meta = {
  title: 'Components/UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// BASIC DIALOG
// ============================================================================

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog. It provides additional context
            about what this dialog is for.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-neutral-600">
            Dialog content goes here. You can put any content inside the dialog.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// ============================================================================
// FORM DIALOG
// ============================================================================

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// ============================================================================
// CONFIRMATION DIALOG
// ============================================================================

export const DeleteConfirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// ============================================================================
// CUSTOM SIZE
// ============================================================================

export const LargeDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Large Dialog</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Large Dialog</DialogTitle>
          <DialogDescription>
            This dialog has a custom max-width of 3xl (768px).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-neutral-600 mb-4">
            You can customize the size of the dialog by adding className to
            DialogContent.
          </p>
          <div className="grid gap-4 grid-cols-2">
            <div className="p-4 border border-neutral-200 rounded">
              <h4 className="font-medium mb-2">Column 1</h4>
              <p className="text-sm text-neutral-600">Content for column 1</p>
            </div>
            <div className="p-4 border border-neutral-200 rounded">
              <h4 className="font-medium mb-2">Column 2</h4>
              <p className="text-sm text-neutral-600">Content for column 2</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
