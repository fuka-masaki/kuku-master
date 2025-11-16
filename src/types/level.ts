/**
 * レベルの種類
 */
export type LevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * レベルの設定
 *
 * @example
 * const level: LevelConfig = {
 *   id: 1,
 *   title: "1～5のだん",
 *   description: "じゅんばん・よみあり",
 *   totalQuestions: 90,
 *   questionsPerRound: 45,
 *   timePerQuestion: 3,
 *   totalTime: 270,
 *   targetTime: 240,
 *   hasReading: true,
 *   isRandom: false,
 *   range: { min: 1, max: 5 },
 *   isHoleQuestion: false
 * };
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
