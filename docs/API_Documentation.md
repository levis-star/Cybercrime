# API Documentation

Base URL: `http://localhost:4000/api`

## Health

- `GET /health` returns API status.

## Authentication

- `POST /auth/register`
  - Body: `fullName`, `phone`, `email`, `password`, `languagePreference`
- `POST /auth/login`
  - Body: `email`, `password`
  - Returns: JWT token and public user profile
- `GET /auth/verify`
  - Requires: `Authorization: Bearer <token>`

## Reports

- `GET /reports/categories`
- `POST /reports/create`
  - Body: `category`, `description`, `locationRegion`, `latitude`, `longitude`, `anonymityStatus`, `hasEvidence`
  - Supports anonymous submission. Authenticated users may submit verified reports.
- `GET /reports/:trackingCode`
- `PUT /reports/update`
  - Admin or analyst only.
- `POST /reports/:trackingCode/upload-evidence`
  - Multipart field: `evidence`
  - Allowed: PNG, JPG, WEBP, PDF, TXT up to 5 MB

## Awareness and Alerts

- `GET /awareness/content?language=en`
- `GET /alerts/live?language=sw`
- `POST /alerts/create`
  - Admin or analyst only.

## Chatbot

- `POST /chatbot/query`
  - Body: `message`, `language`
  - Returns a rule-based guidance answer and whether escalation is recommended.

## Admin

- `GET /admin/dashboard`
- `GET /admin/analytics`
- `GET /admin/audit-logs`
- `PUT /admin/report-review`
- `POST /admin/alert-create`
