/**
 * 一意のキーを生成するための型
 *
 * @example
 * const key: ProblemKey = "2_4_normal";
 */
export type ProblemKey = string; // 例: "2_4_normal"

/**
 * タイマーの状態
 *
 * @example
 * let timerState: TimerState = 'idle';
 * timerState = 'running';
 */
export type TimerState = 'idle' | 'running' | 'paused' | 'finished';

/**
 * 画面の種類
 *
 * @example
 * let currentScreen: ScreenType = 'level-select';
 */
export type ScreenType = 'level-select' | 'question' | 'result' | 'print';
