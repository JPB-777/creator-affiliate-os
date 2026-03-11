<div align="center">

# AffiliateOS

**Your affiliate links, under control.**

[![License: BSL 1.1](https://img.shields.io/badge/License-BSL%201.1-blue.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Scan your content for broken affiliate links, track earnings across 10+ networks, and stay FTC-compliant — all from one dashboard.

[Get Started](https://affiliateos.vercel.app) · [Self-Host](#self-hosting) · [Report Bug](https://github.com/JPB-777/creator-affiliate-os/issues)

</div>

---

## The Problem

If you're a blogger or content creator with affiliate links, you probably don't know:

- **Which links are broken** — Networks change URLs, programs shut down, links rot silently
- **How much you're losing** — Every broken affiliate link is a commission you'll never see
- **If you're FTC-compliant** — Missing disclosures can mean legal trouble

Most creators discover broken links when their revenue drops. AffiliateOS finds them before that happens.

## What It Does

AffiliateOS scans any URL and:

1. **Detects** every affiliate link from 10+ networks
2. **Checks** the health status of each link (healthy, broken, redirect, timeout)
3. **Tracks** your affiliate earnings by network and period
4. **Generates** FTC-compliant disclosure text for 5 content types
5. **Alerts** you when links break (email + daily auto-scans)

## Supported Networks

| Network | Detection |
|---------|-----------|
| Amazon Associates | `tag=`, `amzn.to` short links |
| ShareASale | `shareasale.com` links |
| CJ Affiliate | `jdoqocy.com`, `tkqlhce.com`, etc. |
| Impact | `sjv.io`, `impact.com` |
| Rakuten | `click.linksynergy.com` |
| Awin | `awin1.com` |
| ClickBank | `*.hop.clickbank.net` |
| Partnerize | `prf.hn` |
| FlexOffers | `flexoffers.com` |
| Skimlinks | `go.skimresources.com` |
| Generic | `?ref=`, `?affiliate=`, `utm_medium=affiliate` |

## Features

- **URL Scanner** — Paste any URL, get a complete affiliate link audit in seconds
- **Link Health Monitor** — HTTP status checks on every affiliate link (broken, redirect, timeout)
- **Earnings Tracker** — Log revenue by network and period with charts and trends
- **FTC Disclosure Generator** — Blog, YouTube, social media, email, and podcast templates
- **Dashboard Analytics** — Top content, network distribution, scan history, link health overview
- **Daily Auto-Scans** — Vercel Cron re-checks your URLs every day
- **Email Alerts** — Get notified when affiliate links break (via Resend)
- **Bulk Import** — Add up to 20 URLs at once with deduplication
- **CSV Export** — Export your links and earnings data
- **Tags & Categories** — Organize your content with custom tags
- **Broken Link Replacement** — Fix dead links right from the dashboard
- **Dark Mode** — Full light/dark/system theme support
- **OAuth Login** — Sign in with GitHub or Google

## Quick Start

```bash
# Clone
git clone https://github.com/JPB-777/creator-affiliate-os.git
cd creator-affiliate-os

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local — you need DATABASE_URL and BETTER_AUTH_SECRET at minimum

# Database setup
npm run db:generate
npm run db:migrate
npm run db:seed

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and scan your first URL.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Random secret for auth tokens |
| `BETTER_AUTH_URL` | Yes | Your app URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL (same as above for dev) |
| `RESEND_API_KEY` | No | For email alerts (free tier: 3k/month) |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth |
| `GOOGLE_CLIENT_ID` | No | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth |

## Self-Hosting

### Option A: Vercel + Neon (Recommended)

Both have generous free tiers. Easiest path to production.

1. Fork this repo
2. Create a [Neon](https://neon.tech) database
3. Deploy to [Vercel](https://vercel.com) — connect your fork
4. Add environment variables in Vercel dashboard
5. Run migrations: the app handles this on first deploy

### Option B: Docker

```bash
docker compose up -d
```

This starts the app + PostgreSQL. See `docker-compose.yml` for configuration.

See [docs/self-hosting.md](docs/self-hosting.md) for detailed instructions.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React 19) |
| Language | [TypeScript](https://typescriptlang.org) (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Auth | [Better Auth](https://www.better-auth.com) (email/password + OAuth) |
| Database | [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL ([Neon](https://neon.tech)) |
| HTML Parsing | [Cheerio](https://cheerio.js.org) |
| Charts | [Recharts](https://recharts.org) |
| Email | [Resend](https://resend.com) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Sign-in, sign-up (centered layout)
│   ├── (dashboard)/        # Protected pages (sidebar layout)
│   │   ├── dashboard/      # Stats, charts, top content
│   │   ├── urls/           # URL list + detail pages
│   │   ├── links/          # Affiliate links table
│   │   ├── earnings/       # Revenue tracker
│   │   ├── disclosures/    # FTC disclosure generator
│   │   └── settings/       # Profile & password
│   └── api/                # Auth + CSV export endpoints
├── components/             # React components
├── lib/                    # Core logic
│   ├── scanner/            # URL fetcher, link parser, affiliate detector, health checker
│   ├── db/                 # Schema, connection, seed
│   └── auth.ts             # Auth configuration
└── server/
    ├── actions/            # Server Actions (mutations)
    └── queries/            # Data fetching (read-only)
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

AffiliateOS is licensed under the [Business Source License 1.1](LICENSE).

- **Self-host freely** for personal or business use
- **Modify and contribute** back to the project
- **Cannot** be used to offer a competing hosted service
- Converts to [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) on **March 8, 2029**
