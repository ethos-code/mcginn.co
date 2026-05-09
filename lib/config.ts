/**
 * Shared password for NDA case studies.
 *
 * NOTE: This is a client-side gate, not real protection — the modal HTML and
 * markdown body render in the browser. For true protection, wire this through
 * a server-side check (Next.js Route Handler + cookie) before publishing
 * sensitive material here.
 *
 * Change this constant to rotate the password.
 */
export const NDA_PASSWORD = 'mcginn';
