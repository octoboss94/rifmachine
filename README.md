# Rif Machine — Guide de Déploiement

## ÉTAPE 1 — Supabase
1. Create account at supabase.com (free)
2. New project → name: "rifmachine" → set password
3. Go to SQL Editor → paste and run the schema (`supabase/schema.sql`)
4. Go to Settings → API → copy URL and anon/service keys
5. Go to Authentication → Users → Invite the admin email

## ÉTAPE 2 — GitHub
1. Create account at github.com
2. New repository → name: "rifmachine" → Public
3. Upload all project files
4. Commit message: "Initial commit — Rif Machine full website"

## ÉTAPE 3 — Vercel (Public Website & Admin)
1. Create account at vercel.com (free) with GitHub
2. Import repository "rifmachine"
3. Add Environment Variables (from Supabase): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
4. Deploy → get URL: `rifmachine.vercel.app`

## ACCÈS ADMIN
URL: `https://your-domain.vercel.app/admin/login`
Email: (l'email invité dans Supabase Auth)
Mot de passe: (défini lors de la première connexion)
