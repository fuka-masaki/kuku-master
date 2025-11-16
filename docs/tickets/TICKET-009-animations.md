# TICKET-009: アニメーション・エフェクトの実装

## 📋 概要
正解時、不正解時、レベルクリア時などのアニメーションとビジュアルエフェクトを実装する。

## 🎯 目的
小学生が楽しく学習できるよう、視覚的なフィードバックを提供する。

## 📦 依存チケット
- **TICKET-001**: プロジェクトセットアップ（必須）
- **TICKET-004**: 共通コンポーネントの実装（必須）
- **TICKET-005**: レベル選択画面の実装（必須）
- **TICKET-006**: 問題画面の実装（必須）
- **TICKET-007**: 結果表示画面の実装（必須）

## 📝 詳細要件

### 1. アニメーションコンポーネント

#### `src/components/features/FeedbackAnimation.tsx`
```typescript
import React, { useEffect, useState } from 'react';
import { AnimationType } from '@/types';

interface FeedbackAnimationProps {
  type: AnimationType;
  onComplete?: () => void;
  duration?: number;
}

export const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  type,
  onComplete,
  duration = 1000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  const animations = {
    correct: {
      emoji: '⭐',
      text: 'せいかい！',
      bgColor: 'from-green-400 to-blue-500',
      textColor: 'text-white',
    },
    incorrect: {
      emoji: '💪',
      text: 'もう一度！',
      bgColor: 'from-orange-400 to-red-500',
      textColor: 'text-white',
    },
    levelClear: {
      emoji: '🎉',
      text: 'レベルクリア！',
      bgColor: 'from-purple-400 to-pink-500',
      textColor: 'text-white',
    },
    timeUp: {
      emoji: '⏰',
      text: 'タイムアップ！',
      bgColor: 'from-yellow-400 to-orange-500',
      textColor: 'text-white',
    },
  };

  const animation = animations[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={`
          animate-bounce-in
          bg-gradient-to-br ${animation.bgColor}
          rounded-3xl shadow-2xl p-12
          transform transition-all duration-500
        `}
      >
        <div className="text-center">
          <div className="text-8xl mb-4 animate-scale-in">{animation.emoji}</div>
          <div className={`text-4xl font-black ${animation.textColor}`}>
            {animation.text}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 2. カスタムアニメーション定義

#### `tailwind.config.js` の拡張
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'bounce-in': 'bounceIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        bounceIn: {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.05)',
          },
          '70%': {
            transform: 'scale(0.9)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        slideUp: {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        shake: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '10%, 30%, 50%, 70%, 90%': {
            transform: 'translateX(-10px)',
          },
          '20%, 40%, 60%, 80%': {
            transform: 'translateX(10px)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
      },
    },
  },
  plugins: [],
};
```

### 3. 問題画面へのアニメーション統合

#### `QuestionScreen.tsx` の更新
```typescript
// ... 既存のインポート
import { FeedbackAnimation } from '@/components/features/FeedbackAnimation';
import { AnimationType } from '@/types';

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  // ... props
}) => {
  // ... 既存の状態
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<AnimationType | null>(null);

  const handleSubmit = useCallback(() => {
    // ... 既存の処理

    if (isCorrect) {
      // 正解アニメーション
      setAnimationType('correct');
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        moveToNextQuestion();
      }, 800);
    } else {
      // 不正解アニメーション
      setAnimationType('incorrect');
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
      }, 800);

      // 正解を表示
      setCorrectAnswer(answer);
      setShowCorrectAnswer(true);
    }
  }, [/* ... */]);

  return (
    <div className="min-h-screen ...">
      {/* 既存のコンテンツ */}

      {/* アニメーション */}
      {showAnimation && animationType && (
        <FeedbackAnimation type={animationType} />
      )}
    </div>
  );
};
```

### 4. ボタンホバーエフェクトの強化

#### `Button.tsx` の更新
```typescript
export const Button: React.FC<ButtonProps> = ({
  // ... props
}) => {
  const baseClasses = `
    font-bold rounded-lg
    transition-all duration-200
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:scale-105
    transform
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-500 to-purple-500
      text-white
      hover:from-blue-600 hover:to-purple-600
      shadow-lg hover:shadow-xl
      hover:shadow-purple-500/50
    `,
    // ...
  };

  // ...
};
```

### 5. カード表示アニメーション

#### `LevelCard.tsx` の更新
```typescript
export const LevelCard: React.FC<LevelCardProps> = ({ config, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        w-full p-6
        bg-white rounded-xl shadow-md
        transition-all duration-300
        hover:shadow-xl hover:scale-105
        active:scale-95
        border-2 border-transparent
        hover:border-purple-400
        ${isHovered ? 'animate-float' : ''}
      `}
    >
      {/* ... */}
    </button>
  );
};
```

### 6. ページ遷移アニメーション

#### `src/hooks/usePageTransition.ts`
```typescript
import { useState, useEffect } from 'react';

export function usePageTransition(delay = 100) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
}
```

使用例:
```typescript
export const SomeScreen: React.FC = () => {
  const isVisible = usePageTransition();

  return (
    <div
      className={`
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* ... */}
    </div>
  );
};
```

### 7. タイマーの視覚的エフェクト

#### `Timer.tsx` の更新
```typescript
export const Timer: React.FC<TimerProps> = ({
  remainingSeconds,
  totalSeconds,
  isOvertime = false,
}) => {
  const percentage = Math.max(0, (remainingSeconds / totalSeconds) * 100);

  const getColorClass = () => {
    if (isOvertime) return 'text-red-600 font-bold animate-pulse';
    if (percentage <= 20) return 'text-red-500 animate-shake';
    if (percentage <= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-3xl md:text-4xl font-bold transition-all ${getColorClass()}`}>
        {isOvertime && '+'}{formatTime(Math.abs(remainingSeconds))}
      </div>

      {/* プログレスバー */}
      <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`
            h-full transition-all duration-1000
            ${isOvertime ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-green-400 to-blue-500'}
          `}
          style={{ width: `${isOvertime ? 100 : percentage}%` }}
        />
      </div>

      <div className="text-sm text-gray-600">
        目標タイム: {formatTime(totalSeconds)}
      </div>
    </div>
  );
};
```

### 8. 入力フィールドのフォーカスエフェクト

#### `NumberInput.tsx` の更新
```typescript
export const NumberInput: React.FC<NumberInputProps> = ({
  // ... props
}) => {
  return (
    <input
      // ... attributes
      className={`
        w-24 h-16 text-4xl font-bold text-center
        border-4 border-blue-500 rounded-lg
        focus:outline-none
        focus:ring-4 focus:ring-blue-300
        focus:border-blue-600
        focus:scale-110
        transition-all duration-200
        disabled:bg-gray-100
        animate-fade-in
      `}
    />
  );
};
```

## 🔍 実装手順

1. `tailwind.config.js` にカスタムアニメーションを追加
2. `FeedbackAnimation` コンポーネントを作成
3. `usePageTransition` フックを作成
4. 各コンポーネントにアニメーションを適用
5. 正解/不正解時のアニメーションをテスト
6. タイマーのアニメーションをテスト
7. ページ遷移のアニメーションを確認

## ✅ 受け入れ基準

- [ ] 正解時に「せいかい！」アニメーションが表示される
- [ ] 不正解時に「もう一度！」アニメーションが表示される
- [ ] ボタンにホバー/アクティブエフェクトがある
- [ ] レベルカードにホバーエフェクトがある
- [ ] タイマーが残り時間に応じて色が変わる
- [ ] タイムアップ時に点滅する
- [ ] 入力フィールドにフォーカスエフェクトがある
- [ ] ページ遷移時にフェードインする
- [ ] アニメーションが過度でなく、学習の妨げにならない

## 🔧 技術的詳細

### Tailwind CSSアニメーション
- `animate-bounce-in`: バウンドしながら登場
- `animate-pulse`: 点滅
- `animate-shake`: 振動
- `animate-float`: 浮遊

### パフォーマンス
- CSSアニメーションを使用（JavaScriptより高速）
- `transform` と `opacity` のみを使用（GPUアクセラレーション）
- `will-change` は使用しない（パフォーマンス悪化の可能性）

## ⚠️ 注意事項

1. **アニメーション時間**: 短すぎず、長すぎず（0.3〜1秒）
2. **視覚的疲労**: 過度なアニメーションは避ける
3. **アクセシビリティ**: `prefers-reduced-motion` への対応（オプション）
4. **パフォーマンス**: 低スペック端末でも滑らか

## 📊 見積もり工数
**約4〜5時間**

## 🔗 関連ドキュメント
- [Tailwind CSS - Animation](https://tailwindcss.com/docs/animation)
- [MDN - CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

## 📎 次のチケットへの引き継ぎ事項
- アニメーションが完成
- レスポンシブデザインの最終調整に進む（TICKET-010）
