import React from 'react';
import { LevelConfig } from '@/types';
import { formatTime } from '@/utils/timeUtils';

interface LevelCardProps {
  config: LevelConfig;
  onClick: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({ config, onClick }) => {
  const { id, title, description, totalQuestions, targetTime } = config;

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 sm:p-6 min-h-[100px] sm:min-h-[120px] bg-white rounded-xl shadow-md
        transition-transform duration-200 ease-out
        hover:shadow-lg hover:-translate-y-1 active:scale-98
        border-2 border-blue-100 hover:border-blue-300
      `}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-sky-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-md">
            {id}
          </div>
          <div className="text-left">
            <h3 className="text-base sm:text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-600">{description}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs sm:text-sm text-slate-600 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200">
        <span>問題数: {totalQuestions}問</span>
        <span>目標: {formatTime(targetTime)}</span>
      </div>
    </button>
  );
};
