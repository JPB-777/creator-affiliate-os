# Secrets Inventory — AffiliateOS

> Dernière mise à jour : 2026-03-10

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

- [ ] `BETTER_AUTH_SECRET` production est un vrai secret aléatoire
- [ ] `BETTER_AUTH_URL` production pointe vers HTTPS
- [ ] `NEXT_PUBLIC_APP_URL` production pointe vers HTTPS
- [ ] Aucun secret exposé dans le frontend bundle
- [ ] Aucun secret dans les logs serveur
- [ ] Aucun secret dans les logs CI
- [ ] DB credentials ne sont pas les mêmes en dev et prod
