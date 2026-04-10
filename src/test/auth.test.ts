// @vitest-environment node
import { describe, expect, it } from "vitest";

import { signToken, verifyToken, getTokenExpiry } from "@/lib/auth";

describe("JWT auth utilities", () => {
  const payload = {
    sub: "1",
    email: "test@example.com",
    isManager: false,
  };

  it("signToken returns a token string", async () => {
    const token = await signToken(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("verifyToken returns the original payload", async () => {
    const token = await signToken(payload);
    const decoded = await verifyToken(token);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.isManager).toBe(payload.isManager);
  });

  it("verifyToken throws on invalid token", async () => {
    await expect(verifyToken("invalid.token.here")).rejects.toThrow();
  });

  it("getTokenExpiry returns a date ~24h in the future", () => {
    const before = Date.now();
    const expiry = getTokenExpiry();
    const after = Date.now();
    const diff = expiry.getTime() - before;
    expect(diff).toBeGreaterThan(23 * 60 * 60 * 1000);
    expect(diff).toBeLessThan(25 * 60 * 60 * 1000 + (after - before));
  });
});
