# TICKET-006: 問題画面の実装

## 📋 概要
選択されたレベルに応じて問題を出題し、ユーザーの解答を受け付け、判定する画面を実装する。

## 🎯 目的
九九の学習の核となる問題出題・解答機能を実装する。

## 📦 依存チケット
- **TICKET-001**: プロジェクトセットアップ（必須）
- **TICKET-002**: 型定義とデータ構造の設計（必須）
- **TICKET-003**: 九九マスターデータの作成（必須）
- **TICKET-004**: 共通コンポーネントの実装（必須）

## 📝 詳細要件

### 1. 問題生成ロジック

#### `src/utils/problemGenerator.ts`
```typescript
import {
  MultiplicationProblem,
  ProblemInstance,
  QuestionType,
  LevelConfig,
} from '@/types';
import { getProblemsByRange, getMultiplicationProblems } from '@/data/dataLoader';

/**
 * シャッフル関数
 */
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * ランダムな問題形式を取得（穴あきチャレンジ用）
 */
function getRandomQuestionType(): QuestionType {
  const types: QuestionType[] = ['normal', 'missing_multiplicand', 'missing_multiplier'];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * レベル設定に基づいて問題を生成
 */
export function generateProblems(config: LevelConfig): ProblemInstance[] {
  // 範囲内の問題を取得
  const baseProblems = config.range.min === 1 && config.range.max === 9
    ? getMultiplicationProblems()
    : getProblemsByRange(config.range.min, config.range.max);

  // 2周分の問題を生成
  const round1 = config.isRandom ? shuffle(baseProblems) : baseProblems;
  const round2 = config.isRandom ? shuffle(baseProblems) : baseProblems;

  const allProblems: ProblemInstance[] = [];

  // 1周目
  round1.forEach((problem, index) => {
    allProblems.push({
      problem,
      questionType: config.isHoleQuestion ? getRandomQuestionType() : 'normal',
      index: allProblems.length,
      roundNumber: 1,
    });
  });

  // 2周目
  round2.forEach((problem, index) => {
    allProblems.push({
      problem,
      questionType: config.isHoleQuestion ? getRandomQuestionType() : 'normal',
      index: allProblems.length,
      roundNumber: 2,
    });
  });

  return allProblems;
}

/**
 * 問題インスタンスから正解を取得
 */
export function getCorrectAnswer(instance: ProblemInstance): number {
  const { problem, questionType } = instance;

  switch (questionType) {
    case 'normal':
      return problem.answer;
    case 'missing_multiplicand':
      return problem.multiplicand;
    case 'missing_multiplier':
      return problem.multiplier;
  }
}

/**
 * 問題の一意のキーを生成
 */
export function generateProblemKey(
  multiplicand: number,
  multiplier: number,
  questionType: QuestionType
): string {
  return `${multiplicand}_${multiplier}_${questionType}`;
}
```

### 2. タイマーフック

#### `src/hooks/useTimer.ts`
```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  targetTime: number; // 目標タイム（秒）
  onTimeUp?: () => void;
}

export function useTimer({ targetTime, onTimeUp }: UseTimerOptions) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setElapsedSeconds(0);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const remainingSeconds = targetTime - elapsedSeconds;
  const isOvertime = remainingSeconds < 0;

  useEffect(() => {
    if (isOvertime && onTimeUp && remainingSeconds === 0) {
      onTimeUp();
    }
  }, [isOvertime, remainingSeconds, onTimeUp]);

  return {
    elapsedSeconds,
    remainingSeconds,
    isOvertime,
    isRunning,
    start,
    pause,
    reset,
  };
}
```

### 3. 問題画面コンポーネント

#### `src/components/screens/QuestionScreen.tsx`
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { LevelConfig, ProblemInstance, AttemptRecord } from '@/types';
import {
  Button,
  Timer,
  NumberInput,
  ProblemDisplay,
} from '@/components/common';
import { generateProblems, getCorrectAnswer } from '@/utils/problemGenerator';
import { useTimer } from '@/hooks/useTimer';

interface QuestionScreenProps {
  levelConfig: LevelConfig;
  onComplete: (attempts: AttemptRecord[]) => void;
  onQuit: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  levelConfig,
  onComplete,
  onQuit,
}) => {
  const [problems] = useState<ProblemInstance[]>(() =>
    generateProblems(levelConfig)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const timer = useTimer({
    targetTime: levelConfig.targetTime,
  });

  const currentProblem = problems[currentIndex];

  // タイマー開始
  useEffect(() => {
    timer.start();
  }, []);

  // 問題が変わったら開始時刻を記録
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  const handleSubmit = useCallback(() => {
    if (!currentProblem) return;

    const answer = getCorrectAnswer(currentProblem);
    const userAnswer = parseInt(userInput, 10);
    const isCorrect = !isNaN(userAnswer) && userAnswer === answer;
    const timeSpent = (Date.now() - questionStartTime) / 1000;

    // 解答記録を保存
    const attempt: AttemptRecord = {
      problemInstance: currentProblem,
      userAnswer: isNaN(userAnswer) ? -1 : userAnswer,
      isCorrect,
      timestamp: Date.now(),
      timeSpent,
    };

    setAttempts((prev) => [...prev, attempt]);

    if (isCorrect) {
      // 正解：次の問題へ
      moveToNextQuestion();
    } else {
      // 不正解：正解を表示
      setCorrectAnswer(answer);
      setShowCorrectAnswer(true);

      // 2秒後に次の問題へ（Enterで進める場合はこの処理を変更）
      // ここでは、ユーザーがEnterを押すまで待つ仕様
    }
  }, [currentProblem, userInput, questionStartTime]);

  const moveToNextQuestion = useCallback(() => {
    setShowCorrectAnswer(false);
    setCorrectAnswer(null);
    setUserInput('');

    if (currentIndex < problems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // 全問題終了
      timer.pause();
      onComplete(attempts);
    }
  }, [currentIndex, problems.length, attempts, onComplete, timer]);

  const handleInputChange = (value: string) => {
    if (!showCorrectAnswer) {
      setUserInput(value);
    }
  };

  const handleKeySubmit = () => {
    if (showCorrectAnswer) {
      // 不正解後のEnter：次の問題へ
      moveToNextQuestion();
    } else {
      // 通常のEnter：解答送信
      handleSubmit();
    }
  };

  if (!currentProblem) {
    return null;
  }

  // 問題表示用の値を決定
  const getDisplayValues = () => {
    const { problem, questionType } = currentProblem;

    switch (questionType) {
      case 'normal':
        return {
          multiplicand: problem.multiplicand,
          multiplier: problem.multiplier,
          answer: undefined,
        };
      case 'missing_multiplicand':
        return {
          multiplicand: '?' as const,
          multiplier: problem.multiplier,
          answer: problem.answer,
        };
      case 'missing_multiplier':
        return {
          multiplicand: problem.multiplicand,
          multiplier: '?' as const,
          answer: problem.answer,
        };
    }
  };

  const displayValues = getDisplayValues();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white shadow-md py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            レベル{levelConfig.id}: {levelConfig.title}
          </h1>
          <div className="text-sm text-gray-600">
            問題 {currentIndex + 1} / {problems.length}
          </div>
        </div>
      </header>

      {/* タイマー */}
      <div className="py-6">
        <Timer
          remainingSeconds={timer.remainingSeconds}
          totalSeconds={levelConfig.targetTime}
          isOvertime={timer.isOvertime}
        />
      </div>

      {/* 問題表示 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl w-full">
          {levelConfig.id === 1 && (
            <div className="text-center text-gray-600 mb-6">
              れんしゅうちゅう
            </div>
          )}

          <ProblemDisplay
            multiplicand={displayValues.multiplicand}
            multiplier={displayValues.multiplier}
            answer={displayValues.answer}
            reading={currentProblem.problem.reading}
            showReading={levelConfig.hasReading}
            questionType={currentProblem.questionType}
          />

          {/* 入力欄 */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {showCorrectAnswer ? (
              <div className="text-center">
                <div className="text-5xl font-bold text-red-500 mb-4">
                  {correctAnswer}
                </div>
                <p className="text-gray-600">
                  Enterを押して次の問題へ
                </p>
              </div>
            ) : (
              <NumberInput
                value={userInput}
                onChange={handleInputChange}
                onSubmit={handleKeySubmit}
                autoFocus
              />
            )}
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="p-6 flex justify-end">
        <Button variant="danger" onClick={onQuit}>
          やめる
        </Button>
      </div>
    </div>
  );
};
```

## 🔍 実装手順

1. `src/utils/problemGenerator.ts` を作成
2. `src/hooks/useTimer.ts` を作成
3. `src/components/screens/QuestionScreen.tsx` を作成
4. `App.tsx` で問題画面に遷移できるようにする
5. 各レベルで正しく問題が生成されることを確認
6. タイマーが正しくカウントダウンすることを確認
7. 正解/不正解の判定が正しいことを確認

## ✅ 受け入れ基準

- [ ] レベル設定に応じて正しい問題が生成される
- [ ] ランダムレベルでは問題がシャッフルされる
- [ ] 穴あきチャレンジで3種類の形式がランダムに出題される
- [ ] タイマーがカウントダウンする
- [ ] 目標タイムを過ぎたらマイナス表示になる
- [ ] 正解したら次の問題へ進む
- [ ] 不正解したら正解を赤字で表示する
- [ ] Enterキーで解答送信・次の問題へ進める
- [ ] 全問題終了後に結果画面へ遷移する
- [ ] 「やめる」ボタンでレベル選択画面に戻る

## 🔧 技術的詳細

### 問題生成アルゴリズム
1. レベル設定から範囲を取得
2. 該当範囲の問題をフィルタリング
3. ランダムの場合はシャッフル
4. 2周分を生成

### タイマー実装
- `setInterval` で1秒ごとに更新
- カウントダウン形式（残り時間を表示）
- マイナスになってもカウント継続

### 状態管理
- `problems`: 全問題（生成時に確定）
- `currentIndex`: 現在の問題番号
- `attempts`: 全解答記録
- `timer`: タイマー状態

## ⚠️ 注意事項

1. **メモリリーク防止**: useEffect内でタイマーをクリーンアップ
2. **キーボード操作**: Enterキーで進める
3. **オートフォーカス**: 入力欄に自動フォーカス
4. **不正解時の処理**: ユーザーがEnterを押すまで待つ
5. **問題の重複**: ランダムでも各問題は2回ずつ

## 📊 見積もり工数
**約8〜10時間**
- 問題生成ロジック: 3時間
- タイマー実装: 2時間
- 画面実装: 3〜4時間
- テスト・デバッグ: 2時間

## 🔗 関連ドキュメント
- [React Hooks - useEffect](https://react.dev/reference/react/useEffect)
- [React Hooks - useCallback](https://react.dev/reference/react/useCallback)

## 📎 次のチケットへの引き継ぎ事項
- 解答記録（`AttemptRecord[]`）を結果画面に渡す
- 間違えた問題を抽出して印刷機能で使用
