# TICKET-007: 結果表示画面の実装

## 📋 概要
問題画面での解答結果を集計し、合格/不合格の判定、間違えた問題の一覧表示を行う画面を実装する。

## 🎯 目的
ユーザーの学習成果をフィードバックし、間違えた問題を確認できるようにする。

## 📦 依存チケット
- **TICKET-001**: プロジェクトセットアップ（必須）
- **TICKET-002**: 型定義とデータ構造の設計（必須）
- **TICKET-004**: 共通コンポーネントの実装（必須）
- **TICKET-006**: 問題画面の実装（必須）

## 📝 詳細要件

### 1. 結果集計ユーティリティ

#### `src/utils/resultAnalyzer.ts`
```typescript
import {
  AttemptRecord,
  WrongAnswerRecord,
  LevelResult,
  LevelConfig,
} from '@/types';
import { generateProblemKey } from './problemGenerator';

/**
 * 間違えた問題を集計
 * 重複の定義: 被乗数、乗数、問題形式の3つが全て一致
 */
export function analyzeWrongAnswers(
  attempts: AttemptRecord[]
): WrongAnswerRecord[] {
  const wrongMap = new Map<string, WrongAnswerRecord>();

  attempts.forEach((attempt) => {
    if (!attempt.isCorrect) {
      const { problemInstance } = attempt;
      const key = generateProblemKey(
        problemInstance.problem.multiplicand,
        problemInstance.problem.multiplier,
        problemInstance.questionType
      );

      if (wrongMap.has(key)) {
        const existing = wrongMap.get(key)!;
        existing.wrongCount = Math.min(existing.wrongCount + 1, 2) as 1 | 2;
        existing.attempts.push(attempt);
      } else {
        wrongMap.set(key, {
          problem: problemInstance.problem,
          questionType: problemInstance.questionType,
          wrongCount: 1,
          attempts: [attempt],
        });
      }
    }
  });

  return Array.from(wrongMap.values());
}

/**
 * レベル結果を生成
 */
export function createLevelResult(
  levelConfig: LevelConfig,
  attempts: AttemptRecord[],
  totalTimeSpent: number
): LevelResult {
  const totalQuestions = attempts.length;
  const correctAnswers = attempts.filter((a) => a.isCorrect).length;
  const wrongAnswers = totalQuestions - correctAnswers;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const wrongAnswerRecords = analyzeWrongAnswers(attempts);

  const isPassed =
    wrongAnswers === 0 && totalTimeSpent <= levelConfig.targetTime;

  return {
    levelId: levelConfig.id,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    accuracy,
    totalTimeSpent,
    targetTime: levelConfig.targetTime,
    isPassed,
    wrongAnswerRecords,
    allAttempts: attempts,
    date: new Date().toISOString(),
  };
}
```

### 2. 結果表示画面コンポーネント

#### `src/components/screens/ResultScreen.tsx`
```typescript
import React from 'react';
import { LevelResult, LevelConfig } from '@/types';
import { Button } from '@/components/common';
import { formatTimeJapanese } from '@/utils/timeUtils';
import { WrongAnswerList } from '@/components/features/WrongAnswerList';

interface ResultScreenProps {
  levelConfig: LevelConfig;
  result: LevelResult;
  onBackToLevelSelect: () => void;
  onPrint: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  levelConfig,
  result,
  onBackToLevelSelect,
  onPrint,
}) => {
  const {
    accuracy,
    totalTimeSpent,
    targetTime,
    isPassed,
    wrongAnswerRecords,
  } = result;

  const hasWrongAnswers = wrongAnswerRecords.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2">
            結果発表
          </h1>
          <p className="text-lg text-gray-600">
            レベル{levelConfig.id}: {levelConfig.title}
          </p>
        </header>

        {/* 結果カード */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* タイムと正答率 */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">タイム</div>
              <div
                className={`text-3xl font-bold ${
                  totalTimeSpent <= targetTime
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}
              >
                {formatTimeJapanese(totalTimeSpent)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                目標: {formatTimeJapanese(targetTime)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">正答率</div>
              <div
                className={`text-3xl font-bold ${
                  accuracy === 100 ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {accuracy}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {result.correctAnswers}/{result.totalQuestions}問正解
              </div>
            </div>
          </div>

          {/* 合格/不合格メッセージ */}
          {isPassed ? (
            <div className="text-center py-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                レベル{levelConfig.id} 合格！
              </h2>
              <p className="text-lg text-gray-700">
                {levelConfig.id < 7
                  ? `次のレベル${levelConfig.id + 1}へすすみましょう！`
                  : 'すべてのレベルをクリアしました！'}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
              <div className="text-6xl mb-4">💪</div>
              <h2 className="text-2xl font-bold text-orange-600 mb-2">
                もう少し！
              </h2>
              <p className="text-gray-700">
                {hasWrongAnswers
                  ? '間違えた問題を復習してもう一度チャレンジしよう！'
                  : 'タイムを縮めてもう一度チャレンジしよう！'}
              </p>
            </div>
          )}
        </div>

        {/* 間違えた問題一覧 */}
        {hasWrongAnswers && (
          <div className="max-w-4xl mx-auto mb-8">
            <WrongAnswerList wrongAnswers={wrongAnswerRecords} />
          </div>
        )}

        {/* ボタン */}
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={onBackToLevelSelect}
          >
            レベル選択に戻る
          </Button>

          {hasWrongAnswers && (
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={onPrint}
            >
              印刷する
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
```

### 3. 間違えた問題リストコンポーネント

#### `src/components/features/WrongAnswerList.tsx`
```typescript
import React from 'react';
import { WrongAnswerRecord } from '@/types';

interface WrongAnswerListProps {
  wrongAnswers: WrongAnswerRecord[];
}

export const WrongAnswerList: React.FC<WrongAnswerListProps> = ({
  wrongAnswers,
}) => {
  const formatProblem = (record: WrongAnswerRecord): string => {
    const { problem, questionType } = record;

    switch (questionType) {
      case 'normal':
        return `${problem.multiplicand} × ${problem.multiplier} = ${problem.answer}`;
      case 'missing_multiplicand':
        return `? × ${problem.multiplier} = ${problem.answer}`;
      case 'missing_multiplier':
        return `${problem.multiplicand} × ? = ${problem.answer}`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">💡</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            この九九をおぼえてね！
          </h2>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {wrongAnswers.map((record, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${
              record.wrongCount === 2
                ? 'border-red-400 bg-red-50'
                : 'border-orange-300 bg-orange-50'
            }`}
          >
            <div className="flex items-center gap-2">
              {record.wrongCount === 2 && (
                <span className="text-xl">⭐</span>
              )}
              <span className="text-xl font-bold text-gray-800">
                {formatProblem(record)}
              </span>
            </div>
            {record.wrongCount === 2 && (
              <div className="text-xs text-red-600 mt-1">
                2回間違えました
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-600 text-center">
        ⭐は2回間違えた問題です
      </div>
    </div>
  );
};
```

## 🔍 実装手順

1. `src/utils/resultAnalyzer.ts` を作成
2. `src/components/features/WrongAnswerList.tsx` を作成
3. `src/components/screens/ResultScreen.tsx` を作成
4. `App.tsx` で問題画面から結果画面への遷移を実装
5. 結果の集計が正しいことを確認
6. 間違えた問題の重複判定が正しいことを確認

## ✅ 受け入れ基準

- [ ] タイムと正答率が正しく表示される
- [ ] 全問正解かつ目標タイム内なら「合格」表示
- [ ] それ以外なら「もう少し」表示
- [ ] 間違えた問題が一覧表示される
- [ ] 2回間違えた問題に⭐マークが付く
- [ ] 同じ計算でも問題形式が違えば別問題として表示される
- [ ] 「レベル選択に戻る」ボタンが動作する
- [ ] 間違いがある場合「印刷する」ボタンが表示される
- [ ] レスポンシブデザインが適用されている

## 🔧 技術的詳細

### 重複判定ロジック
```typescript
// キー: "2_4_normal", "2_4_missing_multiplier" など
const key = `${multiplicand}_${multiplier}_${questionType}`;
```

### 日付フォーマット
```typescript
new Date().toLocaleDateString('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
// 例: 2025年11月16日
```

## ⚠️ 注意事項

1. **重複判定**: 問題形式が違えば別問題
2. **2回間違いの判定**: 同じ問題を2回間違えた場合のみ
3. **合格条件**: 全問正解 AND 目標タイム内
4. **日付**: 実施日を記録

## 📊 見積もり工数
**約4〜5時間**

## 🔗 関連ドキュメント
- [JavaScript Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

## 📎 次のチケットへの引き継ぎ事項
- 間違えた問題のデータを印刷機能に渡す（TICKET-008）
- `WrongAnswerRecord[]` を印刷用にフォーマットする
