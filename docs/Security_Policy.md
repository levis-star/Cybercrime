# Security Policy

## Implemented Controls

- JWT authentication with role-based access control.
- Password hashing with bcrypt.
- Helmet security headers.
- CORS allow-list through `CLIENT_ORIGIN`.
- API rate limiting.
- Zod request validation.
- Evidence upload type and size restrictions.
- Audit logging for admin review and alert creation.
- Anonymous report support with tracking codes.

## Production Requirements

- Replace `JWT_SECRET` with a long random secret.
- Serve API and frontend only over HTTPS.
- Store evidence in Supabase Storage or Cloudinary with private access policies.
- Add CAPTCHA or hCaptcha to public report submission.
- Persist audit logs in PostgreSQL.
- Enable Supabase RLS policies for all authenticated data paths.
- Add malware scanning for uploaded evidence.
- Define evidence retention and deletion policy with legal stakeholders.
