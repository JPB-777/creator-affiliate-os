# Contributing to AffiliateOS

Thanks for your interest in contributing! This guide will help you get set up and understand our conventions.

## Development Setup

1. **Fork and clone the repo**

```bash
git clone https://github.com/YOUR_USERNAME/affiliateos.git
cd affiliateos
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:
- `DATABASE_URL` -- A PostgreSQL connection string ([Neon](https://neon.tech) free tier works great)
- `BETTER_AUTH_SECRET` -- Generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL` -- `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL` -- `http://localhost:3000`

4. **Set up the database**

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. **Start the dev server**

```bash
npm run dev
```

## Code Conventions

### Project Structure

```
src/
  app/              # Next.js App Router pages and layouts
  components/
    ui/             # shadcn/ui base components
    dashboard/      # Dashboard-specific components
    urls/           # URL management components
    earnings/       # Earnings tracker components
    links/          # Link management components
  lib/
    db/             # Drizzle schema, connection, seed
    scanner/        # URL scanning engine (fetcher, parser, detector, checker)
    auth.ts         # Better Auth server config
    auth-client.ts  # Better Auth client config
    auth-utils.ts   # Auth helpers (requireUser, etc.)
    utils.ts        # Shared utilities (cn, etc.)
  server/
    actions/        # Server actions (mutations, "use server")
    queries/        # Read-only data fetchers (used in RSC)
```

### TypeScript

- Strict mode is enabled
- Use `@/` path alias for imports from `src/`
- Export types alongside schema tables: `type User = typeof user.$inferSelect`

### Server Actions

- All mutations go in `src/server/actions/` with `"use server"` directive
- Always call `requireUser()` for authentication
- Use `revalidatePath()` for cache invalidation after mutations

### Queries

- Read-only database operations go in `src/server/queries/`
- These are plain async functions called from React Server Components

### Components

- shadcn/ui components live in `src/components/ui/`
- Feature components go in `src/components/{feature}/`
- Client components must use `"use client"` directive
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes

### Styling

- Tailwind CSS v4
- shadcn/ui with base-nova style
- No custom CSS unless absolutely necessary

### Database

- Drizzle ORM with `pgTable` / `pgEnum` from `drizzle-orm/pg-core`
- Schema defined in `src/lib/db/schema.ts`
- Supports both Neon (serverless) and standard PostgreSQL drivers

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the conventions above
3. Run linting and build to verify:
   ```bash
   npm run lint
   npm run build
   ```
4. Write a clear PR description explaining **what** and **why**
5. Link any related issues
6. Wait for review

## Reporting Issues

When filing a bug report, please include:
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, browser)
- Any relevant error messages or logs

For feature requests, describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered
