import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    // グローバル API（describe, it, expect 等）を import なしで使用可能にする
    globals: true,
    // ブラウザ環境のシミュレーション
    environment: "jsdom",
    // 各テストファイル実行前に読み込むセットアップファイル
    setupFiles: ["./src/test/setup.ts"],
    // カバレッジ設定
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/**/*.d.ts",
        "src/**/*.stories.{ts,tsx}",
        "src/app/layout.tsx",
        "src/app/**/page.tsx",
        // shadcn/ui 自動生成コンポーネントはテスト対象外
        "src/components/ui/**",
        // DB クライアントシングルトンはテスト対象外
        "src/lib/prisma.ts",
        // 型定義のみのファイル
        "src/types/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
