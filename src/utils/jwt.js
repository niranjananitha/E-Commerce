export const ADMIN_EMAIL = "admin@store.com";
export const ADMIN_PASSWORD = "Admin@1234";
const SECRET_KEY = "ADMIN_SECRET_KEY_2024";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const base64UrlEncode = (value) =>
  btoa(JSON.stringify(value))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const base64UrlDecode = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return JSON.parse(atob(padded));
};

const sign = (header, payload) => btoa(`${header}.${payload}.${SECRET_KEY}`)
  .replace(/=/g, "")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");

export const generateToken = (payload) => {
  const header = base64UrlEncode({ alg: "HS256", typ: "JWT" });
  const data = base64UrlEncode({ ...payload, exp: Date.now() + TOKEN_TTL_MS });
  const signature = sign(header, data);

  return `${header}.${data}.${signature}`;
};

export const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, data, signature] = parts;
    if (signature !== sign(header, data)) return null;

    const payload = base64UrlDecode(data);
    if (Date.now() > payload.exp) return null;
    if (payload.role !== "admin" || payload.email !== ADMIN_EMAIL) return null;

    return payload;
  } catch (error) {
    return null;
  }
};
