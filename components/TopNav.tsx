'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';

export function TopNav() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-pearl/80 dark:bg-ink/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.history.back()} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.history.forward()} aria-label="Go forward">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Link href="/" className="ml-2 text-lg font-semibold tracking-wide">ILAKA</Link>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/events/new">
          <Button size="sm">Host Event</Button>
        </Link>
        <Link href="/profile">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" aria-label="Profile">
            <User className="h-4 w-4" />
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
