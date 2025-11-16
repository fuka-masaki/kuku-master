/**
 * 問題の出題形式
 */
export type QuestionType =
  | 'normal'                  // 2 × 4 = ?
  | 'missing_multiplicand'    // ? × 4 = 8
  | 'missing_multiplier';     // 2 × ? = 8

/**
 * 読み仮名
 *
 * @example
 * const reading: Reading = {
 *   multiplicand: "に",
 *   multiplier: "し",
 *   equals: "が",
 *   answer: "はち"
 * };
 */
export interface Reading {
  multiplicand: string;  // 被乗数の読み（例: "に"）
  multiplier: string;    // 乗数の読み（例: "し"）
  equals: string;        // 等号の読み（常に "が"）
  answer: string;        // 答えの読み（例: "はち"）
}

/**
 * 九九の問題データ
 *
 * @example
 * const problem: MultiplicationProblem = {
 *   multiplicand: 2,
 *   multiplier: 4,
 *   answer: 8,
 *   reading: {
 *     multiplicand: "に",
 *     multiplier: "し",
 *     equals: "が",
 *     answer: "はち"
 *   }
 * };
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
 *
 * @example
 * const instance: ProblemInstance = {
 *   problem: { multiplicand: 2, multiplier: 4, answer: 8, reading: {...} },
 *   questionType: 'normal',
 *   index: 0,
 *   roundNumber: 1
 * };
 */
export interface ProblemInstance {
  problem: MultiplicationProblem;
  questionType: QuestionType;
  index: number;         // 全問題中の順番（0始まり）
  roundNumber: 1 | 2;    // 何周目か
}
