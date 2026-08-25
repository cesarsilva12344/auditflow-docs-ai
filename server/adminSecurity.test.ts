import { describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret, hashPassword, verifyPassword } from "./adminSecurity";

describe("admin security", () => {
  it("hashes and verifies passwords without storing plaintext", () => {
    const hash = hashPassword("admin-strong-password");
    expect(hash).not.toContain("admin-strong-password");
    expect(verifyPassword("admin-strong-password", hash)).toBe(true);
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("encrypts and decrypts the Qwen key", () => {
    const encrypted = encryptSecret("qwen-secret-value");
    expect(encrypted).not.toContain("qwen-secret-value");
    expect(decryptSecret(encrypted)).toBe("qwen-secret-value");
  });
});
