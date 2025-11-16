# TICKET-004: 共通コンポーネントの実装

## 📋 概要
アプリケーション全体で使用する共通コンポーネント（ボタン、タイマー表示、入力フィールドなど）を実装する。

## 🎯 目的
再利用可能なコンポーネントを作成し、一貫性のあるUIを実現する。

## 📦 依存チケット
- **TICKET-001**: プロジェクトセットアップ（必須）
- **TICKET-002**: 型定義とデータ構造の設計（必須）

## 📝 詳細要件

### 1. ボタンコンポーネント

#### `src/components/common/Button.tsx`
```typescript
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  const baseClasses = 'font-bold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};
```

### 2. タイマー表示コンポーネント

#### `src/components/common/Timer.tsx`
```typescript
import React from 'react';
import { formatTime } from '@/utils/timeUtils';

interface TimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  isOvertime?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  remainingSeconds,
  totalSeconds,
  isOvertime = false,
}) => {
  const percentage = Math.max(0, (remainingSeconds / totalSeconds) * 100);

  // 残り時間が少なくなったら色を変える
  const getColorClass = () => {
    if (isOvertime) return 'text-red-600 font-bold animate-pulse';
    if (percentage <= 20) return 'text-red-500';
    if (percentage <= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-3xl md:text-4xl font-bold ${getColorClass()}`}>
        {isOvertime && '+'}{formatTime(Math.abs(remainingSeconds))}
      </div>
      <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isOvertime ? 'bg-red-500' : 'bg-gradient-to-r from-green-400 to-blue-500'
          }`}
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

### 3. 数字入力コンポーネント

#### `src/components/common/NumberInput.tsx`
```typescript
import React, { useRef, useEffect } from 'react';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  autoFocus = true,
  maxLength = 2,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(newValue);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      maxLength={maxLength}
      className="w-24 h-16 text-4xl font-bold text-center border-4 border-blue-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-100"
    />
  );
};
```

### 4. 問題表示コンポーネント（読み仮名付き）

#### `src/components/common/ProblemDisplay.tsx`
```typescript
import React from 'react';
import { QuestionType, Reading } from '@/types';

interface ProblemDisplayProps {
  multiplicand: number | '?';
  multiplier: number | '?';
  answer?: number;
  reading?: Reading;
  showReading?: boolean;
  questionType: QuestionType;
  size?: 'small' | 'medium' | 'large';
}

export const ProblemDisplay: React.FC<ProblemDisplayProps> = ({
  multiplicand,
  multiplier,
  answer,
  reading,
  showReading = false,
  questionType,
  size = 'large',
}) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
  };

  const readingSize = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl',
  };

  const NumberWithReading: React.FC<{
    value: number | '?';
    readingText?: string
  }> = ({ value, readingText }) => (
    <div className="flex flex-col items-center">
      {showReading && readingText && (
        <span className={`${readingSize[size]} text-gray-600 mb-1`}>
          {readingText}
        </span>
      )}
      <span className={`${sizeClasses[size]} font-bold`}>{value}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6">
      <NumberWithReading
        value={multiplicand}
        readingText={reading?.multiplicand}
      />
      <span className={`${sizeClasses[size]} font-bold text-gray-700`}>×</span>
      <NumberWithReading
        value={multiplier}
        readingText={reading?.multiplier}
      />
      <div className="flex flex-col items-center">
        {showReading && reading && (
          <span className={`${readingSize[size]} text-gray-600 mb-1`}>
            {reading.equals}
          </span>
        )}
        <span className={`${sizeClasses[size]} font-bold text-gray-700`}>=</span>
      </div>
      {answer !== undefined && (
        <NumberWithReading
          value={answer}
          readingText={reading?.answer}
        />
      )}
    </div>
  );
};
```

### 5. レベルカードコンポーネント

#### `src/components/common/LevelCard.tsx`
```typescript
import React from 'react';
import { LevelConfig } from '@/types';
import { formatTime } from '@/utils/timeUtils';

interface LevelCardProps {
  config: LevelConfig;
  onClick: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({ config, onClick }) => {
  const { id, title, description, totalQuestions, targetTime } = config;

  return (
    <button
      onClick={onClick}
      className="w-full p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-transparent hover:border-purple-400"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {id}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
        <span>問題数: {totalQuestions}問</span>
        <span>目標: {formatTime(targetTime)}</span>
      </div>
    </button>
  );
};
```

### 6. ユーティリティ関数

#### `src/utils/timeUtils.ts`
```typescript
/**
 * 秒数を「分:秒」形式にフォーマット
 * @param seconds 秒数
 * @returns フォーマットされた文字列（例: "3:45"）
 */
export function formatTime(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 秒数を「○分○秒」形式にフォーマット（日本語）
 * @param seconds 秒数
 * @returns フォーマットされた文字列（例: "3分45秒"）
 */
export function formatTimeJapanese(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;

  if (mins === 0) {
    return `${secs}秒`;
  }
  if (secs === 0) {
    return `${mins}分`;
  }
  return `${mins}分${secs}秒`;
}
```

### 7. インデックスファイル

#### `src/components/common/index.ts`
```typescript
export { Button } from './Button';
export { Timer } from './Timer';
export { NumberInput } from './NumberInput';
export { ProblemDisplay } from './ProblemDisplay';
export { LevelCard } from './LevelCard';
```

## 🔍 実装手順

1. `src/utils/timeUtils.ts` を作成
2. `src/components/common/` に各コンポーネントを作成
3. 各コンポーネントをStorybookまたは簡単なテストページで確認
4. `index.ts` でエクスポート
5. TypeScriptのエラーがないことを確認

## ✅ 受け入れ基準

- [ ] 全てのコンポーネントが作成されている
- [ ] TypeScriptのコンパイルエラーがない
- [ ] 各コンポーネントが正しく表示される
- [ ] ボタンのホバー/アクティブ状態が動作する
- [ ] タイマーが正しく時間を表示する
- [ ] 数字入力でEnterキーが動作する
- [ ] 問題表示で読み仮名が正しく表示される
- [ ] レスポンシブデザインが適用されている

## 🔧 技術的詳細

### Tailwind CSSのカスタマイズ
- グラデーション: `bg-gradient-to-r from-blue-500 to-purple-500`
- アニメーション: `transition-all duration-200`
- レスポンシブ: `md:text-4xl`（中画面以上）

### アクセシビリティ
- フォーカス状態を明確に表示
- キーボード操作のサポート
- 適切なARIAラベル（必要に応じて）

### パフォーマンス
- 不要な再レンダリングを防ぐため `React.memo` を使用（必要に応じて）
- `useCallback` でイベントハンドラをメモ化

## ⚠️ 注意事項

1. **タッチ対応**: モバイルデバイスでの操作を考慮
2. **フォントサイズ**: 小学生が読みやすい大きさ
3. **色の選択**: 視認性の高い配色
4. **アニメーション**: 過度にならないように
5. **入力制限**: 数字のみ入力可能にする

## 📊 見積もり工数
**約4〜5時間**

## 🔗 関連ドキュメント
- [React公式ドキュメント](https://react.dev/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/)

## 📎 次のチケットへの引き継ぎ事項
- これらのコンポーネントを各画面で使用する
- 必要に応じてコンポーネントを拡張する
