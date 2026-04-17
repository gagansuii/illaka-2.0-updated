'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, Plus, User, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/discover', label: 'Discover' },
    { href: '/events/new', label: 'Host', icon: <Plus className="h-3.5 w-3.5 mr-1" /> },
  ];

  return (
    <header
      className={`z-40 px-4 pt-3 sm:px-6 ${
        isHome ? 'absolute inset-x-0 top-0' : 'sticky top-0'
      }`}
    >
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl px-4 transition-all duration-300 ${
          isHome
            ? 'nav-glass-hero py-2.5'
            : 'border border-[var(--line)] bg-[var(--surface-strong)] py-3 shadow-sm backdrop-blur-xl'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span
            className={`font-[family:var(--font-fraunces)] text-2xl leading-none tracking-tight transition-all duration-300 ${
              isHome ? 'nav-logo-gradient' : 'text-[var(--text)]'
            }`}
          >
            Illaka
          </span>
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className={`h-1.5 w-1.5 rounded-full mt-1 ${isHome ? 'bg-cyan-400' : 'bg-[var(--accent)]'}`}
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ href, label, icon }) => {
            const isActive = href === '/discover'
              ? pathname === '/discover'
              : pathname.startsWith(href);

            return (
              <div key={href} className="relative">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={`relative transition-all duration-200 ${
                    isHome
                      ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : isActive
                      ? 'text-[var(--accent)] bg-[var(--accent-soft)] hover:bg-[var(--accent-soft)]'
                      : 'text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                  }`}
                >
                  <Link href={href} className="flex items-center">
                    {icon}
                    {label}
                  </Link>
                </Button>
                {!isHome && isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`h-9 w-9 rounded-full p-0 transition-colors ${
              isHome
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : pathname === '/profile'
                ? 'text-[var(--accent)] bg-[var(--accent-soft)]'
                : 'hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
            }`}
            aria-label="Profile"
          >
            <Link href="/profile">
              <User className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`sm:hidden h-9 w-9 rounded-full p-0 ${
              isHome ? 'text-white/70 hover:bg-white/10' : 'hover:bg-[var(--accent-soft)]'
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`mx-auto mt-1 max-w-5xl rounded-2xl border p-3 sm:hidden ${
              isHome
                ? 'border-white/12 bg-black/60 backdrop-blur-2xl'
                : 'border-[var(--line)] bg-[var(--surface-strong)] shadow-md backdrop-blur-xl'
            }`}
          >
            <div className="flex flex-col gap-1">
              {[
                { href: '/discover', label: 'Discover' },
                { href: '/events/new', label: 'Host an event' },
                { href: '/profile', label: 'Profile' },
              ].map(({ href, label }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                  <Button
                    key={href}
                    asChild
                    variant="ghost"
                    size="sm"
                    className={`justify-start ${
                      isHome
                        ? 'text-white/85 hover:text-white hover:bg-white/10'
                        : isActive
                        ? 'text-[var(--accent)] bg-[var(--accent-soft)]'
                        : 'hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
