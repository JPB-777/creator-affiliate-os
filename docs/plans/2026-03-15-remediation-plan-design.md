# Plan de remédiation — Design Document

**Date:** 2026-03-15
**Statut:** Approuvé
**Contexte:** Audit de sécurité/architecture du repo Creator Affiliate OS

## Vue d'ensemble

3 phases séquentielles, 8 items, ordre strict : 1→2→3→4→5→6→8→7

## Phase 1 — Sécurité critique

### 1.1 SSRF Mitigation
- **Fichiers:** `src/lib/scanner/url-validator.ts` (new), `src/lib/scanner/fetcher.ts`, `src/lib/scanner/checker.ts`
- **Stratégie:** Nouveau module `url-validator.ts` — valide protocole (HTTP/HTTPS only), résout DNS, bloque IPs privées (127.x, 10.x, 172.16-31.x, 192.168.x, 169.254.x, IPv6 ULA/link-local), limite longueur à 2048
- **Intégration:** Appel dans `fetchPage()` et `checkLinks()`

### 1.2 Rate Limiting (Upstash Redis)
- **Fichiers:** `src/lib/rate-limit.ts` (new), `src/middleware.ts`, `src/server/actions/scans.ts`, `package.json`
- **Dépendances:** `@upstash/redis`, `@upstash/ratelimit`
- **Limiteurs:**
  - Auth: 5 tentatives/min par IP (sliding window)
  - Scans: 50/jour par userId
  - API: 100/heure par API key hash
- **Secrets Vercel:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- **Fallback:** Skip rate limit si env vars absentes (dev/CI)
- **Exemption:** Cron bypass scan limiter

## Phase 2 — Architecture & data integrity

### 2.1 Scan async via `after()`
- **Fichiers:** `src/lib/scanner/run-scan.ts` (new), `src/server/actions/scans.ts`
- **Stratégie:** `triggerScan()` insère scan "pending", retourne immédiatement, `after()` lance `executeScan()` en background
- **Cleanup:** Cron marque scans "pending" > 10 min comme "failed"

### 2.2 Lock par URL
- **Fichiers:** `src/lib/db/schema.ts`, `src/lib/scanner/run-scan.ts`, migration
- **Stratégie:** Colonne `scanningLockedAt` sur `urls`. UPDATE conditionnel (null ou stale > 10 min). Libération dans `finally`.

### 2.3 Indexes DB + contrainte unique URL
- **Fichiers:** `src/lib/db/schema.ts`, migration, `src/server/actions/urls.ts`
- **Indexes:** userId sur urls/links/scans/earnings/lsh/notifications, composite (urlId, isAffiliate) sur links, (userId, isRead) sur notifications
- **Unique:** (userId, url) sur urls
- **Prérequis:** Dédup existants avant migration unique

### 2.4 Fix Top Performing Content
- **Fichier:** `src/server/queries/dashboard.ts`
- **Fix:** JOIN `earnings.urlId = urls.id` au lieu de `earnings.networkName = links.networkName`. Supprimer le JOIN intermédiaire sur `links`.

## Phase 3 — Garde-fous dev

### 3.1 Fix lint existant
- **Fichiers:** À déterminer (theme-toggle + autres)
- **Stratégie:** Corriger, pas désactiver

### 3.2 GitHub Actions CI
- **Fichier:** `.github/workflows/ci.yml` (new)
- **Jobs:** lint → typecheck → build (env stubs pour CI)
- **Trigger:** PR vers main + push sur main

## Ordre d'implémentation strict

1. SSRF mitigation
2. Rate limiting Upstash
3. Scan async `after()`
4. Lock par URL
5. Indexes DB + unique URL
6. Fix Top Performing Content
7. Fix lint
8. GitHub Actions CI

## Risques de régression identifiés

- URLs légitimes avec DNS lent → timeout DNS acceptable
- Upstash env vars manquantes → fallback gracieux (skip)
- Cron doit bypasser scan rate limit
- Scans async: revalidatePath ne fonctionne plus → polling client
- Scans pending > 10 min = cleanup nécessaire
- Doublons URL existants → dédup avant migration unique
- Earnings sans urlId → disparaissent de Top Performing (comportement correct)
- Fixes lint peuvent changer le comportement → review individuel
