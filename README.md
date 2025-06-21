# ほっこり福祉会 業務支援アプリ

高齢者・障がい者福祉施設向けの業務支援アプリケーションです。

## 🚀 機能

### 実装済み機能
- ✅ **Google認証** - セキュアなログイン機能
- ✅ **ダッシュボード** - シフト表示・ねぎらいメッセージ
- ✅ **支援日誌** - 利用者の日々の様子を詳細記録
- ✅ **レスポンシブデザイン** - スマートフォン・PC両対応

### 今後実装予定
- 🔄 **シフト管理** - 記号式シフト作成・管理
- 🔄 **業務日誌** - 職員の日々の業務記録
- 🔄 **連絡帳** - 家族連携機能（Claude API連携）
- 🔄 **ユーザー管理** - 管理者向け機能

## 🛠 技術スタック

- **フロントエンド**: Next.js 14 (App Router), React, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Firebase (Authentication, Firestore)
- **デプロイ**: Vercel
- **PWA対応**: Service Worker, Web App Manifest

## 📱 対応デバイス

- スマートフォン (iOS/Android)
- タブレット
- PC (Windows/Mac/Linux)
- PWA (オフライン対応)

## 🔧 開発セットアップ

### 前提条件
- Node.js 18.0 以上
- npm または yarn
- Firebase プロジェクト

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd hokkori-care
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.local.example .env.local
# .env.local を編集してFirebase設定を追加
```

4. 開発サーバーを起動
```bash
npm run dev
```

### 環境変数

`.env.local` に以下を設定してください：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_CLAUDE_API_KEY=your_claude_api_key
```

## 🚀 デプロイ

### Vercel

1. Vercelアカウントでリポジトリをインポート
2. 環境変数を設定（Vercel Dashboard）
3. 自動デプロイが開始されます

### Firebase設定

1. Firebase Console でプロジェクトを作成
2. Authentication で Google ログインを有効化
3. Firestore Database を作成
4. セキュリティルールを設定

## 📝 使用方法

### 初回ログイン
1. Googleアカウントでログイン
2. 管理者による承認待ち
3. 承認後、各機能が利用可能

### 支援日誌作成
1. ダッシュボードから「支援日誌作成」をクリック
2. 利用者を選択
3. 必要項目を入力
4. 保存

### ロール管理
- **総合管理者**: 全機能にアクセス可能
- **管理者**: スタッフ管理・シフト管理可能
- **スタッフ**: 日誌作成・閲覧のみ

## 🔐 セキュリティ

- Firebase Authentication による認証
- Firestore セキュリティルールでデータ保護
- HTTPS通信（Vercel自動対応）
- 個人情報保護法準拠

## 📊 データ構造

### Firestore Collections

```
/users - ユーザー情報
/support_diaries - 支援日誌
/work_diaries - 業務日誌
/shifts - シフト情報
/message_templates - ねぎらいメッセージ
```

## 🤝 貢献

1. Issue を確認または作成
2. Feature branch を作成
3. 変更を実装
4. Pull Request を作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 📞 サポート

技術的な問題や機能要望については、GitHub Issues をご利用ください。

---

**バージョン**: 1.0.0  
**最終更新**: 2025-06-17  
**開発者**: Claude Code Assistant