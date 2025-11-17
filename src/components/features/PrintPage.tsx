import React from 'react';
import { PrintData, PrintableQuestion } from '@/types';

interface PrintPageProps {
  printData: PrintData;
  pageNumber: number;
  totalPages: number;
  allQuestions?: PrintableQuestion[]; // 全ての問題（答え表示用）
  isAnswerPage?: boolean; // 答え専用ページかどうか
}

export const PrintPage: React.FC<PrintPageProps> = ({
  printData,
  pageNumber,
  totalPages,
  allQuestions,
  isAnswerPage = false,
}) => {
  const { levelTitle, date, accuracy, timeSpent, targetTime, questions } =
    printData;

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === totalPages;

  // 最後のページでは全ての問題の答えを表示
  const questionsForAnswers = allQuestions || questions;
  const allAnswers = questionsForAnswers.map((q) => ({
    number: q.number,
    answer: q.answerValue,
  }));

  // 数字を括弧で囲む形式に統一（2回間違いは二重括弧）
  const getCircledNumber = (num: number, isDoubleWrong: boolean = false): string => {
    return isDoubleWrong ? `((${num}))` : `(${num})`;
  };

  return (
    <div className="print-page bg-white border border-gray-300 shadow-sm mb-8 w-full h-[297mm] mx-auto print:w-full print:max-w-none print:mb-0 print:shadow-none print:border-0 overflow-hidden">

      {/* プレビューと印刷で同じパディングを適用 */}
      <div className="p-[15mm]">
        {/* 答え専用ページの場合 */}
        {isAnswerPage ? (
          <>
            <div className="text-right text-base text-gray-600 mb-3">
              {levelTitle} - {pageNumber}/{totalPages}
            </div>
            <div className="answer-section">
              <h3 className="text-lg font-bold text-center mb-4">【答え】</h3>
              <div className="grid grid-cols-5 gap-3 text-center">
                {allQuestions?.map((q) => (
                  <div key={q.number} className="text-base leading-relaxed">
                    {getCircledNumber(q.number, q.isDoubleWrong)} <span className="font-bold">{q.answerValue}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ヘッダー（1ページ目のみ） */}
            {isFirstPage && (
          <header className="mb-3 pb-2 border-b-2 border-gray-300">
            <h1 className="text-2xl font-bold text-center mb-2">
              九九マスター - {levelTitle} 結果
            </h1>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-base">
              <div>
                <span className="font-semibold">日付:</span> {date}
              </div>
              <div>
                <span className="font-semibold">正答率:</span> {accuracy}%
              </div>
              <div>
                <span className="font-semibold">タイム:</span> {timeSpent}
              </div>
              <div>
                <span className="font-semibold">目標タイム:</span> {targetTime}
              </div>
            </div>
          </header>
        )}

        {/* ページ番号（2ページ目以降） */}
        {!isFirstPage && (
          <div className="text-right text-base text-gray-600 mb-3">
            {levelTitle} (続き) - {pageNumber}/{totalPages}
          </div>
        )}

        {/* メッセージ（1ページ目のみ） */}
        {isFirstPage && (
          <div className="text-center mb-3">
            <p className="text-xl font-bold text-purple-700">
              この九九をおぼえてね！
            </p>
            <p className="text-base text-gray-600 mt-1">
              （((1))のように二重括弧は2回間違えた問題）
            </p>
          </div>
        )}

        {/* 問題一覧 - 2列レイアウト */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-0 relative">
            {/* 中央線 - 擬似要素で配置 */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 -translate-x-1/2"></div>

            {/* 左列 */}
            <div className="space-y-5 pr-6">
              {questions.slice(0, 12).map((q) => {
                const { number, displayText, missingPart, isDoubleWrong } = q;

                return (
                  <div key={number} className="flex items-center gap-3 text-4xl">
                    <span className="font-bold text-gray-700 w-16 text-2xl">
                      {getCircledNumber(number, isDoubleWrong)}
                    </span>
                    <span className="font-semibold text-4xl">
                      {missingPart === 'multiplicand' && (
                        <>
                          <span className="inline-block border-b-2 border-gray-800 w-20 mx-1"></span>
                          {displayText}
                        </>
                      )}
                      {missingPart === 'multiplier' && (
                        <>
                          {displayText.split('×')[0]} ×
                          <span className="inline-block border-b-2 border-gray-800 w-20 mx-1"></span>
                          = {displayText.split('=')[1]}
                        </>
                      )}
                      {missingPart === 'answer' && (
                        <>
                          {displayText}
                          <span className="inline-block border-b-2 border-gray-800 w-20 mx-1"></span>
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 右列 */}
            <div className="space-y-5 pl-6">
              {questions.slice(12, 24).map((q) => {
                const { number, displayText, missingPart, isDoubleWrong } = q;

                return (
                  <div key={number} className="flex items-center gap-3 text-4xl">
                    <span className="font-bold text-gray-700 w-16 text-2xl">
                      {getCircledNumber(number, isDoubleWrong)}
                    </span>
                    <span className="font-semibold text-4xl">
                      {missingPart === 'multiplicand' && (
                        <>
                          <span className="inline-block border-b-2 border-gray-800 w-20 mx-1"></span>
                          {displayText}
                        </>
                      )}
                      {missingPart === 'multiplier' && (
                        <>
                          {displayText.split('×')[0]} ×
                          <span className="inline-block border-b-2 border-gray-800 w-20 mx-1"></span>
                          = {displayText.split('=')[1]}
                        </>
                      )}
                      {missingPart === 'answer' && (
                        <>
                          {displayText}
                          <span className="inline-block border-b-2 border-gray-800 w-20 mx-1"></span>
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

            {/* ページ分割がある場合の続きメッセージ */}
            {!isLastPage && (
              <div className="text-center text-gray-600 mt-4 text-base">
                （続く）
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
