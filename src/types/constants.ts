/**
 * アニメーション種類
 *
 * @example
 * const animationType: AnimationType = 'correct';
 */
export type AnimationType =
  | 'correct'      // 正解時
  | 'incorrect'    // 不正解時
  | 'levelClear'   // レベルクリア時
  | 'timeUp';      // タイムアップ時
