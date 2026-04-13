'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export function DialogContent({ className, ...props }: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(14,20,27,0.38)] backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[0_32px_90px_rgba(17,24,39,0.18)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-8 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-8 sm:bottom-6 sm:left-auto sm:right-6 sm:top-6 sm:w-[28rem] sm:max-h-none sm:rounded-[2rem] sm:border sm:data-[state=closed]:slide-out-to-right-8 sm:data-[state=open]:slide-in-from-right-8',
          className
        )}
        {...props}
      />
    </DialogPrimitive.Portal>
  );
}
