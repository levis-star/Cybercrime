# Deployment Guide

## Frontend on Vercel or Netlify

1. Set project root to `frontend`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Environment variable: `VITE_API_URL=https://your-api.example.com/api`.

## Backend on Render or Railway

1. Set project root to `backend`.
2. Start command: `npm run start`.
3. Add environment variables from `backend/.env.example`.
4. Set `CLIENT_ORIGIN` to the deployed frontend URL.
5. Use persistent storage only for demos; production evidence should use object storage.

## Supabase

1. Create a Supabase project.
2. Run `database/schema.sql`.
3. Run `database/seed.sql`.
4. Create a private storage bucket for evidence.
5. Replace the in-memory repository with Supabase queries in `backend/src/data/store.js`.
