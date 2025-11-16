import { QuestionType, LevelId } from './';

/**
 * LevelIdの型ガード
 *
 * @param value - 検証する値
 * @returns 値がLevelId型であればtrue
 *
 * @example
 * if (isValidLevelId(1)) {
 *   console.log('Valid level ID');
 * }
 */
export function isValidLevelId(value: unknown): value is LevelId {
  return typeof value === 'number' && value >= 1 && value <= 7;
}

/**
 * QuestionTypeの型ガード
 *
 * @param value - 検証する値
 * @returns 値がQuestionType型であればtrue
 *
 * @example
 * if (isValidQuestionType('normal')) {
 *   console.log('Valid question type');
 * }
 */
export function isValidQuestionType(value: unknown): value is QuestionType {
  return (
    value === 'normal' ||
    value === 'missing_multiplicand' ||
    value === 'missing_multiplier'
  );
}
