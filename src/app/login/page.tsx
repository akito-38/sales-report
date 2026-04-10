import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { verifyToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "ログイン | 営業日報システム",
};

export default async function LoginPage() {
  // 認証済みの場合は /dashboard へリダイレクト
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    try {
      await verifyToken(token);
      redirect("/dashboard");
    } catch {
      // トークンが無効な場合はログイン画面を表示
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/50 px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            営業日報システム
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            アカウント情報を入力してログインしてください
          </p>
        </div>

        <div className="rounded-lg border bg-card px-6 py-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
