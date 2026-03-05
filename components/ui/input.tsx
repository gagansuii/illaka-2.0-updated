import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-2 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/50 focus:border-ink/40 dark:border-white/10 dark:bg-white/5 dark:text-pearl dark:placeholder:text-white/40',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
