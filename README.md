# Community Cybercrime Reporting and Awareness System

A low-cost full-stack web app for Tanzanian cybercrime reporting, public awareness, live scam alerts, rule-based chatbot guidance, and admin triage.

## Stack

- Frontend: React, Vite, React Router, Axios, i18next, Chart.js, Leaflet, lucide-react
- Backend: Node.js, Express, JWT, bcrypt, Multer, Zod, Helmet, rate limiting
- Database target: Supabase PostgreSQL, with SQL files in `database/`

## Quick Start

```bash
cd CyberCrime_WebApp
npm.cmd install
npm.cmd run start --workspace backend
```

Open a second terminal:

```bash
cd CyberCrime_WebApp
npm.cmd run build --workspace frontend
npm.cmd run preview --workspace frontend -- --port 4173
```

Open `http://localhost:4173`. The backend health endpoint is `http://localhost:4000/api/health`.

Copy `backend/.env.example` to `backend/.env` before running the backend in production-like mode. Copy `frontend/.env.example` to `frontend/.env` if you need to point the frontend at a different API URL.

## Demo Credentials

- Admin: `admin@cybercrime.go.tz` / `Admin123!`
- Analyst: `analyst@cybercrime.go.tz` / `Analyst123!`

## Storage

The backend supports two storage providers:

- `local-json`: stores records at `backend/src/data/database.json` for offline demos.
- `firebase`: stores records in Cloud Firestore using Firebase Admin SDK.

Firebase is selected with:

```env
DATA_PROVIDER=firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Keep these values only in `backend/.env`. Do not commit `.env` or service-account JSON files.
