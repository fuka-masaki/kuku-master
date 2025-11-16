# TICKET-010: レスポンシブデザインの最終調整

## 📋 概要
スマートフォン、タブレット、PCの各デバイスで最適な表示とユーザー体験を提供できるよう、レスポンシブデザインを調整する。

## 🎯 目的
全てのデバイスで使いやすく、美しいUIを実現する。

## 📦 依存チケット
- **TICKET-005**: レベル選択画面の実装（必須）
- **TICKET-006**: 問題画面の実装（必須）
- **TICKET-007**: 結果表示画面の実装（必須）
- **TICKET-008**: 印刷機能の実装（必須）
- **TICKET-009**: アニメーション・エフェクトの実装（必須）

## 📝 詳細要件

### 1. ブレークポイントの定義

Tailwind CSSのデフォルトブレークポイントを使用:
```
sm: 640px   (小型タブレット)
md: 768px   (タブレット)
lg: 1024px  (小型PC)
xl: 1280px  (PC)
2xl: 1536px (大型PC)
```

### 2. スマートフォン対応（320px〜767px）

#### レベル選択画面
```typescript
// LevelSelectScreen.tsx
<div className="container mx-auto px-4 py-6 sm:py-8">
  <header className="text-center mb-8 sm:mb-12">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black ...">
      九九マスター
    </h1>
    <p className="text-base sm:text-lg md:text-xl ...">
      レベルをえらんで、ちょうせんしよう！
    </p>
  </header>

  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
    {/* レベルカード */}
  </div>
</div>
```

#### 問題画面
```typescript
// QuestionScreen.tsx
<div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 max-w-4xl w-full mx-4 sm:mx-auto">
  <ProblemDisplay
    // ...
    size="medium" // スマホでは小さめに
  />

  <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4">
    <NumberInput
      // 入力欄のサイズ調整
      className="w-20 h-14 text-3xl sm:w-24 sm:h-16 sm:text-4xl"
    />
  </div>
</div>
```

#### 結果表示画面
```typescript
// ResultScreen.tsx
<div className="max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
    {/* タイムと正答率 */}
  </div>
</div>
```

### 3. タブレット対応（768px〜1023px）

#### レベル選択画面
- 2カラムレイアウト
- カード幅: 約50%
- フォントサイズ: 中サイズ

#### 問題画面
- 問題表示: 大きめ
- 余白: 適度に確保

### 4. PC対応（1024px〜）

#### レベル選択画面
- 2カラムレイアウト
- 最大幅: 1024px
- カード間の余白: 大きめ

#### 問題画面
- 問題表示: 最大サイズ
- 余白: 十分に確保

### 5. タッチ操作の最適化

#### ボタンサイズ
```typescript
// Button.tsx
const sizeClasses = {
  small: 'px-4 py-2 text-sm min-h-[40px]',   // 最小タッチ領域
  medium: 'px-6 py-3 text-base min-h-[44px]',
  large: 'px-8 py-4 text-lg min-h-[48px]',
};
```

#### レベルカード
```typescript
// LevelCard.tsx
<button
  className="w-full p-4 sm:p-6 min-h-[100px] sm:min-h-[120px] ..."
>
  {/* ... */}
</button>
```

### 6. フォントサイズの調整

#### 見出し
```css
/* 小学生が読みやすいサイズ */
h1: text-4xl sm:text-5xl md:text-6xl
h2: text-2xl sm:text-3xl md:text-4xl
h3: text-xl sm:text-2xl md:text-3xl
```

#### 本文
```css
p: text-base sm:text-lg
small: text-sm sm:text-base
```

#### 問題表示
```css
問題数字: text-5xl sm:text-6xl md:text-7xl
読み仮名: text-base sm:text-lg md:text-xl
```

### 7. 余白・間隔の調整

```css
/* コンテナ */
px-4 sm:px-6 md:px-8
py-6 sm:py-8 md:py-12

/* カード */
p-4 sm:p-6 md:p-8

/* 要素間 */
gap-3 sm:gap-4 md:gap-6
```

### 8. レスポンシブユーティリティの作成

#### `src/hooks/useMediaQuery.ts`
```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
```

使用例:
```typescript
const isMobile = useIsMobile();

<ProblemDisplay
  size={isMobile ? 'small' : 'large'}
/>
```

### 9. 横向き（ランドスケープ）対応

```css
/* 横向き時の調整 */
@media (max-height: 600px) and (orientation: landscape) {
  .問題画面 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .タイマー {
    font-size: 1.5rem;
  }
}
```

### 10. 印刷ページのレスポンシブ対応

#### `PrintPage.tsx`
```typescript
// プレビュー時のみレスポンシブ
<div className="print-page bg-white shadow-lg mb-6 w-full sm:w-[182mm] mx-auto">
  <div className="p-4 sm:p-8">
    {/* ... */}
  </div>
</div>
```

### 11. テストケース

#### スマートフォン
- [ ] iPhone SE (375x667)
- [ ] iPhone 12/13/14 (390x844)
- [ ] Android (360x640)

#### タブレット
- [ ] iPad Mini (768x1024)
- [ ] iPad Air (820x1180)

#### PC
- [ ] 1280x720
- [ ] 1920x1080

### 12. 確認項目チェックリスト

#### レイアウト
- [ ] 全ての画面が横スクロールなしで表示される
- [ ] テキストが読みやすいサイズである
- [ ] ボタンが押しやすいサイズである（最小44x44px）
- [ ] 余白が適切に確保されている

#### タッチ操作
- [ ] ボタンがタップしやすい
- [ ] 入力フィールドがタップしやすい
- [ ] スワイプやピンチ操作が不要

#### パフォーマンス
- [ ] アニメーションが滑らか
- [ ] 画像の読み込みが速い
- [ ] ページ遷移が速い

#### 表示
- [ ] フォントサイズが適切
- [ ] 色のコントラストが十分
- [ ] 画像が鮮明

## 🔍 実装手順

1. `useMediaQuery` フックを作成
2. 各画面にレスポンシブクラスを適用
3. スマートフォンでテスト（Chrome DevTools）
4. タブレットでテスト
5. PCでテスト
6. 実機でテスト（可能な場合）
7. 調整・修正

## ✅ 受け入れ基準

- [ ] 全ての画面がスマートフォンで正しく表示される
- [ ] 全ての画面がタブレットで正しく表示される
- [ ] 全ての画面がPCで正しく表示される
- [ ] ボタンが押しやすいサイズである
- [ ] テキストが読みやすいサイズである
- [ ] 横スクロールが発生しない
- [ ] タッチ操作が快適
- [ ] アニメーションが滑らか

## 🔧 技術的詳細

### モバイルファーストアプローチ
```css
/* まず小さい画面用のスタイルを書く */
.element {
  font-size: 1rem;
}

/* 大きい画面用を上書き */
@screen md {
  .element {
    font-size: 1.25rem;
  }
}
```

### Tailwindのレスポンシブクラス
```css
text-base     /* 全てのサイズ */
sm:text-lg    /* 640px以上 */
md:text-xl    /* 768px以上 */
lg:text-2xl   /* 1024px以上 */
```

## ⚠️ 注意事項

1. **タッチ領域**: 最小44x44px（Appleガイドライン）
2. **フォントサイズ**: 最小16px（Safariのズーム防止）
3. **ビューポート**: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
4. **テスト**: 必ず実機でテストする

## 📊 見積もり工数
**約6〜8時間**
- スマートフォン対応: 3時間
- タブレット対応: 2時間
- PC対応: 1時間
- テスト・調整: 2〜3時間

## 🔗 関連ドキュメント
- [Tailwind CSS - Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN - Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## 📎 次のチケットへの引き継ぎ事項
- レスポンシブ対応が完了
- Vercelデプロイに進む（TICKET-011）
