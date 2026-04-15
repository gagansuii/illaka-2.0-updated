'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

const overlayMotionClasses =
  // Smooth, premium-feeling backdrop fade with custom easing.
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:duration-500 data-[state=closed]:duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]';

const contentMotionClasses =
  // Bottom sheet on mobile, right floating panel on desktop with gentle scale + opacity transitions.
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-bottom-6 data-[state=closed]:slide-out-to-bottom-6 data-[state=open]:duration-500 data-[state=closed]:duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=open]:scale-100 data-[state=closed]:scale-[0.985] md:data-[state=open]:slide-in-from-right-6 md:data-[state=closed]:slide-out-to-right-6 md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=closed]:slide-out-to-bottom-0';

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-[rgba(14,20,27,0.44)] backdrop-blur-[4px]', overlayMotionClasses, className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto overscroll-contain rounded-t-[2rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,var(--surface-strong)_24%,var(--surface-strong)_100%)] p-6 shadow-[0_30px_95px_rgba(15,23,42,0.26)] outline-none will-change-[transform,opacity] [-webkit-overflow-scrolling:touch] touch-pan-y dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.55)_0%,var(--surface-strong)_24%,var(--surface-strong)_100%)] md:bottom-6 md:left-auto md:right-6 md:top-6 md:w-[30rem] md:max-h-none md:rounded-[2rem]',
        contentMotionClasses,
        className
      )}
      {...props}
    />
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-tight tracking-[-0.01em] text-[var(--text)]', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm leading-6 text-muted', className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
