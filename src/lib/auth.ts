import { SignJWT, jwtVerify } from "jose";

export interface JWTPayload {
  sub: string; // sales_person_id as string
  email: string;
  isManager: boolean;
}

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ?? "development-secret-key-change-in-production";
  // Use Buffer in Node.js environments (supports both runtime and test)
  if (typeof Buffer !== "undefined") {
    return Buffer.from(secret, "utf-8");
  }
  return new TextEncoder().encode(secret);
}

const JWT_SECRET = getJwtSecret();

const EXPIRES_IN = "24h";

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return {
    sub: payload.sub as string,
    email: payload.email as string,
    isManager: payload.isManager as boolean,
  };
}

export function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
}
