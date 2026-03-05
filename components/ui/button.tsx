import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' && 'bg-ink text-pearl dark:bg-pearl dark:text-ink',
          variant === 'ghost' && 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10',
          variant === 'outline' && 'border border-ink/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10',
          size === 'sm' && 'h-9 px-4 text-sm',
          size === 'md' && 'h-11 px-6',
          size === 'lg' && 'h-12 px-7 text-lg',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
