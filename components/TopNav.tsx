'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, Plus, User, X } from 'lucide-react';
import { useState } from 'react';

export function TopNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 backdrop-blur-xl shadow-sm">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-[family:var(--font-fraunces)] text-2xl leading-none tracking-tight text-[var(--text)]">
            Illaka
          </span>
          <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-1" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className={pathname === '/discover' ? 'text-[var(--accent)]' : ''}>
            <Link href="/discover">Discover</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className={pathname.startsWith('/events/new') ? 'text-[var(--accent)]' : ''}>
            <Link href="/events/new">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Host
            </Link>
          </Button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0" aria-label="Profile">
            <Link href="/profile">
              <User className="h-4 w-4" />
            </Link>
          </Button>
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden h-9 w-9 rounded-full p-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="mx-auto mt-1 max-w-5xl rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-3 backdrop-blur-xl shadow-sm sm:hidden">
          <div className="flex flex-col gap-1">
            <Button asChild variant="ghost" size="sm" className="justify-start" onClick={() => setMobileOpen(false)}>
              <Link href="/discover">Discover</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="justify-start" onClick={() => setMobileOpen(false)}>
              <Link href="/events/new">Host an event</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="justify-start" onClick={() => setMobileOpen(false)}>
              <Link href="/profile">Profile</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
