# AffiliateOS

> Auto-maintained. Mis à jour après chaque tâche ou groupe de tâches.
> Dernière mise à jour : 2026-03-15 (Retrofit: sécurisation + monitoring + tests)

## Core Operating Mode

You are not a basic assistant. You are a highly capable AI build agent that can think and act like a coordinated team of elite specialists when useful: Product Manager, Tech Lead, Senior Full-Stack Engineer, QA Lead, DevOps Lead, Security Reviewer, and UX Thinker.
Your default posture is ambitious, proactive, quality-focused, and execution-oriented.
Do not default to timid or ultra-thin MVPs.
Do not reduce scope unnecessarily.
Do not wait passively when strong assumptions can unblock progress.

## MVP Philosophy (2026 Agentic Version)

Modern AI-assisted development allows a substantially richer MVP than older solo workflows.
Definition of MVP for this workflow:
- MVP must deliver a complete, credible, useful user experience
- MVP must feel like a small real product, not a demo
- MVP may include a broader first version if it remains launchable

MVP target:
- 10–15 meaningful MUST features when realistic
- Every MUST feature must create real user value, complete an important workflow, or materially improve usability
- No fake features
- No filler

## Vérification post-implémentation

After each meaningful implementation step, you MUST include a "Vérification post-implémentation" section that covers:
1. **Tests à ajouter/mettre à jour** : Est-ce que des tests doivent être ajoutés ou modifiés ? Lesquels ?
2. **Type de tests recommandés** : Unit, integration, e2e, snapshot, ou autre ?
3. **Exécution immédiate** : Les tests doivent-ils être exécutés maintenant avant de continuer ?
4. **Validation minimum requise** : Quelle validation minimum (build, lint, manual check, smoke test) est requise avant de passer à l'étape suivante ?

## Description

AffiliateOS est une plateforme open-source de gestion de liens affiliés pour créateurs de contenu. Elle scanne des pages web pour détecter les liens affiliés de 10+ réseaux, vérifie leur santé (broken/healthy/redirect/timeout), suit les revenus par réseau et période, et génère des textes de divulgation FTC pour 5 types de contenu.

Stack : Next.js 16 (App Router, React 19), TypeScript strict, Tailwind CSS v4 + shadcn/ui, Drizzle ORM + Neon PostgreSQL, Better Auth (email/password + OAuth GitHub/Google), next-themes (dark mode), sonner (toasts), framer-motion (page transitions). Déployé sur Vercel avec Neon DB.

## Commandes

| Action | Commande |
|--------|----------|
| Dev | `npm run dev` |
| Build | `npm run build` |
| Start | `npm run start` |
| Lint | `npm run lint` |
| DB Generate | `npm run db:generate` |
| DB Migrate | `npm run db:migrate` |
| DB Seed | `npm run db:seed` |
| DB Studio | `npm run db:studio` |
| Test Unit | `npm test` (Vitest) |
| Test Watch | `npm run test:watch` |
| Test Coverage | `npm run test:coverage` |
| Test E2E | `npx playwright test` |
| Deploy | Auto-deploy via Vercel Git Integration (push sur `main`) |

## Architecture

```
creator-affiliate-os/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Routes auth (layout centré)
│   │   │   ├── sign-in/page.tsx      # Formulaire login (client component)
│   │   │   ├── sign-up/page.tsx      # Formulaire inscription (client component)
│   │   │   └── layout.tsx            # Layout carte centrée
│   │   ├── (dashboard)/              # Routes protégées (layout sidebar)
│   │   │   ├── dashboard/page.tsx    # Stats, health score, comparaison, graphiques
│   │   │   ├── urls/page.tsx         # Liste URLs paginée avec filtres, tags, sitemap import
│   │   │   ├── urls/[id]/page.tsx    # Détail URL : liens, historique santé, revenus
│   │   │   ├── links/page.tsx        # Table liens affiliés avec filtres, export CSV, remplacement
│   │   │   ├── broken-links/page.tsx # Dashboard liens brisés avec batch actions
│   │   │   ├── opportunities/page.tsx # Opportunités affiliés manquées (auto-détectées)
│   │   │   ├── earnings/page.tsx     # Tracker revenus avec filtres, export CSV, pagination
│   │   │   ├── tags/page.tsx         # Gestion avancée de tags (rename, merge, delete)
│   │   │   ├── content-drift/page.tsx # Détection changements contexte autour des liens
│   │   │   ├── activity/page.tsx     # Timeline d'activité chronologique
│   │   │   ├── onboarding/page.tsx   # Wizard onboarding multi-step
│   │   │   ├── disclosures/page.tsx  # Générateur disclosures FTC (client component)
│   │   │   ├── settings/page.tsx     # Profil, password, notifications, API keys
│   │   │   └── layout.tsx            # Sidebar + contenu principal
│   │   ├── api/auth/[...all]/        # Better Auth catch-all API
│   │   ├── api/health/               # Health check endpoint (DB connectivity)
│   │   ├── api/v1/                   # API publique REST (urls, links, earnings, health-score)
│   │   ├── api/export/links/         # Export CSV liens affiliés
│   │   ├── api/export/earnings/      # Export CSV earnings
│   │   ├── api/notifications/        # Polling unread count + list
│   │   ├── api/crons/                # scan-urls, weekly-report, cleanup-history
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog listing
│   │   │   └── how-to-find-broken-affiliate-links/page.tsx  # Article SEO
│   │   ├── pricing/page.tsx          # Page pricing (3 tiers)
│   │   ├── layout.tsx                # Root layout (Geist fonts, ThemeProvider, SEO meta)
│   │   ├── page.tsx                  # Landing page publique (hero, features, pricing preview, FAQ)
│   │   └── globals.css               # Tailwind v4 + thème shadcn (light + dark)
│   ├── components/
│   │   ├── dashboard/                # Sidebar, ThemeToggle, NotificationBell, NotificationCenter, HealthScoreGauge, PeriodComparison
│   │   ├── earnings/                 # AddEarningForm, DeleteEarningButton, EarningFilters, ExportButton
│   │   ├── links/                    # RecheckButton, LinkFilters, ExportButton, ReplaceLinkForm, LinkHistoryChart
│   │   ├── broken-links/             # BrokenLinksTable, BatchActionsBar
│   │   ├── opportunities/            # OpportunityCard
│   │   ├── content-drift/            # DriftCard, DriftDiff (word-level diff)
│   │   ├── activity/                 # ActivityTimeline
│   │   ├── onboarding/               # OnboardingWizard + 5 steps
│   │   ├── tags/                     # TagManager, TagCloud
│   │   ├── settings/                 # UpdateProfileForm, ChangePasswordForm, WeeklyReportToggle, ApiKeysSection
│   │   ├── urls/                     # AddUrlForm, UrlCard, UrlFilters, TagEditor, SitemapImport, ScanFrequencySelect
│   │   ├── ui/                       # Primitives shadcn/ui (21 composants)
│   │   └── shared/                   # AnimatedLayout, StatCard, PageHeader, EmptyState, ConfirmDialog
│   ├── lib/
│   │   ├── auth.ts                   # Config Better Auth serveur
│   │   ├── auth-client.ts            # Auth côté client (signIn, signUp, signOut)
│   │   ├── auth-utils.ts             # Helpers serveur : getUser(), requireUser()
│   │   ├── activity-logger.ts        # logActivity() helper best-effort
│   │   ├── disclosures.ts            # Templates FTC (5 types contenu)
│   │   ├── utils.ts                  # cn() tailwind merge
│   │   ├── api/
│   │   │   ├── auth.ts               # authenticateApiKey (SHA-256 hash lookup)
│   │   │   ├── rate-limit.ts         # In-memory rate limiter (100 req/hr)
│   │   │   └── response.ts           # apiSuccess, apiError JSON helpers
│   │   ├── db/
│   │   │   ├── index.ts              # Factory connexion DB (auto-detect Neon vs postgres)
│   │   │   ├── schema.ts             # Schema Drizzle complet (17 tables, 4 enums)
│   │   │   └── seed.ts               # Seed 10 réseaux affiliés
│   │   ├── email-templates/
│   │   │   └── weekly-report.ts      # Template HTML rapport hebdomadaire
│   │   └── scanner/
│   │       ├── fetcher.ts            # Fetch pages HTML (15s timeout)
│   │       ├── parser.ts             # Extraction liens + titre via Cheerio
│   │       ├── detector.ts           # Détection affiliés via regex (11 réseaux)
│   │       ├── checker.ts            # HEAD requests santé (10s timeout, batch 5)
│   │       ├── networks.ts           # Définitions regex des réseaux affiliés
│   │       ├── opportunity-detector.ts # Détection liens non-affiliés monétisables (25 domaines)
│   │       ├── content-snapshot.ts   # Extraction contexte liens + SHA-256 hash
│   │       └── sitemap-parser.ts     # Parse XML sitemaps via Cheerio
│   ├── server/
│   │   ├── actions/                  # Server Actions (mutations)
│   │   │   ├── urls.ts               # addUrl, deleteUrl, rescanUrl, updateUrlTags, updateScanFrequency
│   │   │   ├── scans.ts              # triggerScan (pipeline: scan → health → history → opportunities → drift → notifications)
│   │   │   ├── earnings.ts           # addEarning, updateEarning, deleteEarning
│   │   │   ├── links.ts              # recheckLink, suggestReplacement
│   │   │   ├── api-keys.ts           # createApiKey, revokeApiKey
│   │   │   ├── broken-links.ts       # batchRecheckLinks, dismissBrokenLink, batchDismissLinks
│   │   │   ├── notifications.ts      # markRead, markAllRead, createNotification
│   │   │   ├── opportunities.ts      # dismissOpportunity, bulkDismiss
│   │   │   ├── content-drift.ts      # markDriftAsReviewed, dismissDrift
│   │   │   ├── onboarding.ts         # completeOnboardingStep, completeOnboarding, skipOnboarding
│   │   │   ├── sitemap.ts            # fetchSitemap, importSitemapUrls
│   │   │   └── tags.ts               # renameTag, deleteTag, mergeTags
│   │   └── queries/                  # Data fetching (lecture seule)
│   │       ├── dashboard.ts          # getDashboardStats, getTopPerformingUrls
│   │       ├── urls.ts               # getUserUrls, getUrlsDueForScan (respects frequency)
│   │       ├── links.ts              # getLinksByUrl, getAllUserLinks, getBrokenLinksWithUrls
│   │       ├── earnings.ts           # getEarnings, getEarningsSummary, getEarningsByUrl
│   │       ├── scans.ts              # getScanHistory, getLatestScan
│   │       ├── health-score.ts       # getHealthScore (40% health + 20% coverage + 25% freshness + 15% growth)
│   │       ├── comparison.ts         # getPeriodComparison (week/month/quarter)
│   │       ├── link-history.ts       # getLinkHistory, getUrlHealthTimeline
│   │       ├── notifications.ts      # getNotifications, getUnreadCount
│   │       ├── opportunities.ts      # getOpportunities, getOpportunityCount
│   │       ├── content-drift.ts      # getContentDrifts, getUnreviewedDriftCount
│   │       ├── activity.ts           # getActivityLog
│   │       ├── onboarding.ts         # getUserPreferences, isOnboardingComplete
│   │       ├── tags.ts               # getAllUserTags (via jsonb_array_elements_text)
│   │       ├── api-keys.ts           # getApiKeys, validateApiKey
│   │       └── weekly-report.ts      # getWeeklyReportData, getUsersForWeeklyReport
│   ├── instrumentation.ts            # Sentry instrumentation hook (Node + Edge)
│   ├── middleware.ts                 # Protection routes via cookie session
│   ├── __tests__/                    # Tests unitaires Vitest
│   │   ├── setup.ts                 # Setup jest-dom matchers
│   │   ├── scanner/                 # Tests scanner (detector, parser, url-validator)
│   │   └── disclosures.test.ts      # Tests disclosures FTC
│   └── types/                        # Vide
├── e2e/                              # Tests E2E Playwright
│   └── public-pages.spec.ts         # Tests pages publiques + auth redirect
├── migrations/                       # Fichiers migration Drizzle (13 migrations)
├── docs/                             # self-hosting.md + screenshots (vide)
├── public/                           # Assets statiques
├── .vercel/                          # Config Vercel project
├── sentry.client.config.ts           # Sentry client init
├── sentry.server.config.ts           # Sentry server init
├── sentry.edge.config.ts             # Sentry edge init
├── vitest.config.ts                  # Config Vitest (jsdom, @/ alias)
├── playwright.config.ts              # Config Playwright (chromium)
├── drizzle.config.ts                 # Config Drizzle Kit
├── next.config.ts                    # output: standalone + withSentryConfig
├── components.json                   # Config shadcn/ui
├── Dockerfile                        # Build multi-stage Docker
├── docker-compose.yml                # App + PostgreSQL containers
└── .env.example                      # Template variables d'env
```

## Règles & Conventions

### Nommage
- **Fichiers** : kebab-case (`add-url-form.tsx`, `auth-utils.ts`)
- **Composants** : PascalCase (`AddUrlForm`, `UrlCard`, `Sidebar`)
- **Server Actions** : camelCase (`addUrl`, `triggerScan`)
- **Queries** : camelCase avec préfixe `get` (`getUserUrls`, `getDashboardStats`)
- **DB** : camelCase JS → snake_case SQL (`userId` → `user_id`)

### Patterns
- Server Components par défaut pour les pages (async + `requireUser()`)
- `"use client"` pour formulaires et UI interactive
- Server Actions pour mutations, API routes pour exports CSV
- `revalidatePath()` après chaque mutation
- `cn()` pour classes conditionnelles Tailwind
- Toutes les queries filtrent par `userId` (multi-tenant par convention)

### Auth
- Middleware vérifie cookie `better-auth.session_token`
- `requireUser()` : redirige vers `/sign-in` si pas de session
- Client : `signIn.email()`, `signUp.email()`, `signOut()`, `signIn.social()`, `updateUser()`, `changePassword()`

### Scanner Pipeline
1. `fetchPage()` → GET avec User-Agent custom, 15s timeout
2. `extractLinks()` + `extractTitle()` → Cheerio, dedup par URL
3. `detectAffiliateLinks()` → regex matching sur 11 réseaux
4. `checkLinks()` → HEAD requests, batch concurrency 5, 10s timeout
5. `linkStatusHistory` → insert records pour timeline (F5)
6. `detectOpportunities()` → match non-affiliés contre 25 domaines monétisables (F12)
7. `extractLinkContexts()` → SHA-256 hash contexte, compare snapshots, crée drifts (F15)
8. Résultats persistés dans `links` + résumé dans `scans`
9. Notifications créées si broken links détectés (F11)

## 📋 MVP Checklist

### Definition of Done
- [x] Public URL avec HTTPS (Vercel)
- [x] Production DB connectée (Neon)
- [x] Secrets injectés sécuritairement en production ✅ Validés et corrigés 2026-03-15
- [x] Déployé via Vercel Git Integration (auto-deploy sur push main)
- [ ] 1 vrai utilisateur a complété 1 vraie action

### Features MUST
- [x] Auth email/password (sign-up, sign-in, sign-out)
- [x] Scanner d'URLs + détection affiliés (10+ réseaux)
- [x] Vérification santé des liens (broken/healthy/redirect/timeout)
- [x] Dashboard stats centralisées
- [x] Earnings tracker (add/delete par réseau et période)

### Features SHOULD
- [x] Générateur disclosures FTC (5 types contenu)
- [x] Landing page publique
- [x] Sidebar responsive (desktop + mobile)
- [x] Page Settings fonctionnelle (edit profil, password)
- [x] Dark mode toggle (light/dark/system via next-themes)

### Features COULD (post-launch)
- [x] Pagination server-side sur toutes les listes (20/page)
- [x] Search/filter sur links, URLs, earnings (ILIKE + selects)
- [x] Export CSV (liens affiliés + earnings via API routes)
- [x] Bulk URL import (max 20/batch, dedup, progress)
- [x] Email notifications liens brisés (Resend, best-effort)
- [x] Dashboard graphiques revenus (Recharts, stacked bar par réseau)
- [x] Scan récurrent automatique (Vercel Cron, 1x/jour 6h UTC, 10 URLs/run)
- [x] OAuth providers (Google, GitHub) via Better Auth socialProviders
- [x] Tags/catégories sur URLs (JSONB)
- [x] Top Performing Content (dashboard, JOIN earnings ↔ links ↔ urls)
- [x] Remplacement liens broken (input inline + clipboard copy)
- [ ] UI edit earnings (action existe, pas de UI)
- [x] Error boundaries (`error.tsx`) — dashboard error boundary + root not-found
- [x] Loading states (`loading.tsx`) — 5 skeleton loading pages (dashboard, urls, links, earnings, settings)

### Features avancées (15 features en 4 phases — 2026-03-14)
- [x] F1: Onboarding guidé multi-step (wizard 5 étapes, state DB)
- [x] F2: Revenus liés aux URLs (earnings.urlId, dropdown URL)
- [x] F3: Broken Links Dashboard (batch recheck/dismiss)
- [x] F4: Import Sitemap XML (Cheerio, max 200 URLs)
- [x] F5: Historique santé liens (linkStatusHistory, Recharts timeline)
- [x] F6: Score santé global (4 métriques pondérées, SVG gauge, grades A-F)
- [x] F7: Rapport hebdomadaire email (Resend, cron lundi 8h UTC)
- [x] F8: Scan programmé configurable (daily/weekly/biweekly/monthly/manual)
- [x] F9: Gestion tags avancée (rename/merge/delete, tag cloud)
- [x] F10: Comparaison période vs période (week/month/quarter, SQL conditional aggregates)
- [x] F11: Notifications in-app (bell + sheet, 60s polling, types: broken_link/scan_complete/scan_failed)
- [x] F12: Opportunités manquées (25 domaines monétisables, auto-détection au scan)
- [x] F13: API publique REST (Bearer auth SHA-256, rate limit 100/hr, 5 endpoints)
- [x] F14: Log d'activité (timeline groupée par date, best-effort logging)
- [x] F15: Content drift detection (SHA-256 context hashing, word-level diff)

### Hors-scope actuel
- Background jobs / queues
- Team/org features
- Billing / tiers / plans (pas de logique de plan dans le code — pricing page marketing existe mais aucun enforcement)
- Cloud Pro features (advanced analytics, team collab — marqué "Coming soon")

## Contexte Produit

- **Objectif** : Permettre aux créateurs de contenu de gérer, monitorer et optimiser leurs liens affiliés
- **Problème** : Les créateurs ne savent pas quels liens affiliés sont brisés, dispersés sur plusieurs pages, et risquent la non-conformité FTC
- **Utilisateur cible** : Blogueurs, YouTubers, créateurs de contenu avec des liens affiliés
- **Résultat utilisateur** : Scanner une page, voir quels liens affiliés sont brisés, tracker ses revenus, générer des disclosures FTC
- **Fonctionnalités MUST** : Auth, scanner URL, health check liens, dashboard, earnings tracker
- **Fonctionnalités SHOULD** : Disclosures FTC, landing page, responsive sidebar
- **Fonctionnalités COULD** : Pagination, search, export, bulk import, notifications
- **Hors-scope** : Tests, teams, billing/tiers

## Contexte Critique

### Variables d'env
| Variable | Requis | Description | Env |
|----------|--------|-------------|-----|
| `DATABASE_URL` | Oui | Connection string PostgreSQL (Neon) | server |
| `DB_DRIVER` | Non | Force `"neon"` ou `"postgres"`. Auto-détecté | server |
| `BETTER_AUTH_SECRET` | Oui | Secret pour signing auth tokens | server |
| `BETTER_AUTH_URL` | Oui | URL canonique app (server-side) | server |
| `NEXT_PUBLIC_APP_URL` | Oui | URL publique app (client-side) | client |
| `RESEND_API_KEY` | Non | Clé API Resend pour alertes email (gratuit 3k/mois) | server |
| `CRON_SECRET` | Non | Secret Vercel pour sécuriser les endpoints cron (auto-fourni par Vercel) | server |
| `GITHUB_CLIENT_ID` | Non | OAuth GitHub app client ID | server |
| `GITHUB_CLIENT_SECRET` | Non | OAuth GitHub app client secret | server |
| `GOOGLE_CLIENT_ID` | Non | OAuth Google app client ID | server |
| `GOOGLE_CLIENT_SECRET` | Non | OAuth Google app client secret | server |
| `UPSTASH_REDIS_REST_URL` | Non | URL REST Upstash Redis (rate limiting) | server |
| `UPSTASH_REDIS_REST_TOKEN` | Non | Token REST Upstash Redis | server |
| `NEXT_PUBLIC_SENTRY_DSN` | Non | DSN Sentry error tracking | client |
| `SENTRY_ORG` | Non | Organisation Sentry (source maps) | server |
| `SENTRY_PROJECT` | Non | Projet Sentry | server |
| `SENTRY_AUTH_TOKEN` | Non | Token auth Sentry (source maps) | server |

### Règles métier
- Chaque scan remplace tous les liens précédents pour cette URL (pas incrémental)
- Seuls les liens affiliés sont health-checkés (optimisation performance)
- Scans synchrones dans le lifecycle de la requête (pas de background jobs)
- Données isolées par `userId` sur toutes les tables

### Contraintes
- Scans synchrones = pages lourdes = réponses lentes
- Pas de rate limiting = sites externes pourraient bloquer le User-Agent
- Pas de background processing
- License BSL 1.1 → ne peut pas être utilisé pour offrir un service hébergé concurrent avant 2029-03-08

### Intégrations
- **Neon** : PostgreSQL serverless (RLS activé sur 12 tables)
- **Sentry** : Error tracking + performance monitoring (en attente DSN)
- **Upstash Redis** : Rate limiting API v1 + middleware (en attente config)
- **Resend** : Alertes email (optionnel, 3k/mois gratuit)
- **GitHub/Google OAuth** : Login social (optionnel, credentials requis)

### Hypothèses actives
- [VALIDÉ ✅] Les secrets Vercel sont configurés correctement — validé et corrigé 2026-03-15 (trailing \n fix)
- [VALIDÉ ✅] `BETTER_AUTH_SECRET` en production est un vrai secret aléatoire
- [VALIDÉ ✅] La DB Neon de production a toutes les 13 migrations appliquées + networks seedés
- [VALIDÉ ✅] Les URLs de production pointent vers le bon domaine Vercel HTTPS
- [EN ATTENTE] Sentry DSN pas encore configuré dans Vercel (projet Sentry à créer)
- [EN ATTENTE] Upstash Redis pas encore configuré dans Vercel (fallback in-memory actif)

### Décisions prises
- Vercel pour hosting (auto-deploy via Git Integration, pas GitHub Actions)
- Neon pour PostgreSQL serverless
- Better Auth pour auth (email/password + OAuth GitHub/Google)
- Drizzle ORM (pas Prisma)
- standalone output pour compatibilité Docker
- shadcn/ui base-nova style

### Issues connues
- Constante `NETWORKS` dupliquée dans `add-earning-form.tsx` et `disclosures/page.tsx`
- `seed.ts` duplique la logique de connexion DB au lieu d'importer `db/index.ts`
- `url.totalLinks` stocke le compte affiliés seulement (nom trompeur)
- SSRF protection ajoutée dans `url-validator.ts` mais non intégrée dans le scanner pipeline
- `earnings.amount` est `decimal` en DB mais géré comme string dans les queries

## Déploiement

- **Hébergeur** : Vercel (projet `creator-affiliate-os`, ID: `prj_MvNkfD1JApSlFP33rOBmL0f7nKeD`)
- **Base de données** : Neon PostgreSQL (region us-east-2)
- **Repo GitHub** : `JPB-777/creator-affiliate-os`
- **Méthode deploy** : Vercel Git Integration (auto-deploy sur push `main`)
- **Méthode secrets** : Vercel Environment Variables
- **GitHub Actions** : ✅ CI pipeline (lint + typecheck + build + unit tests + E2E)
- **Trigger** : Push sur branche `main`
- **Secrets requis en production** :
  - `DATABASE_URL` — Connection string Neon production
  - `BETTER_AUTH_SECRET` — Secret aléatoire (pas le placeholder)
  - `BETTER_AUTH_URL` — URL production Vercel (https://...)
  - `NEXT_PUBLIC_APP_URL` — URL production Vercel (https://...)

## Phases Projet

| # | Phase | Status |
|---|-------|--------|
| 1 | Cadrage | ✅ Complété |
| 2 | MVP Build | ✅ Toutes les features MUST fonctionnent |
| 3 | Scope Freeze | ✅ Feature list lockée (voir MVP Checklist) |
| 4 | Pre-launch | ✅ Vercel déployé, secrets validés et corrigés |
| 5 | Security | ⚠️ RLS activé, Sentry intégré (en attente DSN), tests en place |
| 6 | Deployment | ⚠️ Live sur Vercel, en attente redeploy post-retrofit |
| 7 | Post-launch | ❌ Aucun vrai utilisateur confirmé |

## Changelog

| Date | Changements |
|------|-------------|
| 2026-03-10 | CLAUDE.md initial créé depuis analyse complète du codebase |
| 2026-03-10 | Reformaté au format framework Product Strategist. Ajout contexte déploiement Vercel + Neon. Phases 1-3 marquées complétées. Scope freeze appliqué. |
| 2026-03-10 | Fix: ajout `baseURL: process.env.BETTER_AUTH_URL` dans `src/lib/auth.ts`. Sign-in échouait en prod car Better Auth ne pouvait pas setter le cookie de session sans baseURL explicite. |
| 2026-03-10 | Feat: 4 features high-impact — Bulk import URLs (20/batch, dedup), Dashboard graphiques revenus (Recharts stacked bar), Alertes email liens brisés (Resend), Scan récurrent Vercel Cron (1x/jour, 10 URLs/run). Deps ajoutées : recharts, resend. |
| 2026-03-11 | Feat: 9 features polish — Dark mode toggle (next-themes), Settings edit profil + password, Pagination server-side (3 pages), Search/filtres (links, URLs, earnings), Tags JSONB sur URLs, Top Performing Content (dashboard), Export CSV (links + earnings), OAuth GitHub/Google, Remplacement liens broken. Migration `0001_add_tags_and_replacement`. Dep ajoutée : next-themes. |
| 2026-03-11 | Marketing: Refonte landing page (hero, features, how-it-works, pricing preview, FAQ, CTA). SEO meta tags + OG tags dans layout.tsx. README pro (badges, screenshots, quick start). Page /pricing (3 tiers). Blog engine + article SEO `/blog/how-to-find-broken-affiliate-links`. |
| 2026-03-11 | Fix cohérence: Pricing aligné sur le code réel — Cloud Free = Unlimited URLs (pas de fausse limite 25), Pro = "Coming soon" avec features futures honnêtes, pas de "Hourly auto-scans" inexistant. CLAUDE.md mis à jour (nouvelles routes, hors-scope corrigé). |
| 2026-03-14 | UI/UX: Modernisation complète "Midnight Indigo" en 4 phases. **Phase 1** — Primary indigo (OKLCh), tokens success/warning, dark mode teinté, emojis sidebar → lucide-react, logo, active:scale boutons, font-mono métriques, `<select>` → shadcn Select. **Phase 2** — sonner toasts sur 8+ composants, ConfirmDialog pour suppressions, Loader2 spinners, messages inline → toasts. **Phase 3** — 5 loading.tsx skeletons, error.tsx, not-found.tsx. **Phase 4** — Auth branding (gradient, logo, icônes OAuth), AnimatedLayout (framer-motion) sur toutes les pages, PageHeader/StatCard/EmptyState composants partagés, chart custom tooltip OKLCh, empty states icon-in-circle. Deps ajoutées : sonner, framer-motion. Build vérifié ✓. |
| 2026-03-14 | Feat: 15 features en 4 phases. **Phase 1 (Activation)** — F2 revenus liés URLs, F3 broken links dashboard (batch actions), F1 onboarding wizard 5 étapes. **Phase 2 (Scale)** — F5 historique santé liens (Recharts timeline), F6 score santé global (SVG gauge, grades A-F), F4 import sitemap XML (Cheerio, max 200), F7 rapport hebdomadaire email (Resend cron). **Phase 3 (Profondeur)** — F8 scan programmé configurable (5 fréquences), F9 tags avancés (rename/merge/delete, tag cloud), F10 comparaison période vs période (SQL conditional aggregates), F11 notifications in-app (bell + sheet, 60s polling). **Phase 4 (Différenciation)** — F14 log d'activité (timeline groupée, best-effort), F12 opportunités manquées (25 domaines monétisables), F15 content drift (SHA-256 context hashing, word-level diff), F13 API publique REST (Bearer SHA-256, rate limit 100/hr, 5 endpoints + settings UI). Schema: 9→17 tables, 2→4 enums. 9 migrations. Toutes les features build-verified ✓. |
| 2026-03-15 | **Retrofit production-ready** — 16 actions en 4 blocs. **Bloc A (Fix)**: Secrets Vercel corrigés (trailing \n fix sur 4 vars), 2 crons manquants ajoutés (weekly-report, cleanup-history), index activityLog(userId, createdAt), 8 migrations manquantes appliquées manuellement sur Neon. **Bloc B (Secure)**: Sentry intégré (@sentry/nextjs, client+server+edge configs, global-error.tsx, instrumentation.ts, withSentryConfig), endpoint /api/health (DB check), RLS activé sur 12 tables, rate limiting API v1 migré vers Upstash Redis. **Bloc C (Standard)**: package.json metadata (author, repo), Vitest setup (36 tests: scanner detector/parser, url-validator SSRF, disclosures FTC), Playwright E2E (public pages, auth redirects, API), CI GitHub Actions (lint+typecheck+build+unit+E2E). Deps ajoutées: @sentry/nextjs, vitest, @testing-library/react, @testing-library/jest-dom, jsdom, @playwright/test. |
