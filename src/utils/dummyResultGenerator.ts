import { LevelConfig, LevelResult, AttemptRecord, ProblemInstance } from '@/types';
import { generateProblems, getCorrectAnswer } from './problemGenerator';
import { createLevelResult } from './resultAnalyzer';

/**
 * ダミー結果のパターン
 */
export type DummyResultPattern =
  | 'perfect'           // 全問正解・タイム達成（合格）
  | 'allCorrect'        // 全問正解・タイムオーバー（不合格）
  | 'fewWrong'          // 数問間違い・タイムオーバー（不合格）
  | 'manyWrong';        // 多くの問題を間違い（不合格）

/**
 * ダミーの解答記録を生成
 */
function createDummyAttempt(
  problemInstance: ProblemInstance,
  isCorrect: boolean,
  baseTime: number
): AttemptRecord {
  const correctAnswer = getCorrectAnswer(problemInstance);
  const userAnswer = isCorrect
    ? correctAnswer
    : (correctAnswer + Math.floor(Math.random() * 5) + 1) % 100; // 間違った答え

  return {
    problemInstance,
    userAnswer,
    isCorrect,
    timestamp: baseTime,
    timeSpent: 1.5 + Math.random() * 2, // 1.5〜3.5秒
  };
}

/**
 * パターンに応じたダミー結果データを生成
 */
export function generateDummyResult(
  levelConfig: LevelConfig,
  pattern: DummyResultPattern
): LevelResult {
  const problems = generateProblems(levelConfig);
  const baseTime = Date.now();
  let attempts: AttemptRecord[] = [];
  let totalTimeSpent = 0;

  switch (pattern) {
    case 'perfect': {
      // 全問正解・タイム達成
      attempts = problems.map((problem) =>
        createDummyAttempt(problem, true, baseTime)
      );
      totalTimeSpent = levelConfig.targetTime - 10; // 目標より10秒早い
      break;
    }

    case 'allCorrect': {
      // 全問正解・タイムオーバー
      attempts = problems.map((problem) =>
        createDummyAttempt(problem, true, baseTime)
      );
      totalTimeSpent = levelConfig.targetTime + 30; // 目標より30秒遅い
      break;
    }

    case 'fewWrong': {
      // 数問間違い（約10%の間違い）
      const wrongCount = Math.ceil(problems.length * 0.1);
      const wrongIndices = new Set<number>();

      // ランダムに間違う問題を選択
      while (wrongIndices.size < wrongCount) {
        wrongIndices.add(Math.floor(Math.random() * problems.length));
      }

      attempts = problems.map((problem, index) =>
        createDummyAttempt(problem, !wrongIndices.has(index), baseTime)
      );
      totalTimeSpent = levelConfig.targetTime + 20;
      break;
    }

    case 'manyWrong': {
      // 多くの問題を間違い（約30%の間違い）
      const wrongCount = Math.ceil(problems.length * 0.3);
      const wrongIndices = new Set<number>();

      // ランダムに間違う問題を選択（一部は2回間違うために重複を追加）
      while (wrongIndices.size < wrongCount) {
        wrongIndices.add(Math.floor(Math.random() * problems.length));
      }

      attempts = problems.map((problem, index) =>
        createDummyAttempt(problem, !wrongIndices.has(index), baseTime)
      );
      totalTimeSpent = levelConfig.targetTime + 60;
      break;
    }
  }

  return createLevelResult(levelConfig, attempts, totalTimeSpent);
}

/**
 * パターンの表示名を取得
 */
export function getPatternDisplayName(pattern: DummyResultPattern): string {
  switch (pattern) {
    case 'perfect':
      return '全問正解・タイム達成（合格）';
    case 'allCorrect':
      return '全問正解・タイムオーバー（不合格）';
    case 'fewWrong':
      return '数問間違い（不合格）';
    case 'manyWrong':
      return '多くの問題を間違い（不合格）';
  }
}
