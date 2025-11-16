import { ProblemInstance, QuestionType, MultiplicationProblem } from './problem';

/**
 * ユーザーの解答記録
 *
 * @example
 * const record: AttemptRecord = {
 *   problemInstance: { ... },
 *   userAnswer: 8,
 *   isCorrect: true,
 *   timestamp: 1700000000000,
 *   timeSpent: 2.5
 * };
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
 *
 * @example
 * const wrongAnswer: WrongAnswerRecord = {
 *   problem: { multiplicand: 2, multiplier: 4, answer: 8, reading: {...} },
 *   questionType: 'normal',
 *   wrongCount: 1,
 *   attempts: [...]
 * };
 */
export interface WrongAnswerRecord {
  problem: MultiplicationProblem;
  questionType: QuestionType;
  wrongCount: 1 | 2;         // 間違えた回数（1回 or 2回）
  attempts: AttemptRecord[]; // 実際の解答記録
}
