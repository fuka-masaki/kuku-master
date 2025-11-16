# TICKET-008: 印刷機能の実装

## 📋 概要
間違えた問題を穴埋め形式で印刷できる機能を実装する。B5サイズで印刷可能にし、問題が多い場合は複数ページに分割する。

## 🎯 目的
ユーザーが間違えた問題を紙に印刷し、手書きで復習できるようにする。

## 📦 依存チケット
- **TICKET-001**: プロジェクトセットアップ（必須）
- **TICKET-002**: 型定義とデータ構造の設計（必須）
- **TICKET-004**: 共通コンポーネントの実装（必須）
- **TICKET-007**: 結果表示画面の実装（必須）

## 📝 詳細要件

### 1. 印刷データ生成ユーティリティ

#### `src/utils/printDataGenerator.ts`
```typescript
import {
  WrongAnswerRecord,
  PrintableQuestion,
  PrintData,
  LevelResult,
  LevelConfig,
} from '@/types';
import { formatTimeJapanese } from './timeUtils';

const QUESTIONS_PER_PAGE = 15;

/**
 * 印刷用の問題データを生成
 */
export function generatePrintableQuestions(
  wrongAnswers: WrongAnswerRecord[]
): PrintableQuestion[] {
  return wrongAnswers.map((record, index) => {
    const { problem, questionType, wrongCount } = record;

    let displayText = '';
    let answerValue = 0;
    let missingPart: 'answer' | 'multiplicand' | 'multiplier' = 'answer';

    switch (questionType) {
      case 'normal':
        displayText = `${problem.multiplicand} × ${problem.multiplier} = `;
        answerValue = problem.answer;
        missingPart = 'answer';
        break;
      case 'missing_multiplicand':
        displayText = `× ${problem.multiplier} = ${problem.answer}`;
        answerValue = problem.multiplicand;
        missingPart = 'multiplicand';
        break;
      case 'missing_multiplier':
        displayText = `${problem.multiplicand} × = ${problem.answer}`;
        answerValue = problem.multiplier;
        missingPart = 'multiplier';
        break;
    }

    return {
      number: index + 1,
      problem,
      questionType,
      isDoubleWrong: wrongCount === 2,
      displayText,
      answerValue,
      missingPart,
    };
  });
}

/**
 * 印刷データを生成
 */
export function generatePrintData(
  levelConfig: LevelConfig,
  result: LevelResult
): PrintData {
  const questions = generatePrintableQuestions(result.wrongAnswerRecords);
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  return {
    levelId: levelConfig.id,
    levelTitle: `レベル${levelConfig.id}: ${levelConfig.title}`,
    date: new Date(result.date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    accuracy: result.accuracy,
    timeSpent: formatTimeJapanese(result.totalTimeSpent),
    targetTime: formatTimeJapanese(result.targetTime),
    questions,
    totalPages,
  };
}
```

### 2. 印刷プレビュー画面コンポーネント

#### `src/components/screens/PrintPreviewScreen.tsx`
```typescript
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
  const QUESTIONS_PER_PAGE = 15;
  const { questions, totalPages } = printData;

  const handlePrint = () => {
    window.print();
  };

  // 印刷用のスタイルを追加
  useEffect(() => {
    document.body.classList.add('print-preview');
    return () => {
      document.body.classList.remove('print-preview');
    };
  }, []);

  // ページごとに問題を分割
  const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const start = pageIndex * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return questions.slice(start, end);
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 印刷プレビューヘッダー（印刷時は非表示） */}
      <div className="no-print bg-white shadow-md py-4 px-6 mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">印刷プレビュー</h1>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={onClose}>
              戻る
            </Button>
            <Button variant="primary" onClick={handlePrint}>
              印刷する
            </Button>
          </div>
        </div>
      </div>

      {/* 印刷ページ */}
      <div className="container mx-auto px-4 pb-8">
        {pages.map((pageQuestions, pageIndex) => (
          <PrintPage
            key={pageIndex}
            printData={{
              ...printData,
              questions: pageQuestions,
            }}
            pageNumber={pageIndex + 1}
            totalPages={totalPages}
          />
        ))}
      </div>
    </div>
  );
};
```

### 3. 印刷ページコンポーネント

#### `src/components/features/PrintPage.tsx`
```typescript
import React from 'react';
import { PrintData, PrintableQuestion } from '@/types';

interface PrintPageProps {
  printData: PrintData;
  pageNumber: number;
  totalPages: number;
}

export const PrintPage: React.FC<PrintPageProps> = ({
  printData,
  pageNumber,
  totalPages,
}) => {
  const { levelTitle, date, accuracy, timeSpent, targetTime, questions } =
    printData;

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === totalPages;

  // 答えを生成
  const answers = questions.map((q) => ({
    number: q.number,
    answer: q.answerValue,
  }));

  // 数字の丸囲み
  const getCircledNumber = (num: number): string => {
    if (num <= 20) {
      return String.fromCharCode(9311 + num); // ①②③...
    }
    return `(${num})`;
  };

  return (
    <div className="print-page bg-white shadow-lg mb-6 mx-auto" style={{ width: '182mm', minHeight: '257mm' }}>
      <div className="p-8">
        {/* ヘッダー（1ページ目のみ） */}
        {isFirstPage && (
          <header className="mb-6 pb-4 border-b-2 border-gray-300">
            <h1 className="text-2xl font-bold text-center mb-4">
              九九マスター - {levelTitle} 結果
            </h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
          <div className="text-right text-sm text-gray-600 mb-4">
            {levelTitle} (続き) - {pageNumber}/{totalPages}
          </div>
        )}

        {/* メッセージ */}
        <div className="text-center mb-6">
          <p className="text-xl font-bold text-purple-700">
            💡 この九九をおぼえてね！
          </p>
          <p className="text-sm text-gray-600 mt-1">
            （⭐は2回間違えた問題）
          </p>
        </div>

        {/* 問題一覧 */}
        <div className="mb-8">
          <div className="space-y-4">
            {questions.map((q) => {
              const { number, displayText, missingPart, isDoubleWrong } = q;

              return (
                <div key={number} className="flex items-center gap-3 text-lg">
                  <span className="font-bold text-gray-700 w-8">
                    {getCircledNumber(number)}
                  </span>
                  {isDoubleWrong && <span className="text-xl">⭐</span>}
                  <span className="font-semibold">
                    {missingPart === 'multiplicand' && (
                      <>
                        <span className="inline-block border-b-2 border-gray-800 w-16 mx-1"></span>
                        {displayText}
                      </>
                    )}
                    {missingPart === 'multiplier' && (
                      <>
                        {displayText.split('×')[0]} ×
                        <span className="inline-block border-b-2 border-gray-800 w-16 mx-1"></span>
                        = {displayText.split('=')[1]}
                      </>
                    )}
                    {missingPart === 'answer' && (
                      <>
                        {displayText}
                        <span className="inline-block border-b-2 border-gray-800 w-16 mx-1"></span>
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ページ分割がある場合の続きメッセージ */}
        {!isLastPage && (
          <div className="text-center text-gray-600 mt-8">
            （続く）
          </div>
        )}

        {/* 答え（最後のページのみ） */}
        {isLastPage && (
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <h3 className="text-lg font-bold text-center mb-4">【答え】</h3>
            <div className="grid grid-cols-5 gap-4 text-center">
              {answers.map((a) => (
                <div key={a.number} className="text-base">
                  {getCircledNumber(a.number)} <span className="font-bold">{a.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* フッター */}
        {isLastPage && (
          <footer className="mt-8 text-center">
            <p className="text-lg font-semibold text-purple-700">
              がんばって覚えよう！
            </p>
          </footer>
        )}
      </div>
    </div>
  );
};
```

### 4. 印刷用CSS

#### `src/styles/print.css`
```css
/* 印刷用スタイル */
@media print {
  /* 不要な要素を非表示 */
  .no-print {
    display: none !important;
  }

  /* ページサイズをB5に設定 */
  @page {
    size: B5;
    margin: 15mm;
  }

  /* ページ区切り */
  .print-page {
    page-break-after: always;
    page-break-inside: avoid;
    box-shadow: none !important;
    margin: 0 !important;
  }

  .print-page:last-child {
    page-break-after: auto;
  }

  /* 背景色を印刷 */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* 影を削除 */
  .shadow-lg,
  .shadow-xl {
    box-shadow: none !important;
  }
}

/* プレビュー時のスタイル */
.print-page {
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 5. CSSのインポート

#### `src/main.tsx`
```typescript
import './styles/print.css';
```

## 🔍 実装手順

1. `src/styles/print.css` を作成
2. `src/utils/printDataGenerator.ts` を作成
3. `src/components/features/PrintPage.tsx` を作成
4. `src/components/screens/PrintPreviewScreen.tsx` を作成
5. `ResultScreen` に印刷ボタンを追加
6. 印刷プレビューを表示
7. ブラウザの印刷機能で実際に印刷テスト

## ✅ 受け入れ基準

- [ ] 「印刷する」ボタンをクリックすると印刷プレビューが表示される
- [ ] ヘッダーにレベル、日付、正答率、タイムが表示される
- [ ] 間違えた問題が穴埋め形式で表示される
- [ ] 2回間違えた問題に⭐マークが付く
- [ ] 問題が15問を超える場合、複数ページに分割される
- [ ] 最後のページに答えが表示される
- [ ] ブラウザの印刷機能でB5サイズで印刷できる
- [ ] 印刷プレビューのヘッダーは印刷されない
- [ ] 穴埋め部分が手書きできるスペースになっている

## 🔧 技術的詳細

### B5サイズ
- 幅: 182mm
- 高さ: 257mm

### ページ分割
- 1ページあたり最大15問
- `page-break-after: always` でページ区切り

### 丸数字
- Unicode文字を使用（①②③...）
- 21以降は (21)(22)... 形式

## ⚠️ 注意事項

1. **ブラウザ互換性**: Chrome、Safari、Edgeで印刷テスト
2. **用紙サイズ**: B5が選択できない場合の対処
3. **色の印刷**: `print-color-adjust: exact` で色を保持
4. **ページ区切り**: 問題の途中で切れないようにする
5. **空白スペース**: 手書きしやすい十分なスペースを確保

## 📊 見積もり工数
**約5〜6時間**

## 🔗 関連ドキュメント
- [MDN - @page](https://developer.mozilla.org/en-US/docs/Web/CSS/@page)
- [MDN - print-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust)

## 📎 次のチケットへの引き継ぎ事項
- 印刷機能は完成
- アニメーションの実装に進む（TICKET-009）
