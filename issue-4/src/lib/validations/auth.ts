import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスは必須項目です")
    .email("メール形式で入力してください"),
  password: z
    .string()
    .min(1, "パスワードは必須項目です")
    .min(8, "パスワードは8文字以上で入力してください"),
});

export type LoginInput = z.infer<typeof loginSchema>;
