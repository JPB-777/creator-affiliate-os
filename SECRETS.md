# Secrets Inventory — AffiliateOS

> Dernière mise à jour : 2026-03-15

## Convention

`UPPERCASE_SNAKE_CASE` pour toutes les variables d'environnement.

## Inventaire

| Variable | Description | Requis? | Env | Utilisé par |
|----------|-------------|---------|-----|-------------|
| `DATABASE_URL` | Connection string PostgreSQL (Neon serverless) | Oui | prod + dev | `src/lib/db/index.ts`, `drizzle.config.ts`, `src/lib/db/seed.ts` |
| `DB_DRIVER` | Force le driver DB (`"neon"` ou `"postgres"`). Auto-détecté si omis | Non | prod + dev | `src/lib/db/index.ts` |
| `BETTER_AUTH_SECRET` | Secret pour signing des tokens d'authentification. Générer : `openssl rand -base64 32` | Oui | prod + dev | `better-auth` (interne) |
| `BETTER_AUTH_URL` | URL canonique de l'app (utilisée server-side par Better Auth) | Oui | prod + dev | `src/lib/auth.ts` |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'app (utilisée client-side pour redirections auth) | Oui | prod + dev | `src/lib/auth-client.ts` |
| `RESEND_API_KEY` | Clé API Resend pour alertes email (3k/mois gratuit) | Non | prod | `src/server/actions/notifications.ts`, crons |
| `CRON_SECRET` | Secret Vercel pour sécuriser endpoints cron (auto-fourni) | Non | prod | `src/app/api/crons/*` |
| `GITHUB_CLIENT_ID` | OAuth GitHub app client ID | Non | prod + dev | `src/lib/auth.ts` |
| `GITHUB_CLIENT_SECRET` | OAuth GitHub app client secret | Non | prod + dev | `src/lib/auth.ts` |
| `GOOGLE_CLIENT_ID` | OAuth Google app client ID | Non | prod + dev | `src/lib/auth.ts` |
| `GOOGLE_CLIENT_SECRET` | OAuth Google app client secret | Non | prod + dev | `src/lib/auth.ts` |
| `UPSTASH_REDIS_REST_URL` | URL REST Upstash Redis (rate limiting API v1) | Non | prod | `src/lib/api/rate-limit.ts`, `src/middleware.ts` |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST Upstash Redis | Non | prod | `src/lib/api/rate-limit.ts`, `src/middleware.ts` |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN Sentry pour error tracking | Non | prod | `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` |
| `SENTRY_ORG` | Organisation Sentry (pour source maps upload) | Non | prod | `next.config.ts` |
| `SENTRY_PROJECT` | Projet Sentry | Non | prod | `next.config.ts` |
| `SENTRY_AUTH_TOKEN` | Token auth Sentry (pour source maps upload) | Non | prod | `next.config.ts` |

## Règles

- Aucun secret dans le repo (jamais)
- `.env.local` pour dev uniquement (dans `.gitignore`)
- Secrets prod injectés via Vercel Environment Variables
- `BETTER_AUTH_SECRET` en production DOIT être un vrai secret aléatoire (pas le placeholder `creator-affiliate-os-secret-change-in-production`)
- `BETTER_AUTH_URL` et `NEXT_PUBLIC_APP_URL` en production doivent pointer vers le domaine Vercel HTTPS

## Valeurs par environnement

### Dev (`.env.local`)
```
DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=<dev-secret>
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel Environment Variables)
```
DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=https://<project>.vercel.app
NEXT_PUBLIC_APP_URL=https://<project>.vercel.app
```

## Checklist Sécurité Secrets

- [x] `BETTER_AUTH_SECRET` production est un vrai secret aléatoire ✅ Validé 2026-03-15
- [x] `BETTER_AUTH_URL` production pointe vers HTTPS ✅ Validé 2026-03-15
- [x] `NEXT_PUBLIC_APP_URL` production pointe vers HTTPS ✅ Validé 2026-03-15
- [x] `DATABASE_URL` production pointe vers Neon ✅ Validé 2026-03-15
- [ ] Aucun secret exposé dans le frontend bundle
- [ ] Aucun secret dans les logs serveur
- [ ] Aucun secret dans les logs CI
- [x] DB credentials ne sont pas les mêmes en dev et prod ✅
- [ ] `NEXT_PUBLIC_SENTRY_DSN` configuré dans Vercel (en attente création projet Sentry)
- [ ] `SENTRY_AUTH_TOKEN` configuré dans Vercel (en attente création projet Sentry)
- [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` configurés dans Vercel
