# TICKET-001: プロジェクトセットアップ

## 📋 概要
Vite + React + TypeScript + Tailwind CSSを使用したプロジェクトの初期セットアップを行う。

## 🎯 目的
開発環境を構築し、他のチケットの実装基盤を整える。

## 📦 依存チケット
なし（最初に実装するチケット）

## 📝 詳細要件

### 1. プロジェクト作成
- Viteを使用してReact + TypeScriptプロジェクトを作成
- プロジェクト名: `Lancers_Matorioshika_MultiplicationApp`

### 2. Tailwind CSSのセットアップ
- Tailwind CSS v3以上をインストール
- PostCSSとAutoprefixerの設定
- `tailwind.config.js`の作成
- グローバルCSS（`index.css`）にTailwindディレクティブを追加

### 3. ディレクトリ構造の構築
```
src/
├── components/        # Reactコンポーネント
│   ├── common/       # 共通コンポーネント
│   ├── screens/      # 画面コンポーネント
│   └── features/     # 機能別コンポーネント
├── data/             # 静的データ（九九データなど）
├── types/            # TypeScript型定義
├── utils/            # ユーティリティ関数
├── hooks/            # カスタムフック
├── constants/        # 定数
├── App.tsx
└── main.tsx
```

### 4. 必要なパッケージのインストール
```json
{
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
  }
}
```

### 5. 設定ファイルの作成

#### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

#### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // カスタムカラーパレット（小学生向け）
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          // ... 追加
        },
      },
      fontFamily: {
        'kids': ['Noto Sans JP', 'sans-serif'], // 読みやすいフォント
      },
    },
  },
  plugins: [],
}
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 6. 基本的なApp.tsxの作成
```typescript
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold text-center pt-10">
        九九マスター
      </h1>
    </div>
  );
}

export default App;
```

### 7. Google Fontsの追加（index.html）
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap" rel="stylesheet">
```

## 🔍 実装手順

1. Viteでプロジェクト作成
   ```bash
   npm create vite@latest Lancers_Matorioshika_MultiplicationApp -- --template react-ts
   cd Lancers_Matorioshika_MultiplicationApp
   npm install
   ```

2. Tailwind CSSインストール
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. ディレクトリ構造を作成
   ```bash
   mkdir -p src/{components/{common,screens,features},data,types,utils,hooks,constants}
   ```

4. 設定ファイルを上記の通り編集

5. 開発サーバー起動確認
   ```bash
   npm run dev
   ```

6. ビルド確認
   ```bash
   npm run build
   ```

## ✅ 受け入れ基準

- [ ] `npm run dev`で開発サーバーが起動する
- [ ] ブラウザで`http://localhost:3000`にアクセスできる
- [ ] 「九九マスター」というタイトルが表示される
- [ ] Tailwind CSSのスタイルが適用されている
- [ ] TypeScriptのコンパイルエラーがない
- [ ] `npm run build`が成功する
- [ ] 全てのディレクトリが作成されている
- [ ] Google Fontsが読み込まれている

## 🔧 技術的詳細

### Viteを選択する理由
- 高速な開発サーバー（HMR）
- ビルドが速い
- 設定がシンプル
- モダンなブラウザに最適化

### Tailwind CSSを選択する理由
- レスポンシブデザインが簡単
- カスタマイズ性が高い
- ファイルサイズが小さい（未使用CSSを削除）
- 開発速度が速い

## ⚠️ 注意事項

1. **Node.jsバージョン**: 18.0.0以上を推奨
2. **パッケージマネージャー**: npmを使用（yarnやpnpmでも可）
3. **Git**: 初期コミットを作成すること
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Project setup"
   ```
4. **.gitignore**: 自動生成されるが、以下を確認
   ```
   node_modules
   dist
   .env
   .DS_Store
   ```

## 📊 見積もり工数
**約1〜2時間**

## 🔗 関連ドキュメント
- [Vite公式ドキュメント](https://vitejs.dev/)
- [React公式ドキュメント](https://react.dev/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
