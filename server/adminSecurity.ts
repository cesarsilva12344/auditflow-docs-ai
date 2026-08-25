import { createCipheriv, createDecipheriv, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

const secret = () => scryptSync(process.env.JWT_SECRET || "auditflow-local-secret", "auditflow-admin", 32);
const encoder = new TextEncoder();
export const ADMIN_COOKIE = "auditflow_admin_session";
export const USER_COOKIE = "auditflow_user_session";

export function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); const hash = scryptSync(password, salt, 64).toString("hex"); return `scrypt$${salt}$${hash}`; }
export function verifyPassword(password: string, stored: string) { const [, salt, expected] = stored.split("$"); if (!salt || !expected) return false; const actual = scryptSync(password, salt, 64); return timingSafeEqual(actual, Buffer.from(expected, "hex")); }
export function encryptSecret(value: string) { const iv = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", secret(), iv); const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]); return `${iv.toString("hex")}.${cipher.getAuthTag().toString("hex")}.${encrypted.toString("hex")}`; }
export function decryptSecret(value: string) { const [ivHex, tagHex, dataHex] = value.split("."); if (!ivHex || !tagHex || !dataHex) throw new Error("Invalid encrypted secret"); const decipher = createDecipheriv("aes-256-gcm", secret(), Buffer.from(ivHex, "hex")); decipher.setAuthTag(Buffer.from(tagHex, "hex")); return Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]).toString("utf8"); }
export async function createAdminToken(username: string) { return new SignJWT({ scope: "admin", username }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(secret()); }
export async function verifyAdminToken(token?: string) { if (!token) return false; try { const result = await jwtVerify(token, secret()); return result.payload.scope === "admin"; } catch { return false; } }
export async function createUserToken(userId: number) { return new SignJWT({ scope: "user", userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret()); }
export async function verifyUserToken(token?: string) { if (!token) return undefined; try { const result = await jwtVerify(token, secret()); if (result.payload.scope !== "user") return undefined; return Number(result.payload.userId); } catch { return undefined; } }
export function adminCookieOptions() { return { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 }; }
export const adminSecretForCookie = (req: { headers: { cookie?: string } }) => req.headers.cookie?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${ADMIN_COOKIE}=`))?.split("=").slice(1).join("=");
export const userSecretForCookie = (req: { headers: { cookie?: string } }) => req.headers.cookie?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${USER_COOKIE}=`))?.split("=").slice(1).join("=");
