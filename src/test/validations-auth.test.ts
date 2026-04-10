import { describe, expect, it } from "vitest";

import { loginSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "yamada@example.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = loginSchema.safeParse({ email: "", password: "Test1234!" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing password", () => {
    const result = loginSchema.safeParse({
      email: "yamada@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 chars", () => {
    const result = loginSchema.safeParse({
      email: "yamada@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});
