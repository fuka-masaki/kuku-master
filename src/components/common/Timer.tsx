import React from 'react';
import { formatTime } from '@/utils/timeUtils';

interface TimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  isOvertime?: boolean;
  compact?: boolean; // モバイル用コンパクト表示
}

export const Timer: React.FC<TimerProps> = ({
  remainingSeconds,
  totalSeconds,
  isOvertime = false,
  compact = false,
}) => {
  const percentage = Math.max(0, (remainingSeconds / totalSeconds) * 100);

  // 残り時間が少なくなったら色を変える
  const getColorClass = (isCompactMode = false) => {
    if (isOvertime) return 'text-red-600 font-bold animate-pulse';
    if (percentage <= 20) return 'text-red-500 animate-shake';
    if (percentage <= 50) return isCompactMode ? 'text-yellow-300' : 'text-amber-600';
    return isCompactMode ? 'text-white' : 'text-blue-600';
  };

  // プログレスバーの背景色
  const getProgressBarClass = () => {
    if (isOvertime) return 'bg-red-500 animate-pulse';
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 50) return 'bg-amber-500';
    return 'bg-gradient-to-r from-blue-500 to-sky-400';
  };

  // コンパクト版（モバイル用）
  if (compact) {
    return (
      <div className="flex items-center gap-1 xs:gap-1.5 flex-1">
        <span className="text-sm xs:text-base">⏱</span>
        <div className={`text-xs xs:text-sm font-bold transition-all ${getColorClass(true)}`}>
          {isOvertime && '+'}{formatTime(Math.abs(remainingSeconds))}
        </div>
        <div className="flex-1 max-w-[48px] xs:max-w-[64px] h-1 xs:h-1.5 bg-blue-900/30 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${getProgressBarClass()}`}
            style={{ width: `${isOvertime ? 100 : percentage}%` }}
          />
        </div>
      </div>
    );
  }

  // 通常版（デスクトップ用）
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`timer-display text-3xl md:text-4xl font-bold transition-all ${getColorClass(false)}`}>
        {isOvertime && '+'}{formatTime(Math.abs(remainingSeconds))}
      </div>
      <div className="w-full max-w-md h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`
            h-full transition-all duration-1000 rounded-full
            ${getProgressBarClass()}
          `}
          style={{ width: `${isOvertime ? 100 : percentage}%` }}
        />
      </div>
      <div className="text-sm text-slate-600">
        目標タイム: {formatTime(totalSeconds)}
      </div>
    </div>
  );
};
