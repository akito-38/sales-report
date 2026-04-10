import { loginSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("有効なメールとパスワードで成功する", () => {
    const result = loginSchema.safeParse({
      email: "yamada@example.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(true);
  });

  it("メールアドレスが空の場合にエラー", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "メールアドレスは必須項目です"
      );
    }
  });

  it("不正なメール形式でエラー", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "メール形式で入力してください"
      );
    }
  });

  it("パスワードが7文字以下でエラー", () => {
    const result = loginSchema.safeParse({
      email: "yamada@example.com",
      password: "1234567",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "パスワードは8文字以上で入力してください"
      );
    }
  });

  it("パスワードが空の場合にエラー", () => {
    const result = loginSchema.safeParse({
      email: "yamada@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("パスワードは必須項目です");
    }
  });
});
