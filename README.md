# Dream Log（ドリームログ）

夢の記録と共有のためのソーシャルプラットフォーム

## 概要

ドリームログは、あなたの夢を記録し、他のユーザーと共有することができるプラットフォームです。
夢の内容を記録し、タグ付けして整理したり、他のユーザーと交流したりすることができます。

## 主な機能

### 1. アカウント管理
- ユーザー登録とログイン
- プロフィールの編集
- アカウント設定の管理

### 2. 夢の記録
- 夢の投稿（タイトル、内容、タグ付け）
- 公開設定の選択（公開/非公開）
- 投稿の編集と削除
- いいねとコメント機能

### 3. 検索と発見
- キーワードによる検索
- タグによる検索
- 並び替え機能
  - 新しい順
  - 古い順
  - 人気順（いいね数）
  - 話題順（コメント数）

### 4. コミュニティ機能
- ユーザープロフィールの表示
- フォロー/フォロワー機能
- タイムライン表示
- ユーザー間のインタラクション

## 開発環境

### 必要なツール
- Node.js（バージョン18以上）
- Docker（MySQL用）
- パッケージマネージャー：pnpm

### 使用技術
#### フロントエンド
- Next.js 14（最新のアプリケーションルーター採用）
- TypeScript（型安全な開発）
- Styled Components（スタイリング）
- Redux Toolkit（状態管理）

#### バックエンド
- Hono（軽量なWebフレームワーク）
- TypeScript（型安全な開発）
- TypeORM（O/Rマッパー）
- MySQL（データベース）
- Zod（データバリデーション）

## セットアップ手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/yourusername/dream-log.git
cd dream-log
```

### 2. 環境設定

#### バックエンド（`backend`フォルダ）
`.env`ファイルを作成し、以下の内容を設定：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=dream_log
DB_PASSWORD=dream_log
DB_DATABASE=dream_log
JWT_SECRET=任意の秘密鍵
```

#### フロントエンド（`frontend`フォルダ）
`.env.local`ファイルを作成し、以下の内容を設定：
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. データベースの準備

MySQLコンテナの起動：
```bash
docker-compose up -d
```

### 4. アプリケーションの起動

バックエンドの起動：
```bash
cd backend
pnpm install
pnpm dev
```

フロントエンドの起動：
```bash
cd frontend
pnpm install
pnpm dev
```

## 基本的な使い方

### 1. アカウントの作成
1. 「新規登録」ボタンをクリック
2. 必要な情報を入力
   - ユーザー名
   - メールアドレス
   - パスワード（8文字以上）
3. 登録完了後、自動的にログイン

### 2. 夢の投稿
1. タイムラインページで「投稿」ボタンをクリック
2. 夢の内容を入力
   - タイトル
   - 詳細な内容
   - タグ（任意）
3. 公開設定を選択
4. 「投稿する」をクリック

### 3. 他のユーザーとの交流
- 投稿にいいねやコメントを付ける
- 興味のあるユーザーをフォロー
- タグで関連する夢を探す

## APIリファレンス

### 認証関連
- `POST /auth/register` - 新規登録
- `POST /auth/login` - ログイン
- `GET /auth/me` - ユーザー情報取得

### 夢の管理
- `GET /dreams` - 夢の一覧取得
- `POST /dreams` - 夢の作成
- `GET /dreams/search` - 夢の検索
- `GET /dreams/:id` - 個別の夢の取得
- `PUT /dreams/:id` - 夢の更新
- `DELETE /dreams/:id` - 夢の削除
- `POST /dreams/:id/like` - いいねの切り替え
- `POST /dreams/:id/comments` - コメントの追加

### ユーザー管理
- `GET /users/:username` - プロフィール取得
- `GET /users/:username/dreams` - ユーザーの投稿一覧
- `PUT /users/profile` - プロフィール更新
- `POST /users/:username/follow` - フォロー/アンフォロー
- `GET /users/:username/followers` - フォロワー一覧
- `GET /users/:username/following` - フォロー中一覧

### タグ関連
- `GET /tags/popular` - 人気のタグ一覧
- `GET /tags/:name/dreams` - タグ別の夢一覧