import React from 'react';

interface CustomKeyboardProps {
  onNumberClick: (num: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  showNext?: boolean; // 不正解時に「→」を表示
}

export const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
  onNumberClick,
  onClear,
  onSubmit,
  disabled = false,
  showNext = false,
}) => {
  const numbers = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
  ];

  return (
    <div className="custom-keyboard w-full max-w-md mx-auto px-3 xs:px-4">
      {/* 数字ボタン (7-9, 4-6, 1-3) */}
      {numbers.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 xs:gap-3 mb-2 xs:mb-3">
          {row.map((num) => (
            <button
              key={num}
              onClick={() => onNumberClick(num)}
              disabled={disabled}
              className="flex-1 h-12 xs:h-14 sm:h-16 text-2xl xs:text-3xl font-bold bg-white border-2 border-blue-200 text-slate-800 rounded-xl hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {num}
            </button>
          ))}
        </div>
      ))}

      {/* 最下段: クリア、0、決定 */}
      <div className="flex gap-2 xs:gap-3 mb-4 xs:mb-6">
        <button
          onClick={onClear}
          disabled={disabled}
          className="flex-1 h-12 xs:h-14 sm:h-16 text-lg xs:text-xl font-bold bg-slate-100 border-2 border-slate-300 text-slate-600 rounded-xl hover:bg-slate-200 hover:border-slate-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          C
        </button>
        <button
          onClick={() => onNumberClick('0')}
          disabled={disabled}
          className="flex-1 h-12 xs:h-14 sm:h-16 text-2xl xs:text-3xl font-bold bg-white border-2 border-blue-200 text-slate-800 rounded-xl hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          0
        </button>
        <button
          onClick={onSubmit}
          disabled={disabled}
          className={`flex-1 h-12 xs:h-14 sm:h-16 text-xl xs:text-2xl font-bold text-white rounded-xl hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
            showNext
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
          }`}
        >
          {showNext ? '→' : '✓'}
        </button>
      </div>
    </div>
  );
};
