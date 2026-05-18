export const ADMIN_EMAIL = "admin@store.com";
export const ADMIN_PASSWORD = "Admin@1234";
const SECRET_KEY = "ADMIN_SECRET_KEY_2024";

// Very basic client-side JWT-like token generation
export const generateToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const data = btoa(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 }));
  const signature = btoa(SECRET_KEY); // Dummy signature for client-side
  return `${header}.${data}.${signature}`;
};

export const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    const signature = atob(parts[2]);
    
    if (signature !== SECRET_KEY) return null;
    if (Date.now() > payload.exp) return null; // Expired
    
    return payload;
  } catch (error) {
    return null;
  }
};
