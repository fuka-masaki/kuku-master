# TICKET-002: 型定義とデータ構造の設計

## 📋 概要
アプリケーション全体で使用するTypeScriptの型定義を作成し、データ構造を設計する。

## 🎯 目的
型安全性を確保し、開発者が迷わないように明確なデータ構造を定義する。

## 📦 依存チケット
- **TICKET-001**: プロジェクトセットアップ（必須）

## 📝 詳細要件

### 1. 基本型定義の作成

#### `src/types/level.ts`
```typescript
/**
 * レベルの種類
 */
export type LevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * レベルの設定
 */
export interface LevelConfig {
  id: LevelId;
  title: string;                    // 例: "1～5のだん"
  description: string;               // 例: "じゅんばん・よみあり"
  totalQuestions: number;            // 2周分の問題数（例: 90問）
  questionsPerRound: number;         // 1周あたりの問題数（例: 45問）
  timePerQuestion: number;           // 1問あたりの目安時間（秒）
  totalTime: number;                 // 合計秒数（例: 270秒）
  targetTime: number;                // 目標タイム（秒）（例: 240秒 = 4分）
  hasReading: boolean;               // 読み仮名を表示するか
  isRandom: boolean;                 // ランダム出題か
  range: {                           // 出題範囲
    min: number;                     // 最小の段（例: 1）
    max: number;                     // 最大の段（例: 5）
  };
  isHoleQuestion: boolean;           // 穴あき問題か
}
```

#### `src/types/problem.ts`
```typescript
/**
 * 問題の出題形式
 */
export type QuestionType =
  | 'normal'                  // 2 × 4 = ?
  | 'missing_multiplicand'    // ? × 4 = 8
  | 'missing_multiplier';     // 2 × ? = 8

/**
 * 読み仮名
 */
export interface Reading {
  multiplicand: string;  // 被乗数の読み（例: "に"）
  multiplier: string;    // 乗数の読み（例: "し"）
  equals: string;        // 等号の読み（常に "が"）
  answer: string;        // 答えの読み（例: "はち"）
}

/**
 * 九九の問題データ
 */
export interface MultiplicationProblem {
  multiplicand: number;  // 被乗数（例: 2）
  multiplier: number;    // 乗数（例: 4）
  answer: number;        // 答え（例: 8）
  reading: Reading;      // 読み仮名
}

/**
 * 出題される問題のインスタンス
 * （同じ計算でも出題形式が異なる場合は別問題として扱う）
 */
export interface ProblemInstance {
  problem: MultiplicationProblem;
  questionType: QuestionType;
  index: number;         // 全問題中の順番（0始まり）
  roundNumber: 1 | 2;    // 何周目か
}
```

#### `src/types/attempt.ts`
```typescript
import { ProblemInstance } from './problem';

/**
 * ユーザーの解答記録
 */
export interface AttemptRecord {
  problemInstance: ProblemInstance;
  userAnswer: number;        // ユーザーの回答
  isCorrect: boolean;        // 正誤
  timestamp: number;         // 解答時刻（タイムスタンプ）
  timeSpent: number;         // この問題にかかった時間（秒）
}

/**
 * 間違えた問題の記録
 */
export interface WrongAnswerRecord {
  problem: MultiplicationProblem;
  questionType: QuestionType;
  wrongCount: 1 | 2;         // 間違えた回数（1回 or 2回）
  attempts: AttemptRecord[]; // 実際の解答記録
}
```

#### `src/types/result.ts`
```typescript
import { LevelId } from './level';
import { AttemptRecord, WrongAnswerRecord } from './attempt';

/**
 * レベルクリア結果
 */
export interface LevelResult {
  levelId: LevelId;
  totalQuestions: number;        // 総問題数
  correctAnswers: number;        // 正解数
  wrongAnswers: number;          // 不正解数
  accuracy: number;              // 正答率（0-100）
  totalTimeSpent: number;        // 実際にかかった時間（秒）
  targetTime: number;            // 目標タイム（秒）
  isPassed: boolean;             // 合格したか
  wrongAnswerRecords: WrongAnswerRecord[]; // 間違えた問題
  allAttempts: AttemptRecord[];  // 全ての解答記録
  date: string;                  // 実施日（ISO 8601形式）
}
```

#### `src/types/print.ts`
```typescript
import { QuestionType, MultiplicationProblem } from './problem';

/**
 * 印刷用の問題データ
 */
export interface PrintableQuestion {
  number: number;                      // 問題番号（1始まり）
  problem: MultiplicationProblem;      // 元の問題データ
  questionType: QuestionType;          // 出題形式
  isDoubleWrong: boolean;              // 2回間違えたか
  displayText: string;                 // 表示用テキスト（例: "2 × 4 = "）
  answerValue: number;                 // 答えの値
  missingPart: 'answer' | 'multiplicand' | 'multiplier'; // 何が空白か
}

/**
 * 印刷データ
 */
export interface PrintData {
  levelId: LevelId;
  levelTitle: string;
  date: string;                        // 日付（例: "2025年11月16日"）
  accuracy: number;                    // 正答率（例: 92）
  timeSpent: string;                   // かかった時間（例: "4分45秒"）
  targetTime: string;                  // 目標タイム（例: "4分30秒"）
  questions: PrintableQuestion[];      // 印刷する問題リスト
  totalPages: number;                  // 総ページ数
}
```

### 2. ユーティリティ型の作成

#### `src/types/utils.ts`
```typescript
/**
 * 一意のキーを生成するための型
 */
export type ProblemKey = string; // 例: "2_4_normal"

/**
 * タイマーの状態
 */
export type TimerState = 'idle' | 'running' | 'paused' | 'finished';

/**
 * 画面の種類
 */
export type ScreenType = 'level-select' | 'question' | 'result' | 'print';
```

### 3. 定数型の作成

#### `src/types/constants.ts`
```typescript
/**
 * アニメーション種類
 */
export type AnimationType =
  | 'correct'      // 正解時
  | 'incorrect'    // 不正解時
  | 'levelClear'   // レベルクリア時
  | 'timeUp';      // タイムアップ時
```

### 4. 型ガード関数の作成

#### `src/types/guards.ts`
```typescript
import { QuestionType, LevelId } from './';

/**
 * LevelIdの型ガード
 */
export function isValidLevelId(value: unknown): value is LevelId {
  return typeof value === 'number' && value >= 1 && value <= 7;
}

/**
 * QuestionTypeの型ガード
 */
export function isValidQuestionType(value: unknown): value is QuestionType {
  return (
    value === 'normal' ||
    value === 'missing_multiplicand' ||
    value === 'missing_multiplier'
  );
}
```

### 5. インデックスファイルの作成

#### `src/types/index.ts`
```typescript
// Level
export type { LevelId, LevelConfig } from './level';

// Problem
export type {
  QuestionType,
  Reading,
  MultiplicationProblem,
  ProblemInstance,
} from './problem';

// Attempt
export type { AttemptRecord, WrongAnswerRecord } from './attempt';

// Result
export type { LevelResult } from './result';

// Print
export type { PrintableQuestion, PrintData } from './print';

// Utils
export type { ProblemKey, TimerState, ScreenType } from './utils';

// Constants
export type { AnimationType } from './constants';

// Guards
export { isValidLevelId, isValidQuestionType } from './guards';
```

## 🔍 実装手順

1. `src/types/` ディレクトリに各ファイルを作成
2. 各型定義を上記の通り実装
3. `index.ts` でエクスポート
4. TypeScriptのコンパイルエラーがないことを確認

## ✅ 受け入れ基準

- [ ] 全ての型定義ファイルが作成されている
- [ ] TypeScriptのコンパイルエラーがない
- [ ] 各型に適切なJSDocコメントが記載されている
- [ ] `src/types/index.ts` で全ての型がエクスポートされている
- [ ] 型ガード関数が正しく動作する
- [ ] インポート時に型が正しく認識される

## 🔧 技術的詳細

### 型の命名規則
- **Interface**: PascalCase（例: `MultiplicationProblem`）
- **Type Alias**: PascalCase（例: `QuestionType`）
- **変数・関数**: camelCase（例: `isValidLevelId`）

### 型の設計方針
1. **明確性**: 型名から用途が分かるようにする
2. **再利用性**: 共通の型は抽出する
3. **拡張性**: 将来的な機能追加を考慮
4. **型安全性**: `any` は使わない

### JSDocの記述方法
```typescript
/**
 * 九九の問題データ
 *
 * @example
 * const problem: MultiplicationProblem = {
 *   multiplicand: 2,
 *   multiplier: 4,
 *   answer: 8,
 *   reading: { multiplicand: "に", multiplier: "し", equals: "が", answer: "はち" }
 * };
 */
export interface MultiplicationProblem {
  // ...
}
```

## ⚠️ 注意事項

1. **型の変更**: この型定義は他の全チケットで使用されるため、慎重に設計する
2. **互換性**: 一度決めた型は極力変更しない
3. **ドキュメント**: 各型の用途を明確にコメントする
4. **エクスポート**: 必ず `index.ts` 経由でエクスポートする

## 📊 見積もり工数
**約2〜3時間**

## 🔗 関連ドキュメント
- [TypeScript Handbook - Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Deep Dive - Type Guards](https://basarat.gitbook.io/typescript/type-system/typeguard)

## 📎 次のチケットへの引き継ぎ事項
- この型定義を使って、TICKET-003で九九のマスターデータを作成する
- 各画面コンポーネントでこの型を使用する
