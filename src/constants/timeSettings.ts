/**
 * タイム設定に関する定数
 */

/**
 * バッファ時間（秒）
 * 全レベル共通で、計算された基本時間に加算される余裕時間
 *
 * targetTime = (totalQuestions × timePerQuestion) + BUFFER_TIME
 */
export const BUFFER_TIME = 30;
