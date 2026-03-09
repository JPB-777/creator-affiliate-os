# AffiliateOS

**Your affiliate links, under control.**

[![License: BSL 1.1](https://img.shields.io/badge/License-BSL%201.1-blue.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

AffiliateOS is an open-source affiliate link management platform built for content creators, bloggers, and affiliate marketers. Scan your content for affiliate links, catch broken ones before they cost you commissions, track your earnings across networks, and stay FTC-compliant -- all from one dashboard.

## Features

- **URL Scanner** -- Paste any URL and automatically extract all links, detecting affiliate links from 10+ networks
- **Affiliate Link Detection** -- Identifies Amazon Associates, ShareASale, CJ, Impact, Rakuten, Awin, ClickBank, Partnerize, FlexOffers, and Skimlinks
- **Link Health Monitoring** -- Checks HTTP status of every affiliate link, flagging broken, redirect, and timeout states
- **Earnings Tracker** -- Log affiliate earnings by network and period with monthly/all-time summaries
- **FTC Disclosure Generator** -- Generate platform-specific (blog, YouTube, social media, email, podcast) FTC-compliant disclosure text
- **Dashboard Analytics** -- Centralized view of tracked URLs, affiliate links, broken links, earnings, and network distribution

## Screenshots

> Screenshots coming soon. See `docs/screenshots/` for placeholders.

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/affiliateos.git
cd affiliateos

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and auth secret

# 4. Run database migrations
npm run db:generate
npm run db:migrate

# 5. Seed affiliate networks
npm run db:seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create your account.

## Self-Hosting

AffiliateOS can be deployed in two ways:

- **Vercel + Neon** (recommended) -- Free tier on both platforms, easiest setup
- **Docker** -- Full self-hosted stack with Postgres included

See the [Self-Hosting Guide](docs/self-hosting.md) for detailed instructions.

## AffiliateOS Cloud

A managed hosted version is coming soon. No setup, no maintenance -- just sign up and go.

<!-- TODO: Add waitlist link -->

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, React 19)
- [TypeScript](https://typescriptlang.org) (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Better Auth](https://www.better-auth.com) (email/password authentication)
- [Drizzle ORM](https://orm.drizzle.team) + [Neon](https://neon.tech) / PostgreSQL
- [Cheerio](https://cheerio.js.org) (HTML parsing for link scanning)

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a PR.

## License

AffiliateOS is licensed under the [Business Source License 1.1](LICENSE).

**What this means:**
- You can self-host AffiliateOS for personal or business use
- You can modify the code and contribute back
- You cannot use it to offer a competing hosted service
- On **March 8, 2029**, the code converts to [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) (fully open source)
