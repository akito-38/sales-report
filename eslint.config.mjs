import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import("eslint").Linter.Config[]} */
const config = [
  // Next.js 推奨ルール
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // TypeScript 向け追加ルール
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // 未使用変数はエラー（_ プレフィックスは除外）
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // any 型の使用を警告
      "@typescript-eslint/no-explicit-any": "warn",
      // 非nullアサーション演算子(!)を警告
      "@typescript-eslint/no-non-null-assertion": "warn",
      // console.log を警告（console.error/warn は許可）
      "no-console": ["warn", { allow: ["error", "warn"] }],
      // import 順序
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  // テストファイル向け緩和ルール
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },

  // 対象外ディレクトリ
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "*.config.mjs",
      "*.config.js",
      "*.config.ts",
      "prisma/**",
    ],
  },
];

export default config;
