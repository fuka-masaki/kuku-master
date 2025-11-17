import React, { useEffect } from 'react';
import { PrintData } from '@/types';
import { Button } from '@/components/common';
import { PrintPage } from '@/components/features/PrintPage';

interface PrintPreviewScreenProps {
  printData: PrintData;
  onClose: () => void;
}

export const PrintPreviewScreen: React.FC<PrintPreviewScreenProps> = ({
  printData,
  onClose,
}) => {
  const QUESTIONS_PER_PAGE = 24; // 2列レイアウトで最大24問（1列12問×2）
  const { questions } = printData;

  const handlePrint = () => {
    // タイトルを一時的に空にしてブラウザのヘッダーに表示される文字を消す
    const originalTitle = document.title;
    document.title = '';

    window.print();

    // 印刷後に元のタイトルに戻す
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  // 印刷用のスタイルを追加
  useEffect(() => {
    document.body.classList.add('print-preview');
    return () => {
      document.body.classList.remove('print-preview');
    };
  }, []);

  // ページごとに問題を分割（答えページを除く）
  const questionPageCount = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const pages = Array.from({ length: questionPageCount }, (_, pageIndex) => {
    const start = pageIndex * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return questions.slice(start, end);
  });

  // 答え専用ページを追加
  const totalPagesWithAnswer = questionPageCount + 1;

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white print:p-0">
      {/* 印刷プレビューヘッダー（印刷時は非表示） */}
      <div className="no-print sticky top-0 z-10 bg-white shadow-lg py-3 px-6 mb-8">
        <div className="max-w-[210mm] mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold">印刷プレビュー</h1>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose}>
                戻る
              </Button>
              <Button variant="primary" onClick={handlePrint}>
                印刷する
              </Button>
            </div>
          </div>
          {/* 印刷時の注意書き */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 text-xs">
            <p className="font-semibold text-yellow-800 mb-0.5">📌 印刷時の注意</p>
            <p className="text-yellow-700">
              印刷ダイアログで「ヘッダーとフッター」のチェックを<span className="font-bold">外して</span>ください。
            </p>
          </div>
        </div>
      </div>

      {/* 印刷ページ - A4サイズで表示 */}
      <div className="max-w-[210mm] mx-auto px-4 pb-12 print:p-0 print:m-0 print:max-w-none">
        {/* 問題ページ */}
        {pages.map((pageQuestions, pageIndex) => (
          <PrintPage
            key={pageIndex}
            printData={{
              ...printData,
              questions: pageQuestions,
            }}
            pageNumber={pageIndex + 1}
            totalPages={totalPagesWithAnswer}
            allQuestions={questions}
          />
        ))}

        {/* 答え専用ページ */}
        <PrintPage
          key="answer-page"
          printData={{
            ...printData,
            questions: [], // 問題は表示しない
          }}
          pageNumber={totalPagesWithAnswer}
          totalPages={totalPagesWithAnswer}
          allQuestions={questions}
          isAnswerPage={true} // 答え専用ページフラグ
        />
      </div>
    </div>
  );
};
