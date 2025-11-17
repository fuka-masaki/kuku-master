import React from 'react';
import { QuestionType, Reading } from '@/types';

interface ProblemDisplayProps {
  multiplicand: number | '?';
  multiplier: number | '?';
  answer?: number;
  reading?: Reading;
  showReading?: boolean;
  questionType: QuestionType;
  size?: 'small' | 'medium' | 'large';
  highlightPart?: 'multiplicand' | 'multiplier' | 'answer'; // 赤色で強調表示する部分
}

export const ProblemDisplay: React.FC<ProblemDisplayProps> = ({
  multiplicand,
  multiplier,
  answer,
  reading,
  showReading = false,
  questionType: _questionType,
  size = 'large',
  highlightPart,
}) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl', // モバイル最適化
  };

  const readingSize = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-xl', // モバイル最適化：さらに小さく
  };

  const NumberWithReading: React.FC<{
    value: number | '?';
    readingText?: string;
    isHighlighted?: boolean;
  }> = ({ value, readingText, isHighlighted = false }) => (
    <div className="flex flex-col items-center">
      {showReading && readingText && (
        <span className={`${readingSize[size]} mb-0.5 sm:mb-1 ${isHighlighted ? 'text-red-500' : 'text-slate-600'}`}>
          {readingText}
        </span>
      )}
      <span className={`${sizeClasses[size]} font-bold ${isHighlighted ? 'text-red-500' : ''}`}>{value}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-1 xs:gap-2 sm:gap-4 md:gap-6">
      <NumberWithReading
        value={multiplicand}
        readingText={reading?.multiplicand}
        isHighlighted={highlightPart === 'multiplicand'}
      />
      <span className={`${sizeClasses[size]} font-bold text-slate-700`}>×</span>
      <NumberWithReading
        value={multiplier}
        readingText={reading?.multiplier}
        isHighlighted={highlightPart === 'multiplier'}
      />
      <div className="flex flex-col items-center">
        {showReading && reading && (
          <span className={`${readingSize[size]} mb-0.5 sm:mb-1 text-slate-600`}>
            {reading.equals}
          </span>
        )}
        <span className={`${sizeClasses[size]} font-bold text-slate-700`}>=</span>
      </div>
      {answer !== undefined && (
        <NumberWithReading
          value={answer}
          readingText={reading?.answer}
          isHighlighted={highlightPart === 'answer'}
        />
      )}
    </div>
  );
};
