# Ilaka Events Application

This is a Next.js 16+ application built with TypeScript, Prisma, NextAuth,
and various other libraries to provide event creation, RSVPs, AI search, and
payment support.

## Getting Started

1. **Copy example env and populate**
   ```bash
   cp .env.example .env
   # edit values (especially DATABASE_URL, NEXTAUTH_SECRET, etc.)
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Generate Prisma client and migrate**
   ```bash
   npx prisma migrate dev
   npm run prisma:generate
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## Docker

A `Dockerfile` and `docker-compose.yml` are provided for easy setup.

```bash
# build images and start containers
docker-compose up --build

# the app will be available on http://localhost:3000
```

Services included in `docker-compose`:
- **web**: Next.js application
- **db**: PostgreSQL (15)
- **redis**: Redis for rate limiting/session caching

## Environment Variables

See `.env.example` for all required vars. The application will throw an
error at startup if any required server-side variable is missing.

## Architectural Notes

* `lib/config.ts` exposes helpers that wrap `process.env` and enforce the
  presence and correct type of configuration values.
* Rate limiting is powered by Redis when `REDIS_URL` is set, otherwise an
  in-memory LRU cache is used as a fallback.
* API routes use `zod` to validate incoming JSON and respond with sensible
  error messages.
* The deprecated `middleware.ts` convention has been replaced with
  `proxy.ts` as required by Next.js 16+.
* The Prisma schema defines a `geography` column (via `Unsupported`) for
  fast geospatial queries. Ensure the `postgis` extension is installed on
  your Postgres instance (e.g. `CREATE EXTENSION IF NOT EXISTS postgis;`).

## Testing and Further Improvements

Adding automated tests for key flows (event creation, RSVP,
payment/webhook, AI search) is highly recommended.  Consider using
Playwright or Jest for unit/integration tests.

---

Happy building! 🚀
