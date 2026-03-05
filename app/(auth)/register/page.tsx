'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      setError(data?.error ?? 'Unable to register');
      return;
    }
    const signInRes = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/' });
    if (signInRes?.error) {
      setError('Account created, but sign-in failed. Please sign in manually.');
      return;
    }
    window.location.href = signInRes?.url ?? '/';
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Create your ILAKA</h1>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">Create account</Button>
        </form>
        <p className="text-sm text-ink/60 dark:text-white/60">
          Already have an account? <Link className="text-blue-600" href="/login">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
