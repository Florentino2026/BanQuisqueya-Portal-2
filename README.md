# BanQuisqueya & Trust — Investor Portal

Next.js + Supabase Auth/SSR starter for the private investment portal.

## Supabase
Project URL: https://zeiesuikwjbxzcvehbkj.supabase.co

The database has profiles, investors, projects, investments, transactions, documents, opportunities and notifications with RLS.

## Run
1. Copy `.env.example` to `.env.local`.
2. Put the Supabase Publishable Key in `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. `npm install`
4. `npm run dev`

## Auth email templates
For SSR confirmation, configure Supabase Auth email templates to use:
`{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`

Set Site URL to the deployed app URL (and localhost during development).

## Deployment
Recommended: Vercel for the Next.js application and Supabase for database/auth/storage. IONOS can remain for the domain/DNS if desired.
