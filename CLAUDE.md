# AffiliateOS

> Auto-maintained. Mis à jour après chaque tâche ou groupe de tâches.
> Dernière mise à jour : 2026-03-10 (fix auth prod)

## Description

AffiliateOS est une plateforme open-source de gestion de liens affiliés pour créateurs de contenu. Elle scanne des pages web pour détecter les liens affiliés de 10+ réseaux, vérifie leur santé (broken/healthy/redirect/timeout), suit les revenus par réseau et période, et génère des textes de divulgation FTC pour 5 types de contenu.

Stack : Next.js 16 (App Router, React 19), TypeScript strict, Tailwind CSS v4 + shadcn/ui, Drizzle ORM + Neon PostgreSQL, Better Auth (email/password). Déployé sur Vercel avec Neon DB.

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
| Test | ❌ Aucun — pas de test runner configuré |
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
│   │   │   ├── dashboard/page.tsx    # Stats, distribution réseaux, scans récents
│   │   │   ├── urls/page.tsx         # Liste URLs avec formulaire ajout
│   │   │   ├── urls/[id]/page.tsx    # Détail URL : liens affiliés, autres liens, historique
│   │   │   ├── links/page.tsx        # Table globale liens affiliés avec recheck
│   │   │   ├── earnings/page.tsx     # Tracker revenus avec formulaire et historique
│   │   │   ├── disclosures/page.tsx  # Générateur disclosures FTC (client component)
│   │   │   ├── settings/page.tsx     # Profil read-only
│   │   │   └── layout.tsx            # Sidebar + contenu principal
│   │   ├── api/auth/[...all]/        # Better Auth catch-all API
│   │   ├── layout.tsx                # Root layout (Geist fonts, metadata)
│   │   ├── page.tsx                  # Landing page publique
│   │   └── globals.css               # Tailwind v4 + thème shadcn (light + dark)
│   ├── components/
│   │   ├── dashboard/sidebar.tsx     # Sidebar responsive (desktop + mobile sheet)
│   │   ├── earnings/                 # AddEarningForm, DeleteEarningButton
│   │   ├── links/recheck-button.tsx  # Recheck santé d'un lien individuel
│   │   ├── urls/                     # AddUrlForm, UrlCard
│   │   ├── ui/                       # Primitives shadcn/ui (18 composants)
│   │   └── shared/                   # Vide
│   ├── lib/
│   │   ├── auth.ts                   # Config Better Auth serveur
│   │   ├── auth-client.ts            # Auth côté client (signIn, signUp, signOut)
│   │   ├── auth-utils.ts             # Helpers serveur : getUser(), requireUser()
│   │   ├── disclosures.ts            # Templates FTC (5 types contenu)
│   │   ├── utils.ts                  # cn() tailwind merge
│   │   ├── db/
│   │   │   ├── index.ts              # Factory connexion DB (auto-detect Neon vs postgres)
│   │   │   ├── schema.ts             # Schema Drizzle complet (9 tables, 2 enums)
│   │   │   └── seed.ts               # Seed 10 réseaux affiliés
│   │   └── scanner/
│   │       ├── fetcher.ts            # Fetch pages HTML (15s timeout)
│   │       ├── parser.ts             # Extraction liens + titre via Cheerio
│   │       ├── detector.ts           # Détection affiliés via regex (11 réseaux)
│   │       ├── checker.ts            # HEAD requests santé (10s timeout, batch 5)
│   │       └── networks.ts           # Définitions regex des réseaux affiliés
│   ├── server/
│   │   ├── actions/                  # Server Actions (mutations)
│   │   │   ├── urls.ts               # addUrl, deleteUrl, rescanUrl
│   │   │   ├── scans.ts              # triggerScan (pipeline complet)
│   │   │   ├── earnings.ts           # addEarning, updateEarning, deleteEarning
│   │   │   └── links.ts              # recheckLink
│   │   └── queries/                  # Data fetching (lecture seule)
│   │       ├── dashboard.ts          # getDashboardStats
│   │       ├── urls.ts               # getUserUrls, getUrlById
│   │       ├── links.ts              # getLinksByUrl, getAllUserLinks, getBrokenLinks
│   │       ├── earnings.ts           # getEarnings, getEarningsSummary
│   │       └── scans.ts              # getScanHistory, getLatestScan
│   ├── middleware.ts                 # Protection routes via cookie session
│   └── types/                        # Vide
├── migrations/                       # Fichiers migration Drizzle
├── docs/                             # self-hosting.md + screenshots (vide)
├── public/                           # Assets statiques
├── .vercel/                          # Config Vercel project
├── drizzle.config.ts                 # Config Drizzle Kit
├── next.config.ts                    # output: standalone
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
- Server Actions pour toutes les mutations (pas d'API routes custom)
- `revalidatePath()` après chaque mutation
- `cn()` pour classes conditionnelles Tailwind
- Toutes les queries filtrent par `userId` (multi-tenant par convention)

### Auth
- Middleware vérifie cookie `better-auth.session_token`
- `requireUser()` : redirige vers `/sign-in` si pas de session
- Client : `signIn.email()`, `signUp.email()`, `signOut()`

### Scanner Pipeline
1. `fetchPage()` → GET avec User-Agent custom, 15s timeout
2. `extractLinks()` + `extractTitle()` → Cheerio, dedup par URL
3. `detectAffiliateLinks()` → regex matching sur 11 réseaux
4. `checkLinks()` → HEAD requests, batch concurrency 5, 10s timeout
5. Résultats persistés dans `links` + résumé dans `scans`

## 📋 MVP Checklist

### Definition of Done
- [x] Public URL avec HTTPS (Vercel)
- [x] Production DB connectée (Neon)
- [ ] Secrets injectés sécuritairement en production ⚠️ `BETTER_AUTH_SECRET` placeholder en local
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
- [ ] Page Settings fonctionnelle (edit profil, password)
- [ ] Dark mode toggle

### Features COULD (post-launch)
- [ ] Pagination sur les listes
- [ ] Search/filter sur les listes
- [ ] Export CSV/PDF
- [x] Bulk URL import (max 20/batch, dedup, progress)
- [x] Email notifications liens brisés (Resend, best-effort)
- [x] Dashboard graphiques revenus (Recharts, stacked bar par réseau)
- [x] Scan récurrent automatique (Vercel Cron, 1x/jour 6h UTC, 10 URLs/run)
- [ ] OAuth providers (Google, GitHub)
- [ ] UI edit earnings (action existe, pas de UI)
- [ ] Error boundaries (`error.tsx`)
- [ ] Loading states (`loading.tsx`)

### Hors-scope actuel
- Tests automatisés
- API publique
- Rate limiting
- Background jobs / queues
- Team/org features
- AffiliateOS Cloud (SaaS hébergé)

## Contexte Produit

- **Objectif** : Permettre aux créateurs de contenu de gérer, monitorer et optimiser leurs liens affiliés
- **Problème** : Les créateurs ne savent pas quels liens affiliés sont brisés, dispersés sur plusieurs pages, et risquent la non-conformité FTC
- **Utilisateur cible** : Blogueurs, YouTubers, créateurs de contenu avec des liens affiliés
- **Résultat utilisateur** : Scanner une page, voir quels liens affiliés sont brisés, tracker ses revenus, générer des disclosures FTC
- **Fonctionnalités MUST** : Auth, scanner URL, health check liens, dashboard, earnings tracker
- **Fonctionnalités SHOULD** : Disclosures FTC, landing page, responsive sidebar
- **Fonctionnalités COULD** : Pagination, search, export, bulk import, notifications
- **Hors-scope** : Tests, API, rate limiting, teams, SaaS cloud

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
- **Neon** : PostgreSQL serverless (seule dépendance externe)
- Pas d'analytics, email, paiement, ou API externe

### Hypothèses actives
- [HYPOTHÈSE] Les secrets Vercel sont configurés correctement pour `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`
- [HYPOTHÈSE] `BETTER_AUTH_SECRET` en production est un vrai secret (pas le placeholder local)
- [HYPOTHÈSE] La DB Neon de production a les migrations appliquées et les networks seedés
- [À VALIDER] Les URLs de production pour `BETTER_AUTH_URL` et `NEXT_PUBLIC_APP_URL` pointent vers le bon domaine Vercel

### Décisions prises
- Vercel pour hosting (auto-deploy via Git Integration, pas GitHub Actions)
- Neon pour PostgreSQL serverless
- Better Auth pour auth (email/password seulement)
- Drizzle ORM (pas Prisma)
- standalone output pour compatibilité Docker
- shadcn/ui base-nova style

### Issues connues
- Constante `NETWORKS` dupliquée dans `add-earning-form.tsx` et `disclosures/page.tsx`
- `seed.ts` duplique la logique de connexion DB au lieu d'importer `db/index.ts`
- `url.totalLinks` stocke le compte affiliés seulement (nom trompeur)
- Pas de sanitization d'input sur les URLs (risque SSRF)
- `earnings.amount` est `decimal` en DB mais géré comme string dans les queries

## Déploiement

- **Hébergeur** : Vercel (projet `creator-affiliate-os`, ID: `prj_MvNkfD1JApSlFP33rOBmL0f7nKeD`)
- **Base de données** : Neon PostgreSQL (region us-east-2)
- **Repo GitHub** : `JPB-777/creator-affiliate-os`
- **Méthode deploy** : Vercel Git Integration (auto-deploy sur push `main`)
- **Méthode secrets** : Vercel Environment Variables
- **GitHub Actions** : ❌ Pas configuré (deploy géré par Vercel directement)
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
| 4 | Pre-launch | ⚠️ Vercel déployé, secrets à valider |
| 5 | Security | ❌ Checklist pas passée |
| 6 | Deployment | ⚠️ Live sur Vercel, validation en cours |
| 7 | Post-launch | ❌ Aucun vrai utilisateur confirmé |

## Changelog

| Date | Changements |
|------|-------------|
| 2026-03-10 | CLAUDE.md initial créé depuis analyse complète du codebase |
| 2026-03-10 | Reformaté au format framework Product Strategist. Ajout contexte déploiement Vercel + Neon. Phases 1-3 marquées complétées. Scope freeze appliqué. |
| 2026-03-10 | Fix: ajout `baseURL: process.env.BETTER_AUTH_URL` dans `src/lib/auth.ts`. Sign-in échouait en prod car Better Auth ne pouvait pas setter le cookie de session sans baseURL explicite. |
| 2026-03-10 | Feat: 4 features high-impact — Bulk import URLs (20/batch, dedup), Dashboard graphiques revenus (Recharts stacked bar), Alertes email liens brisés (Resend), Scan récurrent Vercel Cron (1x/jour, 10 URLs/run). Deps ajoutées : recharts, resend. |
