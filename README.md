# CareerForge AI

AI Interview Readiness Analyzer — Next.js 14 (App Router), Clerk, Groq, optional Supabase.

## Prerequisites

- Node.js 18+
- [Clerk](https://dashboard.clerk.com) and [Groq](https://console.groq.com) accounts (optional: [Supabase](https://supabase.com))

## Environment and run

From this directory (`careerforge-ai/`):

```bash
cp env.local.template .env.local
```

Edit **`.env.local`**:

1. **Clerk** — Dashboard → your application → **API Keys**. Paste **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** and **`CLERK_SECRET_KEY`** from the **same** instance. For **`http://localhost:3000`** use the **Development** keys (`pk_test_` + `sk_test_`). **`pk_live_` / `sk_live_` do not work on localhost** and often produce **`host_invalid`**. Do not hand-edit `pk_test` into `pk_live` while keeping the same key body.
2. **`GROQ_API_KEY`** — Groq Console → **API Keys** (required for AI: assessment, resume, portfolio, mock interview, insights).

Supabase variables are optional (browser-side sync of readiness reports when the table exists).

Then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in or sign up, then use **Assessment**, **Dashboard**, and the other app routes.

## Production build (recheck)

```bash
npm run build
npm start
```

## Env files

| File | Role |
|------|------|
| `env.local.template` | Starter file: copy to `.env.local`, then **set Clerk + Groq** (committed) |
| `.env.example` | Variable checklist with empty values (committed) |
| `.env.local` | Your real secrets (gitignored — not in git) |

## Vercel

Create a project from this repo (or connect the repo), set the same variables under **Settings → Environment Variables**, then deploy.
