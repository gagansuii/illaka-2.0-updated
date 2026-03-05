'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/'
    });
    if (!res) {
      setError('Unable to sign in');
      return;
    }
    if (res.error) {
      setError('Invalid credentials');
      return;
    }
    if (res.url) {
      window.location.href = res.url;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
        <p className="text-sm text-ink/60 dark:text-white/60">
          New here? <Link className="text-blue-600" href="/register">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
