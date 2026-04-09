PROJECT_ID   := ai-chat-492413
REGION       := asia-northeast1
SERVICE_NAME := sales-report
REGISTRY     := asia-northeast1-docker.pkg.dev
IMAGE        := $(REGISTRY)/$(PROJECT_ID)/$(SERVICE_NAME)/$(SERVICE_NAME)
TAG          ?= latest

.PHONY: help dev build test lint docker-build docker-push deploy deploy-full setup-gcp \
        compose-up compose-down compose-logs migrate migrate-reset seed db-studio

help: ## コマンド一覧を表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ── ローカル開発 ──────────────────────────────────────────
dev: ## 開発サーバーを起動
	npm run dev

build: ## Next.js をビルド
	npm run build

test: ## テストを実行
	npm run test

lint: ## ESLint を実行
	npm run lint

lint-fix: ## ESLint を自動修正付きで実行
	npm run lint:fix

# ── ローカル Docker Compose ──────────────────────────────
compose-up: ## docker compose でローカル環境を起動（app + PostgreSQL）
	docker compose up -d

compose-down: ## docker compose を停止・削除
	docker compose down

compose-logs: ## docker compose のログを表示
	docker compose logs -f

migrate: ## Prisma マイグレーションを実行（開発環境）
	npx prisma migrate dev

migrate-reset: ## データベースをリセットしてマイグレーションを再実行
	npx prisma migrate reset --force

seed: ## シードデータを投入
	npx prisma db seed

db-studio: ## Prisma Studio を起動
	npx prisma studio

# ── Docker ────────────────────────────────────────────────
docker-build: ## Docker イメージをビルド
	docker build --tag $(IMAGE):$(TAG) .

docker-push: ## Docker イメージを Artifact Registry へプッシュ
	docker push $(IMAGE):$(TAG)

docker-run: ## Docker コンテナをローカルで起動
	docker run --rm -p 3000:3000 --env-file .env.local $(IMAGE):$(TAG)

# ── Google Cloud ──────────────────────────────────────────
gcloud-auth: ## gcloud 認証（初回セットアップ時）
	gcloud auth login
	gcloud config set project $(PROJECT_ID)
	gcloud auth configure-docker $(REGISTRY)

deploy: ## Cloud Run へデプロイ（既存イメージを使用）
	gcloud run deploy $(SERVICE_NAME) \
		--image $(IMAGE):$(TAG) \
		--region $(REGION) \
		--project $(PROJECT_ID) \
		--platform managed \
		--allow-unauthenticated

deploy-full: docker-build docker-push deploy ## ビルド・プッシュ・デプロイを一括実行

service-url: ## デプロイ済みサービスの URL を表示
	@gcloud run services describe $(SERVICE_NAME) \
		--region $(REGION) \
		--project $(PROJECT_ID) \
		--format "value(status.url)"

logs: ## Cloud Run のログを表示
	gcloud run services logs read $(SERVICE_NAME) \
		--region $(REGION) \
		--project $(PROJECT_ID) \
		--limit 100

# ── GCP 初期セットアップ ──────────────────────────────────
setup-gcp: ## Artifact Registry リポジトリを作成
	gcloud artifacts repositories create $(SERVICE_NAME) \
		--repository-format docker \
		--location $(REGION) \
		--project $(PROJECT_ID) \
		--description "Docker repository for $(SERVICE_NAME)"
