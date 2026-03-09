# Self-Hosting AffiliateOS

This guide covers two deployment options: **Vercel + Neon** (recommended) and **Docker**.

## Prerequisites

- [Node.js 20+](https://nodejs.org) (for Vercel option)
- [Git](https://git-scm.com)
- A PostgreSQL database ([Neon](https://neon.tech) free tier recommended) or [Docker](https://docker.com)

## Option 1: Vercel + Neon (Recommended)

The easiest way to deploy. Both Vercel and Neon offer generous free tiers.

### 1. Create a Neon Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)

### 2. Fork and Deploy to Vercel

1. Fork the [AffiliateOS repository](https://github.com/YOUR_USERNAME/affiliateos) on GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your fork
3. Add these environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` to generate |
| `BETTER_AUTH_URL` | Your Vercel deployment URL (e.g., `https://affiliateos.vercel.app`) |
| `NEXT_PUBLIC_APP_URL` | Same as `BETTER_AUTH_URL` |

4. Deploy

### 3. Run Migrations

After deployment, run migrations locally connected to your Neon database:

```bash
git clone https://github.com/YOUR_USERNAME/affiliateos.git
cd affiliateos
npm install

# Create .env.local with your Neon DATABASE_URL
cp .env.example .env.local
# Edit .env.local

npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Update URLs

Go to your Vercel project settings and set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your actual deployment URL. Redeploy.

---

## Option 2: Docker

Full self-hosted stack with PostgreSQL included.

### 1. Clone and Configure

```bash
git clone https://github.com/YOUR_USERNAME/affiliateos.git
cd affiliateos
```

Create a `.env` file in the project root:

```env
POSTGRES_PASSWORD=your-secure-postgres-password
BETTER_AUTH_SECRET=your-random-secret-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate `BETTER_AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

### 2. Start the Containers

```bash
docker compose up -d --build
```

This starts:
- **PostgreSQL 16** on port 5432
- **AffiliateOS** on port 3000

### 3. Run Migrations and Seed

```bash
# Wait for containers to be ready, then run migrations
docker compose exec app npx drizzle-kit generate
docker compose exec app npx drizzle-kit migrate
docker compose exec app npx tsx src/lib/db/seed.ts
```

### 4. Access

Open [http://localhost:3000](http://localhost:3000) and create your account.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DB_DRIVER` | No | `neon` or `postgres`. Auto-detected from URL if not set |
| `BETTER_AUTH_SECRET` | Yes | Random secret for signing auth tokens. Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Yes | Canonical URL of your deployment (server-side) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of your deployment (client-side) |

For local development, set both URL variables to `http://localhost:3000`.

## Database Migrations

AffiliateOS uses [Drizzle ORM](https://orm.drizzle.team) for database management.

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply pending migrations
npm run db:migrate

# Seed affiliate networks (safe to re-run)
npm run db:seed

# Open Drizzle Studio (visual database browser)
npm run db:studio
```

The schema is defined in `src/lib/db/schema.ts`. Migration files are output to `./migrations/`.

## Updating

### Vercel + Neon

Pull the latest changes to your fork and Vercel will auto-deploy. If there are schema changes:

```bash
git pull upstream main
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Docker

```bash
git pull origin main
docker compose up -d --build
docker compose exec app npx drizzle-kit generate
docker compose exec app npx drizzle-kit migrate
docker compose exec app npx tsx src/lib/db/seed.ts
```
