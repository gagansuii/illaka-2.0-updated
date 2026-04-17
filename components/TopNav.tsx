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
    <header
      className={`z-40 px-4 pt-3 sm:px-6 ${
        isHome
          ? 'absolute inset-x-0 top-0'          // sits on top of the hero image
          : 'sticky top-0'
      }`}
    >
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 backdrop-blur-md transition-colors ${
          isHome
            ? 'border border-white/10 bg-black/10'   // fully transparent on hero
            : 'border border-[var(--line)] bg-[var(--surface-strong)] shadow-sm'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className={`font-[family:var(--font-fraunces)] text-2xl leading-none tracking-tight ${
              isHome ? 'text-white' : 'text-[var(--text)]'
            }`}
          >
            Illaka
          </span>
          <span
            className={`hidden sm:inline-block h-1.5 w-1.5 rounded-full mt-1 ${
              isHome ? 'bg-[var(--accent)]' : 'bg-[var(--accent)]'
            }`}
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={
              isHome
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : pathname === '/discover'
                ? 'text-[var(--accent)]'
                : ''
            }
          >
            <Link href="/discover">Discover</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={
              isHome
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : pathname.startsWith('/events/new')
                ? 'text-[var(--accent)]'
                : ''
            }
          >
            <Link href="/events/new">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Host
            </Link>
          </Button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`h-9 w-9 rounded-full p-0 ${isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : ''}`}
            aria-label="Profile"
          >
            <Link href="/profile">
              <User className="h-4 w-4" />
            </Link>
          </Button>
          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="sm"
            className={`sm:hidden h-9 w-9 rounded-full p-0 ${isHome ? 'text-white/80 hover:bg-white/10' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className={`mx-auto mt-1 max-w-5xl rounded-2xl border p-3 backdrop-blur-xl sm:hidden ${
            isHome
              ? 'border-white/15 bg-black/40'
              : 'border-[var(--line)] bg-[var(--surface-strong)] shadow-sm'
          }`}
        >
          <div className="flex flex-col gap-1">
            {[
              { href: '/discover', label: 'Discover' },
              { href: '/events/new', label: 'Host an event' },
              { href: '/profile', label: 'Profile' },
            ].map(({ href, label }) => (
              <Button
                key={href}
                asChild
                variant="ghost"
                size="sm"
                className={`justify-start ${isHome ? 'text-white/85 hover:text-white hover:bg-white/10' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
