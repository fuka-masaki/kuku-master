# TICKET-005: レベル選択画面の実装

## 📋 概要
7つのレベルを選択できる画面を実装する。

## 🎯 目的
ユーザーが好きなレベルを選択し、学習を開始できるようにする。

## 📦 依存チケット
- **TICKET-001**: プロジェクトセットアップ（必須）
- **TICKET-002**: 型定義とデータ構造の設計（必須）
- **TICKET-003**: 九九マスターデータの作成（必須）
- **TICKET-004**: 共通コンポーネントの実装（必須）

## 📝 詳細要件

### 1. レベル選択画面コンポーネント

#### `src/components/screens/LevelSelectScreen.tsx`
```typescript
import React from 'react';
import { LevelConfig } from '@/types';
import { LevelCard, Button } from '@/components/common';
import { getLevelConfigs } from '@/data/dataLoader';

interface LevelSelectScreenProps {
  onLevelSelect: (levelId: number) => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  onLevelSelect,
}) => {
  const levelConfigs = getLevelConfigs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            九九マスター
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            レベルをえらんで、ちょうせんしよう！
          </p>
        </header>

        {/* レベル一覧 */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {levelConfigs.map((config) => (
            <LevelCard
              key={config.id}
              config={config}
              onClick={() => onLevelSelect(config.id)}
            />
          ))}
        </div>

        {/* フッター */}
        <footer className="text-center mt-12 text-sm text-gray-600">
          <p>Bright 珠算教場</p>
        </footer>
      </div>
    </div>
  );
};
```

### 2. レベルカードのスタイリング強化

レベルごとに異なる色を付ける（オプション）:

```typescript
// LevelCard.tsx の拡張
const getLevelColor = (levelId: number): string => {
  const colors = [
    'from-green-400 to-green-600',     // レベル1
    'from-blue-400 to-blue-600',       // レベル2
    'from-purple-400 to-purple-600',   // レベル3
    'from-pink-400 to-pink-600',       // レベル4
    'from-yellow-400 to-yellow-600',   // レベル5
    'from-red-400 to-red-600',         // レベル6
    'from-indigo-400 to-indigo-600',   // レベル7
  ];
  return colors[levelId - 1] || colors[0];
};
```

### 3. レスポンシブデザイン

#### モバイル（320px〜）
- 1カラム表示
- カード幅: 100%
- フォントサイズ: 小さめ

#### タブレット（768px〜）
- 2カラム表示
- カード幅: 約50%
- フォントサイズ: 中くらい

#### PC（1024px〜）
- 2カラム表示
- カード幅: 最大600px
- フォントサイズ: 大きめ

### 4. アニメーション

#### カードホバー時
```css
/* Tailwindクラス */
hover:scale-105
hover:shadow-xl
transition-all duration-300
```

#### カードクリック時
```css
active:scale-95
```

#### ページ遷移時（フェードイン）
```typescript
import { useEffect, useState } from 'react';

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  onLevelSelect,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      className={`min-h-screen transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* ... */}
    </div>
  );
};
```

### 5. テスト用のルーティング設定

#### `src/App.tsx`（仮実装）
```typescript
import React, { useState } from 'react';
import { LevelSelectScreen } from '@/components/screens/LevelSelectScreen';

function App() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleLevelSelect = (levelId: number) => {
    console.log('Selected level:', levelId);
    setSelectedLevel(levelId);
    // 後のチケットで問題画面に遷移する処理を実装
  };

  return (
    <div>
      {selectedLevel === null ? (
        <LevelSelectScreen onLevelSelect={handleLevelSelect} />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold">
            レベル {selectedLevel} を選択しました
          </h1>
        </div>
      )}
    </div>
  );
}

export default App;
```

## 🔍 実装手順

1. `src/components/screens/LevelSelectScreen.tsx` を作成
2. `LevelCard` コンポーネントをインポート
3. `getLevelConfigs()` でデータを取得
4. レベルカードを一覧表示
5. クリックイベントで `onLevelSelect` を呼び出す
6. レスポンシブデザインを確認
7. アニメーションを追加
8. `App.tsx` でテスト

## ✅ 受け入れ基準

- [ ] 7つのレベルカードが表示される
- [ ] 各カードに正しい情報が表示される（タイトル、説明、問題数、目標タイム）
- [ ] カードをクリックすると `onLevelSelect` が呼ばれる
- [ ] スマートフォンで1カラム、タブレット/PCで2カラム表示
- [ ] ホバー/アクティブ状態のアニメーションが動作する
- [ ] ページ読み込み時のフェードインアニメーション
- [ ] TypeScriptのエラーがない
- [ ] 小学生が見やすいデザイン

## 🔧 技術的詳細

### グリッドレイアウト
```css
/* Tailwindクラス */
grid grid-cols-1 md:grid-cols-2 gap-4
```

### グラデーション背景
```css
bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100
```

### レスポンシブテキスト
```css
text-5xl md:text-6xl
```

## ⚠️ 注意事項

1. **データ読み込み**: `getLevelConfigs()` が正しくデータを返すことを確認
2. **パフォーマンス**: 7つのカードなので、特別な最適化は不要
3. **アクセシビリティ**: カードはbutton要素を使用
4. **色の視認性**: 背景とテキストのコントラストを確保

## 📊 見積もり工数
**約3〜4時間**

## 🔗 関連ドキュメント
- [Tailwind CSS - Grid](https://tailwindcss.com/docs/grid-template-columns)
- [Tailwind CSS - Responsive Design](https://tailwindcss.com/docs/responsive-design)

## 📎 次のチケットへの引き継ぎ事項
- レベル選択後、問題画面に遷移する処理を実装（TICKET-006）
- 選択されたレベルIDを問題画面に渡す

## 🎨 デザイン参考
- 明るく、楽しい雰囲気
- カラフルだが目に優しい配色
- 大きなボタンで押しやすい
- アニメーションで楽しさを演出
