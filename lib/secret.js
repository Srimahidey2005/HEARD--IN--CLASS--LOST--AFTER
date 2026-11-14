// Edge-safe (used by middleware.js and lib/auth.js): no Node-only imports here.
const DEV_SECRET = 'development-only-secret-change-this-please-123456';

export function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && (!secret || secret.length < 32)) {
    throw new Error('JWT_SECRET must be set in .env.local (at least 32 characters) before running in production.');
  }
  return new TextEncoder().encode(secret || DEV_SECRET);
}
