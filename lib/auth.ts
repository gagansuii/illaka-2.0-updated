import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getEnv } from './config';

// NEXTAUTH_SECRET must be set in production; use the helper to throw if it's missing
type Nullable = string | undefined;
let authSecret: Nullable;
try {
  authSecret = getEnv('NEXTAUTH_SECRET');
} catch {
  // allow default in dev
  authSecret = process.env.NODE_ENV === 'production' ? undefined : 'dev-secret';
}

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export const authOptions: NextAuthOptions = {
  // Persist login across refresh/revisit using NextAuth JWT httpOnly cookies.
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE_SECONDS },
  jwt: { maxAge: SESSION_MAX_AGE_SECONDS },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const normalizedEmail = credentials.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  },
  secret: authSecret
};
