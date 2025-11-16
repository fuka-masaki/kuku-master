import { QuestionType, MultiplicationProblem } from './problem';
import { LevelId } from './level';

/**
 * 印刷用の問題データ
 *
 * @example
 * const question: PrintableQuestion = {
 *   number: 1,
 *   problem: { multiplicand: 2, multiplier: 4, answer: 8, reading: {...} },
 *   questionType: 'normal',
 *   isDoubleWrong: false,
 *   displayText: "2 × 4 = ",
 *   answerValue: 8,
 *   missingPart: 'answer'
 * };
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
 *
 * @example
 * const printData: PrintData = {
 *   levelId: 1,
 *   levelTitle: "1～5のだん",
 *   date: "2025年11月16日",
 *   accuracy: 92,
 *   timeSpent: "4分45秒",
 *   targetTime: "4分30秒",
 *   questions: [...],
 *   totalPages: 2
 * };
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
