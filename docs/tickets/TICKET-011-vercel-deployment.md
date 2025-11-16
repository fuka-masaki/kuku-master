# TICKET-011: Vercelデプロイ設定

## 📋 概要
完成したアプリケーションをVercelにデプロイし、本番環境で公開する。

## 🎯 目的
誰でもアクセスできるWebアプリケーションとして公開する。

## 📦 依存チケット
- **TICKET-001〜010**: 全ての機能実装が完了していること（必須）

## 📝 詳細要件

### 1. プロジェクトの最終確認

#### ビルドテスト
```bash
npm run build
```

エラーがないことを確認。

#### プレビュー
```bash
npm run preview
```

本番環境と同じ状態で動作確認。

### 2. 環境変数の設定（必要な場合）

#### `.env.example` の作成
```bash
# .env.example
# 本番環境用の環境変数サンプル
```

現在のプロジェクトでは環境変数は不要ですが、将来の拡張のために用意。

### 3. Vercel設定ファイルの作成

#### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 4. package.jsonの確認

#### `package.json`
```json
{
  "name": "lancers-matorioshika-multiplicationapp",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 5. Gitリポジトリの準備

#### .gitignore の確認
```
# dependencies
node_modules

# production
dist
build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# editor
.vscode
.idea
*.swp
*.swo
```

#### Gitリポジトリの作成
```bash
git init
git add .
git commit -m "Initial commit: Complete implementation"
```

#### GitHubリポジトリの作成と連携
```bash
# GitHubでリポジトリ作成後
git remote add origin https://github.com/YOUR_USERNAME/Lancers_Matorioshika_MultiplicationApp.git
git branch -M main
git push -u origin main
```

### 6. Vercelアカウントの準備

1. [Vercel](https://vercel.com/)にアクセス
2. GitHubアカウントでサインアップ/ログイン
3. Vercelダッシュボードにアクセス

### 7. Vercelへのデプロイ

#### 方法1: Vercel CLIを使用
```bash
# Vercel CLIのインストール
npm install -g vercel

# ログイン
vercel login

# デプロイ
vercel

# 本番環境へのデプロイ
vercel --prod
```

#### 方法2: Vercel Dashboard（推奨）
1. Vercelダッシュボードで「New Project」をクリック
2. GitHubリポジトリを選択
3. プロジェクト設定:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. 「Deploy」をクリック

### 8. デプロイ後の確認

#### チェックリスト
- [ ] デプロイが成功している
- [ ] URLにアクセスできる
- [ ] レベル選択画面が表示される
- [ ] 各レベルで問題が出題される
- [ ] タイマーが動作する
- [ ] 結果画面が表示される
- [ ] 印刷機能が動作する
- [ ] スマートフォンで正しく表示される
- [ ] タブレットで正しく表示される
- [ ] PCで正しく表示される

### 9. カスタムドメインの設定（オプション）

独自ドメインが必要な場合:

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」→「Domains」
3. ドメインを追加
4. DNSレコードを設定

**現在は不要ですが、将来的に必要になった場合のために手順を記載。**

### 10. 自動デプロイの設定

GitHubとの連携により、以下が自動で実行されます:

- **mainブランチへのpush**: 本番環境に自動デプロイ
- **その他のブランチへのpush**: プレビュー環境を自動生成

### 11. パフォーマンスの最適化

#### ビルド最適化
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // console.logを削除
      },
    },
  },
})
```

### 12. エラー監視（オプション）

将来的な拡張として、エラー監視ツールの導入を検討:
- Sentry
- LogRocket
- Vercel Analytics

### 13. README.mdの作成

#### `README.md`
```markdown
# 九九マスター

小学生向けの九九学習Webアプリケーション

## 機能

- 7つの難易度レベル
- タイマー機能
- 間違えた問題の印刷機能
- レスポンシブデザイン（スマホ、タブレット、PC対応）

## デモ

https://lancers-matorioshika-multiplicationapp.vercel.app

## 技術スタック

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Vercel

## 開発

\`\`\`bash
# インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
\`\`\`

## ライセンス

MIT

## 作成者

Bright 珠算教場
\`\`\`

### 14. デプロイ後のメンテナンス

#### 定期的な確認
- [ ] 月1回: 動作確認
- [ ] 四半期ごと: 依存関係の更新
- [ ] 年1回: セキュリティ監査

#### 依存関係の更新
```bash
# 更新可能なパッケージを確認
npm outdated

# パッケージを更新
npm update

# メジャーバージョンアップ
npm install react@latest react-dom@latest
```

## 🔍 実装手順

1. ローカルでビルドテスト
2. GitHubリポジトリの作成
3. Vercelアカウントの作成
4. Vercelにデプロイ
5. デプロイ後の動作確認
6. README.mdの作成
7. 最終チェック

## ✅ 受け入れ基準

- [ ] Vercelにデプロイされている
- [ ] 公開URLにアクセスできる
- [ ] 全ての機能が本番環境で動作する
- [ ] スマートフォンで正しく動作する
- [ ] タブレットで正しく動作する
- [ ] PCで正しく動作する
- [ ] ビルドエラーがない
- [ ] TypeScriptエラーがない
- [ ] README.mdが作成されている
- [ ] GitHubリポジトリが整理されている

## 🔧 技術的詳細

### Vercelの特徴
- **自動デプロイ**: GitHubへのpushで自動デプロイ
- **プレビュー環境**: PRごとにプレビューURL生成
- **CDN**: 世界中にエッジサーバーを配置
- **無料プラン**: 個人・小規模プロジェクトは無料

### ビルド時間
- 初回: 約2〜3分
- 2回目以降: 約1〜2分（キャッシュあり）

## ⚠️ 注意事項

1. **環境変数**: 機密情報は含めない（現在は不使用）
2. **ビルドサイズ**: できるだけ小さく（目標: 500KB以下）
3. **エラー処理**: 本番環境でのエラーハンドリング
4. **パフォーマンス**: Lighthouse スコア 90以上を目指す

## 📊 見積もり工数
**約2〜3時間**
- リポジトリ準備: 30分
- Vercelデプロイ: 30分
- 動作確認: 1時間
- README作成: 30分
- 最終調整: 30分

## 🔗 関連ドキュメント
- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Vite公式ドキュメント - デプロイ](https://vitejs.dev/guide/static-deploy.html)
- [GitHub公式ドキュメント](https://docs.github.com/)

## 🎉 完成！

このチケットの完了をもって、プロジェクトの全機能が実装・デプロイされます。

### 次のステップ
- ユーザーからのフィードバック収集
- 機能改善・追加
- パフォーマンス最適化
- アクセシビリティ向上
